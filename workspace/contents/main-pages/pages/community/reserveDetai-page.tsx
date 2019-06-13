import React, {Component} from 'react';
import {Platform, StatusBar, Image, NativeModules, requireNativeComponent , ImageBackground, TouchableOpacity, ScrollView, Alert} from 'react-native';
import { Container, Header, View, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Icon, Item, Input, Label, Picker, CardItem, Card, Toast } from 'native-base';

import { EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _, SettingsUserInfo } from './../../../../../helpers/core-packages';

import { makeMainButton } from './../../helpers/make-main-button';
import { HeaderContainer } from '../../helpers/header-container';
import iStyle from '../../../../resources/style/main-style.js'
import Device from '../../../../contents/react-native-device-detection-val';
import moment, { now } from 'moment';
import Modal from "react-native-modal";
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import server, { ＦacilityGet } from './../../../../services/smart-community-server';
import { ReceiveStatus ,Week } from "../../../../enums"
import { CustomPicker } from 'react-native-custom-picker'

interface Props {
    lang?: string;
    data:ＦacilityGet.Output;
    modalVisible:boolean,
    radio_props:any[],
    changeRedio:string,
    userInfo:SettingsUserInfo;
    dayRange:string[],
    personRange:number[],
    timeRangeArray:string[],
    changeDay:string,
    changeTime:string,
    changePersonLimit:number
}

// var radio_props = [
//     {label: '男  ', value: "male" },
//     {label: '女  ', value: "female" }
// ];
@ConnectObservables({
    lang: lang.getLangObservable(),
    userInfo:Storage.getObservable("settingsUserInfo")
})

export class ReserveDetaiPage extends Component<Props> {
    timeArray:number[] = [8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]
    state = {
        modalVisible: false,
        radio_props :[],
        dayRange:[],
        personRange:[],
        timeRangeArray:[],
        changeRedio:"",
        changeDay:"",
        changeTime:"",
        changePersonLimit:0,
    
        //moment().add(7, 'days');
    };
   
    componentDidMount()
    {  
        
    }

    render() {
        return (
            <HeaderContainer notSroll={true}  backBtn={true} title={_("m_FacilityReservationInfo")} children={this.content()} />
        )
    }
    async componentWillReceiveProps(nextProps){
       let personLimitList= this.getPersonLimitList(nextProps);
       let dayLimitList= this.getDayRangeList();

       
        await this.setState({
            dayRange:dayLimitList,
            personRange:personLimitList,
            changePersonLimit: personLimitList.length>0 && personLimitList[0],
            changeDay: dayLimitList.length>0 && dayLimitList[0]
        })
        if ( dayLimitList.length>0 ) await this.getTimeRang(dayLimitList[0])

   
    }

    getPersonLimitList(props:Props){
        let tmp = []
        for (let index = 1; index <=props.data.limit; index++) {
            tmp.push(index);
        }
        return tmp;
    }

    getDayRangeList()
    {
        let tmpDayRange = []
        for (let index = 1; index < 11; index++) {
            var new_date = moment().add(index,'days');
            tmpDayRange.push(new_date.format("YYYY/MM/DD"))
        }
        return tmpDayRange;
    }

