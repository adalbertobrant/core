import React from 'react';
import styles from './css/product.css'

const ProductCard =(props) =>{
    return(
        <div className={styles.card + ' ' + (props.selected ? styles.card_selected : null)}
            onClick={props.handler}>
            <div className={styles.cardIcon}>
                <i className="fas fa-box  fa-2x"></i>
            </div>
            <div className={styles.cardText}>
                <h6>{props.data.name}</h6>
                <p>{props.data.unit_sales_price}</p>
            </div>
        </div>
    )
}

export default ProductCard