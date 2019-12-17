import React from 'react';
import styles from './app.css';
import Head from '../components/head';
import MainPage from '../routes/main';

class POSApp extends React.Component{
    render(){
        return(
            <div className={styles.container}>
                <Head />
                <MainPage />
            </div>
        )
    }

}
export default POSApp;