    content() {
        let data =this.props.data ;

        return (
            
            <Container  >
                {this.createModal()}
                <StatusBar hidden/>
                <Content bounces={false} contentContainerStyle={[{height:'100%'},styles.contentContainerStyle]} scrollEnabled={true}  >
                <ScrollView>
                    <View style={ [iStyle.imgBackground , iStyle.center,styles.mainView, ,{height:200}]} >
                        <ImageBackground style={ [styles.mainView,{width:'100%',height:'100%',justifyContent: 'flex-end'}] } resizeMode='cover' source={{ uri:  server.getUrl()+data.facilitySrc }}  >
                            <Item regular style={[iStyle.no_border,styles.title]}>
                                <Text style={[iStyle.mainTitleText,styles.titleText]}>{data.name}</Text>
                            </Item>
                        </ImageBackground>
                       
                    </View>
                   
                    <View style={ [iStyle.imgBackground , iStyle.center,styles.mainView,{width:'80%',}]} >
                    
                        <Item regular style={[iStyle.no_border,styles.title,styles.itemMarginTop]}>
                            <Text style={[iStyle.mainContetText]}>{_("re_opentime")}</Text>
                        </Item>
                        { data && data.openDates && (
                                data.openDates.map( (optionsData:ＦacilityGet.dateFormate ,index) => {
                                return [
                            
                                    <Item key={"opentime"+index} regular style={[iStyle.no_border,styles.title,styles.itemMarginTop]}>
                                        <Text style={[iStyle.mainContetText]}>{_("re_weel")}{Week[optionsData.startDay]}{_("re_andweel")}{Week[optionsData.endDay]}</Text>
                                    </Item>,
                                    <Item key={"opentime2"+index} regular style={[iStyle.no_border,styles.title,styles.itemMarginTop]}>
                                        <Text style={[iStyle.mainContetText]}>{moment(optionsData.startDate).format("HH:mm")} ~ {moment(optionsData.endDate).format("HH:mm")}</Text>
                                    </Item>
                                ]
                                 
                            }))   
                            }
                        <Item regular style={[iStyle.no_border,styles.title,styles.itemMarginTop]}>
                            <Text style={[iStyle.mainContetText]}>{_("re_dec")}</Text>
                        </Item>
                        <Item regular style={[iStyle.no_border,styles.title,styles.itemMarginTop]}>
                            <Text style={[iStyle.mainContetText]}>{data.description}</Text>
                        </Item>
                        <Item regular style={[iStyle.no_border,styles.title,styles.itemMarginTop]}>
                            <Text style={[iStyle.mainContetText]}>{_("re_limit")}</Text>
                        </Item>
                        <Item regular style={[iStyle.no_border,styles.title,styles.itemMarginTop]}>
                            <Text style={[iStyle.mainContetText]}>{data.limit} {_("re_people")} </Text>
                        </Item>

                        <Item regular style={[iStyle.no_border,styles.title,styles.itemMarginTop]}>
                            <Text style={[iStyle.mainContetText]}>{_("re_bonus")}</Text>
                        </Item>
                        <Item regular style={[iStyle.no_border,styles.title,styles.itemMarginTop,]}>
                            <Text style={[iStyle.mainContetText]}>{data.pointCost} {_("re_pointCost")} </Text>
                        </Item>

                        <Item regular style={[iStyle.no_border,{marginTop:20}]}>
                            <Button style={iStyle.scan_button} primary full onPress={() => this.setState({ modalVisible: true})    }>
                                <Text style={styles.item_input}>{_("m_rec")}</Text>
                            </Button>                
                        </Item>

                        <Item regular style={[iStyle.no_border,styles.title,styles.itemMarginTop,]}>
                        </Item>

                      
                    </View>
                

                </ScrollView>
                   
                </Content>
            </Container>
           
           
        )
    }

