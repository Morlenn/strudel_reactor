import Button from './Button';
import { useState } from 'react'

export default function ToggleGroupButton({ bsPrefix = `toggle-group-button hush-button`, id = '', value = '', variant = 'primary', type = 'button', label = '', active = false, onClick: onClick = () => {}}) {
     
    return (
        <Button
            bsPrefix={bsPrefix}
            id={id}
            value={value}
            variant={variant}
            type={type}
            label={label}
            active={active}
            onClick={onClick}
        />
            
    );
}