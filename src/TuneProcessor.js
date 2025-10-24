import { parse } from 'acorn';

export default class TuneProcessor {

    static init(props) {
        this.globalEditor = props.globalEditor;
        this.updateCode = props.updateCode
        this.trackedExpressions = [ 'setcps', 'setcpm' ];
    }

    static createControlDeckConfig() {
        let controlDeckObjects = TuneProcessor.processInputString(this.globalEditor.code);
        let controlDeckConfig = {
            inputs: [],
            sounds: [],
            variables: [],
            updateCode: this.updateCode,
            globalEditor: this.globalEditor
        }

        // Create global input configs.
        controlDeckConfig.inputs = controlDeckObjects.controls.map((control) => {
            return {
                value: control.value,
                label: control.label,
                onChange: (currentValue, newValue) => {
                    this.updateCode(this.globalEditor.code.replace(`${control.label}(${currentValue})`, `${control.label}(${newValue})`));
                }
            };
        })
  
        // Create sound toggle configs.
        controlDeckConfig.sounds = controlDeckObjects.sounds.map((sound) => {
                return {
                            label: sound.label,
                            defaultChecked: true,
                            onChange: (isChecked) => {
                                if (isChecked) {
                                    // Remove underscore.
                                    this.updateCode(this.globalEditor.code.replace(`_${sound.label}:`, `${sound.label}:`));

                                } else {
                                    // Add underscore.
                                    this.updateCode(this.globalEditor.code.replace(`${sound.label}:`, `_${sound.label}:`));
                                }
                            }
                }
        });

        // Create togglegroup configs.
        controlDeckConfig.variables = controlDeckObjects.variables.map((variable) => {
            let buttons = [];
            for (let i = 0; i < variable.length; i++) {
                buttons.push({ bsPrefix: 'btn-check', label: `${i+1}` })
            }
            return {
                label: variable.label,
                buttons: buttons,
                onChange: (value) => {
                    this.updateCode(this.globalEditor.code.slice(0, variable.start) + value + this.globalEditor.code.slice(variable.end));
                }
            };
        });
        console.log(controlDeckConfig)
        return controlDeckConfig;
    }

    static preProcessString(input) {
        if (input.match(/gain\(\d.*\)/))
        if (!input.match(/all\([\s\S]*.gain\(\d.*\)/)) {
            input = input.concat('\n//all(x => x.gain(1))');
        }
        return input;
    }

    static processInputString(input) {
        let controlDeckObjects = {
            sounds: [],
            variables: [],
            controls: []
        }
        // Code 'insperation' gained from: https://codeberg.org/uzu/strudel/src/branch/main/packages/transpiler/transpiler.mjs
        const ast = parse(input, {
            ecmaVersion: 'latest',
            locations: true 
        })
        
        let variableLookup = [];
        ast.body.forEach((node) => {
            // Process controls such as: setcps, gain
            if (node.type === 'ExpressionStatement') {
                let callName = node.expression.callee.name;
                if (this.trackedExpressions.includes(callName)) {
                    let fullMatchedString = this.globalEditor.code.slice(node.start, node.end)
                    let controlValue = (fullMatchedString) ? this.globalEditor.code.match('\\((.*)\\)') : '';
                    if (controlValue) {
                        controlDeckObjects.controls.push({ label: callName, start: node.start, end: node.end, value: controlValue[1] })
                    }
                }
            }
            // Labeled sounds.
            if (node.type === 'LabeledStatement') {
                controlDeckObjects.sounds.push({ label: node.label.name, start: node.start, end: node.end})
            }
            // Tracked variables.
            if (node.type === 'VariableDeclaration') {
                // Store in array to check later.
                variableLookup.push(node);
            }
        });

        // Attempt to find declared variables and what they control.
        variableLookup.forEach((node) => {
            let variableName = node.declarations[0].id.name;
            // Attempt to find matching pick array.
            let pickRegex = new RegExp(
            `pick\\s*\\(\\s*([a-zA-Z0-9_]+)\\s*,\\s*${variableName}\\s*\\)`
            );
            let result = this.globalEditor.code.match(pickRegex);
            
            if (result) {
                let matchedVariableName = result[1];
                // Find a node matching result.
                let matchingNode = variableLookup.find((lookup) => lookup.declarations[0].id.name === matchedVariableName)
                let matchedArrayLength = matchingNode.declarations[0].init.elements.length
                controlDeckObjects.variables.push({ label: variableName, start: node.declarations[0].init.start, end: node.declarations[0].init.end, controls: matchedVariableName, length: matchedArrayLength});
            }
        });

        return controlDeckObjects;
    }
}