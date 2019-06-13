import React, {Component} from 'react';
import { Item , Label, View} from "native-base";
import {
    EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _
} from './../../../../helpers/core-packages';
import { GestureResponderEvent,Image , Dimensions ,Text, Button, TouchableOpacity, ImageSourcePropType } from 'react-native';


export function makeNoDataImage(image:ImageSourcePropType , content: string ) {
    return [
            <Image key={"image"} style={[{alignSelf:'center',marginTop:80}]} resizeMode="cover"  
                source={image}>
            </Image>,
            <Text key={"content"} style={{color:'#CFD0CF',fontSize:24,marginTop:20}} >{content}</Text>
    ];
}

