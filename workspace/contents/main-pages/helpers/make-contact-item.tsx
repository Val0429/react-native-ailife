import React, {Component} from 'react';
import { Item , Label, View} from "native-base";
import {
    EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _
} from './../../../../helpers/core-packages';
import { GestureResponderEvent,Image , Dimensions ,Text, Button, TouchableOpacity } from 'react-native';
import iStyle from '../../../resources/style/main-style.js';
import Device from '../../../contents/react-native-device-detection-val';
import { ContactGet } from '../../../services/smart-community-server';
import { ReceiveStatus } from "../../../enums"
import moment from 'moment';


export function makeContactItem( _data: ContactGet.Output  ,index:number  ,nama:string,onPress?: (event: GestureResponderEvent ) => void) {
    return ( 
        //this.state.expanded ? styles.itemStyle :iStyle.gasitemStyle
        <Item regular key={index} style={[iStyle.no_border, _data.replys.length> 0 ? styles.bigItemStyle :styles.itemStyle ]} >
           <TouchableOpacity style={{height:'100%', width:'100%'}} onPress={onPress || undefined} >
           <Grid style={{marginTop:10,marginBottom:0,marginLeft:15,marginRight:15}}  >
                    <Row size={1} style={[iStyle.bottomBorder,{marginBottom:10}]} >
                        <Col size={5} >
                            <Text numberOfLines={1} ellipsizeMode='tail' style={[{marginTop:10},styles.titleFontSize]}>{_data.title}</Text>   
                        </Col>
                        <Col size={3} >
                            {_data.replys.length==0 && 
                             <Text style={[{color:'red'},styles.rightMargin ,styles.titleFontSize]}>{_("c_listening")}</Text>   
                            }
                            {_data.replys.length>0 && 
                             <Text style={[styles.rightMargin ,styles.titleFontSize,styles.yellow]}>{_("c_listened")}</Text>   
                            }
                           
                        </Col>
                    </Row>
                    <Row size={2} >
                       
                        <Col>
                            {/* <Row size={1} >
                                <Text style={[styles.contentfontSize]}>{_("c_contentDetail")}:{_data.content}</Text>   
                            </Row> */}
                            {/* <Row size={1} >
                                <Text style={[styles.contentfontSize]}>{_("c_namer")}:{nama}</Text>   
                            </Row>
                            <Row size={1} >
                                <Text style={[styles.contentfontSize]}>{_("c_file")} {_data.attachmentSrc!="" ? _("c_have"): _("c_dont") } </Text>   
                            </Row> */}

                            <Text style={[styles.contentfontSize]}>{_("c_contentDetail")}:{_data.content}</Text> 
                            <Text style={[styles.contentfontSize]}>{_("c_namer")}:{nama}</Text>    
                            <Text style={[styles.contentfontSize]}>{_("c_file")} {_data.attachmentSrc!="" ? _("c_have"): _("c_dont") } </Text>  
                            {_data.replys.length>0 && 
                            [ 
                                <Text style={iStyle.bottomBorder}> </Text>,
                                <Text style={[styles.contentfontSize]}>{_("c_replyDate")}:{moment(_data.replys[0].date).format("YYYY/MM/DD HH:mm")}</Text>,
                                <Text style={[styles.contentfontSize]}>{_("c_replyContent")}:{_data.replys[0].content}</Text>,
                                <Text style={[styles.contentfontSize]}>{_("c_replyname")}:{_data.replys[0].name}</Text>
                            ]
                            }
                       
                        </Col>
                    </Row>
                   
                </Grid>
                {/* {_data.replys.length>0 && 

                <Grid style={{marginBottom:20,marginLeft:15,marginRight:15}}  >
                  
                    <Row >
                       
                        <Col size={5} style={styles.topMargin} >
                            <Row size={1} >
                                <Text style={[styles.contentfontSize]}>{_("c_replyDate")}:{moment(_data.replys[0].date).format("YYYY/MM/DD HH:mm")}</Text>   
                            </Row>
                            <Row size={1} >
                                <Text style={[styles.contentfontSize]}>{_("c_replyContent")}:{_data.replys[0].content}</Text>   
                            </Row>
                            <Row size={1}>
                                <Text style={[styles.contentfontSize]}>{_("c_replyname")}:{_data.replys[0].name}</Text>                               
                            </Row>
                        </Col>
                    </Row>
                   
                </Grid>
                } */}
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
          phone: {  minHeight: 180,  marginTop: 10 , borderRadius: 5 },
          tablet: { minHeight: 180, marginTop: 10 , borderRadius: 5 }
        }),
        height:'auto'
    },
    bigItemStyle: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        ...Device.select({
          phone: {  minHeight: 180,  marginTop: 10 , borderRadius: 5 },
          tablet: { minHeight: 180, marginTop: 10 , borderRadius: 5 }
        }),
        height:'auto'
    },
    titleFontSize:{
        fontSize :"18rem",
        width:'80%'
    },
    contentfontSize:{
        fontSize :"16rem",
        marginBottom:'10rem'
    },
    yellow:{
        color:"$mainYellow"
    }

});