import React, {Component, ReactElement} from 'react';
import {Platform, View, Image, TouchableOpacity, StyleProp, ViewStyle} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Container, Header, Title, Segment, Tabs, Tab, TabHeading, Content, ListItem, Switch, Footer, FooterTab, Button, Left, Right, Body, Text, Item, Input, H1, Label } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
    icon?: any;
    title: string;
    value?: string | any;
    last?: boolean;
    onPress?: () => void;
    showArrow?: boolean;
}

export class ItemNavigate extends Component<Props> {
    render() {
        return (
            <ListItem icon={this.props.icon ? true : false} last={this.props.last} onPress={this.props.onPress}>
                { this.props.icon ? (<Left>{this.props.icon}</Left>) : null }
                <Body><Text>{this.props.title}</Text></Body>
                <Right>
                    {
                        this.props.value === undefined ? null :
                            typeof this.props.value === 'string' ? (<Text>{this.props.value}</Text>) :
                            this.props.value
                    }
                    { this.props.showArrow !== false ? (<Icon style={styles.right_listitem_icon} active name="ios-arrow-forward" />) : null }
                </Right>                
            </ListItem>
        );
    }
}

const styles = EStyleSheet.create({
    right_listitem_icon: {
        fontSize: "6 rem",
        marginLeft: "3 rem"
    }
});
  