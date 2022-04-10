import React from 'react';
import {Header, Segment} from "semantic-ui-react";

export default function NoMatch() {
    return (
        <Segment>
            <Header>
                <Header.Content>Not Found</Header.Content>
                <Header.Subheader>抱歉，无法在此路径上找到任何合法资源。</Header.Subheader>
            </Header>
        </Segment>
    );
}