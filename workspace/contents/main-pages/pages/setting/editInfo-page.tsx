import React, {Component} from 'react';
import {Platform, StatusBar, Image, NativeModules, requireNativeComponent , ImageBackground, Alert, ScrollView} from 'react-native';
import { Container, Content, Button,Text, Item, Input,Picker, View} from 'native-base';

import { EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _, SettingsUserInfo } from './../../../../../helpers/core-packages';

import { makeMainButton } from './../../helpers/make-main-button';
import { HeaderContainer } from '../../helpers/header-container';
import iStyle from '../../../../resources/style/main-style.js'
import Device from '../../../../contents/react-native-device-detection-val';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import DatePicker from 'react-native-datepicker'
import server from '../../../../services/smart-community-server';
import moment from 'moment';
import { Gender } from "../../../../enums"

interface Props {
    lang?: string;
    userInfo:SettingsUserInfo;
    oldPassword:string
}
interface State {
    phone?: string,
    lineId?:string,
    email?:string,
    education?:string,
    career?:string
}
var EducationList=[
    "博士","碩士","大學","專科","高中","國中","國小"
]
var CareerList=[
    "軍公教","文教業","服務業","電子","貿易","銀行","交通運輸","餐飲",
    "建築工程","農漁牧業","製造業","醫療衛生","娛樂業","自營商","運動員","學生","家庭主婦"
]
@ConnectObservables({
    lang: lang.getLangObservable(),
    userInfo:Storage.getObservable("settingsUserInfo")}
)
export class EditInfoPage extends Component<Props,State> {
    first =false;
    state = {
        phone: "",
        lineId:"",
        email:"",
        education:"",
        career:""
    }
    render() {
        return (
            <HeaderContainer notSroll={true} backBtn={true} title={_("s_personinfoedit")} children={this.content()} />
        )
    }
    constructor(props) {
        super(props);
        //this.props.dgs.account
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
        this.setState({phone: newText}); 
    }

    onEmailInputChanged(text){  
        this.setState({email: text}); 
    }

    async editPersonInfo(){

        console.log('this.state.career2' ,this.state.career)
        let ret= await server.U("/user/resident/info", {
            sessionId:this.props.userInfo.sessionId,
            phone: this.state.phone,
            lineId: this.state.lineId,
            email:this.state.email,
            education: this.state.education,
            career: this.state.career,
            isEmail:this.props.userInfo.isEmail,
            isNotice:this.props.userInfo.isNotice
            
        }).catch(err => {
            console.log("err11",err);
            Alert.alert(_("a_title"),_("s_save_error"))
        })
        if (ret!=undefined)
        {
            await Storage.update("settingsUserInfo", "phone", this.state.phone);
            await Storage.update("settingsUserInfo", "lineId", this.state.lineId);
            await Storage.update("settingsUserInfo", "email", this.state.email);
            await Storage.update("settingsUserInfo", "education", this.state.education);
            await Storage.update("settingsUserInfo", "career", this.state.career);
            Actions.push("main");
        }
      
      
    }
    setCareer =(value) =>{
        this.setState({career: value})
    }

    async componentWillReceiveProps(nextProps){
        console.log('this.props.userInfo.residentId' , nextProps.userInfo.residentId)
       if (nextProps.userInfo.residentId!=undefined){
            if (this.first) return;
            this.first = true;
            this.setState({
                phone: nextProps.userInfo.phone,
                lineId:nextProps.userInfo.lineId,
                email:nextProps.userInfo.email,
                education:nextProps.userInfo.education,
                career:nextProps.userInfo.career
            }) 

       }
    }

