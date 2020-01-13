import React, {Component} from 'react';
import axios from 'axios';
import TitleBar from '../components/title_bar';
import Row from '../components/row';
import ProgressBar from '../components/progress_bar';
import setMultipleAttrs from '../../utils';
/**
 * the mutable table does not have any input lines
 * it has a prepolulated list of items with one or more fields that 
 * can be modified.
 * 
 * Props 
 * formHiddenFieldName - string 
 * headings- array of strings
 * fields -array of objects in the form of:
 *  {
 *      name: <>,
 *      mutable: <>,
 *  }  
 *  dataURL -string for fetching the table
 *  resProcessor - a function that takes axios data as an argument and 
 *  returns an array based on that data
 * 
 */

 const getSubmit = () =>{
     let button = document.querySelector("button[type='submit']");
     if(button){
         return button
     }
     return document.querySelector("input[type='submit']")
 }

class MutableTable extends Component{
    state = {
        data: [],
        processed: [],
        next: null,
        previous: null
    }

    urlHandler = (url, postStateChange) =>{
        axios({
            'url': url,
            'method': 'GET'
        }).then(res =>{
            //check pagination
            this.setState({data: this.props.resProcessor(res).map((data) =>({
                ...data,
                verified: false,         
            })),
            next: 'next' in res.data ? res.data.next : null,
            previous: 'previous' in res.data ? res.data.previous : null,
        }, postStateChange())
    })
    }

    componentDidMount(){
        //start off by disabling the submit button
        let submitButton = getSubmit();
        if(submitButton){
            submitButton.setAttribute('disabled', 'disabled');
        }

        let form = document.forms[0];
        this.urlHandler(this.props.dataURL, () =>{
            let input = document.createElement("input");
                setMultipleAttrs(input, {
                    'type': 'hidden',
                    'name': this.props.formHiddenFieldName,
                    'value': encodeURIComponent(JSON.stringify(this.state.data)),
                    'id': `id_${this.props.formHiddenFieldName}`
                })
                form.appendChild(input);
        })
    }

    nextHandler = () =>{
        this.urlHandler(this.state.next, () =>{
            console.log(this.state)
        })
    }

    prevHandler = () =>{
        this.urlHandler(this.state.previous, () =>{
            console.log(this.state)
        })
    }

    toggleVerify = (rowID) =>{
        let newData = [...this.state.data];
        let newRow = {...this.state.data[rowID]};
        newRow['verified'] = !newRow.verified;
        newData[rowID] =  newRow;
        this.setState({data: newData}, this.verifyHandler);
    }

    verifyHandler = () =>{
        // iterate over all lines if all are verified enable the submit button 

        let i;
        let verified = true;
        for(i=0; i < this.state.data.length; i++){
            if(!this.state.data[i].verified){
                verified = false;
            }
        }
        if(verified){
            let submitButton = getSubmit();
            if(submitButton){
                submitButton.removeAttribute('disabled');
            }
        }else{
            let submitButton = getSubmit();
            if(submitButton){
                submitButton.setAttribute('disabled', 'disabled');
            }
        }
    }

    updateForm = () =>{
        let input = document.getElementById(`id_${this.props.formHiddenFieldName}`);
        const formValue = encodeURIComponent(JSON.stringify(
            this.state.data));
        input.setAttribute('value', formValue);
                
    }
    inputHandler = (evt) =>{
        const inputComponents = evt.target.name.split("__");
        const rowID = inputComponents[0];
        const fieldName = inputComponents[1];

        let newData = [...this.state.data];
        let newField = newData[rowID];
        newField[fieldName] = evt.target.value; 
        newData[rowID] = newField;

        this.setState({data: newData}, this.updateForm);
    }

    render(){
        return(
            <div>
                <ProgressBar data={this.state.data} />
                <table className="table">
                <TitleBar headings={this.props.headings}/>          
                    <tbody>
                        {this.state.data.length === 0 ? 
                            <tr>
                                <td colSpan={this.props.headings.length -1}>
                                    <b>This List Has No Items</b>
                                </td>
                            </tr>
                            : this.state.data.map((fieldData, i) =>(
                                <Row
                                    key={i}
                                    fieldData={fieldData}
                                    fields={this.props.fields}
                                    rowID={i}
                                    root={this}
                                    inputHandler={this.inputHandler}
                                    toggle={this.toggleVerify}/>
                            ))
                        }
                    </tbody>
                </table>
                <div style={{
                    display: this.state.previous == null && 
                             this.state.next == null
                        ? 'none'
                        : 'block'}}>
                    <button className='primary text-white btn'
                        disabled={this.state.previous == null}
                        onClick={this.prevHandler}>
                        <i className="fa fa-arrow-left" aria-hidden="true"></i> Prev</button>
                    <button className='primary text-white btn'
                        disabled={this.state.next == null}
                        onClick={this.nextHandler}>
                        Next <i className="fa fa-arrow-right" aria-hidden="true"></i></button>
                </div>
            </div>
            )
    }
}

export default MutableTable;