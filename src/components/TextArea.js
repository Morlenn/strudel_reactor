import Form from 'react-bootstrap/Form';

export default function TextArea({bsPrefix = 'form-control', id = '', rows = 3, size = '', defaultValue = '', label = 'Insert text here...', hidden = false, onChange = () => {}}) {
    return (
        <>
            <Form.Label>{label}</Form.Label>
            <Form.Control
                bsPrefix={bsPrefix}
                id={id}
                as="textarea"
                size={size}
                defaultValue={defaultValue}
                rows={rows}
                hidden={hidden}
                onChange={onChange} />
        </>
    );
}