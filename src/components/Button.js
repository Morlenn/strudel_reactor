import BSButton from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

export default function Button({ bsPrefix = 'btn', id = '', variant = 'primary', size = '', disabled = false, label = '', 
    onClick = () => {}, type = 'button', active = false, wrapLabel = false, tooltip = '' }) {

        if (!tooltip) {
            return (
                <BSButton
                    bsPrefix={bsPrefix}
                    id={id}
                    variant={variant}
                    size={size}
                    disabled={disabled}
                    onClick={onClick}
                    type={type}
                    active={active}
                >
                    {wrapLabel && <span>{label}</span>}
                    {!wrapLabel && label}
                    
                </BSButton>
            )
        }
        return (
            <OverlayTrigger
                placement='top'
                delay={{ show: 250, hide: 400 }}
                overlay={
                    <Tooltip >{tooltip}</Tooltip>
                }
                >
                <BSButton
                    bsPrefix={bsPrefix}
                    id={id}
                    variant={variant}
                    size={size}
                    disabled={disabled}
                    onClick={onClick}
                    type={type}
                    active={active}
                >
                    {wrapLabel && <span>{label}</span>}
                    {!wrapLabel && label}
                    
                </BSButton>
            </OverlayTrigger>
        );
}