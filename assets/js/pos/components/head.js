import React from 'react';
import styles from './css/head.css';

const head =(props) =>{
    return(
        <div className={styles.head_container}>
            <div className={styles.logo}><h4>Umisoft</h4></div>
            <div className={styles.status}>
            Status
            <table className="table-sm">
                <tbody>
                    <tr>
                        <td>Current Customer: </td>
                        <td>Caleb</td>
                    </tr>
                    <tr>
                        <td>Current Mode: </td>
                        <td>Caleb</td>
                    </tr>
                    <tr>
                        <td>Current Sales Person: </td>
                        <td>Caleb</td>
                    </tr>
                </tbody>
            </table>
            </div>
            <div className={styles.time}>Time
                <table className="table-sm">
                    <tbody>
                        <tr>
                            <td>Current Time</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Session Start</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Session Duration</td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>            
            </div>
        </div>
    )
}

export default head;