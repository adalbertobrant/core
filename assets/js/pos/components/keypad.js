import React, {useState, useEffect} from 'react';
import styles from './css/keypad.css';

const Keypad = (props) =>{
    
    return(
        <div className={styles.keypad_container}>
            <h2>Barcode | Price | Quantity</h2>
            <input 
                type="text" 
                value={props.text}
                className={styles.keypad_input} 
                onChange={props.keypadHandler}/>
            <div className={styles.keypad_row}>
                <KeyPadButton 
                    handler={props.setText}
                    inputValue={props.text}
                    value="7"/>
                <KeyPadButton 
                    handler={props.setText}
                    inputValue={props.text}
                    value="8"/>
                <KeyPadButton 
                    handler={props.setText}
                    inputValue={props.text}
                    value="9"/>
            </div>
            <div className={styles.keypad_row}>
                <KeyPadButton 
                    handler={props.setText}
                    inputValue={props.text}
                    value="4"/>
                <KeyPadButton 
                    handler={props.setText}
                    inputValue={props.text}
                    value="5"/>
                <KeyPadButton 
                    handler={props.setText}
                    inputValue={props.text}
                    value="6"/>
            </div>
            <div className={styles.keypad_row}>
                <KeyPadButton 
                    handler={props.setText}
                    inputValue={props.text}
                    value="1"/>
                <KeyPadButton 
                    handler={props.setText}
                    inputValue={props.text}
                    value="2"/>
                <KeyPadButton 
                    handler={props.setText}
                    inputValue={props.text}
                    value="3"/>
            </div>
            <div className={styles.keypad_row}>
                <KeyPadButton 
                    handler={props.setText}
                    inputValue={props.text}
                    value="."/>
                <KeyPadButton 
                    handler={props.setText}
                    inputValue={props.text}
                    value="0"/>
                <KeyPadButton 
                    handler={props.setText}
                    inputValue={props.text}
                    value=".00"/>
            </div>
        </div>

    )
}

const KeyPadButton = (props) =>{
    return (
        <button 
            class={styles.button}
            onClick={() =>{
                props.handler(props.inputValue + props.value)
            }} 
            type="button">{props.value}</button>
    )
}

export default Keypad;