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
                {/* For Delete buttons */}
                <th style={{
                    width: `10%`
                }}></th>
                {window.screen.width > 575 ? 
                    props.fieldOrder.map((fieldName, i)=>(
                        <th key={i}
                            style={{
                                padding: "5px",
                                borderRight: "1px solid white",
                                width: `${props.fields[i].width}%`
                            }}>
                            {fieldName}
                        </th>
                )) : 
                        <th style={{width: '70%'}}>Description</th>
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