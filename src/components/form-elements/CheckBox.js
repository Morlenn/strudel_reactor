import Form from 'react-bootstrap/Form';
import { useState } from 'react';

/**
 * Wrapper for a Bootstrap checkbox.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.bsPrefix='form-check'] - Base CSS class prefix for the checkbox container.
 * @param {string} [props.id=''] - Unique identifier for the checkbox input element.
 * @param {string} [props.type='checkbox'] - HTML input type (default "checkbox").
 * @param {string} [props.label=''] - Label displayed for checkbox.
 * @param {boolean} [props.defaultChecked=false] - Whether the checkbox is initially checked.
 * @param {Function} [props.onChange=()=>{}] - Callback fired when the checkbox value changes.
 */
export default function CheckBox({ bsPrefix = 'form-check', id = '', type = 'checkbox', label = '', defaultChecked = false, onChange = () => {}}) {

    const [checked, setChecked] = useState(defaultChecked)

    const toggleCheck = (event) => {
        let isChecked = event.target.checked;
        setChecked(isChecked);

        if (onChange) {
            onChange(isChecked);
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