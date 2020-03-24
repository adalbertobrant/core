import React from 'react'
import Card from './card'
import { useDrop } from 'react-dnd'
import ItemTypes from './item_types'
import styles from './styles.css'

const kanbanColumn =(props) => {
    const [{ canDrop, isOver }, drop] = useDrop({
        accept: ItemTypes.CARD,
        drop: () => ({
           name: props.name, 
           value: props.statusValue
          }),
        collect: (monitor) => ({
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        }),
      })
  const statusValue = props.statusValue
 
    return(
        <div ref={drop} className={styles.kanbanColumn}
            style={{borderTopColor: props.accent}}>
            <h3>{props.name}</h3>
            {props.data.map((lead, i)=>{
                return(<Card key={i} {...lead}
                            updateCards={props.handleCardDrop}
                            />)
            })}
        </div>
    )
}

export default kanbanColumn