import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';

import 'fomantic-ui-css/semantic.min.css';
import '@fontsource/jetbrains-mono';
import { Container, Divider, Icon, Segment } from 'semantic-ui-react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Header from './Header';
import Home from './Home';
import Files from './Files';
import About from './About';
import NoMatch from './NoMatch';

import { BuildInfo } from './types';
import buildInfo from './data/processed/buildInfo.json';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Header />
      
      <Container>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/files' element={<Files />} />
          <Route path='/about' element={<About />} />
          <Route path='*' element={<NoMatch />} />
        </Routes>
      </Container>
      
      <Divider hidden />
      
      <Container textAlign='center'>
        <Segment vertical>
          <div>cdMir Powered by <a href='https://github.com/HadTeam'>HadTeam</a></div>
          <div>Build: {(buildInfo as BuildInfo).commitId} | Time: {(buildInfo as BuildInfo).time}</div>
          <div>
            <a href='https://github.com/HadTeam/cdMir'><Icon name='github' /></a>
          </div>
        </Segment>
      </Container>
    </BrowserRouter>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals((metric) => console.log(metric));