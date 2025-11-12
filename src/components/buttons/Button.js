import BSButton from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

/**
 * Wrapper for a Bootstrap button.
 * 
 * @param {Object} props - Component props.
 * @param {string} [props.bsPrefix='btn'] - Base CSS class prefix for Bootstrap styling
 * @param {string} [props.id=''] - Unique identifier for the button element
 * @param {string} [props.variant='primary'] - Bootstrap button variant (primary, secondary, success, etc.)
 * @param {string} [props.size=''] - Button size variant (sm, lg, etc.)
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {string} [props.label=''] - Text content displayed on the button
 * @param {Function} [props.onClick=()=>{}] - Click event handler function
 * @param {string} [props.type='button'] - HTML button type (button, submit, reset)
 * @param {boolean} [props.active=false] - Whether the button is in active state
 * @param {boolean} [props.wrapLabel=false] - Wraps label within span element if true.
 * @param {string} [props.tooltip=''] - Tooltip text to display on hover
 */
export default function Button({ bsPrefix = 'btn', id = '', variant = 'primary', size = '', disabled = false, label = '', 
    onClick = () => {}, type = 'button', active = false, wrapLabel = false, tooltip = '' }) {

        // Button without tooltip.
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
                    {/* Optionally wraps label within a span eleement */}
                    {wrapLabel && <span>{label}</span>}
                    {!wrapLabel && label}
                    
                </BSButton>
            )
        }

        // Button with tooltip.
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