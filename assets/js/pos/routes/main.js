import React, {Component} from 'react';
import ProductList from '../components/product_list'
import {Keypad} from '../components/keypad'
import ActionGrid from '../components/actions'
import Modal from 'react-modal';
import {HashRouter as Router, Route, Switch} from 'react-router-dom';
import PriceCheckPage from './products'
import CheckoutPage from './payment'
import ManualAddProduct from './add_product'
import VoidPage from './void'
import CustomersPage from './customers'
import LogoutPage from './logout'
import CompletedSalePage from './completed_sale'
import Context from '../container/provider'
import Head from '../components/head'
import StartSession from '../routes/start_session'
import axios from 'axios'


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
        currentSaleID: null,
        sessionID: null,
        checkoutState: {},
        active: null,
        keypadText: "",
        keypadState: "barcode", //quantity, price, barcode
        isQuote: false,
        suspendedSale: null,
        currentCustomer: null,
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
        if(this.state.currentCustomer == null){alert('A sale cannot be completed without a valid customer.'); return}
        if(this.state.isQuote){alert('You cannot checkout a quote.'); return}
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
            alert('Sales cannot be changed to quotes, either do a price check or suspend the current sale or void it in order to change modes')
            return
        }
        if(this.state.isQuote){
            alert('Changed to Sale Mode')
        }else{
            alert('Changed to Quote Mode')
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
        // manually add product by entering code(only)
        //show list of popular products
        
        this.setState({
            modalOpen: true,
            keypadState: 'quantity'
        });
        history.push("/add-product")

    }

    voidSale = () =>{
        this.setState({modalOpen: true});
        history.push("/void")
    }

    endSession = () =>{
        //log session and then conclude
        if(this.state.products.length > 0){
            const choice = confirm('You have some products in the queue, are you sure you want to end the current session?')
            if(!choice){
                return
            }
        }
        this.setState({modalOpen: true});
        history.push("/pos-logout")
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
            alert('Sale Suspended Successfully')
            return
        }else if(this.state.products.length > 0){
            alert('A sale is already suspended in this session, restore it before suspending another sale.')
            return
        }else if((this.state.suspendedSale && this.state.products.length == 0)
                    || this.state.isQuote){
            this.setState(prevState => ({
                suspendedSale: null,
                products: prevState.suspendedSale.products,
                currentCustomer: prevState.suspendedSale.customer
            }))
          alert('Sale restored')

        }
    }

    executeAction = (name) =>{
        switch(name){
            case 'quote': 
                this.quote()
                break;
            case 'price-check': 
                this.priceCheck()
                break;
            case 'checkout': 
                this.openCheckout()
                break;
            case 'customers': 
                this.openCustomers()
                break;
            case 'removeProduct': 
                this.removeProduct()
                break;
            case 'addProduct': 
                this.addProduct()
                break;
            case 'void': 
                this.voidSale()
                break;
            case 'endSession': 
                this.endSession()
                break;
            case 'suspend': 
                this.suspendSale()
                break;
            // from keypad not action buttons
            case 'enterKeypadValue': 
                this.handleEnterButtonPress()
                break;
            default:
                return null;
        }
    }

    //#######################################################
    // Handles Route Events 
    //#######################################################

    insertProduct =(productString) =>{
        const productID = productString.split('-')[0]
        axios.get('/inventory/api/product/' + productID)
            .then(res =>{
                let newProducts = [...this.state.products]
                newProducts.push({
                    name: res.data.name,
                    price: res.data.unit_sales_price,
                    id: res.data.id,
                    quantity: 1,
                    tax: typeof(res.data.tax) ==="undefined" ? null : res.data.tax 
                })
                this.setState({
                    modalOpen: false,
                    products: newProducts,
                    active: this.state.products.length
                })
            })
    }

    handleEnterButtonPress = () =>{
        if(this.state.keypadText == ""){alert('Please enter a number.');return}
        if(this.state.keypadState == 'quantity' && this.state.active != null){
            let newProducts = [...this.state.products]
            newProducts[this.state.active].quantity = parseFloat(
                this.state.keypadText)
            this.setState({
                products: newProducts,
                keypadText: ""
            })
        }else if(this.state.keypadState == 'barcode'){
            // get barcodes from the server, if none create an alert
            axios.get('/inventory/api/product/' + this.state.keypadText)
                .then(res =>{
                    let newProducts = [...this.state.products]
                    newProducts.push({
                        name: res.data.name,
                        price: res.data.unit_sales_price,
                        id: res.data.id,
                        quantity: 1,
                        tax: typeof(res.data.tax) ==="undefined" ? null : res.data.tax 
                    })
                    
                    this.setState(prevState =>({
                        keypadState:'quantity',
                        keypadText: "",
                        products: newProducts,
                        active: prevState.products.length
                    }))
                })
                .catch(error => {
                        alert('No product matching this code exists')
                        console.log(error)
                    })
        
        }else if(this.state.keypadState== 'price' && this.state.active != null){
            let newProducts = [...this.state.products]
            newProducts[this.state.active].price = parseFloat(
                this.state.keypadText)
            this.setState({
                products: newProducts,
                keypadText: ""
            })
        }
    }

    
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
            console.log('axios')
            console.log(res)
            this.setState({
                modalOpen: true,
                checkoutState: checkoutState,
                currentSaleID: res.data.sale_id
            }, () =>history.push('/complete'))
        }).catch(error =>{
            console.log('error')
        })
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

        const handler = (evt) =>{
            if(["0","1","2","3","4","5","6","7","8","9","."].includes(evt.key)
              && !this.state.modalOpen){
                this.setState({keypadText: this.state.keypadText + evt.key})
                
            }else if(evt.key=='Backspace' && !this.state.modalOpen){
                const newText = this.state.keypadText.slice(0, 
                    this.state.keypadText.length-1)
                this.setState({keypadText: newText})
            }else if(!("undefined" === typeof(this.state.keyMapping[evt.key]))){
                //for action buttons
                if(this.state.modalOpen){
                    return
                }
                this.executeAction(this.state.keyMapping[evt.key])
            }
                document.addEventListener('keydown', handler, {once:true})
            }
            document.addEventListener('keydown', handler, {once:true})
            history.push('/start-session')
            this.setState({modalOpen: true}) 
        }

    updateKeypad =(value) =>{
        this.setState({keypadText: value})
    }


    render(){
        const styles = {
            backgroundColor: '#EEE',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            height: '75vh'
        }
        const wide = window.screen.width > 600

        return(
            <Context.Provider value={{
                state: this.state,
                actionHandler: this.executeAction,
                updateMapping: this.setKeyMapper
            }}>
                <Head {...this.state}/>
                <div style={styles}>
                    <ProductList 
                        {...this.state}
                        handleEnter={this.handleEnterButtonPress}
                        mode={this.state.keypadState}
                        inputText={this.state.keypadText}
                        
                            changeMode={(mode) =>{
                                this.setState({keypadState: mode})}}
                        setActive={(index) =>{
                            this.setState({active: index})
                        }}/>
                    
                    {wide ? 
                        <React.Fragment>
                            <Keypad text={this.state.keypadText}
                            setText={this.updateKeypad}
                            mode={this.state.keypadState}
                            changeMode={(mode) =>{
                                this.setState({keypadState: mode})}}
                            handleEnter={this.handleEnterButtonPress}/>
                        <ActionGrid />
                        </React.Fragment>
                        :null}
                    
                    <Modal 
                        ariaHideApp={false}
                        isOpen={this.state.modalOpen} >
                        <div style={{
                            display:'flex',
                            justifyContent: 'flex-end'
                            }}>
                        {this.state.salesPerson !=null 
                            ? <button className="btn btn-sm"
                                onClick={()=>{
                                    this.setState({modalOpen: false})
                                }}><i className="fas fa-times"></i></button>
                            : null}
                        
                            </div>
                    <Router>
                            <Switch>
                                <Route path='/payment'>
                                    <CheckoutPage 
                                        currentCustomer={this.state.currentCustomer}
                                        products={this.state.products}
                                        cancel={() =>{this.setState({
                                            modalOpen: false
                                        })}}
                                        checkoutAction={this.handleCheckoutAction}/>
                                </Route>
                                <Route path='/complete'>
                                    <CompletedSalePage 
                                        products={this.state.products}
                                        salesPerson={this.state.salesPerson}
                                        checkout={this.state.checkoutState}
                                        receiptID={this.state.currentSaleID}
                                        completeSale={() =>{
                                            this.setState({
                                                modalOpen: false,
                                                active: null,
                                                products: []
                                            });

                                            //select the first customer
                                            axios.get('/invoicing/api/customer/').then(res =>{
                                                if(res.data.length > 0){
                                                    let first = res.data[0]
                                                    this.setState({currentCustomer: `${first.id} - ${first.name}`})
                                                }
                                            })
                                        }}/>
                                </Route>
                                <Route path='/add-product'>
                                    <ManualAddProduct 
                                        insertProduct={this.insertProduct}/>   
                                </Route>
                                <Route path='/price-check'>
                                        <PriceCheckPage 
                                            handler={() =>this.setState({
                                                modalOpen: false
                                            })}/>
                                </Route>
                                <Route path='/start-session' >
                                    <StartSession 
                                        sessionStartSuccessful={this.handleSessionStart}/>
                                </Route>
                                <Route path='/customers'>
                                        <CustomersPage 
                                            selectHandler={(val) =>{
                                                this.setState({
                                                    modalOpen: false,
                                                    currentCustomer: val
                                                })
                                            }}/>
                                </Route>
                                <Route path='/pos-logout'>
                                        <LogoutPage 
                                            sessionID={this.state.sessionID}
                                            cancelAction={() =>this.setState({
                                                modalOpen: false
                                            })}
                                            />
                                </Route>
                                <Route path='/void'>
                                    <VoidPage 
                                        cancelAction={()=>this.setState({
                                            modalOpen: false
                                        })}
                                        voidAction={() =>this.setState({
                                            products: [], 
                                            currentCustomer: null,
                                            modalOpen: false
                                        })}/>
                                </Route>
                                
                            </Switch>
                        </Router>
                    </Modal>
                </div>
            </Context.Provider>
        )
    }
}

export default MainPage;
export {history}