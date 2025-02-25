import React, { Suspense, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import 'fomantic-ui-css/semantic.min.css';
import { Container, Divider, Icon, Segment, Loader, Message } from 'semantic-ui-react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Header from './Header';
const Home = React.lazy(() => import('./Home'));
const Files = React.lazy(() => import('./Files'));
const About = React.lazy(() => import('./About'));
const NoMatch = React.lazy(() => import('./NoMatch'));

import { BuildInfo } from './types';
import buildInfo from './data/processed/buildInfo.json';

// PWA update notification component
const PWAUpdateNotification: React.FC = () => {
  const [needRefresh, setNeedRefresh] = useState(false);
  
  useEffect(() => {
    // Register event listeners for PWA updates
    const onSWUpdate = () => setNeedRefresh(true);
    
    window.addEventListener('sw-update-available', onSWUpdate);
    
    // Cleanup
    return () => {
      window.removeEventListener('sw-update-available', onSWUpdate);
    };
  }, []);
  
  const updateApp = () => {
    const event = new Event('sw-update-accepted');
    window.dispatchEvent(event);
    window.location.reload();
  };
  
  if (!needRefresh) return null;
  
  return (
    <Message warning>
      <Message.Header>Update Available</Message.Header>
      <p>A new version of cdMir is available. Click the button below to update.</p>
      <button onClick={updateApp} className="ui primary button">
        Update Now
      </button>
    </Message>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Header />
      
      <Container>
        <PWAUpdateNotification />
        
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

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(error => {
      console.log('SW registration failed: ', error);
    });
  });
}

// Only log performance metrics in development
if (process.env.NODE_ENV === 'development') {
  reportWebVitals((metric) => console.log(metric));
} else {
  reportWebVitals();
}