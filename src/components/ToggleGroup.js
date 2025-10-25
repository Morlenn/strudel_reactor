import BSButtonGroup from 'react-bootstrap/ButtonGroup'
import Form from 'react-bootstrap/Form';
import RadioButton from './RadioButton';
import ToggleButton from './ToggleButton';
import ToggleGroupButton from './ToggleGroupButton';
import { useState, useId } from 'react';

export default function ToggleGroup({ bsPrefix = 'btn-group', size = '', vertical = false, buttons = [], label = '', onChange = () => {}}) {
    const id = useId();
    const [selected, setSelected] = useState('0');

    const toggleSelected = (value) => {
        setSelected(value);
        onChange(value);
    };

    return (
        <div className='text-center'>
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

                    return <div className='col'>
                            <ToggleGroupButton
                                id={`${props.label}-button-${index+1}`}
                                value={index}
                                variant=''
                                active={selected === `${index}`}
                                label={props.label}
                                onClick={() => toggleSelected(`${index}`)}
                            />
                        </div>
                })}
            </BSButtonGroup>
        </div>
    );
}