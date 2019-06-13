import React, {Component} from 'react';
import { ImageBackground, ScrollView  ,Image ,TouchableOpacity} from 'react-native';
import { Container, Header, View, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Icon, Item, Input, Label, Picker, CardItem, Card, Toast ,Tab,Tabs} from 'native-base';

import { EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _, SettingsUserInfo } from './../../../../../helpers/core-packages';

import iStyle from '../../../../resources/style/main-style.js'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import server, { CalendarGet } from './../../../../services/smart-community-server';
import { makeGasItem } from '../../helpers/make-gas-item';
import { makeContactItem  } from '../../helpers/make-contact-item';
import Modal from "react-native-modal";

import Device from '../../../../contents/react-native-device-detection-val';
import moment from 'moment';
import { MainTapView } from "../../helpers/main-TapView";
import { Calendar, CalendarList, Agenda ,LocaleConfig } from 'react-native-calendars';
import Arrow from 'react-native-arrow'



interface Props {
    lang?: string;
    userInfo:SettingsUserInfo;

}
interface State {
    results?: CalendarGet.Output[];
    modalVisible: Boolean,
    modalTitle:string,
    modalContent:string,
    index: number,
    loadFinish:boolean
}
 



@ConnectObservables({
    lang: lang.getLangObservable(),
    userInfo:Storage.getObservable("settingsUserInfo")
})


export class CalenderPage extends Component<Props ,State> {

    state = {
        modalVisible: false,
        modalTitle : "",
        modalContent : "",
        index: 0,
        results :[],
        loadFinish:false
      
    };

    constructor(props) {
        super(props);
        LocaleConfig.locales['tw'] = {
            monthNames: ['1','2','3','4','5','6','7','8','9','10','11','12'],
            monthNamesShort:['1','2','3','4','5','6','7','8','9','10','11','12'],
            dayNames: ['週日','週一','週二','週三','週四','週五','週六'],
            dayNamesShort:  ['週日','週一','週二','週三','週四','週五','週六']
          };
          
          LocaleConfig.defaultLocale = 'tw';
    }

    closeModalVisible = ()=> {
        this.setState({modalVisible: false});    
    }

    scheduleClick =(_data: CalendarGet.Output)=>{
        this.setState({
            modalVisible:true,
            modalTitle:_data.title,
            modalContent:_data.content
        })
    }

    async componentWillReceiveProps(nextProps){
        console.log(nextProps.userInfo)
        if (nextProps.userInfo.residentId!=undefined){
            await this.getData(nextProps);
        }
    }

    async getData(Props)
    {
        let results:any= await server.R("/public-calendar", {
            sessionId: Props.userInfo.sessionId
        }).catch(err => {
            console.log(err);
        });
        console.log('results' ,results);
        this.setState({ 
            results: [...results],
            loadFinish:true
        }
        );

    } 

   
    render() {

        return (
           
            <Content>
                 {this.createModal()}
                <MainTapView state ={this.state} mainView={this.initCalender()} title={_("m_CommunityCalendar")} onPress = { (_index) => this.setState({ index:_index }) }  />
            </Content>
           
        )
    }
    checkScheDay(_date){
        let tempRowList:Element[]=[];
        let results:CalendarGet.Output[] =this.state.results;
        let test = 0;
        for (let i = 0; i < results.length; i++) {
            let check= false;
           
            let schText =""
           // if (results.length>i){
                if (test>=3) continue;
                if (_date.dateString >= moment(results[i].date.startDate).format("YYYY-MM-DD")) 
                {
                    if (_date.dateString <= moment(results[i].date.endDate).format("YYYY-MM-DD"))
                    {
                        check =true;
                    }
                    if (_date.dateString == moment(results[i].date.startDate).format("YYYY-MM-DD")){
                        schText = results[i].title
                    }

                    if (schText.length>4) schText=  schText.substr(0,4)
                    if (check){
                        tempRowList.push(this.returnRow(check ,_date.day+i,schText, results[i]));
                        test++;
                    }
                  
                    
                    

                }
            //}
        }
        console.log('test' ,test)
        for (let index = test; index < 3; index++) {
            console.log('index',index)
            tempRowList.push(this.returnRow(false ,index,"", null));

        }
       
        return tempRowList;
    }
   
