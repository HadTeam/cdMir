import React, {useEffect} from 'react';
import {EventEmitter} from 'events';
import PropTypes from 'prop-types';

import {Container, Divider, Grid, Header, Icon, List, Modal, Segment} from 'semantic-ui-react';

import softwareData from './data/processed/software.json';

const softwareSlug = softwareData.map((item) => {
    return item.slug;
});

const eventEmitter = new EventEmitter();

function SoftwareCard(props) {
    const slug = props.software.slug;
    return (
        <Grid.Column
            onClick={() => {
                eventEmitter.emit('openDownloadModal', {type: 'open', slug: slug});
            }}
        >
            <Segment piled style={{height: '100%'}}>
                <Header>
                    <Header.Content>
                        {props.software.name}
                        <Header.Subheader>
                            {props.software.description}
                        </Header.Subheader>
                    </Header.Content>
                </Header>
            </Segment>
        </Grid.Column>
    );
}
SoftwareCard.propTypes={
    software: {
        name: PropTypes.string,
        slug: PropTypes.string,
        destination: PropTypes.string
    }
};

function SoftwareList() {
    return (
        <Container>
            <Grid stackable columns={3}>
                {
                    softwareData.filter((item) => {
                        return item.recommend === false;
                    }).map((item) => {
                        return (<SoftwareCard software={item} key={'softwareCard_' + item.slug}/>);
                    })
                }
            </Grid>
        </Container>
    );
}

function HomeModal() {
    let listener;
    const [state, dispatch] = React.useReducer((state, action) => {
        switch (action.type) {
            case 'open':
                return {...state, open: true, download: softwareData[softwareSlug.indexOf(action.slug)].sources};
            case 'close':
            default:
                return {state, open: false, download: {}};
        }
    }, {open: false, download: {}});
    
    useEffect(() => {
        listener = eventEmitter.addListener('openDownloadModal', (data) => {
            dispatch(data);
            
            return function cleanup() {
                eventEmitter.removeListener(listener);
            };
        });
    }, []);
    
    return (
        <Modal
            open={state.open}
            onClose={() => dispatch({type: 'close'})}
        >
            <Modal.Header>??????????????????</Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <List>
                        {
                            Object.keys(state.download).map((key, index) => {
                                return (
                                    <List.Item key={'downloadModalHeader' + index}>
                                        {key}
                                        <List.List>
                                            {
                                                state.download[key].map((item, index) => {
                                                    return (
                                                        <List.Item key={'downloadModalAddress' + index}>
                                                            <a href={item.url}>{item.filename}</a>
                                                        </List.Item>
                                                    );
                                                })
                                            }
                                        </List.List>
                                    </List.Item>
                                );
                            })
                        }
                    </List>
                </Modal.Description>
            </Modal.Content>
        </Modal>
    );
}


export default function Home() {
    return (
        <div id='home'>
            <Segment>
                <Header as='h3'>
                    <Icon name='settings'/>
                    <Header.Content>
                        ??????
                        <Header.Subheader>
                            ??????????????????????????????????????????????????????????????????????????????????????????
                        </Header.Subheader>
                    </Header.Content>
                </Header>
                {/*
                    <Message icon warning>
                        <Icon name='question'/>
                        <Message.Content>
                            <Message.Header>
                                ????????????
                            </Message.Header>
                            <List bulleted>
                                <List.Item key='submitQuestion' href='https://cornworld.cn/other/softwareMirrorList'>??????
                                    ??????&??????</List.Item>
                                <List.Item key='submitIssues' href='https://github.com/HadTeam/cdMir/issues'>?????? Github
                                    Issues
                                    (??????????????????????????????)</List.Item>
                                <List.Item key='checkFAQ' href='/about#faq'>?????? FAQ</List.Item>
                            </List>
                        </Message.Content>
                    </Message>
                */}
            </Segment>
            
            <Divider hidden/>
            
            <Header attached='top' block as='h4'>
                <Icon name={'battery full'}/>
                <Header.Content>????????????????????????</Header.Content>
            </Header>
            <Segment attached='bottom'>
                <Grid stackable columns={3}>
                    {
                        softwareData.filter((item) => {
                            return item.recommend === true;
                        }).map((item) => {
                            return (<SoftwareCard software={item} key={'softwareCard_' + item.slug}/>);
                        })
                    }
                </Grid>
            </Segment>
            
            <Divider hidden/>
            
            <Header attached='top' block as='h4'>
                <Icon name='numbered list'/>
                <Header.Content>????????????</Header.Content>
            </Header>
            <Segment attached='bottom'>
                <SoftwareList/>
            </Segment>
            
            <HomeModal/>
        </div>
    );
}
