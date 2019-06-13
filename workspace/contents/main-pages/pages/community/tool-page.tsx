import React, {Component} from 'react';
import { ImageBackground, ScrollView  ,Image ,TouchableOpacity, Platform, Alert, TextInput} from 'react-native';
import { Container, Header, View, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Icon, Item, Input, Label, Picker, CardItem, Card, Toast ,Tab,Tabs} from 'native-base';

import { EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _, SettingsUserInfo } from './../../../../../helpers/core-packages';

import iStyle from '../../../../resources/style/main-style.js'
import server, { ArticleGet,ArticleReservationGet } from './../../../../services/smart-community-server';

import Modal from "react-native-modal";

import Device from '../../../../contents/react-native-device-detection-val';
import { MainTapView } from "../../helpers/main-TapView";
import { ToolItem } from "../../helpers/tool-item";
import { ReceiveStatus } from "../../../../enums"
import { ToolReservationItem } from "../../helpers/tool-reservation-item";
interface Props {
    lang?: string;
    userInfo:SettingsUserInfo;
    

}
interface State {
    totalResults?: ArticleGet.Output[],
    nowLendList?: ArticleReservationGet.Output[],
    receiveList?: ArticleReservationGet.Output[],

    toolType :any,
    modalVisible: Boolean,
    modalId:string,
    adjustCount :number,
    index: number,
    selectedType :string,
    lendCount :string
}
 



@ConnectObservables({
    lang: lang.getLangObservable(),
    userInfo:Storage.getObservable("settingsUserInfo")

})


export class ToolPage extends Component<Props ,State> {

    state = {
        modalVisible: false,
        modalId : "",
        adjustCount: 0,
        index: 0,
        toolType:[],
        totalResults :[],
        nowLendList:[],
        receiveList:[],
        routes: [
            { key: 'tab1', title: "物品列表" },
            { key: 'tab2', title: "借用物品" },
            { key: 'tab3', title: "歸還紀錄" }
        ],
        child :{
            tab1: this.initRoute,
            tab2: this.initRoute,
            tab3: this.initRoute,
        },
        selectedType:"",
        lendCount:"1"
    };

    constructor(props) {
        super(props);
       
      }
    openModalVisible = (_data:ArticleGet.Output)=> {
        
        this.setState({
            modalVisible: true,
            modalId:_data.publicArticleId,
            adjustCount :_data.adjustCount-_data.lendCount
        });    
    
    }
    callLendApi= async() =>
    { 
        if (parseInt(this.state.lendCount) > this.state.adjustCount )
        {
            Alert.alert(_("a_toolFail"),_("a_countFail"))
            return;
        }
        let lendResults:any= await server.C("/public-article/reservation", {
            sessionId: this.props.userInfo.sessionId,
            publicArticleId:this.state.modalId,
            residentId:this.props.userInfo.residentId,
            lendCount: parseInt(this.state.lendCount)
        }).catch(err => {
            console.log(err);
        })
        console.log('lendResults' ,JSON.parse(lendResults)["reservationId"]);
        if( JSON.parse(lendResults)["reservationId"]!=undefined)
        {
            Alert.alert(_("a_toolsucess"),_("a_toolsucess"))
            this.closeModalVisible();
        }
       // this.closeModalVisible();
    }
    closeModalVisible = ()=> {

        this.setState({
            modalVisible: false
        });    
    
    }

    async componentWillReceiveProps(nextProps){

        if (nextProps.userInfo.residentId!=undefined){
            await this.getData(nextProps);
        }
    }

    async getData(Props)
    {
        let totalToolResults= await this.getTotlaTool(Props);
        let content:ArticleGet.Output[] = totalToolResults.content;
        let tempToolTypeArray =this.getTotalType(content);
        let nowLendList =await this.getNowLendList(Props);
        let receivelist =await this.getReceiveList(Props);
        console.log('nowLendList' ,nowLendList);
        this.setState({ 
            totalResults: [...totalToolResults.content],
            nowLendList:[...nowLendList],
            receiveList:[...receivelist],
            toolType :[...tempToolTypeArray],
            selectedType:tempToolTypeArray.length> 0 ? tempToolTypeArray[0]:""
        },
        function(){ 
            this.setState({
                child :{
                    tab1: this.totalRoute,
                    tab2: this.nowRoute,
                    tab3: this.receiveListRoute,
                },
            })
        }
        );

    } 
    async getNowLendList(Props: any) {
        let totalToolResults:any= await server.R("/public-article/reservation", {
            sessionId: Props.userInfo.sessionId,
            status:ReceiveStatus[1]
        }).catch(err => {
            console.log(err);
        })
        return totalToolResults.content;  
    }
    async getReceiveList(Props: any) {
        let totalToolResults:any= await server.R("/public-article/reservation", {
            sessionId: Props.userInfo.sessionId,
            status:ReceiveStatus[0]
        }).catch(err => {
            console.log(err);
        })
        return totalToolResults.content;  
    }

    async getTotlaTool(Props){
        let totalToolResults:any= await server.R("/public-article", {
            sessionId: Props.userInfo.sessionId,
        }).catch(err => {
            console.log(err);
        })
        return totalToolResults;
        
    }

    getTotalType(content)
    {
        let tempToolTypeArray =[];
        for (let i = 0; i < content.length; i++) {
            if (tempToolTypeArray.indexOf(content[i].type)==-1)
            tempToolTypeArray.push(content[i].type);
        }
        return tempToolTypeArray;
    }

