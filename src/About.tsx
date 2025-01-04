import { FC } from 'react';
import { Accordion, Card, Container, Divider, Icon, Image } from 'semantic-ui-react';
import { isMobile } from 'react-device-detect';
import { DonateInfo, Contributor, FAQ } from './types';

import contributors from './data/processed/contributors.json';
import faqs from './data/processed/faqs.json';
import donateInfo from './data/processed/donateInfo.json';

const ContributorCard: FC<{ contributor: Contributor }> = ({ contributor }) => (
  <Card
    as={contributor.as}
    href={contributor.href}
    header={contributor.header}
    meta={contributor.meta}
    description={contributor.description}
    image={<Image src={contributor.image} loading="lazy" alt={`Profile picture of contributor ${contributor.header}`} />}
    role="listitem"
  />
);

const DonateCard: FC<{ info: DonateInfo }> = ({ info }) => (
  <Card
    as={info.as}
    header={info.header}
    meta={info.meta}
    image={<Image src={info.image} loading="lazy" alt={`QR code or logo for ${info.header} donation`} />}
    role="listitem"
  />
);

const About: FC = () => {
  return (
    <main id='body' role="main">
      <Container>
        <Divider horizontal as='h4' id='contributor'>
          <Icon name='thumbs up outline' aria-hidden="true"/>
          贡献者
        </Divider>
        <Divider hidden/>
        <section aria-labelledby="contributor">
          <Card.Group 
            centered 
            itemsPerRow={isMobile ? 2 : 4}
            role="list"
            aria-label="Contributors list"
          >
            {(contributors as Contributor[]).map((contributor, index) => (
              <ContributorCard key={index} contributor={contributor} />
            ))}
          </Card.Group>
        </section>
        
        <Divider horizontal as='h4' id='description'>
          <Icon name='tag' aria-hidden="true"/>
          介绍
        </Divider>
        <Divider hidden/>
        <section aria-labelledby="description">
          <p>这是一个软件镜像站，旨在通过搜集或搭建镜像的方式，为处于中国大陆的用户提供高速下载服务。</p>
          <p>如果您需要软件并未被 cdMir 收录，请联系我们（包括但不限于 发布Issues、社交媒体联系、邮箱联系），我们会考虑并添加。</p>
          <p>如果您认为我们值得支持，请 star 我们的<a href='https://github.com/HadTeam/cdMir'>仓库</a>！</p>
          <p><a href='https://github.com/HadTeam/cdMir/blob/main/README.md'>[更多介绍可参见 README.md 文件]</a></p>
        </section>
        
        <Divider horizontal as='h4' id='faq'>
          <Icon name='question' aria-hidden="true"/>
          FAQ
        </Divider>
        <Divider hidden/>
        <section aria-labelledby="faq">
          <Accordion
            exclusive={false}
            fluid
            panels={faqs as FAQ[]}
            role="region"
            aria-label="Frequently Asked Questions"
          />
        </section>
        
        <Divider horizontal as='h4' id='donate'>
          <Icon name='yen sign' aria-hidden="true"/>
          捐助
        </Divider>
        <section aria-labelledby="donate">
          <Card.Group 
            itemsPerRow={isMobile ? 3 : 5} 
            centered 
            role="list"
            aria-label="Donation methods"
          >
            {(donateInfo as DonateInfo[]).map((info, index) => (
              <DonateCard key={index} info={info} />
            ))}
          </Card.Group>
        </section>
      </Container>
    </main>
  );
};

export default About;