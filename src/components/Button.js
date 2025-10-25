import BSButton from 'react-bootstrap/Button';

export default function Button({ bsPrefix = 'btn', id = '', variant = 'primary', size = '', disabled = false, label = '', onClick = () => {}, type = 'button', active = false}) {
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
            <span>{label}</span>
        </BSButton>
    )
}