    content() {
        console.log('this.state.career1' ,this.state.career)
        return (
            <Container  >
                <StatusBar hidden/>
                <Content bounces={false} scrollEnabled={false} contentContainerStyle={[{height:'100%'},styles.contentContainerStyle]}  >
                <ScrollView >
                    {/* <View style={ [iStyle.imgBackground , styles.mainView, iStyle.center,{ alignItems: 'flex-start',justifyContent:'flex-start'}]} >      */}
                        <View style={ [iStyle.imgBackground , styles.center,iStyle.viewBackgorundColor,{ alignItems: 'flex-start'}] } >
                                <Item regular style={[iStyle.no_border,styles.itemMargin]}>
                                    <Text style={[styles.item_label,styles.marginLeft]} >{_("s_info")}</Text>
                                </Item>
                                <Item regular style={[iStyle.no_border,styles.itemMargin]}>
                                    <Text style={[styles.item_label,styles.marginLeft]} >{_("s_name")}    {this.props.userInfo.name} </Text>
                                </Item> 
                                <Item regular style={[iStyle.no_border,styles.itemMargin]}>
                                    <Text style={[styles.item_label,styles.marginLeft]} >{_("s_sex")}    { _("s_"+Gender[this.props.userInfo.gender]) } </Text>
                                </Item> 
                                <Item regular style={[iStyle.no_border,styles.itemMargin]}>
                                    <Text style={[styles.item_label,styles.marginLeft]} >{_("s_birthday")}    {moment(this.props.userInfo.birthday).format("YYYY/MM/DD")} </Text>
                                </Item> 
                                <Item regular style={[iStyle.no_border,styles.itemMargin]}>
                                    <Text style={[styles.item_label,styles.marginLeft]} >{_("s_contact")}</Text>
                                </Item>
                                <Item regular style={[iStyle.no_border,styles.itemMargin]}>
                                    <Text style={[styles.item_label,styles.marginLeft]} >{_("s_phone")}</Text>
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
                                <Item regular style={[iStyle.no_border,styles.itemMargin]}>
                                    <Text style={[styles.item_label,styles.marginLeft]} >{_("s_line")}</Text>
                                </Item>
                                <Item regular style={[iStyle.no_border,{marginBottom:10}, iStyle.settingitemStyle]}>
                                    <Input
                                        placeholder={_("s_line")}
                                        style={[styles.form_control_input, styles.loginText,styles.marginLeft]}
                                        autoCapitalize='none'
                                        keyboardType='email-address'
                                        onChangeText={(val) =>  this.setState({lineId: val}) }
                                        value={this.state.lineId}  />                
                                </Item>  
                                <Item regular style={[iStyle.no_border,styles.itemMargin]}>
                                    <Text style={[styles.item_label,styles.marginLeft]} >{_("s_email")}</Text>
                                </Item>
        
                                <Item regular style={[iStyle.no_border,{marginBottom:10}, iStyle.settingitemStyle]}>
                                    <Input
                                        placeholder={_("s_email")}
                                        style={[styles.form_control_input, styles.loginText,styles.marginLeft]}
                                        autoCapitalize='none'
                                        onChangeText={(val) =>   this.onEmailInputChanged(val) }
                                        value={this.state.email}  />         
                                                   
                                </Item>  
                                <Item regular style={[iStyle.no_border,styles.itemMargin]}>
                                    <Text style={[styles.item_label,styles.marginLeft]} >{_("s_education")}</Text>
                                </Item>            
                                <Item regular style={[iStyle.no_border, iStyle.settingitemStyle]}>
                                    <Picker
                                        note
                                        mode="dropdown"
                                        style={styles.pickerText}
                                        selectedValue={this.state.education}
                                        onValueChange={(value) => {
                                            // lang.setLang(value);
                                            this.setState({education: value}); 
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
                                <Item regular style={[iStyle.no_border,styles.itemMargin]}>
                                    <Text style={[styles.item_label,styles.marginLeft]} >{_("s_job")}</Text>
                                </Item>           
                                <Item regular style={[iStyle.no_border, iStyle.settingitemStyle]}>
                                    <Picker
                                        note
                                        mode="dropdown"
                                        style={styles.pickerText}
                                        selectedValue={this.state.career}
                                        onValueChange={(value) => {
                                            // lang.setLang(value);
                                            this.setCareer(value);
                                          
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
                                <View style={ [iStyle.imgBackground ,styles.row_base, ,styles.center,{backgroundColor:'rgb(241,243,241)',height:150}] } >
                                    <Item  style={[iStyle.no_border,styles.itemMargin]}>
                                        <Button style={iStyle.item_button} full onPress={() =>this.editPersonInfo()}>
                                            <Text style={styles.item_input}>{_("s_save")}</Text>
                                        </Button>   
                                    </Item>              
                                           
                                </View>         
                                        
                                        
                                         
                        </View>

                        
                    {/* </View>    */}
                </ScrollView>       
                
                </Content>
            </Container>
           
           
        )
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
          tablet: { fontSize: 15}
        }),
        color: 'black'
    },
    itemMargin:{
        marginTop:20,marginLeft:20
    },
    item_input: {
        color: "white",
        fontSize: "22 rem"
    },
});
  