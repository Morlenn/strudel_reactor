
import Form from 'react-bootstrap/Form';
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
        <>
            <Form.Label>{label}</Form.Label>
            <Form.Range
                bsPrefix={`${bsPrefix}${vertical ? ' range-vertical' : ''}`}
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={rangeOutput}
                disabled={state}
            />
            <output>{output}</output>

            {/* Conditionally add toggle button */}
            {toggle && 
            <CheckBox
                bsPrefix={toggle.bsPrefix}
                checked={state}
                label={toggle.label}
                onChange={toggleState}
            />}
        </>
    );
}