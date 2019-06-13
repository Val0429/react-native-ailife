import React, {Component} from 'react';
import { Item , Label, Button} from "native-base";
import {
    EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _
} from './../../../../helpers/core-packages';
import { GestureResponderEvent,Image , Dimensions ,Text, Animated, TouchableOpacity } from 'react-native';
import iStyle from '../../../resources/style/main-style.js';
import Device from '../../../contents/react-native-device-detection-val';
import { ManageCostGet } from '../../../services/smart-community-server';
import moment from 'moment';
import { ReceiveStatus } from "../../../enums"


interface Props {
    lang?: string;
    index :number
    data:ManageCostGet.Output ;
    onPress? :any
}

@ConnectObservables({
    lang: lang.getLangObservable()
})
export class ManagerCostItem extends Component<Props> {
    
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
                <TouchableOpacity style={[{height:'100%', width:'100%'},iStyle.center]} onPress={ this.change} >
                    <Grid  style={iStyle.center} >
                        <Row size={1} style={[iStyle.center ,{width:'90%'}, this.state.expanded && styles.bottomBorder]} >
                        {/* style={} */}
                            <Col size={5} style={iStyle.center} >
                                <Text style={[styles.titleFontSize ,styles.leftMargin]}>{moment(this.props.data.date).format("YYYY年MM月 管理費")}</Text>   
                            </Col>
                            <Col size={3} style={[iStyle.center,]} >
                                {this.props.data.status==ReceiveStatus.unreceived &&
                                    <Text style={[styles.titleFontSize ,styles.rightMargin ,styles.errorTextColor]}>未繳</Text>   
                                }
                                 {this.props.data.status==ReceiveStatus.received &&
                                    <Text style={[styles.titleFontSize ,styles.rightMargin]}>已繳</Text>   
                                }
                            </Col>
                        </Row>
                        { this.state.expanded  &&
                        <Row size={2} style={{width:'90%'}} >
                            <Col style={styles.topMargin} >
                                <Row size={1} >
                                    <Col size={5} style={iStyle.center} >
                                        <Text style={[styles.modalcontent,styles.contentfontSize,styles.leftMargin]}>住戶管理費</Text>   
                                    </Col>
                                    <Col size={3} style={[iStyle.center,]} >
                                        <Text style={[styles.modalcontent,styles.contentfontSize,styles.rightMargin]}>NT {this.props.data.manageCost}</Text>   
                                    </Col>
                                </Row>
                                <Row size={1} style={styles.bottomBorder}>
                                    <Col size={5} style={iStyle.center} >
                                        <Text style={[styles.modalcontent,styles.contentfontSize,styles.leftMargin]}>車位管理費</Text>   
                                    </Col>
                                    <Col size={3} style={[iStyle.center,]} >
                                        <Text style={[styles.modalcontent,styles.contentfontSize,styles.rightMargin]}>NT {this.props.data.parkingCost}</Text>   
                                    </Col>
                                </Row>
                                <Row size={1} >
                                    <Col size={5} style={iStyle.center} >
                                        <Text style={[styles.modalcontent,styles.contentfontSize,styles.rightMargin]}>NT {this.props.data.parkingCost+this.props.data.manageCost}</Text>   
                                    </Col>

                                </Row>
                            
                            </Col>
                        </Row>
                        }
                      
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
    errorTextColor:{
        color:"$mainRed"
    },
    rightMargin:{
        position: 'absolute', right: 0
    },
    leftMargin:{
        position: 'absolute', left: 0
    },
    bottomBorder:{
        borderBottomColor:'#D5D5D5',
        borderBottomWidth:1
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
  