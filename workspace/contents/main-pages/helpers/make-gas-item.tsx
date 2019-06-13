import React, {Component} from 'react';
import { Item ,Label } from "native-base";
import {
    EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _
} from './../../../../helpers/core-packages';
import { GestureResponderEvent,Image , Dimensions } from 'react-native';
import iStyle from '../../../resources/style/main-style.js';
import { GasGet } from '../../../services/smart-community-server';
import moment from 'moment';

interface IIcon {
    name: string;
    type?: string;
}

export function makeGasItem( _data: GasGet.Output, index: number) {
    return ( 

        <Item  key={index} regular style={[iStyle.no_border, iStyle.gasitemStyle]}>
          <Label style={styles.labTitle}>{moment(_data.date).format("YYYY年MM月")} {_("g_gas")}</Label>   
          <Label style={styles.labCount}>{_data.degree}</Label>   
        </Item>  
    );
}

const styles = EStyleSheet.create({
    labTitle:{
        position: 'absolute', left: 20,fontSize:'20rem'
    },
    labCount:{
        position: 'absolute', right: 20,fontSize:'20rem'
    },
    main_button: {
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: '8rem',
        width: Dimensions.get('window').width/3,
        height: Dimensions.get('window').width/3
    },

    main_button_icon: {
        color: "#9FC251",
        fontSize: "52rem",
        alignSelf: 'flex-end',
        marginBottom: '5rem'
    },

    main_button_text: {
        color: "#555",
        fontSize: "15rem",
        alignSelf: 'center',
        marginTop: '5rem'
    }

});