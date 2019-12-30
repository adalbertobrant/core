import React, {Component} from 'react';
import styles from '../container/app.css'
import {CheckoutKeypad} from '../components/keypad'

class CheckoutPage extends Component{
    state = {
        amount: '',
        payments: [],
        due: 0,
        active: null,
        canValidate: false
    }

    handleMethodClick =(method) =>{
        const paid = this.state.payments.reduce((total, payment)=>{
            return(total + payment.tendered)
        }, 0)
        const due = this.state.due - paid

        let newPayments = [...this.state.payments]
        newPayments.push({
            due: due,
            tendered: 0,
            change: 0,
            method: method
        })
        this.setState({
                payments: newPayments,
                active: this.state.payments.length,
                amount: ""
            })
    }

    calculateDue = () =>{
        const total = this.props.products.reduce((total, product) =>{
            if(product.tax != null){
                return(total + (product.quantity * (product.price * (product.tax.rate / 100.0)))) 
            }else{
                return total + (product.quantity * product.price )
            }
        }, 0)
        this.setState({due: total})
    }
    
    componentDidMount(){
        this.calculateDue()
    }

    handleKeypadText = (amt) =>{
        if(this.state.active === null){return}
        const val =parseFloat(amt)
        let newPayments = []
        let canValidate = this.state.canValidate
        
        newPayments = [...this.state.payments]
        console.log(newPayments)
        let activePayment = newPayments[this.state.active]
        activePayment.tendered = val
        if(val >= activePayment.due){
            activePayment.change = val - activePayment.due,
            canValidate = true
        }
        newPayments[this.state.active] = activePayment 
        this.setState({
            amount: val,
            payments: newPayments,
            canValidate: canValidate
        })
        
    }
    render(){
        return(
            <div>
                <h1>Checkout Page</h1>
                <hr className="my-2"/>
                <p>Process payment for the current sale.</p>
                <div style={{display:'flex', flexDirection:'row'}}>
                    <div style={{flex: 1, marginRight: '5px'}}>
                    <h3>Payment Method</h3>
                    <button className="btn btn-lg btn-block hover-primary"
                      onClick={()=>this.handleMethodClick('Cash(ZWL)')}>
                        CASH(ZWL)</button>
                    <button className="btn btn-lg btn-block hover-primary"
                      onClick={()=>this.handleMethodClick('Cash(USD)')}>
                        CASH(USD)</button>
                    <button className="btn btn-lg btn-block hover-primary"
                      onClick={()=>this.handleMethodClick('ZIMSWITCH')}>
                        ZIMSWITCH</button>
                    <button className="btn btn-lg btn-block hover-primary"
                      onClick={()=>this.handleMethodClick('VISA/MASTERCARD')}>
                        VISA/MASTERCARD</button>
                    <button className="btn btn-lg btn-block hover-primary"
                      onClick={()=>this.handleMethodClick('ECOCASH')}>
                        ECOCASH</button>
                    </div>
                    <div style={{
                      flex: 2, 
                      display:'flex', 
                      flexDirection:'column'}}>
                        <div>
                            <div style={{display:'flex', flexDirection: 'row', justifyContent: 'flex-end', marginBottom: '5px'}}>
                                <button 
                                    className='btn btn-lg primary'
                                    disabled={!this.state.canValidate}
                                    onClick={() =>this.props.checkoutAction(this.state)}>Validate</button>
                            </div>
                            <table className="table">
                                <thead>
                                    <tr className='text-white primary'>
                                        <th>Due</th>
                                        <th>Tendered</th>
                                        <th>Change</th>
                                        <th>Method</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.payments.map((payment, i)=>(
                                        <tr key={i} className={
                                            this.state.active == i 
                                              ? styles.checkoutActive
                                              : null}
                                                onClick={() =>this.setState({
                                                    active: i})}>
                                            <td>{payment.due.toFixed(2)}</td>
                                            <td>{payment.tendered.toFixed(2)}</td>
                                            <td>{payment.change.toFixed(2)}</td>
                                            <td>{payment.method}</td>
                                            <td></td>
                                        </tr>))}
                                </tbody>
                            </table>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'row'}}>
                            <div>
                                <CheckoutKeypad 
                                    text={this.state.amount}
                                    setText={this.handleKeypadText}
                                    keypadHandler={this.handleKeypadText}/>
                            </div>
                            <div>
                                <h3>Current Customer:</h3>
                                <p>{this.props.currentCustomer}</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default CheckoutPage;