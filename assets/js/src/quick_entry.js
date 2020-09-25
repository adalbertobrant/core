import React, {Component, useState, useEffect} from 'react';
import styles from './quick_entry.css';
import axios from './auth'
import ReactDOM from 'react-dom';

class QuickEntry extends Component{
    state = {
        fields: [],
        data: {},
        message: ""
    }

    componentDidMount(prevProps, prevState) {
        axios({
            method: 'GET',
            url: `/base/api/get-quick-entry-fields/${this.props.app}/${this.props.model_name}`
        }).then(res =>{
            this.setState({fields: res.data.data})
        })
    }

    handleInputChange = (field, value) => {
        const newData = {...this.state.data}
        newData[field] = value
        this.setState({data: newData})
    }
    

    handleSubmit =() => {
        if(Object.keys(this.state.data).length != this.state.fields.length) { return }
        axios({
            method: 'POST',
            url: `/base/api/create-via-quick-entry/${this.props.app}/${this.props.model_name}`,
            data: this.state.data
        }).then(res =>{
            if(res.error) {
                this.setState({message: error})
                return
            }
            ReactDOM.unmountComponentAtNode(document.getElementById('quick-entry'))
        })
    }

    handleCancel =() => {
        ReactDOM.unmountComponentAtNode(document.getElementById('quick-entry'))
    }


    render() {
        return (
            <div className={styles.modal} >
                <div className={styles.modal_body}>
                    <h4>New {this.props.model_name}</h4>
                    <hr/>
        <p style={{fontWeight: 500, color: "crimson"}}>{this.state.message}</p>
                    <div>
                        {this.state.fields.map(field => {
                            if(field.fieldtype == "bool") {
                                return <BoolField {...field} 
                                            onEvt={this.handleInputChange}/>
                            }

                            if(field.fieldtype == "char") {
                                return <CharField {...field} 
                                            onEvt={this.handleInputChange}/>
                            }

                            if(field.fieldtype == "text") {
                                return <TextField {...field} 
                                            onEvt={this.handleInputChange}/>
                            }

                            if(field.fieldtype == "number") {
                                return <NumberField {...field} 
                                            onEvt={this.handleInputChange}/>
                            }

                            if(field.fieldtype == "select") {
                                return <SelectField {...field} 
                                            onEvt={this.handleInputChange}/>
                            }

                            if(field.fieldtype == "link") {
                                return <LinkField {...field} 
                                            onEvt={this.handleInputChange}/>
                            }
                        })}
                        <div className='btn-group' style={{display: "flex", justifyContent:"flex-end"}}>
                        <button className="btn btn-sm"
                                onClick={this.handleCancel}>Cancel</button>
                            <button className="btn btn-sm btn-primary"
                                onClick={this.handleSubmit}>Create</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
} 


const BoolField = (props) => (
<div className="form-group">
    <label>{props.label}:</label><br/>
    <input name={props.name} 
        className="form-control form-control-sm"
        type="checkbox"
        onChange={evt => props.onEvt(props.name, evt.target.value == "on" ? true : false)} />
</div>
)


const CharField = (props) => (
    <div className="form-group">
        <label>{props.label}:</label>
        <input name={props.name} 
            className="form-control form-control-sm"
            type="text"
            onChange={evt => props.onEvt(props.name, evt.target.value)} />
    </div>
)


const NumberField = (props) => (
    <div className="form-group">
        <label>{props.label}:</label>
        <input name={props.name} 
            className="form-control form-control-sm"
            type="number"
            onChange={evt => props.onEvt(props.name, evt.target.value)} />
    </div>
)

const TextField = (props) => (
    <div className="form-group">
        <label>{props.label}:</label>
        <textarea 
            className="form-control form-control-sm" 
            rows={4}
            onChange={evt => props.onEvt(props.name, evt.target.value)}></textarea>
    </div>
)


const SelectField = (props) => (
    <div className="form-group">
        <label>{props.label}:</label>
        <select className="form-control form-control-sm"
            onChange={evt => props.onEvt(evt.target.value)}>
            {props.options.map(opt => <option value={opt[0]}>{opt[1]}</option>)}
        </select>
    </div>
)
const LinkField = (props) =>{ 
    const [value, setValue] = useState(null)
    const [opts, setOpts] = useState([])
    useEffect(() => {
        const [app,model] = props.options.split(".")
        axios({
            method: 'GET',
            url: `/base/api/model-items/${app}/${model}`
        }).then(res => setOpts(res.data.data.map(opt => ({pk: opt[0], label: opt[1]}))))

    }, [])

    useEffect(() => {
        const match = opts.filter(opt => opt.label == value)
        if(match.length > 0){
            props.onEvt(props.name, match[0].pk)
        }
    }, [value])

    return (
    <div className="form-group">
        <label>{props.label}:</label>
        <input className="form-control form-control-sm"
            list={props.name +"_list"}
            onChange={evt => setValue(evt.target.value)}
            />
        <datalist id={props.name + "_list"}>
            {opts.map(opt => {
                return (<option data-value={opt.pk} key={opt.pk}>{opt.label}</option>)
            })}
            
        </datalist>
    </div>
    )
}

export default QuickEntry