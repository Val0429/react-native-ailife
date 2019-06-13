import React, {Component} from 'react';
import { Item , Label, Button} from "native-base";
import {
    EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _
} from './../../../../helpers/core-packages';
import { GestureResponderEvent,Image , Dimensions ,Text, Animated, TouchableOpacity } from 'react-native';
import iStyle from '../../../resources/style/main-style.js';
import Device from '../../../contents/react-native-device-detection-val';
import { ArticleReservationGet } from '../../../services/smart-community-server';
import { ReceiveStatus } from "../../../enums"
import moment from 'moment';


interface Props {
    lang?: string;
    index :number
    data:ArticleReservationGet.Output ;
    onPress :any
}

@ConnectObservables({
    lang: lang.getLangObservable()
})
export class ToolReservationItem extends Component<Props> {
    
    state = {       
        data : this.props.data,
        expanded : false
    };

    constructor(props) {
        super(props);
     
    }

    render() {
        return (        //itemStyle
            <Item regular style={[iStyle.no_border,iStyle.no_border ,this.state.expanded ? styles.itemStyle :iStyle.gasitemStyle  ]} >
                <TouchableOpacity style={[{height:'100%', width:'100%'},iStyle.center]} >
                    <Grid  style={iStyle.center} >
                        <Row size={1} style={[iStyle.center ,{width:'90%'}, this.state.expanded && iStyle.bottomBorder]} >
                        {/* style={} */}
                            <Col size={5} style={iStyle.center} >
                                <Text style={[styles.titleFontSize ,styles.leftMargin]}>{this.props.data.articleName}</Text>   
                            </Col>
                            <Col size={5} style={iStyle.center} >
                            {this.props.data.status ==ReceiveStatus.unreceived.toString() && 
                                <Text style={[styles.modalcontent,styles.contentfontSize]}>{this.props.data.lendCount} 個</Text>   
                            }
                            {this.props.data.status ==ReceiveStatus.received.toString() && 
                                <Text style={[styles.modalcontent,styles.contentfontSize]}> {moment(this.props.data.replyDate).format("YYYY/MM/DD")} 已歸還</Text>   
                            }
                            </Col>
                        </Row>
                      
                      
                    </Grid>
                   
                </TouchableOpacity>
            </Item>  

       )
    }
    change =()=>{
        this.setState({
            expanded : !this.state.expanded
        });
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
          phone: { height: 180,  marginTop: 10 , borderRadius: 5 },
          tablet: { height: 180, marginTop: 10 , borderRadius: 5 }
        })
    },
    titleFontSize:{
        fontSize :"18rem",  
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
  