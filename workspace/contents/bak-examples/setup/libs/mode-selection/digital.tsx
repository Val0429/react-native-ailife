import React, {Component, ReactElement} from 'react';
import {Platform, View, Image, TouchableOpacity, StyleProp, ViewStyle} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Container, Header, Title, Segment, Tabs, Tab, TabHeading, Content, ListItem, Switch, Footer, FooterTab, Button, Left, Right, Body, Text, Item, Input, H1, Label } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Actions } from 'react-native-router-flux';
import { rcImages } from './../../../../resources/images';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import { ItemDivider, ItemSwitch, ItemText } from './../../../../../core/components/form';
import { StorageInstance as Storage, SettingsDigital, makeIcon } from './../../../../config';
import lang, { _ } from './../../../../../core/lang';
import { ConnectObservables } from './../../../../../helpers/storage/connect';

interface Props {
    settingsDigital?: SettingsDigital;
}

interface State {

}

@ConnectObservables({
    settingsDigital: Storage.getObservable("settingsDigital"),
    lang: lang.getLangObservable()
})
export class Digital extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {};
    }

    private subject = Storage.getSubject("settingsDigital");
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
            <View>
                {/* General */}
                <ItemDivider title={_("w_General")} />
                <ItemText
                    title={_("w_CompanyName")}
                    { ...Storage.vbind(this, "settingsDigital", "companyName") }
                    icon={makeIcon(IconMaterial, "people")}
                    />

                {/* Location */}
                <ItemDivider title={_("w_MyLocation")} />
                <ItemText
                    title={_("w_Latitude")}
                    { ...Storage.bind(this, "settingsDigital", "latitude") }
                    icon={makeIcon(Icon, "earth")}
                    />
                <ItemText
                    title={_("w_Longitude")}
                    { ...Storage.bind(this, "settingsDigital", "longitude") }
                    icon={makeIcon(Icon, "earth")}
                    />

                {/* Location */}
                <ItemDivider title={_("w_GreetingMessage")} />
                <ItemText
                    title={_("w_Morning")+" (5:00-11:00)"}
                    { ...Storage.bind(this, "settingsDigital", "greetingMorning") }
                    icon={makeIcon(Icon, "message-text")}
                    />
                <ItemText
                    title={_("w_Afternoon")+" (11:00-18:00)"}
                    { ...Storage.bind(this, "settingsDigital", "greetingAfternoon") }
                    icon={makeIcon(Icon, "message-text")}
                    />
                <ItemText
                    title={_("w_Evening")+" (18:00~)"}
                    { ...Storage.bind(this, "settingsDigital", "greetingEvening") }
                    icon={makeIcon(Icon, "message-text")}
                    />

            </View>
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