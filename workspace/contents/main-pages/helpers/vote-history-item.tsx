import React, {Component} from 'react';
import { Item , Label, View} from "native-base";
import {
    EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _
} from './../../../../helpers/core-packages';
import { GestureResponderEvent,Image , Dimensions ,Text, Animated, TouchableOpacity } from 'react-native';
import iStyle from '../../../resources/style/main-style.js';
import Device from '../../../contents/react-native-device-detection-val';
import { VoteGet } from '../../../services/smart-community-server';
import { Action } from "rxjs/scheduler/Action";


interface Props {
    lang?: string;
    index :number
    data:VoteGet.Output ;
    onPress? :any
}

@ConnectObservables({
    lang: lang.getLangObservable()
})
export class VoteHistoryItem extends Component<Props> {
    
    state = {       
        data : this.props.data,
        expanded:false
    };

    constructor(props) {
        super(props);
    }
    goToDetail =()=>{
      Actions.push("voteDetai",{data:this.props.data})
    }

    render() {
        return (   
            this.props.data.option!="" &&
            
            <Item regular style={[iStyle.no_border,iStyle.no_border ,iStyle.gasitemStyle  ]} >
                <TouchableOpacity style={[{height:'100%', width:'100%'},iStyle.center]} >

                    <Item style={[iStyle.center,iStyle.no_border,styles.smallItemStyle]}>
                        <TouchableOpacity style={[{height:'100%', width:'100%'},iStyle.center]} onPress={  this.goToDetail} >
                            <Text style={[styles.title ,styles.leftMargin]}>{this.props.data.title}</Text>   
                            <Image style={[{height: "60%"},styles.rightMargin]} resizeMode="contain" source={ rcImages.more } ></Image>
                        </TouchableOpacity>
                    </Item>

                   {/* {this.state.expanded &&
                    <View>
                        <Item style={[iStyle.center,iStyle.no_border,styles.smallItemStyle]}>
                            <TouchableOpacity style={[{height:'100%', width:'100%'},iStyle.center]} onPress={  this.change} >
                                <Text style={[styles.contentfontSize ,styles.leftMargin]}>投票截止日:{this.props.data.deadline}</Text>   
                            </TouchableOpacity>
                        </Item> 
                        <Item style={[iStyle.center,iStyle.no_border,styles.smallItemStyle]}>
                           <TouchableOpacity style={[{height:'100%', width:'100%'},iStyle.center]} onPress={  this.change} >
                               <Text style={[styles.contentfontSize ,styles.leftMargin]}>發起人:{this.props.data.sponsorName}</Text>   
                           </TouchableOpacity>
                        </Item> 
                        <Item style={[iStyle.center,iStyle.no_border,styles.smallItemStyle,]}>
                           <TouchableOpacity style={[{height:'100%', width:'100%'},iStyle.center]} onPress={  this.change} >
                               <Text style={[styles.contentfontSize ,styles.leftMargin]}>說明內容:</Text>   
                           </TouchableOpacity>
                        </Item> 
                    </View>
                    }
                    {this.state.expanded &&
                       <View style={{ alignSelf: 'flex-start' ,marginLeft:20 ,marginBottom:20,width:'90%',backgroundcolor:'red' }}>
                            <Text  style={[styles.contentfontSize ]} >
                            {this.props.data.content}
                            </Text>
                      </View>
                    } */}



               
                </TouchableOpacity>
            </Item>  
     
        
       )
    }
   
}  

const styles = EStyleSheet.create({
    topMargin:{
       marginTop:20
    },
    content:{
        width:'100%'

    },
    rightMargin:{
        position: 'absolute', right: 20
    },
    leftMargin:{
        position: 'absolute', left: 20
    },
  
    itemStyle: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%', 
        ...Device.select({
          phone: { height: 'auto',  marginTop: 10 , borderRadius: 5 },
          tablet: { height: 'auto', marginTop: 10 , borderRadius: 5 }
        })
    },
    title:{
        fontSize :"18rem", 
    },
    contentfontSize:{
        fontSize :"16rem"
       
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
    },
    smallItemStyle: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%', 
        ...Device.select({
          phone: { height: 55 ,borderRadius:7},
          tablet: { height: 55,borderRadius:7}
        })
    }
});
  