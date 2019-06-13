import React, {Component} from 'react';
import { Item , Label, Button} from "native-base";
import {
    EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _
} from './../../../../helpers/core-packages';
import { GestureResponderEvent,Image , Dimensions ,Text, Animated, TouchableOpacity } from 'react-native';
import iStyle from '../../../resources/style/main-style.js';
import Device from '../../../contents/react-native-device-detection-val';
import { ArticleGet } from '../../../services/smart-community-server';


interface Props {
    lang?: string;
    index :number
    data:ArticleGet.Output ;
    onPress :any
}

@ConnectObservables({
    lang: lang.getLangObservable()
})
export class ToolItem extends Component<Props> {
    
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
                <TouchableOpacity style={[{height:'100%', width:'100%'},iStyle.center]} onPress={  this.change} >
                    <Grid  style={iStyle.center} >
                        <Row size={1} style={[iStyle.center ,{width:'90%'}, this.state.expanded && iStyle.bottomBorder]} >
                        {/* style={} */}
                            <Col size={5} style={iStyle.center} >
                                <Text style={[styles.titleFontSize ,styles.leftMargin]}>{this.props.data.name}</Text>   
                            </Col>
                            <Col size={3} style={iStyle.center} >
                                {!this.state.expanded && <Image style={[{height: "60%"},styles.rightMargin]} resizeMode="contain" source={ rcImages.more } ></Image> }
                            </Col>
                        </Row>
                        { this.state.expanded  &&
                        <Row size={2} style={{width:'90%'}} >
                            <Col style={styles.topMargin} >
                                <Row size={1} >
                                    <Text style={[styles.modalcontent,styles.contentfontSize]}>物品總類:{_("t_"+this.props.data.type)}</Text>   
                                </Row>
                                <Row size={1} >
                                    <Text style={[styles.modalcontent,styles.contentfontSize]}>物品數量:{this.props.data.adjustCount}</Text>   
                                </Row>
                                <Row size={1} >
                                    <Text style={[styles.modalcontent,styles.contentfontSize]}>可借數量:{ this.props.data.adjustCount-this.props.data.lendCount}</Text>   
                                </Row>
                            
                            </Col>
                        </Row>
                        }
                        { this.state.expanded  &&
                            // <Button style={[iStyle.alert_button ,styles.btn]} full onPress= {this.props.onPress(this.props.data) ||undefined} >
                            //     <Text style={styles.btnText}>{_("t_lend")}</Text>
                            // </Button>   
                            <Button style={[iStyle.alert_button ,styles.btn]} full onPress= { ()=>{ this.props.onPress(this.props.data)}} >
                            <Text style={styles.btnText}>{_("t_lend")}</Text>
                        </Button>   
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
  