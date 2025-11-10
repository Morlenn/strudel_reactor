import { parse } from 'acorn';

// TODO: Sort node processing so some nodes are process
export default class TuneProcessor {

    // static trackedExpressions = [ 'setcps', 'setcpm' ];
    static sliders = ['gain', 'distort', 'room', 'roomsize', 'delay', 'coarse', 'phaser', 'crush'];

    static init(props) {
        this.globalEditor = props.globalEditor;
        this.updateCode = props.updateCode
    }

    static createControlDeckConfig() {
        let controlDeckObjects = TuneProcessor.processInputString(this.globalEditor.code);
        let controlDeckConfig = {
            sliders: [],
            sounds: [],
            variables: [],
            updateCode: this.updateCode,
            globalEditor: this.globalEditor
        }

        // Create slider configs.
        TuneProcessor.sliders.map((slider) => {
            let sliderRegx = new RegExp(`\\.${slider}\\((\\d*\\.?\\d+)(?: *\\* *\\d*\\.?\\d+)?\\)`, 'g');
            let matches = [...this.globalEditor.code.matchAll(sliderRegx)];
            console.log(matches)
            if (matches.length) {
                controlDeckConfig.sliders.push({
                    label: slider.charAt(0).toUpperCase() + slider.slice(1),
                    disabled: true,
                    vertical: true,
                    onChange: (newValue) => {
                        this.updateCode(this.globalEditor.code.replaceAll(sliderRegx, 
                            (match, value) => `.${slider}(${value} * ${newValue})`));
                    },
                    toggle: {
                        bsPrefix: 'btn btn-danger glow-small',
                        size: 'sm',
                        onChange: (enabled, sliderValue) => {
                            // Disabled code.
                            if (!enabled) {
                                this.updateCode(this.globalEditor.code.replaceAll(sliderRegx, 
                                    (match, value) => `.${slider}(${value} * ${sliderValue})`));
                            } else {
                                // Enable code.
                                this.updateCode(this.globalEditor.code.replaceAll(sliderRegx, 
                                    (match, value) => `.${slider}(${value} * 1)`));
                            }
                        }
                    }
                });
            }
            return {};
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
        // Add logging for visualiser if needed
        if (!input.match(/all\(x => x.log\(\)\)/)) {
            input = input.concat('\nall(x => x.log())');
        }
        return input.trimStart();
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