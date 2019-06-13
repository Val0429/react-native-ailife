import React, {Component} from 'react';
import { Item , Label, Button} from "native-base";
import {
    EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _
} from './../../../../helpers/core-packages';
import { GestureResponderEvent,Image , Dimensions ,Text, Animated, TouchableOpacity } from 'react-native';
import iStyle from '../../../resources/style/main-style.js';
import Device from '../../../contents/react-native-device-detection-val';
import { AnnouncementsGet } from '../../../services/smart-community-server';


interface Props {
    lang?: string;
    index :number
    data:AnnouncementsGet.Output ;
    onPress :any
}

@ConnectObservables({
    lang: lang.getLangObservable()
})
export class AnnouncementsItem extends Component<Props> {
    
    state = {       
        data : this.props.data,
    };

    constructor(props) {
        super(props);
     
    }

    render() {
        return (        //itemStyle
            <Item regular style={[iStyle.no_border,iStyle.no_border ,iStyle.gasitemStyle  ]} >
                <TouchableOpacity style={[{height:'100%', width:'100%'},iStyle.center]  } onPress= { ()=>{ this.props.onPress(this.props.data)}} >
                    <Grid  style={iStyle.center} >
                        <Row size={1} style={[iStyle.center ,{width:'90%'}]} >
                        {/* style={} */}
                            <Col size={5} style={iStyle.center} >
                                <Text numberOfLines={1} ellipsizeMode='tail' style={[styles.title ,styles.leftMargin]}>{this.props.data.title}</Text>   
                            </Col>
                            <Col size={3} style={iStyle.center} >
                             <Image style={[{height: "60%"},styles.rightMargin]} resizeMode="contain" source={ rcImages.more } ></Image>
                            </Col>
                        </Row>
                   
                    </Grid>
                   
                </TouchableOpacity>
            </Item>  
     
       
       )
    }
   
}  

const styles = EStyleSheet.create({
    topMargin:{
       marginTop:20
    },
    rightMargin:{
        position: 'absolute', right: 0
    },
    leftMargin:{
        position: 'absolute', left: 0
    },

    itemStyle: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        ...Device.select({
          phone: {  height: 180,  marginTop: 10 , borderRadius: 5 },
          tablet: {  height: 180, marginTop: 10 , borderRadius: 5 }
        })
    },
    title:{
        fontSize :"18rem", 
        color:'#F3BA1F' ,
        ...Device.select({
            phone: {  width:280 },
            tablet: {  width:280  }
          })
    },
    contentfontSize:{
        fontSize :"16rem",
       
    },
    item:{
        width: '90%', height: 55 ,  justifyContent: 'center',
        alignItems: 'center'
    },
    btn:{
        height:50,
        width:100,
        position: 'absolute', 
        right: 0,
        bottom:10

    },
    btnText:{
        fontSize:20,
        color:'white'
    }

});
  