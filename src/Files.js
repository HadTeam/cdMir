import React from 'react';

import {Icon, Label, Popup, Table} from 'semantic-ui-react';

import files from './data/processed/files.json';

function HashPopup(props) {
    return (
        <Popup
            on='click'
            pinned
            trigger={<Label as='a'>hash: (click)</Label>}
            positionFixed
            hideOnScroll
            position='bottom right'
        >
            {
                Object.keys(props.hashObj).map((hashType) => {
                    return <Popup.Content>{hashType}: {props.hashObj[hashType]}</Popup.Content>;
                })
            }
        </Popup>
    );
}

export default function Files() {
    return (
        <div id='body'>
            <Table attached='bottom' singleLine stackable selectable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Filename</Table.HeaderCell>
                        <Table.HeaderCell>Tags</Table.HeaderCell>
                        <Table.HeaderCell textAlign='right'>
                            {/*
                                <Input
                                    transparent
                                    icon='search'
                                    placeholder='Search...'
                                />
                            */}
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
                                            <a href={item.url} target='_blank' rel="noreferrer">{item.filename}</a>
                                        </Table.Cell>
                                        <Table.Cell colSpan={2}>
                                            <Label.Group>
                                                {
                                                    (Object.keys(item.tags)).map((tag) => {
                                                        switch (tag) {
                                                            case 'hash': {
                                                                return (<HashPopup hashObj={item.tags[tag]}
                                                                                   key={index + tag}/>);
                                                            }
                                                            case 'id':
                                                                return;
                                                            default:
                                                                return (<Label
                                                                    key={index + tag}>{tag}: {item.tags[tag]}</Label>);
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
