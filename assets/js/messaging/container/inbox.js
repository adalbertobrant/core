import React, {Component} from 'react';
import styles from './inbox.css';
import FolderList from '../components/email/folder';
import MessageDetail from '../components/email/message_detail';
import axios from 'axios';
import {Aux} from '../../src/common';
import ReactModal from 'react-modal';
import Compose from '../components/email/compose'

const FolderCard = (props) =>{
    return (
        <li style={{
            padding: '5px 3px'
        }}
            className={["list-group-item", 
            props.focused 
                ? 'selected-folder'
                : ''].join(' ')}
            onClick={props.handler}>
            <i className="fas fa-folder "></i>  {props.name}
        </li>
    )
}
class InboxView extends Component{
    state = {
        current: null,
        profile: null,
        folder: null,
        folderList: [],
        currentMessage: '',
        modalOpen: false
    }

    syncFolders = () =>{
        this.setState({currentMessage: 'Syncing Email...'})
        axios({
            'url': '/messaging/api/sync-folders/' + this.state.profile,
            'method': 'GET'
        }).then(() =>{
            alert('Emails Synchronized successfully.')
        })
    }

    componentDidMount(){
        const id = document.getElementById('id_profile').value
        const url = `/messaging/api/email-profile/${id}/`
        
        axios({
            method: 'GET',
            url: url
        }).then(res =>{
            this.setState({
                folderList: res.data.folders,
                profile: id
        })
        })
    }

    setCurrent =(id) =>{
        this.setState({
            current: id,
        })
        axios.defaults.xsrfCookieName = "csrftoken";
        axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        axios.patch('/messaging/api/email/' + id + '/', {'read': true});
    }

    render(){
        return(
            <Aux>
                <div className={styles.inboxContainer} >
                    <div className={styles.inboxMenu}>
                        <ul style={{
                            maxHeight: '300px',
                            overflowY: 'auto'
                        }}
                            className="list-group">
                            <li style={{
                                padding: '5px 3px'
                            }}
                                onClick={()=>this.setState({modalOpen: true})}
                                className="list-group-item"><i className="fas fa-edit    "></i> Compose</li>
                            {this.state.folderList.map((folder)=>(
                                <FolderCard 
                                    handler={()=>this.setState(
                                        {folder: folder.id}
                                        )}
                                    folderID={folder.id}
                                    name={folder.name}
                                    focused={folder.id === this.state.folder} />
                            ))}
                            <li style={{
                                padding: '5px 3px'
                            }}
                                onClick={this.syncFolders}
                                className="list-group-item"><i className="fas fa-sync"></i> Sync manually</li>
                        </ul>
                    </div>
                    <div className={styles.inboxList}>
                        <FolderList 
                            setCurrent={this.setCurrent}
                            current={this.state.current}
                            folderID={this.state.folder}/>
                    </div>
                    <div className={styles.inboxMessageDetail}>
                        <MessageDetail messageID={this.state.current} draft={true}/>
                    </div>
                </div>
                <ReactModal 
                  isOpen={this.state.modalOpen}>
                    {/* <Compose /> */}
                    <iframe src='/messaging/create-message' style={{width:'100%', height:'100%'}} />
                </ReactModal>
            </Aux>
        )
    }
}

export default InboxView;