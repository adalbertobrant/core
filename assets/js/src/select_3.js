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
    }

    refreshOptions = () => {
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

    componentDidMount() {
        this.refreshOptions()
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
        this.setState({
            selected: evt.target.dataset.pk,
            inputVal: evt.target.textContent
        })
    }

    handleCreateNew = () => {
        console.log('create new')
        this.setState({showOptions: false})
        ReactDOM.render(<QuickEntry 
            
            app={this.props.app}
            model_name={this.props.model}/>, document.getElementById("quick-entry"))
    }

    render() {
        return (
            <div className={styles.container} >
                <input type='hidden' name={this.props.name} value={this.state.selected} />
                <input 
                    className='form-control' 
                    type='text' 
                    value={this.state.inputVal} 
                    onChange={this.handleInputChange}
                    onFocus={() => {
                        this.refreshOptions()
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