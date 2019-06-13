import React, {Component} from 'react';
import {Platform, StatusBar, Image, NativeModules, requireNativeComponent,ImageBackground, ScrollView, PlatformIOS} from 'react-native';
import { Container, Header, View, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Icon, Item, Input, Label, Picker, CardItem, Card, Toast } from 'native-base';

import {
    EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _
} from './../../../../helpers/core-packages';
import Device from '../../../contents/react-native-device-detection-val';

import { makeMainButton } from './../helpers/make-main-button';
import iStyle from '../../../resources/style/main-style.js'


interface Props {
    lang?: string;
    title: string;
    children?: any;
    backBtn?: boolean;
    notSroll?:boolean
}

@ConnectObservables({
    lang: lang.getLangObservable()
})
export class HeaderContainer extends Component<Props> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
            <View >
                <Image style={{ height: '100%',width:'100%', position: 'absolute', top: 0, left: 0}} source={rcImages.header}/>
                <Header style={[ styles.header,{padding:0,margin:0,backgroundColor:'transparent',}]}>
                    <Body style={[styles.header,{justifyContent: 'center',alignItems: 'center',height:'100%',}]}>
                        <Title style={styles.title}>{this.props.title}</Title>
                        {this.props.backBtn &&
                            <Button style={{ position: 'absolute', left: 0}}  transparent  onPress={() => Actions.pop()}>
                                <Image style={{ height: '80%',width:20}} source={rcImages.back}/>
                            </Button>
                        }
                        
                    </Body>                   
                </Header>  
            </View> 
            {!this.props.notSroll && 
            <Content bounces={false} scrollEnabled={false} contentContainerStyle={[{height:'100%'}]}  >
                <ScrollView >
                    { this.props.children }
                </ScrollView>
            </Content>}
            {this.props.notSroll && this.props.children }
               
         
            </>
        )
    }
}  

const styles = EStyleSheet.create({

    main_grid: {
        marginBottom: "15rem"
    },
    title:{
        fontSize:'20rem',
        color:'white'
    },
    header:{
        ...Device.select({
            phone: {  },
            tablet: {  height: 60 }
        }),
        alignSelf: 'center', 
        justifyContent: 'center',
        alignItems: 'center'
    }

});
  