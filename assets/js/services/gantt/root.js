import React from 'react'
import axios from 'axios'
import Month from './components/month'
import TaskList from './components/task_list'
import TaskBarChart from './components/tasks'
import styles from './style.css'
// Identify the start and end dates of the project. Then create a gannt view that spans that distance
//
class GanttChart extends React.Component{
    

    state = {
        today: new Date(),
        tasks: [],
        start: new Date(),
        end: new Date(),
        duration: 50

    }

    colors = [
        '#007bff',
        'steelblue',
        'crimson',
        'darkred',
        'orangered',
        'fuchsia',
        'indigo',
        'lime',
        'lightseagreen',
        'deepskyblue',
        'lightslategray',
        'chocolate'
    ]

    getData= () =>{
        axios({
            method:'get',
            url: '/services/api/work-order/' + this.props.orderID
        }).then(res =>{
            let end = this.state.end
            let start = this.state.start
            res.data.workordertask_set.forEach((val, indx) =>{
                const newStart = new Date(val.start)
                //check for invalid date 
                if(newStart.getDate() == NaN){
                    return
                }else if(newStart < start){
                    start = newStart
                }

                const newEnd = new Date(val.due)
                //check for invalid date 
                if(newEnd.getDate() == NaN){
                    return
                }else if(newEnd > end){
                    end = newEnd
                }

            })
            //in days
            let duration 
            if(start == end){
                duration = 1
            }else{
                duration = (end - start) / (24 * 60 * 60 * 1000)
            }
            this.setState({
                start: start,
                end: end,
                duration: duration,
                tasks: res.data.workordertask_set
            })
        })
    }

    componentDidMount(){
        this.getData()
        setInterval(this.getData(), 10000)
    }

    render(){
        if(window.screen.width < 600){
            return( <h1>Your screen is too narrow to display the gannt chart correctly</h1> )
        }

        let months
        const startMonth = this.state.start.getMonth()
        const endMonth = this.state.end.getMonth()

        if(endMonth < startMonth){
            return( <h3>Cannot correctly render chart</h3> )
        }else if(endMonth == startMonth){
            months = <Month
                        month={startMonth}
                        tasks={this.state.tasks}
                        today={this.state.today}
                        year={this.state.start.getFullYear()}
                        />
        }else{
            const monthList = new Array(endMonth + 1 - startMonth).fill(0).map((val, i) =>(
                                                i + startMonth
                                            ))
            
            months  = monthList.map(month =>{
                let start = null
                let end = null
                
                if(month == this.state.start.getMonth()){
                    start = this.state.start.getDate()
                }

                if(month == this.state.end.getMonth()){
                    end = this.state.end.getDate()
                }
                return(<Month month={month}
                              today={this.state.today}
                              tasks={this.state.tasks}
                              year={this.state.start.getFullYear()}
                              start={start}
                              end={end}
                            />)
            })
        }
 
        return(
            
        <div className={styles.chart} style={{width: '100%', overflowX: 'auto'}}>
                <TaskList 
                    tasks={this.state.tasks} 
                    colors={this.colors}
                    
                    />
                <div className={styles.months} >
                    <TaskBarChart 
                        today={this.state.today}
                        start={this.state.start}
                        tasks={this.state.tasks} 
                        colors={this.colors}
                        verticalOffset={26 + 46} //do a better job
                        horizontalOffset={startMonth == endMonth ? 
                            (this.state.start.getDate() -1) * 24 : 0}
                        wingspan={this.state.duration * 24}/>
                    {months}
                </div>

        </div>)
    }
}

export default GanttChart