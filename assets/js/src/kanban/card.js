import React, {useState, useEffect} from 'react'
import styles from './styles.css'
import { useDrag } from 'react-dnd'
import ItemTypes from './item_types'
import axios from 'axios'


const Card =(props) =>{
    const [name, setName] = useState('')
    useEffect(() =>{
        axios.get('/invoicing/api/sales-rep/'+ props.owner)
          .then(res => setName(res.data.rep_name))
    }, [])
    const [{ isDragging }, drag] = useDrag({
        item: { name, type: ItemTypes.CARD },
        end: (item, monitor) => {
          const dropResult = monitor.getDropResult()
          if (item && dropResult) {
            props.updateCards(props.id, dropResult.value)
          }
        },
        collect: (monitor) => ({
          isDragging: monitor.isDragging(),
        }),
      })
    return(<div ref={drag} className={styles.kanbanCard}>
        <a href={`/invoicing/lead-details/${props.id}`}>
          <h5>{props.title}</h5>
        </a>
        <div style={{display: 'flex', flexDirection:'row'}}>
            <div style={{flex: 1}}><i className="fas fa-user    "></i> {name} </div>
            <div style={{flex: 1}}><i className="fas fa-calendar    "></i> {new Date(props.created).toDateString()}</div>
        </div>
    <p style={{marginTop: '0.5rem'}}>{`${props.currency} ${props.opportunity.toFixed(2)}`}</p>
    </div>)
}

export default Card