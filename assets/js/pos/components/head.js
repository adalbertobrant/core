import React, {useEffect, useState, useRef} from 'react';
import styles from './css/head.css';
import Context from '../container/provider'
import {ActionButton} from './actions'

function useInterval(callback, delay) {
    const savedCallback = useRef();
  
    // Remember the latest function.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }


const head =(props) =>{
    const wide = window.screen.width > 600 
    return(
         wide ? 
            <div className={styles.head_container}>
                <div className={styles.logo}>
                    <h4 className='logo text-white' style={{textAlign:'left'}}>Bentsch</h4>
                </div>
            <HeadStats {...props}/>
        </div>
        : <MobileHeader {...props}/>
        )
}

const HeadStats = (props) =>{
    const [time, setTime] = useState(new Date())
    
    const [duration, setDuration] = useState(
        new Date(time - props.sessionStart))
    
    useEffect(() =>{
        setInterval(() =>{
            setTime(new Date())
            
        }, 1000)
    }, [])

    useInterval(()=>{
        let d = new Date(time-props.sessionStart)
        setDuration(d)
    }, 1000)

    return(
        <Context.Consumer>
            {(context) =>{

                return (
        <React.Fragment>
            <div className={styles.status}>
                <h5>Status</h5>
                <table className="table-sm">
                    <tbody>
                        <tr>
                            <td>Current Time</td>
                            <td>{("0" + time.getHours()).slice(-2)}:{("0" + time.getMinutes()).slice(-2)}:{("0" + time.getSeconds()).slice(-2)}</td>
                        </tr>
                        <tr>
                            <td>Current Sales Person: </td>
                            <td>{context.state.salesPerson}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className={styles.time}>
                <h5>Time</h5>
                <table className="table-sm">
                    <tbody>
                        
                        <tr>
                            <td>Session Start</td>
                            <td>{("0" + props.sessionStart.getHours()).slice(-2)}:{("0" + props.sessionStart.getMinutes()).slice(-2)}:{("0" + props.sessionStart.getSeconds()).slice(-2)}</td>
                        </tr>
                        <tr>
                            <td>Session Duration</td>
                            {/* -2 because of gmt */}
                            <td>{("0" + (duration.getHours() -2)).slice(-2)}:{("0" + (duration.getMinutes())).slice(-2)}:{("0" + (duration.getSeconds())).slice(-2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </React.Fragment>
        )
    }
}
</Context.Consumer>
    )
}

const MobileHeader =(props) =>{
    const [showStats, setShowStats] = useState(false)
    const [showActions, setShowActions] = useState(false)
    return (
        <div className={styles.mobileHeader}>
            <button 
                className='btn btn-primary'
                onClick={() => setShowStats(true)}> <i className="fas fa-bars    "></i> </button>
            <div className={styles.logo}>
                    <a className='text-white' href="/invoicing/"><h4 className='logo' style={{textAlign:'left'}}>Bentsch</h4></a>
                </div>
            <button 
                className='btn btn-primary'
                onClick={() => setShowActions(true)}> <i className="fa fa-ellipsis-v" aria-hidden="true"></i> </button>
            <div className={styles.overlay} 
                 style={{
                    display: showStats || showActions ? 'block' : 'none'
                }}
                onClick={()=>{
                    setShowActions(false);
                    setShowStats(false)
                }}>
                <div 
                    style={{display: showStats ? 'block': 'none'}}
                    className={styles.statsDrawer} 
                    onClick={evt => evt.stopPropagation()}>
                    <h4>Session Stats</h4>
                    <HeadStats {...props} />
                </div>
                <div>
                    <ActionButtons />
                </div>
            </div>
        </div>
    )
}

const ActionButtons =(props) =>{
    return(
        <div className={styles.actionDrawer}>
            <h4>Actions</h4>
            <ul className="list-group">
                <li className="list-group-item">
                    <ActionButton 
                        sm
                        clear
                        action='price-check'
                        text='PRICE CHECK'
                        keyboardKey='F2' />
                </li>
                <li className="list-group-item">
                    <ActionButton 
                        sm
                        clear
                        action='void'
                        text='VOID'
                        keyboardKey='F4' />
                </li>
                <li className="list-group-item">
                    <ActionButton 
                        sm
                        clear
                        action='suspend'
                        text='SUSPEND | Restore'
                        keyboardKey='F6' />
                </li>
                <li className="list-group-item">
                    <ActionButton 
                        sm
                        clear
                        action='customers'
                        text='CUSTOMERS'
                        keyboardKey='F7' />
                </li>
                <li className="list-group-item">
                    <ActionButton 
                        sm
                        clear
                        action='checkout'
                        text='PAYMENT'
                        keyboardKey='PageUp' />
                </li>
                <li className="list-group-item">
                    <ActionButton 
                        sm
                        clear
                        action='quote'
                        text='QUOTE | SALE'
                        keyboardKey='PageDown' />
                </li>
                <li className="list-group-item">
                    <ActionButton 
                        sm
                        clear
                        action='endSession'
                        text='LOGOUT'
                        keyboardKey='Insert' />
                    
                </li>
            </ul>
        </div>
    )
}

export default head;