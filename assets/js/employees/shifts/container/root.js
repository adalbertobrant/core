import React, {Component} from 'react';
import ShiftLine from '../components/shift_line';
import ShiftEntryLine from '../components/shift_entry';
import axios from 'axios'

class ShiftSchedule extends Component{
    state = {
        lines: []
    }

    componentDidMount(){
        const URL = window.location.href;
        const  decomposed = URL.split('/');
        const tail = decomposed[decomposed.length - 2];
        
        if(decomposed.indexOf('create') > -1){
            return
        }
        axios({
            method: 'GET',
            url: '/employees/api/shift-schedule/' + tail
        }).then(res =>{
            if(res.data.length == 0){
                return
            }
            const data = res.data.shiftscheduleline_set.map(line =>{
                return({
                    startTime: line.start_time,
                    endTime: line.end_time,
                    shift: line.shift,
                    monday: line.monday,
                    tuesday: line.tuesday,
                    wednesday: line.wednesday,
                    thursday: line.thursday,
                    friday: line.friday,
                    saturday: line.saturday,
                    sunday: line.sunday
                })
            })
            this.setState({lines: data}, this.updateForm)
        })
    }

    insertHandler = (data) =>{
        let newLines = [...this.state.lines];
        newLines.push(data);
        this.setState({lines: newLines}, this.updateForm);
    }
    deleteHandler = (index) => {
        let newLines = [...this.state.lines];
        newLines.splice(index, 1);
        this.setState({lines: newLines}, this.updateForm)

    }

    updateForm = () =>{
        document.getElementById('id_shift_lines').value = encodeURIComponent(
            JSON.stringify(
                this.state.lines));
    }
    render(){
        return(
            <table className="table">
                <thead>
                    <tr className="bg-primary text-white">
                        <th>Shift</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Mon</th>
                        <th>Tue</th>
                        <th>Wed</th>
                        <th>Thr</th>
                        <th>Fri</th>
                        <th>Sat</th>
                        <th>Sun</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.lines.map((line, i) =>(
                        <ShiftLine 
                            data={line} 
                            key={i}
                            index={i}
                            deleteHandler={this.deleteHandler} />
                    )
                    )}
                </tbody>
                <ShiftEntryLine 
                    insertHandler={this.insertHandler}/>
            </table>
        )
    }
}

export default ShiftSchedule;