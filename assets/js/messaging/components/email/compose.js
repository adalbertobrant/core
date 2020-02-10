import React from 'react'
import EmailEditor from '../../container/rich_text'

class Compose extends React.Component{
    render(){
        return(
            <div>
                <form action="">
                    <label htmlFor="to">To</label>
                    <input type="text" className="form-control"/>
                    <label htmlFor="to">Cc</label>
                    <input type="text" className="form-control"/>
                    <label htmlFor="to">Bcc</label>
                    <input type="text" className="form-control"/>
                    <label htmlFor="to">Subject</label>
                    <input type="text" className="form-control"/>
                    <div className="attachments"></div>
                    <br/>
                    <EmailEditor />
                    <input type="submit" value="" className='btn btn-primary' value='Send'/>
                </form>
            </div>
        )
    }
}

export default Compose