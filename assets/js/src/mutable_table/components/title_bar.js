import React from 'react';

const titleBar = (props) =>{
    return(<thead>
            <tr className="bg-primary text-white">
                {props.headings.map((heading, i)=>(
                    <th key={i}>{heading}</th>
                ))}
                <th></th>
            </tr>        
        </thead>)
};

export default titleBar;