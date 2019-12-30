import React, {useEffect} from 'react'
import styles from '../container/app.css'

const completedSalePage =(props) =>{
    console.log(props)
    const subtotal = props.products.reduce((total, current)=>{
        return total + (current.price * current.quantity)
    }, 0)
    const tax = props.products.reduce((total, current)=>{
        if(current.tax != null){
            return total + ((current.price * current.quantity) * (current.tax.rate / 100.0))
        }else{
            return total
        }
        
    }, 0)

    const total = subtotal + tax
    const tendered = props.checkout.payments.reduce((total, current) =>{
        return total + current.tendered
    }, 0)

    const change = tendered - total
    
    return(
        <div>
            <div style={{display: 'flex', justifyContent:'flex-end'}}>
                <button className="btn btn-lg primary" onClick={props.completeSale}>Next Order</button>
            </div>
            {/*Auto print receipt */}
            <h1>Validated Sale</h1>
            <hr className="my-2"/>
            <h4>Change: {change}</h4>
            <hr className="my-2"/>
            <h4>Receipt</h4>
            <div>
                <div className={styles.modalCard}>
                    <div style={{textAlign: 'center'}}>
                        <h5>Receipt</h5>
                        <p>Date: {new Date().toISOString()}</p>
                        <p>Receipt #: {props.receiptID}</p>
                        <hr/>
                        <p>Company: {}</p>
                        <p>Cashier: {props.salesPerson}</p>
                    </div>
                    <div style={{padding: '20px'}}>
                        <table style={{width: '100%'}}>
                            <tbody>
                                {props.products.map(product =>(<tr>
                                    <td>{product.name}</td>
                                    <td>{product.quantity}</td>
                                    <td style={{textAlign: 'right'}}>{product.price * product.quantity}</td>
                                </tr>))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={2}>Subtotal</td>
                                    <td>{subtotal}</td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>Tax</td>
                                    <td>{tax}</td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>Total</td>
                                    <td>{total}</td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>Tendered</td>
                                    <td>{tendered}</td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>Change</td>
                                    <td>{change}</td>
                                </tr>
                            </tfoot>
                        </table>
                        
                    </div>
                    <p>Thank you for your business</p>
                </div>
            </div>
            
        </div>
    )
}

export default completedSalePage;