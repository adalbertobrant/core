import React from 'react';
import ReactDOM from 'react-dom';
import CalendarApp from './calendar/container/Root';
import ParticipantSelectWidget from '../js/calendar/components/ParticipantSelect/select';
import TimelineWidget from './src/timeline/container/root';
import axios from 'axios';

const calendar = document.getElementById('calendar-root');
const timeline = document.getElementById('agenda-timeline');
const participantSelect = document.getElementById('participant-select');



function initCalendar(config){
    ReactDOM.render(<CalendarApp
        eventLink={config.eventLink}
        showMonth={config.showMonth}
        showWeek={config.showWeek}
        showDay={config.showDay}
        primaryColor={config.primaryColor}
        accentColor={config.accentColor}
        monthHook={config.monthHook}
        weekHook={config.weekHook}
        offsetTop={config.offsetTop}
        dayHook={config.dayHook} />, document.getElementById(config.root));
}


if(calendar){
    const config = {
        primaryColor: '#23374d',
        accentColor: '#007bff',
        root: 'calendar-root',
        eventLink: "/planner/event-create/",
        showMonth: true,
        showWeek: true,
        showDay: true,
        offsetTop: document.getElementById('title').offsetHeight,
        monthHook: function(month, year, component){
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
        },
        weekHook: function(day, month, year, component){
            axios({
                method: 'GET',
                url: `/planner/api/calendar/week/${year}/${month}/${day}`
            }).then(res =>{
                component.setState({
                    events: res.data.map(evt =>({
                        id: evt.id,
                        date: new Date(evt.date),
                        title: evt.title,
                        start:evt.start,
                        end: evt.end
                    }))
                })
            })
        },
        dayHook: function(day, month, year, component){
            axios({
                method: 'GET',
                url: `/planner/api/calendar/day/${year}/${month}/${day}`
            }).then(res =>{
                component.setState({
                    events: res.data.map(evt =>({
                        id: evt.id,
                        date: new Date(evt.date),
                        title: evt.title,
                        start:evt.start,
                        end: evt.end
                    }))
                })
            })
        }
    };

    initCalendar(config)
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

