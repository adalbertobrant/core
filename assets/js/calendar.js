import React from 'react';
import ReactDOM from 'react-dom';
import CalendarApp from './calendar/container/Root';
import TreeSelectWidget from '../js/src/tree_select_widget';
import ParticipantSelectWidget from '../js/calendar/components/ParticipantSelect/select';
import TimelineWidget from './src/timeline/container/root';
import axios from 'axios';

const calendar = document.getElementById('calendar-root');
const timeline = document.getElementById('agenda-timeline');
const participantSelect = document.getElementById('participant-select');
if(calendar){
    ReactDOM.render(<CalendarApp
                        monthHook={(month, year, component)=>{
                            axios({
                                method: 'GET',
                                url: `/planner/api/calendar/month/${year}/${month}`
                            }).then(res =>{
                                component.setState({
                                    events: res.data.map(evt =>({
                                        id: evt.id,
                                        date: new Date(evt.date),
                                        title: evt.title
                                    }))
                                })
                            })
                        }}
                        weekHook={(month, year, component)=>{
                            axios({
                                method: 'GET',
                                url: `/planner/api/calendar/week/${year}/${month}/${day}`
                            }).then(res =>{
                                component.setState({
                                    events: res.data.map(evt =>({
                                        id: evt.id,
                                        date: new Date(evt.date),
                                        title: evt.title
                                    }))
                                })
                            })
                        }}
                        dayHook={(month, year, component)=>{
                            axios({
                                method: 'GET',
                                url: `/planner/api/calendar/day/${year}/${month}/${day}`
                            }).then(res =>{
                                component.setState({
                                    events: res.data.map(evt =>({
                                        id: evt.id,
                                        date: new Date(evt.date),
                                        title: evt.title
                                    }))
                                })
                            })
                        }} />, calendar);

}else if(participantSelect){
    ReactDOM.render(<ParticipantSelectWidget />, participantSelect);
}else if(timeline){
    const url = window.location.href;
    const splitURL = url.split('/');
    const tail = splitURL[splitURL.length -1]
    const dataURL = '/planner/api/agenda/' + tail;
    const resProcessor =(res) =>{
        return res.data.map((i) =>({
            timestamp: i.date + ' ' + i.start_time,
            title: i.label,
            id: i.id
        }))
    }
    ReactDOM.render(<TimelineWidget 
                        dataURL={dataURL}
                        resProcessor={resProcessor} />, timeline)
}

