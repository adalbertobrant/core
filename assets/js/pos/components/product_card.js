import React from 'react';
import styles from './css/product.css'

const ProductCard =(props) =>{
    return(
        <div className={styles.card}>
            <div></div>
            <div>
                <p>Product Name</p>
                <p>Price</p>
            </div>
        </div>
    )
}

export default ProductCard