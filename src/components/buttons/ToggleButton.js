import Button from './Button';
import { useState } from 'react'

/**
 * Extends a Button component for use as a toggle button.
 * 
 * @param {Object} props - Component props.
 * @param {string} [props.bsPrefix='btn'] - Base CSS class prefix for Bootstrap styling.
 * @param {string} [props.id=''] - Unique identifier for the button element.
 * @param {string} [props.variant='primary'] - Bootstrap button variant (primary, secondary, etc.).
 * @param {string} [props.size=''] - Button size variant (sm, lg, etc.).
 * @param {string} [props.type='button'] - HTML button type (button, submit, reset).
 * @param {string} [props.label=''] - Text content displayed on the button.
 * @param {boolean} [props.isActive=false] - Whether the button is in an active state.
 * @param {Function} [props.onClick=()=>{}] - Click event handler function.
 * @param {boolean} [props.wrapLabel=false] - Wraps label within a span element if true.
 */
export default function ToggleButton({ bsPrefix = `btn`, id = '', variant = 'primary', size = '', type = 'button', label = '', isActive = false, onClick: onClick = () => {}, wrapLabel = false}) {
    
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
            size={size}
            type={type}
            label={label}
            active={toggled}
            onClick={toggleCheck}
            wrapLabel={wrapLabel}
        />
            
    );
}