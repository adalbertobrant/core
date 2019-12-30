import React, {Component} from 'react';
import axios from 'axios'
import styles from '../container/app.css'
class Void extends Component{
    state = {
        pwd: ""
    }

    checkPassword = () =>{
        axios.get('/base/api/config/1')
            .then(res =>{
                if(this.state.pwd != res.data.pos_supervisor_password){
                    alert('The supervisor password is incorrect.')
                }else{
                    this.props.voidAction()
                }
            })
    }


    render(){
        return(
            <div className={styles.modalCard}>
                <h1>Void Sale</h1>
                <hr className="my-2"/>
                <p>Please authenticate as a supervisor to void this sale</p>
                <input type="text" 
                       className="form-control"
                       value={this.state.pwd}
                       autoFocus
                       onChange={evt=>this.setState({pwd: evt.target.value})}/>
                <br/>
                <div className="btn-group ">
                    <button className="btn  btn-lg primary"
                        onClick={this.checkPassword}>Void</button>
                    <button className="btn btn-lg btn-danger"
                        onClick={this.props.cancelAction}>Cancel</button>
                </div>
            </div>
        )
    }
}

export default Void;