import React, {Component} from 'react';
import ProductCard from '../components/product_card'

class ManualAddProduct extends Component{
    state = {
        popularProducts: [1],
        searchText: '',
        selectedProduct: null
    }

    updateSearchText = (evt) =>{
        this.setState({searchText: evt.target.value})
    }
    
    render(){
        return(
            <div >
                <h1>Add Product</h1>
                <p>Search for a product using its product ID or selecting manually from the list below</p>
                <div className='shadow'>
                    <input type="text" name="" id="" className='form-control'
                     onChange={this.updateSearchText}
                     value={this.state.searchText} />
                    <div style={{minHeight: '300px'}}>

                        {this.state.popularProducts.map(product =>{
                            <ProductCard />
                        })}
                    </div>
                </div>
                <button className='text-white btn primary btn-block btn-lg' 
                >Add Product</button>
            </div>

        )
    }
}

export default ManualAddProduct;