import React, {Component} from 'react';
import ProductList from '../components/product_list'
import Keypad from '../components/keypad'
import ActionGrid from '../components/actions'
import Modal from 'react-modal';
import {Router, Route, Switch} from 'react-router-dom';
import {createBrowserHistory} from 'history'
import ProductsPage from './products'
import CheckoutPage from './payment'
import SearchPage from './search'
import ManualAddProduct from './add_product'
import VoidPage from './void'
import CustomersPage from './customers'
import DiscountPage from './discount'
import LogoutPage from './logout'
import Context from '../container/provider'
import Head from '../components/head'
import axios from 'axios'


const history = createBrowserHistory()

class MainPage extends Component{
    state = {
        products: [],
        active: null,
        keypadText: "",
        keypadState: "quantity", //quantity, price, barcode, discount
        isQuote: false,
        suspendedSale: null,
        currentCustomer: null,
        salesPerson: null,
        modalOpen: false,
        sessionStart: new Date(),
        keyMapping: {
            'Enter': 'enterKeypadValue'
        },
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
        if(this.state.isQuote){
            this.setState({modalOpen: true});
            history.push("/payment")
        }
    }

    openSearch =() =>{
        this.setState({modalOpen: true});
        history.push("/search")
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
        
        this.setState({modalOpen: true});
        history.push("/add-product")
    }

    discount = () =>{
        //prompt a discount precentage
        this.setState({modalOpen: true});
        history.push("/discount")
    }

    voidSale = () =>{
        this.setState({modalOpen: true});
        history.push("/void")
        //prompt
        //authenticate
        //void sale
    }

    endSession = () =>{
        //log session and then conclude
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
                customer: null, 
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
                suspendSale: null,
                products: prevState.suspendedSale.products,
                customer: prevState.customer
            }))
        }
        alert('Sale restored')
    }

    executeAction = (name) =>{
        switch(name){
            case 'search': 
                this.openSearch()
                break;
            case 'quote': 
                this.quote()
                break;
            case 'discount': 
                this.discount()
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
                console.log('keyboard')
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
        console.log('handled')
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
            if(false){
                this.setState({
                    keypadState:'quantity',
                    keypadText: ""
                })
            }else{
                alert('No product matching this code exists')
            }
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
    componentDidMount(){
        //Master keyboard event handler

        const handler = (evt) =>{
            console.log(evt.key)
            if(["0","1","2","3","4","5","6","7","8","9","."].includes(evt.key)
              && !this.state.modalOpen){
                this.setState({keypadText: this.state.keypadText + evt.key})
                
            }else if(evt.key=='Backspace' && !this.state.modalOpen){
                const newText = this.state.keypadText.slice(0, 
                    this.state.keypadText.length-2)
                this.setState({keypadText: newText})
            }else if(!("undefined" === typeof(this.state.keyMapping[evt.key]))){
                //for action buttons
                this.executeAction(this.state.keyMapping[evt.key])
            }
                document.addEventListener('keydown', handler, {once:true})
            }
            document.addEventListener('keydown', handler, {once:true})
        }

    updateKeypad =(value) =>{
        this.setState({keypadText: value})
    }


    render(){
        const styles = {
            backgroundColor: '#EEE',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            height: '80vh'
        }

        return(
            <Context.Provider value={{
                state: this.state,
                actionHandler: this.executeAction,
                updateMapping: this.setKeyMapper
            }}>
                <Head {...this.state}/>
                <div style={styles}>
                    <ProductList {...this.state}
                        setActive={(index) =>{
                            this.setState({active: index})
                        }}/>
                    <Keypad text={this.state.keypadText}
                            setText={this.updateKeypad}
                            mode={this.state.keypadState}
                            changeMode={(mode) =>{
                                this.setState({keypadState: mode})}}
                            handleEnter={this.handleEnterButtonPress}/>
                    <ActionGrid />
                    <Modal 
                        ariaHideApp={false}
                        isOpen={this.state.modalOpen} >
                        <div style={{
                            display:'flex',
                            justifyContent: 'flex-end'
                            }}>
                        
                        <button className="btn btn-sm"
                            onClick={()=>{
                                this.setState({modalOpen: false})
                            }}><i className="fas fa-times"></i></button></div>
                    
                    <Router history={history}>
                            <Switch>
                                <Route path='/add-product'>
                                    <ManualAddProduct 
                                        insertProduct={this.insertProduct}/>   
                                </Route>
                                <Route path='/products' component={ProductsPage} />
                                <Route path='/payment' component={CheckoutPage}/>
                                <Route path='/search' component={SearchPage}/>
                                <Route path='/discount' component={DiscountPage}/>
                                <Route path='/customers' component={CustomersPage}/>
                                <Route path='/pos-logout' component={LogoutPage}/>
                                <Route path='/void' component={VoidPage}/>
                                
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