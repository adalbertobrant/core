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
            {taskList.map((task, index) =>{
                return(
                    <Task data={task} 
                           key={task.id} 
                           tasks={taskList}
                           employeeList={employees} 
                           remove={() =>{
                        let newTaskList = [...taskList]
                        newTaskList.splice(index, 1)
                        setTaskList(newTaskList)
                    }} />
                )
            })}
            <div>
                <div className="card" style={{display: addTask ? 'block' : 'none'}}>
                    <div className="card-body">
                        <TaskForm 
                            new
                            currentID={null}
                            employeeList={employees}
                            appendTasks={setTaskList}
                            tasks={taskList}
                            toggleEdit={() => setAddTask(false)}
                            initial={{
                                due: '',
                                start: '',
                                assigned: null,
                                dependency: null,
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
    const [start, setStart] = useState(props.data.start)
    const [due, setDue] = useState(props.data.due)
    const [completed, setCompleted] = useState(props.data.completed)
    const [description, setDescription] = useState(props.data.description)
    const [assigned, setAssigned] = useState(props.data.assigned)
    const [dependency, setDependency] = useState(props.data.dependency)
    const [editing, setEditing] = useState(false)
    const [employeeString, setEmployeeString] = useState('')
    useEffect(() =>{
        if(assigned == null){
            return
        } 
        props.employeeList.forEach(emp =>{
            if(emp.employee_number == assigned){
                setEmployeeString(`${emp.first_name} ${emp.last_name}`)
            }
        })
    }, [assigned])

    return(
        <div className={`card ${editing ? "active-card" : ""}`}>
            <div className="card-body">
                <button
                    style={{
                        position: 'absolute',
                        right: '12px',
                        top: '12px',
                        zIndex: '1'
                    }} 
                    onClick={evt =>{
                        
                        if(confirm('Are you sure you want to delete this task?')){
                            let pk 
                            axios.delete('/services/api/work-order-task/' + props.data.id)
                                .then(() =>{props.remove()})
                                .catch(() =>alert('error deleting task'))
                                
                        }
                        evt.stopPropagation()
                        
                        }} className='btn btn-sm btn-danger'> <i className="fas fa-times    "></i> </button>
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
                            
                            <h4><i className="fas fa-hashtag "></i> {props.data.id}</h4>
                            <div className="row">
                                <div className="col-sm-12 col-md-6">
                                <p className="card-text">{description}</p>
                            <p><i className="fas fa-user    "></i> <sub>{employeeString}</sub></p>
                            {dependency == null || dependency == "" ? null
                                : <p>Dependant on: <i className="fas fa-hashtag "></i>{dependency}</p>
                            }
                            
                                </div>
                                <div className="col-sm-12 col-md-6">
                                <p> <i className="fas fa-calendar-alt    "></i> Start: {start}</p>
                            <p><i className="fas fa-flag-checkered    "></i> Due: {due}</p>
                                </div>
                            </div>
                            
                            
                        </div>
                        <div style={{display: editing ? 'block' : 'none'}}>
                            <TaskForm 
                                currentID={props.data.id}
                                toggleEdit={setEditing} 
                                initial={props.data}
                                employeeList={props.employeeList}
                                tasks={props.tasks}
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
    const [start, setStart] = useState(props.initial.start)
    const initialDescription = props.new ? "" : props.initial.description
    const [description, setDescription] = useState(initialDescription)
    const [assigned, setAssigned] = useState(props.initial.assigned)
    const [dependency, setDependency] = useState(props.initial.dependency)
    return(
        <React.Fragment>
            <label htmlFor="">Start:</label>
            <input type="date"  className='form-control' 
            style={{maxWidth: '200px'}}
                value={start}
                onChange={evt => setStart(evt.target.value)} 
                />
            <label htmlFor="">Due:</label>
            <input type="date"  className='form-control' 
            style={{maxWidth: '200px'}}
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
            <select name="employee"
                     id="" 
                     className='form-control' 
                     value={assigned}
                    style={{maxWidth: '200px'}}
                    onChange={(evt) => setAssigned(evt.target.value)}>
                <option value="">----------</option>
                {props.employeeList.map(emp => <option  
                                                    value={emp.employee_number}
                                                    key={emp.employee_number}>{emp.first_name + ' ' + emp.last_name}</option>)}
            </select>
            <label htmlFor="">Dependency:</label>
            <select name="dependency"
                     id="" 
                     className='form-control' 
                     value={dependency}
                    style={{maxWidth: '200px'}}
                    onChange={(evt) => setDependency(evt.target.value)}>
                <option value="">----------</option>
                {props.tasks.filter(task => task.id != props.currentID).map(task => <option  
                                                    value={task.id}
                                                    key={task.id}>{`Task #${task.id}: ${task.description}`}</option>)}
            </select>
            <br/>
            <button className='btn btn-primary'
                type='button'
                onClick={() =>{
                        if( description == ""){
                            return
                        }else if(due == "" || start == ""){
                            alert('A valid date must be set')
                            return
                        }
                        props.toggleEdit(false)
                        if(props.new){
                            axios({
                                method: 'POST',
                                url: '/services/api/work-order-task/',
                                data: {
                                    "assigned": parseInt(assigned),
                                    "description": description,
                                    "due": due,
                                    "start": start,
                                    "dependency": dependency,
                                    "work_order": props.initial.work_order,
                                    "completed": false
                                }
                            }).then(res =>{
                                let newTasks = [...props.tasks]
                                newTasks.push({
                                    "assigned": assigned,
                                    "description": description,
                                    "due": due,
                                    "id": res.data.id,
                                    "start": start,
                                    "dependency": dependency,
                                })
                                props.appendTasks(newTasks)
                                setDescription("")
                            })
                                .catch(err => console.log(err.response))
                        }else{
                            axios({
                                method: 'PATCH',
                                url: '/services/api/work-order-task/'+ props.initial.id + '/',
                                data: {
                                    "assigned": parseInt(assigned),
                                    "description": description,
                                    "due": due,
                                    "start": start,
                                    "dependency": dependency,
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