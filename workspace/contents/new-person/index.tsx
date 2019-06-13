import React, {Component} from 'react';
import {Platform, StatusBar, View, ImageBackground,ScrollView,Alert,PushNotificationIOS ,Keyboard, TextInput} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Container, Content, Button,Text, Item, Input,Picker} from 'native-base';
import { Actions } from 'react-native-router-flux';
import { rcImages } from './../../resources/images';
import { ConnectObservables } from './../../../helpers/storage/connect';
import { StorageInstance as Storage , SettingsUserInfo , ReadedItem ,ReadedCount} from './../../config';
import lang, { _ } from './../../../core/lang';
import iStyle from '../../resources/style/main-style.js'
import Device from '../react-native-device-detection-val';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import DatePicker from 'react-native-datepicker'
import server from '../../services/smart-community-server';
import FCM from "react-native-fcm";


var radio_props = [
    {label: '男  ', value: 0 },
    {label: '女  ', value: 1 }
];
var EducationList=[
    "博士","碩士","大學","專科","高中","國中","國小"
]
var CareerList=[
    "軍公教","文教業","服務業","電子","貿易","銀行","交通運輸","餐飲",
    "建築工程","農漁牧業","製造業","醫療衛生","娛樂業","自營商","運動員","學生","家庭主婦"
]
  interface Props {
    lang : string;
    userInfo : SettingsUserInfo;
    checkEmailFotmate : boolean;
    readedCount:ReadedCount
  
}
interface State {
    checkEmailFotmate: boolean;
    account : string;
    password : string;
    checkPassword:string;
    barcode : string;
    name : string;
    gender : number;
    birthday : string;
    phone : string;
    lineId : string;
    email : string;
    education : string;
    career : string;
    showkeyBoard:boolean

}
@ConnectObservables({
    lang: lang.getLangObservable(),
    userInfo:Storage.getObservable("settingsUserInfo"),
    readedCount:Storage.getObservable('readedCount'),
})

export class NewPersonContent extends Component<Props ,State> {
    token = "";
    keyrdDidShowListener = null;
    keyboardDidHideListener = null;
    scrollView  = null;
    constructor(props) {
        super(props);
       
        this.state = {
            checkEmailFotmate: false,
            account : "",
            password : "",
            checkPassword: "",
            barcode : "",
            name : "",
            gender : 0,
            birthday : "1980/01/01",
            phone : "",
            lineId : "",
            email : "",
            education : "國小",
            career : "軍公教",
            showkeyBoard:false
        }
        //this.props.dgs.account
    }

