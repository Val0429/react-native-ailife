import React, {Component} from 'react';
import {Platform, StatusBar, ScrollView, Image, TouchableOpacity , Linking } from 'react-native';
import { Container, Header, View, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Icon, Item, Input, Label, Picker, CardItem, Card, Toast, ListItem } from 'native-base';

import { EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _ } from './../../../../../helpers/core-packages';

import { makeMainButton } from './../../helpers/make-main-button';
import { HeaderContainer } from '../../helpers/header-container';
import iStyle from '../../../../resources/style/main-style.js'
import Device from '../../../../contents/react-native-device-detection-val';
import server, { AnnouncementsGet } from './../../../../services/smart-community-server';


interface Props {
    lang?: string;
    data:AnnouncementsGet.Output
}

@ConnectObservables({
    lang: lang.getLangObservable()
})
export class AnnouncementDetaiPage extends Component<Props> {
    render() {
        return (
            <HeaderContainer backBtn={true} title={_("m_CommunityAnnouncementDetail")} children={this.content()} />
        )
    }

    content() {
        return (
            <Container  >
                <StatusBar hidden/>
                <Content bounces={false} scrollEnabled={false} contentContainerStyle={[{height:'100%'},styles.contentContainerStyle]}  >
                    <ScrollView >
                        <View style={ [iStyle.imgBackground,iStyle.center,styles.mainView,]} >
                            <ListItem style={[iStyle.no_border,styles.bottomBorder,styles.title]}  onPress={() =>this._goToURL()} >
                                {/* <TouchableOpacity style={[iStyle.no_border,styles.bottomBorder,styles.title,iStyle.center,{backgroundColor:'Transparent'}]} onPress={() =>this._goToURL()} > */}
                                    <Text numberOfLines={1} style={[iStyle.mainTitleText]}>{this.props.data.title}</Text>
                                    {  this.props.data.attachmentSrc!=""&&<Image style={{ height: 20,width:20}}  source={rcImages.paperclip}/>}
                                {/* </TouchableOpacity> */}
                              
                            </ListItem>
                            <ListItem style={[iStyle.no_border,styles.title]}>
                                <Text style={[iStyle.mainContetText,{ marginBottom:20}]}>{this.props.data.content}</Text>
                            </ListItem>
                        </View>                   
                    </ScrollView>
                </Content>
            </Container>
           
           
        )
    }

    _goToURL = ()=>{
        if (this.props.data.attachmentSrc!="")
        {
            Linking.canOpenURL(server.getUrl()+this.props.data.attachmentSrc).then(supported => {
                if (supported) {
                    console.log(server.getUrl()+this.props.data.attachmentSrc);
                    Linking.openURL(server.getUrl()+this.props.data.attachmentSrc);
                } else {
                  console.log('Don\'t know how to open URI');
                }
              });
        }
        
      }
    }  

const styles = EStyleSheet.create({
    mainView:{
        width:'80%',
        alignSelf: 'center', 
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    title:{
        marginTop:20, 
        alignSelf: 'center', 
        justifyContent: 'flex-start',
        alignItems: 'center',
        width:'100%'
    },
    bottomBorder:{
        borderBottomColor:'$titleTextColr',borderBottomWidth:1, 
    },
    main_grid: {
        marginBottom: "15rem"
    },
    border:{
        borderTopWidth:2,
        borderTopColor:'white'
    },
    cancelPadding:{
        padding:0,
        margin:0
    },
    row_base: {
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    row_base2: {
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    temperature:{
        color:'white',
        fontSize : '90 rem',
      
        
    },
    contentContainerStyle:{
        backgroundColor:'rgb(241,243,241)',
    },
   

});
  