    render() {
        return (
            <Content>
                <MainTapView state ={this.state}  title={_("m_ItemBorrowing")} child={this.state.child}  onPress = { (_index) => this.setState({ index:_index }) }  />
            
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
                             
                                <Text style={styles.btnText}>{_("t_lendCount")}</Text>
                                <View style={styles.inputView}>
                                    <Input
                                       // textAlign={'center'}
                                        style={[styles.form_control_input, styles.inputText ]}
                                        autoCapitalize='none'
                                        keyboardType='numeric'
                                        onChangeText={(val) =>  {this.setState({lendCount:val})} }
                                        value= {this.state.lendCount.toString()} />    
                                </View>
                                <Text style={styles.btnText}>{_('t_count')}</Text>
                                   
                            </Item>
                            <Item style={[styles.modalItem,iStyle.no_border]}>
                                <TouchableOpacity  onPress= {this.closeModalVisible} >
                                    <Image style={{height: "50%",alignSelf: 'flex-end'}} resizeMode="contain" source={ rcImages.close } ></Image>
                                </TouchableOpacity> 
                            </Item>
                            <Item style={[iStyle.no_border,styles.itemMargin,{marginTop:30}]}>
                                <Button style={[iStyle.item_button ,iStyle.alert_button,styles.btn]} full onPress= {this.callLendApi} >
                                    <Text style={styles.btnText}>{_("t_checklend")}</Text>
                                </Button>   
                                
                            </Item>
                           
                        </View>
                    </View>
                </Modal>
            


            </Content>
           
        )
    }
 
    totalRoute  =() => {
        console.log("firstRoute");
        return (
            <Content bounces={false} scrollEnabled={false} contentContainerStyle={{flex: 1}}>
                <ScrollView>
                    <View style={ [iStyle.imgBackground , iStyle.center,iStyle.mainView] } >
                        {this.selectToolType()}
                        {
                            this.state && this.state.totalResults && (
                            this.state.totalResults.map( (data ,i) => {
                                // return makeSmallToolItem(data, index);
                                if (this.state.selectedType==data.type){
                                    return <ToolItem onPress={ this.openModalVisible } key={i} data ={data} index={i}></ToolItem>

                                }

                            }))   
                        }
                    </View>        
                 </ScrollView>
            </Content>
        )
    };

    nowRoute  =() => {
        console.log("firstRoute");
        return (
            <Content bounces={false} scrollEnabled={false} contentContainerStyle={{flex: 1}}>
                <ScrollView>
                    <View style={ [iStyle.imgBackground , iStyle.center,iStyle.mainView] } >
                        {
                            this.state && this.state.nowLendList && (
                            this.state.nowLendList.map( (data ,i) => {
                                // return makeSmallToolItem(data, index);
                                return <ToolReservationItem onPress={ this.openModalVisible } key={i} data ={data} index={i}></ToolReservationItem>
                            }))   
                        }
                    </View>        
                 </ScrollView>
            </Content>
        )
    };   //receiveList
    receiveListRoute  =() => {
        console.log("firstRoute");
        return (
            <Content bounces={false} scrollEnabled={false} contentContainerStyle={{flex: 1}}>
                <ScrollView>
                    <View style={ [iStyle.imgBackground , iStyle.center,iStyle.mainView] } >
                        {
                            this.state && this.state.receiveList && (
                            this.state.receiveList.map( (data ,i) => {
                                // return makeSmallToolItem(data, index);
                                return <ToolReservationItem onPress={ this.openModalVisible } key={i} data ={data} index={i}></ToolReservationItem>
                            }))   
                        }
                    </View>        
                 </ScrollView>
            </Content>
        )
    };
    selectToolType(){
        return (
        <View style={[styles.pickerView]}>
            <Picker
                note
                mode="dropdown"
                style={styles.pickerText}
                selectedValue={this.state.selectedType}
                onValueChange={(value) => {
                    this.setState({ 
                        selectedType:value,
                    });
                    // lang.setLang(value);
                    // Storage.update("settingsLanguage", "lang", value);
                }}>
                { 
                    (() => {
                        //let list = ["工具","紙類"];
                        return Object.keys(this.state.toolType).map( (key) => {
                            return <Picker.Item key={key} label={_("t_"+this.state.toolType[key])} value={this.state.toolType[key]} />
                        })
                    })()
                }
            </Picker>
        </View>
            
        )
    }

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
        fontSize:"25rem"
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
    modalImageView:{
        width: '80%',
        height: '300 rem' , 
        backgroundColor:'white'
    },
    modalItem:{
        position:'absolute',
        top:5,right:5 ,
        height:50,
        width:50
    },
    btn:{
        height:'50 rem',
        width:'80%',
       
    },
    itemMargin:{
        height:70
    },
    inputView:{
        height :'60 rem',
        width: '55 rem',
    },
    form_control_input: {
        textAlign: 'center',
        borderColor:'#A4A5A4',
        borderWidth:2,
        
    },
    inputText: {

        // ...Device.select({
        //     phone: {  fontSize: 18  },
        //     tablet: { fontSize: 16  }
        // }),
        fontSize :'15rem',
        margin:0,
        height:'100%',
        width:'100%',
        color: 'black'
    }
});
  