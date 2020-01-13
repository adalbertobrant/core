import React, {useEffect, useState, useRef} from 'react';
import styles from './css/head.css';
import Context from '../container/provider'

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
                return (<div className={styles.head_container}>
            <div className={styles.logo}><a className='text-white' href="/invoicing/"><h4 className='logo' style={{textAlign:'left'}}>Bentsch</h4></a></div>
            <div className={styles.status}>
            Status
            <table className="table-sm">
                <tbody>
                    <tr>
                        <td>Current Customer: </td>
                        <td>{context.state.currentCustomer}</td>
                    </tr>
                    <tr>
                        <td>Current Mode: </td>
                        <td>{context.state.isQuote ? "QUOTE": "SALE"} MODE</td>
                    </tr>
                    <tr>
                        <td>Current Sales Person: </td>
                        <td>{context.state.salesPerson}</td>
                    </tr>
                </tbody>
            </table>
            </div>
            <div className={styles.time}>Time
                <table className="table-sm">
                    <tbody>
                        <tr>
                            <td>Current Time</td>
                            <td>{("0" + time.getHours()).slice(-2)}:{("0" + time.getMinutes()).slice(-2)}:{("0" + time.getSeconds()).slice(-2)}</td>
                        </tr>
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
        </div>)
            }
            }
        </Context.Consumer>
        )
}

export default head;