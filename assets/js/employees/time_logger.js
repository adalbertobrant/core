import React from 'react';
import styles from './styles.css';
import axios from '../src/auth'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"

const Keypad = (props) =>{
    const [pin, setPin] = React.useState("")
    React.useEffect(() =>{
        document.addEventListener('keydown', evt =>{
            if(evt.keyCode == 13){
                if(pin.length == 0){
                    alert('Please enter a pin to continue')
                    return
                }
                props.enterHandler(pin)
                setPin('')
            }
        })
    }, [])


    return(
        <div className={styles.keypad}>
            <input className='form-control' 
                type="number"
                value={pin}
                autoFocus
                onChange={evt =>{
                    setPin(evt.target.value)
                }}/>
            <div className={styles.keypadContainer}>
                <div>
                    <button type='button'
                        onClick={() =>setPin(pin + '1')}>1</button>    
                    <button type='button'
                        onClick={() =>setPin(pin + '2')}>2</button>    
                    <button type='button'
                        onClick={() =>setPin(pin + '3')}>3</button>    
                </div>
                <div>
                    <button type='button'
                        onClick={() =>setPin(pin + '4')}>4</button>    
                    <button type='button'
                        onClick={() =>setPin(pin + '5')}>5</button>    
                    <button type='button'
                        onClick={() =>setPin(pin + '6')}>6</button>    
                </div>
                <div>
                    <button type='button'
                        onClick={() =>setPin(pin + '7')}>7</button>    
                    <button type='button'
                        onClick={() =>setPin(pin + '8')}>8</button>    
                    <button type='button'
                        onClick={() =>setPin(pin + '9')}>9</button>    
                </div>
                <div>
                      
                    <button type='button'
                        onClick={() =>{
                            if(pin.length == 0){
                                return
                            }
                            setPin(pin.slice(0, pin.length -1))}
                            }><i className="fas fa-angle-left" aria-hidden="true"></i></button>
                    <button type='button'
                        onClick={() =>setPin(pin + '0')}>0</button>    
                    <button onClick={() =>{
                        if(pin.length == 0){
                            alert('Please enter a pin to continue')
                            return
                        }
                        props.enterHandler(pin)
                        setPin('')
                    }}><i className="fas fa-angle-up" aria-hidden="true"></i></button>  
                </div>

            </div>

        </div>
    )
}

const EmployeeCard = (props) => {
    const [name, setName] = React.useState("")
    const [login, setLogin] = React.useState(false)
    const [loginTime, setLoginTime] = React.useState(false)
    React.useEffect(() =>{
        axios({
            method: 'GET',
            url: '/employees/api/employee/' + props.pk 
        }).then(res =>{
            setName(`${res.data.first_name} ${res.data.last_name}`)
            setLogin(res.data.logged_in)
            setLoginTime(res.data.login_time)
        })
    }, [props.id])
    
    return(
        <div className={styles.employeeCard} style={{
            borderLeftColor: login ? "green" : "crimson"
        }}>
            <div>
            <i className="fas fa-user fa-3x   "></i> 
            </div>
            <div className={styles.employeeCardContents} >
                <h4>{name}</h4>

    {login ? <div className={styles.timeIn}>LOGGED IN AT {loginTime}</div> : null}
            </div>
        </div>
    )
}

class TimeLogger extends React.Component{
    state = {
        currentShifts: [],
        employees: [],
        currentEmployee: "",
        time: new Date(),
        tick: true
    }

    logInOut =(pin) =>{
        axios({
            method: 'POST',
            url: '/employees/log-in-out/',
            data: {
                'employee': this.state.currentEmployee,
                'pin': pin
            }
        }).then(res =>{
            console.log(res.data)
            if(res.data.status == 'ok'){
                alert(`Logged ${res.data.value} successfully at ${this.state.time.getHours()}:${this.state.time.getMinutes()}`)
            }else{
                alert('Incorrect credentials')
            }

        }).catch(err =>{
            console.log('Failed to login employee')
        })
    }

    componentDidMount(){
        axios({
            method: 'GET',
            url: '/employees/api/employee'
        }).then(res =>{
            this.setState({employees: res.data})
        })

        axios({
            method: 'GET',
            url: '/employees/get-current-shift/'
        }).then(res =>{
            this.setState({currentShifts: res.data})
        })

        setInterval(() =>{this.setState((prevState) =>({
            time: new Date(),
            tick: !prevState.tick
        }))}, 1000)

        
    }

    render(){
        return(
            <div className='container'>
                <div className='row'>
                    <div className='col-md-6 col-sm-12'>
        <h2>Current Shifts: {this.state.currentShifts.length == 0 ? 'None' : this.state.currentShifts.map(shift => shift.name).join(', ')}</h2>
                        {this.state.currentShifts.map(shift =>{
                            return(shift.employees.map(id => <EmployeeCard pk={id}/>))
                        })}
                    </div>
                    <div className='col-md-6 col-sm-12'>
                        <div style={{textAlign: 'center'}}>
                        <h1>{new Date().toDateString()}</h1>
                <h1>{this.state.time.getHours()}<span style={{visibility: this.state.tick ? 'visible' : 'hidden'}}>:</span>{("0" + this.state.time.getMinutes()).slice(-2)}</h1>
                        </div>
                        <label htmlFor="">Name:</label>
                        <select className='form-control' 
                            name="" 
                            id=""
                            value={this.state.currentEmployee}
                            onChange={evt => this.setState({currentEmployee: evt.target.value})}>
                            <option value="" >----------</option>
                            {this.state.employees.map(emp =>{
                                return(<option value={emp.employee_number}>{emp.first_name} {emp.last_name}</option>)
                            })}
                        </select>
                        <label htmlFor="">Pin:</label>
                        <Keypad enterHandler={this.logInOut}/>
                    </div>

                </div>
            </div>
        )
    }
}

export default TimeLogger