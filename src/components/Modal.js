import { useState } from 'react';
import BSModal from 'react-bootstrap/Modal';
import { Form, Button } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

/**
 * Wrapper for a Bootstrap modal component with a launch button.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.buttonClass=''] - CSS classes applied to the launch button.
 * @param {string} [props.launchLabel=''] - Text displayed on the button that launches the modal.
 * @param {string} [props.header=''] - Header text of the modal.
 * @param {string} [props.body=''] - Body content of the modal.
 * @param {string} [props.tooltip=''] - Tooltip text for the launch button.
 * @param {Function} [props.onSubmit=()=>{}] - Callback fired when the modal's submit action is triggered.
 */
export default function Modal({ buttonClass = '', launchLabel = '', header = '', body = '', tooltip = '', onSubmit = () => {} }) {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    /** Closes and the modal and passes FormData to callback. */
    const handleSubmit = (event) => {
        event.preventDefault();
        let form = new FormData(event.target)
        let formData = Object.fromEntries(form.entries());
        if (onSubmit) {
            onSubmit(formData);
        }
        handleClose();
    }

    // Button without tooltip.
    if (!tooltip) {
            return (
                <>
                    <Button bsPrefix={buttonClass} onClick={handleShow}>
                        {launchLabel}
                    </Button>
                    <BSModal 
                    size="lg"
                    centered
                    show={show}
                    onHide={handleClose}
                    >
                        <BSModal.Header closeButton>
                            <BSModal.Title>
                                {header}
                            </BSModal.Title>
                        </BSModal.Header>
                        <Form onSubmit={handleSubmit}>
                            <BSModal.Body>
                                {body}
                            </BSModal.Body>
                            <BSModal.Footer>
                                <Button type='submit'>Submit</Button>
                                <Button variant='secondary' onClick={handleClose}>Cancel</Button>
                            </BSModal.Footer>
                        </Form>
                    </BSModal>
                </>
            )
        }

        // Button with tooltip.
        return (
                <>
                    <OverlayTrigger
                    placement='top'
                    delay={{ show: 250, hide: 400 }}
                    overlay={
                        <Tooltip >{tooltip}</Tooltip>
                    }
                    >
                        <Button bsPrefix={buttonClass} onClick={handleShow}>
                            {launchLabel}
                        </Button>
                    </OverlayTrigger>
                    <BSModal 
                    size="lg"
                    centered
                    show={show}
                    onHide={handleClose}
                    >
                        <BSModal.Header closeButton>
                            <BSModal.Title>
                                {header}
                            </BSModal.Title>
                        </BSModal.Header>
                        <Form onSubmit={handleSubmit}>
                            <BSModal.Body>
                                {body}
                            </BSModal.Body>
                            <BSModal.Footer>
                                <Button type='submit'>Submit</Button>
                                <Button variant='secondary' onClick={handleClose}>Cancel</Button>
                            </BSModal.Footer>
                        </Form>
                    </BSModal>
                </> 
        );
}