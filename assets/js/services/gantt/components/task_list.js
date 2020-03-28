import React, {useEffect, useState} from 'react'
import styles from '../style.css'
import axios from '../../../src/auth'

const Task =(props) =>{
    const [name, setName] = useState('')
    useEffect(() =>{
        axios.get('/employees/api/employee/' + props.assigned)
            .then(res =>{
                setName(`${res.data.first_name} ${res.data.last_name}`)
            })
    }, [])
    return(
        <div className={styles.taskCard}
                style={{backgroundColor: props.color}}>
        {props.description.slice(0,20) + '...(' + name +')'} 
    </div>
    )
}


const tasks = (props) =>{
    
    return(
        <div className={styles.taskList}>
            <div>
                <div className={styles.monthHeader}>
                    <h4>Tasks</h4>
                </div>
                <div style={{paddingTop: '26px'}}>
                    {props.tasks.map((task, i) =>{
                        return(<Task {...task} color={props.colors[i % 12]}/>)
                    })}
                </div>
            </div>
        </div>
    )
}



export default tasks