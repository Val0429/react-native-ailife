import React, {Component} from 'react';
import {Platform, StatusBar, Image, NativeModules, requireNativeComponent,ImageBackground, Dimensions} from 'react-native';
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
    managerNotReadCount:number,
    mailNotReadCount:number,
}

@ConnectObservables({
    lang: lang.getLangObservable()
})
export class CommonPage extends Component<Props> {
    
    render() {
        return (
            <HeaderContainer  title={_("w_Common")} children={this.content()} />
        )
    }

    content() {
        return (
           
            <View style={iStyle.pageMargin}>
                 <Item style={[iStyle.no_border ,iStyle.center , iStyle.full]}>
                 { makeMainButton(rcImages.package, _("m_DepositItem"), () => Actions.push("package")) }

                    {/* { makeMainButton(rcImages.email, _("w_Mail"), () => Actions.push("mail")) } */}
                    { makeMainButton(rcImages.barCode, _("s_accountInfo"), () => Actions.push("accountInfo")) }

                    {/* { makeMainButton(rcImages.sche, _("m_CommunityCalendar"), () => Actions.push("calender")) } */}
                 </Item>
                 
                 <Item style={[iStyle.no_border ,iStyle.center , iStyle.full]}>
                    { makeMainButton(rcImages.time, _("m_FacilityReservation"),() => Actions.push("reserve")) }
                     { makeMainButton(rcImages.att, _("m_CommunityAnnouncement"),() => Actions.push("announcement") ,this.props.announcementNotReadCount) }
                 </Item>
                 {/* <Item style={[iStyle.no_border ,iStyle.center , iStyle.full]}>
                    <View style={styles.whitebtn}></View>
                 </Item> */}

                 <Item style={[iStyle.no_border ,iStyle.center , iStyle.full]}>
                    { makeMainButton(rcImages.email, _("w_Mail"), () => Actions.push("mail") ,this.props.mailNotReadCount) }
                    { makeMainButton(rcImages.money, _("r_manage"), () => Actions.push("manage") ,this.props.managerNotReadCount) }
                 </Item>

                 


               
           
            </View>            
        
        
        );
    }
}  

const styles = EStyleSheet.create({

    main_grid: {
        marginBottom: "15rem"
    },
    whitebtn:{
        width: Dimensions.get('window').height/5,
        margin:'13rem'
    }
});
  