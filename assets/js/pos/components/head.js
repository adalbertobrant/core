import React from 'react';
import styles from './css/head.css';

const head =(props) =>{
    return(
        <div className={styles.head_container}>
            <div>Logo</div>
            <div>Current User</div>
            <div>Current Time</div>
        </div>
    )
}

export default head;