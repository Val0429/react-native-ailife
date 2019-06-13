import React, {Component} from 'react';
import { ImageBackground, ScrollView  ,Image ,TouchableOpacity} from 'react-native';
import { Container, Header, View, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Icon, Item, Input, Label, Picker, CardItem, Card, Toast ,Tab,Tabs} from 'native-base';

import { EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _, SettingsUserInfo ,ReadedItem ,ReadedCount} from './../../../../../helpers/core-packages';

import iStyle from '../../../../resources/style/main-style.js'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import server, { GasGet } from './../../../../services/smart-community-server';
import { makeGasItem } from '../../helpers/make-gas-item';
import { makeVistorItem  } from '../../helpers/make-vistor-item';
import Modal from "react-native-modal";

import Device from '../../../../contents/react-native-device-detection-val';
import { MainTapView } from "../../helpers/main-TapView";
import moment, { now } from 'moment';
import { ReceiveStatus } from "../../../../enums"

interface Props {
    lang?: string;
    userInfo:SettingsUserInfo;
    readedCount:ReadedCount
  
}
interface State {
    receiveResults?: GasGet.Output[];
    nowMonthResult?: GasGet.Output[];
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


export class GasPage extends Component<Props ,State> {
    first=false;
    state = {
        modalVisible: false,
        modalImage : null,
        index: 0,
        receiveResults :[],
        nowMonthResult :[],
        routes: [
            { key: 'tab1', title: _("g_nowMonth") },
            { key: 'tab2', title: _("g_month") },
        ],
        child :{
            tab1: this.initRoute,
            tab2: this.initRoute,
        }
    };

    constructor(props) {
        super(props);
       
    }
    async updateGas(_data:GasGet.Output)
    {
        await server.U("/gas", {
            sessionId: this.props.userInfo.sessionId,
            gasId:_data.gasId,
            degree:_data.degree
        }).catch(err => {
            console.log(err);
        })

        await this.initViwe();
        await this.getData(this.props)

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


    async getData(Props)
    {
        let results:any= await server.R("/gas", {
            sessionId: Props.userInfo.sessionId,
            status: "all",
        }).catch(err => {
            console.log(err);
        });
        let content:GasGet.Output[] = results.content;

        let receiveResults:GasGet.Output[] = [];
        let nowMonthResult:GasGet.Output[] = [];

        let accountReadSatus = this.getAccountReadSatus();
        console.log('accountReadSatus' ,accountReadSatus);
        accountReadSatus.gasReadedCount = results.content.length;
        this.updateAccountReadSatus(accountReadSatus);



        for (let i = 0; i < content.length; i++) {
          
           if (moment(content[i].date).format("YYYY/MM") ==moment(now()).format("YYYY/MM"))
           {
                nowMonthResult.push(content[i]);
           }else{
                receiveResults.push(content[i]);
           }  
      }
      
       
        this.setState({ 
            receiveResults: [...receiveResults],
            nowMonthResult:[...nowMonthResult]

        },
        function(){ 
            this.setState({
                child :{
                    tab1: this.nowReceiveRoute,
                    tab2: this.receiveRoute,
                },
            })
        }
        );

    } 

    initViwe(){
        this.setState({ 
            receiveResults: [],
            nowMonthResult:[]

        },
        function(){ 
            this.setState({
                child :{
                    tab1: this.initRoute,
                    tab2: this.initRoute,
                },
            })
        }
        );
    }
 
    // m_DepositItem
    render() {

        return (
            <Content>
                <MainTapView state ={this.state}  title={_("r_gas")} child={this.state.child}  onPress = { (_index) => this.setState({ index:_index }) }  />
            </Content>
           
        )
    }
    onGasInputChanged(text,_data:GasGet.Output){
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
        _data.degree= text ;
    }
    addGasItem(_data:GasGet.Output ,index){
        return (
            <Item key ={index} regular style={[iStyle.no_border, styles.gasAdditemStyle]}>
                <Grid style={{marginTop:10,marginBottom:20,marginLeft:15}} >
                <Row size={1} style={[styles.row_base ]}>
                    <Label style={{ position: 'absolute', left: 0,fontSize:20}}>{moment(_data.date).format("YYYY年MM月")} {_("g_addnew")}</Label>   
                </Row>
                <Row size={1} style={[styles.row_base]}>
                  
                    <Col size={5} style={[styles.row_base,{alignItems: 'flex-start'}]}>
                        <Input
                            placeholder={_("g_addGas")}
                            style={styles.input}
                            autoCapitalize='none'
                            keyboardType='numeric'
                            onChangeText={(val) => {
                                this.onGasInputChanged(val,_data)
                            } }
                            />
                    </Col>
                    <Col size={3}  style={[styles.row_base]}>
                        <Button style={[styles.btn]} onPress={() => this.updateGas(_data)}  >
                            <Text style={styles.btnText}>{_("g_add")}</Text>
                        </Button>
                    </Col>
                </Row>
            
                                                
            </Grid>

            </Item>
        )
    }
    
    receiveRoute  =() => {
        return (
            <Content bounces={false} scrollEnabled={false} contentContainerStyle={{flex: 1}}>
                <ScrollView>

                    <View style={ [iStyle.imgBackground , iStyle.center,iStyle.mainView] } >
                       
                        {
                            this.state && this.state.receiveResults && (
                            this.state.receiveResults.map( (data:GasGet.Output ,index) => {
                                if (data.degree==0)
                                {
                                    return this.addGasItem(data ,index)
                                }else{
                                    return makeGasItem(data, index)
                                }

                               }))   


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
                            this.state.nowMonthResult.map( (data:GasGet.Output ,index) => {
                                if (data.degree==0)
                                {
                                    return this.addGasItem(data ,index)
                                }else{
                                    return makeGasItem(data, index)
                                }

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
        height:'100%',
        fontSize:'15rem'
    },
    btnText:{
        fontSize:'17rem'
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
    },
    gasAdditemStyle: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        ...Device.select({
          phone: {  height: 110,  marginTop: 10 , borderRadius: 5 },
          tablet: {  height: 110, marginTop: 10 , borderRadius: 5 }
        })
      }
});
  