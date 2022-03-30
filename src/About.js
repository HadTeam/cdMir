import {Accordion, Card, Container, Divider, Icon, Image, List} from "semantic-ui-react";
import {isMobile} from "react-device-detect";

import contributors from './data/contributors.json';
import faqs from './data/faqs.json';
import donateInfo from './data/donateInfo.json';


export default function About() {
    return (
        <div id='body'>
            <Container>
                <Divider horizontal as='h4' id='contributor'>
                    <Icon name='thumbs up outline'/>
                    贡献者
                </Divider>
                <Divider hidden />
                <Container>
                    <Card.Group centered itemsPerRow={isMobile?2:4} items={contributors} />
                </Container>
                
                <Divider horizontal as='h4' id='description'>
                    <Icon name='tag'/>
                    介绍
                </Divider>
                <Divider hidden />
                <Container>
                
                </Container>
                
                <Divider horizontal as='h4' id='faq'>
                    <Icon name='question'/>
                    FAQ
                </Divider>
                <Divider hidden />
                <Container>
                    <Accordion
                        exclusive={false}
                        fluid
                        panels={faqs}
                    />
                </Container>
                <Divider horizontal as='h4' id='donate'>
                    <Icon name='yen sign'/>
                    捐助
                </Divider>
                <Container>
                    <Card.Group itemsPerRow={isMobile?3:5} centered items={donateInfo} />
                </Container>
            </Container>
        </div>
    );
}