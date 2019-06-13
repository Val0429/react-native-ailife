import React, {Component} from 'react';
import {Platform, StatusBar, Image, NativeModules, requireNativeComponent , ImageBackground, TouchableOpacity, Alert ,ScrollView} from 'react-native';
import { Container, Header, View, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Icon, Item, Input, Label, Picker, CardItem, Card, Toast, } from 'native-base';

import { EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _, SettingsUserInfo } from './../../../../../helpers/core-packages';

import { makeMainButton } from './../../helpers/make-main-button';
import { HeaderContainer } from '../../helpers/header-container';
import iStyle from '../../../../resources/style/main-style.js'
import Device from '../../../../contents/react-native-device-detection-val';
import moment from 'moment';
import Modal from "react-native-modal";
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import server, { VoteGet } from './../../../../services/smart-community-server';
import { ReceiveStatus } from "../../../../enums"


interface Props {
    lang?: string;
    data:VoteGet.Output;
    modalVisible:boolean,
    radio_props:any[],
    changeRedio:string,
    userInfo:SettingsUserInfo;
}
// var radio_props = [
//     {label: '男  ', value: "male" },
//     {label: '女  ', value: "female" }
// ];
@ConnectObservables({
    lang: lang.getLangObservable(),
    userInfo:Storage.getObservable("settingsUserInfo")
})

export class VoteDetaiPage extends Component<Props> {
    state = {
        modalVisible: false,
        radio_props :[],
        changeRedio:""
    };
    async componentWillReceiveProps(nextProps){
        if (nextProps.data.options!=undefined){
            let temp :any[]=[];
     
           for (let i = 0; i < nextProps.data.options.length; i++) {
                temp.push({label: nextProps.data.options[i], value: nextProps.data.options[i], });
           }
           this.setState({
            radio_props:temp,
            changeRedio:nextProps.data.options[0]
           })
        }
    }
    render() {
        return (
            <HeaderContainer notSroll={true} backBtn={true} title={_("w_Vote")} children={this.content()} />
        )
    }
    
    content() {
        let data =this.props.data ;

        return (
            
            <Container  >
                {this.createModal()}
                <StatusBar hidden/>
                <Content bounces={false} scrollEnabled={false} contentContainerStyle={[{height:'100%'},styles.contentContainerStyle]}  >
                    <ScrollView >
                        <View style={ [iStyle.imgBackground,iStyle.center,styles.mainView]} >
                            
                                <Item regular style={[iStyle.no_border,iStyle.bottomBorder,styles.title]}>
                                    <Text style={[iStyle.mainTitleText,{ marginBottom:20}]}>{data.title}</Text>
                                </Item>

                                <Item regular style={[iStyle.no_border,styles.title,{marginTop:20}]}>
                                    <Text style={[iStyle.mainContetText,{ marginBottom:20}]}>{_("v_deadline")} ：{moment(this.props.data.deadline).format("YYYY/MM/DD")}</Text>
                                </Item>
                                <Item regular style={[iStyle.no_border,styles.title,{marginTop:0}]}>
                                    <Text style={[iStyle.mainContetText,{ marginBottom:20}]}>{_("c_namer")} ： {data.sponsorName}</Text>
                                </Item>
                                <Item regular style={[iStyle.no_border,styles.title,{marginTop:0}]}>
                                    <Text style={[iStyle.mainContetText,{ marginBottom:20}]}>{_("v_content")} ：</Text>
                                </Item>
                                <Item regular style={[iStyle.no_border,styles.title,{marginTop:0}]}>
                                    <Text style={[iStyle.mainContetText,{ marginBottom:20}]}>{data.content}</Text>
                                </Item>

                                <Item regular style={[iStyle.no_border,styles.title,{marginTop:0}]}>
                                    <Text style={[iStyle.mainContetText,{ marginBottom:20}]}>{_("v_items")}</Text>
                                </Item>
                                
                                { data && data.options && (
                                    data.options.map( (optionsData ,index) => {
                                    return (
                                        <Item key={"options"+index} regular style={[iStyle.no_border,styles.title,{marginTop:0,marginLeft:20}]}>
                                            <Text style={[iStyle.mainContetText,{ marginBottom:20}]}> {index+1} {_("v_number")} : {optionsData}</Text>
                                        </Item>
                                    )
                                    
                                }))   
                                
                                }
                           
                                {this.props.data.status==ReceiveStatus.unreceived.toString() && 
                                    <Item regular style={[iStyle.no_border,{marginTop:60}]}>
                                    {this.props.data.option!="" &&
                                    <Text style={iStyle.mainContetText}>已投 {this.props.data.option}</Text>
                                    }
                                    {this.props.data.option=="" &&
                                        <Button style={[iStyle.scan_button,{marginBottom:20}]} primary full onPress={() => this.setState({ modalVisible: true})    }>
                                            <Text style={styles.item_input}>{_("w_Vote")}</Text>
                                        </Button>    
                                    }            
                                    </Item>
                                }
                            </View>   

                    </ScrollView>     
                </Content>
            </Container>
           
        )
    }

