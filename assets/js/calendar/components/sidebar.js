import React from 'react';
import MiniCalendar from '../components/mini_calendar';
import styles from './sidebar.css';
import Context from '../container/provider'

const sidebar = (props) =>{
    const height = document.documentElement.clientHeight - props.offsetTop -2;
    return(
        <Context.Consumer>{context=>(
            <div id="sidebar" className={styles.sidebar} style={{
                height:height,
                backgroundColor: context.primary}}>
        {props.eventLink ? <a href={props.eventLink}
        className="btn btn-block text-white" style={{backgroundColor: context.primary}}> <i className="fas fa-plus"></i> <span className={styles.createText}>Create New Event</span>
        </a> : null}
            <div className="btn-group">            
                {props.showMonth ? 
                    <button className="btn text-white"
                    style={{backgroundColor: context.primary}}
                    onClick={()=>{props.setView('month')}}><i className="fa fas-calendar"></i> Month</button>:null}
                {props.showWeek ?
                    <button className="btn text-white" 
                    style={{backgroundColor: context.primary}}
                    onClick={()=>{props.setView('week')}}><i className="fa fas-calendar"></i> Week</button> : null}
                {props.showDay ?
                    <button className="btn text-white" 
                    style={{backgroundColor: context.primary}}
                    onClick={()=>{props.setView('day')}}><i className="fa fas-calendar"></i> Day</button>:null}
            </div>
            <div className="btn-group">
                <button
                    className="btn text-white"
                    style={{backgroundColor: context.primary}}
                    onClick={props.prevHandler}>
                        <i className="fas fa-arrow-left"></i>
                </button>    
                <button
                    style={{backgroundColor: context.primary}}
                    className="btn text-white"
                    onClick={props.nextHandler}>
                        <i className="fas fa-arrow-right"></i>
                </button>
            </div>
            <div>
            <MiniCalendar 
                monthString={props.monthString}
                year={props.calendarState.year}
                month={props.calendarState.month} />
            </div>
        </div>
        )}</Context.Consumer>
    );

}


export default sidebar;