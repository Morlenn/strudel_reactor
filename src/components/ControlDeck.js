import CheckBox from './CheckBox';
import InputGroup from './InputGroup';
import Slider from './Slider';
import ToggleGroup from './ToggleGroup';
import ToggleButton from './ToggleButton';
import Visualiser from './Visualiser';
import ButtonGroup from './ButtonGroup';
import Modal from './Modal';
import { useState, useEffect } from 'react';


export default function ControlDeck({ config = {}, visualiserData = [], navButtons = [] }) {

    const [controlConfig, setControlConfig] = useState(config);
    const [visualData, setVisualData] = useState([visualiserData])

    const updateCode = (updatedCode) => {
        controlConfig.updateCode(updatedCode);
    }

    useEffect(() => {
            if (config) {
                setControlConfig(config);
            }
        }, [config]);

    useEffect(() => {
            if (visualiserData.length) {
                setVisualData(visualiserData);
            }
        }, [visualiserData]);

    return (
        <div className='control-deck bg-dark text-white'>
            <Visualiser data={visualData}/>
            <div className='col-12 p-3 pt-0'>
                <div className='row'>
                    <div className='col-12 col-md-6 col-lg-7 p-0'>
                        <div className='d-flex flex-wrap justify-content-center align-items-stretch gap-5 mb-5'>
                            {/* Sound buttons to be added post render */}
                            {controlConfig.sounds.map((sound, index) => {
                                return <ToggleButton
                                                bsPrefix={'hush-button text-center flex-fill'}
                                                id={`hush-button-${index+1}`}
                                                variant=''
                                                label={sound.label}
                                                onClick={sound.onChange}
                                                wrapLabel={true}                                
                                            />
                            })}
                        </div>
                        <div className='d-flex justify-content-center flex-wrap'>
                            {/* Variable toggles to be added post render */}

                            {controlConfig.variables.map((variable) => {
                                return <ToggleGroup
                                            bsPrefix='btn-group toggle-group'
                                            label={variable.label}
                                            buttons={variable.buttons}
                                            onChange={(value) => {
                                                updateCode(controlConfig.globalEditor.code.slice(0, variable.start) + value + controlConfig.globalEditor.code.slice(variable.end));
                                            }}
                                        />
                            })}
                        </div>
                    </div>
                    <div className='col-12 col-md-6 col-lg-5'>
                        <div className='controls-container control-deck-inner d-flex justify-content-start flex-wrap text-center mb-3 p-2 fs-6 text-uppercase fw-semibold'>
                            {/* Inputs to be added post render */}
                            <InputGroup inputs={controlConfig.inputs}/>
                            <ButtonGroup
                                bsPrefix='btn-group btn-group-lg ms-2 my-2 m-0'
                                buttons={navButtons}
                            />
                        </div>
                        
                        <div className='slider-container control-deck-inner d-flex justify-content-center flex-wrap pb-3'>
                            {/* Slider to control global gain, with disable toggle. */}
                            {controlConfig.sliders.map((slider) => {
                                return <Slider 
                                            addClass='m-3 mx-5'
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