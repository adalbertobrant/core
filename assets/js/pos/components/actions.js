import React, {useEffect, useState} from 'react';
import styles from './css/action.css'
import Context from '../container/provider';

const ActionGrid = () =>{
    return(
        <div className={styles.action_container}>
            <div className={styles.action_row}>
                <ActionButton 
                    action='search'
                    text='SEARCH'
                    keyboardKey='F2' />
                <ActionButton 
                    action='void'
                    text='VOID'
                    keyboardKey='F4' />
            </div>
            <div className={styles.action_row}>
                <ActionButton 
                    action='suspend'
                    text='SUSPEND | Restore'
                    keyboardKey='F1' />
                <ActionButton 
                    action='discount'
                    text='DISCOUNT'
                    keyboardKey='F6' />
            </div>
            <div className={styles.action_row}>
                <ActionButton 
                    action='customers'
                    text='CUSTOMERS'
                    keyboardKey='F7' />
                <ActionButton 
                    action={() => {alert('Action!')}}
                    text='REFUND'
                    keyboardKey='F9' />
            </div>
            <div className={styles.action_row}>
                <ActionButton 
                    action='products'
                    text='PRICE CHECK'
                    keyboardKey='F10' />
                <ActionButton 
                    action='endSession'
                    text='LOGOUT'
                    keyboardKey='Insert' />
                
            </div>
            <div className={styles.action_row}>
                <ActionButton 
                    action='checkout'
                    text='PAYMENT'
                    keyboardKey='PageUp' />
                <ActionButton 
                    action='quote'
                    text='QUOTE | SALE'
                    keyboardKey='PageDown' />
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
        <Context.Consumer>{context =>{
            context.updateMapping(props.keyboardKey, props.action)
            return(<button 
                onClick={() => context.actionHandler(props.action)}
                className={styles.button}>
            <p>{props.text}</p>
                <p>{props.keyboardKey}</p>
            </button>
        )}}</Context.Consumer>
    )
}

export default ActionGrid;
export {ActionButton};