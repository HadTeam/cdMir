import { FC } from 'react';
import { Accordion, Card, Container, Divider, Icon } from 'semantic-ui-react';
import { isMobile } from 'react-device-detect';
import { DonateInfo, Contributor, FAQ } from './types';

import contributors from './data/processed/contributors.json';
import faqs from './data/processed/faqs.json';
import donateInfo from './data/processed/donateInfo.json';

const About: FC = () => {
  return (
    <div id='body'>
      <Container>
        <Divider horizontal as='h4' id='contributor'>
          <Icon name='thumbs up outline'/>
          贡献者
        </Divider>
        <Divider hidden/>
        <Container>
          <Card.Group 
            centered 
            itemsPerRow={isMobile ? 2 : 4} 
            items={contributors as Contributor[]}
          />
        </Container>
        
        <Divider horizontal as='h4' id='description'>
          <Icon name='tag'/>
          介绍
        </Divider>
        <Divider hidden/>
        <Container>
          <p>这是一个软件镜像站，旨在通过搜集或搭建镜像的方式，为处于中国大陆的用户提供高速下载服务。</p>
          <p>如果您需要软件并未被 cdMir 收录，请联系我们（包括但不限于 发布Issues、社交媒体联系、邮箱联系），我们会考虑并添加。</p>
          <p>如果您认为我们值得支持，请 star 我们的<a href='https://github.com/HadTeam/cdMir'>仓库</a>！</p>
          <p><a href='https://github.com/HadTeam/cdMir/blob/main/README.md'>[更多介绍可参见 README.md 文件]</a></p>
        </Container>
        
        <Divider horizontal as='h4' id='faq'>
          <Icon name='question'/>
          FAQ
        </Divider>
        <Divider hidden/>
        <Container>
          <Accordion
            exclusive={false}
            fluid
            panels={faqs as FAQ[]}
          />
        </Container>
        
        <Divider horizontal as='h4' id='donate'>
          <Icon name='yen sign'/>
          捐助
        </Divider>
        <Container>
          <Card.Group 
            itemsPerRow={isMobile ? 3 : 5} 
            centered 
            items={donateInfo as DonateInfo[]}
          />
        </Container>
      </Container>
    </div>
  );
};

export default About;