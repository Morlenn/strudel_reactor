import Form from 'react-bootstrap/Form';
import { useState } from 'react';

export default function ToggleButton({ bsPrefix = 'form-check', label = '', defaultChecked = false, onChange = () => {}}) {

    const [checked, setChecked] = useState(defaultChecked)

    const toggleCheck = (event) => {
        let isChecked = event.target.checked;
        setChecked(isChecked);

        if (onChange) {
            onChange(event);
        }
    }

    return (
        <Form.Check
            bsPrefix={bsPrefix}
            type='checkbox'
            checked={checked}
            label={label}
            onChange={toggleCheck}
        />
    )
}