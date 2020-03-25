import React, {Component} from 'react'
import styles from './styles.css'
import axios from 'axios'
import { DndProvider } from 'react-dnd'
import KanbanColumn from './column'
import Backend from 'react-dnd-html5-backend'


// to drag and drop cards, each column must have an event when a card is dropped over it
// it must change the state of 
class KanbanBoard extends Component{
    state = {
        'new': [],
        'qualified': [],
        'quotation': [],
        'won': [],
        'lost': [],
        'currency': ''
    }

    componentDidMount(){
        axios.defaults.xsrfCookieName = "csrftoken";
        axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
        this.updateBoard()
        axios.get('/accounting/api/settings/1')
            .then(res =>{
                axios.get('/accounting/api/currency/' + res.data.active_currency)
                    .then(res =>{
                        this.setState({currency: res.data.symbol})
                    })
            })
    }

    syncLeads =(id, status) =>{
        console.log(id)
        console.log(status)
        axios({
            method:'PATCH',
            url:'/invoicing/api/lead/' + id + '/',
            data: {'status': status}
        })
            .then(res =>{
                this.updateBoard()
                console.log('leads updated successfully')
                console.log(res)
            })
            .catch(err => {
                console.log('error updating status')
                console.log(err)
            })
    }
    updateBoard= () =>{
        axios.get('/invoicing/api/lead').then(res =>{
            this.setState({ 
                new: res.data.filter(lead => lead.status =='new'),
                qualified: res.data.filter(lead => lead.status =='qualified'),
                quotation: res.data.filter(lead => lead.status =='quotation'),
                won: res.data.filter(lead => lead.status =='won'),
                lost: res.data.filter(lead => lead.status =='lost')
            })
        })
    }

    render(){
        return(<DndProvider backend={Backend}>
            <div className={styles.kanbanBoard}>
                <KanbanColumn 
                    name='New'
                    currency={this.state.currency}
                    accent='black'
                    statusValue='new'
                    data={this.state.new}
                    handleCardDrop={this.syncLeads}
                    />
                <KanbanColumn 
                    currency={this.state.currency}
                    name='Qualified'
                    accent='silver'
                    statusValue='qualified'
                    data={this.state.qualified}
                    handleCardDrop={this.syncLeads}
                    />
                <KanbanColumn 
                    name='Quote'
                    currency={this.state.currency}
                    statusValue='quotation'
                    accent='steelblue'
                    data={this.state.quotation}
                    handleCardDrop={this.syncLeads}
                    />
                <KanbanColumn 
                    name='Won'
                    currency={this.state.currency}
                    accent='#7FFF00'
                    statusValue='won'
                    data={this.state.won}
                    handleCardDrop={this.syncLeads}
                    />
                <KanbanColumn 
                    name='Lost'
                    currency={this.state.currency}
                    accent='crimson'
                    statusValue='lost'
                    data={this.state.lost}
                    handleCardDrop={this.syncLeads}
                    />
            
        </div>
        </DndProvider>)
    }
}

export default KanbanBoard