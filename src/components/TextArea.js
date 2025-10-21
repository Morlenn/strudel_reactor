import Form from 'react-bootstrap/Form';

export default function TextArea({bsPrefix = 'form-control', rows = 3, size = '', label = 'Insert text here...'}) {
    return (
        <>
            <Form.Label>{label}</Form.Label>
            <Form.Control
                bsPrefix={bsPrefix}
                as="textarea"
                size={size}
                rows={rows} />
        </>
    );
}