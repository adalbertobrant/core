import React, {Component} from 'react';
import axios from 'axios'
import Radium from 'radium';
import styles from './mini_calendar.css';
import {showCalendar} from '../calendar'



class  MiniCalendar extends Component{
    state = {
        weeks: []
    }

    
    componentDidUpdate(prevProps, prevState){
        if(this.props.year !== prevProps.year || prevProps.month !== this.props.month){
            console.log('updated')
            const data = showCalendar(this.props.month, this.props.year)
            const dateString = new Date(this.props.year, this.props.month).toDateString()
            const dateArray = dateString.split(' ')
            const period = dateArray[1] + ' ' + dateArray[3]
            this.setState({
                weeks: data,
                period: period
                })
            // axios({
            //     method: 'GET',
            //     url: `/planner/api/calendar/month/${this.props.year}/${this.props.month}`
            // }).then(res =>{
            //     this.setState({
            //         weeks: res.data.weeks,
            //         period: res.data.period_string
            //     })
            // })
        }
    }
    
    render(){
        return(
            <div>
            <h4 className={styles.title}>{this.state.period}</h4>
            <table className={styles.miniTable}>
                <tbody>
                    <tr>
                        <th>Mo</th>
                        <th>Tu</th>
                        <th>We</th>
                        <th>Th</th>
                        <th>Fr</th>
                        <th>Sa</th>
                        <th>Su</th>
                    </tr>
                    {this.state.weeks.length === 0
                        ? <tr>
                            <td colSpan={7}>Loading data...</td>
                        </tr>
                        : null
                    }
                    {this.state.weeks.map((week, i) =>(
                        <tr key={i}>

                            {week.map((day, j) =>(
                                <td key={j} style={{padding:'3px'}}>
                                    <a key={i.toString() + '-' + j.toString()}
                                        href={`/calendar/day/${day.date.getFullYear()}/${day.date.getMonth()+1}/${day.day}`}
                                        style={{
                                            textDecoration: "none",
                                        color: (i==0 && day.day > 7) || (i > 3 && day.day < 10)
                                        ? '#23374d' 
                                        : 'white' ,
                                        width:" 100%",
                                        display: 'inline-block',
                                        ":hover": {
                                            color: '#23374d',
                                            backgroundColor: 'white'
                                        }
                                    }}>{day.day}</a></td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        );
    }
}



export default Radium(MiniCalendar);