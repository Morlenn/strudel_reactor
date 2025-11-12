
import Form from 'react-bootstrap/Form';
import ToggleButton from './buttons/ToggleButton';
import { useState } from 'react';

/**
 * A Input range element with output and option toggle button to enable/disable.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.addClass=''] - Additional CSS classes to apply to the slider container.
 * @param {string} [props.min='0'] - Minimum value of the slider.
 * @param {string} [props.max='5'] - Maximum value of the slider.
 * @param {string} [props.step='0.5'] - Step increment for slider values.
 * @param {string} [props.defaultValue='1'] - Initial value of the slider.
 * @param {boolean} [props.vertical=false] - Whether the slider is displayed vertically.
 * @param {string} [props.label=''] - Label text displayed for slider output.
 * @param {boolean} [props.disabled=false] - Whether the slider is disabled.
 * @param {Object} [props.toggle={}] - Optional toggle button configuration.
 * @param {Function} [props.onChange=()=>{}] - Callback fired when the slider value changes.
 */
export default function Slider({ addClass = '', min = '0', max = '5', step = '0.5', defaultValue = '1', vertical = false, label = '', disabled = false, toggle = {}, onChange = () => {}}) {
    
    const [output, setOutput] = useState(defaultValue)
    const [value, setValue] = useState(defaultValue)
    const [state, setState] = useState(disabled);

    const rangeOutput = (event) => {

        if (onChange) {
            onChange(event.target.value);
        }

        setValue(event.target.value);
        setOutput(event.target.value);
    }

    // For optional toggle button.
    const toggleState = () => {
        let newState = !state;
        setState(newState);

        if (toggle.onChange) {
            toggle.onChange(newState, value)
        }
    }
   
    return (
        <div className='slider-wrapper text-center'>
                <input
                className={`range${vertical ? ' range-vertical' : ''}${addClass ? ` ${addClass}` : ''}`}
                type='range'
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={rangeOutput}
                disabled={state}
                />
                <div>
                    <Form.Label>{`${label}: ${output}`}</Form.Label>
                </div>
                {/* Conditionally add toggle button */}
                {toggle && 
                <div>
                    <ToggleButton
                        bsPrefix={toggle.bsPrefix}
                        size={toggle.size}
                        variant={toggle.variant}
                        label={ !state ? <i className="bi bi-volume-up"></i> : <i className="bi bi-volume-mute"></i> }
                        onClick={toggleState}                               
                    />
                </div>}
            </div>
    );
}