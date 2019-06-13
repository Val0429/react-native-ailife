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
import { StorageInstance as Storage, SettingsFRS, makeIcon } from './../../../config';
import { ConnectObservables } from './../../../../helpers/storage/connect';
import lang, { _ } from './../../../../core/lang';

interface Props {
    style?: ViewStyle;
}

type States = SettingsFRS;

@ConnectObservables({
    settingsFRS: Storage.getObservable("settingsFRS"),
    lang: lang.getLangObservable()
})
export class FRS extends Component<Props, States> {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Container style={this.props.style}>
                <Header>
                    <Body style={{alignItems: 'center'}}><Title>FRS</Title></Body>
                </Header>

                {/* General */}
                <ItemDivider title={_("w_General")} />
                <ItemText
                    title={_("w_Ip")}
                    { ...Storage.vbind(this, "settingsFRS", "ip") }
                    icon={makeIcon(Icon, "access-point-network")}                    
                    />

                <ItemText
                    title={_("w_Account")}
                    { ...Storage.vbind(this, "settingsFRS", "account") }
                    icon={makeIcon(Icon, "account")}                    
                    
                    />

                <ItemText
                    title={_("w_Password")}
                    secureTextEntry={true}
                    { ...Storage.vbind(this, "settingsFRS", "password") }
                    icon={makeIcon(Icon, "onepassword")}                    
                    
                    />

                <ItemText
                    title={_("w_APIPort")}
                    { ...Storage.vbind(this, "settingsFRS", "apiPort") }
                    icon={makeIcon(Icon, "folder-network")}                    
                    />

                <ItemText
                    title={_("w_SocketPort")}
                    { ...Storage.vbind(this, "settingsFRS", "socketPort") }
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