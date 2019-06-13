import React, {Component} from 'react';
import {Platform, StatusBar, Image, NativeModules, requireNativeComponent , ImageBackground, Alert} from 'react-native';
import { Container, Header, View, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Icon, Item, Input, Label, Picker, CardItem, Card, Toast } from 'native-base';

import { EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _, SettingsUserInfo } from './../../../../../helpers/core-packages';

import { makeMainButton } from './../../helpers/make-main-button';
import { HeaderContainer } from '../../helpers/header-container';
import iStyle from '../../../../resources/style/main-style.js'
import Device from '../../../../contents/react-native-device-detection-val';

import server from '../../../../services/smart-community-server';

interface Props {
    lang?: string;
    userInfo:SettingsUserInfo;
    oldPassword:string
}

@ConnectObservables({
    lang: lang.getLangObservable(),
    userInfo:Storage.getObservable("settingsUserInfo")}
)
export class EditPasswordPage extends Component<Props> {
    render() {
        return (
            <HeaderContainer backBtn={true} title={_("s_editPassword")} children={this.content()} />
        )
    }
    constructor(props) {
        super(props);
       
        this.state = {
            oldPassword: "",
            newPassword:"",
            newPasswordCheck:""
        }
        //this.props.dgs.account
    }
    async editPassword(){
     
        if (this.state.oldPassword!=this.props.userInfo.password || this.state.newPassword=="" ||
            this.state.newPasswordCheck!=this.state.newPassword)
        {
            Alert.alert(_("a_title"),_("a_passwordNotMatch"))
            return;
        }

        let ret= await server.U("/user/base/password", {
            sessionId: this.props.userInfo.sessionId,
            previous: this.props.userInfo.password,
            current: this.state.newPassword
        }).catch(err => {
            console.log("err11",err);
            Alert.alert(_("a_title"),_("a_editPasswordError"))
        })
        if (ret!=undefined)
        { console.log("ret",ret);
            await this.getNewSession();
            Alert.alert(_("a_editSucess"),_("a_editSucess"))
            Actions.pop();
        }

     
    }

    content() {
        return (
            <Container  >
                <StatusBar hidden/>
                <Content bounces={false} contentContainerStyle={[{height:'100%'},styles.contentContainerStyle]} scrollEnabled={false}  >
                    
                        <View style={ [iStyle.imgBackground , styles.mainView, iStyle.center,{ alignItems: 'flex-start',justifyContent:'flex-start'}]} >
                            <Item regular style={[iStyle.no_border,{marginBottom:10}, iStyle.settingitemStyle]}>
                                <Input
                                    placeholder={_("s_inpuOldwPassword")}
                                    style={[styles.form_control_input, styles.loginText,styles.marginLeft]}
                                    autoCapitalize='none'
                                    secureTextEntry={true}
                                    onChangeText={(val) =>   this.setState({ oldPassword: val}) }
                                    value= {this.state.oldPassword} 
                                    />                     
                            </Item>  
                            <Item regular style={[iStyle.no_border,{marginBottom:10}, iStyle.settingitemStyle]}>
                                <Input
                                    placeholder={_("s_inpuNewwPassword")}
                                    style={[styles.form_control_input, styles.loginText,styles.marginLeft]}
                                    autoCapitalize='none'
                                    secureTextEntry={true}
                                    onChangeText={(val) =>   this.setState({ newPassword: val}) }
                                    value= {this.state.newPassword} 
                                    />                     
                            </Item>  
                            <Item regular style={[iStyle.no_border,{marginBottom:10}, iStyle.settingitemStyle]}>
                                <Input
                                    placeholder={_("s_inpuNewwPasswordCheck")}
                                    style={[styles.form_control_input, styles.loginText,styles.marginLeft]}
                                    autoCapitalize='none'
                                    secureTextEntry={true}
                                    onChangeText={(val) =>   this.setState({ newPasswordCheck: val}) }
                                    value= {this.state.newPasswordCheck} 
                                    />                     
                            </Item>  
                            <Item regular style={[iStyle.no_border]}>
                                <View style={ [iStyle.imgBackground ,styles.row_base, styles.center,{backgroundColor:'rgb(241,243,241)',height:'auto'}] } >
                                    <Item  style={[iStyle.no_border,styles.itemMargin]}>
                                        <Button style={iStyle.item_button} full onPress={() =>this.editPassword()}>
                                            <Text style={styles.item_input}>{_("s_editPassword")}</Text>
                                         </Button>   
                                            </Item>
                                        </View>    
                             </Item>
                        </View>   
                       
                
                </Content>
            </Container>
           
           
        )
    }


    async getNewSession()
    {
        let ret:any= await server.C("/user/resident/login", {
            account: this.props.userInfo.account,
            password: this.state.newPassword,
        }).catch(err => {
            Alert.alert(_("a_title"),_("a_loginError"))
        })
       
        if (ret!=undefined)
        { 
            let jsonRet =JSON.parse(ret);
            Storage.update("settingsUserInfo", "sessionId", jsonRet.sessionId);
            Storage.update("settingsUserInfo", "password", this.state.newPassword);

        }
      
    }
}  

const styles = EStyleSheet.create({
    mainView:{
        width:'100%'
    },
    form_control_input: {
        textAlign: 'left',
    },
    contentContainerStyle:{
        backgroundColor:'rgb(241,243,241)',
    },
    item_label: {
        color: "$lableColor",
        fontSize: "22 rem"
    },
    loginText: {
        ...Device.select({
          phone: { fontSize: 19, },
          tablet: { fontSize: 13}
        }),
        color: 'black'
    },
    itemMargin:{
        marginTop:25
    },
    item_input: {
        color: "white",
        fontSize: "22 rem"
    },
});
  