    callReserveApi= async() =>
    { 
        if (this.state.timeRangeArray.indexOf(this.state.changeTime) ==-1)
        {
            Alert.alert(_("a_fail"),_("a_timeFail"));
            return;
        }
        let startDay:Date = new Date(this.state.changeDay + " " +this.timeToTimeFormat(this.state.changeTime).split("~")[0]);
        let endDay:Date = new Date(this.state.changeDay + " " +this.timeToTimeFormat(this.state.changeTime).split("~")[1]);
        let results:any= await server.C("/public-facility/reservation", {
            sessionId: this.props.userInfo.sessionId,
            publicFacilityId:this.props.data.publicFacilityId,
            residentId:this.props.userInfo.residentId,
            count: this.state.changePersonLimit,
            reservationDates:{
                startDate:startDay,
                endDate :endDay
            }
        }).catch(err => {
            console.log(err);
        })
        if (JSON.parse(results)["reservationId"])
        {
            Alert.alert(_("a_sucess"),_("a_sucess"))
        }else{
            Alert.alert(_("a_fail"),_("a_fail"))
        }
        //this.closeModalVisible();
    }
    timeToTimeFormat(time){
        if (time==24)
        {
            return "24:00~00:00"
        }else{
            return time+":00~"+(parseInt(time)+1)+":00";
        }
      
    }
    closeModalVisible = ()=> {
        this.setState({ modalVisible: false});    
    }
    getTimeRang= async (day)=> {
        console.log('day' , day)
        let results:any= await server.R("/public-facility/available-time", {
            sessionId: this.props.userInfo.sessionId,
            publicFacilityId:this.props.data.publicFacilityId,
            date:day
        }).catch(err => {
            console.log(err);
        });
        console.log('results.hours' , results.hours);
        this.setState({ 
           timeRangeArray: results.hours,
           changeTime : results.hours.length>0&& results.hours[0]
        });    
    
    }