    returnRow(isSchDay:boolean,key,schText:string,_date:CalendarGet.Output):any{
        return (
            <TouchableOpacity key={key} style={[styles.row ,{marginTop:2, width:'100%'}]}  onPress={ ()=>{isSchDay && this.scheduleClick(_date) } } >
                <Row style={[ isSchDay && styles.eventBackgroundColor,styles.row,iStyle.center 
                    // this.chackeEventStartDay(date.dateString) && styles.eventStart,this.chackeEventEndDay(date.dateString) && styles.eventEnd
                ]}>
                    <Text style={styles.rowText}>{schText}</Text>
                </Row>
            </TouchableOpacity>
            
        )
    }

    initCalender () {
       return (
        <View style={ [iStyle.imgBackground , iStyle.center,styles.mainView] } >
        
            {this.state.loadFinish && 
            
           <Calendar
                // Specify style for calendar container element. Default = {}
                style={{
                    borderWidth: 1,
                    borderColor: 'gray',
                    height: 'auto',
                    width:'100%',
                }}
                monthFormat={'yyyy/MM'}
                weekStart={2}
                
                // onDayPress={(day) => {console.log('selected day', day)}}
                dayComponent={({date, state}) => {
                    // let check=  this.checkDay(date)
                    // if (check)
                    // {
                        return (
                            <Item style={styles.day}>
                                <Grid style={[iStyle.center,{width:'100%'}]}>
                                        <Row style={[{ height:10,backgroundColor: state === 'today' ? '#70871B' : 'white' } ]} >
                                        {state=="today"&& 
                                            <Text style={{textAlign: 'center', color: 'white'}}>{date.day}</Text>
                                        }

                                        {state!="today"&& 
                                            <Text style={{textAlign: 'center', color: state === 'disabled' ? 'gray' : 'black'}}>{date.day}</Text>
                                        }
                                        </Row>
                                       
                                       
                                        {this.checkScheDay(date)}
                                    </Grid>    
                            </Item>
                            
                        );
                  
                  }}
                markingType={'period'}
                // markedDates={
                //     {'2019-03-20': {textColor: 'green'},
                //      '2019-03-22': {startingDay: true, color: 'green'},
                //      '2019-03-23': {selected: true, endingDay: true, color: 'green', textColor: 'gray'},
                //      '2019-03-04': {disabled: true, startingDay: true, color: 'green', endingDay: true}
                //     }}
                theme={{
                    backgroundColor: 'red',
                    calendarBackground: 'white',
                    textSectionTitleColor: '#b6c1cd',
                    selectedDayBackgroundColor: '#00adf5',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#00adf5',
                    dayTextColor: '#2d4150',
                    textDisabledColor: '#d9e1e8',
                    dotColor: '#00adf5',
                    selectedDotColor: '#ffffff',
                    arrowColor: 'white',
                    monthTextColor: 'blue',
                    textDayFontFamily: 'monospace',
                    textMonthFontFamily: 'monospace',
                    textDayHeaderFontFamily: 'monospace',
                    textMonthFontWeight: 'bold',
                    textDayFontSize: 16,
                    textMonthFontSize: 16,
                    textDayHeaderFontSize: 16,  
                    'stylesheet.calendar.header': {
                        header: {
                          backgroundColor: '#A0C251', // set the backgroundColor for header
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          margin:0,
                        },
                        monthText: {
                            color: '#fff',
                            fontWeight: '700',
                            fontSize: 16,
                        },
                        dayHeader: {
                            color: 'black',
                          },
                    },
                }}
            />
            }
       </View>
       )
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
             <Content bounces={false} scrollEnabled={false} contentContainerStyle={{flex: 1}}>
                <ScrollView>
                    <View style={[styles.modalView,]} >
                        <View style={[styles.modalImageView,iStyle.center,{justifyContent:"flex-start"}]}>
                    <Item style={[iStyle.no_border,iStyle.center,{marginTop:30,width:'90%',height:50} ,iStyle.bottomBorder]}>
                        <Text numberOfLines={1} ellipsizeMode='tail'  style={styles.modalTitle}>{this.state.modalTitle}</Text>
                    </Item>
                    <Item style={[iStyle.no_border,iStyle.center,{minHeight:50,width:'90%',alignContent:'flex-start'}]}>
                        <Text style={styles.modalcontent}> {this.state.modalContent}</Text>
                    </Item>
                    <Item style={[styles.modalItem,iStyle.no_border]}>
                        <TouchableOpacity  onPress= {this.closeModalVisible} >
                            <Image style={{height: "50%",alignSelf: 'flex-end'}} resizeMode="contain" source={ rcImages.close } ></Image>
                        </TouchableOpacity> 
                          
                    </Item>
                   
                </View>
                    </View>
                </ScrollView>
             </Content>
        
        </Modal>
    

        )
    }
}  




