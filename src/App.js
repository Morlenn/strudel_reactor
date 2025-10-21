import './App.css';
import { useEffect, useRef } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import { stranger_tune } from './tunes';
import console_monkey_patch, { getD3Data } from './console-monkey-patch';
import ToggleButton from './components/ToggleButton';
import ButtonGroup from './components/ButtonGroup';
import TextArea from './components/TextArea'

const handleD3Data = (event) => {
    console.log(event.detail);
};

export default function StrudelDemo() {

    const globalEditor = useRef(null);
    const hasRun = useRef(false);

    const play = () => {
        if (globalEditor.current) {
            globalEditor.current.evaluate();
        }
    }

    const stop = () => {
        if (globalEditor.current) {
            globalEditor.current.stop();
        }
    }

    const save = () => {
        if (globalEditor.current) {
            // TODO: Save/load functionality
            console.log(globalEditor.current.code);
        }
    }

    const load = () => {
        if (globalEditor.current) {
            // TODO: Save/load functionality
        }
    }

    let navButtons = [
        // { label: 'Preprocess', onClick: Proc },
        // { label: 'Proc & Play', onClick: ProcAndPlay},
        { label: 'Play', onClick: play},
        { label: 'Stop', onClick: stop},
        { label: 'Save', onClick: save},
        { label: 'Load', onClick: load}
    ];

    useEffect(() => {

        if (!hasRun.current) {
            document.addEventListener("d3Data", handleD3Data);
            console_monkey_patch();
            hasRun.current = true;
            //Code copied from example: https://codeberg.org/uzu/strudel/src/branch/main/examples/codemirror-repl
            //init canvas
            const canvas = document.getElementById('roll');
            canvas.width = canvas.width * 2;
            canvas.height = canvas.height * 2;
            const drawContext = canvas.getContext('2d');
            const drawTime = [-2, 2]; // time window of drawn haps
            globalEditor.current = new StrudelMirror({
                defaultOutput: webaudioOutput,
                getTime: () => getAudioContext().currentTime,
                transpiler,
                root: document.getElementById('editor'),
                // TODO: Change tune by selection.
                initialCode: stranger_tune,
                drawTime,
                onDraw: (haps, time) => drawPianoroll({ haps, time, ctx: drawContext, drawTime, fold: 0 }),
                prebake: async () => {
                    initAudioOnFirstClick(); // needed to make the browser happy (don't await this here..)
                    const loadModules = evalScope(
                        import('@strudel/core'),
                        import('@strudel/draw'),
                        import('@strudel/mini'),
                        import('@strudel/tonal'),
                        import('@strudel/webaudio'),
                    );
                    await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
                },
            });
        }

    }, []);

    return (
        <div>
            <h2>Strudel Demo</h2>
            <main>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                            <div id="editor" />
                            {/* <div id="output" /> */}
                        </div>
                        <div className="col text-center">
                            <ButtonGroup
                                buttons={navButtons}
                            />
                        </div>
                    </div>
                    <div className="row">
                        {/* TODO: Update toggles to hush music */}
                        <ToggleButton
                            label = 'p1'
                        />
                    </div>
                </div>
                <canvas id="roll"></canvas>
            </main >
        </div >
    );
}