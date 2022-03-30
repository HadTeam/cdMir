import {Card, Container, Divider, Icon, Image, List} from "semantic-ui-react";


export default function About() {
    return (
        <div id='body'>
            <Container>
                <Divider horizontal as='h4' id='contributor'>
                    <Icon name='thumbs up outline'/>
                    贡献者
                </Divider>
                
                <Card.Group itemsPerRow={4} stackable>
                    <Card raised href='https://cornworld.cn/' target='_blank'>
                        <Image src='/static/avatar/cornworld.jpg' wrapped/>
                        <Card.Content>
                            <Card.Header>CornWorld</Card.Header>
                            <Card.Meta>全栈开发者 & OIer</Card.Meta>
                            <Card.Description>
                                "希望人没事"
                            </Card.Description>
                        </Card.Content>
                    
                    </Card>
                    <Card raised href='https://www.cnblogs.com/dhclient/p/16065479.html' target='_blank'>
                        <Image src='/static/avatar/dhclientqwq.jpg' wrapped/>
                        <Card.Content>
                            <Card.Header>dhclientqwq</Card.Header>
                            <Card.Meta>OIer</Card.Meta>
                            <Card.Description>
                                "Starting from scratch."
                            </Card.Description>
                        </Card.Content>
                    
                    </Card>
                    <Card href='' target='_blank'>
                        <Image src='/static/avatar/echidna.jpg' wrapped/>
                        <Card.Content>
                            <Card.Header>Echidna</Card.Header>
                            <Card.Meta>OIer</Card.Meta>
                            <Card.Description>
                            
                            </Card.Description>
                        </Card.Content>
                    </Card>
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