const styles = EStyleSheet.create({
    mainView:{
        backgroundColor:'rgb(241,243,241)',
        justifyContent:"flex-start",
        paddingLeft:20,
        paddingRight:20,
        paddingTop:10,
        paddingBottom:30,
    },
    row:{
      ...Device.select({
        phone: { height: 20, },
        tablet: { height: 20}
      })
     
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
        ...Device.select({
            phone: {  width: 300,minHeight: 300  },
            tablet: {  width: 300,minHeight: 300  }
        }),
        backgroundColor:'white',

    },
   
    modalTitle:{
        fontSize:'20rem', 
        position: 'absolute', 
        left: 0,
        width:'100%'
    },
    modalItem:{
        position:'absolute',
        top:5,right:5 ,
        height:50,
        width:50
    },
    modalcontent:{
        fontSize:'18rem', 
        textAlign:'left',
        width:'100%'
    },
    day:{
        justifyContent: 'center', 
        width:'100%',
        alignItems: 'flex-start',
        ...Device.select({
            phone: { height:86, },
            tablet: { height:86 }
        }),
    },
    loginText: {
        ...Device.select({
          phone: { fontSize: 19, },
          tablet: { fontSize: 16}
        }),
        color: 'black'
    },
    marginLeft:{
    },
    textInput_mult:{
        textAlign:'left',
        textAlignVertical:'top',
        alignSelf:'flex-start',
        justifyContent:'flex-start',
        alignItems:'flex-start', 
        width:'100%'
    },
    item_input: {
        color: "white",
        fontSize: "22 rem"
    },
    btn:{
        position:'absolute',
        bottom:0,
    },
    eventStart:{
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: 2,
        borderTopRightRadius: 0,
        borderBottomWidth: 1.5,
        borderRightWidth: 0,
        borderTopWidth: 1.5,
        borderLeftWidth: 1.5,
        borderBottomColor: 'white',
        borderRightColor: 'transparent',
        borderTopColor: 'white',
        borderLeftColor: 'white'
     
    },
    eventEnd:{
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 2,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 2,
        borderBottomWidth: 1.5,
        borderRightWidth: 1.5,
        borderTopWidth: 1.5,
        borderLeftWidth: 0,
        borderBottomColor: 'white',
        borderRightColor: 'white',
        borderTopColor: 'white',
        borderLeftColor: 'transparent'
        // borderTopRightRadius:6,
        // borderBottomRightRadius:6,
        // borderWidth: 1.5,
        // borderColor: 'white',
    },
    eventBackgroundColor:{
         width:'100%' ,backgroundColor:'#C6E292'
    },
    rowText:{
        textAlign: 'center', color: 'black',fontSize:'12 rem'
    }

});
  