import BSInputGroup from 'react-bootstrap/InputGroup';
import Input from './Input';
import { useId, useState, useEffect } from 'react';

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