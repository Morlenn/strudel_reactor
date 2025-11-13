import { useEffect, useState, useRef } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import TuneProcessor from './tune-helpers/TuneProcessor';
import console_monkey_patch, { getD3Data } from './console-monkey-patch';
import ControlDeck from './components/ControlDeck';
import TuneFileManager from './tune-helpers/TuneFileManager';
import Visualiser from './components/Visualiser';
import Select from "./components/form-elements/Select";
import Input from "./components/form-elements/Input";

export default function StrudelDemo() {

    const [codeUpdated, setCodeUpdated] = useState(false); // enbaled / disable refresh button
    const [strudelData, setStrudelData] = useState([]); // gain values for Visuliser D3 graph
    const [navButtons, setNavButtons] = useState([]); // Navbar button config.
    const [tunes, setTunes] = useState(undefined); // object with loaded tunes
    const [tuneNames, setTuneNames] = useState([]); // tune names for populating select list
    const globalEditor = useRef(null);
    const hasRun = useRef(false);

    /**
     * Preprocess track, initialise strudel and create config to pass to ControlDeck component.
     * @param {*} selectedTrack default track.
     */
    const strudelInit = (selectedTrack) => {
        // preprocess track to add any missing elements (i.e. logging)
        let inputCode = TuneProcessor.preProcessString(selectedTrack);
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
            initialCode: inputCode, // set default song
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

        // Initialise TuneProcessor and generate config to pass to ControlDeck component.
        TuneProcessor.init({ globalEditor: globalEditor.current, updateCode: updateCode });
        setControlConfig(TuneProcessor.createControlDeckConfig());
        setCodeUpdated(false); // Disable refresh on init.
    };

    /** Play current track */
    const play = () => {
        if (globalEditor.current) {
            if (codeUpdated) { setCodeUpdated(false); } // Turn off refresh flag if required.
            globalEditor.current.evaluate();
        }
    };

    /** Stop current track */
    const stop = () => {
        if (globalEditor.current) {
            globalEditor.current.stop();
        }
    };

    /**
     * Saves current track and writes to saved-tunes.json
     * @param {*} formData form data from modal component.
     */
    const save = async (formData) => {
        let updatedTunes = tunes;
        if (globalEditor.current && formData.saveName) {
            updatedTunes[formData.saveName] = globalEditor.current.code;
            setTunes(updatedTunes);
            setTuneNames(Object.keys(updatedTunes));
            await TuneFileManager.saveTune(updatedTunes);

            // Refresh ControlConfig to reflect any changes to controls
            let track = TuneProcessor.preProcessString(tunes[formData.saveName]); // ensure logging appended
            globalEditor.current.setCode(track);
            setControlConfig(TuneProcessor.createControlDeckConfig());
        }
    };

    /**
     * Loads selected track name and generates a ControlDeck config for it.
     * @param {*} formData form data from modal component
     */
    const load = (formData) => {
        let track = tunes[formData.trackName];
        if (globalEditor.current && track) {
            globalEditor.current.stop();
            track = TuneProcessor.preProcessString(track); // ensure logging appended
            globalEditor.current.setCode(track);
            setControlConfig(TuneProcessor.createControlDeckConfig());
        }
    };

    /** Set passed string in globalEditor */
    const updateCode = (updatedCode) => {
        if (updatedCode) {
            globalEditor.current.setCode(updatedCode);
            setCodeUpdated(true);
        }
    };

    /** Extracts gain values from strudel logs and sets as strudelData */
    const handleD3Data = () => {
    let strudelData = getD3Data();
    let gainValues = [];
    strudelData.forEach((data) => { 
        let gainRegex = new RegExp(/\sgain:(\d+\.\d+)/);
        let match = data.match(gainRegex);
        if (match) {
            gainValues.push(Number(match[1]));
        }
    });

    // Keep values to between 0 and 1
    gainValues = gainValues.map((gain) => Math.min(Math.pow(gain, 1.5), 1));
    setStrudelData(gainValues);
    };

    // Control Config control, with init object.
    const [controlConfig, setControlConfig] = useState({
        configID: 'init',
        inputs: [],
        sounds: [],
        variables: [],
        sliders: [],
        updateCode: updateCode,
        globalEditor: globalEditor
    });

    // Load in tunes then intialise strudel.
    useEffect(() => {
        TuneFileManager.init()
            .then(() => {
                let loadedTunes = TuneFileManager.getTunes();
                setTunes(loadedTunes);
                setTuneNames(Object.keys(loadedTunes));
                if (!hasRun.current) {  
                    let defaultTune = loadedTunes.stranger_tune;
                    strudelInit(defaultTune)
                }
            })
    }, [])

    // Update navbar config when required.
    useEffect(() => {
        setNavButtons([
            { label: <i className="bi bi-play-fill"></i>, bsPrefix: 'btn btn-danger border border-secondary', onClick: play, tooltip: 'Play' },
            { label: <i className="bi bi-arrow-clockwise"></i>, bsPrefix: 'btn btn-danger border border-secondary', onClick: play, disabled: !codeUpdated, tooltip: 'Update' },
            { label: <i className="bi bi-stop-fill"></i>, bsPrefix: 'btn btn-danger border border-secondary', onClick: stop, tooltip: 'Stop' },
            { type: 'modal', launchLabel: <i className="bi bi-download"></i>, buttonClass: 'btn btn-danger border border-secondary',
                header: 'Save Track', body: <Input name='saveName' label='Please enter a save name:'/>, onSubmit: save, tooltip: 'Save' },
            { type: 'modal', launchLabel: <i className="bi bi-upload"></i>, buttonClass: 'btn btn-danger border border-secondary',
                header: 'Load Track', body: <Select name='trackName' options={tuneNames}/>, onSubmit: load, tooltip: 'Load' }
        ]);
    }, [tuneNames, codeUpdated])

    return (
        <div>
            <main>
                <div className="bg-dark m-0 p-0">
                    <div className="row m-0 p-0">
                        <div className="d-flex flex-column vh-100 p-2 col-12 col-md-7 col-xl-6 col-xxl-7 pe-0">
                            <div className="flex-grow-0">
                                <Visualiser data={strudelData}/>
                            </div>
                            <div className="strudel-container flex-grow-1 control-deck-inner m-2 p-0">
                                <div id="editor" className='p-0 w-100 h-100' />
                                <canvas id="roll" hidden></canvas>
                            </div>
                        </div>
                        <div className="col-12 col-md-5 col-xl-6 col-xxl-5 p-2 control-deck-wrapper ps-0">
                        <ControlDeck config={controlConfig} visualiserData={strudelData} navButtons={navButtons} />
                        </div>
                    </div>
                </div>
                
            </main >
        </div >
    );
}