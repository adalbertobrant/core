import React from 'react';
import styles from './event.css';
import Context from '../container/provider'
import Radium from 'radium'

const event = (props) =>{

    let startY = 90;
    let height = 44;
    
    if(props.view === "month"){
        startY = 0;
        height = 32;
    }else{
        if(props.data.start){
            const start = parseInt(props.data.start.split(":")[0]);
            const end = parseInt(props.data.end.split(":")[0]);
            const yOffset = props.view == 'day' ? 108 : 18
            startY = yOffset + (start * 25);
            // for errors in recording the event times
            if(end > start){
                height = (end - start) * 25;
            }
            
        }
    }
    

    let description = null;
    if (props.description){
        description = (<div>
                        <p>{props.description}</p>
                    </div>);
        }
  

    const startX = props.offset ? props.offset: 0;

    return(
        <Context.Consumer>
            {context=>(
                <a className={[styles.event, 'hvr-grow'].join(' ')}
                style={{
                    zIndex: props.index,
                    
                    left: props.view === "month" ? "0px" :`${40 + startX}px`,
                    top: `${startY}px`,
                    width: props.view === "day" 
                            ? "250px" : props.view === "week" ?
                             `${props.width - 40}px` : `100%` ,
                    
                }} 
                href={"/planner/event-detail/" + props.data.id}>
                <div style={{
                    height: `${height}px`,
                    backgroundColor:context.primary,
                    ':hover': {
                        color: context.primary,
                        backgroundColor: 'white',
                        border: `1px solid ${context.primary}`,
                        height: 'fit-content',
                        transform: 'scale(1.125)',
                        
                    }
                    }} className={styles.eventBox}>
                    <div>
                        <span> {props.data.title}</span>
                    </div>
                    {description}
                    
                </div>
            </a>
            )}
        </Context.Consumer>
    );
}

export default Radium(event);