import React, {Component} from 'react';
import {Platform, StatusBar, View, Image, NativeModules, requireNativeComponent,ImageBackground} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Item, Input, Label, Picker } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Actions } from 'react-native-router-flux';
import { rcImages } from './../../resources/images';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ConnectObservables } from './../../../helpers/storage/connect';
import { StorageInstance as Storage, SettingsDGS } from './../../config';
import lang, { _ } from './../../../core/lang';
import iStyle from '../../resources/style/main-style.js';
import Device from '../../contents/react-native-device-detection-val';

let RNFS = require('react-native-fs');


interface Props {
    lang: string;
    dgs: SettingsDGS;
}

@ConnectObservables({
    lang: lang.getLangObservable(),
    dgs: Storage.getObservable("settingsDGS")
})
export class WelcomeContent extends Component<Props> {
    constructor(props) {
        super(props);

        //this.props.dgs.account
    }

    async componentDidMount() {
        

        //Actions.push('main');
        ////////////////////////////////////////////

    }

    render() {

        return (
            <Container>
                <StatusBar hidden />
                    <Content bounces={false} contentContainerStyle={{flex: 1}} style={styles.content}>
                        <ImageBackground style={ iStyle.imgBackground } 
                            resizeMode='cover' 
                            source={rcImages.backgroundImage} >
                            <View style={ [iStyle.imgBackground , iStyle.center,{flex:1}]} >
                                <Item regular style={[iStyle.no_border,]}>
                                    <View style={ [iStyle.imgBackground ,styles.row_base, styles.center,{height:'auto'}] } >
                                        <Image style={{height: "80%",marginTop:50}} resizeMode="contain" source={rcImages.icon} />
                                    </View>
                                </Item>
                            </View>
                            <View style={ [iStyle.imgBackground , iStyle.center,{flex:2}]} >
                               
                                <Item regular style={[iStyle.no_border,{marginBottom:20}]}>
                                    <Button style={iStyle.item_button} primary full  onPress={() => Actions.push('login')}>
                                        <Text style={styles.item_input}>{_("f_enrolled")}</Text>
                                    </Button> 
                                </Item>
                                <Item regular style={[iStyle.no_border]}>
                                    <Button style={iStyle.item_button} primary full  onPress={() => Actions.push('first')}>
                                        <Text style={styles.item_input}>{_("f_FirstLogin")}</Text>
                                    </Button> 
                                </Item>
                              
                            </View>

                          

                        </ImageBackground>
                       
                    </Content>
               
                    
                  
               
            </Container>
        );
    }
}  

const styles = EStyleSheet.create({
    content: {
        backgroundColor: "$bgColor"
    },
    
    row_base: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    row_1_icon: {
        alignItems: 'flex-end',
        paddingBottom: '10rem'
    },

    row_2_title: {
        alignItems: 'flex-start'
    },
    title: {
        fontFamily: 'FontAwesome',
        fontSize: "18 rem",
        color: 'white'
    },
    version: {
        marginLeft: '5rem',
        color: 'white'
    },

    row_3_form: {
        alignItems: 'flex-start',
        alignSelf: 'center', 
        justifyContent: 'center',
        width:'100%',
    },
    item: {
        margin: "1 rem"
    },
    item_icon: {
        color: "#EEEEFF",
        fontSize: "12 rem"
    },
    item_input: {
        color: "white",
        fontSize: "22 rem"
    },
    
  });
  