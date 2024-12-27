import { FC, useEffect, useReducer } from 'react';
import { EventEmitter } from 'events';
import { Container, Divider, Grid, Header, Icon, List, Modal, Segment } from 'semantic-ui-react';
import { Software, HomeModalState, FileSource } from './types';
import softwareData from './data/processed/software.json';

const typedSoftwareData = (softwareData as unknown) as Software[];
const softwareSlug = typedSoftwareData.map((item) => item.slug);
const eventEmitter = new EventEmitter();

interface SoftwareCardProps {
  software: Software;
}

const SoftwareCard: FC<SoftwareCardProps> = ({ software }) => {
  const slug = software.slug;
  return (
    <Grid.Column
      onClick={() => {
        eventEmitter.emit('openDownloadModal', { type: 'open', slug: slug });
      }}
    >
      <Segment piled style={{ height: '100%' }}>
        <Header>
          <Header.Content>
            {software.name}
            <Header.Subheader>{software.description}</Header.Subheader>
          </Header.Content>
        </Header>
      </Segment>
    </Grid.Column>
  );
};

const SoftwareList: FC = () => {
  return (
    <Container>
      <Grid stackable columns={3}>
        {typedSoftwareData
          .filter((item) => !item.recommend)
          .map((item) => (
            <SoftwareCard software={item} key={`softwareCard_${item.slug}`} />
          ))}
      </Grid>
    </Container>
  );
};

const HomeModal: FC = () => {
  const modalReducer = (state: HomeModalState, action: { type: string; slug?: string }) => {
    switch (action.type) {
      case 'open': {
        const software = typedSoftwareData[softwareSlug.indexOf(action.slug || '')];
        return {
          ...state,
          open: true,
          download: software ? software.sources : {}
        };
      }
      case 'close':
      default:
        return { ...state, open: false, download: {} };
    }
  };

  const [state, dispatch] = useReducer(modalReducer, { open: false, download: {} });

  useEffect(() => {
    const handler = (data: { type: string; slug?: string }) => {
      dispatch(data);
    };
    eventEmitter.addListener('openDownloadModal', handler);

    return () => {
      eventEmitter.removeListener('openDownloadModal', handler);
    };
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
            {Object.entries(state.download).map(([key, sources], index) => (
              <List.Item key={`downloadModalHeader${index}`}>
                {key}
                <List.List>
                  {(sources as FileSource[]).map((item, itemIndex) => (
                    <List.Item key={`downloadModalAddress${itemIndex}`}>
                      <a href={item.url}>{item.filename}</a>
                    </List.Item>
                  ))}
                </List.List>
              </List.Item>
            ))}
          </List>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
};

const Home: FC = () => {
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
      </Segment>
      
      <Divider hidden/>
      
      <Header attached='top' block as='h4'>
        <Icon name='battery full'/>
        <Header.Content>每周良心软件推荐</Header.Content>
      </Header>
      <Segment attached='bottom'>
        <Grid stackable columns={3}>
          {typedSoftwareData
            .filter((item) => item.recommend)
            .map((item) => (
              <SoftwareCard software={item} key={`softwareCard_${item.slug}`}/>
            ))
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
};

export default Home;