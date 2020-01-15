import React, {Component} from "react";
import Radium from 'radium';
class OptionsWidget extends Component{
    
    openPopup = () =>{
        let modal = document.getElementById('id-my-modal');
        let popup = document.getElementById('popup-frame');

        popup.setAttribute('src', this.props.newLink);
        modal.style.display = 'block';
        modal.addEventListener()
    }



    
    render(){
        let rendered;
        if(this.props.choices.length > 0){
            rendered = this.props.choices.map((item, i) => {
                //always display id and display field
                return(<div style={{
                    color: "black",
                    padding: "0.5rem 1rem",
                    ":hover": {
                        'color':'white',
                        'backgroundColor':'#23374d'
                    }
                }} key={i} onClick={() => this.props.onSelectValue(i)}>
                        {item.split('-')[1]}
                    </div>)
            });
        }else{
            rendered = (<div style={{color: "grey"}}>No results</div>)
        }

        const linkStyle = {
            padding: "5px 2px",
            color: "#23374d",
            borderBottom: '1px solid #aaa',
            borderTop: '1px solid #aaa',
            ":hover": {
                'color':'white',
                'backgroundColor':'#23374d',
            }
        }
        return(
            <div className='custom-scroll' key='container' style={{
                border: "1px solid grey",
                display: this.props.hidden ? "none" : "block",
                position:"absolute",
                width: "inherit",
                zIndex: 1,
                backgroundColor: "#fff",
            }}>

            <div key='exit' style={{
                padding: "5px 2px",
                color: "#23374d",
            }} >
                <button onClick={this.props.closeDropdown}
                        type="button"
                        className="btn btn-sm">
                            <i className="fas fa-times"></i>
                </button>
            </div>
            {this.props.newLink ? 
                <div key='link' onClick={this.openPopup} style={linkStyle}>Create new</div>
                : null
            }
                <div style={{
                    maxHeight: "300px",
                    overflowY: "auto",}}>
                {rendered}
                    
                </div>
            </div>
        )
    }
}


export default Radium(OptionsWidget);