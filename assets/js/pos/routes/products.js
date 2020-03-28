import React from 'react'
import SearchableWidget from '../../src/components/searchable_widget'
import axios from '../../src/auth'

class PriceCheckPage extends React.Component{
    state = {
        selected: null,
        product: null
    }

    handleSelect =() =>{
        console.log('called')
        const pk = this.state.selected.split('-')[0]
        axios.get('/inventory/api/product/' + pk)
            .then(res=>this.setState({product: res.data}))
    }

    render(){
        return(
            <div>
                <h1>Price Check</h1>
                <hr className="my-2"/>
                <p>Check prices on products without affecting the current transaction.</p>
                <p>Search Name or Barcode:</p>
                <div style={{
                    marginBottom: '5px',
                    border:'1px solid #23374d'
                }}>
                    <SearchableWidget 
                            dataURL='/inventory/api/product/'
                            displayField="name"
                            idField="id"
                            onSelect={val =>{this.setState({selected: val}, 
                                this.handleSelect)}}
                            onClear={()=> this.setState({
                                product:null,
                                selected: null
                            })}/>
                </div>
                <div>
                    {this.state.product != null 
                        ?<React.Fragment>
                            <h4>Name: {this.state.product.name}</h4>
                            <h5>Unit Price: {this.state.product.unit_sales_price}</h5>
                            <p>Code: {this.state.product.id}</p>
                            <p>Description: {this.state.product.description}</p>
                            {this.state.product.tax 
                                ? <p>Tax: {this.state.product.tax.name}({this.state.product.tax.rate}%)</p>
                                : null}
                            <p>Unit: {this.state.product.unit.name}</p>
                        </React.Fragment>
                    : <p>NO PRODUCT SELECTED YET</p>}
                    <div style={{
                        display: 'flex', 
                        flexDirection: 'row', 
                        justifyContent: 'center'}}>
                        <button className="btn btn-lg primary"
                            onClick={this.props.handler}>Close</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default PriceCheckPage