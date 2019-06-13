import React, {Component} from 'react';
import {Platform, StatusBar, Image, NativeModules, requireNativeComponent,TouchableOpacity,ScrollView} from 'react-native';
import { Container, Header, View, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Icon, Item, Input, Label, Picker, CardItem, Card, Toast } from 'native-base';
import Device from '../../react-native-device-detection-val';

import {
    EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _, SettingsUserInfo
} from './../../../../helpers/core-packages';

import { makeMainButton } from './../helpers/make-main-button';
import { HeaderContainer } from '../helpers/header-container';
import iStyle from '../../../resources/style/main-style.js'
import { Switch } from 'react-native-switch';
import server from '../../../services/smart-community-server';

interface Props {
    lang?: string;
    userInfo?:SettingsUserInfo;

}
@ConnectObservables({
    lang: lang.getLangObservable(),
    userInfo:Storage.getObservable("settingsUserInfo")

})
export class SettingPage extends Component<Props> {
    
    render() {
        return (
            <HeaderContainer  title={_("w_setting")} children={this.content()} />
        )
    }

    content() {
        return (
         
                   
            <View style={ [iStyle.imgBackground , styles.center ,{ height: 'auto'} ]} >
            
                <View style={ [iStyle.imgBackground , styles.center,{ alignItems: 'flex-start' , height: 'auto'}] } >
                       
                        <Item regular style={[iStyle.no_border,{marginTop:40}]}>
                            <Text style={[styles.item_label,styles.marginLeft]} >{_("s_useaccount")}</Text>
                        </Item>
                       
                       
                        <Item regular style={[iStyle.no_border,{marginBottom:10}, iStyle.settingitemStyle,iStyle.center]}>
                            <Text style={[styles.item_label,{position: 'absolute', left:20}]} >{_("s_accountInfo")}</Text>
                            <Button style={styles.rightBtn} transparent  onPress={() =>Actions.push('accountInfo')}>
                                <Image style={styles.rightImage} source={rcImages.go}/>
                            </Button>
                        </Item>  

                        <Item regular style={[iStyle.no_border,{marginBottom:10}, iStyle.settingitemStyle,iStyle.center]}>
                            <Text style={[styles.item_label,{position: 'absolute', left:20}]} >{_("s_editPassword")}</Text>
                            <Button style={styles.rightBtn}  transparent  onPress={() => Actions.push('editPassword')}>
                                <Image style={styles.rightImage}source={rcImages.go}/>
                            </Button> 
                        </Item>  
                        
                        <Item regular style={[iStyle.no_border,{marginTop:20}]}>
                            <Text style={[styles.item_label,styles.marginLeft]} >{_("s_personinfo")}</Text>
                        </Item>

                        <Item regular style={[iStyle.no_border,{marginBottom:10}, iStyle.settingitemStyle,iStyle.center]}>
                            <Text style={[styles.item_label,{position: 'absolute', left:20}]} >{_("s_personinfoedit")}</Text>
                            <Button style={styles.rightBtn}  transparent  onPress={() => Actions.push('editInfo')} >
                                <Image style={styles.rightImage} source={rcImages.go}/>
                            </Button>
                        </Item>  

                        <Item regular style={[iStyle.no_border,{marginTop:20}]}>
                            <Text style={[styles.item_label,styles.marginLeft]} >{_("s_pushsetting")}</Text>
                        </Item>

                        <Item regular style={[iStyle.no_border,{marginBottom:10}, iStyle.settingitemStyle,iStyle.center]}>
                            <Text style={[styles.item_label,{position: 'absolute', left:20}]} >{_("s_push")}</Text>
                            <Button style={styles.rightBtn}  transparent  >
                                <Switch backgroundActive={'#A0C251'} onValueChange={() => this.changeNoticeSetting()}  value={this.props.userInfo.isNotice} thumbTintColor='black'/>
                            </Button>
                        </Item>  

                        <Item regular style={[iStyle.no_border,{marginBottom:10}, iStyle.settingitemStyle,iStyle.center]}>
                            <TouchableOpacity onPress={() => this.logout() }  >
                                <Text style={[styles.item_label,{color:'red'}]} >{_("s_logout")}</Text>
                            </TouchableOpacity>
                           
                        </Item>  
                      
                </View>
                
            </View>

        
        );
    }
    async logout()
    {
        Actions.push('login')
    }
    async changeNoticeSetting(){
      await Storage.update("settingsUserInfo", "isNotice",!this.props.userInfo.isNotice);
      await this.editPersonInfo();
    }

    async editPersonInfo(){

        await server.U("/user/resident/info", {
            sessionId:this.props.userInfo.sessionId,
            phone: this.props.userInfo.phone,
            lineId: this.props.userInfo.lineId,
            email:this.props.userInfo.email,
            education: this.props.userInfo.education,
            career: this.props.userInfo.career,
            isEmail:this.props.userInfo.isEmail,
            isNotice:this.props.userInfo.isNotice
           
            
        }).catch(err => {
            console.log("err11",err);
        })
    }
}  

const styles = EStyleSheet.create({
    content: {
        backgroundColor: "$bgColor"
    },
    center:{
        alignSelf: 'center', 
        // justifyContent: 'center',
        alignItems: 'center'
    },
    rightBtn:{
        position: 'absolute', 
        right: 30,
        height:'100%'
    },
    rightImage:{
        height: 30,width:30
    },
    row_base: {
        alignSelf: 'center', 
        justifyContent: 'center',
        alignItems: 'center'
    },
    row_1_icon: {
        alignItems: 'flex-end',
        paddingBottom: '10rem'
    },

    row_2_title: {
        alignItems: 'flex-start'
    },
    title: {
        fontFamily: 'FontAwesome',
        fontSize: "18 rem",
        color: 'white'
    },
    version: {
        marginLeft: '5rem',
        color: 'white'
    },

    row_3_form: {
        alignItems: 'flex-start',
        alignSelf: 'center', 
        justifyContent: 'center',
        width:'100%',
    },
    item: {
        margin: "1 rem"
    },
    marginLeft:{
        marginLeft:20
    },
    item_icon: {
        color: "#EEEEFF",
        fontSize: "12 rem"
    },
    item_input: {
        color: "white",
        fontSize: "22 rem"
    },
    form_control_input: {
        textAlign: 'left',
    },
    item_label: {
        color: "$lableColor",
        fontSize: "22 rem"
    },
    item_message:{
        color: "$lableColor",
        fontSize: "16 rem"
    },
    loginText: {
        ...Device.select({
          phone: { fontSize: 19, },
          tablet: { fontSize: 16}
        }),
        color: 'black'
    },
    itemMargin:{
        marginBottom:10,marginTop:10
    },
   
});
  
  