
/**
 * A radio input intended for use with InputGroup.
 * 
 * @param {Object} props - Component props.
 * @param {string} [props.bsPrefix='btn-check'] - Base CSS class prefix for Bootstrap styling.
 * @param {string} [props.buttonStyle='btn-outline-primary'] - Bootstrap button variant/style.
 * @param {boolean} [props.checked=false] - Whether the checkbox button is checked.
 * @param {string} [props.id=''] - Unique identifier for the input element.
 * @param {string} [props.value=''] - Value of the input element.
 * @param {string} [props.label=''] - Label text displayed alongside the checkbox button.
 * @param {Function} [props.onChange=()=>{}] - Change event handler function.
 */
export default function RadioButton({ bsPrefix = 'btn-check', buttonStyle = 'btn-outline-primary', checked = false, id = '', value = '', label = '', onChange = () => {}}) {

    return (
        <>
            <input
                className={bsPrefix}
                id={id}
                type={'radio'}
                value={value}
                autoComplete='off'
                checked={checked}
                onChange={onChange}
                name={`btnradio-${id}`}
            />
            <label className={`btn ${buttonStyle}`} htmlFor={id}>
                {label}
            </label>
        </>
    )
}