import React from 'react'
import styles from './styles.css'
import { useDrag } from 'react-dnd'
import ItemTypes from './item_types'

const Card =(props) =>{
    const [{ isDragging }, drag] = useDrag({
        item: { name, type: ItemTypes.CARD },
        end: (item, monitor) => {
          const dropResult = monitor.getDropResult()
          if (item && dropResult) {
            console.log(dropResult)
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
            <div style={{flex: 1}}><i className="fas fa-user    "></i> {props.owner} </div>
            <div style={{flex: 1}}>{props.status}</div>
        </div>
    <p>{props.opportunity}</p>
    </div>)
}

export default Card