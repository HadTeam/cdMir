import React, {useEffect} from 'react';
import {EventEmitter} from 'events';

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
            <Modal.Header>选择下载地址</Modal.Header>
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
                        欢迎
                        <Header.Subheader>
                            这是一个搜集常用软件镜像下载地址的列表（仅针对中国大陆用户）
                        </Header.Subheader>
                    </Header.Content>
                </Header>
                {/*
                    <Message icon warning>
                        <Icon name='question'/>
                        <Message.Content>
                            <Message.Header>
                                需要帮助
                            </Message.Header>
                            <List bulleted>
                                <List.Item key='submitQuestion' href='https://cornworld.cn/other/softwareMirrorList'>提交
                                    建议&问题</List.Item>
                                <List.Item key='submitIssues' href='https://github.com/HadTeam/cdMir/issues'>提交 Github
                                    Issues
                                    (国内可能无法正常打开)</List.Item>
                                <List.Item key='checkFAQ' href='/about#faq'>查阅 FAQ</List.Item>
                            </List>
                        </Message.Content>
                    </Message>
                */}
            </Segment>
            
            <Divider hidden/>
            
            <Header attached='top' block as='h4'>
                <Icon name={'battery full'}/>
                <Header.Content>每周良心软件推荐</Header.Content>
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
                <Header.Content>所有软件</Header.Content>
            </Header>
            <Segment attached='bottom'>
                <SoftwareList/>
            </Segment>
            
            <HomeModal/>
        </div>
    );
}
