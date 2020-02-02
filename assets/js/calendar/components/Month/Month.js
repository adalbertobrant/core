import React, {Component} from 'react';
import Week from '../Week/Week';
import {Aux} from '../../../src/common';
import axios from 'axios';
import styles from './month.css';
import {showCalendar} from '../../calendar'

class Month extends Component{
    state = {
        weeks: [],
        period: "",
        events: []
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.params != this.props.params){
            this.updateCalendar()
        }
    }

    updateCalendar(){
        const params = this.props.params
        const data = showCalendar(params.month, params.year)
        this.setState({
            weeks: data,
            period: 'Period',
        })
        this.props.hook(params.month, params.year, this)
    }
    
    componentDidMount(){
        this.updateCalendar()
    }

    render(){
        
        let contents = null;
        if(this.state.weeks.length === 0){
            contents = <h3>Loading Data...</h3>
        }else{
            contents = (<table>
                <thead>
                    <tr>
                        <th className={styles.header}>Sunday</th>
                        <th className={styles.header}>Monday</th>
                        <th className={styles.header}>Tuesday</th>
                        <th className={styles.header}>Wednesday</th>
                        <th className={styles.header}>Thursday</th>
                        <th className={styles.header}>Friday</th>
                        <th className={styles.header}>Saturday</th>
                    </tr>
                </thead>
                <tbody>
                {this.state.weeks.map((week, i)=>(
                    <Week 
                        width={this.props.width}
                        height={this.props.height}
                        key={i} 
                        days={week}
                        events={this.state.events}
                        setDate={this.props.setDate}
                        showDay={this.props.showDay}/>
                ))}
                </tbody>
            </table>);
        }
        return(
            <Aux>
            {contents}
            </Aux>
        );
    }
    
    
}

export default Month;