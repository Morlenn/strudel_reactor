import Form from 'react-bootstrap/Form';

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