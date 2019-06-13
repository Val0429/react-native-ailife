import React, {Component, ReactElement} from 'react';
import {Platform, View, Image, TouchableOpacity, StyleProp, ViewStyle} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Container, Header, Title, Segment, Tabs, Tab, TabHeading, Content, ListItem, Switch, Footer, FooterTab, Button, Left, Right, Body, Text, Item, Input, H1 } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Actions } from 'react-native-router-flux';
import { rcImages } from './../../../../resources/images';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon3 from 'react-native-vector-icons/SimpleLineIcons';
import { StorageInstance as Storage, modesText, SettingsModes } from './../../../../config';
import lang, { _ } from './../../../../../core/lang';

import {Video} from './video';
import {Digital} from './digital';
import {Attendance} from './attendance';

interface Props {
    style?: ViewStyle;
}

type States = SettingsModes;

export class ModeSelection extends Component<Props, States> {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    private subject = Storage.getSubject("modes");
    private subscription;
    componentDidMount() {
        this.subscription = this.subject.subscribe( (value) => {
            this.setState({...value});
        });
    }
    componentWillUnmount() {
        this.subscription.unsubscribe();
    }


    render() {
        let tabsText = modesText;
        let tabs = tabsText.map( (data, index) => {
            return (
                <Button
                    key={index}
                    onPress={() => {
                        /// save to db
                        Storage.update("modes", "modes", index);
                        /// switch tab
                        this.setState({modes: index});
                    }}
                    first={ index === 0 ? true : undefined }
                    last={ index === tabsText.length - 1 ? true : undefined }
                    active={this.state.modes === index ? true : undefined}
                    ><Text>{_(`m_${data}` as any)}</Text></Button>
            );
        });

        return (
            <Container style={this.props.style}>
                <Header>
                    <Body style={{alignItems: 'center'}}><Title>Mode Selection</Title></Body>
                </Header>

                <Segment>
                    { tabs }
                </Segment>

                <Content scrollEnabled
                    >
                    { this.state.modes === 0 && <Video /> }
                    { this.state.modes === 1 && <Digital /> }
                    {/* { this.state.modes === 2 && <Attendance /> } */}
                </Content>
            </Container>
        );
    }
}  

const styles = EStyleSheet.create({
    content: {
        backgroundColor: "$bgColor"
    },

    full_height: {
        height: "100%-0",
    },
});
  