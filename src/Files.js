import React from "react";
import {Icon, Label, Pagination, Popup, Search, Table} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';

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
    const pageLength = 10;
    
    const shownFiles=files.filter((item) => {
        return item.urlType === 'directly';
    });
    const filesTot = shownFiles.length;
    const pagesTot = Math.floor(filesTot / pageLength) + (filesTot % pageLength !== 0)
    const leftNum = (activePage - 1) * pageLength;
    
    shownFiles.forEach((item, index)=>{
        item.index=index;
    });
    
    const searchInitState = {
        loading: false,
        searchResults: [],
        value: ''
    };
    const searchReducer = (state, action) => {
        switch (action.type) {
            case 'SEARCH_START':
                return {...state, loading: true, value: action.query};
            case 'SEARCH_FINISH':
                return {...state, loading: false, searchResults: action.results};
            case 'SEARCH_UPDATE_SELECTION': {
                setActivePage(action.selection.page);
                return {...state, value: action.selection.title};
            }
            default:
            case 'SEARCH_CLEAN':
                return searchInitState;
        }
    };
    const [searchState, searchDispatch] = React.useReducer(searchReducer, searchInitState);
    const {loading, searchResults, value} = searchState;
    
    const timeoutRef = React.useRef();
    const search = React.useCallback((e, data) => {
        clearTimeout(timeoutRef.current)
        searchDispatch({type: 'SEARCH_START', query: data.value})
        
        timeoutRef.current = setTimeout(() => {
            if (data.value.length === 0) {
                searchDispatch({type: 'SEARCH_CLEAN'})
                return;
            }
            
            const isMatch = (item) => {
                let re = new RegExp(_.escapeRegExp(data.value), 'i');
                return re.test(item.filename);
            }
            searchDispatch({
                type: 'SEARCH_FINISH',
                results: shownFiles.filter(isMatch).map((item) => {
                    return {
                        title: item.filename,
                        description: item.tags.source,
                        id: item.filename+item.tags.source,
                        page: Math.floor(item.index/pageLength)+1
                    };
                })
            });
        }, 300);
    }, []);
    React.useEffect(() => {
        clearTimeout(timeoutRef.current)
    }, [])
    
    return (
        <div id='body'>
            <Table attached='bottom' singleLine stackable selectable>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Filename</Table.HeaderCell>
                        <Table.HeaderCell>
                            <Search
                                icon='search'
                                placeholder='Search...'
                                loading={loading}
                                onSearchChange={search}
                                results={searchResults}
                                value={value}
                                onResultSelect={(e, data)=>{
                                    searchDispatch({type: 'SEARCH_UPDATE_SELECTION', selection: data.result})
                                }}
                            />
                        </Table.HeaderCell>
                        <Table.HeaderCell>Tags</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        shownFiles.slice(leftNum, leftNum + pageLength).map((item, index) => {
                            return (
                                <Table.Row key={index}>
                                    <Table.Cell singleLine width={5}>
                                        <Icon name='text file'/>
                                        <a href={item.url}
                                           target='_blank'
                                           rel="noreferrer"
                                           name={item.url+item.tags.source}
                                        >{item.filename}</a>
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
                                onPageChange={(e, data) => {
                                    setActivePage(data.activePage)
                                }}
                            />
                        </Table.Cell>
                    </Table.Row>
                </Table.Footer>
            </Table>
        </div>
    
    );
}
