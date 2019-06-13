import React, {Component} from 'react';
import { ImageBackground, ScrollView  ,Image ,TouchableOpacity, Alert} from 'react-native';
import { Container, Header, View, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Icon, Item, Input, Label, Picker, CardItem, Card, Toast ,Tab,Tabs} from 'native-base';

import { EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _, SettingsUserInfo } from './../../../../../helpers/core-packages';

import iStyle from '../../../../resources/style/main-style.js'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import server, { PackageGet } from './../../../../services/smart-community-server';
import { makeMainView } from '../../helpers/make-main-tapView';
import { makeGasItem } from '../../helpers/make-gas-item';
import { makePackageItem  } from '../../helpers/make-package-item';
import Modal from "react-native-modal";

import Device from '../../../../contents/react-native-device-detection-val';
import { relativeTimeRounding } from "moment";
import { MainTapView } from "../../helpers/main-TapView";
import { ReceiveStatus } from "../../../../enums"
import { makeNoDataImage } from "../../helpers/make-noDataImage-item";

interface Props {
    lang?: string;
    userInfo:SettingsUserInfo;

}
interface State {
    receiveResults?: PackageGet.Output[];
    NotreceivedResults?: PackageGet.Output[];

    modalVisible: Boolean,
    modalImage:string,
    index: number
}
 



@ConnectObservables({
    lang: lang.getLangObservable(),
    userInfo:Storage.getObservable("settingsUserInfo")
})


export class PackagePage extends Component<Props ,State> {
    
    state = {
        modalVisible: false,
        modalImage : null,
        index: 0,
        receiveResults :[],
        NotreceivedResults :[],
        routes: [
            { key: 'tab1', title: "寄放物品" },
            { key: 'tab2', title: "寄放紀錄" },
        ],
        child :{
            tab1: this.initRoute,
            tab2: this.initRoute,
        }
    };

    constructor(props) {
        super(props);
       
      }

    openModalVisible = (_data:PackageGet.Output)=> {
        this.setState({
            modalVisible: true,
            modalImage: server.getUrl()+_data.packageSrc ,
        });    
    
    }
    closeModalVisible = ()=> {
        this.setState({
            modalVisible: false
        });    
    
    }

    async componentWillReceiveProps(nextProps){

        if (nextProps.userInfo.residentId!=undefined){

                let receiveResults:any= await server.R("/package/posting", {
                    sessionId: nextProps.userInfo.sessionId,
                    status: ReceiveStatus[1],
                }).catch(err => {
                    console.log(err);
                   // Alert.alert(_("a_title"),_("a_loginError"))
                })

                let NotReceiveResults:any= await server.R("/package/posting", {
                    sessionId: nextProps.userInfo.sessionId,
                    status: ReceiveStatus[0],
                }).catch(err => {
                    console.log(err);
                   // Alert.alert(_("a_title"),_("a_loginError"))
                })
                
            this.setState({ 
                receiveResults: [...receiveResults.content],
                NotreceivedResults:[...NotReceiveResults.content]

            },
                function(){ 
                    console.log(this.state.results);
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
                <MainTapView state ={this.state}  title={_("m_DepositItem")} child={this.state.child}  onPress = { (_index) => this.setState({ index:_index }) }  />
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
                    <View style={styles.modalView}>
                        <View style={styles.modalImageView}>
                            <TouchableOpacity style={{width:'100%',height:'100%'}}  onPress= {this.closeModalVisible} >
                                <ImageBackground style={ iStyle.imgBackground } 
                                resizeMode='cover' 
                                source={  {uri:this.state.modalImage}} />
                                <Item style={[styles.modalItem,iStyle.no_border]}>
                                </Item>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </Content>
           
        )
    }
    
    receiveRoute  =() => {
     
        return (
            <Content bounces={false} scrollEnabled={false} contentContainerStyle={{flex: 1}}>
                <ScrollView>
                    <View style={ [iStyle.imgBackground , iStyle.center,iStyle.mainView] } >
                        {
                            this.state && this.state.receiveResults && (
                            this.state.receiveResults.map( (data ,index) => {
                                return makePackageItem(data, index, () => this.openModalVisible(data));}))   
                        }
                        {
                            this.state && this.state.receiveResults && this.state.receiveResults.length==0&&
                            makeNoDataImage(rcImages.package_gray, _("m_nodata"))
                        }  
                    
                    </View>        
                 </ScrollView>
            </Content>
        )
    };
    notReceiveRoute  =() => {
     
        return (
            <Content bounces={false} scrollEnabled={false} contentContainerStyle={{flex: 1}}>
                <ScrollView>
                    <View style={ [iStyle.imgBackground , iStyle.center,iStyle.mainView] } >
                        {
                            this.state && this.state.NotreceivedResults && (
                            this.state.NotreceivedResults.map( (data ,index) => {
                                return makePackageItem(data, index, () => this.openModalVisible(data));}))   
                        }
                        {
                            this.state && this.state.NotreceivedResults && this.state.NotreceivedResults.length==0&&
                            makeNoDataImage(rcImages.package_gray, _("m_nodata"))
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
   

    modal: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
    },
    modalView:{
        flex: 1,
        backgroundColor:'transparent',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalImageView:{
        width: '300rem',
        height: '300rem' , 
    },
    modalTitle:{
        fontSize:'20rem', 
        position: 'absolute', 
        left: 0 
    },
    modalItem:{
        position:'absolute',
        top:5,right:5 ,
        height:50,
        width:50
    },
    modalcontent:{
        fontSize:'18rem', 
        position: 'absolute', 
        left: 50
    }
});
  