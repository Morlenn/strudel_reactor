import { transpiler } from '@strudel/transpiler';
import { parse } from 'acorn';

export default class Song {

    cycles = '0.5';
    pattern = '0';
    bass = '0';
    sounds = [];
    variables = [];
    controls = {};

    constructor(props) {
        this.repl = props.repl;
        this.code = props.code;
        this.transpiledCode = transpiler(props.code).output
        this.ProcessInputString(props.code)
    }

    ProcessInputString(input) {
        // Code 'insperation' gained from: https://codeberg.org/uzu/strudel/src/branch/main/packages/transpiler/transpiler.mjs
        const ast = parse(input, {
            ecmaVersion: 'latest',
            locations: true 
        })
        
        let variableLookup = [];
        ast.body.forEach((node) => {
            // Process controls such as: setcps, gain
            if (node.type === 'ExpressionStatement' && node.expression.callee.name !== 'samples' ) {
                // console.log(node)
            }
            // Labeled sounds.
            if (node.type === 'LabeledStatement') {
                this.sounds.push({ label: node.label.name, start: node.start, end: node.end})
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
            let result = this.transpiledCode.match(pickRegex);
            
            if (result) {
                let matchedVariableName = result[1];
                // Find a node matching result.
                let matchingNode = variableLookup.find((lookup) => lookup.declarations[0].id.name === matchedVariableName)
                let matchedArrayLength = matchingNode.declarations[0].init.elements.length
                this.variables.push({ label: variableName, start: node.declarations[0].init.start, end: node.declarations[0].init.end, controls: matchedVariableName, length: matchedArrayLength});
            }
        });
    }
}