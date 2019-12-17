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
        modalOpen: false,
        keyMapping: {

        }
    }

    setKeyMapper = (key, action) =>{
        let newMapping = {...this.state.keyMapping}
        newMapping[key] = action
        this.setState({keyMapping})
    }

    openCheckout =() =>{
        this.setState({modalOpen: true});
        history.push("/payment")
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
        if(this.state.products.length > 0){
            alert('Modes can only be switched before any products have been entered. Please complete the current transaction or suspend the transaction')
        }
        if(this.state.isQuote){
            alert('Changed to Quote Mode')    
        }else{
            alert('Changed to Sale Mode')
        }
        
        this.setState((prevState) => {isQuote:!prevState.isQuote})
    }


    removeProduct = () =>{
        //no route
        // remove current selection from products
        if(confirm(
            'Are you sure you want to remove the currently selected product?')){
                let newProducts = [...this.state.products]
                newProducts.splice(this.state.active, 1)
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
        if(!this.state.suspendedSale){
            this.setState({
                suspendSale: {
                    products: [...this.state.products],
                    customer: this.state.currentCustomer
                }
            })
            alert('Sale Suspended Successfully')
        }else{
            alert('A sale is already suspended in this session, restore it before suspending another sale.')
        }
        
    }

    executeAction = (name) =>{
        switch(name){
            case 'search': 
                this.openSearch()
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
            default:
                return null;
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
            }else if(){

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
                <div style={styles}>
                    <ProductList {...this.state}/>
                    <Keypad text={this.state.keypadText}
                            setText={this.updateKeypad}/>
                    <ActionGrid />
                    <Modal  isOpen={this.state.modalOpen} >
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
                            <Route path='/add-product' component={ManualAddProduct}/>
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