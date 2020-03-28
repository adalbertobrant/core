import React, {Component} from 'react';
import axios from './auth';
import $ from 'jquery';

const commonStyle = {
    width: "100%",
    padding: "3px",
    margin: "2px",
    listStyleType: "none"
}

const blurredStyle = {
    ...commonStyle,
    backgroundColor: "#eee",
    fontWeight: "2"
     
}

const focusedStyle = {
    ...commonStyle,
    backgroundColor: '#23374d',
    color: "white"
}

const actionStyle = {
        "float": "right",
        "minWidth": "100px",
        "margin": "2px",
        "zIndex": 1,
        "padding": "10px",
        "position": "absolute",
        "left": "-90px",
        "backgroundColor": "white" 
    }

export default class TreeSelectWidget extends Component{
    state = {
        selected: {
            label: "None",
            id: ""
        },
        data: [],
        rendered: []
    }

    componentDidMount(){
        axios({
            url: this.props.url,
            method: 'GET'
        }).then( res =>{
            let nodes = res.data.map(this.props.dataMapper);
            //makes sure child nodes are not rendered at root level
            nodes = nodes.map(node =>{
                let n
                let hasParent = false;
                for(n of nodes){
                    if(n.nodes.length > 0){
                        let c
                        for(c of n.nodes){
                            if(c.id == node.id){
                                hasParent=true
                            }
                        }
                    }
                }
                return {...node, hasParent: hasParent}
            })
            this.setState({data: nodes});
        });
        let field = document.getElementById('id_' + this.props.externalFormFieldName);
        if( field === null){
            $('<input>').attr({
                type: 'hidden',
                name: this.props.externalFormFieldName,
                id: 'id_' + this.props.externalFormFieldName,
                value: ''
            }).appendTo('form');
        }
    }

    selectHandler = (node) => {
        this.setState({selected: node}, () =>{
            this.updateForm();
        });
    }

    updateForm = () =>{
        $('#id_' + this.props.externalFormFieldName).val(this.state.selected.id);
    }
    render(){
        return(
            <div>{this.state.data.length == 0 ?
                <h4>This list has no elements.</h4>
            :null}
                <ul style={{listStyleType: "none"}}>
                {this.state.data.map((element, i) => {
                    if(element.hasParent){
                        return null;
                    }else if(element.nodes.length === 0){
                        
                        return <LeafNode
                                    focused={this.state.selected.id}
                                    isListView={this.props.isListView}
                                    updateUrlRoot={this.props.updateUrlRoot}
                                    detailUrlRoot={this.props.detailUrlRoot}
                                    node={element} 
                                    key={i}
                                    selectHandler={this.selectHandler}/>
                    }else{
                        return <BranchNode 
                                    focused={this.state.selected.id}
                                    isListView={this.props.isListView}
                                    updateUrlRoot={this.props.updateUrlRoot}
                                    detailUrlRoot={this.props.detailUrlRoot}
                                    node={element} 
                                    key={i}
                                    mapper={this.props.dataMapper}
                                    selectHandler={this.selectHandler}/>
                    }
                })}
                </ul>
            </div>
        );
    }
}

class BranchNode extends Component{
    state ={
        showChildren: false,
        showDropdown: false,
        highlight: false
    }


    componentDidUpdate(){
        if(this.props.focused === this.props.node.id & !this.state.highlight){
            this.setState({highlight:true})
        }
        if(this.props.focused !== this.props.node.id & this.state.highlight){
            this.setState({highlight: false});
        }
    }


