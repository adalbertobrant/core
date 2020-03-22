import React from 'react';
import axios from 'axios'
import DeleteButton from '../../../src/components/delete_button';
const shiftLine = (props) =>{
    const [shift, setShift] = React.useState(props.data.shift)
    React.useEffect(() =>{
        console.log(shift)
        if(shift && toString(shift).indexOf('-') > 0){
            return
        }
        axios({
            method: 'GET',
            url: '/employees/api/shift/' + props.data.shift
        }).then(res =>{
            setShift(props.data.shift + ' - ' +res.data.name)
        })
    }, [props.data])
    return(
        <tr>
            <td>{shift}</td>
            <td>{props.data.startTime}</td>
            <td>{props.data.endTime}</td>
            <td><input 
                    className="form-control"
                    type="checkbox"
                    checked={props.data.monday} />
            </td>
            <td><input 
                    className="form-control"
                    type="checkbox"
                    checked={props.data.tuesday} />
            </td>
            <td><input 
                    className="form-control"
                    type="checkbox"
                    checked={props.data.wednesday} />
            </td>
            <td><input 
                className="form-control"
                type="checkbox"
                checked={props.data.thursday} />
            </td>
            <td><input 
                className="form-control"
                type="checkbox"
                checked={props.data.friday} />
            </td>
            <td><input 
                className="form-control"
                type="checkbox"
                checked={props.data.saturday} />
            </td>
            <td><input 
                className="form-control"
                type="checkbox"
                checked={props.data.sunday} />
            </td>
            <td><DeleteButton 
                    handler={props.deleteHandler}
                    index={props.index}/></td>
        </tr>
    )
};

export default shiftLine;