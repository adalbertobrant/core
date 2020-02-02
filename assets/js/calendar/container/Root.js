import React, {Component} from 'react';
import Month from '../components/Month/Month';
import WeekView from '../components/Week/WeekView';
import DayView from '../components/Day/DayView';
import Sidebar from '../components/sidebar';
import {daysInMs} from '../calendar'

/**
 * This application supports a variety of customizations
 * The hook system
 * ----------------
 * each view has certain hooks that allows you to feed events to the calendar
 * the hooks are the monthHook, weekHook and dayHook respectively.
 * The month hook takes 3 arguments, a year a month and the component.
 * It expects the hook to connect to an api and fetch events that are valid for 
 * that month and to set the state of the component's event state so as to 
 * update the window.
 * The week and day hooks work similarly. The primary difference is that the 
 * latter two take a day parameter in addition to the ones stated for the month 
 * hook.
 * 
 * Custom Params
 * -------------
 * In addition the interface can be tweaked using flags.
 * The first flag, showMonth allows us to hide the sidebar buttons for the 
 * month view.
 * similarly a showWeek and showDay flag are implemented.
 * The showDay flag however disables the links in the week and day views so 
 * that the user cannot open them. 
 * The eventLink flag takes a string and allows the creation of new events on a 
 * different page.
 * if flag is not set the create event button is removed from the interface.
 */



export default class CalendarApp extends Component{
    state = {
        year: 2018,
        month: 1,
        day: 1,
        view: 'month',
        windowWidth: 135,
        windowHeight: 95
    }

    nextHandler = () =>{
        const current = new Date(this.state.year, this.state.month, this.state.day)
        let next
        
        if(this.state.view == 'month'){
            if(this.state.month < 11){
                next = new Date(this.state.year, this.state.month + 1, 1)
            }else{
                next = new Date(this.state.year + 1, 0, 1)
            }

        }else if(this.state.view == 'week'){
            current.setDate(current.getDate() + 7)
            next = current
            console.log(next)
        }else{
            current.setDate(current.getDate() + 1)
            next = current
        }
        console.log(next)

        this.setState({
            year: next.getFullYear(),
            month: next.getMonth(),
            day: next.getDate()
        })
    }

    prevHandler = () =>{
        const current = new Date(this.state.year, this.state.month, this.state.day)
        let next
        
        if(this.state.view == 'month'){
            if(this.state.month != 0){
                next = new Date(this.state.year, this.state.month - 1, 1)
            }else{
                next = new Date(this.state.year - 1, 11, 1)
            }

        }else if(this.state.view == 'week'){
            current.setDate(current.getDate() - 7)
            next = current
            console.log(next)
        }else{
            current.setDate(current.getDate() - 1)
            next = current
        }
        this.setState({
            year: next.getFullYear(),
            month: next.getMonth(),
            day: next.getDate()
        })
    }

    componentDidMount(){
        // calculate the cell width
        // get the screen width
        // subtract the sidebar width
        // divide by 7
        // subtract the padding and border widths 
        this.setState({windowWidth: Math.floor(
            ((window.screen.width -250) / 7) - 12)});
        this.setState({windowHeight: 58});
        const today = new Date()
        this.setState({
            day: today.getDate(),
            month: today.getMonth(),
            year: today.getFullYear()
        })

    }


    render(){
        let rendered;
        switch(this.state.view){
            case 'month':
                rendered = <Month width={this.state.windowWidth} 
                                height={this.state.windowHeight}
                                params={{
                                    month: this.state.month, 
                                    year: this.state.year}}
                                showDay={this.props.showDay}
                                hook={this.props.monthHook}
                                setDate={(params) =>{this.setState(params)}}
                                linkUpdater={this.setLinks}/>;
                break;
            case 'week':
                rendered = <WeekView width={this.state.windowWidth}    
                                params={{
                                day: this.state.day,
                                month: this.state.month, 
                                year: this.state.year}}
                                showDay={this.props.showDay}
                                setDate={(params) =>{this.setState(params)}}
                                hook={this.props.weekHook}
                                linkUpdater={this.setLinks}/>
                break;
            case 'day': 
                rendered = <DayView 
                params={{
                    day: this.state.day,
                    month: this.state.month, 
                    year: this.state.year}}
                linkUpdater={this.setLinks}
                hook={this.props.dayHook}/>
                break; 
            default:
                rendered=<p>Loading Calendar...</p>
                break
        }


        return(
                <div style={{display: 'flex',flexDirection: 'row'}}>
                    <Sidebar
                            setView={(view)=>{
                                this.setState({view: view})
                            }}
                            eventLink={this.props.eventLink}
                            showMonth={this.props.showMonth} 
                            showWeek={this.props.showWeek} 
                            showDay={this.props.showDay} 
                            calendarState={{...this.state}}
                            nextHandler={this.nextHandler}
                            prevHandler={this.prevHandler}/>
                    <div style={{
                        flex: 4}}>
                        {/*App */}
                        {rendered}
                    </div>
                </div>
        )
    }
    
}