import Form from 'react-bootstrap/Form';
import { useState } from 'react';

export default function Input({ bsPrefix = 'form-control', type = 'text', id = '', value = '', placeholder = '', size = '', label = '', onChange = () => {}  }) {

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
          value={inputValue}
          placeholder={inputPlaceholder}
          size={size}
          onChange={inputChange}
        />
    </div>
  );
}