import React, {Component} from 'react';
import { Item , Label, View} from "native-base";
import {
    EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _
} from './../../../../helpers/core-packages';
import { GestureResponderEvent,Image , Dimensions ,Text, Button, TouchableOpacity } from 'react-native';
import iStyle from '../../../resources/style/main-style.js';
import Device from '../../../contents/react-native-device-detection-val';
import { MessageGet } from '../../../services/smart-community-server';


export function makeMessageItem( _data: MessageGet.IMessage ,index:number ,onPress?: (event: GestureResponderEvent) => void) {
    return ( 
        
        <Item regular key={index} style={[iStyle.no_border, styles.itemStyle]} >
           <TouchableOpacity style={{height:'100%', width:'100%'}} onPress={onPress || undefined} >
                <Grid style={{marginTop:10,marginBottom:20,marginLeft:15}}  >
                    <Row size={1} >
                        <Col size={5} >
                            <View style={_data.type ? iStyle.commu_message :iStyle.resident_message }>
                                <Text style={_data.type ? {color:'rgb(248,54,232)'} :{color:'white'}  }>{_data.title}</Text>   
                            </View>
                        </Col>
                        <Col size={3}  >
                            <Text style={[{color:'#70A9E9'},styles.rightMargin]}>{_data.time}</Text>   
                        </Col>
                    </Row>
                    <Row size={1} >
                        <Col size={5}>
                            <Label style={{ position: 'absolute', left: 0,fontSize:25}}>{_data.content}</Label>   
                        </Col>
                        <Col size={3}>
                            <Image style={[{height: "60%"},styles.rightMargin]} resizeMode="contain" source={ rcImages.more } ></Image>
                        </Col>
                    </Row>   
                </Grid>
           </TouchableOpacity>
        </Item>  
    );
}

const styles = EStyleSheet.create({
    rightMargin:{
        position: 'absolute', right: 20,top:10
    },
 
    itemStyle: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%', 
        ...Device.select({
          phone: { height: 110,  marginTop: 10 , borderRadius: 5 },
          tablet: { height: 110, marginTop: 10 , borderRadius: 5 }
        })
    }

});