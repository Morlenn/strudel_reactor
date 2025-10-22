import BSButtonGroup from 'react-bootstrap/ButtonGroup'
import Form from 'react-bootstrap/Form';
import ToggleButton from './ToggleButton';
import { useState, useId } from 'react';

export default function ToggleGroup({ bsPrefix = 'btn-group', size = '', vertical = false, buttons = [], label = '', onChange = () => {}}) {
    const id = useId();
    const [selected, setSelected] = useState('0');

    const toggleSelected = (value) => {
        setSelected(value);
        onChange(value)
    }

    // useEffect(() => {
    //     if (buttons.length) {
    //         setSelected(0);
    //     }
    // })

    return (
        <>
            <Form.Label htmlFor={id}>
                {label}
            </Form.Label>
            <BSButtonGroup
                bsPrefix={bsPrefix}
                id={id}
                size={size}
                vertical={vertical}
            >
                {buttons.map((props, index) => {
                    return <ToggleButton 
                        {...props} 
                        id={`${id}-${index}`} 
                        value={index} 
                        onChange={() => toggleSelected(`${index}`)} 
                        checked={selected === `${index}`}
                        />;
                })}
            </BSButtonGroup>
        </>
    );
}