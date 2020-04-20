import React, {useState, useEffect} from 'react'
import styles from '../style.css'

// Props 
//      month 
//      year
//      start number if null the first
//      end number if null the last day of the month

const month = (props) => {
    let first
    if(props.start){
        first = new Date(`${props.month}/${props.start}/${props.year}`)
    }else{
        first = new Date(`${props.month}/1/${props.year}`)
    }

    let last
    if(props.end){
        last = new Date(props.year, props.month, props.end + 1)
    }else{
        last = new Date(props.year, props.month + 1, 0)
    }
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December']
    let days = new Array(last.getDate() + 1 - first.getDate()).fill(0)
    days = days.map((val, index) => {
        return(index + first.getDate())
    })
    return(
        <div>
            <div className={styles.monthHeader} style={{width: `${days.length * 24}px`}}>
                <h4>{`${months[props.month]} ${props.year}`}</h4>
            </div>
            <div className={styles.ganttTable}>
                <div className={styles.ganttTableRow}>
                    {days.map(val=>{
                            const today = props.year == props.today.getFullYear() &&
                                            props.month == props.today.getMonth() &&
                                            val == props.today.getDate() 
                            return(
                                <div className={styles.ganttTableCell}
                                    style={{
                                        color: today ? 'white':'black',
                                        backgroundColor: today ? 'black': 'white'
                                    }}>{val}</div>
                            )} )}
                </div>
                <div  className={styles.ganttTableRow} style={{
                                    minHeight: '50vh',
                                    height: `${props.tasks.length * 48}px`
                                    }}>
                    {days.map(val =>{
                            const today = props.year == props.today.getFullYear() &&
                                            props.month == props.today.getMonth() &&
                                            val == props.today.getDate()
                            return(
                                <div className={styles.ganttTableCell} 
                                    style={{
                                        borderLeftColor: today ? 'black': '#ccc'
                                    }}></div>
                            )} )}
                </div>
            </div>
        </div>
    )
}


export default month
