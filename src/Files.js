import React from 'react';

import {Divider, Grid, Header, Icon, Input, Label, Menu, Popup, Segment, Table} from "semantic-ui-react";

import files from './data/files.json';
import {Link} from "react-router-dom";

export default function Files() {
    return (
        <div id='body'>
            <Segment>
    
                <Header size='large'>
                    <Icon name={'battery full'}/>
                    <Header.Content>
                        每周良心软件推荐
                        <Header.Subheader>
                            保证不凉心!
                        </Header.Subheader>
                    </Header.Content>
                </Header>
                
                <Divider hidden/>
    
                <Grid stackable columns={3}>
                    <Grid.Column>
                        <Segment>
                            <Header>
                                <Header.Content>
                                    ???
                                    <Header.Subheader>
                                        ???
                                    </Header.Subheader>
                                </Header.Content>
                            </Header>
                        </Segment>
                    </Grid.Column>
                </Grid>
            </Segment>
            
            <Menu stackable tabular attached='top'>
                <Menu.Menu position='right'>
                    <Menu.Item>
                    
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
            <Table attached='bottom' singleLine unstackable selectable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Filename</Table.HeaderCell>
                        <Table.HeaderCell>Tags</Table.HeaderCell>
                        <Table.HeaderCell textAlign='right'>
                            <Input
                                transparent
                                icon='search'
                                placeholder='Search...'
                            />
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        files.map((item, index) => {
                            if (item.urlType === 'directly') {
                                return (
                                    <Table.Row key={'fileListItem' + index}>
                                        <Table.Cell singleLine width={5}>
                                            <Icon name='text file'/>
                                            <a href={item.url} target='_blank'>{item.filename}</a>
                                        </Table.Cell>
                                        <Table.Cell colSpan={2}>
                                            <Label.Group>
                                                {
                                                    (Object.keys(item.tags)).map((tag) => {
                                                        switch (tag) {
                                                            case 'hash':{
                                                                return (
                                                                    <Popup
                                                                        content={
                                                                            Object.keys(item.tags[tag]).map((hash) => {
                                                                                return <p>{hash}: {item.tags[tag][hash]}</p>
                                                                            })
                                                                        }
                                                                        on='click'
                                                                        pinned
                                                                        trigger={
                                                                            <Label as='a'
                                                                                   key={'file' + index + 'Tag' + tag}>
                                                                                hash: (click)
                                                                            </Label>
                                                                        }
                                                                    />
                                                                );
                                                            }
                                                            case 'id': return ;
                                                            default:
                                                                return (<Label>{tag}: {item.tags[tag]}</Label>);
                                                        }
                                                    })
                                                }
                                            </Label.Group>
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            }
                        })
                    }
                </Table.Body>
            </Table>
        </div>
    
    );
}
