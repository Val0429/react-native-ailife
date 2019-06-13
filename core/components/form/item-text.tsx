import React, {Component, ReactElement} from 'react';
import {Platform, View, Image, TouchableOpacity, StyleProp, ViewStyle} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Container, Header, Title, Segment, Tabs, Tab, TabHeading, Content, ListItem, Switch, Footer, FooterTab, Button, Left, Right, Body, Text, Item, Input, H1, Label } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Actions } from 'react-native-router-flux';

interface Props {
    icon?: any;
    title: string;
    value?: string;
    onValueChange?: (value: string) => void;
    secureTextEntry?: boolean;
    last?: boolean;
}

export class ItemText extends Component<Props> {
    render() {
        return (
            <ListItem icon={this.props.icon ? true : false} last={this.props.last}>
                { this.props.icon ? (<Left>{this.props.icon}</Left>) : null }
                <Body>
                    <Item placeholderLabel style={styles.item}>
                        <Label style={styles.item_placeholder}>{this.props.title}</Label>
                        <Input style={styles.item_text} secureTextEntry={this.props.secureTextEntry} value={this.props.value} onChangeText={this.props.onValueChange} />
                    </Item>
                </Body>
            </ListItem>
        );
    }
}

const styles = EStyleSheet.create({
    item: {
        marginLeft: -0.5,
        borderColor: 'transparent'
    },
    item_placeholder: {
        color: 'black',
    },
    item_text: {
        textAlign: 'right',
        marginRight: '8 rem',
        borderWidth: 0
    }
});
