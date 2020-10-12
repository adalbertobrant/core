import React, {Component} from 'react';
import styles from '../container/app.css'
import axios from '../../src/auth'

class LogoutPage extends Component{
    endSessionHandler = () =>{
        axios.post('/invoicing/pos/end-session/', {
            id: this.props.sessionID,
            timestamp: new Date().toISOString()
        }).then((res) =>{
            if(res.data.status == 'OK'){
                window.location.href = '/invoicing/'
                return
            }
            console.log('Server status not OK')
            
        }).catch(error =>{
            bentschAlert('Failed to end session because of an error')
            console.error(error)
        })
        
        
    }

    render(){
        return(
            <div className={styles.modalCard} >
                <h1>Logout Page</h1>
                <hr className="my-2"/>
                <p>Are you sure you want to end the current session?</p>
                <div className="btn-group" >
                    <button className="btn btn-lg primary" 
                        onClick={this.endSessionHandler}>End Session</button>
                    <button className="btn btn-lg btn-danger"
                        onClick={this.props.cancelAction}>Cancel</button>
                </div>
            </div>
        )
    }
}

export default LogoutPage;