import Slider from './Slider';
import ToggleGroup from './ToggleGroup';
import ToggleButton from './ToggleButton';
import ButtonGroup from './ButtonGroup';
import { useState, useEffect } from 'react';


export default function ControlDeck({ config = {}, navButtons = [] }) {

    const [controlConfig, setControlConfig] = useState(config);

    const updateCode = (updatedCode) => {
        controlConfig.updateCode(updatedCode);
    }

    useEffect(() => {
            if (config) {
                setControlConfig(config);
            }
        }, [config]);

    return (
        <div className='control-deck bg-dark text-white col'>
            <div className='col-12 p-3 pb-0 pt-2'>
                <div className='row'>
                    <div className='controls-container control-deck-inner d-flex justify-content-center text-center mb-3 p-2 fs-6 text-uppercase fw-semibold'>
                        <ButtonGroup
                            key={`${controlConfig.configID}-navbuttons`}
                            bsPrefix='btn-group btn-group-lg flex-grow-2 w-75 m-1'
                            buttons={navButtons}
                        />
                    </div>
                    <div className='row row-cols-3 row-cols-lg-4 row-cols-xl-5 mt-1 mb-0 ps-2 ms-1'>
                            {/* Sound buttons to be added post render */}
                            {controlConfig.sounds.map((sound, index) => {
                                return <div className='col mb-5' key={`${controlConfig.configID}-toggle-button-${index}`}>
                                            <ToggleButton
                                                bsPrefix={'hush-button text-center flex-fill'}
                                                id={`hush-button-${index+1}`}
                                                variant=''
                                                label={sound.label}
                                                onClick={sound.onChange}
                                                wrapLabel={true}                                
                                            />
                                        </div>
                            })}
                    </div>
                    <div className='row row-cols-1 mb-5'>
                            {/* Variable toggles to be added post render */}
                            <div className="btn-toolbar toggle-group col gap-4">
                                {controlConfig.variables.map((variable, index) => {
                                return <ToggleGroup
                                            key={`${controlConfig.configID}-toggle-group-${index}`}
                                            bsPrefix='btn-group'
                                            label={variable.label}
                                            buttons={variable.buttons}
                                            onChange={(value) => {
                                                updateCode(controlConfig.globalEditor.code.slice(0, variable.start) + value + controlConfig.globalEditor.code.slice(variable.end));
                                            }}
                                        />
                                })}
                        </div>
                    </div>
                    <div className='col-12'>
                        <div className='slider-container control-deck-inner d-flex justify-content-center flex-wrap pb-3'>
                            {/* Slider to control global gain, with disable toggle. */}
                            {controlConfig.sliders.map((slider, index) => {
                                return <Slider 
                                            key={`${controlConfig.configID}-slider-${index}`}
                                            addClass='m-3 mx-5'
                                            min='0'
                                            max='2'
                                            step='0.1'
                                            defaultValue='1'
                                            label={slider.label}
                                            disabled={slider.disabled}
                                            vertical={slider.vertical}
                                            onChange={slider.onChange}
                                            toggle={slider.toggle}
                                        />
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}