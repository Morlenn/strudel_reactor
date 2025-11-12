import BSButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from './Button';
import { useState, useId } from 'react';

/**
 * Wrapper for a Bootstrap toggle button group.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.bsPrefix='btn-group'] - Base CSS class prefix for the button group.
 * @param {string} [props.size=''] - Size variant for the button group (sm, lg, etc.).
 * @param {boolean} [props.vertical=false] - If true, displays the button group vertically.
 * @param {Array<Object>} [props.buttons=[]] - Array of button configs to render in the group.
 * @param {string} [props.label=''] - Label text for the button group.
 * @param {Function} [props.onChange=()=>{}] - Callback fired when a button selection changes.
 */
export default function ToggleGroup({ bsPrefix = 'btn-group', size = '', vertical = false, buttons = [], label = '', onChange = () => {}}) {
    const id = useId();
    const [selected, setSelected] = useState('0');

    const toggleSelected = (value) => {
        setSelected(value);
        onChange(value);
    };

    return (
        <div className='text-center flex-grow-1'>
            <div className='fs-4 text-uppercase fw-semibold mb-2'>
                {label}
            </div>
            <BSButtonGroup
                bsPrefix={bsPrefix}
                id={id}
                size={size}
                vertical={vertical}
                >
                {buttons.map((props, index) => {

                    return <Button
                                bsPrefix='toggle-group-button hush-button'
                                key={`toggle-${props.label}-${index}`}
                                id={`${props.label}-button-${index+1}`}
                                value={index}
                                variant=''
                                active={selected === `${index}`}
                                label={props.label}
                                onClick={() => toggleSelected(`${index}`)}
                            />
                       
                })}
            </BSButtonGroup>
        </div>
    );
}