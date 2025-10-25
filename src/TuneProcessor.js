import { parse } from 'acorn';

export default class TuneProcessor {

    static trackedExpressions = [ 'setcps', 'setcpm' ];
    static sliders = ['gain', 'distort', 'room', 'delay', 'coarse', 'phaser'];

    static init(props) {
        this.globalEditor = props.globalEditor;
        this.updateCode = props.updateCode
    }

    static createControlDeckConfig() {
        let controlDeckObjects = TuneProcessor.processInputString(this.globalEditor.code);
        let controlDeckConfig = {
            inputs: [],
            sliders: [],
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

        // Create slider configs.
        controlDeckConfig.sliders = TuneProcessor.sliders.map((slider) => {
            return {
                label: slider.charAt(0).toUpperCase() + slider.slice(1),
                disabled: true,
                vertical: true,
                onChange: (oldValue, newValue) => {
                    this.updateCode(this.globalEditor.code.replace(`all(x => x.${slider}(${oldValue}))`, `all(x => x.${slider}(${newValue}))`));
                },
                toggle: {
                    size: 'sm',
                    onChange: () => {
                        // Pattern matches global control.
                        let gainRegex = `all\\(x => x\\.${slider}\\([0-9]*[.]?[0-9]+\\)\\)`;
                        let match = this.globalEditor.code.match(`//${gainRegex}`);

                        // Disabled code.
                        if (match) {
                            this.updateCode(this.globalEditor.code.replace(match[0], `${match[0].slice(2)}`)); 
                        } else {
                            // Enable code.
                            let match = this.globalEditor.code.match(gainRegex);
                            if (match) {
                                this.updateCode(this.globalEditor.code.replace(match[0], `//${match[0]}`)); 
                            }
                        }
                    }
                }
            }
        })
  
        // Create sound toggle configs.
        controlDeckConfig.sounds = controlDeckObjects.sounds.map((sound) => {
                return {
                            label: sound.label,
                            defaultChecked: true,
                            onChange: (isActive) => {
                                if (isActive) {
                                    // Add underscore to hush.
                                    this.updateCode(this.globalEditor.code.replace(`${sound.label}:`, `_${sound.label}:`));

                                } else {
                                    // Remove underscore to unmute.
                                    this.updateCode(this.globalEditor.code.replace(`_${sound.label}:`, `${sound.label}:`));
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
                start: variable.start,
                end: variable.end
            };
        });
        return controlDeckConfig;
    }

    static preProcessString(input) {
        TuneProcessor.sliders.forEach((slider) => {
            if (!input.match(`all\\([\\s\\S]*.${slider}\\(\\d.*\\)`)) {
                input = input.concat(`\n//all(x => x.${slider}(1))`);
            }
        });
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
                if (TuneProcessor.trackedExpressions.includes(callName)) {
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