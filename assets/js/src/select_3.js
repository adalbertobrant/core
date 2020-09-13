import React, {Component} from 'react';
import axios from './auth';
import styles from './select_3.css';
import Radium from 'radium';

class SelectThree extends Component {
    state = {
        inputVal: "",
        selected: null,
        options: [],
        filteredOptions: [],
        showOptions: false
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.selected != prevState.selected && this.state.showOptions) {
            this.setState({showOptions: false})
        }
    }

    componentDidMount() {
        axios({
            'method': 'GET',
            url: `/base/api/model-items/${this.props.app}/${this.props.model}/` 
        }).then((resp) =>{
            this.setState({
                options: resp.data.data,
                filteredOptions: resp.data.data,
            })
        })
    }

    handleInputChange = (evt) => {
        let selected = null
        const newOptions = this.state.options.filter(opt =>{
            if(opt[1] === evt.target.value) {
                selected = opt[0]
            } 
            return opt[1].toLowerCase().indexOf(evt.target.value.toLowerCase()) !== -1 
        })
        this.setState({
            filteredOptions: newOptions,
            inputVal: evt.target.value,
            selected: selected ? selected : this.state.selected
        })

    }

    selectOption = (evt) => {
        console.log('called')
        console.log(evt)
        this.setState({
            selected: evt.target.dataset.pk,
            inputVal: evt.target.textContent
        })
    }

    render() {
        return (
            <div class={styles.container} >
                <input type='hidden' name={this.props.name} value={this.state.selected} />
                <input 
                    class='form-control' 
                    type='text' 
                    value={this.state.inputVal} 
                    onChange={this.handleInputChange}
                    onFocus={() => this.setState({showOptions: true})} />
                <ul class={styles.option_list} style={{display: this.state.showOptions ? "block": "none"}}>
                    <li  class={styles.new_option}>Create New</li>
                    {this.state.filteredOptions.map(opt => (
                        <li data-pk={opt[0]} onClick={this.selectOption}>{opt[1]}</li>
                    ))}
                </ul>
            </div>
        )
    }
}

export default Radium(SelectThree)