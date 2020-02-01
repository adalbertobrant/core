import React, {Component} from 'react';
import Day from '../Day/Day';
import {Aux} from '../../../src/common';
import styles from './week.css';
import {showWeekCalendar} from '../../calendar'
import moment from 'moment'

class WeekView extends Component{
    state = {
        week: "",
        days: [],
        events: []
    }

    componentDidMount(){
        this.props.linkUpdater();
        const params = this.props.match.params 
        const currWeek = showWeekCalendar(params.day, params.month - 1, params.year)
        const m = moment(new Date(params.year, params.month, params.day))
        
        this.setState({
            days: currWeek,
            week: m.week()
        })
        
        this.props.hook(params.day, params.month, params.year, this)
    }

    render(){
        if(this.state.days.lenght === 0){
            return(<h3>Loading data...</h3>)
        }
        const weekHeaderHeight = 42;
        const titleHeight = document.getElementById('title').offsetHeight;
        const windowHeight = document.documentElement.offsetHeight;
        const height = windowHeight - weekHeaderHeight - titleHeight;
        console.log(height)
    
        return(
            <Aux>
                <h3 className={styles.weekHeader}>Week: {this.state.week}</h3>
               <div style={{
                height: height + "px",
                overflowY: "scroll",
                width: '80vw',
                margin: '0px'
                }}>
                    <table style={{width:'100%'}}>
                        <thead>
                            <tr>
                            <th className={styles.headStyle}>Sunday</th>

                                <th className={styles.headStyle}>Monday</th>
                                <th className={styles.headStyle}>Tuesday</th>
                                <th className={styles.headStyle}>Wednesday</th>
                                <th className={styles.headStyle}>Thursday</th>
                                <th className={styles.headStyle}>Friday</th>
                                <th className={styles.headStyle}>Saturday</th>
                            </tr>
                        </thead>
                        <tbody >
                            <tr>
                                {this.state.days.map((day, i) =>(
                                    <td key={i}
                                        className={styles.cellStyle}
                                        >
                                        <div >
                                            <Day data={day} 
                                                 view={'week'} 
                                                 width={this.props.width} height={height}
                                                 events={this.state.events}
                                                 showDay={this.props.showDay}
                                                 />
                                        </div>
                                    </td>
                                ))}
                            </tr>    
                        </tbody>
                    </table>
               </div> 
               
            </Aux>
        )
    }
}
    

export default WeekView;