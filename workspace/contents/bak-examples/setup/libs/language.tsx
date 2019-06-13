import React, {Component, ReactElement} from 'react';
import {Platform, View, Image, TouchableOpacity, StyleProp, ViewStyle} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Container, Header, Title, Segment, Tabs, Tab, TabHeading, Content, ListItem, Switch, Footer, FooterTab, Button, Left, Right, Body, Text, Item, Input, H1, Label } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Actions } from 'react-native-router-flux';
import { rcImages } from './../../../resources/images';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconEntypo from 'react-native-vector-icons/Entypo';
import { ItemDivider, ItemSwitch, ItemText, ItemPicker } from './../../../../core/components/form';
import { StorageInstance as Storage, SettingsFRS, makeIcon, SettingsLanguage } from './../../../config';
import { ConnectObservables } from './../../../../helpers/storage/connect';
import lang, { _ } from './../../../../core/lang';

interface Props {
    style?: ViewStyle;
    settingsLanguage?: SettingsLanguage;
}

interface State {

}

@ConnectObservables({
    settingsLanguage: Storage.getObservable("settingsLanguage"),
    lang: lang.getLangObservable()
})
export class Language extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {};
    }

//     <Picker
//     note
//     mode="dropdown"
//     style={{width: 200, height: 40, color: 'black'}}
//     selectedValue={this.props.lang}
//     onValueChange={(value) => lang.setLang(value)}
//     >
//     { 
//         (() => {
//             let list = lang.list();
//             return Object.keys(list).map( (key) => {
//                 return <Picker.Item key={key} label={list[key]} value={key} />
//             })
//         })()
//     }
// </Picker>


    render() {
        return (
            <Container style={this.props.style}>
                <Header>
                    <Body style={{alignItems: 'center'}}><Title>{_("w_Language")}</Title></Body>
                </Header>

                {/* General */}
                <ItemDivider title={_("w_General")} />

                <ItemPicker
                    title={_("w_Language")}
                    value={this.props.settingsLanguage.lang}
                    items={ Object.keys(lang.list()) }
                    onValueChange={(value) => {
                        Storage.update("settingsLanguage", "lang", value);
                        lang.setLang(value);
                    }}
                    labelTransform={ (value) => lang.list()[value] }
                    icon={makeIcon(IconEntypo, "language")}
                    />

                {/* <ItemText
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
                    /> */}

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