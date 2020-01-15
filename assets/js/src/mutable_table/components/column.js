import React from 'react';

const column = (props) => {
    if(props.field.mutable){
        if(props.field.widget){
            return(<td style={{verticalAlign: 'middle'}}>
                {props.field.widgetCreator(props.root, props.rowID)}
            </td>)
        }else{
            return(
                <td style={{verticalAlign: 'middle'}}>
                    <input 
                    type="number" 
                    className="form-control form-control-sm"
                    value={props.data}
                    onChange={props.inputHandler}
                    name={props.columnID}/>
                </td>
                );
        }
        
    }else{
        return(
            <td style={{verticalAlign: 'middle'}}>
                {props.data}
            </td>
        )
    }
    
}

export default column;