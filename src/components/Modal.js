import { useState } from 'react';
import BSModal from 'react-bootstrap/Modal';
import { Form, Button } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

export default function Modal({ buttonClass = '', launchLabel = '', header = '', body = '', tooltip = '', onSubmit = () => {} }) {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = (event) => {
        event.preventDefault();
        let form = new FormData(event.target)
        let formData = Object.fromEntries(form.entries());
        if (onSubmit) {
            onSubmit(formData);
        }
        handleClose();
    }

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

// function App() {
//   const [modalShow, setModalShow] = useState(false);

//   return (
//     <>
//       <Button variant="primary" onClick={() => setModalShow(true)}>
//         Launch vertically centered modal
//       </Button>

//       <MyVerticallyCenteredModal
//         show={modalShow}
//         onHide={() => setModalShow(false)}
//       />
//     </>
//   );
// }