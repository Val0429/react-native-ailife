import React, {Component, ReactElement} from 'react';
import {Platform, View, Image, TouchableOpacity, StyleProp, ViewStyle} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Container, Header, Title, Segment, Tabs, Tab, TabHeading, Content, ListItem, Switch, Footer, FooterTab, Button, Left, Right, Body, Text, Item, Input, H1, Label } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Actions } from 'react-native-router-flux';

interface Props {
    icon?: any;
    title: string;
    // value?: boolean;
    // onValueChange?: (value: boolean) => void;
    colorTitle?: string;
    color: string;
    last?: boolean;
}

export class ItemColor extends Component<Props> {
    render() {
        return (
            <ListItem icon={this.props.icon ? true : false} last={this.props.last}>
                { this.props.icon ? (<Left>{this.props.icon}</Left>) : null }
                <Body><Text>{this.props.title}</Text></Body>
                <Right>
                    <Text style={{marginRight: 10}}>{this.props.colorTitle || this.props.color}</Text>
                    <View style={{width: 17, height: 17, backgroundColor: this.props.color}} />
                </Right>
            </ListItem>
        );
    }
}
