import Form from 'react-bootstrap/Form';
import { useState } from 'react';

/**
 * Wrapper for Bootstrap input component with label.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.bsPrefix='form-control'] - Base CSS class prefix for the input element.
 * @param {string} [props.type='text'] - HTML input type (i.e. text, password, email).
 * @param {string} [props.id=''] - Unique identifier for the input element.
 * @param {string} [props.name=''] - Name attribute for the input element.
 * @param {string} [props.value=''] - Current value of the input element.
 * @param {string} [props.placeholder=''] - Placeholder text displayed inside the input.
 * @param {string} [props.size=''] - Input size variant (sm, lg, etc.).
 * @param {string} [props.label=''] - Label text associated with the input.
 * @param {Function} [props.onChange=()=>{}] - Callback fired when the input value changes.
 */
export default function Input({ bsPrefix = 'form-control', type = 'text', id = '', name = '', value = '', placeholder = '', size = '', label = '', onChange = () => {}  }) {

      const [inputValue, setValue] = useState(value);
      const [inputPlaceholder, setPlaceholder] = useState(placeholder);

      const inputChange = (event) => {
          let newValue = event.target.value;
  
          if (onChange) {
              onChange(inputValue, newValue);
          }

          setValue(newValue);
          setPlaceholder(newValue);
      };

  return (
    <div>
        <Form.Label bsPrefix='form-label mb-1' htmlFor={id}>{label}</Form.Label>
        <Form.Control
          bsPrefix={bsPrefix}
          type={type}
          id={id}
          name={name}
          value={inputValue}
          placeholder={inputPlaceholder}
          size={size}
          onChange={inputChange}
        />
    </div>
  );
}