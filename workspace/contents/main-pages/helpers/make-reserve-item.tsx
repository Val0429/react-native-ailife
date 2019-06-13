import React, {Component} from 'react';
import { Item , Label, View} from "native-base";
import {
    EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _
} from './../../../../helpers/core-packages';
import { GestureResponderEvent,Image , Dimensions ,Text, Button, TouchableOpacity } from 'react-native';
import iStyle from '../../../resources/style/main-style.js';
import Device from '../../../contents/react-native-device-detection-val';
import server,{ ＦacilityGet  } from '../../../services/smart-community-server';
import moment from 'moment';
import { ReceiveStatus,Week } from "../../../enums"


export function makeReserveItem( _data: ＦacilityGet.Output  ,index:number ,onPress?: (event: GestureResponderEvent) => void) {
    return ( 
        
        <Item regular key={index} style={[iStyle.no_border, styles.itemStyle]} >
           <TouchableOpacity style={{height:'100%', width:'100%'}} onPress={onPress || undefined} >
                <Grid style={{marginTop:20,marginBottom:20,marginLeft:15,marginRight:15}}  >
                    <Row size={1} >
                        <Col size={3}>
                            <Image style={[{height: "100%",width: "100%",alignSelf:'center'}]} resizeMode="cover"  source={{ uri:  server.getUrl()+_data.facilitySrc }} ></Image>
                        </Col>
                        <Col size={5}>
                            <Row size={1} style={[iStyle.center,{width:'100%'}]} >
                                <Text style={[styles.titleFontSize]}>{_data.name}</Text>   
                            </Row>
                            <Row size={1} style={[iStyle.center,{width:'100%'}]} >
                                <Text style={[styles.contentfontSize]}>{_("re_weel")}{Week[_data.openDates[0].startDay]}{_("re_andweel")}{Week[_data.openDates[0].endDay]}{_("re_open")}</Text>   
                            </Row>
                        </Col>
                        <Col size={1} style={[iStyle.center,{width:'100%'}]}>  
                            <Row size={1} >
                            </Row>
                            <Row size={1} style={[iStyle.center,{width:'100%'}]} >
                                <Image style={[{height: "60%"},styles.leftMargin]} resizeMode="contain" source={ rcImages.more } ></Image>
                            </Row>
                        </Col>
                    </Row>
                   
                </Grid>
           </TouchableOpacity>
           {/* //*/}
           {/* <Image style={[{height: "100%",} ,styles.leftMargin]} resizeMode="contain" source={ rcImages.beauty } ></Image> */}

        </Item>  
    );
}

const styles = EStyleSheet.create({
    topMargin:{
       
    },
    leftMargin:{
        position: 'absolute', 
        left: 0,
        top:5
    },
    itemStyle: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%', 
        ...Device.select({
          phone: { height: 150,  marginTop: 10 , borderRadius: 5 },
          tablet: { height: 150, marginTop: 10 , borderRadius: 5 }
        })
    },
    titleFontSize:{
        fontSize :"16rem", 
        position: 'absolute', 
        left: 10,
        bottom:10
        // alignSelf: 'flex-end',
        
    },
    contentfontSize:{
        fontSize :"16rem",
        color:'$mainGray',
        position: 'absolute', 
        left: 10,
        top:10

        // marginLeft:'14rem'
    }

});