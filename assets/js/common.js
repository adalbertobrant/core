import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import SelectThree from './src/select_3';
import QuickEntry from './src/quick_entry';


const select = document.querySelectorAll('.bentsch-select')

select.forEach(field => {
    ReactDOM.render(<SelectThree 
        model={field.dataset.model}
        app={field.dataset.app}
        name={field.name}/>, field.parentElement)
})