    renderOption = (settings)=> {
        const { item, getLabel } = settings
        return (
          <View style={styles.optionContainer}>
            <View style={[styles.innerContainer  ]}>
              <Text style={[ styles.renderOption, this.state.timeRangeArray.indexOf(item) ==-1 && { color:'red'} ]}>{ this.timeToTimeFormat(getLabel(item)) }</Text>
            </View>
          </View>
        )
    }
    renderField = (settings) => {
        const { selectedItem, defaultText, getLabel, clear } = settings
        return (
          <View style={[styles.container,{width:'100%'}]}>
              {!selectedItem && <Text style={[styles.text, { color: 'grey' }]}>{defaultText}</Text>}
              {selectedItem && (
                <View style={styles.innerContainer}>
                  <Text style={[styles.text, styles.renderField,this.state.timeRangeArray.indexOf(selectedItem) ==-1 && {  color: 'red' }]}>
                    {   this.timeToTimeFormat(getLabel(selectedItem))}
                  </Text>
                </View>
              )}
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
            <View style={[styles.modalView,]} >
                <View style={[styles.modalImageView,iStyle.center]}>
                    <Item style={[iStyle.no_border,iStyle.center,{marginTop:50}]}>
                        <Text style={styles.modalContent}>{_("r_checkDate")}</Text>
                    </Item>
                    <Item style={[iStyle.no_border,iStyle.center , styles.pickerItem]}>
                       
                        <Picker
                            mode="dialog"
                            style={styles.picker}
                            selectedValue={this.state.changeDay}
                            itemStyle={styles.pickerIosListItemContainer}
                            itemTextStyle={styles.pickerIosListItemText}
                            onValueChange={async (value)=>{
                               await this.getTimeRang(value);
                               await this.setState({changeDay:value})
                            }}>
                            {
                                (() => {
                                return Object.keys(this.state.dayRange).map( (key) => {
                                    return <Picker.Item  key={key} label={this.state.dayRange[key]} value={this.state.dayRange[key]} />
                                    })
                                })()                   
                            }
                                               
                        </Picker>
                      
                    </Item>
                    
                    <Item style={[iStyle.no_border,iStyle.center,{marginTop:20}]}>
                        <Text style={styles.modalContent}>{_("r_checkTime")}</Text>
                    </Item>

                    <Item style={[iStyle.no_border,iStyle.center]}>
                        {this.state.timeRangeArray.length==0 &&
                        <Text style={styles.modalContent}>{_("r_nocantime")}</Text>
                        }
                        {this.state.timeRangeArray.length>0 && 
                            <CustomPicker
                            fieldTemplateProps={{
                                textStyle : {fontSize:225 ,color: 'red'}
                            }}
                           
                            defaultValue={this.state.changeTime}
                            optionTemplate={this.renderOption}
                            fieldTemplate={this.renderField}
                            options={this.timeArray}
                            onValueChange={value => {
                                this.setState({changeTime:value})
                          //  Alert.alert('Selected Item', value || 'No item were selected!')
                            }}
                        />
                     
                        }
                    </Item>

                    <Item style={[iStyle.no_border,iStyle.center,{marginTop:20}]}>
                        <Text style={styles.modalContent}>{_("r_checkperson")}</Text>
                    </Item> 

                    <Item style={[iStyle.no_border,iStyle.center,styles.pickerItem]}>
                        <Picker
                            enabled={this.state.personRange.length!=0}
                            mode="dialog"
                            style={styles.picker}
                            itemStyle={styles.pickerIosListItemContainer}
                            itemTextStyle={styles.pickerIosListItemText}
                            selectedValue={this.state.changePersonLimit}
                            onValueChange={(value) => {
                                console.log('value' ,value)
                                this.setState({changePersonLimit:value})
                            }}>
                            {
                                (() => {
                                return Object.keys(this.state.personRange).map( (key) => {
                                    return <Picker.Item  key={key} label={this.state.personRange[key].toString()} value={this.state.personRange[key]} />
                                    })
                                })()                   
                            }                    
                        </Picker>
                    </Item>


                    <Item style={[styles.modalItem,iStyle.no_border]}>
                        <TouchableOpacity  onPress= {this.closeModalVisible} >
                            <Image style={{height: "50%",alignSelf: 'flex-end'}} resizeMode="contain" source={ rcImages.close } ></Image>
                        </TouchableOpacity> 
                    </Item>
                    
                    <Item style={[iStyle.no_border,iStyle.center,{marginTop:20}]}>
                        <Text style={styles.modalContent}>{_("r_point")} {this.props.data.pointCost* this.state.changePersonLimit} </Text>
                    </Item> 


                    <Item style={[iStyle.no_border,styles.itemMargin,{marginTop:30}]}>
                        <Button style={[iStyle.item_button ,iStyle.alert_button]} full onPress= {this.callReserveApi}  >
                            <Text style={styles.btnText}>{_("r_checkreserve")}</Text>
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
        width:'100%',
        alignSelf: 'center', 
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    itemMarginTop:{
        marginTop:0,
    },
    btnText:{
        fontSize:"18rem"
    },
    modalImageView:{
        width: '80%',
        height: '500 rem' , 
        backgroundColor:'white'
    },
    title:{
      //  marginTop:40, 
        alignSelf: 'center', 
        justifyContent: 'flex-start',
        alignItems: 'center',
        width:'100%',
       
        ...Device.select({
            phone: {  height:40 },
            tablet: {  height:40}
          }),
    },
    modalContent:{
        fontSize:"20rem"
    },
    cancelPadding:{
        padding:0,
        margin:0
    },
 
    contentContainerStyle:{
        backgroundColor:'rgb(241,243,241)',
    },
    titleText:{
        marginBottom:'30 rem',
        marginLeft:'30 rem',
        color:'white'
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
    picker:{

         width: Platform.OS ==='ios' ? '100%' : '3rem',
        height: Platform.OS === "android" ? '40 rem' : '45 rem',
      
        // width: Platform.OS === 'ios' ? undefined : 120,
    },
    optionContainer: {
        padding: 10,
        borderBottomColor: 'grey',
        borderBottomWidth: 1
    },
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'stretch'
    },
    box: {
        width: 20,
        height: 20,
        marginRight: 10
    },
    pickerIosListItemContainer: {
        flex: 1,
        height: 60,
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      pickerIosListItemText: {
        fontSize: '16rem',
    },
    pickerItem:{
         width:Platform.OS=="android" ? '150 rem' : '100%'
    },
    renderOption:{
         color: 'black', 
         alignSelf: 'flex-start' ,
         fontSize :'16rem'
    },
    renderField:{
        fontSize :'20rem'
    }

});
  