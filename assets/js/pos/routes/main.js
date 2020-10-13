import React, {Component} from 'react';
import Context from '../container/provider'
import Head from '../components/head'
import axios from '../../src/auth'
import styles from '../pos.css';
import SelectThree from '../../src/select_3';

class MainPage extends Component{
    state = {
        products: [],
        payments: [],
        currentSaleID: null,
        sessionID: null,
        checkoutState: {},
        keypadText: "",
        keypadState: "barcode", //quantity, price, barcode
        isQuote: false,
        suspendedSale: null,
        customer_id: null,
        customer_name: "",
        current_item_id: null,
        current_payment_method_id: null,
        current_item_qty: 0,
        current_payment_amount: 0,
        net_total: 0,
        grand_total: 0,
        tax: 0,
        total_tendered: 0,
        change: 0,
        salesPerson: null,
        modalOpen: false,
        sessionStart: new Date(),
        allProductsSelected: false,
        allPaymentsSelected: false,
    }

    updateTotals() {
        const tendered = this.state.payments.reduce((tot, pmt) => tot + pmt.tendered, 0) 
        const tax = this.state.products.reduce((tot, prod) => tot + prod.tax_amount, 0)
        const net_total = this.state.products.reduce((tot, prod) => tot + (prod.price * prod.quantity), 0)
        const grand_total = net_total + tax
        const change = tendered > grand_total ? tendered - grand_total : 0.0
        this.setState({
            tax: tax,
            total_tendered: tendered,
            net_total: net_total,
            grand_total: grand_total,
            change: change
        })      
    }

    addProduct = () =>{
        if(!this.state.current_item_id || this.state.current_item_qty <= 0) {
            bentschAlert("Please select a valid product and a quantity greater than 0")
            return
        }
        axios.get('/inventory/api/product/' + this.state.current_item_id)
            .then(res =>{ 
                console.log(res)
                let newProducts = [...this.state.products]
                const tax_rate = [null, undefined].includes(res.data.product_component.tax) ? null : res.data.product_component.tax.rate  
                const tax_amount = tax_rate ? res.data.unit_sales_price * this.state.current_item_qty * (tax_rate / 100.0) : 0.0
                newProducts.push({
                    name: res.data.name,
                    price: res.data.unit_sales_price,
                    id: res.data.id,
                    quantity: this.state.current_item_qty,
                    tax_id:  [null, undefined].includes(res.data.product_component.tax) ? null : res.data.product_component.tax.id,
                    tax_amount: tax_amount,
                    checked: false
                })
                this.setState({ products: newProducts}, this.updateTotals)
            })
        
    }

    addPayment =() => {
        axios.get('/invoicing/api/payment-method/' +this.state.current_payment_method_id )
            .then(res =>{
                const newPayments = [...this.state.payments]
                newPayments.push({
                    method: res.data.name,
                    checked: false,
                    tendered: parseFloat(this.state.current_payment_amount)
                })
                this.setState({
                    payments: newPayments
                }, this.updateTotals)
            })
    }

    toggleAllPayments = (evt) => {
        const newPayments = this.state.payments.map(pmt =>{
            pmt.checked = !this.state.allPaymentsSelected
            return pmt
        })

        this.setState({
            allPaymentsSelected: !this.state.allPaymentsSelected,
            payments: newPayments
        })
    }

    toggleAllProducts = (evt) => {
        const newProducts = this.state.products.map(prod => {
            prod.checked = !this.state.allProductsSelected
            return prod
        })

        this.setState({
            allProductsSelected: !this.state.allProductsSelected,
            products: newProducts
        })
    }

    toggleProduct  = (evt) => {
        const id = parseInt(evt.target.dataset.index)
        const newProducts = this.state.products.map((prod, i) =>{
            if(i == id){ prod.checked = !prod.checked }
            return prod
        })
        this.setState({products: newProducts})
    }

    togglePayment = (evt) => {
        const id = parseInt(evt.target.dataset.index)
        const newPayments = this.state.payments.map((pmt, i) =>{
            if(i == id){ pmt.checked = !pmt.checked }
            return pmt
        })
        this.setState({payments: newPayments})
    }

    deleteSelectedPayments = () => {
        const newPayments = this.state.payments.filter(pmt => !pmt.checked)
        this.setState({payments: newPayments}, this.updateTotals)
    }

    deleteSelectedProducts = () => {
        const newProducts = this.state.products.filter(prod => !prod.checked)
        this.setState({products: newProducts}, this.updateTotals)
    }

    //#######################################################
    // Handles Route Events 
    //#######################################################

    handleInputChange = (evt) =>{
        const fieldname = evt.target.name
        const newVals = {}
        newVals[fieldname] =  evt.target.value 
        this.setState(newVals)
    }

    componentDidMount(){
        //Master keyboard event handler
        //select the first customer
        axios.get('/invoicing/api/customer/').then(res =>{
            if(res.data.length > 0){
                let first = res.data[0]
                this.setState({currentCustomer: `${first.id} - ${first.name}`})
            }
        })
    }

