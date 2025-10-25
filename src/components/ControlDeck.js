import CheckBox from './CheckBox';
import InputGroup from './InputGroup';
import Slider from './Slider';
import ToggleGroup from './ToggleGroup';
import ToggleButton from './ToggleButton';
import { ToggleButtonGroup } from 'react-bootstrap';
// import ToggleButton from './ToggleButton';

import { useState, useEffect } from 'react';

export default function ControlDeck({ config }) {

    const [controlConfig, setControlConfig] = useState(config);
    console.log(controlConfig)

    const updateCode = (updatedCode) => {
        controlConfig.updateCode(updatedCode);
    }

    useEffect(() => {
            if (config) {
                setControlConfig(config);
            }
        }, [config]);

    return (
        <div className='d-flex justify-content-center'>
            <div className='col-12 col-md-12 col-lg-10 col-xxl-7 p-3 border border-black border-5 rounded shadow-sm'>
                <div className='row'>
                    <div className='col-12 col-md-8'>
                        <div className='d-flex justify-content-center flex-wrap'>
                            {/* Sound buttons to be added post render */}
                            {controlConfig.sounds.map((sound, index) => {
                                return <div className='mx-2 mb-4'>
                                            <ToggleButton
                                                bsPrefix={'hush-button'}
                                                id={`hush-button-${index+1}`}
                                                variant=''
                                                label={sound.label}
                                                onClick={sound.onChange}
                                                wrapLabel={true}                                
                                            />
                                        </div>
                            })}
                        </div>
                        <div className='d-flex justify-content-center flex-wrap'>
                            {/* Variable toggles to be added post render */}

                            {controlConfig.variables.map((variable) => {
                                return <div className='mx-3 mb-5'>
                                            <ToggleGroup
                                                bsPrefix='btn-group toggle-group'
                                                label={variable.label}
                                                buttons={variable.buttons}
                                                onChange={(value) => {
                                                    updateCode(controlConfig.globalEditor.code.slice(0, variable.start) + value + controlConfig.globalEditor.code.slice(variable.end));
                                                }}
                                            />
                                        </div>
                            })}
                        </div>
                    </div>
                    <div className='col-12 col-md-4'>
                        <div className='controls-container d-flex justify-content-center flex-wrap'>
                            {/* Inputs to be added post render */}
                            <InputGroup inputs={controlConfig.inputs}/>
                        </div>
                        
                        <div className='slider-container d-flex justify-content-center flex-wrap'>
                            {/* Slider to control global gain, with disable toggle. */}
                            {controlConfig.sliders.map((slider) => {
                                return <Slider 
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