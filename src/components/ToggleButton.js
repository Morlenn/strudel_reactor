import BSToggleButton from 'react-bootstrap/ToggleButton';
import { useState } from 'react'

export default function ToggleButton({ defaultChecked = false, bsPrefix = `btn${ defaultChecked ? ' active' : ''}`, type = 'button', label = '', onChange = () => {}}) {
    
    const [checked, setChecked] = useState(defaultChecked);

    const toggleCheck = (event) => {
        let isChecked = event.target.checked;
        setChecked(isChecked);

        if (onChange) {
            onChange(isChecked);
        }
    };
    
    return (
        <BSToggleButton
        bsPrefix={bsPrefix}
        type={type}
        checked={checked}
        onClick={toggleCheck}
        >
            {label}
        </BSToggleButton>
    );
}