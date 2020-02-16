import React, {Component, useState, useEffect} from 'react';
import axios from 'axios';
import {DeleteButton} from '../src/common';
import styles from './styles.css'

export default class MobileInvoiceTable extends Component{
    state = {
        taxObj: null,
        tax: 0.0,
        subtotal: 0.0,
        total: 0.0,
        items: [],
        entryWidgetVisible: false
    }

    componentDidMount(){
        $('<input>').attr({
            type: 'hidden',
            value: '',
            id: 'id_item_list',
            name: 'item_list'
        }).appendTo('form');

         //check if the page is an update
         let URL = window.location.href;
         let decomposed = URL.split('/');
         let tail = decomposed[decomposed.length - 1];
         
         if(tail !== 'create-invoice'){
             axios({
                 url: '/invoicing/api/invoice/' + tail,
                 method: 'GET',
             }).then(res =>{
                let itemList = res.data.invoiceline_set.map((line) =>{
                    let lineMappings = {
                        1: 'product',
                        2: 'service',
                        3: 'expense'
                    };
                    let data;
                    if(line.line_type === 1){
                        data = {
                            selected: line.product.product.id + '-' + line.product.product.name,
                            quantity: parseFloat(line.product.quantity),
                            unitPrice: parseFloat(line.product.unit_price),
                            
                        };
                    }else if (line.line_type === 2){
                        data = {
                            selected: line.service.id + '-' + line.service.service.name,
                            hours: line.service.hours,
                            rate: line.service.hourly_rate,
                            fee: line.service.flat_fee
                        }
                    }else if (line.line_type === 3){
                        data = {
                            selected: line.expense.id + '-' +line.expense.expense.description,
                            description: line.expense.expense.description,
                            amount: line.expense.expense.amount 
                        }
                    }
                    return {
                        type: lineMappings[line.line_type],
                        ...data,
                        discount: parseFloat(line.discount),
                        tax: line.tax.id +'-'+line.tax.name +
                                    '@'+line.tax.rate
                     }
                 })
                 this.setState({items: itemList}, this.updateForm);
             });
        }
    }
    
    insertHandler = (data) =>{
        let newItems = [...this.state.items];
        newItems.push(data);
        this.setState({items: newItems}, this.updateForm);
    }

    deleteHandler = (index) =>{
        let newItems = [...this.state.items];
        newItems.splice(index, 1);
        this.setState({items: newItems}, this.updateForm);
        
    }

    updateForm = () => {
        $('#id_item_list').val(
            encodeURIComponent(JSON.stringify(this.state.items))
        );
    }

    render(){
        return(
            <React.Fragment>
            <table className="table tight">
            <thead>
                <tr style={{
                    padding: '2mm',
                    color: 'white',
                    backgroundColor: '#07f',
                    width: '100%'
                }}>
                    <th style={{width:"10%"}}></th>
                    <th style={{width:"65%"}}>Description</th>
                    <th style={{width:"25%"}}>Line Total</th>
                </tr>
            </thead>
            <tbody>
                {this.state.items.map((item, i) =>{
                    return(null)}
                )}

            <tr>
                <td colSpan={2} >
                    <button className="btn btn-primary"
                        onClick={() => this.setState({
                            entryWidgetVisible: true})}>Add Item</button>
                </td>
                <td></td>
            </tr>
            
            </tbody>
            <tfoot>
                <tr>
                    <th colSpan={2}>Subtotal</th>
                    <td></td>
                </tr>
                <tr>
                    <th colSpan={2}>Discount</th>
                    <td></td>
                </tr>
                <tr>
                    <th colSpan={2}>Tax</th>
                    <td></td>
                </tr>
                <tr>
                    <th colSpan={2}>Total</th>
                    <td></td>
                </tr>
            </tfoot>
        </table>
        <EntryWidget 
            active={this.state.entryWidgetVisible}
            dismiss={() =>this.setState({entryWidgetVisible: false})} />
            </React.Fragment>
            
        );
    }
}


const EntryWidget = (props) =>{
    const [focused, setFocused] = useState('product')
    const tabStyle = {
        listStyleType: 'none',
        display: 'inline-block',
        borderRadius: '5px 5px 0px 0px',
        padding: '5px',
        borderStyle: 'solid',
        borderColor: 'white'
    }

    return (<div className={styles.overlay} style={{display: props.active ? 'block': 'none'}}>
        <div className={styles.content}>
            <div className={styles.contentHeader}>
                <h4>Add Item</h4>
                <button class='btn btn-danger ' onClick={props.dismiss}><i class="fas fa-times" aria-hidden="true"></i></button>
            </div>
            <div>
            <ul style={{listStylePosition: 'inside', paddingLeft: '0px'}}>
            <li 
                id="product" 
                style={{...tabStyle,
                    borderWidth: focused ==="product"
                    ? '1px 1px 0px 1px '
                    : '0px 0px 1px 0px ',}}
                onClick={()=> setFocused('product')}>Product</li>
            <li 
                id="service" 
                style={{...tabStyle,
                    borderWidth: focused ==="service"
                    ? '1px 1px 0px 1px '
                    : '0px 0px 1px 0px ',}}
                onClick={()=> setFocused('service')}>Service</li>
            <li 
                id="expense" 
                style={{...tabStyle,
                    borderWidth: focused ==="expense"
                    ? '1px 1px 0px 1px '
                    : '0px 0px 1px 0px ',}}
                onClick={()=> setFocused('expense')}>Expense</li>
        </ul>
            </div>
        </div>
    </div>)
}