import React, {Component} from 'react';
import SearchableWidget from '../../src/components/searchable_widget';
import AsyncSelect from '../../src/components/async_select';
import axios from '../../src/auth';


//!! Important, should not set up create new button as there is no way of filtering billable expenses for now
class ExpenseEntry extends Component{
    state = {
        tax: 0,
        discount: 0,
        expense: ""
    }

    componentDidUpdate(prevProps, prevState){
        if (this.props.itemList.length !== prevProps.itemList.length){
            this.setState({
                quantity: 0,
                unitPrice: 0
            })
            //remove selected choice from list of choices 
        }
    }

    taxHandler = (value) =>{
        axios({
            method: 'get',
            url: '/accounting/api/tax/' + value
        }).then(res =>{
            this.setState({tax: res.data.id + ' - ' 
                                + res.data.name  + '@' 
                                + res.data.rate}, 
                () => this.props.changeHandler(this.state))

        })
    }

    handleBillable = (value) =>{
        const pk = value.split('-')[0];
        axios({
            method: 'get',
            url: '/accounting/api/expense/' + pk 
        }).then(res =>{
            this.setState({
                selected: value,
                amount: res.data.amount,
                description: res.data.description
            }, () => this.props.changeHandler(this.state))
        })
    }

    clearHandler = () =>{
        let tax = document.getElementById('product-tax');
        tax.value = 1;
        this.setState({
            selected: "",
            amount: 0,
            description: "",
            discount: 0,
            tax: 1
        }, () => this.props.changeHandler(this.state));
    }

    handler = (evt) =>{
        const name = evt.target.name;
        let newState = {...this.state};
        newState[name] = evt.target.value
        this.setState(newState, () => this.props.changeHandler(this.state));
    }


    
    render(){
        if(this.props.billables.length === 0){
            return(
                <div>
                    <center>
                        <h6>The selected customer has no billable expenses</h6>
                        <button 
                        style={{width:"100%"}}
                        className="btn"
                        type='button'
                        onClick={() => window.open(
                            '/accounting/expense/create' ,'popup','width=900,height=480')}>
                        Add Expense <i className="fas fa-plus"></i>
                    </button>
                    </center>
                </div>
            )
        }else{
            return(window.screen.width > 575 ? 
                <table style={{width:"100%"}}>
                    <thead>
                        <tr>
                            <th style={{width: '55%'}}>Expense</th>
                            <th style={{width: '15%'}}>Discount</th>
                            <th style={{width: '15%'}}>Tax</th>
                            <th style={{width: '15%'}}></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <SearchableWidget 
                                    widgetID="expense-widget"
                                    dataURL={`/accounting/api/expense/customer/${document.getElementById('id_customer').value}`}
                                    onSelect={this.handleBillable}
                                    //newLink="/accounting/expense/create"
                                    model="expense"
                                    app="accounting"
                                    onClear={this.clearHandler}
                                    idField="id"
                                    displayField="description" />
                            </td>
                            <td>
                                <input 
                                    className='form-control'
                                    type="number"
                                    name="discount"
                                    value={this.state.discount}
                                    onChange={this.handler}/>
                            </td>
                            <td>
                            <AsyncSelect 
                            dataURL="/accounting/api/tax"
                            name="tax"
                            resProcessor={(res) =>{
                                return res.data.map((tax) =>({
                                    name: tax.name,
                                    value: tax.id
                                }))
                            }}
                            handler={this.taxHandler}/>
                            </td>
                            <td>
                            <button 
                                onClick={this.props.insertHandler} 
                                type='button'
                                className="invoice-btn" >Insert</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                :
                <div>
                <label htmlFor="">Expense:</label>
                <SearchableWidget 
                    widgetID="expense-widget"
                    dataURL={`/accounting/api/expense/customer/${document.getElementById('id_customer').value}`}
                    onSelect={this.handleBillable}
                    //newLink="/accounting/expense/create"
                    model="expense"
                    app="accounting"
                    onClear={this.clearHandler}
                    idField="id"
                    displayField="description" />
            <label htmlFor="">Discount</label>
                <input 
                    className='form-control'
                    type="number"
                    name="discount"
                    value={this.state.discount}
                    onChange={this.handler}/>
            <label htmlFor="">Tax: </label>
            <AsyncSelect 
            dataURL="/accounting/api/tax"
            name="tax"
            resProcessor={(res) =>{
                return res.data.map((tax) =>({
                    name: tax.name,
                    value: tax.id
                }))
            }}
            handler={this.taxHandler}/>
            
            <button 
                onClick={this.props.insertHandler} 
                type='button'
                className="invoice-btn" >Insert</button>
                </div>
            )
        }
    }   
}

export default ExpenseEntry;