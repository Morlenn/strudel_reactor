import Input from './form-elements/Input';
import { useId, useState, useEffect } from 'react';

/**
 * A Bootstrap-style input group component, using the custom Input component.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.bsPrefix='input-group'] - Base CSS class prefix for the input group container.
 * @param {string} [props.size='size'] - Size variant for the input group (sm, lg, etc.).
 * @param {Array<Object>} [props.inputs=[]] - Array of input configs to build Input components.
 */
export default function InputGroup({ bsPrefix = 'input-group', size = 'size', inputs = [] }) {
    const id = useId();
    const [groupInputs, setGroupInputs] = useState(inputs);

    useEffect(() => {
            if (inputs) {
                setGroupInputs(inputs);
            }
        }, [inputs]);

    return (
        <>
            {groupInputs.map((props, index) => {
                                    return <Input {...props} id={`${id}-${index}`}/>;
                                })}
        </>
    );
}