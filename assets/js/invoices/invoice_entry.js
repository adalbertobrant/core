import React, {Component} from 'react';
import axios from '../src/auth';
import SelectThree from '../src/select_3';

class EntryWidget extends Component{
    state ={
        item_type: "product",
        clear: false,
        inputs: {
            unit_price: 0,
            rate: 0,
            item: null,
            item_label: null,
            qty: 0,
            unit: null,
            unit_label: null,
            tax: 0.00,
            tax_rate: 0.00,
            tax_id: null,
            subtotal: 0.00,
        },
    }

    toggleItemType = () => {
        this.setState({
            item_type: this.state.item_type == "product"
                        ? "service"
                        : "product"
        }, this.onClear)
    }

    onSelectProduct = (data) => {
       axios({
           method: 'GET',
           url: `/inventory/api/product/${data.selected}`
       }).then(res => {
            const tax_rate = res.data.product_component.tax ? parseFloat(res.data.product_component.tax.rate) : null
            const tax_amount = tax_rate ? parseFloat(res.data.unit_sales_price) * (tax_rate / 100.0) : 0.00
            const subtotal = parseFloat(res.data.unit_sales_price) + parseFloat(tax_amount)
            this.setState({
                inputs: {
                    unit_price: parseFloat(res.data.unit_sales_price),
                    rate: parseFloat(res.data.unit_sales_price),
                    qty: parseFloat(1),
                    item: data.selected,
                    item_label: data.inputVal,
                    unit: res.data.unit ? res.data.unit.id : null,
                    unit_label: res.data.unit ? res.data.unit.name : "",
                    tax: tax_amount,
                    tax_rate: tax_rate,
                    subtotal: subtotal,
                    tax_id: res.data.product_component.tax ? res.data.product_component.tax.id : null
                }
            })
       })
    }

    onSelectService = (data) => {
        axios({
            method: 'GET',
            url: `/services/api/service/${data.selected}`
        }).then(res => {
            console.log(res.data)
             //total invoice value is rate + unit price * qty
             const tax_rate = res.data.tax ? parseFloat(res.data.tax.rate) : null
             const subtotal = parseFloat(res.data.flat_fee) + parseFloat(res.data.hourly_rate)
             const tax_amount = tax_rate ? subtotal * (tax_rate / 100.0) : 0.00
             const line_total = subtotal + parseFloat(tax_amount)
             this.setState({
                 inputs: {
                     unit_price: parseFloat(res.data.hourly_rate),
                     rate: parseFloat(res.data.flat_fee),
                     qty: parseFloat(1),
                     item: data.selected,
                     item_label: data.inputVal,
                     unit: null,
                     unit_label: 'Hrs',
                     tax: tax_amount,
                     tax_rate: tax_rate,
                     subtotal: line_total,
                     tax_id: res.data.tax ? res.data.tax.id : null
                 }
             })
        })
    }

    onClear = () => {
        this.setState({
            clear: !this.state.clear,
            inputs: {
                unit_price: 0.00,
                rate: 0.00,
                item: null,
                item_label: null,
                qty: 0.00,
                unit: null,
                unit_label: "",
                tax: 0.00,
                tax_rate: 0.00,
                subtotal: 0.00
            },
        })
    }

    handleInputChange = (evt) => {
        const field = evt.target.dataset.name
        const newInputs = {...this.state.inputs}
        let value = evt.target.value
        if(['qty', 'rate', 'unit_price'].includes(field)) {
            value = parseFloat(value)
        }
        newInputs[field] = value
        this.setState({inputs: newInputs}, this.updateTotals)
    }

    updateTotals = () => {
        const line_total = this.state.item_type == 'product' 
                                ? (this.state.inputs.rate || this.state.inputs.unit_price) * this.state.inputs.qty
                                : (this.state.inputs.unit_price * this.state.inputs.qty) + this.state.inputs.rate
        const tax_amount = this.state.inputs.tax_rate 
                            ? line_total * (this.state.inputs.tax_rate / 100.0) 
                            : 0.00
        
        const newInputs = {...this.state.inputs}
        newInputs.subtotal = line_total + tax_amount
        newInputs.tax = tax_amount

        
        this.setState({ inputs: newInputs })
    }

    handleInsert = () => {
        this.props.insertHandler({
            type: this.state.item_type,
            ...this.state.inputs
        })
        this.onClear()
    }

    render(){
        const inputStyle = {
            borderLeft: '0px',
            padding: '2.5px',
            border: '1px solid #ccc',
            marginTop: '5px',
            width: '100%'
        }
        return(
            <React.Fragment>
                <tr>
                        <td>
                            <button type='button' 
                                style={{fontWeight: 700}}
                                class='btn btn-sm btn-default'
                                onClick={this.toggleItemType}> 
                                {this.state.item_type == "product" ? "P" : "S"}
                            </button>
                        </td>
                        <td>
                                {this.state.item_type == 'product' 
                                    ? <SelectThree 
                                        app="inventory"
                                        model="InventoryItem"
                                        onSelect={this.onSelectProduct}
                                        onClear={this.onClear}
                                        toggleClear={this.state.clear}/>
                                    : <SelectThree  
                                        app="services"
                                        model="Service"
                                        onSelect={this.onSelectService}
                                        onClear={this.onClear}
                                        toggleClear={this.state.clear}/>}
                        </td>
                        <td>
                            <input type='text' 
                                style={{...inputStyle}}
                                value={this.state.inputs.unit_label}
                                 />
                        </td>
                        <td>
                            <input type='number' 
                                data-name='unit_price'
                                style={{...inputStyle, textAlign: "right"}}
                                value={this.state.inputs.unit_price}
                                onChange={this.handleInputChange} />
                        </td>
                        <td >
                            <input type='number' 
                                data-name='rate'
                                style={{...inputStyle, textAlign: "right"}}
                                value={this.state.inputs.rate}
                                onChange={this.handleInputChange} />
                        </td>
                        <td>
                            <input type='number' 
                                data-name='qty'
                                style={{...inputStyle, textAlign: "right"}}
                                value={this.state.inputs.qty}
                                onChange={this.handleInputChange} />
                        </td>
                        <td>
                            <input type='number' 
                             style={{...inputStyle, textAlign: "right"}}
                                value={this.state.inputs.tax}
                                 />
                        </td>
                        <td>
                            <input type='number' 
                             style={{...inputStyle, textAlign: "right"}}
                                value={this.state.inputs.subtotal}
                                 />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={7}>
                        </td>
                        <td>   
                            <button type='button' 
                                class='invoice-btn'
                                onClick={this.handleInsert}>
                                INSERT
                            </button>
                        </td>
                    </tr>
            </React.Fragment>
                
            
        )
    }
}


export default EntryWidget;