import React, {Component} from 'react';
import Context from '../container/provider'
import Head from '../components/head'
import axios from '../../src/auth'
import styles from '../pos.css';
import SelectThree from '../../src/select_3';

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";

const history = {
    name: 'History',
    push: function(url){
        window.location.hash = url
    }
}

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
        salesPerson: null,
        modalOpen: false,
        sessionStart: new Date(),
        keyMapping: {
            'Enter': 'enterKeypadValue'
        }
    }

    //used with action buttons
    setKeyMapper = (key, action) =>{
        if("undefined" === typeof(this.state.keyMapping[key])){
            let newMapping = {...this.state.keyMapping}
            newMapping[key] = action

            this.setState({keyMapping:newMapping})    
        }
    }
    //#############################################################
    // Handles Routing
    //##############################################################
    openCheckout =() =>{
        if(this.state.currentCustomer == null){bentschAlert('A sale cannot be completed without a valid customer.'); return}
        if(this.state.isQuote){bentschAlert('You cannot checkout a quote.'); return}
        this.setState({modalOpen: true});
        history.push("/payment")
    }


    openCustomers =() =>{
        //list of customers, set current
        this.setState({modalOpen: true});
        history.push("/customers")
    }

    quote =() =>{
        //change to quotation mode 
        if(this.state.products.length > 0 && !this.state.isQuote){
            bentschAlert('Sales cannot be changed to quotes, either do a price check or suspend the current sale or void it in order to change modes')
            return
        }
        if(this.state.isQuote){
            bentschAlert('Changed to Sale Mode')
        }else{
            bentschAlert('Changed to Quote Mode')
        }
        
        this.setState((prevState) => ({isQuote:!prevState.isQuote}))
    }

    priceCheck =() =>{
        this.setState({modalOpen: true})
        history.push('/price-check')
    }

    removeProduct = () =>{
        //no route
        // remove current selection from products
        if(confirm(
            'Are you sure you want to remove the currently selected product?')){
                let newProducts = [...this.state.products]
                newProducts.splice(this.state.active, 1)
                this.setState({products: newProducts})
        }

    }

    addProduct = () =>{
        if(!this.state.current_item_id || this.state.current_item_qty <= 0) {
            bentschAlert("Please select a valid product and a quantity greater than 0")
            return
        }
        axios.get('/inventory/api/product/' + this.state.current_item_id)
            .then(res =>{
                let newProducts = [...this.state.products]
                newProducts.push({
                    name: res.data.name,
                    price: res.data.unit_sales_price,
                    id: res.data.id,
                    quantity: this.state.current_item_qty,
                    tax: typeof(res.data.tax) ==="undefined" ? null : res.data.tax 
                })
                this.setState({ products: newProducts,})
            })
        
    }


    endSession = () =>{
        //log session and then conclude
        if(this.state.products.length > 0){
            const choice = confirm('You have some products in the queue, are you sure you want to end the current session?')
            if(!choice){
                return
            }
        }
    }

    suspendSale = () =>{
        if(!this.state.suspendedSale ){
            this.setState(prevState =>({
                suspendedSale: {
                    products: [...prevState.products],
                    customer: prevState.currentCustomer
                },
                currentCustomer: null, 
                products: []
            }))
            bentschAlert('Sale Suspended Successfully')
            return
        }else if(this.state.products.length > 0){
            bentschAlert('A sale is already suspended in this session, restore it before suspending another sale.')
            return
        }else if((this.state.suspendedSale && this.state.products.length == 0)
                    || this.state.isQuote){
            this.setState(prevState => ({
                suspendedSale: null,
                products: prevState.suspendedSale.products,
                currentCustomer: prevState.suspendedSale.customer
            }))
          bentschAlert('Sale restored')

        }
    }


    //#######################################################
    // Handles Route Events 
    //#######################################################

    handleSessionStart = (user) =>{
        const timestamp = new Date()
        axios.post('/invoicing/pos/start-session/', {
            sales_person: user,
            timestamp: timestamp
        }).then(res =>{
            this.setState({
                modalOpen: false,
                sessionStart: timestamp,
                salesPerson: user,
                sessionID: res.data.id
            })
        })
    }

    handleCheckoutAction = (checkoutState) =>{
        // create invoice 
        //create list of payments
        //create sale
        // go to completed sale page
        
        
        axios.post('/invoicing/pos/process-sale/', {
            timestamp: new Date(),
            session: this.state.sessionID,
            invoice: {
                //date extracted from timestamp
                customer: this.state.currentCustomer,
                sales_person: this.state.salesPerson,
                lines: this.state.products
            },
            payments: checkoutState.payments,

        }).then(res =>{
            //returns a receipt number 
            this.setState({
                modalOpen: true,
                checkoutState: checkoutState,
                currentSaleID: res.data.sale_id
            }, () =>history.push('/complete'))
        }).catch(error =>{
            console.log('error')
        })
    }

    handleInputChange = (evt) =>{
        const fieldname = evt.target.name
        const newVals = {}
        newVals[fieldname] =  evt.target.value 
        console.log(fieldname)
        console.log(newVals)
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
                            <button className='btn btn-primary'>Add Payment</button>
                        <button class='btn btn-block btn-primary'>Submit Transaction</button>
                    </div>
                    <div className={styles.list}>
                        <h5>Items</h5>
                        <table className="table">
                            <thead>
                                <tr className="bg-primary text-white">
                                    <th></th>
                                    <th style={{width: "50%"}}>Item</th>
                                    <th>Qty</th>
                                    <th>Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.products.map(prod => (
                                    <tr>
                                        <th></th>
                                        <th style={{width: "50%"}}>{prod.name}</th>
                                        <th>{prod.quantity}</th>
                                        <th>{parseFloat(prod.price).toFixed(2)}</th>
                                    </tr>
                                ))}
                                
                            </tbody>
                        </table>
                        <hr />
                        <h5>Payments</h5>
                        <table class="table">
                            <thead>
                                <tr className="bg-primary text-white">
                                    <th></th>
                                    <th>Payment Method</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.payments.map(pmt => (<tr>
                                    <td></td>
                                    <td>{pmt.method}</td>
                                    <td>{parseFloat(pmt.tendered).toFixed(2)}</td>
                                </tr>))}
                            </tbody>
                        </table>
                        <div>
                            <div>
                                <div className="text-right">Subtotal</div>
                                <div></div>
                            </div>
                            <div>
                                <div  className="text-right">Tax</div>
                                <div></div>
                            </div>
                            <div>
                                <div className="text-right">Total Due</div>
                                <div></div>
                            </div>
                            <hr/>
                            <div>
                                <div className="text-right">Amount Paid</div>
                                <div className="text-right"></div>
                            </div>
                            <div>
                                <div>Change</div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </Context.Provider>
        )
    }
}

export default MainPage;
