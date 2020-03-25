import React, {useEffect, useState} from 'react'
import styles from '../style.css'


const tasks = (props) =>{
    
    return(
        <div className={styles.taskBarChart} style={{
            width: `${props.wingspan}px`,
            top: `${props.verticalOffset}px`,
            left: `${props.horizontalOffset}px`,
            }}>
            {props.tasks.map((task, i) =>{
                let leftOffset=(new Date(task.start) - props.start) / (24 * 60 * 60 * 1000)
                let width=(new Date(task.due) - new Date(task.start)) / (24 * 60 * 60 * 1000)
                return(<div className={styles.taskBar}
                            style={{
                                backgroundColor: props.colors[i % 12],
                                width: `${width * 24}px`,
                                left: `${leftOffset * 24}px`
                                }}>
                    {task.completed 
                        ? <i className="fas fa-check    "></i> 
                        : props.today > new Date(task.due) 
                            ? <i className="fas fa-exclamation    "></i>
                            : <i className="fas fa-times    "></i>}
                </div>)
            })}
        </div>
    )
}

export default tasks