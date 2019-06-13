import React, {Component} from 'react';
import { ImageBackground, ScrollView  ,Image ,TouchableOpacity, Platform} from 'react-native';
import { Container, Header, View, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Icon, Item, Input, Label, Picker, CardItem, Card, Toast ,Tab,Tabs} from 'native-base';

import { EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _, SettingsUserInfo,ReadedCount ,ReadedItem} from './../../../../../helpers/core-packages';

import iStyle from '../../../../resources/style/main-style.js'
import server, { VoteGet } from './../../../../services/smart-community-server';

import { MainTapView } from "../../helpers/main-TapView";
import { VoteItem } from "../../helpers/vote-item";
import { VoteHistoryItem } from "../../helpers/vote-history-item";


import { ReceiveStatus } from "../../../../enums"

interface Props {
    lang?: string;
    userInfo:SettingsUserInfo;
    readedCount:ReadedCount,
}
interface State {
    newResults?: VoteGet.Output[];
    recordResults?: VoteGet.Output[];
    modalVisible: Boolean,
    modalCount:number,
    index: number,

}
 

@ConnectObservables({
    lang: lang.getLangObservable(),
    userInfo:Storage.getObservable("settingsUserInfo"),
    readedCount:Storage.getObservable('readedCount'),
})


export class VotePage extends Component<Props ,State> {
    first = false;
    state = {
        modalVisible: false,
        modalCount : 0,
        index: 0,
        newResults :[],
        recordResults :[],
        routes: [
            { key: 'tab1', title: "最新投票" },
            { key: 'tab2', title: "投票紀錄" }],
        child :{
            tab1: this.initRoute,
            tab2: this.initRoute
        },
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
        let newResults:any= await this.getNewVoteList(Props);
       // let recordResults:any= await this.getRecordVoteList(Props);

        let accountReadSatus = this.getAccountReadSatus();
        accountReadSatus.voteReadedCount = newResults.content.length;
        this.updateAccountReadSatus(accountReadSatus);
        
        this.setState({ 
            newResults: [...newResults.content],
            recordResults: [...newResults.content]
        },
        function(){ 
            this.setState({
                child :{
                    tab1: this.newRoute,
                    tab2: this.recordRoute,
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

    async getNewVoteList(Props)
    {
        let results:any= await server.R("/vote/history", {
            sessionId: Props.userInfo.sessionId,
            status:ReceiveStatus[1]
        }).catch(err => {
            console.log(err);
            return null;
        });
        console.log('history results' ,results)
        return results;
    }
    async getRecordVoteList(Props)
    {
        let results:any= await server.R("/vote/history", {
            sessionId: Props.userInfo.sessionId,
            status:ReceiveStatus[0]
        }).catch(err => {
            console.log(err);
            return null;
        });

        return results;
    }


    // m_DepositItem
    render() {
        return (

            <Content>
                <MainTapView state ={this.state}  title={_("w_Vote")} child={this.state.child}  onPress = { (_index) => this.setState({ index:_index }) }  />
        
            </Content>
           
        )
    }
 
    newRoute  =() => {
        return (
            <Content bounces={false} scrollEnabled={false} contentContainerStyle={{flex: 1}}>
                <ScrollView>
                    <View style={ [iStyle.imgBackground , iStyle.center,iStyle.mainView] } >
                       
                        {
                            this.state && this.state.newResults && (
                            this.state.newResults.map( (data ,i) => {
                                // returVn makeSmallToolItem(data, index);
                                return <VoteItem key={i} data ={data} index={i}></VoteItem>
                            }))   
                        }
                    </View>        
                 </ScrollView>
            </Content>
        )
    };

    recordRoute  =() => {
        return (
            <Content bounces={false} scrollEnabled={false} contentContainerStyle={{flex: 1}}>
                <ScrollView>
                    <View style={ [iStyle.imgBackground , iStyle.center,iStyle.mainView] } >
                       
                        {
                            this.state && this.state.recordResults && (
                            this.state.recordResults.map( (data ,i) => {
                                // returVn makeSmallToolItem(data, index);
                                return <VoteHistoryItem key={i} data ={data} index={i}></VoteHistoryItem>
                            }))   
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
  