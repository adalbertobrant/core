import React, {useState} from 'react';
import styles from './css/product.css';
import {ActionButton} from './actions';
import {KeypadStateIndicator} from './keypad'

const ProductList = (props) =>{
    const subtotal = props.products.reduce((total, product) =>{
        return(total + (product.quantity * product.price))
    }, 0)
    const total = props.products.reduce((total, product) =>{
        if(product.tax != null){
            return(total + (product.quantity * (product.price * (product.tax.rate / 100.0)))) 
        }else{
            return total + (product.quantity * product.price )
        }
    }, 0)

    const wide =window.screen.width > 600

    return(
        <div className={styles.container}>
            <div className={styles.keypadState} 
                 style={{display: wide ? 'none': 'flex'}}>
                <KeypadStateIndicator 
                    mode={props.mode}
                    changeMode={props.changeMode}/>
            </div>
            <div style={{maxHeight: window.innerHeight * .65,
                overflowY: 'scroll'}}>
            <table className="table table-sm" height={window.innerHeight * .65}>
            <thead>
                <tr>
                    <th style={{width: '60%'}}>Product</th>
                    <th>Qty</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody style={{overflowY: 'auto'}}>
                
                {props.products.map((product, i) => (
                    <ProductListing {...product}
                        active={props.active == i}
                        handler={() => props.setActive(i)}/>))}
                <tr className={styles.emptyRow}>
                    <td ></td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan={2}>NET</td>
                    <td>{subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                    <td colSpan={2}>TAX</td>
                    <td>{(total - subtotal).toFixed(2)}</td>
                </tr>
                <tr>
                    <td colSpan={2}><h3>TOTAL</h3></td>
                    <td><h3>{total.toFixed(2)}</h3></td>
                </tr>
            </tfoot>
        </table>
        
            </div>
            <div  className={styles.bottomControls}>
            
            <div className={styles.productInput} 
                 style={{display: wide ? 'none': 'flex'}}>
                <input 
                    type="number" 
                    className='form-input'
                    value ={props.inputText}/>
                <button 
                    className='btn btn-primary'
                    onClick={props.handleEnter}> 
                    <i className="fas fa-caret-up fa-3x" aria-hidden="true"></i> </button>
            </div>
            <div style={{
                width: '100%', 
                display: 'flex',
                flexDirection: 'row'}}>
                        <ActionButton 
                            sm
                            clear={!wide}
                            action='addProduct'
                            text='ADD Item'
                            keyboardKey='Shift'/>
                        <ActionButton 
                            sm
                            clear={!wide}
                            action='removeProduct'
                            text='DEL Item'
                            keyboardKey='Control'/>
            </div>
            </div>
        </div>
    )
}

const ProductListing = (props) =>{
    return(
        <tr className={styles.listing + ' ' + (props.active
            ? styles.activeListing
            : null )}
            onClick={props.handler}>
            <td>{props.name}</td>
            <td>{props.quantity}</td>
            <td>{(props.price * props.quantity).toFixed(2)}</td>
        </tr>
    )
}

export default ProductList