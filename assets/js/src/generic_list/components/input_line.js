import React, {Component} from 'react';
import {AsyncSelect } from '../../common';
import SearchableWidget from "../../components/searchable_widget";
import styles from './styles.css'

/* fieldOrder - array of strings 
   insertHandler - function
   fields - array of objects
*/
class inputLine extends Component{
    state = {
        data: {},
        fetchField: null,
        selectedPk: null,
        isReset: true
    }
    inputHandler = (evt) =>{
        let newData = {...this.state.data};

        newData[evt.target.name] = evt.target.value;
        this.setState({
            data: newData,
            isReset: false
        });
    }

    resetFields =() =>{
        let newData = {};
        let i = 0;
        for( i in this.props.fields){
            newData[this.props.fields[i].name] = "";
        }
        this.setState({
            data: newData,
            selectedPk: null,
            isReset: true
        });
        //actually reset the fields

    }

    componentDidMount =  () => {
        this.resetFields();
    }
    
    componentDidUpdate(prevProps, prevState) {
        if(this.state.selectedPk !==  prevState.selectedPk && 
                this.state.fetchField !== null){
            this.state.fetchField.dataGetter(
                    this, 
                    this.state.fetchField.name, 
                    this.state.selectedPk
                );
        }
    }

    insertHandler = () =>{
        //clear field values before passing data to parent
        // iterate over every
        if(this.props.hasLineTotal){
            let newData = {...this.state.data};
            
            newData['lineTotal'] = 
                this.props.calculateTotal(
                    this.state.data).toFixed(2);
            this.props.insertHandler(newData);
            
        }else{
            this.props.insertHandler(this.state.data);
        }

        this.resetFields();
    }
    searchHandler = (name, value) =>{
        //for searchable widget and asyncwidget
        let newData = {...this.state.data};
        newData[name] = value;
        const pk = value.split('-')[0];
        this.setState({
            data: newData,
            selectedPk: parseInt(pk),
            isReset: false
        });
    }

    asyncResProcessor = (res) =>{
        return res.data.map((item, i)=>(
            {
                value: item.id + '-' + item.name,
                name: item.name
            }
        ))
    }
    fieldSelector = (fieldIndex) =>{
        const field = this.props.fields[fieldIndex];
        
        switch(field.type){
            case 'fetch':
                if(!this.state.fetchField){
                    this.setState({fetchField: field})
                }
                return <span>{this.state.data[field.name]}</span>;
                break;
            case 'select':
                return <AsyncSelect 
                    resetFlag={this.state.isReset}
                    handler={(val) => this.searchHandler(field.name, val)}
                    resProcessor={this.asyncResProcessor}
                    dataURL={field.url}/>
                break;
            case 'text':
                //controlled without a reset flag
                return <input 
                        type="text"
                        className="form-control form-control-sm"
                        onChange={this.inputHandler}
                        name={field.name}
                        value={this.state.data[field.name]}
                        />;    
                    break;
            case 'date':
                //controlled without a resetFlag
                return <input 
                        type="date"
                        className="form-control form-control-sm"
                        onChange={this.inputHandler}
                        name={field.name}
                        value={this.state.data[field.name]}
                        />;    
                    break;
            case 'number':
                //controlled without a reset flag
                return <input 
                    type="number"
                    className="form-control form-control-sm"
                    onChange={this.inputHandler}
                    name={field.name}
                    value={this.state.data[field.name]}
                    />;
                break;
            case 'search': 
                return <SearchableWidget 
                    resetFlag={this.state.isReset}
                    list={this.props.lines}
                    dataURL={field.url}
                    idField={field.idField}
                    model={field.model}
                    app={field.app}
                    canCreateNewItem={field.canCreateNewItem}
                    displayField={field.displayField}
                    newLink={field.newLink}
                    onSelect={(val) => this.searchHandler(field.name, val)}
                    onClear={() => this.searchHandler(field.name, "")}/>
                break;

            case 'widget':
                // function that takes the component as 
                // an argument so it can independantly set state etc.
                //each widget must implement the reset flag
                return field.widgetCreator(this);
                break;
            default:
                return null;
        }
    }
    render(){
        return(
                window.screen.width > 575 ? 
                <tbody>
                    <tr className="bg-primary text-white tight"
                    style={{
                        borderTop: '2px solid white',
                    }}>
                    <td></td>
                    {this.props.fieldOrder.map((fieldName, i) =>(
                        <td key={i}>
                            {this.fieldSelector(i)}
                        </td>
                    ))}
                    <td> 
                        <div>
                        <button 
                            style={{ margin: '5px'}}
                            className="btn btn-sm"
                            type="button"
                            onClick={this.insertHandler}>Insert</button>
                        </div>
                    </td>
                </tr>
                </tbody>
                :
                <div  className={styles.overlay} style={{display: this.props.active ? 'flex': 'none'}}>
                    <div className={styles.content}>
                        <div className={styles.contentHeader}>
                            <h4>Add Item</h4>
                            <button className='btn btn-danger ' type='button' onClick={this.props.dismiss}><i className="fas fa-times" aria-hidden="true"></i></button>
                        </div>
                        {this.props.fieldOrder.map((fieldName, i) =>(
                            <React.Fragment>
                                <label htmlFor="">{fieldName}</label>
                                {this.fieldSelector(i)}
                            </React.Fragment>
                        ))}
                
                        <button 
                            style={{ margin: '5px', marginTop: '12px'}}
                            className="btn btn-sm btn-block"
                            type="button"
                            onClick={this.insertHandler}>Insert</button>
                    </div>
                </div>

        );
    }
}

export default inputLine;