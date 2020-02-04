import React from 'react';
import ReactDOM from 'react-dom';
import CalendarApp from './calendar/container/Root';


export default function initCalendar(config){
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
