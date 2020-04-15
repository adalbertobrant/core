import React, {Component} from 'react';
import {setDataPayload} from '../utils';
import axios from '../auth';
import EmojiBox from './emoji'
import Note from './note'
/**
 * Props 
 * token - csrfmiddlewaretoken string
 * target - string representation of the model that will accept the note. 
 *             the string must be registered in the targets dictionary in  the 
 *              server
 * targetID - pk of the specific object receiving the notes
 */

class NotesWidget extends Component{
    state = {
        author: null,
        note: "",
        notesList: [],
        showEmoji: false
    }

    constructor(props) {
        super(props);
        this.fileInput = React.createRef();
      }

    inputHandler = (evt) =>{
        this.setState({note: evt.target.value});
    }
    componentWillMount(){
        axios.get('/base/api/current-user').then(res =>{
            this.setState({author: res.data.pk})
        })
    }
    
    attachmentToggler =() =>{
        this.fileInput.current.click()
    }

    attachmentHandler =(evt) =>{
        const file = evt.target.files[0];
        const extension = file.name.split('.')[1];

        if(file.size > 5000000){
            alert('Cannot Upload files larger than 5MB');
            return;
        }else if(!['jpg', 'jpeg', 
                    'gif', 'png', 'pdf', 'pptx',
                    'doc', 'txt', 'docx', 'ppt',
                    'xlsx', 'xlx', 'mp3', 'mp4', 'mp4a', 'csv'].includes(extension)){
            alert('Unsupported file upload format.');
            return;
        }
        const data = setDataPayload({
            'csrfmiddlewaretoken': this.props.token,
            'target': this.props.target,
            'target_id': this.props.targetID,
            'attachment': file,
            ...this.state
        })
        axios({
            'method': 'POST',
            'url': '/base/create-note',
            'data': data
        }).then(()=>{
            let newNotes = [...this.state.notesList];
            newNotes.push({
                note: this.state.note, 
                author: this.state.author,
                attachment: file.name,
                timestamp: `${new Date().getHours()}: ${new Date().getMinutes()}`
            })
            this.setState({
                note: "",
                notesList: newNotes
            });
        });
          
    }

    emojiHandler = () =>{
        this.setState(prevState =>({showEmoji: !prevState.showEmoji}))
    }
    insertEmoji = (code) =>{
        this.setState(prevState => ({
            showEmoji: false,
            note: prevState.note + code
        }))
    }

    submitHandler = () =>{
        
        axios({
            'method': 'POST',
            'url': '/base/create-note',
            'data': setDataPayload({
                'csrfmiddlewaretoken': this.props.token,
                'target': this.props.target,
                'target_id': this.props.targetID,
                ...this.state
            })
        }).then(()=>{
            let newNotes = [...this.state.notesList];
            newNotes.push({
                note: this.state.note, 
                author: this.state.author,
                attachment: "",
                timestamp: `${new Date().getHours()}: ${new Date().getMinutes()}`
            })
            this.setState({
                note: "",
                notesList: newNotes
            });
        });
          
    }

    componentDidMount(){
        if(this.props.dataURL){
            axios({
                method: 'get',
                'url': this.props.dataURL,
            }).then((res) =>{
                this.setState({notesList: res.data})
            })
            //get the list of notes for a given document

        }
    }

    render(){
        const containerStyle ={
            margin: "5px",
            padding: "10px",
            borderRadius: "5px",
            color: 'white'
        };
        const notesListStyle = {
            maxHeight: '400px',
            overflowY: 'auto'
        }

        return(<div style={containerStyle}>
            <div className="notes-list" 
                style={notesListStyle}>
                <ul className="list-group">
                    {this.state.notesList.map((note) =>(
                        <Note {...note} />
                    ))}
                </ul>
            </div>
            <div className="form-group">
              <textarea 
                className="form-control notes-input" 
                id="note-widget" rows="3"
                onChange={this.inputHandler}
                value={this.state.note}></textarea>
            </div>
            <div style={{position: 'relative'}}>
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end'
            }} className='btn-group'>
                <button onClick={this.emojiHandler}
                    type="button" 
                    className="btn btn-primary">
                    <i class="fas fa-smile    "></i> </button>
                <button onClick={this.attachmentToggler}
                    type="button" 
                    className="btn btn-primary">
                    <i class="fas fa-paperclip    "></i> </button>
                <button onClick={this.submitHandler}
                    type="button" 
                    className="btn btn-primary">
                    <i className="fas fa-paper-plane    "></i> </button>
                
            </div>
            <input 
                type="file" 
                style={{display: 'none'}}
                ref={this.fileInput}
                
                onChange={this.attachmentHandler} />
            <EmojiBox show={this.state.showEmoji} insertHandler={this.insertEmoji}/>
            </div>
        </div>)
    }
}



export default NotesWidget;