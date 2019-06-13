import React, {Component} from 'react';
import { ScrollView ,TouchableOpacity  ,Image } from 'react-native';
import { Container, Header, View, Title, Content, Text, Button, Item} from 'native-base';

import { EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _ } from './../../../../../helpers/core-packages';

import iStyle from '../../../../resources/style/main-style.js'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import server, { MessageGet } from './../../../../services/smart-community-server';
import { makeMainView } from '../../helpers/make-main-tapView';
import { makeGasItem } from '../../helpers/make-gas-item';
import { makeMessageItem } from '../../helpers/make-message-item';
import Modal from "react-native-modal";

import Device from '../../../../contents/react-native-device-detection-val';
import { relativeTimeRounding } from "moment";
import { MainTapView } from "../../helpers/main-TapView";
import { makeNoDataImage } from "../../helpers/make-noDataImage-item";

interface Props {
    lang?: string;
}
interface State {
    results?: MessageGet.IMessage[];
    modalVisible: Boolean,
    modalContent:string,
    modalTime:string,
    modalTitle : string,
    modalType:Boolean,
    index: number
}
 



@ConnectObservables({
    lang: lang.getLangObservable()
})


export class MessagePage extends Component<Props ,State> {

    state = {
        modalVisible: false,
        modalTitle : "",
        modalContent : "",
        modalTime : "",
        modalType:false,
        index: 0,
        results :[],
        routes: [
            { key: 'new', title: "未讀訊息" },
            { key: 'read', title: "已讀訊息" },
        //   { key: 'community', title: _("f_community") },
        //   { key: 'Household', title: _("f_Household") },
        ],
        child :{
            new: this.secondRoute,
            read: this.secondRoute,
        }
    };

    constructor(props) {
        super(props);
       
      }

    openModalVisible = (_data:MessageGet.IMessage)=> {
        this.setState({
            modalVisible: true,
            modalContent:_data.content,
            modalTime:_data.time,
            modalTitle : _data.title,
            modalType:_data.type
        });    
    
    }
    closeModalVisible = ()=> {
        this.setState({
            modalVisible: false
        });    
    
    }

    async componentDidMount() {
    
        let test1: MessageGet.IMessage = {
            content: "2018/11/10收件",
            time: "11:30",
            type: false,
            title: "未讀訊息",
            detail :null
          
        };
       
        this.setState({ results: [test1]},
        function(){ 
            this.setState({
                child :{
                    new: this.firstRoute,
                    read: this.secondRoute,
                },
            })
        }
        );
    }

    render() {

        return (

            <Content>
                <MainTapView state ={this.state}  title={_("m_PersonalMessage")} child={this.state.child}  onPress = { (_index) => this.setState({ index:_index }) }  />
                <Modal
                   isVisible={this.state.modalVisible}
                   backdropOpacity={0.3}
                   animationIn="zoomInDown"
                   animationOut="zoomOutUp"
                   backdropColor={'black'}
                   animationInTiming={1000}
                   animationOutTiming={1000}
                   backdropTransitionInTiming={1000}
                   backdropTransitionOutTiming={1000}
                   style={[styles.modal ]}>
                    <View style={styles.modalView}>
                        <View style={styles.modalImageView}>
                            <Item style={[iStyle.no_border ,{height:20}]} >
                                <Grid>
                                    <Col>
                                        <View style={[this.state.modalType ? iStyle.commu_message :iStyle.resident_message , {top:0} ]   }>
                                            <Text style={this.state.modalType ? {color:'rgb(248,54,232)'} :{color:'white'}  }>{this.state.modalTitle}</Text>   
                                        </View>
                                    </Col>
                                    <Col>
                                        <Text style={[{color:'#70A9E9' , position: 'absolute', right: 0}]}>{this.state.modalTime}</Text>   
                                    </Col>
                                </Grid>
        
                            </Item>
                            <Item style={[iStyle.no_border ,{height:40,marginTop:20 ,width: '100%' } ]} >
                                 <Text style={styles.modalTitle}>{this.state.modalContent}</Text>   
                            </Item>
                            <Item style={[iStyle.no_border ,{marginTop:20, height:1,width:'100%',backgroundColor:'black'}]} >
                            </Item>
                            
                            <Item style={[iStyle.no_border ,{height:40,marginTop:10 ,width: '100%' } ]} >
                                <Text style={styles.modalcontent}>ID:12313123</Text>   
                            </Item>
                            <Item style={[iStyle.no_border ,{height:40,marginTop:10 ,width: '100%' } ]} >
                                <Text style={styles.modalcontent}>收件人:Tom</Text>   
                            </Item>
                            <Item style={[iStyle.no_border ,{height:40,marginTop:5 ,width: '100%' } ]} >
                                <Text style={styles.modalcontent}>寄件人:Tom</Text>   
                            </Item>


                        </View>

                        <Item style={[iStyle.no_border,styles.itemMargin]}>
                            <Button style={[iStyle.item_button ,iStyle.alert_button]} full onPress= {this.closeModalVisible} >
                                <Text style={styles.btnText}>{_("m_leave")}</Text>
                            </Button>   
                        </Item>
                        
                    </View>
                
                </Modal>

            </Content>
           
        )
    }

    
    firstRoute  =() => {
     
        return (
            <Content bounces={false} scrollEnabled={false} contentContainerStyle={{flex: 1}}>
                <ScrollView>
                    <View style={ [iStyle.imgBackground , iStyle.center,styles.mainView] } >
                    {
                        this.state && this.state.results && (
                        this.state.results.map( (data ,index) => {
                            return makeMessageItem(data, index, () => this.openModalVisible(data));}))   
                    }
                     
                    </View>
                </ScrollView>
            </Content>
           
        )
    };

  

    secondRoute () {
       return (
        <Content bounces={false} scrollEnabled={false} contentContainerStyle={{flex: 1}}>
                <ScrollView>
                    <View style={ [iStyle.imgBackground , iStyle.center,styles.mainView] } >
                    {/* {
                        this.state && this.state.results && (
                        this.state.results.map( (data ,index) => {
                            return makeMessageItem(data, index, () => this.openModalVisible(data));}))   
                    } */}
                    </View>
                </ScrollView>
            </Content>
       )
    }
}  




const styles = EStyleSheet.create({
    mainView:{
        backgroundColor:'rgb(241,243,241)',
        justifyContent:"flex-start"
    },
    modalImageView:{
        width: '300rem',
        height: 'auto' , 
    },
    modalView: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
        backgroundColor:'rgb(241,243,241)'
      },
    modalTitle:{
        fontSize:'20rem', 
        position: 'absolute', 
        left: 0 
    },
    modalcontent:{
        fontSize:'18rem', 
        position: 'absolute', 
        left: 50
    },
    modalItem:{
      
        height:50,
        width:50
    },
    btnText:{
        fontSize:20
    },
    itemMargin:{
        height:70
    }
});
  