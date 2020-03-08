import React, {useState} from 'react';
import Event from '../Event';
import styles from './Day.css';
import Context from '../../container/provider';

const dayMonth = (props) => {
    //calculate the dimensions of the day
    const windowWidth = document.documentElement.clientWidth;
    const sidebarWidth = document.getElementById('sidebar').offsetWidth;
    const calendarWidth = windowWidth - sidebarWidth;
    const cellWidth = (calendarWidth - 15 /**8-5 + !!2 */) / 7;

    const daysLabelHeight = 32;
    const windowHeight = document.documentElement.clientHeight;
    const contentHeight = windowHeight - daysLabelHeight - props.offsetTop;
    //5 for the width of the table borders
    const cellHeight = (contentHeight -5)/ 6;

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
        <div className={styles.mobileDay} style={{...dayWrapper,
                    backgroundColor: props.data.current ? 'white' : '#ddd'}}>
            
            <div style={labelStyle}>
                <span style={{
                    float:'right'
                }}><h5>
                        {props.showDay ? 
                            <span onClick={()=>{
                                props.setDate({
                                    year: props.data.date.getFullYear(),
                                    month:props.data.date.getMonth(),
                                    day: props.data.day,
                                    view: 'day'
                                })
                            }} 
>
                        {props.data.day}</span>
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
            {eventsList.length < 3 ? 
                eventsList.map((event, i) =>(
                    <Event 
                        width={props.width}
                        key={i} 
                        data={event}
                        view={props.view}/>
                ))
                :
                    <HoverableEventList 
                        width={props.width}
                        view={props.view}
                        events={eventsList}/>
            }
            </div>
        </div>
    )
}


const HoverableEventList = (props) =>{
    const [showEvents, setShowEvents] =  useState(false)
    return(<Context.Consumer>{context=>(
        <div> 
            <div style={{backgroundColor: context.primary}} className={styles.eventBox}
                onClick={()=>setShowEvents(true)}>
                ({props.events.length}) Events
            </div>
            <div className={styles.hiddenEventsList} style={{
                display: showEvents ? 'block': 'none'
            }}>
                <div style={{display:'flex', flexDirection: 'row', marginBottom:'12px'}}>
                    <h3 style={{width:'90%'}}>Events: </h3>

                    <button className='btn' onClick={()=>setShowEvents(false)}><i className="fa fa-times" aria-hidden="true"></i></button>
                </div>
                {props.events.map((event) =>(
                <a key={event.id} href={"/planner/event-detail/" + event.id}>
                        <div className={styles.eventBox} style={{
                            marginBottom: '5px',
                            backgroundColor: context.primary
                        }}>
                            {event.title}
                        </div>
                    </a>
                ))}
            </div>
    </div>

    )}</Context.Consumer>)
}

export default dayMonth;