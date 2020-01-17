import React, {Component} from 'react';
import MultipleSelectWidget from '../src/multiple_select/containers/root';
import TextBoxListWidget from '../src/text_box_list';
import $ from 'jquery';
import axios from 'axios';

class ProcedureViews extends Component{
    render(){
        const splitURL = window.location.href.split('/');
        const tail = splitURL[splitURL.length - 1];
        let populatedURL  = null;
        if(tail !== 'create-procedure'){
            const pk =  splitURL[splitURL.length - 1];
            populatedURL = '/services/api/procedure/'+ pk;
        }

        return(
            <div>
                <TextBoxListWidget 
                    title="Procedure Steps"
                    fieldName="tasks"
                    populatedURL={populatedURL}
                    resProcessor={(res) => (res.data.steps.map((step) => (step.description)))} />    
            </div>
        )
    }
}

const InventorySelectWidgets = (props) => {
    const splitURL = window.location.href.split('/');
    const tail = splitURL[splitURL.length - 1];
    let populatedURL  = null;
    if(tail !== 'create-procedure'){
        const pk =  splitURL[splitURL.length - 1];
        populatedURL = '/services/api/procedure/'+ pk;
    }
    
    return(
        <div>
            <br/>

            <h4>Equipment</h4>
            <hr/>
            <div >
                <MultipleSelectWidget 
                title="Select Equipment"
                dataURL = '/inventory/api/equipment/'
                model='equipment'
                app='inventory'
                inputField = 'equipment'
                populatedURL = {populatedURL}
                resProcessor = {(res) =>{
                    console.log(res.data);
                    return res.data.required_equipment.map((c) => (
                        c.id + '-' + c.name
                        ))}}
                />
            </div>
            <br/>
            <h4>Consumables</h4>
            <hr/>

            <div >
                <MultipleSelectWidget 
                title="Select Consumables"
                dataURL = '/inventory/api/consumable/'
                model='consumable'
                app='inventory'
                inputField = 'consumables'
                populatedURL = {populatedURL}
                resProcessor = {(res) =>{
                    return res.data.required_consumables.map((c) => (
                        c.id + '-' + c.name    
                    ))}}
                />
            </div>
            
        </div>
    )
}

export {ProcedureViews, InventorySelectWidgets}; 