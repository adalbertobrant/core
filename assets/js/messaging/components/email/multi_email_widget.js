import React, {useState, useEffect} from 'react'
import styles from './compose.css'


const emailWidget = (props) =>{
    const [current, setCurrent] = useState('')

    useEffect(() =>{
        const re = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        if(re.exec(current)){
        document.getElementById(props.ID).addEventListener('keyup', evt =>{
            if(evt.keyCode == '13' || evt.keyCode == '32'){
                    let newEmails = [...props.emails] 
                    newEmails.push(current)
                    props.setEmails(newEmails)
                    setCurrent('')
            }
        })
        }
    }, [current])
    return(
        <div className={styles.emailWidget}>
            {props.emails.map((eml, i) =>(
                <span className={styles.email}>{eml}</span>
            ))}
            <input type="email" 
                    id={props.ID}
                    className={styles.emailInput}
                    value={current}
                onChange={evt=>{setCurrent(evt.target.value)}}/>
            <button className={styles.inputButton}
                type='button'
                onClick={() =>{
                    const re = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
                    if(re.exec(current)){
                        let newEmails = [...props.emails] 
                        newEmails.push(current)
                        props.setEmails(newEmails)
                        setCurrent('')
                    }
                }}>
                <i className="fas fa-plus"></i>
            </button>
        </div>
    )

}

export default emailWidget