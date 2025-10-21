import Form from 'react-bootstrap/Form';
import { useState } from 'react';

export default function CheckBox({ bsPrefix = 'form-check', id = '', type = 'checkbox', label = '', defaultChecked = false, onChange = () => {}}) {

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
            id={id}
            type={type}
            checked={checked}
            label={label}
            onChange={toggleCheck}
        />
    )
}