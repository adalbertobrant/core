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
        textAlign: 'center'
    }
    
    return(
        
        <tr>
            <td style={cellStyle}>
                <DeleteButton 
                    index={props.index}
                    handler={props.deleteHandler}/>
            </td>
            {window.screen.width > 575 && props.concise ?
                props.fieldOrder.map((fieldName, i) =>(
                    <td style={cellStyle} key={i}>{props.data[fieldName]}</td>
                ))
                : <td>{props.concise(props.data)}</td>
            }
            {props.hasLineTotal ?
            <td style={cellStyle}>
                {props.data.lineTotal}
            </td>
            : null}
            
        </tr>
    )
}

export default dataRow;