import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';

import Header from './Header.js';
import Home, {HomeModal} from './Home.js';
import Files from './Files.js';
import About from './About.js';

import buildInfo from './data/processed/buildInfo.json'

import 'semantic-ui-css/semantic.min.css'
import {Container, Divider, Icon, Segment} from "semantic-ui-react";
import {BrowserRouter, Route, Routes} from "react-router-dom";

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <Header/>
            
            <Container>
                <Segment>
                    <Routes>
                        <Route path='/' element={<Home/>}>
                        </Route>
                        <Route path="/files" element={<Files/>}/>
                        <Route path="/about" element={<About/>}/>
                    </Routes>
                </Segment>
            </Container>
            
            <Divider hidden/>
            
            <Container textAlign='center'>
                <Segment vertical>
                    <div>cdMir Powered by <a href='https://github.com/HadTeam'>HadTeam</a></div>
                    <div>Build: {buildInfo.commitId} | Time: {buildInfo.time}</div>
                    <div>
                        <a href='https://github.com/HadTeam/cdMir'><Icon name='github'/></a>
                    </div>
                </Segment>
            </Container>
        </BrowserRouter>
    
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
