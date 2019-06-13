import React, {Component} from 'react';
import {Platform, StatusBar, View, ImageBackground,TouchableOpacity , Image ,Alert ,PushNotificationIOS } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Text, Item, Input,ListItem } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Actions } from 'react-native-router-flux';
import { rcImages } from './../../resources/images';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ConnectObservables } from './../../../helpers/storage/connect';
import { StorageInstance as Storage ,SettingsUserInfo ,ReadedItem,ReadedCount } from './../../config';
import lang, { _ } from './../../../core/lang';
import iStyle from '../../resources/style/main-style.js'
import Device from '../react-native-device-detection-val';
import server from '../../services/smart-community-server';
import { registerKilledListener, registerAppListener } from "../../fcm/Listeners";
import FCM from "react-native-fcm";
let packageJson = require('./../../../package.json');


interface Props {
    lang: string;
    userInfo:SettingsUserInfo;
    readedCount:ReadedCount
}

@ConnectObservables({
    lang: lang.getLangObservable(),
    userInfo:Storage.getObservable("settingsUserInfo"),
    readedCount:Storage.getObservable('readedCount'),
})
export class LoginContent extends Component<Props> {
    token = "";
    constructor(props) {
        super(props);
       // Storage.update("settingsServerInfo", "url", "http://172.16.10.192:4040/");
    }

