import Form from 'react-bootstrap/Form';
import { Component } from 'react';

export default class ToggleButton extends Component {

    constructor(props) {
        super(props);

        this.props.defaultChecked ??= false;
        this.props.label ??= '';
        this.props.onChange ??= () => {};

        this.state = {
            checked: this.props.defaultChecked
        }
    }

    toggleCheck = (event) => {
        let isChecked = event.target.checked;
        this.setState({ checked: isChecked });

        if (this.props.onChange) {
            this.onChange(event);
        }
    }

    render() {
        return (
            <Form.Check
                type='checkbox'
                checked={this.state.checked}
                label={this.props.label}
                onChange={this.toggleCheck}
            />
        );
    }
}

ToggleButton.defaultProps = {
    label: '',
    defaultChecked: false,
    onChange: () => {}
};