import React from 'react';
/* Props 
fieldOrder an array of field names
 */

const titleBar = (props) =>{
    
    return(
        
        <thead>

            <tr 
                className="bg-primary text-white"
                >
                
                {window.screen.width > 575 ? 
                    props.fieldOrder.map((fieldName, i)=>(
                        <th colSpan={i == 0 ? 2:1}  key={i}
                            style={{
                                padding: "5px",
                                borderRight: "1px solid white",
                                width: `${props.fields[i].width}%`
                            }}>
                            {fieldName}
                        </th>
                )) : 
                        <th colSpan={2} style={{width: '80%'}}>Description</th>
                }
                {props.hasLineTotal ?
                <th style={{
                    padding: "10px",
                    width: `20%`
                }}>
                    {/** if line total then the sum of widths must be 70% */}
                    SubTotal
                </th>
                : null
            }
                
            </tr>
        </thead>
    )
}

export default titleBar;