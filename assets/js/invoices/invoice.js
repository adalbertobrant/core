import React, {Component} from 'react';
import axios from '../src/auth';
import {DeleteButton} from '../src/common';
import EntryWidget from './invoice_entry';
import Totals from './invoice_totals';

export default class InvoiceTable extends Component{
    state = {
        taxObj: null,
        tax: 0.0,
        subtotal: 0.0,
        total: 0.0,
        items: [],
        currency: null,
        exchange_rate: 1
    }

    componentDidMount(){
        $('<input>').attr({
            type: 'hidden',
            value: '',
            id: 'id_item_list',
            name: 'item_list'
        }).appendTo('form');

        setTimeout(() =>{$('input[name="currency"]').change( evt => {
            console.log('change')
            const id = evt.target.value
            axios({
                method:'GET',
                url: '/accounting/api/currency/' + id
            }).then(res => {
                this.setState({currency: res.data})
            })
        })}, 2000)

        $('#id_exchange_rate').on('change', evt => {
            this.setState({exchange_rate: parseFloat(evt.target.value)})
        })

         //check if the page is an update
         let URL = window.location.href;
         let decomposed = URL.split('/');
         let tail = decomposed[decomposed.length - 1];
         
         if(!['create-invoice', 'create-quotation'].includes(tail)){
             axios({
                 url: '/invoicing/api/invoice/' + tail,
                 method: 'GET',
             }).then(res =>{
                let itemList = res.data.invoiceline_set.map((line) =>{
                    let data;
                    if(line.line_type === 1){
                        let tax_rate = line.tax ? line.tax.rate : null
                        let line_total = parseFloat(line.product.quantity) * parseFloat(line.product.unit_price)
                        let tax = tax_rate ? line_total * (tax_rate / 100.0): 0.00
                        let subtotal = line_total + tax
                        data = {
                            item: line.product.product.id,
                            item_label: line.product.product.name,
                            unit: line.product.product.unit ? line.product.product.unit.id : null,
                            unit_label: line.product.product.unit ? line.product.product.unit.name : "",
                            type: 'product',
                            qty: parseFloat(line.product.quantity),
                            unit_price: parseFloat(line.product.unit_price),
                            rate: parseFloat(line.product.unit_price),
                            subtotal: subtotal,
                            tax: tax,
                            tax_id: line.tax ? line.tax.id : null,
                            tax_rate: tax_rate
                        };
                    }else if (line.line_type === 2){
                        let tax_rate = line.tax ? line.tax.rate : null
                        let line_total = parseFloat(line.service.flat_fee) + (parseFloat(line.service.hours) * parseFloat(line.service.hourly_rate))
                        let tax = tax_rate ? line_total * (tax_rate / 100.0): 0.00
                        let subtotal = line_total + tax
                        data = {
                            item: line.service.service.id,
                            item_label: line.service.service.name,
                            unit: null,
                            unit_label: "Hrs",
                            type: 'service',
                            qty: parseFloat(line.service.hours),
                            unit_price: parseFloat(line.service.hourly_rate),
                            rate: parseFloat(line.service.flat_fee),
                            subtotal: subtotal,
                            tax: tax,
                            tax_id: line.tax ? line.tax.id : null,
                            tax_rate: tax_rate
                        }
                    }
                    return {
                        ...data,
                        // discount: parseFloat(line.discount),
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
            <table className="table tight">
                <thead>
                    <tr style={{
                        padding: '2mm',
                        color: 'white',
                        backgroundColor: '#23374d',
                        width: '100%'
                    }}>
                        <th style={{width:"5%"}}></th>
                        <th style={{width:"30%"}}>Item</th>
                        <th style={{width:"10%"}}>Unit</th>
                        <th style={{width:"10%", textAlign:'right'}}>Unit Price</th>
                        <th style={{width:"10%", textAlign:'right'}}>Rate</th>
                        <th style={{width:"10%", textAlign:'right'}}>Qty</th>
                        <th style={{width:"10%", textAlign:'right'}}>Tax</th>
                        <th style={{width:"15%", textAlign:'right'}}>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.items.map((item, i) =>{
                        return (<Line 
                                        {...item}
                                        exchange_rate={this.state.exchange_rate}
                                        key={i}
                                        index={i}
                                        handler={this.deleteHandler}/>)
                        })}
                
                <EntryWidget
                            
                            insertHandler={this.insertHandler}/>
                </tbody>
                <Totals list={this.state.items}
                    exchange_rate={this.state.exchange_rate}
                    currency={this.state.currency}/>
            
                </table>

        );
    }
}

function in_cur(val) {
    return parseFloat(val).toFixed(2)
}

const Line = (props) =>{
    return(
        <tr>
            <td>
                <DeleteButton 
                    index={props.index}
                    handler={props.handler}/>
            </td>
            <td>{props.item_label}</td>
            <td>{props.unit_label}</td>
            <td style={{textAlign: "right"}}>{in_cur(props.unit_price * props.exchange_rate)}</td>
            <td style={{textAlign: "right"}}>{in_cur(props.rate * props.exchange_rate)}</td>
            <td style={{textAlign: "right"}}>{in_cur(props.qty)}</td>
            <td style={{textAlign: "right"}}>{in_cur(props.tax * props.exchange_rate)}</td>
            <td style={{textAlign: "right"}}>{in_cur(props.subtotal * props.exchange_rate)}</td>
        </tr>
    )
}