    clickHandler = () =>{
        this.setState({showChildren: !this.state.showChildren});
        this.props.selectHandler(this.props.node);
    }
    toggleDropdown = () =>{
        this.setState((prevState) =>({
            showDropdown: !prevState.showDropdown
        }))
    }
    render(){
        let trasformedData = this.props.node.nodes.map(this.props.mapper);
        let actions = null;
        if(this.props.isListView){
            actions = (
                
                    <div style={{
                        "float": 'right',
                        "position": 'relative',
                        "display": "inline-block"
                    }}>
                <button 
                    onClick={this.toggleDropdown}
                    style={{
                        'border': '0px',
                        'backgroundColor': this.state.highlight ? '#23374d' : '#eee',
                        'color': this.state.highlight ? 'white' : 'black',
                        'minWidth': '20px'}}>
                    <i className="fas fa-ellipsis-h"></i>
                </button>
                <div style={{...actionStyle,
                    "display": this.state.showDropdown ? "block" : "none",                    
                }}>
                    <a href={this.props.detailUrlRoot + this.props.node.id.toString()} className='dropdown-item'> <i className="fas fa-file    "></i> Detail</a><br />
                    <a href={this.props.updateUrlRoot + this.props.node.id.toString()} className='dropdown-item'> <i className="fas fa-edit    "></i> Update</a>
                </div>
            </div>
            )
        }
        return(
            <li style={{listStyleType: "none"}}>
                <div 
                    style={this.state.highlight ? focusedStyle : blurredStyle}
                    onClick={this.clickHandler}>{this.props.node.label}
                
                <span style={{
                    float:'right',
                    margin: "3px"}}>
                        <i className={this.state.showChildren
                            ? "fas fa-angle-down"
                            : "fas fa-angle-left"}></i>
                </span>
                {actions}
                </div>
                <ul style={{
                    display: this.state.showChildren ? "block" : "none"
                }}>
                    {trasformedData.map((element, i) => {
                        if(element.nodes.length === 0){
                            return <LeafNode 
                                        focused={this.props.focused}
                                        isListView={this.props.isListView}
                                        updateUrlRoot={this.props.updateUrlRoot}
                                        detailUrlRoot={this.props.detailUrlRoot}
                                        node={element} 
                                        key={i}
                                        selectHandler={this.props.selectHandler}/>
                        }else{
                            return <BranchNode 
                                        focused={this.props.focused}
                                        isListView={this.props.isListView}
                                        updateUrlRoot={this.props.updateUrlRoot}
                                        detailUrlRoot={this.props.detailUrlRoot}
                                        node={element} 
                                        key={i}
                                        mapper={this.props.mapper}
                                        selectHandler={this.props.selectHandler}/>
                        }
                    })}
                </ul>
            </li>
        );
    }
}
    

class  LeafNode extends Component{
    state = {
        showDropdown: false,
        highlight: false
    }

    componentDidUpdate(){
        if(this.props.focused === this.props.node.id & !this.state.highlight){
            this.setState({highlight:true})
        }
        if(this.props.focused !== this.props.node.id & this.state.highlight){
            this.setState({highlight: false});
        }
    }


    toggleDropdown = () =>{
        this.setState((prevState) =>({
            showDropdown: !prevState.showDropdown
        }))
    }
    render(){
        let actions = null;
        if(this.props.isListView){
            actions = (
                <div style={{
                        "float": 'right',
                        "position": 'relative',
                        "display": "inline-block"}}>
                    <button 
                        onClick={this.toggleDropdown}
                        style={{
                            'border': '0px',
                            'backgroundColor': this.state.highlight ? '#23374d' : '#eee',
                            'color': this.state.highlight ? 'white' : 'black',
                            'minWidth': '20px'}}>
                        <i className="fas fa-ellipsis-h"></i>
                    </button>
                    <div style={{
                            ...actionStyle,
                            "display": this.state.showDropdown ? "block" : "none",
                         }}>
                        <a href={this.props.detailUrlRoot + this.props.node.id.toString()} className='dropdown-item'> <i className="fas fa-file    "></i> Detail</a><br />
                        <a href={this.props.updateUrlRoot + this.props.node.id.toString()} className='dropdown-item'> <i className="fas fa-edit    "></i>Update</a>
                    </div>
                </div>
        )
        }
        return(
            <li 
                style={this.state.highlight ? focusedStyle : blurredStyle}
                onClick={() => this.props.selectHandler(this.props.node)}>
                {this.props.node.label}
                {actions}
            </li>
        );
    }
}