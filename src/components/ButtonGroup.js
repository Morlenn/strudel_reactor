import BSButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from './Button';
import Modal from './Modal';
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
                if (props?.type === 'modal') {
                    return <Modal {...props} />
                }
                return <Button {...props} id={`${id}-${index}`}/>;
            })}
        </BSButtonGroup>
    );
}