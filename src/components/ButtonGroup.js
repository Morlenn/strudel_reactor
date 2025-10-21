import BSButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from './Button';

export default function ButtonGroup({ bsPrefix = 'btn-group', size = '', vertical = false, buttons = []}) {
    {console.log(buttons)}
    return (
        <BSButtonGroup
            bsPrefix={bsPrefix}
            size={size}
            vertical={vertical}
        >
            {buttons.map((props) => {
                console.log(props)
                return <Button {...props}/>;
            })}
        </BSButtonGroup>
    );
}