import React, {Component} from 'react';
import { ImageBackground, ScrollView  ,Image ,TouchableOpacity} from 'react-native';
import { Container, Header, View, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Icon, Item, Input, Label, Picker, CardItem, Card, Toast ,Tab,Tabs} from 'native-base';

import { EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _, SettingsUserInfo } from './../../../../../helpers/core-packages';

import iStyle from '../../../../resources/style/main-style.js'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import server, { ＦacilityGet,FacilityReservationGet } from './../../../../services/smart-community-server';
import { makeMainView } from '../../helpers/make-main-tapView';
import { makeReserveItem  } from '../../helpers/make-reserve-item';
import Modal from "react-native-modal";

import Device from '../../../../contents/react-native-device-detection-val';
import { relativeTimeRounding } from "moment";
import { MainTapView } from "../../helpers/main-TapView";
import { makeFacReserveItem } from "../../helpers/make-fac-reserve-item";

interface Props {
    lang?: string;
    userInfo:SettingsUserInfo;
}
interface State {
    facilityList?: ＦacilityGet.Output[];
    reserveList :FacilityReservationGet.Output[];
    modalVisible: Boolean,
    modalImage:string,
    index: number
}
 



@ConnectObservables({
    lang: lang.getLangObservable(),
    userInfo:Storage.getObservable("settingsUserInfo")
})


export class ReservePage extends Component<Props ,State> {

    state = {
        modalVisible: false,
        modalImage : null,
        index: 0,
        facilityList :[],
        reserveList:[],
        routes: [
            { key: 'tab1', title: "公設清單" },
            { key: 'tab2', title: "已預約記錄" }
        ],
        child :{
            tab1: this.initRoute,
            tab2: this.initRoute
        }
    };

    constructor(props) {
        super(props);
        console.log('constructor')
       
    }

    async componentWillReceiveProps(nextProps){
        console.log(nextProps.userInfo)
        if (nextProps.userInfo.residentId!=undefined){
            await this.getData(nextProps);
        }
    }

    async getData(Props)
    {
        let facilityList:any= await this.getFacilityList(Props);
        let recordList:any= await this.getRecordList(Props);

        console.log('results' ,facilityList);
        this.setState({ 
            facilityList: [...facilityList.content],
            reserveList: [...recordList.content]
        },
        function(){ 
            this.setState({
                child :{
                    tab1: this.firstRoute,
                    tab2: this.reserveRoute
                },
            })
        }
        );
    } 
    async getFacilityList(Props)
    {
        let tmp = await server.R("/public-facility", {
            sessionId: Props.userInfo.sessionId
        }).catch(err => {
            console.log(err);
            return tmp;
        });
        return tmp;
    }

    async getRecordList(Props)
    {
        let tmp = await server.R("/public-facility/reservation", {
            sessionId: Props.userInfo.sessionId
        }).catch(err => {
            console.log(err);
            return tmp;
        });
        console.log('public-facility/reservation' ,tmp)
        return tmp;
    }
    componentDidUpdate(prev_props) {
       console.log('componentDidUpdatecomponentDidUpdate')
    }
    openDetailPage =(_data)=>{
        Actions.push("reserveDetail",{data:_data})
      }
    // m_DepositItem
    render() {

        return (

            <Content>
                <MainTapView state ={this.state}  title={_("m_FacilityReservation")} child={this.state.child}  onPress = { (_index) => this.setState({ index:_index }) }  />
              
            </Content>
           
        )
    }
    
    firstRoute  =() => {
     
        return (
            <Content bounces={false} scrollEnabled={false} contentContainerStyle={{flex: 1}}>
                <ScrollView>
                    <View style={ [iStyle.imgBackground , iStyle.center,iStyle.mainView] } >
                        {
                            this.state && this.state.facilityList && (
                            this.state.facilityList.map( (data ,index) => {
                                return makeReserveItem(data, index, () => this.openDetailPage(data));}))   
                        }
                       
                    </View>        
                 </ScrollView>
            </Content>
        )
    };

    reserveRoute  =() => {
     
        return (
            <Content bounces={false} scrollEnabled={false} contentContainerStyle={{flex: 1}}>
                <ScrollView>
                    <View style={ [iStyle.imgBackground , iStyle.center,iStyle.mainView] } >
                        {
                            this.state && this.state.reserveList && (
                            this.state.reserveList.map( (data ,index) => {
                                return makeFacReserveItem(data, index);
                            }))   
                        }
                       
                    </View>        
                 </ScrollView>
            </Content>
        )
    };


  

    initRoute () {
       return (
        <View style={ [iStyle.imgBackground , iStyle.center,styles.mainView] } >
        {/* { makeMessageItem("未讀郵件","2018/11/10收件" , "11:20" ,false ,  () => this.openModalVisible('2'))} */}
       </View>
       )
    }
}  




const styles = EStyleSheet.create({
    mainView:{
        backgroundColor:'rgb(241,243,241)',
        justifyContent:"flex-start"
    },

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
  