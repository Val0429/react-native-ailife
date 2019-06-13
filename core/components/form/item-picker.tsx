import React, {Component, ReactElement} from 'react';
import {Platform, View, Image, TouchableOpacity, StyleProp, ViewStyle} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Container, Header, Title, Segment, Tabs, Tab, TabHeading, Content, ListItem, Switch, Footer, FooterTab, Button, Left, Right, Body, Text, Item, Input, H1, Label, Picker } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Actions } from 'react-native-router-flux';

interface Props {
    icon?: any;
    title: string;
    items: any[];
    value?: any;
    labelTransform?: (value: any) => string;
    onValueChange?: (value: any) => void;
    last?: boolean;
}

export class ItemPicker extends Component<Props> {
    render() {
        return (
            <ListItem icon={this.props.icon ? true : false} last={this.props.last}>
                { this.props.icon ? (<Left>{this.props.icon}</Left>) : null }
                <Body>
                    <Item placeholderLabel style={styles.item}>
                        <Label style={styles.item_placeholder}>{this.props.title}</Label>
                        <Picker note mode="dropdown"
                            selectedValue={this.props.value}
                            onValueChange={this.props.onValueChange && this.props.onValueChange.bind(this)}
                            >
                            {
                                this.props.items && this.props.items.map( (item, index) => {
                                    return (
                                        <Picker.Item
                                            key={index}
                                            label={this.props.labelTransform ? this.props.labelTransform(item) : item}
                                            value={item}
                                        />
                                    )
                                })
                            }
                        </Picker>
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
        marginRight: "80rem"
    },
    item_text: {
        textAlign: 'right',
        marginRight: '8 rem',
        borderWidth: 0
    }
});
