import React from 'react';

const leave = (props) =>{   
    console.log(props.data) 
    let startY = props.yOffset;
    let height = 27;
    
    if(props.data.start_date){
            const start = parseInt(props.data.start_date);
            const end = parseInt(props.data.end_date);
            
            startY = props.yOffset + (start == 1 ? 0 : (start * 27));

            // for errors in recording the event times
            if(end > start){
                height = (end - start) * 27;
            }else if(start > end && props.data.start_month == props.month){
                height = (31 - start) * 27
            }else if(start > end && props.data.start_month != props.month){
                height = end * 27
                startY = props.yOffset
            }
    }
    
    let style = {
        margin: '2px',
        padding: '5px',
        width: "100%",
        color: 'white',
        backgroundColor: '#07f',
        zIndex: 1,
        position: "absolute",
        left: `${40 + props.offset}px`,
        border: '1px solid white',
        top: `${startY}px`,
        height: `${height}px`, 
        width: "150px",
        borderRadius: '5px'
    };
    return(
        <a 
            href={"/employees/leave-detail/" + props.data.id}>
            <div style={style}>
                <div>
                    <i className={"fas fa-user"}></i>
                    <span style={{margin: "0px 5px"}}>{props.data.employee}</span>
                </div>
            </div>
        </a>
    );
}

export default leave;