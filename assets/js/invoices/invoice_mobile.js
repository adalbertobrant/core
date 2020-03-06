import React, {Component, useState, useEffect} from 'react';
import axios from 'axios';
import {DeleteButton} from '../src/common';
import styles from './styles.css'
import EntryWidget from './invoice_entry'

export default class MobileInvoiceTable extends Component{
    state = {
        taxObj: null,
        tax: 0.0,
        subtotal: 0.0,
        total: 0.0,
        discount: 0.0,
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

    updateTotals =(newItems) =>{
        const subtotals = newItems.map((item) => {
            if(item.type == 'product'){
                return(item.unitPrice * parseFloat(item.quantity))
            }else if(item.type=='service'){
                return((parseFloat(item.hours) * parseFloat(item.rate)) +
                parseFloat(item.fee))
            }else{
                return(item.amount)
            }
        })
        const newSubtotal = subtotals.reduce((total, item) => (total + item), 0)
        
        const discounts = newItems.map((item, i) =>{
            return(subtotals[i] * (item.discount / 100.0))
        })
        
        const taxes = newItems.map((item, i) =>{
            let taxRate = parseFloat(item.tax.split('@')[1])
            return((subtotals[i] - discounts[i]) * taxRate/100.0 )
        })
        const newTax = taxes.reduce((total, item) => (total + item), 0)

        const newDiscount = discounts.reduce((total, item) => (total + item), 0)
        
        const newTotal = newSubtotal + newTax - newDiscount
        return {
            discount: newDiscount,
            tax: newTax,
            subtotal: newSubtotal,
            total: newTotal
        };
    }
    
    insertHandler = (data) =>{
        let newItems = [...this.state.items];
        newItems.push(data);
        const totals = this.updateTotals(newItems)
        this.setState({ ...totals,
            items: newItems,
        }, this.updateForm);
    }

    deleteHandler = (index) =>{
        let newItems = [...this.state.items];
        newItems.splice(index, 1);
        const totals = this.updateTotals(newItems)
        this.setState({...totals, items: newItems}, this.updateForm);
        
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
                    backgroundColor: '#23374d',
                    width: '100%'
                }}>
                    <th style={{width:"10%"}}></th>
                    <th style={{width:"65%"}}>Description</th>
                    <th style={{width:"25%"}}>SubTotal</th>
                </tr>
            </thead>
            <tbody>
            {this.state.items.map((item, i) =>{
                let line;
                if(item.type === "product"){
                    line = <SaleLine 
                                {...item}
                                key={i}
                                index={i}
                                handler={this.deleteHandler}/>
                }else if(item.type === "service"){
                    line = <ServiceLine  
                                {...item}
                                key={i}
                                index={i}
                                handler={this.deleteHandler}/>
                }else{
                    line = <BillableLine  
                                {...item}
                                key={i}
                                index={i}
                                handler={this.deleteHandler}/>
                }
                return(line);
            }
            )}

            <tr>
                <td colSpan={2} >
                    <button type='button' className="btn btn-primary"
                        onClick={() => this.setState({
                            entryWidgetVisible: true})}>Add Item</button>
                </td>
                <td></td>
            </tr>
            
            </tbody>
            <tfoot>
                <tr>
                    <th colSpan={2}>Subtotal</th>
                    <td>{this.state.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                    <th colSpan={2}>Discount</th>
                    <td>{this.state.discount.toFixed(2)}</td>
                </tr>
                <tr>
                    <th colSpan={2}>Tax</th>
                    <td>{this.state.tax.toFixed(2)}</td>
                </tr>
                <tr>
                    <th colSpan={2}>Total</th>
                    <td>{this.state.total.toFixed(2)}</td>
                </tr>
            </tfoot>
        </table>
        <EntryContainer 
            itemList={this.state.items}
            insertHandler={this.insertHandler}
            active={this.state.entryWidgetVisible}
            dismiss={() =>this.setState({entryWidgetVisible: false})} />
            </React.Fragment>
            
        );
    }
}


const EntryContainer = (props) =>{
    return (<div className={styles.overlay} style={{display: props.active ? 'flex': 'none'}}>
        <div className={styles.content}>
            <div className={styles.contentHeader}>
                <h4>Add Item</h4>
                <button className='btn btn-danger ' onClick={props.dismiss}><i className="fas fa-times" aria-hidden="true"></i></button>
            </div>
            <div>
                <EntryWidget
                    modalDismiss={props.dismiss}
                    itemList={props.itemList}
                    insertHandler={props.insertHandler} />
            </div>
        </div>
    </div>)
}

const SaleLine = (props) =>{
    const subtotal = props.unitPrice * parseFloat(props.quantity);
    const discount =  subtotal * (props.discount / 100.0)
    const taxRate = parseFloat(props.tax.split('@')[1])
    const tax = (subtotal - discount) * (taxRate /100.0) 
    const total = subtotal - discount + tax
    return(
        <tr>
            <td>
                <DeleteButton 
                    index={props.index}
                    handler={props.handler}/>
            </td>
            <td>
                {props.quantity} x {
                    props.selected.split('-')[1]
                } @ ${parseFloat(props.unitPrice).toFixed(2)} each.
            </td>
            <td>{total.toFixed(2)}</td>
        </tr>
    )
}

const ServiceLine = (props) =>{
    const subtotal = (parseFloat(props.hours) * parseFloat(props.rate)) +
         parseFloat(props.fee);
    const discount =  subtotal * (props.discount / 100.0)
    const taxRate = parseFloat(props.tax.split('@')[1])
    const tax = (subtotal - discount) * (taxRate /100.0) 
    const total = subtotal - discount + tax

    return(
        <tr>
            <td>
                <DeleteButton
                    index={props.index}
                    handler={props.handler}/>
            </td>
            <td>{
                props.selected.split('-')[1]
            } - Flat Fee: ${props.fee} + {props.hours}Hrs x @ ${props.rate} /Hr</td>
            
            <td>{total.toFixed(2)}</td>
        </tr>
    )
}

const BillableLine = (props) =>{
    const subtotal  =parseFloat(props.amount);
    const discount =  subtotal * (props.discount / 100.0)
    const taxRate = parseFloat(props.tax.split('@')[1])
    const tax = (subtotal - discount) * (taxRate /100.0) 
    const total = subtotal - discount + tax
    return(
        <tr>
            <td>
                <DeleteButton 
                    index={props.index}
                    handler={props.handler}/>
            </td>
            <td>{props.description} @ ${props.amount}</td>
            
            <td>{total.toFixed(2)}</td>
        </tr>
    )
}
