import React, {Component} from 'react';
import {Platform, StatusBar, Image, NativeModules, requireNativeComponent , ImageBackground} from 'react-native';
import { Container, Header, View, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Icon, Item, Input, Label, Picker, CardItem, Card, Toast } from 'native-base';

import { EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _ } from './../../../../../helpers/core-packages';

import { makeMainButton } from './../../helpers/make-main-button';
import { HeaderContainer } from '../../helpers/header-container';
import iStyle from '../../../../resources/style/main-style.js'
import Device from '../../../../contents/react-native-device-detection-val';


interface Props {
    lang?: string;
}

@ConnectObservables({
    lang: lang.getLangObservable()
})
export class WeatherPage extends Component<Props> {
    render() {
        return (
            <HeaderContainer title={_("w_Weather")} children={this.content()} />
        )
    }

    content() {
        return (
            <Container  >
                <Content bounces={false} contentContainerStyle={{height:'92%'}} scrollEnabled={false}  >
                     <ImageBackground style={ {width:'100%',height:'100%'} } 
                        resizeMode='cover' 
                        source={rcImages.sun} >
                        <View style={ [iStyle.imgBackground , styles.mainView, iStyle.center,{flex:2}]} >
                            <Grid >
                                <Col>  
                                    <Row size={1} style={[styles.row_base,{ alignItems: 'flex-end'} ]}>
                                        <Image style={{height:'40%'}} resizeMode="contain" source={rcImages.sunicon} />
                                    </Row>
                                    <Row size={1} style={[styles.row_base]}>
                                        <Text style={styles.weather}>晴天</Text>
                                    </Row>
                                </Col>
                                <Col style={[styles.row_base ]} >
                                    <Text style={styles.temperature}>23°</Text>
                                </Col>
                              
                            </Grid>
                        </View>   
                        <View style={ [iStyle.imgBackground ,styles.border ,styles.mainView, iStyle.center,{flex:3}]} >
                            <Grid >
                                <Col >  
                                    <Row size={1} style={[styles.row_base2 ]}>
                                        <View style={[styles.smallCircle,styles.row_base2 ]}>
                                            <Text style={styles.UV}>UV</Text>
                                        </View>
                                    </Row>
                                    <Row size={1} style={[styles.row_base2]}>
                                        <View style={[styles.smallCircle,styles.row_base2 ]}>
                                            <Text style={styles.PM}>PM</Text>
                                            <Text style={styles.PM}>2.6</Text>
                                        </View>
                                    </Row>
                                    <Row size={3}>
                                    </Row>
                                </Col>
                                <Col style={[styles.row_base ]} >
                                    <Row size={1} style={[styles.row_base2]}>
                                        <Text style={styles.weather}>3~5中量級</Text>
                                    </Row>
                                    <Row size={1} style={[styles.row_base2]}>
                                        <Text style={styles.weather}>15.5普通</Text>
                                    </Row>
                                    <Row size={3}>
                                    </Row>
                                </Col>        
                                
                            </Grid>
                        </View>               
                     </ImageBackground> 
                
                </Content>
            </Container>
           
           
        )
    }
}  

const styles = EStyleSheet.create({
    mainView:{
        width:'80%'
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
    weather:{
        color:'white',
        fontSize:30
    },
    smallCircle: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        width: 50,
        borderRadius: 25,
        borderColor:'white',
        borderWidth:2
    },
    UV:{
        fontSize:23,
        color:'white'
    },
    PM:{
        fontSize:18,
        color:'white'
    }

});
  