    render() {
        return(
            <Context.Provider value={{
                state: this.state,
                actionHandler: this.executeAction,
                updateMapping: this.setKeyMapper
            }}>
                <Head {...this.state}/>
                <div className={styles.root}>
                    <div className={styles.sidebar}>
                        <ul className='list-group'>
                            <li className="list-group-item">Price Check</li>
                            <li className="list-group-item">Void</li>
                            <li className="list-group-item">Customers</li>
                            <li className="list-group-item">Suspend | Restore</li>
                            <li className="list-group-item">Quote | Sale</li>
                            <li className="list-group-item">Logout</li>
                        </ul>
                    </div>
                    <div className={styles.fields}>
                        <h5>Customer:</h5>
                        <div>
                        <SelectThree 
                            app='invoicing'
                            model="customer"
                            onSelect={(data) => this.setState({
                                customer_id: data.selected,
                                customer_name: data.inputVal,
                            })}
                            />
                        </div>
                        <hr />
                        <h5>Item</h5>
                            <div className={styles.item_selection_row}>
                                <div className={styles.item_select}>
                                    <label>Item:</label><br/>
                                    <SelectThree 
                                        app='inventory'
                                        model="inventoryitem"
                                        onSelect={(data) => this.setState({current_item_id: data.selected})}
                                        />
                                </div>
                                <div className={styles.qty_select}>
                                    <label>Qty:</label><br/>
                                    <input 
                                        type="number"
                                        name="current_item_qty"
                                        value={this.state.current_item_qty}
                                        onChange={this.handleInputChange}/>
                                </div>
                            </div>
                            <button 
                                class='btn btn-primary'
                                onClick={this.addProduct}>Add Item</button>
                            <hr />
                        <h5>Payment</h5>
                            <div className={styles.payment_selection_row}>
                                <div className={styles.payment_select}>
                                    <label>Mode of Payment:</label><br/>
                                    <SelectThree 
                                        app='invoicing'
                                        model="paymentmethod"
                                        onSelect={(data) => this.setState({current_payment_method_id: data.selected})}
                                        />
                                    
                                </div>
                                <div className={styles.amount_select}>
                                    <label>Amount:</label><br/>
                                    <input type="number"
                                         name="current_payment_amount"
                                         value={this.state.current_payment_amount}
                                         onChange={this.handleInputChange}/>
                                </div>
                            </div>
                            <button className='btn btn-primary'
                                onClick={this.addPayment}>Add Payment</button>
                        <hr/>
                        <button class='btn btn-block btn-primary'>Submit Transaction</button>
                    </div>
                    <div className={styles.list}>
                        <h5>Items</h5>
                        <table className="table table-sm">
                            <thead>
                                <tr className="bg-primary text-white">
                                    <th><input 
                                            type="checkbox" 
                                            onChange={this.toggleAllProducts} 
                                            checked={this.state.allProductsSelected}/></th>
                                    <th style={{width: "50%"}}>Item</th>
                                    <th className="text-right">Qty</th>
                                    <th className="text-right">Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.products.map((prod, i) => (
                                    <tr key={i}>
                                        <td><input 
                                                type="checkbox" 
                                                checked={prod.checked} 
                                                onChange={this.toggleProduct} 
                                                data-index={i}/></td>
                                        <td style={{width: "50%"}}>{prod.name}</td>
                                        <td className="text-right">{prod.quantity}</td>
                                        <td className="text-right">{parseFloat(prod.price).toFixed(2)}</td>
                                    </tr>
                                ))}
                                
                            </tbody>
                        </table>
                        <button class="btn btn-sm btn-danger" onClick={this.deleteSelectedProducts}>Delete</button>
                        <hr />
                        <h5>Payments</h5>
                        <table class="table table-sm">
                            <thead>
                                <tr className="bg-primary text-white">
                                    <th><input 
                                            type="checkbox" 
                                            onChange={this.toggleAllPayments}
                                            value={this.state.allPaymentsSelected}/></th>
                                    <th>Payment Method</th>
                                    <th className="text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.payments.map((pmt, i) => (<tr key={i}>
                                    <td><input 
                                            type="checkbox" 
                                            onChange={this.togglePayment}
                                            checked={pmt.checked}
                                            data-index={i} /></td>
                                    <td>{pmt.method}</td>
                                    <td className="text-right">{parseFloat(pmt.tendered).toFixed(2)}</td>
                                </tr>))}
                            </tbody>
                        </table>
                        <button class="btn btn-sm btn-danger" onClick={this.deleteSelectedPayments}>Delete</button>
                        <hr/>
                        <div>
                            <div className={styles.totals}>
                                <div className="text-right">Subtotal</div>
                                <div>{this.state.net_total.toFixed(2)}</div>
                            </div>
                            <div className={styles.totals}>
                                <div  className="text-right">Tax</div>
                                <div>{this.state.tax.toFixed(2)}</div>
                            </div>
                            <div className={styles.totals}>
                                <div className="text-right">Total Due</div>
                                <div>{this.state.grand_total.toFixed(2)}</div>
                            </div>
                            <hr/>
                            <div className={styles.totals}>
                                <div className="text-right">Amount Paid</div>
                                <div className="text-right">{this.state.total_tendered.toFixed(2)}</div>
                            </div >
                            <div className={styles.totals}>
                                <div className="text-right">Change</div>
                                <div className="text-right">{this.state.change.toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Context.Provider>
        )
    }
}

export default MainPage;
