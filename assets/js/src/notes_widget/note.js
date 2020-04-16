import React, {Component} from 'react'
import axios from '../auth';

class Note extends Component{
    state = {
        authorString: ''
    }

    componentDidMount(){
        axios({
            'method': 'GET',
            'url': '/base/api/users/'+ this.props.author
        }).then((res)=>{
            this.setState({authorString: res.data.username})
        })
        if(this.props.attachment != ''){
        const filePath= this.props.attachment.split('/')
        const fileName = filePath[filePath.length - 1]
        let icon 
        switch(fileName.split('.')[1]){
            case 'pdf':
                icon='pdf'
                break
            case 'pptx':
            case 'ppt':
                icon='powerpoint'
                break
            case 'txt':
                icon='code'
                break
            case 'doc':
            case 'docx':
                icon='word'
                break
            case 'csv':
            case 'xlx':
            case 'xlsx':
                icon='excel'
                break
            case 'mp3':
            case 'mp4a':
                icon='audio'
                break

            case 'mp4':
                icon='video'
                break
            default:
                icon='alt'
                break
        }
        this.setState({
            fileName: fileName,
            isImg: ['png', 'jpg', 'gif', 'jpeg'].includes(fileName.split('.')[1]),
            icon: icon
        })
        }
    }

    render(){
        console.log(this.props)
        return(
            <li className='list-group-item' 
                style={{
                    'color': 'black',
                    marginBottom: '0.5rem',
                    display: 'flex',
                    flexDirection: 'row'
                }}>
                {this.props.attachment != "" ? 
                    <div>
                    <a href={this.props.attachment}
                        style={{textDecoration: "none" }} download target="_blank">       
                        {this.state.isImg 
                            ? <img src={this.props.attachment} alt={this.state.fileName} style={{height: '150px', width: 'auto'}}/>
                            :  <i className={`far fa-file-${this.state.icon} fa-7x`} style={{color: "#23374d"}} />
                        }
                        
                        <p style={{textAlign: 'center'}}>{this.state.fileName}</p>
                    </a>
                </div>
                : null}
                <div style={{padding: '8px'}}>
                    <strong><i className="fas fa-user    "></i>  {this.state.authorString}</strong>
                    <br/>
                    <p>{this.props.note}</p>
                    <p style={{
                        textAlign: 'right',
                        color: '#ccc'
                    }}>{this.props.timestamp}</p>
                </div>
            </li>
        )
    }
}


export default Note