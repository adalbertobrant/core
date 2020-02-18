import React, {useEffect, useState} from 'react';
import styles from './css/action.css'
import Context from '../container/provider';

const ActionGrid = () =>{
    return(
        <div className={styles.action_container}>
            <div className={styles.action_row}>
                <ActionButton 
                    action='price-check'
                    text='PRICE CHECK'
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
                    keyboardKey='F6' />
                
                <ActionButton 
                    action='customers'
                    text='CUSTOMERS'
                    keyboardKey='F7' />
            </div>
            {/*<div className={styles.action_row}>
                <ActionButton 
                    action='discount'
                    text='DISCOUNT'
                keyboardKey='F6' />
                <ActionButton 
                    action={() => {alert('Action!')}}
                    text='REFUND'
                    keyboardKey='F9' />
            </div>*/}
            
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
            <div className={styles.action_row}>
                <ActionButton 
                    action='endSession'
                    text='LOGOUT'
                    keyboardKey='Insert' />
                
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
                style={{
                    height: props.sm ? 
                        '50px' : '100%',
                    backgroundColor: props.clear ? "transparent" 
                                                 : "#ccc",
                    border: props.clear ? '0px'
                                        : '1px solid #999' }}
                onClick={() => context.actionHandler(props.action)}
                className={styles.button}>
            {props.sm ?
                props.clear ? <span>{props.text}</span> : 
                <p>{props.text} <span>{'(' + props.keyboardKey + ')'}</span></p>
                : 
                <React.Fragment>
                    <p>{props.text}</p>
                    <p>{props.keyboardKey}</p>
                </React.Fragment>
            }
            </button>
        )}}</Context.Consumer>
    )
}

export default ActionGrid;
export {ActionButton};