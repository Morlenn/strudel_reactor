import Button from './Button';
import { useState } from 'react'

export default function ToggleButton({ bsPrefix = `btn`, id = '', variant = 'primary', type = 'button', label = '', isActive = false, onClick: onClick = () => {}}) {
    
    const [toggled, setToggled] = useState(isActive);

    const toggleCheck = () => {
        
        if (onClick) {
            onClick(!toggled);
        }

        setToggled(!toggled);
    };
    
    return (
        <Button
            bsPrefix={bsPrefix}
            id={id}
            variant={variant}
            type={type}
            label={label}
            active={toggled}
            onClick={toggleCheck}
        />
            
    );
}