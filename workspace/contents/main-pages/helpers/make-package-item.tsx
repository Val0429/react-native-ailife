import React, {Component} from 'react';
import { Item , Label, View} from "native-base";
import {
    EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _
} from './../../../../helpers/core-packages';
import { GestureResponderEvent,Image , Dimensions ,Text, Button, TouchableOpacity } from 'react-native';
import iStyle from '../../../resources/style/main-style.js';
import Device from '../../../contents/react-native-device-detection-val';
import server, { PackageGet }  from '../../../services/smart-community-server';
import moment from 'moment';

import { ReceiveStatus } from "../../../enums"

export function makePackageItem( _data: PackageGet.Output  ,index:number ,onPress?: (event: GestureResponderEvent) => void) {
    return ( 
        
        <Item regular key={index} style={[iStyle.no_border, styles.itemStyle]} >
           <TouchableOpacity style={{height:'100%', width:'100%'}} onPress={onPress || undefined} >
                <Grid style={{marginTop:10,marginBottom:20,marginLeft:15,marginRight:15}}  >
                    <Row size={1} style={iStyle.bottomBorder} >
                        <Col size={5} >
                            <Text style={[{marginTop:10},styles.titleFontSize]}>{moment(_data.date).format("YYYY/MM/DD")} 寄放</Text>   
                        </Col>
                        <Col size={3}  >
                            {_data.status==ReceiveStatus.unreceived.toString() && 
                             <Text style={[{color:'red'},styles.rightMargin ,styles.titleFontSize]}>未領取</Text>   
                            }
                            {_data.status==ReceiveStatus.received.toString() && 
                             <Text style={[{color:'black'},styles.rightMargin ,styles.titleFontSize]}>已領取</Text>   
                            }
                           
                        </Col>
                    </Row>
                    <Row size={2} >
                        <Col size={3} style={styles.topMargin} >
                            <Image style={[{height: "100%",width: "100%",alignSelf:'center'}]} resizeMode="cover"  
                              source={{ uri:  server.getUrl()+_data.packageSrc }}
                            // source={{ uri: `http://172.16.10.21:6060/images/oPMs70Twro_package_1552022339396.png` }}
                            //  source={ _data.image } 
                            ></Image>
                        </Col>
                        <Col size={5} style={styles.topMargin} >
                            {/* <Row size={1} >
                                <Text style={[styles.modalcontent,styles.contentfontSize]}>{ server.getUrl()+_data.image}</Text>   
                            </Row> */}
                            <Row size={1} >
                                <Text style={[styles.modalcontent,styles.contentfontSize]}>寄件人:{_data.sender}</Text>   
                            </Row>
                            <Row size={1} >
                                <Text style={[styles.modalcontent,styles.contentfontSize]}>收件人:{_data.receiver}</Text>   
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
          phone: { height: 180,  marginTop: 10 , borderRadius: 5 },
          tablet: { height: 180, marginTop: 10 , borderRadius: 5 }
        })
    },
    titleFontSize:{
        fontSize :"18rem"
    },
    contentfontSize:{
        fontSize :"16rem",
        marginLeft:'14rem'
    }

});