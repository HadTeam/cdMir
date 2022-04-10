import React from 'react';
import {Container, Dropdown, Menu} from 'semantic-ui-react';
import {useLocation} from 'react-router-dom';

import links from './data/processed/links.json';

export default function Header() {
    const [state, setState] = React.useState('home');
    
    const resolvePathname = (pathname) => {
        switch (pathname) {
            case '/':
            case '/home':
            default:
                return 'home';
            case '/files':
                return 'files';
            case '/about':
                return 'about';
        }
    };
    const location = useLocation();
    const current = resolvePathname(location.pathname);
    if (current !== state) setState(current);
    
    if (location.hash !== '') {
        const element = document.getElementById(location.hash.replace('#', ''));
        if (element) element.scrollIntoView();
    }
    
    return (
        <header>
            <Menu pointing borderless fixed='top'>
                <Container>
                    <Menu.Item header>cdMir</Menu.Item>
                    <Menu.Item
                        name='home'
                        active={state === 'home'}
                        onClick={() => setState('home')}
                        href='/'
                    >
                        Home
                    </Menu.Item>
                    
                    <Menu.Item
                        name='files'
                        active={state === 'files'}
                        onClick={() => setState('files')}
                        href='/files'
                    >
                        Files
                    </Menu.Item>
                    
                    <Menu.Item
                        name='about'
                        active={state === 'about'}
                        onClick={() => setState('about')}
                        href='/about'
                    >
                        About
                    </Menu.Item>
                    
                    <Menu.Menu position='right'>
                        <Dropdown item text='Links' simple options={
                            links.map((item, index) => {
                                item['key'] = index;
                                return item;
                            })
                        }
                        />
                        
                        <Menu.Item
                            name='Donate'
                            active={false}
                            href='/about#donate'
                        />
                    </Menu.Menu>
                </Container>
            </Menu>
        </header>
    );
}
