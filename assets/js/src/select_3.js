import React, {Component} from 'react';
import axios from './auth';
import styles from './select_3.css';
import Radium from 'radium';
import QuickEntry from './quick_entry';
import ReactDOM from 'react-dom';
class SelectThree extends Component {
    state = {
        inputVal: "",
        selected: null,
        options: [],
        filteredOptions: [],
        showOptions: false,
        has_quick_entry: false
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.selected != prevState.selected && this.state.showOptions) {
            this.setState({showOptions: false})
        }
        if(this.props.toggleClear != prevProps.toggleClear) {
            this.setState({
                inputVal: "",
                filteredOptions: this.state.options,
                selected: null
        })
        }
    }

    refreshOptions = (initial) => {
        axios({
            'method': 'GET',
            url: `/base/api/model-items/${this.props.app}/${this.props.model}/` 
        }).then((resp) =>{
            this.setState({
                options: resp.data.data,
                filteredOptions: resp.data.data,
            }, () => {
                if(this.props.initial && initial) {
                    const selectedText = resp.data.data.filter(opt => opt[0] == this.props.initial)[0][1]
                    this.setState({
                        selected: this.props.initial,
                        inputVal: selectedText
                    })
                }})
        })
    }

    componentDidMount() {
        this.refreshOptions(true)
        axios({
            'method': 'GET',
            url: `/base/api/supports-quick-entry/${this.props.app}/${this.props.model}/` 
        }).then((resp) =>{
            this.setState({
                has_quick_entry: resp.data.supports_quick_entry,
            })
        })
    }

    handleInputChange = (evt) => {
        if(evt.target.value == "" && this.state.selected) {
            if(this.props.onClear) {
                this.props.onClear()
            }
            this.setState({
                filteredOptions: this.state.options,
                inputVal: "",
                selected: null
            }, () => $(`input[name="${this.props.name}"]`).trigger('change'))
            return
        }
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
        }, () => { 
            if(!this.props.name) { return }
            const target = document.querySelector(`input[name="${this.props.name}"]`)
            const event = new Event('change');
            target.dispatchEvent(event);
        })
    }

    selectOption = (evt) => {
        this.setState({
            selected: evt.target.dataset.pk,
            inputVal: evt.target.textContent
        }, () => {
            this.props.onSelect ? this.props.onSelect(this.state): null
            if(!this.props.name) { return }
            const target = document.querySelector(`input[name="${this.props.name}"]`)
            const event = new Event('change');
            target.dispatchEvent(event);
        })
    }

    handleCreateNew = () => {
        this.setState({showOptions: false})
        ReactDOM.render(<QuickEntry 
            
            app={this.props.app}
            model_name={this.props.model}/>, document.getElementById("quick-entry"))
    }

    render() {
        return (
            <div className={styles.container} >
                {this.props.name 
                    ? <input type='hidden' name={this.props.name} value={this.state.selected} />
                    : null }
                <input 
                    className='form-control form-control-sm' 
                    type='text' 
                    value={this.state.inputVal} 
                    onChange={this.handleInputChange}
                    onFocus={() => {
                        this.refreshOptions(false)
                        this.setState({showOptions: true})
                    }}
                    onBlur={() => setTimeout(() =>this.setState({showOptions: false}), 500)} />
                <ul className={styles.option_list} style={{display: this.state.showOptions ? "block": "none"}}>
                    {this.state.has_quick_entry 
                        ? <li  className={styles.new_option} onClick={this.handleCreateNew}>Create New</li> 
                        : null}
                    {this.state.filteredOptions.map(opt => (
                        <li data-pk={opt[0]} onClick={this.selectOption}>{opt[1]}</li>
                    ))}
                </ul>
            </div>
        )
    }
}

export default Radium(SelectThree)