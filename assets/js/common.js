import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import SelectThree from './src/select_3'


const select = document.querySelectorAll('.bentsch-select')
const Placeholder = () => (<div>FIELD</div>)

select.forEach(field => {
    ReactDOM.render(<SelectThree 
        model={field.dataset.model}
        app={field.dataset.app}
        name={field.name}/>, field.parentElement)
    
})