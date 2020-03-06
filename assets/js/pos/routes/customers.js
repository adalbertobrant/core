import React, {Component} from 'react';
import styles from '../container/app.css'
import SearchableWidget from '../../src/components/searchable_widget'
import axios from 'axios'
import {setDataPayload} from '../../src/utils'

class CustomersPage extends Component{
    state = {
        selected: '',
        name: '',
        phone: '',
        email: '',
        address: ''
    }

    createCustomer = () => {
        if(this.state.name.indexOf(" ") == -1){
            alert('A full name, separated by a space is required to create customers')
            return
        }
        axios.defaults.xsrfCookieName = "csrftoken";
        axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        axios({url: '/invoicing/create-customer/', 
                method: 'POST',
                data:setDataPayload({
                    customer_type: 'individual',
                    name: this.state.name,
                    address: this.state.address,
                    phone_1: this.state.phone,
                    email: this.state.email
                })}).then(resp => {
            axios.get('/base/models/get-latest/customer')
                .then(res =>{
                    this.props.selectHandler(res.data.data[0] + ' - ' + res.data.data[1])
                })
        })
    } 

    render(){
        return(
            <div className={styles.modalCard}>
                <h1>Customers</h1>
                <p>Select or create Customers</p>
                <hr className="my-2"/>
                <div style={{
                    marginBottom: '5px',
                    border:'2px solid #23374d'
                }}>
                    <SearchableWidget 
                        dataURL='/invoicing/api/customer/'
                        displayField="name"
                        idField="id"
                        onSelect={val =>{this.setState({selected: val})}}
                        onClear={()=>(this.setState({selected:''}))}/>
                </div>
                <button className="btn btn-block btn-lg primary"
                    disabled={this.state.selected == ''}
                    onClick={() =>{
                        this.props.selectHandler(this.state.selected)
                    }}>Select Customer</button>
                <hr className="my-2"/>
                <label htmlFor="name">Name:</label>
                    <input className='form-control' type="text" id='name'
                        value={this.state.name}
                        onChange={evt=>{this.setState({
                            name: evt.target.value})}}/>
                <br/>
                <label htmlFor="address">Address:</label>
                    <textarea name="address" 
                        rows="4" 
                        className='form-control'
                        value={this.state.address}
                        onChange={evt=>{this.setState({
                            address: evt.target.value})}}></textarea>
                 <br/>
                <label htmlFor="phone">Phone:</label>
                    <input type="text" id='phone'className='form-control'
                        value={this.state.phone}
                        onChange={evt=>{this.setState({
                            phone: evt.target.value})}}/>
                <br/>
                <label htmlFor="email">Email:</label>
                    <input type="email" id='email'className='form-control'
                        value={this.state.email}
                        onChange={evt=>{this.setState({
                            email: evt.target.value})}}/>
                

                <button className="btn btn-block btn-lg primary"
                    disabled={this.state.name==''}
                    onClick={this.createCustomer}
                    >Create Customer</button>
            </div>
        )
    }
}

export default CustomersPage;