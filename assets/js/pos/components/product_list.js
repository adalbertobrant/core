import React from 'react';
import styles from './css/product.css';
import {ActionButton} from './actions';

const ProductList = (props) =>{
    return(
        <div className={styles.container}>
            <table className="table table-sm">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className={styles.emptyRow}>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    {props.products.map(product => (
                        <ProductListing {...product}/>))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={2}>NET</td>
                        <td>40.00</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>TAX</td>
                        <td>5.00</td>
                    </tr>
                    <tr>
                        <td colSpan={2}><h3>TOTAL</h3></td>
                        <td><h3>45.00</h3></td>
                    </tr>
                </tfoot>
            </table>
            <div style={{width: '100%'}}>
                        <ActionButton 
                            action='addProduct'
                            text='Add Product'
                            keyboardKey='Shift'/>
                        <ActionButton 
                            action='removeProduct'
                            text='Remove Product'
                            keyboardKey='Control'/>
            </div>
        </div>
    )
}

const ProductListing = (props) =>{
    return(
        <tr>
            <td>{props.product}</td>
            <td>{props.quantity}</td>
            <td>{props.subtotal}</td>
        </tr>
    )
}

export default ProductList