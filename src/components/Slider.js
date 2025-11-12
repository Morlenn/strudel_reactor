
import Form from 'react-bootstrap/Form';
import ToggleButton from './ToggleButton';
import { useState } from 'react';

export default function Slider({ addClass = '', min = '0', max = '5', step = '0.5', defaultValue = '1', vertical = false, label = '', disabled = false, toggle = {}, onChange = () => {}}) {
    
    const [output, setOutput] = useState(defaultValue)
    const [value, setValue] = useState(defaultValue)
    const [state, setState] = useState(disabled);

    const rangeOutput = (event) => {

        if (onChange) {
            onChange(event.target.value);
        }

        setValue(event.target.value);
        setOutput(event.target.value);
    }

    // For optional toggle button.
    const toggleState = () => {
        let newState = !state;
        setState(newState);

        if (toggle.onChange) {
            toggle.onChange(newState, value)
        }
    }
   
    return (
        <div className='slider-wrapper text-center'>
                <input
                className={`range${vertical ? ' range-vertical' : ''}${addClass ? ` ${addClass}` : ''}`}
                type='range'
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={rangeOutput}
                disabled={state}
                />
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
                        label={ !state ? <i className="bi bi-volume-up"></i> : <i className="bi bi-volume-mute"></i> }
                        onClick={toggleState}                               
                    />
                </div>}
            </div>
    );
}