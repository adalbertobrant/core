import React from 'react';
import MiniCalendar from '../components/mini_calendar';
import styles from './sidebar.css';

const sidebar = (props) =>{
    const titleHeight = document.getElementById('title').offsetHeight;
    const height = document.documentElement.clientHeight - titleHeight -2;
    return(
        <div id="sidebar" className={styles.sidebar} style={{height:height}}>
        {props.eventLink ? <a href={props.eventLink}
        className="btn btn-primary btn-block"> <i className="fas fa-plus"></i> Create New Event</a> : null}
            <div className="btn-group">            
                {props.showMonth ? 
                    <button className="btn btn-primary" 
                    onClick={()=>{props.setView('month')}}><i className="fa fas-calendar"></i> Month</button>:null}
                {props.showWeek ?
                    <button className="btn btn-primary" 
                    onClick={()=>{props.setView('week')}}><i className="fa fas-calendar"></i> Week</button> : null}
                {props.showDay ?
                    <button className="btn btn-primary" 
                    onClick={()=>{props.setView('day')}}><i className="fa fas-calendar"></i> Day</button>:null}
            </div>
            <div className="btn-group">
                <button
                    className="btn btn-primary"
                    onClick={props.prevHandler}>
                        <i className="fas fa-arrow-left"></i>
                </button>    
                <button
                    className="btn btn-primary"
                    onClick={props.nextHandler}>
                        <i className="fas fa-arrow-right"></i>
                </button>
            </div>
            <div>
            <MiniCalendar 
                year={props.calendarState.year}
                month={props.calendarState.month} />
        
            </div>
            
        </div>
    );

}


export default sidebar;