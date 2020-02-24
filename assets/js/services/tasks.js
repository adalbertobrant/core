import React, {useState, useEffect} from 'react'

import axios from 'axios'

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    
const taskList =(props) =>{
    const [taskList, setTaskList] = useState([])
    const [employees, setEmployees] = useState([])
    const [addTask, setAddTask] = useState(false)
    
    useEffect(() =>{
        axios({
            method: 'GET',
            url: '/services/api/work-order/' + props.orderID
        }).then(res =>{
            setTaskList(res.data.workordertask_set)
        })

        axios({
            method: 'GET',
            url: '/employees/api/employee/'
        }).then(res =>{
            setEmployees(res.data)
        })
    }
    ,[])
    return(
        <div>
            {taskList.map(task =>{
                return(
                    <Task data={task} key={task.id} employeeList={employees} />
                )
            })}
            <div>
                <div className="card" style={{display: addTask ? 'block' : 'none'}}>
                    <div className="card-body">
                        <TaskForm 
                            new
                            employeeList={employees}
                            appendTasks={setTaskList}
                            tasks={taskList}
                            toggleEdit={() => setAddTask(false)}
                            initial={{
                                due: '',
                                assigned: null,
                                description: '',
                                work_order: props.orderID
                            }}/>
                    </div>
                </div>
                <br/>
                <button className="btn btn-primary"
                    type='button'
                    onClick={() => setAddTask(true)}>Add Task</button>
            </div>
        </div>
    )
}


const Task =(props) =>{
    const [due, setDue] = useState(props.data.due)
    const [completed, setCompleted] = useState(props.data.completed)
    const [description, setDescription] = useState(props.data.description)
    const [assigned, setAssigned] = useState(props.data.assigned)
    const [editing, setEditing] = useState(false)
    const [employeeString, setEmployeeString] = useState('')
    useEffect(() =>{
        if(props.data.assigned == null){
            return
        } 
        axios({
            method: 'GET',
            url: '/employees/api/employee/' + assigned
        }).then(res => setEmployeeString(res.data.first_name + ' ' + res.data.last_name))
    }, [assigned])

    return(
        <div className={`card ${editing ? "active-card" : ""}`}>
            <div className="card-body">
                <div className="row">
                    <div className="col-2">
                        <input type="checkbox" checked={completed}
                            onChange={evt =>{
                                setCompleted(evt.target.checked)
                                axios({
                                    method: 'PATCH',
                                    url: '/services/api/work-order-task/'+ props.data.id + '/',
                                    data: {
                                        "completed": evt.target.checked
                                    }
                                }).then(res => console.log(res))
                                    .catch(err => console.log(err.response))
                            }}/>
                    </div>
                    <div className="col-10">
                        <div style={{display: editing ? 'none' : 'block'}} onClick={() => setEditing(true)}>
                            <p> <i className="fas fa-calendar    "></i>{due}</p>
                            <p className="card-text">{description}</p>
                            <p><i className="fas fa-user    "></i> <sub>{employeeString}</sub></p>
                        </div>
                        <div style={{display: editing ? 'block' : 'none'}}>
                            <TaskForm 
                                toggleEdit={setEditing} 
                                initial={props.data}
                                employeeList={props.employeeList}
                                updateCard={data=>{
                                    setAssigned(data.assigned)
                                    setDue(data.due)
                                    setDescription(data.description)
                                }}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


const TaskForm =(props) => {
    const [due, setDue] = useState(props.initial.due)
    const [description, setDescription] = useState(props.initial.description)
    const [assigned, setAssigned] = useState(props.initial.assigned)
    return(
        <React.Fragment>
            <label htmlFor="">Due:</label>
            <input type="date"  className='form-control' 
                value={due}
                onChange={evt => setDue(evt.target.value)} 
                />
            <label htmlFor="">Description:</label>
            <textarea value={description}
                onChange={evt => setDescription(evt.target.value)} 
                name="description" 
                id="description" 
                cols="30" 
                rows="3" 
                className='form-control'>
                
            </textarea>
            <label htmlFor="">Assigned:</label>
            <select name="employee" id="" className='form-control' value={assigned}
                onChange={(evt) => setAssigned(evt.target.value)}>
                <option value="">----------</option>
                {props.employeeList.map(emp => <option  
                                                    value={emp.employee_number}
                                                    key={emp.employee_number}>{emp.first_name + ' ' + emp.last_name}</option>)}
            </select>
            <br/>
            <button className='btn btn-primary'
                type='button'
                onClick={() =>{
                        props.toggleEdit(false)
                        if(props.new){
                            axios({
                                method: 'POST',
                                url: '/services/api/work-order-task/',
                                data: {
                                    "assigned": parseInt(assigned),
                                    "description": description,
                                    "due": due,
                                    "work_order": props.initial.work_order,
                                    "completed": false
                                }
                            }).then(res =>{
                                let newTasks = [...props.tasks]
                                newTasks.push({
                                    "assigned": assigned,
                                    "description": description,
                                    "due": due,
                                })
                                props.appendTasks(newTasks)
                            })
                                .catch(err => console.log(err.response))
                        }else{
                            axios({
                                method: 'PATCH',
                                url: '/services/api/work-order-task/'+ props.initial.id + '/',
                                data: {
                                    "assigned": parseInt(assigned),
                                    "description": description,
                                    "due": due
                                }
                            }).then(res => props.updateCard({
                                                assigned: assigned, 
                                                due: due, 
                                                description: description
                                            }))
                                .catch(err => console.log(err.response))
                        }
                        
                    }
                }>Save</button>
        </React.Fragment>
    )
}


export default taskList