import { parse } from 'acorn';

/**
 * Handles pre-processing and processing of tracks.
 * Generates ControlDeck configs for dynamic element generation.
 */
export default class TuneProcessor {
    static sliders = ['gain', 'distort', 'room', 'roomsize', 'delay', 'coarse', 'phaser', 'crush']; // list of sliders the config can generate.
    static configCounter = 0; // Used as a unique key.

    /** initialise with globalEditor and updateCode function */
    static init(props) {
        this.globalEditor = props.globalEditor;
        this.updateCode = props.updateCode
    }

    /** Builds a config object for ControlDeck component, based on results of strinf processing */
    static createControlDeckConfig() {
        // Process track.
        let controlDeckObjects = TuneProcessor.processInputString(this.globalEditor.code);
        let controlDeckConfig = {
            configID: TuneProcessor.configCounter,
            sliders: [],
            sounds: [],
            variables: [],
            updateCode: this.updateCode,
            globalEditor: this.globalEditor
        }

        // Create a slider for CPM or CPS
        let cycleLabel;
        if (this.globalEditor.code.match(`setcpm\\((.*)\\)`)) {
            cycleLabel = 'cpm';
        } else if (this.globalEditor.code.match(`setcps\\((.*)\\)`)) {
            cycleLabel = 'cps';
        }
        
        // Find a match for setcpm/setcps.
        let cycleRegex = new RegExp(`set${cycleLabel}\\(([^*]+?)(?: *\\* *\\d*\\.?\\d+)?\\)`, 'g');
        let cycleMatch = this.globalEditor.code.match(cycleRegex);

        if (cycleMatch) {

            // Create a slider config.
            controlDeckConfig.sliders.push({
                    label: cycleLabel.toUpperCase(),
                    disabled: true,
                    vertical: true,
                    onChange: (newValue) => {
                        // Update to include new modifier.
                        this.updateCode(this.globalEditor.code.replace(cycleRegex, 
                            (match, value) => `set${cycleLabel}(${value} * ${newValue})`));
                    },

                    // config for toggle button
                    toggle: {
                        bsPrefix: 'btn btn-danger glow-small',
                        size: 'sm',
                        onChange: (enabled, sliderValue) => {
                            if (!enabled) {
                                // update to append modifer: i.e: setcps(30 * 0.5)
                                this.updateCode(this.globalEditor.code.replace(cycleRegex, 
                                    (match, value) => `set${cycleLabel}(${value} * ${sliderValue})`));
                            } else {
                                // set to default value.
                                this.updateCode(this.globalEditor.code.replace(cycleRegex, 
                                    (match, value) => `set${cycleLabel}(${value})`));
                            }
                        }
                    }
                });
        }

        // Create dynamic slider configs based of sliders list.
        TuneProcessor.sliders.map((slider) => {

            // Find a match for slider.
            let sliderRegx = new RegExp(`\\.${slider}\\((\\d*\\.?\\d+)(?: *\\* *\\d*\\.?\\d+)?\\)`, 'g');
            let matches = [...this.globalEditor.code.matchAll(sliderRegx)];
            
            if (matches.length) {

                // Create a slider config.
                controlDeckConfig.sliders.push({
                    label: slider.charAt(0).toUpperCase() + slider.slice(1),
                    disabled: true,
                    vertical: true,
                    onChange: (newValue) => {
                        // Update to include new modifier.
                        this.updateCode(this.globalEditor.code.replaceAll(sliderRegx, 
                            (match, value) => `.${slider}(${value} * ${newValue})`));
                    },

                    // config for toggle button
                    toggle: {
                        bsPrefix: 'btn btn-danger glow-small',
                        size: 'sm',
                        onChange: (enabled, sliderValue) => {
                            if (!enabled) {
                                // update to append modifer: i.e: gain(0.6 * 0.5)
                                this.updateCode(this.globalEditor.code.replaceAll(sliderRegx, 
                                    (match, value) => `.${slider}(${value} * ${sliderValue})`));
                            } else {
                                // set to default value.
                                this.updateCode(this.globalEditor.code.replaceAll(sliderRegx, 
                                    (match, value) => `.${slider}(${value})`));
                            }
                        }
                    }
                });
            }
            return {};
        })
  
        // Create sound toggle button configs.
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

        TuneProcessor.configCounter++;
        return controlDeckConfig;
    }

    /**
     * Removes leading white space and appends CPS and logging functions if required.
     * @param {string} input passed track
     * @returns 
     */
    static preProcessString(input) {
        
        // set a default CPS for slider, if not already present.
        if (!input.match(`setcpm\\((.*)\\)`) && !input.match(`setcps\\((.*)\\)`)) {
            input = input.concat('\nsetcpm(30)');
        } 

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
        let variableLookup = [];

        // Code 'insperation' gained from: https://codeberg.org/uzu/strudel/src/branch/main/packages/transpiler/transpiler.mjs
        // Parses track and builds nodes in a tree sructure to manipulate.
        const ast = parse(input, {
            ecmaVersion: 'latest',
            locations: true 
        })
        
        
        ast.body.forEach((node) => {
            // Labeled sounds.
            if (node.type === 'LabeledStatement') {
                console.log(node)
                controlDeckObjects.sounds.push({ label: node.label.name, start: node.start, end: node.end})
            }
            // Tracked variables.
            if (node.type === 'VariableDeclaration') {
                // Store in array to check later.
                variableLookup.push(node);
            }
        });

        // Attempt to find declared variables and what they control.
        // i.e: match pattern with gain_patterns array.
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