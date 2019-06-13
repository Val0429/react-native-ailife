import React, {Component} from 'react';
import { ImageBackground, ScrollView  ,Image ,TouchableOpacity, Platform} from 'react-native';
import { Container, Header, View, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Icon, Item, Input, Label, Picker, CardItem, Card, Toast ,Tab,Tabs} from 'native-base';

import { EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _, SettingsUserInfo, SettingsAnnouncement,ReadedItem ,ReadedCount} from './../../../../../helpers/core-packages';

import iStyle from '../../../../resources/style/main-style.js'
import server, { AnnouncementsGet } from './../../../../services/smart-community-server';

import Modal from "react-native-modal";

import Device from '../../../../contents/react-native-device-detection-val';
import { relativeTimeRounding } from "moment";
import { MainTapView } from "../../helpers/main-TapView";
import { AnnouncementsItem } from "../../helpers/announcements-item";
import { makeNoDataImage } from "../../helpers/make-noDataImage-item";

interface Props {
    lang?: string;
    userInfo:SettingsUserInfo;
    announcement:SettingsAnnouncement;
    readedCount:ReadedCount
}
interface State {
    results?: AnnouncementsGet.Output[];
    modalVisible: Boolean,
    modalCount:number,
    index: number
}
 



@ConnectObservables({
    lang: lang.getLangObservable(),
    userInfo:Storage.getObservable("settingsUserInfo"),
    announcement:Storage.getObservable("settingsAnnouncement"),
    readedCount:Storage.getObservable('readedCount'),
})


export class AnnouncementPage extends Component<Props ,State> {
    first =false;
    state = {
        modalVisible: false,
        modalCount : 0,
        index: 0,
        results :[],
        routes: [
            { key: 'tab1', title: "未讀公告" },
            { key: 'tab2', title: "已讀公告" }       
         ],
        child :{
            tab1: this.initRoute,
            tab2: this.initRoute
        }
    };

    constructor(props) {
        super(props);
       
      }
    openDetail = async (_data:AnnouncementsGet.Output)=> {
        let tmpList = this.props.announcement.readedList;
        tmpList.push(_data.publicNotifyId);
        await Storage.update("settingsAnnouncement" ,"readedList"  ,tmpList)
        Actions.push('announcementDetai',{data:_data}) 
    }
 
    async componentWillReceiveProps(nextProps){
        console.log(nextProps.userInfo)
        if (nextProps.userInfo.residentId!=undefined){
            if (this.first){ 
                return
            }
            else{
                this.first= true;
                await this.getData(nextProps);
            }
        }
    }

    async getData(Props)
    {
        let results:any= await server.R("/public-notify", {
            sessionId: Props.userInfo.sessionId
        }).catch(err => {
            console.log(err);
        });
        console.log('results' ,results);
        let accountReadSatus = this.getAccountReadSatus();
        console.log('accountReadSatus' ,accountReadSatus);
        accountReadSatus.announcmentReadedCount = results.content.length;
        this.updateAccountReadSatus(accountReadSatus);

        this.setState({ 
            results: [...results.content]
        },
        function(){ 
            this.setState({
                child :{
                    tab1: this.firstRoute,
                    tab2: this.sencondRoute,
                },
            })
        }
        );

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


    // m_DepositItem
    render() {
        return (
            <Content>
                <MainTapView state ={this.state}  title={_("m_CommunityAnnouncement")} child={this.state.child}  onPress = { (_index) => this.setState({ index:_index }) }  />
            </Content>
        )
    }
 
    firstRoute  =() => {
        console.log("firstRoute");
        return (
            <Content bounces={false} scrollEnabled={false} contentContainerStyle={{flex: 1}}>
                <ScrollView>
                    <View style={ [iStyle.imgBackground , iStyle.center,iStyle.mainView] } >
                       
                        {
                            this.state && this.state.results && (
                            this.state.results.map( (data :AnnouncementsGet.Output,i) => {
                                if (this.props.announcement.readedList.indexOf(data.publicNotifyId) ==-1)
                                {
                                    return <AnnouncementsItem onPress={ this.openDetail} key={i} data ={data} index={i}></AnnouncementsItem>
                                }
                            }))   
                        }
                        {
                            this.state && this.state.results && this.state.results.length==0&&
                            makeNoDataImage(rcImages.announcement_gray, _("m_nodata"))
                        }  
                    </View>        
                 </ScrollView>
            </Content>
        )
    };

    sencondRoute  =() => {
        console.log("firstRoute");
        return (
            <Content bounces={false} scrollEnabled={false} contentContainerStyle={{flex: 1}}>
                <ScrollView>
                    <View style={ [iStyle.imgBackground , iStyle.center,iStyle.mainView] } >
                       
                        {
                            this.state && this.state.results && (
                            this.state.results.map( (data :AnnouncementsGet.Output,i) => {
                                if (this.props.announcement.readedList.indexOf(data.publicNotifyId) >-1)
                                {
                                    return <AnnouncementsItem onPress={ this.openDetail} key={i} data ={data} index={i}></AnnouncementsItem>
                                }
                            }))   
                        }

                        {
                            this.props.announcement.readedList.length==0&&
                            makeNoDataImage(rcImages.announcement_gray, _("m_nodata"))
                        }  

                    </View>        
                 </ScrollView>
            </Content>
        )
    };

    initRoute () {
       return (
        <View style={ [iStyle.imgBackground , iStyle.center,styles.mainView] } >
       </View>
       )
    }
}  




const styles = EStyleSheet.create({
    mainView:{
        backgroundColor:'rgb(241,243,241)',
        justifyContent:"flex-start"
    },
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
    },
    pickerView:{
        width: '90%', 
        height: 50, 
        borderColor:'#A4A5A4',
        borderWidth:2,
        marginTop:10
    },
    pickerText:{
        color:'#5C5B5C',
      
        height: Platform.OS === "android" ? 40 : 45
    },
    modalPickerView:{
        width: 80, 
        height: Platform.OS === "android" ? 40 : 45,
        borderColor:'#A4A5A4',
        borderWidth:2,
    },
    modalImageView:{
        width: '80%',
        height: '300rem' , 
        backgroundColor:'white'
    },
    modalItem:{
        position:'absolute',
        top:5,right:5 ,
        height:50,
        width:50
    },
    btn:{
        height:50,
        width:120,
        bottom:10,
        position: 'absolute', 
    },
    itemMargin:{
        height:70
    }
});
  