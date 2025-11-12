import BSButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from './Button';
import Modal from '../Modal';
import { useId } from 'react';

/**
 * Wrapper for Bootstrap Button Group.
 * 
 * @param {Object} props
 * @param {string} [props.bsPrefix='btn-group'] - Base CSS class prefix for styling. Defaults to 'btn-group'
 * @param {string} [props.size=''] - Optional size modifier ('sm', 'lg', etc.) for the button group
 * @param {boolean} [props.vertical=false] - If true, displays buttons in a vertical layout instead of horizontal
 * @param {Array} [props.buttons=[]] - Array of button components configs to render within the group
 */
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
                    return <Modal {...props} key={`${id}-modal-${index}`}/>
                }
                return <Button {...props} id={`${id}-${index}`} key={`${id}-button-${index}`}/>;
            })}
        </BSButtonGroup>
    );
}