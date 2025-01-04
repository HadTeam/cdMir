import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import 'fomantic-ui-css/semantic.min.css';
import { Container, Divider, Icon, Segment, Loader } from 'semantic-ui-react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Header from './Header';
const Home = React.lazy(() => import('./Home'));
const Files = React.lazy(() => import('./Files'));
const About = React.lazy(() => import('./About'));
const NoMatch = React.lazy(() => import('./NoMatch'));

import { BuildInfo } from './types';
import buildInfo from './data/processed/buildInfo.json';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Header />
      
      <Container>
        <Suspense fallback={<Loader active>Loading...</Loader>}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/files' element={<Files />} />
            <Route path='/about' element={<About />} />
            <Route path='*' element={<NoMatch />} />
          </Routes>
        </Suspense>
      </Container>
      
      <Divider hidden />
      
      <Container textAlign='center'>
        <Segment vertical>
          <div>cdMir Powered by <a href='https://github.com/HadTeam'>HadTeam</a></div>
          <div>Build: {(buildInfo as BuildInfo).commitId} | Time: {(buildInfo as BuildInfo).time}</div>
          <div>
            <a 
              href='https://github.com/HadTeam/cdMir'
              aria-label="Visit cdMir GitHub repository"
              title="Visit cdMir GitHub repository"
            >
              <Icon name='github' aria-hidden="true" />
            </a>
          </div>
        </Segment>
      </Container>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Only log performance metrics in development
if (process.env.NODE_ENV === 'development') {
  reportWebVitals((metric) => console.log(metric));
} else {
  reportWebVitals();
}