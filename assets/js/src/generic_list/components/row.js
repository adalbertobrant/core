import React from 'react';
import {DeleteButton} from '../../common';
/*Properties
    index for datarow object
    deleteHandler for delete button
    fieldOrder for datarow
    fields for datarow
*/

const dataRow = (props) =>{
    const cellStyle = {
        border: '1px solid #ccc',
        borderCollapse: 'collapse',
    }
    
    return(
        
        <tr>
            <td style={{display: window.screen.width > 575 ? 'inherit': 'none'}}>
                <DeleteButton 
                    index={props.index}
                    handler={props.deleteHandler}/>
            </td>
            {window.screen.width > 575 && props.concise ?
                props.fieldOrder.map((fieldName, i) =>{
                    
                    const value = props.data[fieldName]
                    
                    const renderedValue = typeof(value) != 'number' && value.indexOf('-') > -1 ? value.split('-')[1] : value
                    return (<td style={{
                                        ...cellStyle,
                                        textAlign: props.fields[i].type == 'number' ? 'right': 'left'
                                    }} key={i}>{typeof(renderedValue) == "number" ? renderedValue.toFixed(2) : renderedValue}</td>
                )})
                : <td colSpan={2}>
                    <DeleteButton 
                        index={props.index}
                        handler={props.deleteHandler}/> {props.concise(props.data)}</td>
            }
            {props.hasLineTotal ?
            <td style={{...cellStyle, textAlign: 'right'}}>
                {props.data.lineTotal}
            </td>
            : null}
            
        </tr>
    )
}

export default dataRow;