import BSButton from 'react-bootstrap/Button';

export default function Button({ bsPrefix = 'btn', id = '', variant = 'primary', size = '', disabled = false, label = '', onClick = () => {}, type = 'button' }) {
    return (
        <BSButton
            bsPrefix={bsPrefix}
            id={id}
            variant={variant}
            size={size}
            disabled={disabled}
            onClick={onClick}
            type={type}
        >
            {label}
        </BSButton>
    )
}