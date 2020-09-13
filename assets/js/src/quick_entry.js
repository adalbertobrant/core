import React, {Component} from 'react';
import styles from './quick_entry.css';


class QuickEntry extends Component{
    render() {
        return (
            <div>
                <div>
                    <h3>New {this.props.model_name}</h3>

                </div>
            </div>
        )
    }
} 


class QuickEntryField extends Component {
    render() {
        return (<div>

        </div>)
    }
}

const CharField = () => (<input class='form-control' type="text" />)
const NumberField = () => (<input class='form-control' type="number" />)
const TextField = () => (<textarea class='form-control'></textarea>)
const SelectField = () => (<select>
    <option value=""></option>
</select>)
const FKField = () => (<div></div>)