    callLendApi= async() =>
    { 
        console.log('ewew',{
            sessionId: this.props.userInfo.sessionId,
            voteId:this.props.data.voteId,
            option:this.state.changeRedio
        })
        let voteResult:any= await server.U("/vote/voting", {
            sessionId: this.props.userInfo.sessionId,
            voteId:this.props.data.voteId,
            option:this.state.changeRedio
        }).catch(err => {
            console.log(err);
        })
        console.log('voteResult' ,voteResult);
        if (voteResult)
        {
            Alert.alert(_("a_voteSucess"),_("a_voteSucess"))
        }else{
            Alert.alert(_("a_voteFail"),_("a_voted"))
        }
       // this.closeModalVisible();
    }

    closeModalVisible = ()=> {
        this.setState({ modalVisible: false});    
    }

    createModal(){

        return (
            <Modal
            isVisible={this.state.modalVisible}
            backdropOpacity={0.3}
            animationIn="zoomInDown"
            animationOut="zoomOutUp"
            backdropColor={'black'}
            animationInTiming={1000}
            animationOutTiming={1000}
            backdropTransitionInTiming={1000}
            backdropTransitionOutTiming={1000}
            style={[styles.modal ]}>
            <View style={[styles.modalView,]} >
                <View style={[styles.modalImageView,iStyle.center]}>
                    <Item style={[iStyle.no_border,iStyle.center,{marginTop:30}]}>
                        <Item regular style={[iStyle.no_border,styles.itemMargin]}>
                            {this.state.modalVisible && 
                             <RadioForm style={[styles.marginLeft]}
                                radio_props={this.state.radio_props}
                               // initial={0}
                                buttonColor={'#6F6F72'}
                                selectedButtonColor = {'#70871B'}
                                formHorizontal={false}
                                labelStyle={{fontSize: 20, color: '#6F6F72',marginLeft:20}}
                                onPress={(val) =>  { this.setState({changeRedio :val}) } }
                             />   
                            }
                                
                        </Item>
                    </Item>
                    <Item style={[styles.modalItem,iStyle.no_border]}>
                        <TouchableOpacity  onPress= {this.closeModalVisible} >
                            <Image style={{height: "50%",alignSelf: 'flex-end'}} resizeMode="contain" source={ rcImages.close } ></Image>
                        </TouchableOpacity> 
                          
                    </Item>
                    <Item style={[iStyle.no_border,styles.itemMargin,{marginTop:30,marginBottom:30}]}>
                        <Button style={[iStyle.item_button ,iStyle.alert_button,styles.btn]} full onPress= {this.callLendApi}  >
                            <Text style={styles.btnText}>{_("v_checkvote")}</Text>
                        </Button>   
                           
                             
                     </Item>
                </View>
            </View>
        </Modal>
    

        )
    }
}  

const styles = EStyleSheet.create({
    mainView:{
        width:'80%',
        alignSelf: 'center', 
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    modalImageView:{
        width: '80%',
        height: 'auto' , 
        backgroundColor:'white'
    },
    title:{
        marginTop:40, 
        alignSelf: 'center', 
        justifyContent: 'flex-start',
        alignItems: 'center',
        width:'100%'
    },

    cancelPadding:{
        padding:0,
        margin:0
    },
 
    contentContainerStyle:{
        backgroundColor:'rgb(241,243,241)',
    },
    modalItem:{
        position:'absolute',
        top:5,right:5 ,
        height:50,
        width:50
    },
    item_input: {
        color: "white",
        fontSize: "22 rem"
    },
    btnText:{
        fontSize:'16rem',
        color:'white'
    }

});
  