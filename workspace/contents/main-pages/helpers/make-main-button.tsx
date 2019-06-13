import React, {Component} from 'react';
import { Button, View, Text } from "native-base";
import {
    EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _
} from './../../../../helpers/core-packages';
import { GestureResponderEvent,Image , Dimensions } from 'react-native';
import Device from '../../../contents/react-native-device-detection-val';


export function makeMainButton(imageSource: any, text: string,  onPress?: (event: GestureResponderEvent) => void ,count?:number) {
    return ( 
        <Button vertical style={styles.main_button} onPress={onPress || undefined}>
            { (count!= undefined && count >0) && <View style={styles.smallCircle} >
                <Text style={styles.smallText}>{count}</Text>
            </View>}
            <Row size={5} >
                <Image style={{height: "60%",alignSelf: 'flex-end'}} resizeMode="contain"   source={ imageSource } ></Image>
            </Row>
            <Row size={3}>
                <Text style={styles.main_button_text}>{text}</Text>
            </Row>
        </Button>
    );
}

const styles = EStyleSheet.create({

    main_button: {
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: '8rem',
        width: Dimensions.get('window').height/5,
        height: Dimensions.get('window').height/5,
        margin:'13rem'
    },

    main_button_text: {
        color: "#555",
        fontSize: "18rem",
        alignSelf: 'center',
        marginTop: '5rem'
    },
    smallCircle: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        backgroundColor:'red',
        top: '7rem',
        right: '10%',
        // height: '35rem',
        // width: '35rem',
        borderRadius: '20rem',
        zIndex:1000,
        ...Device.select({
            phone: { height: 35,width:35 },
            tablet: {  height: 35,width:35  }
        }),
    },
   
    smallText:{
        fontSize : "22rem",
        color:'white'
    }

});