    componentDidMount() {
        this.getToken();
        ////////////////////////////////////////////
    }
    async initReadStatus()
    {
        if (!this.getAccountReadSatus(this.props.userInfo.account))
        {
            let _test:ReadedItem={  
                managerReadedCount: 0,
                packageReadedCount: 0,
                mailReadedCount: 0,
                returnReadedCount: 0,
                vistorReadedCount: 0,
                gasReadedCount: 0,
                voteReadedCount: 0,
                contactReadedCount: 0,
                announcmentReadedCount : 0,
                updataStatus : false,
                account: this.props.userInfo.account
            }
            this.props.readedCount.totalReadedCount.push(_test);
            await Storage.update("readedCount", "totalReadedCount", this.props.readedCount.totalReadedCount);
        }
       
    }
    getAccountReadSatus(account){
        for (let index = 0; index < this.props.readedCount.totalReadedCount.length; index++) {
            const element = this.props.readedCount.totalReadedCount[index];
            if (element.account==account)
            {
                console.log('element',element)
                return true;
            }
            
        }
        return false
    }
    async login()
    {
        let ret:any= await server.C("/user/resident/login", {
            account: this.props.userInfo.account,
            password: this.props.userInfo.password,
        }).catch(err => {
            console.log('err',err)
            Alert.alert(_("a_title"),_("a_loginError"))
        })
       
        if (ret!=undefined)
        { 
            let jsonRet =JSON.parse(ret);
            
            Storage.update("settingsUserInfo", "sessionId", jsonRet.sessionId);
            if (this.props.userInfo.residentId!=jsonRet.residentId)
            {
                this.updateUserInfo(jsonRet);
            }
          

            if (jsonRet.deviceToken != this.token)
            {
              await this.updateToken();
            }
           
            await this.initReadStatus();
            Actions.push("main");
        }
      
    }
    updateUserInfo(jsonRet)
    {
        Storage.update("settingsUserInfo", "residentId", jsonRet.residentId);
        Storage.update("settingsUserInfo", "userId", jsonRet.userId);
        Storage.update("settingsUserInfo", "barcodeImage", jsonRet.barcode);
        Storage.update("settingsUserInfo", "email", jsonRet.email);
        Storage.update("settingsUserInfo", "name", jsonRet.name);
        Storage.update("settingsUserInfo", "gender", jsonRet.gender);
        Storage.update("settingsUserInfo", "birthday", jsonRet.birthday);
        Storage.update("settingsUserInfo", "phone", jsonRet.phone);
        Storage.update("settingsUserInfo", "lineId", jsonRet.lineId);
        Storage.update("settingsUserInfo", "isNotice", jsonRet.isNotice);
    }
    async getToken(){
        if (Platform.OS=="android")
        {
            await FCM.requestPermissions();
            let token=  await FCM.getFCMToken();
            console.log('token',token);
            this.token= token;
        }else {

            await PushNotificationIOS.requestPermissions();
            console.log('getToken3');

            await PushNotificationIOS.addEventListener('register', (token) => {
                console.log('token',token);
                this.token= token;
              });
           
        }
      


    }
    render() {

        return (
            <Container>
                <StatusBar hidden />
                    <Content bounces={false} contentContainerStyle={{flex: 1}} style={styles.content}>
                        <ImageBackground style={ iStyle.imgBackground } 
                            resizeMode='cover' 
                            source={rcImages.backgroundImage} >
                            <View style={ [iStyle.imgBackground ,styles.row_base, styles.center,{height:'auto',flex:1}] } >
                                <Image style={{height: "70%",marginTop:50}} resizeMode="contain" source={rcImages.icon} />
                            </View>
                            <View style={ [iStyle.imgBackground , iStyle.center,{flex:2}]} >
                            
                                <Item regular style={[iStyle.no_border,{marginBottom:10}, iStyle.itemStyle]}>
                                    <Input
                                        placeholder={_("l_account")}
                                        style={[styles.form_control_input, styles.loginText]}
                                        autoCapitalize='none'
                                        onChangeText={(val) => Storage.update("settingsUserInfo", "account", val) }
                                        value= {this.props.userInfo.account} />
                                </Item>
                                <Item regular style={[iStyle.no_border,{marginBottom:5}, iStyle.itemStyle]}>
                                    <Input
                                        placeholder={_("l_password")}
                                        style={[styles.form_control_input, styles.loginText]}
                                        autoCapitalize='none'
                                        secureTextEntry={true}
                                        onChangeText={(val) => Storage.update("settingsUserInfo", "password", val) }
                                        value={this.props.userInfo.password} />
                                </Item>
                                
                                <ListItem  style={[iStyle.no_border,{ backgroundColor:"transparent" }]}>
                              
                                    {/* <CheckBox
                                        color={'white'}
                                        style={[{backgroundColor:'white'}]}
                                        checked={this.props.userInfo.remeberPassword} 
                                        onPress={()=>{
                                            Storage.update("settingsUserInfo", "remeberPassword", !this.props.userInfo.remeberPassword)
                                        }}
                                    />     */}
                                    
                                    {/* <Text style={[styles.loginText,{color:'white'}]}>{_("l_remeber")}</Text> */}
                                </ListItem>

                                <Item regular style={[iStyle.no_border]}>
                                    <Button style={iStyle.item_button} primary full  onPress={() => this.login() }>
                                        <Text style={styles.item_input}>{_("l_login")}</Text>
                                    </Button> 
                                </Item>

                                <ListItem  style={[iStyle.no_border,{ backgroundColor:"transparent" }]}> 
                                    <Text style={[styles.loginText,{color:'white'}]}>{_("l_nothave")}</Text>
                                    <TouchableOpacity onPress={() => Actions.push('first')} >
                                        <Text style={[styles.loginText, { textDecorationLine: 'underline',color:'white' }]}>{_("l_first")}</Text>
                                    </TouchableOpacity>
                                </ListItem>

                                <Text style={[styles.loginText,{color:'white'}]}>{_("version")}:{packageJson.version}</Text>

                                
                            </View>

                          
                        </ImageBackground>
                       
                    </Content>
               
                    
                  
               
            </Container>
        );
    }
    async updateToken(){
        console.log("updateToken");
        await server.U("/user/resident/device", {
            sessionId:this.props.userInfo.sessionId,
            deviceToken:this.token,
            deviceType :Platform.OS
            
        }).catch(err => {
            console.log("err11",err);
        })
    }
    
}  

const styles = EStyleSheet.create({
    content: {
        backgroundColor: "$bgColor"
    },
    
    row_base: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    row_1_icon: {
        alignItems: 'flex-end',
        paddingBottom: '10 rem'
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
    item_icon: {
        color: "#EEEEFF",
        fontSize: "12 rem"
    },
    item_input: {
        color: "white",
        fontSize: "22 rem"
    },
    form_control_input: {
        color: 'red',
        textAlign: 'left',
    },
    loginText: {
        ...Device.select({
          phone: { fontSize: 19, },
          tablet: { fontSize: 18}
        }),
        color: 'black'
    }
   
  });
  