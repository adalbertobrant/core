import React from 'react'
import EmailEditor from '../../container/rich_text'
import styles from './compose.css'
import EmailWidget from './multi_email_widget'
import FilePickerUI from '../../../src/components/custom_file_picker';
import {convertToRaw} from 'draft-js';
import axios from '../../../src/auth'

class Compose extends React.Component{
    state = {
        to: [],
        cc: [],
        bcc: [],
        subject: '',
        msg: "",
        attachments: null
    }

    constructor(props){
        super(props);
        axios.defaults.xsrfCookieName = "csrftoken";
        axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    }

    sendMail =() =>{
        let data = new FormData()
        data.append('attachment', this.state.attachments)
        data.append('fields', JSON.stringify({
            'to': this.state.to,
            'cc': this.state.cc,
            'bcc': this.state.bcc,
            'msg': this.state.msg,
            'subject': this.state.subject,
        }))

        axios({
            url: '/messaging/api/compose',
            method: 'POST',
            headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                  },
            data: data})
            .then(res => alert('message sent succesfully'))
            .catch(err => console.log('error sending email ' + err))
    }

    saveDraft =() =>{

    }

    render(){
        return(
            <div className={styles.composeContainer} style={{display: this.props.open ? 'block': 'none'}}>
                <h4>New Message</h4>
                    <label htmlFor="to">To</label>
                    <EmailWidget emails={this.state.to} 
                        ID='to'
                        setEmails={emails => {
                        this.setState({to: emails})
                        }} />
                    <label htmlFor="to">Cc</label>
                    <EmailWidget emails={this.state.cc} 
                        ID='cc'
                        setEmails={emails => {
                        this.setState({cc: emails})
                        }} />
                    <label htmlFor="to">Bcc</label>
                    <EmailWidget emails={this.state.bcc} 
                        ID='bcc'
                        setEmails={emails => {
                        this.setState({bcc: emails})
                        }} />
                    <label htmlFor="to">Subject</label>
                    <input type="text" className="form-control"/>
                    <div className="attachments">
                        <label htmlFor="">Attachments</label>
                        <FilePickerUI 
                            fieldID="attachment" 
                            fileHandler={file =>{
                                this.setState({attachments: file})
                            }} />
                    </div>
                    <br/>
                    <EmailEditor textHandler={(state) =>{
                    const contentState = state.editorState.getCurrentContent();
                    const data = convertToRaw(contentState);
                    this.setState({msg: data})
                }}/>
                    <div className="btn-group" style={{marginTop: '12px'}}>
                    <button type="button" className='btn btn-primary'
                        onClick={this.sendMail} >Send</button>
                    <button type="button" className='btn'
                        onClick={this.saveDraft} >Save Draft</button>
                    <button type="button" className='btn'
                        onClick={this.props.close}
                        style={{
                            textDecoration: 'underline',
                            color: 'crimson',
                            backgroundColor: 'white'
                        }}
                        >Cancel</button>
                    </div>
            </div>
        )
    }
}

export default Compose