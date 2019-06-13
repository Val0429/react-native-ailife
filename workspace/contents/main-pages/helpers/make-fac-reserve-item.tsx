import React, {Component} from 'react';
import { Item , Label, View} from "native-base";
import {
    EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _
} from './../../../../helpers/core-packages';
import { GestureResponderEvent,Image , Dimensions ,Text, Button, TouchableOpacity } from 'react-native';
import iStyle from '../../../resources/style/main-style.js';
import Device from '../../../contents/react-native-device-detection-val';
import { FacilityReservationGet } from '../../../services/smart-community-server';
import moment from 'moment';


export function makeFacReserveItem( _data: FacilityReservationGet.Output  ,index:number ,onPress?: (event: GestureResponderEvent) => void) {
    return ( 
        
        <Item regular key={index} style={[iStyle.no_border, styles.itemStyle]} >
           <TouchableOpacity style={{height:'100%', width:'100%'}} onPress={onPress || undefined} >
                <View style={{marginTop:10,marginLeft:15,marginRight:15}} >
                        <Item style={[iStyle.center,iStyle.no_border,styles.smallItemStyle ]}>
                            <Text style={[ styles.titleFontSize ,{textAlign:'left'}]}>{_data.publicFacilityname}</Text>   
                        </Item> 
                        <Item style={[iStyle.center,iStyle.no_border,styles.smallItemStyle ,{borderBottomWidth:1,width:'100%'}]}>
                        </Item> 
                        <Item style={[iStyle.center,iStyle.no_border,styles.smallItemStyle , ]}>
                            <Text style={[styles.modalcontent,styles.contentfontSize]}>{_("r_timeRange")} : </Text>   
                        </Item> 
                        <Item style={[iStyle.center,iStyle.no_border,styles.smallItemStyle , ]}>
                            <Text style={[styles.modalcontent,styles.contentfontSize]}>{moment(_data.reservationDates.startDate).format("YYYY/MM/DD HH:mm")} ~ {moment(_data.reservationDates.endDate).format("HH:mm")} </Text>   
                        </Item> 
                        <Item style={[iStyle.center,iStyle.no_border,styles.smallItemStyle , ]}>
                            <Text style={[styles.modalcontent,styles.contentfontSize]}>{_("r_personCount")} : {_data.count}</Text>   
                        </Item> 
                        <Item style={[iStyle.center,iStyle.no_border,styles.smallItemStyle , {marginBottom:20}]}>
                            <Text style={[styles.modalcontent,styles.contentfontSize]}>{_("r_point")} : {_data.publicFacilityPointCost*_data.count}</Text>    
                        </Item> 
                        {/* <Item style={[iStyle.center,iStyle.no_border,styles.smallItemStyle]}>
                            <Text style={[styles.modalcontent,styles.contentfontSize]}>{_("v_note")}:</Text>    
                        </Item>  */}
                    </View>
                    {/* <View style={{ alignSelf: 'flex-start' ,marginLeft:20 ,marginBottom:20 ,}}>
                            <Text  style={[styles.contentfontSize ]} >
                            {_data.memo}
                            </Text>
                    </View> */}
           
           </TouchableOpacity>
         
        </Item>  
    );
}

const styles = EStyleSheet.create({
    topMargin:{
       marginTop:20
    },
    rightMargin:{
        position: 'absolute', right: 0,top:10
    },
    itemStyle: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%', 
        ...Device.select({
          phone: { marginTop: 10 , borderRadius: 5 },
          tablet: { marginTop: 10 , borderRadius: 5 }
        })
    },
    titleFontSize:{
        fontSize :"26rem",
        
    },
    contentfontSize:{
        fontSize :"16rem",
    },
    smallItemStyle: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'flex-start',
        alignSelf: 'flex-start',
        marginTop:10
       
    }

});