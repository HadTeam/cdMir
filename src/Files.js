import React from 'react';

import {Container, Divider, Grid, Header, Icon, Input, List, Menu, Segment} from "semantic-ui-react";

import fileList from './data/fileList.json';


function fileIconName(type) {
    switch (type) {
        default:
            return 'file';
    }
}


export default function Files() {
    return (
        <div id='body'>
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
            
            // TODO
            <Grid stackable columns={3}>
                <Grid.Column>
                    <Header>
                        <Icon name={fileIconName()}/>
                        <Header.Content>
                            ???
                            <Header.Subheader>
                                ???
                            </Header.Subheader>
                        </Header.Content>
                    </Header>
                </Grid.Column>
                <Grid.Column>
                    <Header>
                        <Icon name={fileIconName()}/>
                        <Header.Content>
                            ???
                            <Header.Subheader>
                                ???
                            </Header.Subheader>
                        </Header.Content>
                    </Header>
                </Grid.Column>
                <Grid.Column>
                    <Header>
                        <Icon name={fileIconName()}/>
                        <Header.Content>
                            ???
                            <Header.Subheader>
                                ???
                            </Header.Subheader>
                        </Header.Content>
                    </Header>
                </Grid.Column>
            </Grid>
            
            <Divider hidden/>
            
            <Menu stackable tabular attached='top'>
                <Menu.Menu position='right'>
                    <Menu.Item>
                        <Input
                            transparent
                            icon='search'
                            placeholder='Search...'
                        />
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
            <Segment attached='bottom'>
                <Container>
                    <List relaxed>
                        {
                            fileList.map((item, index) => {
                                return (
                                    <List.Item as='a' href={item.url} key={'file_' + index}>
                                        <List.Icon name={fileIconName(item.type)} verticalAlign='middle'/>
                                        <List.Content>
                                            <List.Header>{item.name}</List.Header>
                                            <List.Description>
                                                sha1: {item.sha1}
                                            </List.Description>
                                        </List.Content>
                                    
                                    </List.Item>
                                );
                            })
                        }
                    </List>
                </Container>
            </Segment>
        
        </div>
    
    );
}
