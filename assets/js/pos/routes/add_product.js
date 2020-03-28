import React, {Component} from 'react';
import ProductCard from '../components/product_card'
import SearchableWidget from '../../src/components/searchable_widget'
import axios from '../../src/auth'

class ManualAddProduct extends Component{
    state = {
        popularProducts: [],
        selectedProduct: null
    }

    updateSearchText = (evt) =>{
        this.setState({searchText: evt.target.value})
    }

    componentDidMount(){
        axios({
            'method': 'GET',
            'url': '/inventory/api/product/'
        }).then(resp =>{
            this.setState({popularProducts: resp.data})
        })
    }
    
    render(){
        return(
            <div >
                <h1>Add Product</h1>
                <p>Search for a product using its product ID or selecting manually from the list below</p>
                <div className='shadow'>
                    <div style={{
                        marginBottom: '5px',
                        display: 'flex',
                        flexDirection: 'row',
                        
                    }}>
                        <div style={{flex: 4, padding: '5px'}}>
                            <SearchableWidget 
                            
                            dataURL='/inventory/api/product/'
                            displayField="name"
                            idField="id"
                            onSelect={val =>{this.setState({selectedProduct: val})}}
                            onClear={()=>(this.setState({selectedProduct:null}))}/>
                        </div>
                        <button className='text-white btn primary btn-block btn-lg'
                        style={{flex: 1}}
                        disabled={!this.state.selectedProduct}
                        onClick={() => this.props.insertProduct(this.state.selectedProduct)}
                        >Add Product</button>
                    
                        </div>
                    <div style={{
                        minHeight: '300px',
                        maxHeight: '50vh',
                        overflowY: 'auto'
                    }}>
                        
                        {this.state.popularProducts.map(product =>(
                            <ProductCard 
                                key={product.id}
                                data={product}
                                handler={() =>{this.props.insertProduct(`${product.id}-${product.name}`)
                                }}
                                selected={this.state.selectedProduct === `${product.id}-${product.name}`}
                                />
                        ))}
                    </div>
                </div>
                
            </div>

        )
    }
}

export default ManualAddProduct;