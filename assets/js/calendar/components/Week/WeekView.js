import React, {Component} from 'react';
import Day from '../Day/Day';
import {Aux} from '../../../src/common';
import styles from './week.css';
import {showWeekCalendar} from '../../calendar'
import moment from 'moment'
import COntext from '../../container/provider'
import Context from '../../container/provider';

class WeekView extends Component{
    state = {
        week: "",
        days: [],
        events: []
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.params != this.props.params){
            this.updateCalendar()
        }
    }

    updateCalendar(){
        const params = this.props.params 
        const currWeek = showWeekCalendar(params.day, params.month, params.year)
        const m = moment(new Date(params.year, params.month, params.day))
        
        this.setState({
            days: currWeek,
            week: m.week()
        })
        
        this.props.hook(params.day, params.month, params.year, this)
    }

    componentDidMount(){
        this.updateCalendar()
    }

    render(){
        if(this.state.days.lenght === 0){
            return(<h3>Loading data...</h3>)
        }
        const weekHeaderHeight = 42;
        const titleHeight = document.getElementById('title').offsetHeight;
        const windowHeight = document.documentElement.offsetHeight;
        const height = windowHeight - weekHeaderHeight - titleHeight;
    
        return(
            <Context.Consumer>
                {context =>(
                    <Aux>
                    <h3  style={{backgroundColor: context.primary}} className={styles.weekHeader}>Week: {this.state.week}</h3>
                   <div style={{
                    height: height + "px",
                    overflowY: "scroll",
                    width: '80vw',
                    margin: '0px'
                    }}>
                        <table style={{width:'100%'}}>
                            <thead>
                                <tr>
                                <th style={{backgroundColor: context.primary}} className={styles.headStyle}>Sunday</th>
    
                                    <th  style={{backgroundColor: context.primary}} className={styles.headStyle}>Monday</th>
                                    <th  style={{backgroundColor: context.primary}} className={styles.headStyle}>Tuesday</th>
                                    <th  style={{backgroundColor: context.primary}}className={styles.headStyle}>Wednesday</th>
                                    <th  style={{backgroundColor: context.primary}}className={styles.headStyle}>Thursday</th>
                                    <th  style={{backgroundColor: context.primary}}className={styles.headStyle}>Friday</th>
                                    <th  style={{backgroundColor: context.primary}}className={styles.headStyle}>Saturday</th>
                                </tr>
                            </thead>
                            <tbody >
                                <tr>
                                    {this.state.days.map((day, i) =>(
                                        <td key={i}
                                            className={styles.cellStyle}
                                            >
                                            <div >
                                                <Day data={{...day, current: true}}
                                                    setDate={this.props.setDate}
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
                )}
            </Context.Consumer>
        )
    }
}
    

export default WeekView;