import Form from 'react-bootstrap/Form';
import { useState } from 'react';

/**
 * Intended to be used as inner element of checkbox and radio button groups.
 * @param {*} props 
 * @returns 
 */
export default function RadioButton({ bsPrefix = 'btn-check', buttonStyle = 'btn-outline-primary', checked = false, id = '', value = '', label = '', onChange = () => {}}) {

    return (
        <>
            <input
                className={bsPrefix}
                id={id}
                type={'radio'}
                value={value}
                autoComplete='off'
                checked={checked}
                onChange={onChange}
                name={`btnradio-${id}`}
            />
            <label className={`btn ${buttonStyle}`} htmlFor={id}>
                {label}
            </label>
        </>
    )
}