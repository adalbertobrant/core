import React from 'react';
import Event from '../Event';
import styles from './Day.css';

const dayMonth = (props) => {
    //calculate the dimensions of the day
    const windowWidth = document.documentElement.clientWidth;
    const sidebarWidth = document.getElementById('sidebar').offsetWidth;
    const calendarWidth = windowWidth - sidebarWidth;
    const cellWidth = (calendarWidth - 15 /**8-5 + !!2 */) / 7;

    const daysLabelHeight = 32;
    const titleHeight = document.getElementById('title').offsetHeight;
    const windowHeight = document.documentElement.clientHeight;
    const contentHeight = windowHeight - daysLabelHeight - titleHeight;
    const cellHeight = (contentHeight -5)/ 5;

    let labelStyle = {
        clear:'both',
        width:'100%',
        height:'30px',
        
        };
    let dayWrapper={
            width: `${cellWidth}px`,//here
            height: `${cellHeight}px`,
        };
    
    let eventsList = [];
    let evt;
    for(evt of props.events){
        if(props.data.current && 
                evt.date.getDate() == props.data.date.getDate()){
            eventsList.push(evt)
        }
    }

    
    
    return(
        <div style={{...dayWrapper,
                    backgroundColor: props.data.current ? 'white' : '#ddd'}}>
            
            <div style={labelStyle}>
                <span style={{
                    float:'right'
                }}><h5>
                        {props.showDay ? 
                            <a href={`/calendar/day/${props.data.date.getFullYear()}/${props.data.date.getMonth() + 1}/${props.data.day}`}
>
                        {props.data.day}</a>
                        :<span>{props.data.day}</span>} 
                    </h5>
                </span>
            </div>
            <div 
                style={{
                    position: "relative",
                    width: `100%`,//here
                    height:`2rem`
                }}>
            {eventsList.length < 2 ? 
                eventsList.map((event, i) =>(
                    <Event 
                        width={props.width}
                        key={i} 
                        data={event}
                        view={props.view}/>
                ))
                :
                    <div className={styles.eventBox}>
                    <a style={{
                        textDecoration: 'none',
                        color: 'white'
                    }} href={`/calendar/day/${props.data.date}`}>({eventsList.length}) Events</a>
                    </div>
            }
            </div>
        </div>
    )
}

export default dayMonth;