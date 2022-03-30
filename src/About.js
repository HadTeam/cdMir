import {Card, Container, Divider, Icon, Image, List} from "semantic-ui-react";

import contributors from './data/contributors.json';

export default function About() {
    return (
        <div id='body'>
            <Container>
                <Divider horizontal as='h4' id='contributor'>
                    <Icon name='thumbs up outline'/>
                    贡献者
                </Divider>
                <Card.Group itemsPerRow={4} stackable>
                    {
                        contributors.map((item)=>{
                            return (
                                <Card raised href={item.link} target='_blank'>
                                    <Image src={item.avatar} wrapped/>
                                    <Card.Content>
                                        <Card.Header>{item.name}</Card.Header>
                                        <Card.Meta>{item.meta}</Card.Meta>
                                        <Card.Description>
                                            {item.description}
                                        </Card.Description>
                                    </Card.Content>
                                </Card>
                            );
                        })
                    }
                </Card.Group>
                
                <Divider horizontal as='h4' id='description'>
                    <Icon name='tag'/>
                    介绍
                </Divider>
                
                
                <Divider horizontal as='h4' id='faq'>
                    <Icon name='question'/>
                    FAQ
                </Divider>
                <List>
                    <List.Item>
                        <List.Header>
                            ???
                        </List.Header>
                        <List.Content>
                            !!!
                        </List.Content>
                    </List.Item>
                </List>
                
                <Divider horizontal as='h4' id='donate'>
                    <Icon name='money bill alternate'/>
                    捐助
                </Divider>
                <Card.Group stackable itemsPerRow={5}>
                    <Card>
                        <Image src='/static/avatar/cornworld.jpg'/>
                        <Card.Content>
                            <Card.Meta>微信</Card.Meta>
                        </Card.Content>
                    </Card>
                    <Card>
                        <Image src='/static/avatar/cornworld.jpg'/>
                        <Card.Content>
                            <Card.Meta>支付宝</Card.Meta>
                        </Card.Content>
                    </Card>
                    <Card>
                        <Image src='/static/avatar/cornworld.jpg'/>
                        <Card.Content>
                            <Card.Meta>QQ</Card.Meta>
                        </Card.Content>
                    </Card>
                
                
                </Card.Group>
            
            
            </Container>
        </div>
    );
}