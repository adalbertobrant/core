import React, {useState} from 'react';
import AsyncSelect from '../../src/components/async_select'
import styles from '../container/app.css'
import axios from '../../src/auth'


const StartSessionPage =(props) =>{
    const [pwd, setPwd] = useState('')
    const [usr, setUsr] = useState('')
    return (
        <div className={styles.modalCard} style={{width: "300px"}}>
            <h1>Start New Session</h1>
            <hr className='my-4'/>
            <label htmlFor="">Cashier:</label>
            <AsyncSelect 
                dataURL='/invoicing/api/sales-rep/'
                resProcessor={res =>{
                    return res.data.map(rep =>({
                        name: rep.rep_name,
                        value: rep.number
                    }))
                }}
                handler={val => setUsr(val)}/> <br/>
            <label htmlFor="">Pin:</label>
            <input type="text" 
                className='form-control'
                value={pwd}
                onChange={evt => setPwd(evt.target.value)}/> <br/>
            <button className="btn btn-block btn-lg primary"
                onClick={() =>{
                    if(usr == ''){bentschAlert('Please select a user');return;}
                    axios.get('/employees/api/employee/' + usr)
                        .then(res =>{
                            if(res.data.pin == pwd){
                                props.sessionStartSuccessful(
                                    usr + ' - ' + res.data.first_name +
                                    ', ' + res.data.last_name)
                            }else{
                                bentschAlert('The pin supplied is incorrect')
                            }
                        })
                }}>Login</button>
        </div>
    )
}

export default StartSessionPage