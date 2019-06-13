import React, {Component, ReactElement} from 'react';
import {Platform, View, Image, TouchableOpacity, StyleProp, ViewStyle} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Container, Header, Title, Segment, Tabs, Tab, TabHeading, Content, ListItem, Switch, Footer, FooterTab, Button, Left, Right, Body, Text, Item, Input, H1, Label } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Actions } from 'react-native-router-flux';
import { rcImages } from './../../../resources/images';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconOcticons from 'react-native-vector-icons/Octicons';
import { ItemDivider, ItemSwitch, ItemText } from './../../../../core/components/form';
import { StorageInstance as Storage, SettingsDGS, makeIcon } from './../../../config';

interface Props {
    style?: ViewStyle;
}

type States = SettingsDGS;

export class DGS extends Component<Props, States> {
    constructor(props) {
        super(props);
        this.state = {};
    }

    private subject = Storage.getSubject("settingsDGS");
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
        return (
            <Container style={this.props.style}>
                <Header>
                    <Body style={{alignItems: 'center'}}><Title>Demographic Server</Title></Body>
                </Header>

                {/* General */}
                <ItemDivider title="General" />
                <ItemText
                    title="IP"
                    { ...Storage.bind(this, "settingsDGS", "ip") }
                    icon={makeIcon(Icon, "access-point-network")}
                    />

                <ItemText
                    title="Account"
                    { ...Storage.bind(this, "settingsDGS", "account") }
                    icon={makeIcon(Icon, "account")}                    
                    />

                <ItemText
                    title="Password"
                    secureTextEntry={true}
                    { ...Storage.bind(this, "settingsDGS", "password") }
                    icon={makeIcon(Icon, "onepassword")}                    
                    />

                <ItemText
                    title="API Port"
                    { ...Storage.bind(this, "settingsDGS", "apiPort") }
                    icon={makeIcon(Icon, "folder-network")}                    
                    />

            </Container>
        );
    }
}  

const styles = EStyleSheet.create({
    listitem_icon: {
        color: "white",
        fontSize: "7 rem"
    },
    listitem_icon_channel: {
        fontSize: "5.5 rem"
    },
});