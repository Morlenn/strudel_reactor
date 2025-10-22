import './App.css';
import { useEffect, useState, useRef } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import Song from './Song';
import { stranger_tune } from './tunes';
import console_monkey_patch, { getD3Data } from './console-monkey-patch';
import CheckBox from './components/CheckBox';
import ButtonGroup from './components/ButtonGroup';
import ToggleGroup from './components/ToggleGroup';
import Slider from './components/Slider';
import PostRenderElements from './components/PostRenderElements';

const handleD3Data = (event) => {
    console.log(event.detail);
};

export default function StrudelDemo() {

    const [soundElements, setSoundElements] = useState([]);
    const [soundToggles, setSoundToggles] = useState([]);
    const [codeUpdated, setCodeUpdated] = useState(false);
    const globalEditor = useRef(null);
    const hasRun = useRef(false);
    let track;

    const play = () => {
        if (globalEditor.current) {
            globalEditor.current.evaluate();
        }
    }

    const refresh = () => {
        if (globalEditor.current && codeUpdated) {
            globalEditor.current.evaluate();
            setCodeUpdated(false);
        }
    }

    const stop = () => {
        if (globalEditor.current) {
            globalEditor.current.stop();
        }
    }

    const save = () => {
        if (globalEditor.current) {
            new Song({code: globalEditor.current.code})
        }
    }

    const load = () => {
        if (globalEditor.current) {
            // TODO: Save/load functionality
        }
    }

    const updateCode = (updatedCode) => {
        if (updatedCode) { 
            globalEditor.current.setCode(updatedCode);
            setCodeUpdated(true);
        }
    }

    let navButtons = [
        // { label: 'Preprocess', onClick: Proc },
        // { label: 'Proc & Play', onClick: ProcAndPlay},
        { label: 'Play', onClick: play},
        { label: 'Refresh', onClick: refresh, disabled: !codeUpdated},
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

            // Set track for strudel code processing.
            track = new Song({code: globalEditor.current.code, repl: globalEditor.current.repl})
            // Set sound toggles.
            setSoundElements(track.sounds.map((sound) => {
                    return <CheckBox
                                label = {sound.label}
                                defaultChecked = {true}
                                onChange={(isChecked) => {
                                    if (isChecked) {
                                        // Remove underscore.
                                        updateCode(globalEditor.current.code.replace(`_${sound.label}:`, `${sound.label}:`));

                                    } else {
                                        // Add underscore.
                                        updateCode(globalEditor.current.code.replace(`${sound.label}:`, `_${sound.label}:`));
                                    }
                                    // globalEditor.current.evaluate();
                                }}
                            />
            }));
            setSoundToggles(track.variables.map((variable) => {
                let buttons = [];
                for (let i = 0; i < variable.length; i++) {
                    buttons.push({ bsPrefix: 'btn-check', label: `${i+1}` })
                }
                return <ToggleGroup
                                label={variable.label}
                                buttons={buttons}
                                onChange={(value) => {
                                    updateCode(globalEditor.current.code.slice(0, variable.start) + value + globalEditor.current.code.slice(variable.end));
                                }}
                            />
            }))

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
                        <div className='sound-container'>
                            {/* Sound buttons to be added post render */}
                            <PostRenderElements newElements={soundElements}/>
                        </div>
                        <div className='mb-3'>
                            <Slider label='Test Slider'/>
                        </div>
                        <div className='toggle-container'>
                            {/* Variable toggles to be added post render */}
                            <PostRenderElements newElements={soundToggles}/>
                        </div>
                    </div>
                </div>
                <canvas id="roll"></canvas>
            </main >
        </div >
    );
}