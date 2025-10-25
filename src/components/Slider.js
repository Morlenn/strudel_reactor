
import Form from 'react-bootstrap/Form';
import ToggleButton from './ToggleButton';
import CheckBox from './CheckBox';
import { useState } from 'react';

export default function Slider({ bsPrefix = 'form-range', min = '0', max = '5', step = '0.5', defaultValue = '1', vertical = false, label = '', disabled = false, toggle = {}, onChange = () => {}}) {
    
    const [output, setOutput] = useState(defaultValue)
    const [value, setValue] = useState(defaultValue)
    const [state, setState] = useState(disabled);

    const rangeOutput = (event) => {

        if (onChange) {
            onChange(value ,event.target.value);
        }

        setValue(event.target.value);
        setOutput(event.target.value);
    }

    // For optional toggle button.
    const toggleState = () => {
        let newState = !state;
        setState(newState);

        if (toggle.onChange) {
            toggle.onChange()
        }
    }
   
    return (
        <div className='slider-wrapper text-center'>
            <input
                className={`range${vertical ? ' range-vertical' : ''}`}
                type='range'
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={rangeOutput}
                disabled={state}
            />
            <div>
                <div>
                    <Form.Label>{`${label}: ${output}`}</Form.Label>
                </div>
                

                

                {/* Conditionally add toggle button */}
                {toggle && 
                <div>
                    <ToggleButton
                        bsPrefix={toggle.bsPrefix}
                        size={toggle.size}
                        variant={toggle.variant}
                        label={ !state ? <i class="bi bi-volume-up"></i> : <i class="bi bi-volume-mute"></i> }
                        onClick={toggleState}                               
                    />
                </div>}
            </div>
        </div>
    );
}