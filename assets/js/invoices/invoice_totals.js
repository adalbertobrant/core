import React, {Component} from 'react';


export const Aux = (props) => props.children;


class Totals extends Component{
    state = {
        tax: 0.00,
        subtotal: 0.00,
        total: 0.00
    }

    subtotalReducer =(x, y) =>{
        return x + y.subtotal
    }

    taxReducer = (x, y) =>{
        return x + y.tax;
    }

    componentDidUpdate(prevProps, prevState){
        if(prevProps.list !== this.props.list || 
            prevState.taxObj !== this.state.taxObj ||
            prevProps.exchange_rate != this.props.exchange_rate){
            //update totals 
            
            let total = this.props.list.reduce(this.subtotalReducer, 0);
            let tax = this.props.list.reduce(this.taxReducer, 0)            

            let subtotal = total - tax;
            this.setState({
                subtotal : subtotal * this.props.exchange_rate,
                tax : tax * this.props.exchange_rate,
                total : total * this.props.exchange_rate
            });
        }
    }
    render(){
        const totalStyle = {
            fontSize: '1.5rem',
            padding: '.5rem'
        }
        return(
            <tfoot>    
                <tr>
                        <th colSpan={7} style={{textAlign:"right"}}>Subtotal</th>
                        <td style={totalStyle}>{this.state.subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <th colSpan={7} style={{textAlign:"right"}}>Tax</th>
                        <td style={totalStyle}>{this.state.tax.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <th colSpan={7} style={{textAlign:"right"}}>Total</th>
                        <td style={totalStyle}>{this.props.currency ? this.props.currency.symbol : null} {this.state.total.toFixed(2)}</td>
                    </tr>
            </tfoot>
            );
    }
}
export default Totals;