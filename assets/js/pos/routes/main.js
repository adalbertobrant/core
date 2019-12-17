import React, {Component} from 'react';
import ProductList from '../components/product_list'
import Keypad from '../components/keypad'
import ActionGrid from '../components/actions'
import Modal from 'react-modal';
import {Router, Route, Switch} from 'react-router-dom';
import {createBrowserHistory} from 'history'
import ProductsPage from './products'
import CheckoutPage from './payment'
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
        modalOpen: false
        
    }

    openCheckout =() =>{
        this.setState({modalOpen: true});
        history.push("/payment")
    }

    openSearch =() =>{

    }

    openCustomers =() =>{

    }

    openProducts =() =>{

    }

    removeProduct = () =>{

    }

    addProduct = () =>{

    }

    voidSale = () =>{

    }

    endSession = () =>{

    }

    executeAction = (name) =>{
        switch(name){
            case 'search': 
                this.openSearch()
                break;
            case 'checkout': 
                this.openCheckout()
                break;
            case 'customers': 
                this.openCustomers()
                break;
            case 'products': 
                this.openProducts()
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

    suspendSale = () =>{

    }

    
    componentDidMount(){
        //Master keyboard event handler
        const handler = (evt) =>{
            console.log(evt.key)
            if(["0","1","2","3","4","5","6","7","8","9","."].includes(evt.key)){
                this.setState({keypadText: this.state.keypadText + evt.key})
                
            }else if(evt.key=='Backspace'){
                const newText = this.state.keypadText.slice(0, 
                    this.state.keypadText.length-2)
                this.setState({keypadText: newText})
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
                actionHandler: this.executeAction
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
                                <Route path='/products' component={ProductsPage} />
                                <Route path='/payment' component={CheckoutPage}/>
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