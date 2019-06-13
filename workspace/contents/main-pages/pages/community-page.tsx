import React, {Component} from 'react';
import {Platform, StatusBar, Image, NativeModules, requireNativeComponent} from 'react-native';
import { Container, Header, View, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Icon, Item, Input, Label, Picker, CardItem, Card, Toast } from 'native-base';

import {
    EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _
} from './../../../../helpers/core-packages';

import { makeMainButton } from './../helpers/make-main-button';
import { HeaderContainer } from '../helpers/header-container';
import iStyle from '../../../resources/style/main-style.js'


interface Props {
    lang?: string;
    announcementNotReadCount:number;
    voteNotReadCount:number;
    contactNotReadCount:number;

}   


@ConnectObservables({
    lang: lang.getLangObservable()
})
export class CommunityPage extends Component<Props> {
    render() {
        return (
            <HeaderContainer title={_("w_Community")} children={this.content()} />
        )
    }

    content() {
        return (
            <View style={iStyle.pageMargin} >
                <Item style={[iStyle.no_border ,iStyle.center , iStyle.full]}>
                    { makeMainButton(rcImages.time, _("m_FacilityReservation"),() => Actions.push("reserve")) }
                    { makeMainButton(rcImages.tools, _("m_ItemBorrowing"),() => Actions.push("tool")) }
                </Item>
                <Item style={[iStyle.no_border ,iStyle.center , iStyle.full]}>
                    { makeMainButton(rcImages.att, _("m_CommunityAnnouncement"),() => Actions.push("announcement"),this.props.announcementNotReadCount) }
                    { makeMainButton(rcImages.sche, _("m_CommunityCalendar"), () => Actions.push("calender")) }
                </Item>  
                <Item style={[iStyle.no_border ,iStyle.center , iStyle.full]}>
                    { makeMainButton(rcImages.vote, _("w_Vote"),() => Actions.push("vote") , this.props.voteNotReadCount) }
                    { makeMainButton(rcImages.contact, _("m_ContactManagementCommittee"),() => Actions.push("contact"),this.props.contactNotReadCount) }
                </Item> 
            </View>
        )
    }
}  

const styles = EStyleSheet.create({

    main_grid: {
        marginBottom: "15rem"
    }

});
  