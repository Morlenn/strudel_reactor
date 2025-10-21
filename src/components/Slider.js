
import Form from 'react-bootstrap/Form';
import { useState } from 'react';

export default function Slider({ bsPrefix = 'form-range', min = '0', max = '5', step = '0.5', defaultValue = '1', vertical = false, label = ''}) {
    
    const [output, setOutput] = useState(defaultValue)
    const [value, setValue] = useState(defaultValue)

    const rangeOutput = (event) => {
        // Set value as custome onChange breaks default BS behaviour.
        setValue(event.target.value);
        setOutput(event.target.value);
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
            />
            <output>{output}</output>
        </>
    );
}