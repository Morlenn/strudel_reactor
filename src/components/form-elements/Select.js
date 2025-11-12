import Form from 'react-bootstrap/Form';

/**
 * Wrapper for a Bootstrap select component.
 *
 * @param {Object} props - Component props.
 * @param {Array<Object>} [props.options=[]] - Array of option objects to display in the dropdown.
 * @param {string} [props.name=''] - Name attribute for the select element.
 * @param {string} [props.placeholder='Please select an option...'] - Placeholder text displayed when no option is selected.
 */
export default function Select({ options = [], name='', placeholder = 'Please select an option...'}) {
  return (
    <Form.Select name={name}>
      <option>{placeholder}</option>
      {options.map((option) => {
        return <option value={option}>{option}</option>
      })}
    </Form.Select>
  );
}