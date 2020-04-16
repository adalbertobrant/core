import React from 'react'
import styles from './styles.css'

const Emoji =(props) =>{
    return(
        <div className={styles.emoji} onClick={() =>props.handler(props.code)} >
            <p role='img'>{props.code}</p>
        </div>
    )
}


const EmojiBox = (props) =>{
    return(<div className={styles.emojiBox} style={{display: props.show ? 'flex' : 'none'}}>
        <div className={styles.emojiRow}>
            <Emoji code={'\u{1F601}'} handler={props.insertHandler} />
            <Emoji code={'\u{1F602}'} handler={props.insertHandler} />
            <Emoji code={'\u{1F603}'} handler={props.insertHandler} />
            <Emoji code={'\u{1F609}'} handler={props.insertHandler} />
            <Emoji code={'\u{1F616}'} handler={props.insertHandler} />
        </div>
        <div className={styles.emojiRow}>
        <Emoji code={'\u{1F629}'} handler={props.insertHandler} />
            <Emoji code={'\u{1F631}'} handler={props.insertHandler} />
            <Emoji code={'\u{1F62C}'} handler={props.insertHandler} />
            <Emoji code={'\u{1F621}'} handler={props.insertHandler} />
            <Emoji code={'\u{1F64B}'} handler={props.insertHandler} />
        </div>
        <div className={styles.emojiRow}>
            <Emoji code={'\u{270A}'} handler={props.insertHandler} />
            <Emoji code={'\u{2714}'} handler={props.insertHandler} />
            <Emoji code={'\u{2716}'} handler={props.insertHandler} />
            <Emoji code={'\u{2764}'} handler={props.insertHandler} />
            <Emoji code={'\u{270B}'} handler={props.insertHandler} />
        </div>
        <div className={styles.emojiRow}>
            <Emoji code={'\u{260E}'} handler={props.insertHandler} />
            <Emoji code={'\u{261D}'} handler={props.insertHandler} />
            <Emoji code={'\u{1F3BC}'} handler={props.insertHandler} />
            <Emoji code={'\u{1F3B6}'} handler={props.insertHandler} />
            <Emoji code={'\u{1F442}'} handler={props.insertHandler} />
        </div>
        <div className={styles.emojiRow}>
            <Emoji code={'\u{1F44C}'} handler={props.insertHandler} />
            <Emoji code={'\u{1F44D}'} handler={props.insertHandler} />
            <Emoji code={'\u{1F44F}'} handler={props.insertHandler} />
            <Emoji code={'\u{1F4A1}'} handler={props.insertHandler} />
            <Emoji code={'\u{1F4AC}'} handler={props.insertHandler} />
        </div>
    </div>)
}

export default EmojiBox