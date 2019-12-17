import React, {useEffect, useState} from 'react';
import styles from './css/action.css'
import Coontext from '../container/provider';
import Context from '../container/provider';

const ActionGrid = () =>{
    return(
        <div className={styles.action_container}>
            <div className={styles.action_row}>
                <ActionButton 
                    action='search'
                    text='SEARCH'
                    keyboardKey='F1' />
                <ActionButton 
                    action='void'
                    text='VOID'
                    keyboardKey='F1' />
            </div>
            <div className={styles.action_row}>
                <ActionButton 
                    action='suspend'
                    text='SUSPEND | Restore'
                    keyboardKey='F1' />
                <ActionButton 
                    action='discount'
                    text='DISCOUNT'
                    keyboardKey='F1' />
            </div>
            <div className={styles.action_row}>
                <ActionButton 
                    action='customers'
                    text='CUSTOMERS'
                    keyboardKey='F1' />
                <ActionButton 
                    action={() => {alert('Action!')}}
                    text='REFUND'
                    keyboardKey='F1' />
            </div>
            <div className={styles.action_row}>
                <ActionButton 
                    action='products'
                    text='PRICE CHECK'
                    keyboardKey='F1' />
                <ActionButton 
                    action='endSession'
                    text='LOGOUT'
                    keyboardKey='F1' />
                
            </div>
            <div className={styles.action_row}>
                <ActionButton 
                    action='checkout'
                    text='PAYMENT' />
                <ActionButton 
                    action='quote'
                    text='QUOTE | SALE'
                    keyboardKey='F10' />
            </div>
        </div>
    )
}

const ActionButton = (props)=>{
    const hoverEffectStyle = {
        backgroundColor: '#23374d',
        color: 'white',
        border: '0px'
    }
    return(
        <Context.Consumer>{context =>(
            <button 
                onClick={() => context.actionHandler(props.action)}
                className={styles.button}>
            <p>{props.text}</p>
                <p>{props.keyboardKey}</p>
            </button>
        )}</Context.Consumer>
    )
}

export default ActionGrid;
export {ActionButton};