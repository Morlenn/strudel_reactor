import { parse } from 'acorn';

export default class Song {

    cycles = '0.5';
    pattern = '0';
    bass = '0';
    sounds = [];
    controls = {};

    constructor(props) {
        this.repl = props.repl;
        this.code = props.code;
        this.ProcessInputString(props.code)
    }

    ProcessInputString(input) {
        // Code 'insperation' gained from: https://codeberg.org/uzu/strudel/src/branch/main/packages/transpiler/transpiler.mjs
        const ast = parse(input, {
            ecmaVersion: 'latest',
            locations: true 
        })
        
        ast.body.forEach((node) => {
            // Process controls such as: setcps, gain
            if (node.type === 'ExpressionStatement' && node.expression.callee.name !== 'samples' ) {
                console.log(node)
            }
            // Labeled sounds.
            if (node.type === 'LabeledStatement') {
                this.sounds.push({ label: node.label.name, start: node.start, end: node.end})
            }
        });
    }
}