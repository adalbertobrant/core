import React, {useState, useEffect} from 'react';
import styles from './css/keypad.css';

const Keypad = (props) =>{
    return(
        <div className={styles.keypad_container}>
            <h2>
            <KeypadStateIndicator {...props}/>
            
            </h2>
            <input 
                type="number" 
                value={props.text}
                className={styles.keypad_input} 
                onChange={props.keypadHandler}/>
            <KeypadKeys 
                setText={props.setText}
                text={props.text}/>
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
            <div>
                <button 
                  className={styles.enterButton}
                  onClick={props.handleEnter}
                  type="button"> 
                    <i className="fas fa-angle-up"></i> Enter
                </button>
            </div>
        </div>

    )
}

const KeyPadButton = (props) =>{
    return (
        <button 
            className={styles.button}
            onClick={() =>{
                props.handler(props.inputValue + props.value)
            }} 
            type="button">{props.value}</button>
    )
}


const KeypadStateIndicator =(props) =>{
    return(
        <React.Fragment>
            <KeypadState 
                active={props.mode =='barcode'}
                setKeypadMode={props.changeMode}
                mode='barcode'>
                <i className="fas fa-barcode    "></i>
            </KeypadState>
            <KeypadState 
                active={props.mode =='price'}
                setKeypadMode={props.changeMode}
                mode='price'>
                <i className="fas fa-dollar-sign    "></i>
            </KeypadState>
            <KeypadState 
                active={props.mode =='quantity'}
                setKeypadMode={props.changeMode}
                mode='quantity'>
                <i className="fas fa-sort-numeric-up    "></i>
            </KeypadState>
        </React.Fragment>
    )
}

const KeypadState = (props) =>{
    const wide = window.screen.width > 600
    return(<span style={{textTransform: 'capitalize'}} 
                className={ props.active ? styles.activeMode : null}
                onClick={() => props.setKeypadMode(props.mode)}>
            {wide ? props.mode : props.children}
        </span>)
}

const KeypadKeys = (props) =>{
    return(
        <React.Fragment>
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
        </React.Fragment>
    )
}

const CheckoutKeypad = (props) =>{
    return(
        <div>
            <input 
                type="number" 
                value={props.text}
                className={styles.keypad_input} 
                onChange={evt =>props.keypadHandler(evt.target.value)}
                autoFocus/>
            <KeypadKeys 
                setText={props.setText}
                text={props.text}/>
            <div className={styles.keypad_row}>
                <KeyPadButton 
                    handler={props.setText}
                    inputValue={props.text}
                    value="."/>
                <KeyPadButton 
                    handler={props.setText}
                    inputValue={props.text}
                    value="0"/>
                <button 
                    className={styles.button}
                    onClick={() =>{
                        const num = props.text
                        const asString = num.toString()
                        if(asString.length == 1){
                            props.setText(0)
                        }else{
                            const newString = asString.slice(0, 
                                asString.length-1)
                            props.setText(parseFloat(newString))
                        }
                        
                    }} 
                    type="button"> {'<'} </button>
            </div>
        </div>
    )
}

export {Keypad, CheckoutKeypad, KeypadStateIndicator};