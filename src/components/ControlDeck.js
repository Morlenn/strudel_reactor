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

    const updateCode = (updatedCode) => {
        controlConfig.updateCode(updatedCode);
    }

    useEffect(() => {
            if (config) {
                setControlConfig(config);
            }
        }, [config]);

    return (
        <>
            <div className='controls-container'>
                {/* Inputs to be added post render */}
                <InputGroup inputs={controlConfig.inputs}/>
            </div>
            <div className='d-flex justify-content-center row row-cols-2 row-cols-sm-3 row-cols-md-6 gx-5'>
                {/* Sound buttons to be added post render */}
                {controlConfig.sounds.map((sound, index) => {
                    return <div className='col'>
                                <ToggleButton
                                    bsPrefix={'hush-button'}
                                    id={`hush-button-${index+1}`}
                                    variant=''
                                    label={sound.label}
                                    onClick={sound.onChange}
                                />
                            </div>
                })}
            </div>
            <div className='mb-3'>
                {/* Slider to control global gain, with disable toggle. */}
                <Slider 
                label='Gain'
                disabled={true}
                toggle={{
                    label: 'Gain Toggle',
                    onChange: () => {
                        // Pattern matches global gain control.
                        let gainRegex = 'all\\(x => x\\.gain\\([0-9]*[.]?[0-9]+\\)\\)';
                        let match = controlConfig.globalEditor.code.match(`//${gainRegex}`);

                        // Disabled code.
                        if (match) {
                            updateCode(controlConfig.globalEditor.code.replace(match[0], `${match[0].slice(2)}`)); 
                        } else {
                            // Enable code.
                            let match = controlConfig.globalEditor.code.match(gainRegex);
                            if (match) {
                                updateCode(controlConfig.globalEditor.code.replace(match[0], `//${match[0]}`)); 
                            }
                        }
                    }
                }}
                onChange={(oldValue, newValue) => {
                    updateCode(controlConfig.globalEditor.code.replace(`all(x => x.gain(${oldValue}))`, `all(x => x.gain(${newValue}))`));
                }}
                />
            </div>
            <div className='toggle-container'>
                {/* Variable toggles to be added post render */}

                {controlConfig.variables.map((variable) => {
                    return <div>
                                <ToggleGroup
                                    label={variable.label}
                                    buttons={variable.buttons}
                                    onChange={(value) => {
                                        updateCode(controlConfig.globalEditor.code.slice(0, variable.start) + value + controlConfig.globalEditor.code.slice(variable.end));
                                    }}
                                />
                            </div>
                })}
            </div>
        </>
    );
}