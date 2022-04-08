import React, {useEffect} from 'react';
import {EventEmitter} from "events";

import {Container, Divider, Grid, Header, Icon, List, Message, Modal, Segment} from "semantic-ui-react";

import softwareData from './data/processed/software.json';

const eventEmitter = new EventEmitter();

function SoftwareList() {
    
    return (
        <Container>
            <Grid stackable columns={3}>
                {
                    softwareData.map((software, index) => {
                        return (
                            <Grid.Column
                                key={'softwareCard' + index}
                                onClick={() => {
                                    eventEmitter.emit('openDownloadModal', {type: 'open', index: index})
                                }}
                            >
                                <a href='#'>
                                    <Segment raised>
                                        <Header>
                                            <Header.Content>
                                                {software.name}
                                                <Header.Subheader>
                                                    {software.description}
                                                </Header.Subheader>
                                            </Header.Content>
                                        </Header>
                                    </Segment>
                                </a>
                            </Grid.Column>
                        );
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
                return {...state, open: true, download: softwareData[action.index].sources};
            case 'close':
            default:
                return {state, open: false, download: {}};
        }
    }, {open: false, download: {}});
    
    useEffect(() => {
        listener = eventEmitter.addListener("openDownloadModal", (data) => {
            dispatch(data);
            
            return function cleanup() {
                eventEmitter.removeListener(listener);
            }
        });
    }, []);
    
    return (
        <Modal
            open={state.open}
            onClose={() => dispatch('close')}
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
            <Header as='h3'>
                <Icon name='settings'/>
                <Header.Content>
                    欢迎
                    <Header.Subheader>
                        这是一个搜集常用软件镜像下载地址的列表（仅针对中国大陆用户）
                    </Header.Subheader>
                </Header.Content>
            </Header>
            
            <Message icon warning>
                <Icon name='question'/>
                <Message.Content>
                    <Message.Header>
                        需要帮助
                    </Message.Header>
                    <List bulleted>
                        <List.Item key='submitQuestion' href='https://cornworld.cn/other/softwareMirrorList'>提交
                            建议&问题</List.Item>
                        <List.Item key='submitIssues' href='https://github.com/HadTeam/cdMir/issues'>提交 Github Issues
                            (国内可能无法正常打开)</List.Item>
                        <List.Item key='checkFAQ' href='/about#faq'>查阅 FAQ</List.Item>
                    </List>
                </Message.Content>
            </Message>
            
            <Divider hidden/>
            
            <SoftwareList/>
            
            <HomeModal/>
        </div>
    );
}
