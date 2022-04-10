import React from "react";
import {Icon, Label, Pagination, Popup, Table} from 'semantic-ui-react';
import PropTypes from 'prop-types';

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
                Object.keys(props.hashObj).map((hashType, index) => {
                    return (<Popup.Content key={index}>{hashType}: {props.hashObj[hashType]}</Popup.Content>);
                })
            }
        </Popup>
    );
}

HashPopup.propTypes = {
    hashObj: PropTypes.object
};

export default function Files() {
    const [activePage, setActivePage] = React.useState(1);
    const pageLength=10;
    
    const shownFiles = files.filter((item) => {
        return item.urlType === 'directly';
    })
    const filesTot = shownFiles.length;
    const pagesTot=Math.floor(filesTot / pageLength)+(filesTot % pageLength!==0);
    console.log(pagesTot);
    const leftNum=(activePage-1)*pageLength;
    
    return (
        <div id='body'>
            <Table attached='bottom' singleLine stackable selectable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Filename</Table.HeaderCell>
                        <Table.HeaderCell textAlign='right'>Tags</Table.HeaderCell>
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
                        shownFiles.slice(leftNum,leftNum+pageLength).map((item, index) => {
                            return (
                                <Table.Row key={'fileListItem' + index}>
                                    <Table.Cell singleLine width={5}>
                                        <Icon name='text file'/>
                                        <a href={item.url} target='_blank' rel="noreferrer">{item.filename}</a>
                                    </Table.Cell>
                                    <Table.Cell colSpan={2} textAlign='right'>
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
                            
                        })
                    }
                </Table.Body>
                <Table.Footer>
                    <Table.Row>
                        <Table.Cell colSpan={3} textAlign='center'>
                            <Pagination
                                totalPages={pagesTot}
                                activePage={activePage}
                                onPageChange={(e,data)=>{setActivePage(data.activePage)}}
                            />
                        </Table.Cell>
                    </Table.Row>
                </Table.Footer>
            </Table>
        </div>
    
    );
}
