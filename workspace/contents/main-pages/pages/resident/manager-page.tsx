import React, {Component} from 'react';
import { ImageBackground, ScrollView  ,Image ,TouchableOpacity} from 'react-native';
import { Container, Header, View, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Icon, Item, Input, Label, Picker, CardItem, Card, Toast ,Tab,Tabs} from 'native-base';

import { EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _, SettingsUserInfo,ReadedItem,ReadedCount } from './../../../../../helpers/core-packages';

import iStyle from '../../../../resources/style/main-style.js'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import server, { ManageCostGet } from './../../../../services/smart-community-server';

import { MainTapView } from "../../helpers/main-TapView";
import { ManagerCostItem } from "../../helpers/managerCost-item";
import moment, { now } from 'moment';
import { ReceiveStatus } from "../../../../enums"
import { makeNoDataImage } from "../../helpers/make-noDataImage-item";

interface Props {
    lang?: string;
    userInfo:SettingsUserInfo;
    readedCount:ReadedCount
}
interface State {
    nowMonthResult:ManageCostGet.Output[];
    receiveResults: ManageCostGet.Output[];
    notReceivedResults: ManageCostGet.Output[];
    modalVisible: Boolean,
    modalImage:string,
    index: number,
    child:any
}



@ConnectObservables({
    lang: lang.getLangObservable(),
    userInfo:Storage.getObservable("settingsUserInfo"),
    readedCount:Storage.getObservable('readedCount')
})


export class ManagePage extends Component<Props ,State> {
    first=false;
    state = {
        modalVisible: false,
        modalImage : null,
        index: 0,
        nowMonthResult:[],
        receiveResults :[],
        notReceivedResults :[],
        routes: [
            { key: 'tab1', title: "本期繳納" },
            { key: 'tab2', title: "未繳紀錄" },
            { key: 'tab3', title: "繳納紀錄" }
        ],
        child :{
            tab1: this.initRoute,
            tab2: this.initRoute,
            tab3: this.initRoute,
        }
    };

    constructor(props) {
        super(props);
       
    }
    async componentWillReceiveProps(nextProps){

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
          console.log('Props.userInfo.sessionId', {
            sessionId: Props.userInfo.sessionId,
            status: "all",
        })
          let results:any= await server.R("/manage-cost", {
              sessionId: Props.userInfo.sessionId,
              status: "all",
          }).catch(err => {
              console.log(err);
          })
          console.log('results',results)
          let content:ManageCostGet.Output[] = results.content;

          let accountReadSatus = this.getAccountReadSatus();
          console.log('accountReadSatus' ,accountReadSatus);
          accountReadSatus.managerReadedCount = results.content.length;
          this.updateAccountReadSatus(accountReadSatus);



          let nowMonthResult:ManageCostGet.Output[] = []; 
          let receiveResults:ManageCostGet.Output[] = [];
          let notReceivedResults:ManageCostGet.Output[] = [];
          for (let i = 0; i < content.length; i++) {
            if (moment(content[i].date).format("YYYY/MM") ==moment(now()).format("YYYY/MM"))
            {
                nowMonthResult.push(content[i]);
                continue;
            }
            if (content[i].status==ReceiveStatus.received)
                receiveResults.push(content[i]); 
            else 
                notReceivedResults.push(content[i]);
            
           
          }

          this.setState({ 
              receiveResults: [...receiveResults],
              notReceivedResults:notReceivedResults,
              nowMonthResult:nowMonthResult

  
          },
          function(){ 
              this.setState({
                  child :{
                    tab1: this.nowReceiveRoute,
                    tab2: this.notReceiveRoute,
                    tab3: this.receiveRoute,
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

    async componentDidMount() {
   
    }
    // m_DepositItem
    render() {

        return (

            <Content>
                <MainTapView state ={this.state}  title={_("r_manage")} child={this.state.child}  onPress = { (_index) => this.setState({ index:_index }) }  />
           
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
                            this.state.receiveResults.map( (data ,i) => {
                                console.log('data' ,data)
                                return <ManagerCostItem key={i} data ={data} index={i}></ManagerCostItem>
                            }))   
                        }
                        {
                            this.state && this.state.receiveResults && this.state.receiveResults.length==0&&
                            makeNoDataImage(rcImages.announcement_gray, _("m_nodata"))
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
                            this.state && this.state.notReceivedResults && (
                            this.state.notReceivedResults.map( (data ,i) => {
                                return <ManagerCostItem key={i} data ={data} index={i}></ManagerCostItem>
                            }))   
                        }
                        {
                            this.state && this.state.notReceivedResults && this.state.notReceivedResults.length==0&&
                            makeNoDataImage(rcImages.announcement_gray, _("m_nodata"))
                        } 
                    
                    </View>        
                 </ScrollView>
            </Content>
        )
    };

    nowReceiveRoute  =() => {     
        return (
            <Content bounces={false} scrollEnabled={false} contentContainerStyle={{flex: 1}}>
                <ScrollView>
                    <View style={ [iStyle.imgBackground , iStyle.center,iStyle.mainView] } >
                        {
                            this.state && this.state.nowMonthResult && (
                            this.state.nowMonthResult.map( (data ,i) => {
                                return <ManagerCostItem key={i} data ={data} index={i}></ManagerCostItem>
                            }))   
                        }
                        {
                            this.state && this.state.nowMonthResult && this.state.nowMonthResult.length==0&&
                            makeNoDataImage(rcImages.announcement_gray, _("m_nodata"))
                        } 
                    
                    </View>        
                 </ScrollView>
            </Content>
        )
    };


    initRoute () {
       return (
        <View style={ [iStyle.imgBackground , iStyle.center,iStyle.mainView] } >
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
  