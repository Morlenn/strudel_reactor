import BSButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from './Button';
import { useId } from 'react';

export default function ButtonGroup({ bsPrefix = 'btn-group', size = '', vertical = false, buttons = []}) {
    const id = useId();
    
    return (
        <BSButtonGroup
            bsPrefix={bsPrefix}
            id={id}
            size={size}
            vertical={vertical}
        >
            {buttons.map((props, index) => {
                return <Button {...props} id={`${id}-${index}`}/>;
            })}
        </BSButtonGroup>
    );
}