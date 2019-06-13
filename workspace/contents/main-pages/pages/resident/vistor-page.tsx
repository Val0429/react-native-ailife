import React, {Component} from 'react';
import { ImageBackground, ScrollView  ,Image ,TouchableOpacity, Alert} from 'react-native';
import { Container, Header, View, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Icon, Item, Input, Label, Picker, CardItem, Card, Toast ,Tab,Tabs} from 'native-base';

import { EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _, SettingsUserInfo ,ReadedItem,ReadedCount} from './../../../../../helpers/core-packages';

import iStyle from '../../../../resources/style/main-style.js'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import server, { VistorGet } from './../../../../services/smart-community-server';
import { makeMainView } from '../../helpers/make-main-tapView';
import { makeGasItem } from '../../helpers/make-gas-item';
import { makeVistorItem  } from '../../helpers/make-vistor-item';
import Modal from "react-native-modal";

import Device from '../../../../contents/react-native-device-detection-val';
import { relativeTimeRounding } from "moment";
import { MainTapView } from "../../helpers/main-TapView";
import { makeNoDataImage } from "../../helpers/make-noDataImage-item";

interface Props {
    lang?: string;
    userInfo:SettingsUserInfo;
    readedCount:ReadedCount
  
}
interface State {
    receiveResults?: VistorGet.Output[];
    notReceivedResults?: VistorGet.Output[];
    modalVisible: Boolean,
    modalImage:string,
    index: number
}
 



@ConnectObservables({
    lang: lang.getLangObservable(),
    userInfo:Storage.getObservable("settingsUserInfo"),
    readedCount:Storage.getObservable('readedCount')
})


export class VistorPage extends Component<Props ,State> {
    first =false;
    state = {
        modalVisible: false,
        modalImage : null,
        index: 0,
        receiveResults: [],
        notReceivedResults:[],
        routes: [
            { key: 'tab1', title: _('v_vistorInfo') },
            { key: 'tab2', title: _("v_vistorRecore") },
        ],
        child :{
            tab1: this.initRoute,
            tab2: this.initRoute,
        }
    };

    constructor(props) {
        super(props);
       
      }

    
    getAccountReadSatus():ReadedItem{
        for (let index = 0; index < this.props.readedCount.totalReadedCount.length; index++) {
            const element:ReadedItem= this.props.readedCount.totalReadedCount[index];
            if (element.account==this.props.userInfo.account)
            {
                return element;
            }
            
        }
        return null;
    }

    updateAccountReadSatus(newElement){
        for (let index = 0; index < this.props.readedCount.totalReadedCount.length; index++) {
            const element:ReadedItem= this.props.readedCount.totalReadedCount[index];
            if (element.account==this.props.userInfo.account)
            {
                this.props.readedCount.totalReadedCount[index] = newElement;
            }
            
        }
        Storage.update("readedCount" ,"totalReadedCount"  ,this.props.readedCount.totalReadedCount)
       
    }

    async componentWillReceiveProps(nextProps){

        if (nextProps.userInfo.residentId!=undefined){
                if (this.first){ 
                    return
                }
                else{
                    this.first= true;
                }
                let receiveResults:any= await server.R("/visitor", {
                    sessionId: nextProps.userInfo.sessionId,
                    status: "prev",
                }).catch(err => {
                    console.log(err);
                })
                let notReceivedResult:any= await server.R("/visitor", {
                    sessionId: nextProps.userInfo.sessionId,
                    status: "curr",
                }).catch(err => {
                    console.log(err);
                })


                let accountReadSatus = this.getAccountReadSatus();
                console.log('accountReadSatus' ,accountReadSatus);
                accountReadSatus.vistorReadedCount = receiveResults.content.length;
                this.updateAccountReadSatus(accountReadSatus);

                this.setState({ 
                    receiveResults: [...receiveResults.content],
                     notReceivedResults:[...notReceivedResult.content]

                },
                function(){ 
                    this.setState({
                        child :{
                            tab1: this.receiveRoute,
                            tab2: this.notReceiveRoute,
                        },
                    })
                }
                );



        }
    }
    // m_DepositItem
    render() {

        return (
            <Content>
                <MainTapView state ={this.state}  title={_("r_vistor")} child={this.state.child}  onPress = { (_index) => this.setState({ index:_index }) }  />
             
            </Content>
           
        )
    }
    
    notReceiveRoute  =() => {
     
        return (
            <Content bounces={false} scrollEnabled={false} contentContainerStyle={{flex: 1}}>
                <ScrollView>
                    <View style={ [iStyle.imgBackground , iStyle.center,iStyle.mainView] } >
                        {
                            this.state && this.state.receiveResults && (
                            this.state.receiveResults.map( (data ,index) => {
                                return makeVistorItem(data, index)}))   
                        }
                        {
                            this.state && this.state.receiveResults && this.state.receiveResults.length==0&&
                            makeNoDataImage(rcImages.vistor_gray, _("m_nodata"))
                        }  
                       
                    
                    </View>        
                 </ScrollView>
            </Content>
        )
    };

    receiveRoute  =() => {
     
        return (
            <Content bounces={false} scrollEnabled={false} contentContainerStyle={{flex: 1}}>
                <ScrollView>
                    <View style={ [iStyle.imgBackground , iStyle.center,iStyle.mainView] } >
                        
                        {
                            this.state && this.state.notReceivedResults && (
                            this.state.notReceivedResults.map( (data ,index) => {
                                return makeVistorItem(data, index)}))   
                        }
                        {
                            this.state && this.state.notReceivedResults && this.state.notReceivedResults.length==0&&
                            makeNoDataImage(rcImages.vistor_gray, _("m_nodata"))
                        }  
                        
                       
                    
                    </View>        
                 </ScrollView>
            </Content>
        )
    };

  

    initRoute () {
       return (
        <View style={ [iStyle.imgBackground , iStyle.center,iStyle.mainView] } >
        {/* { makeMessageItem("未讀郵件","2018/11/10收件" , "11:20" ,false ,  () => this.openModalVisible('2'))} */}
       </View>
       )
    }
}  




const styles = EStyleSheet.create({

    row_base: {
        justifyContent: 'center',
        alignItems: 'center', 
    },
    input: {
        borderColor:'#D2D2D2',
        borderWidth: 1,
        width:'95%',
        justifyContent: 'center',
        alignItems: 'center',
        height:'100%'
    },
    btnText:{
        fontSize:17
    },
    btn: {
        backgroundColor:'rgb(243,186,31)',
        width:'80%',
        justifyContent: 'center',
        alignItems: 'center',
        height:'100%'
    },
    modalView: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
      },
    modalTitle:{
        fontSize:'20rem', 
        position: 'absolute', 
        left: 0 
    },
    modalcontent:{
        fontSize:'18rem', 
        position: 'absolute', 
        left: 50
    }
});
  