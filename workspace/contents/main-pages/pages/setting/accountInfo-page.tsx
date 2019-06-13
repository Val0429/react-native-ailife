import React, {Component} from 'react';
import {Platform, StatusBar, Image, NativeModules, requireNativeComponent , ImageBackground} from 'react-native';
import { Container, Header, View, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Icon, Item, Input, Label, Picker, CardItem, Card, Toast } from 'native-base';

import { EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _, SettingsUserInfo } from './../../../../../helpers/core-packages';

import { makeMainButton } from './../../helpers/make-main-button';
import { HeaderContainer } from '../../helpers/header-container';
import iStyle from '../../../../resources/style/main-style.js'
import Device from '../../../../contents/react-native-device-detection-val';


interface Props {
    lang?: string;
    userInfo:SettingsUserInfo;
}

@ConnectObservables({
    lang: lang.getLangObservable(),
    userInfo:Storage.getObservable("settingsUserInfo")}
)
export class AccountInfoPage extends Component<Props> {
    render() {
        return (
            <HeaderContainer backBtn={true} title={_("s_accountInfo")} children={this.content()} />
        )
    }

    content() {
        return (
            <Container  >
                <StatusBar hidden/>
                <Content bounces={false} contentContainerStyle={[{height:'100%'},styles.contentContainerStyle]} scrollEnabled={false}  >
                    
                        <View style={ [iStyle.imgBackground , styles.mainView, iStyle.center,{ alignItems: 'flex-start',justifyContent:'flex-start'}]} >
                            <Item regular style={[iStyle.no_border,{marginTop:40}]}>
                                <Text style={[styles.item_label,styles.marginLeft]} >{_("l_account")} {this.props.userInfo.account} </Text>
                            </Item>
                            <Item regular style={[iStyle.no_border,{marginTop:40}]}>
                                <Text style={[styles.item_label,styles.marginLeft]} >{_("s_barcode")}</Text>
                            </Item>
                            <Image resizeMode="contain"  style={{height:150,width:'100%'}} source={{ uri:this.props.userInfo.barcodeImage }} />

                        </View>   
                       
                
                </Content>
            </Container>
           
           
        )
    }
}  

const styles = EStyleSheet.create({
    mainView:{
        width:'80%'
    },
    main_grid: {
        marginBottom: "15rem"
    },
    border:{
        borderTopWidth:2,
        borderTopColor:'white'
    },
    cancelPadding:{
        padding:0,
        margin:0
    },
    row_base: {
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    row_base2: {
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    temperature:{
        color:'white',
        fontSize : '90 rem',
      
        
    },
    contentContainerStyle:{
        backgroundColor:'rgb(241,243,241)',
    },
    item_label: {
        color: "$lableColor",
        fontSize: "22 rem"
    },

});
  