    componentDidMount() {
        this.keyrdDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
          );
          this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide,
          );
        this.getToken();
    }
    componentWillUnmount(){
        this.keyrdDidShowListener.remove();
        this.keyboardDidHideListener.remove();
      }
    _keyboardDidShow=()=> {
      this.setState({showkeyBoard:true})
    }
    
    _keyboardDidHide=()=> {
        this.setState({showkeyBoard:false})
    }

    onPhoneInputChanged(text){
        let newText = '';
        let numbers = '0123456789';
    
        for (var i=0; i < text.length; i++) {
            if(numbers.indexOf(text[i]) > -1 ) {
                newText = newText + text[i];
            }
            else {
                // your call back function
               // alert("please enter numbers only");
            }
        }
        // Storage.update("settingsUserInfo", "phone", newText)
        this.setState({ phone:newText})
    }

    onEmailInputChanged(text){
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;
        this.setState({checkEmailFotmate: !reg.test(text) ,email:text}) 
    }
    async getToken(){
        console.log('getToken1');
        if (Platform.OS=="android")
        {
            await FCM.requestPermissions();
            let token=  await FCM.getFCMToken();
            console.log('token',token);
            this.token= token;
        }else {
            console.log('getToken2');

            await PushNotificationIOS.requestPermissions();
            console.log('getToken3');

            await PushNotificationIOS.addEventListener('register', (token) => {
                console.log('token',token);
                this.token= token;
              });
           
        }
      


    }

    async createNewPerson(){
        if (this.state.checkPassword!=this.state.password)
        {
           Alert.alert(_("a_title"),_("a_passwordNotMatch"));
           return
        }
        console.log('this.state.gender' ,this.state.gender)
        let OS = Platform.OS;
        let ret:any= await server.C("/user/resident/info", {
            account: this.state.account,
            password: this.state.password,
            barcode: this.props.userInfo.residentId,
            name: this.state.name,
            gender: this.state.gender,
            birthday: this.state.birthday,
            phone: this.state.phone,
            lineId: this.state.lineId,
            email:this.state.email,
            education: this.state.education,
            career: this.props.userInfo.career,
            deviceToken:this.token,
            deviceType :OS

        }) .catch(err => {
            if (err.body.indexOf("exists")>-1)
            {
                Alert.alert(_("a_title"),"帳號重複")
            }else{
                Alert.alert(_("a_title"),_("a_error"))
            }
           
        })
        console.log('resident ret',ret)
        if (ret!=undefined)
        {
           await this.login();
            //this.initReadStatus();
            // Actions.push("main");
        }
    }

    async login()
    {
        let ret:any= await server.C("/user/resident/login", {
            account: this.state.account,
            password: this.state.password,
        }).catch(err => {
            Alert.alert(_("a_title"),_("a_loginError"))
        })
       
        if (ret!=undefined)
        { 
            let jsonRet =JSON.parse(ret);
            Storage.update("settingsUserInfo", "sessionId", jsonRet.sessionId);
            this.updateUserInfo(jsonRet);
            if (jsonRet.deviceToken != this.token)
            {
              await this.updateToken();
            }
           
            await this.initReadStatus();
            Actions.push("main");
        }
      
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
        Storage.update("settingsUserInfo", "account", this.state.account,);
    }
    async initReadStatus()
    {
        if (!this.getAccountReadSatus(this.state.account))
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
    scrollToBottom(){
        console.log('scrollToBottom');
        this.scrollView.scrollTo({ y: 1000000 })
    }


    render() {

        return (
            <Container>
                <StatusBar hidden />
                    <Content bounces={false} scrollEnabled={false} contentContainerStyle={{flex: 1}} style={[styles.content]}>
                        <ImageBackground style={ iStyle.imgBackground } 
                            resizeMode='cover' 
                            source={rcImages.backgroundImage} >
                            <ScrollView keyboardDismissMode='on-drag' ref={ (ref) => this.scrollView = ref }>
                                <View style={ [iStyle.imgBackground , styles.center,{minHeight:'100%'}]} >
                                    <Item regular style={[iStyle.no_border,styles.marginTop,{marginBottom:10}]}>
                                        <Text style={styles.item_input} >{_("s_title")}</Text>
                                    </Item>
                                    <View style={ [iStyle.imgBackground , styles.center,iStyle.viewBackgorundColor,{ alignItems: 'flex-start'}] } >
                                            <Item regular style={[iStyle.no_border,styles.marginTop]}>
                                                <Text style={[styles.item_label,styles.marginLeft]} >{_("s_info")}</Text>
                                            </Item>
                                            <Item regular style={[iStyle.no_border, iStyle.settingitemStyle]}>
                                                <Input
                                                    placeholder={_("s_name")}
                                                    style={[styles.form_control_input, styles.loginText,styles.marginLeft]}
                                                    autoCapitalize='none'
                                                    onChangeText={(val) =>  this.setState({ name:val})  }
                                                    value= {this.state.name} />
                                            </Item>  
                                            <Item regular style={[iStyle.no_border,styles.itemMargin]}>
                                                <RadioForm style={styles.marginLeft}
                                                    radio_props={radio_props}
                                                    initial={this.state.gender}
                                                    buttonColor={'#6F6F72'}
                                                    selectedButtonColor = {'#6F6F72'}
                                                    formHorizontal={true}
                                                    animation={false}
                                                    labelStyle={{fontSize: 20, color: '#6F6F72'}}
                                                    onPress={(val) =>   this.setState({ gender:val}) }
                                                />     
                                            </Item>
                                        
                                            <Item regular style={[iStyle.no_border,styles.itemMargin]}>
                                                <Text style={[styles.item_label,styles.marginLeft]} >{_("s_birthday")}</Text>
                                                <DatePicker
                                                    style={{width: 200}}
                                                    date={this.state.birthday}
                                                    mode="date"
                                                    placeholder="select date"
                                                    format="YYYY-MM-DD"
                                                    minDate="1920-01-01"
                                                    maxDate="2016-12-01"
                                                    confirmBtnText="Confirm"
                                                    cancelBtnText="Cancel"
                                                    customStyles={{
                                                    dateIcon: {
                                                        height:0,
                                                    },
                                                    dateInput: {
                                                        marginLeft: 36
                                                    }
                                                    // ... You can check the source to find the other keys.
                                                    }}
                                                    onDateChange={(date) =>  this.setState({ birthday:date})  }
                                                /> 
                                            </Item>
                                            <Item regular style={[iStyle.no_border,styles.itemMargin]}>
                                                <Text style={[styles.item_message,styles.marginLeft,{color:'red'}]} >*</Text>
                                                <Text style={[styles.item_message]} >{_("s_message")}</Text>
                                            </Item>
                                            
                                            <Item regular style={[iStyle.no_border,styles.marginTop]}>
                                                <Text style={[styles.item_label,styles.marginLeft]} >{_("s_contact")}</Text>
                                            </Item>
                                            <Item regular style={[iStyle.no_border, iStyle.settingitemStyle]}>
                                                <Input
                                                    placeholder={_("s_phone")}
                                                    style={[styles.form_control_input, styles.loginText,styles.marginLeft]}
                                                    autoCapitalize='none'
                                                    keyboardType='numeric'
                                                    onChangeText={(val) =>  this.onPhoneInputChanged(val)  }
                                                    value={this.state.phone} />
                                            </Item>  
                                            <Item regular style={[iStyle.no_border, iStyle.settingitemStyle]}>
                                                <Input
                                                    placeholder={_("s_line")}
                                                    style={[styles.form_control_input, styles.loginText,styles.marginLeft]}
                                                    autoCapitalize='none'
                                                    keyboardType='email-address'
                                                    onChangeText={(val) =>  this.setState({ lineId:val}) }
                                                    value={this.state.lineId}  />
                                            </Item>  

                                            <Item regular style={[iStyle.no_border, iStyle.settingitemStyle]}>
                                                <Input
                                                    placeholder={_("s_email")}
                                                    style={[styles.form_control_input, styles.loginText,styles.marginLeft,this.state.checkEmailFotmate && {color:'red'} ]}
                                                    autoCapitalize='none'
                                                    onChangeText={(val) =>   this.onEmailInputChanged(val) }
                                                    value={this.state.email}  />
                                            </Item>  

                                            <Item regular style={[iStyle.no_border,styles.marginTop]}>
                                                <Text style={[styles.item_label,styles.marginLeft]} >{_("s_education")}</Text>
                                            </Item>
                                            <Item regular style={[iStyle.no_border, iStyle.settingitemStyle]}>
                                                <Picker
                                                note
                                                mode="dropdown"
                                                style={styles.pickerText}
                                                selectedValue={this.state.education}
                                                onValueChange={(val) => {
                                                    // lang.setLang(value);
                                                    this.setState({ education:val})
                                                }}>
                                                { 
                                                    (() => {
                                                        return Object.keys(EducationList).map( (key) => {
                                                            return <Picker.Item key={key} label={EducationList[key]} value={EducationList[key]} />
                                                        })
                                                    })()
                                                }
                                                </Picker>
                                            </Item>  
                                            
                                            <Item regular style={[iStyle.no_border,styles.marginTop]}>
                                                <Text style={[styles.item_label,styles.marginLeft]} >{_("s_job")}</Text>
                                            </Item>
                                            <Item regular style={[iStyle.no_border, iStyle.settingitemStyle]}>
                                                <Picker
                                                note
                                                mode="dropdown"
                                                style={styles.pickerText}
                                                selectedValue={this.state.career}
                                                onValueChange={(val) => {
                                                    this.setState({ career:val})
                                                }}>
                                                { 
                                                    (() => {
                                                        return Object.keys(CareerList).map( (key) => {
                                                            return <Picker.Item key={key} label={CareerList[key]} value={CareerList[key]} />
                                                        })
                                                    })()
                                                }
                                                </Picker>
                                            </Item> 
                                            
                                            <Item regular style={[iStyle.no_border,styles.marginTop]}>
                                                <Text style={[styles.item_label,styles.marginLeft]} >{_("s_setting")}</Text>
                                            </Item>
                                            <Item regular style={[iStyle.no_border, iStyle.settingitemStyle]}>
                                                <Input
                                            
                                                    placeholder={_("s_account")}
                                                    style={[styles.form_control_input, styles.loginText,styles.marginLeft]}
                                                    autoCapitalize='none'
                                                    onChangeText={(val) =>  this.setState({ account:val})  }
                                                    value={this.state.account}  />
                                            </Item>  
                                            <Item regular style={[iStyle.no_border, iStyle.settingitemStyle]}>
                                                <Input
                                                    placeholder={_("s_password")}
                                                    style={[styles.form_control_input, styles.loginText,styles.marginLeft]}
                                                    autoCapitalize='none'
                                                    secureTextEntry={true}
                                                    onChangeText={(val) => this.setState({ password:val})  }
                                                    value={this.state.password}  />
                                            </Item>  
                                        
                                            <Item regular style={[iStyle.no_border, iStyle.settingitemStyle]}>
                                                <Input
                                                   // onFocus ={ ()=> this.scrollToBottom() }
                                                    placeholder={_("s_passwords")}
                                                    style={[styles.form_control_input, styles.loginText,styles.marginLeft]}
                                                    autoCapitalize='none'
                                                    secureTextEntry={true}
                                                    onChangeText={(val) =>  this.setState({ checkPassword:val}) }
                                                    />
                                            </Item>  
                                            <Item regular style={[iStyle.no_border,iStyle.center,styles.marginTop,{widt:'100%',marginBottom:10} ]}>
                                                <Button style={iStyle.item_button} full onPress={() =>this.createNewPerson()}>
                                                    <Text style={styles.item_input}>{_("s_createAccount")}</Text>
                                                </Button>          
                                            </Item>
                                       
                                        </View>

                                    
                            
                                </View>
    
                            </ScrollView>
                          
                        </ImageBackground>
                       
                    </Content>
            </Container>
        );
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
    row_base: {
        alignSelf: 'center', 
        justifyContent: 'center',
        alignItems: 'center'
    },
    row_1_icon: {
        alignItems: 'flex-end',
        paddingBottom: '10rem'
    },
    pickerText:{
        color: 'black',
        marginLeft:20,
        height: Platform.OS === "android" ? 40 : 45
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
    marginTop:{
        marginTop:10
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
        fontSize: "18 rem"
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
          tablet: { fontSize: 15}
        }),
        color: 'black'
    },
    itemMargin:{
        marginBottom:10,marginTop:10
    }
  
   
});
  