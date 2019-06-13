import React, {Component} from 'react';
import {Platform, StatusBar, GestureResponderEvent,Image, Dimensions} from 'react-native';

import { Container, Header, View, Title, Body ,Button ,Icon} from 'native-base';
import {
    EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _
} from './../../../../helpers/core-packages';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import iStyle from '../../../resources/style/main-style.js'
import { setStyleAttributePreprocessor } from "react-native-extended-stylesheet";


export function makeMainView(title: string,child : any , state:any ,onPress?: (event: GestureResponderEvent) => void ) {

    return ( 
        <Container style={{backgroundColor:'rgb(241,243,241)',padding:0,margin:0}}>
            <StatusBar hidden />
            <Image style={{ height: '20%', position: 'absolute', top: 0, left: 0}} source={rcImages.header}/>

            <View >
                <Header style={{padding:0,margin:0,backgroundColor:'transparent'}}>
                
                    <Body style={{  justifyContent: 'center',alignItems: 'center',}}>
                        <Title style={{fontSize:20,color:'white'}}>{title}</Title>
                        <Button style={{ position: 'absolute', left: 0}}  transparent  onPress={() => Actions.pop()}>
                            {/* <Icon type="SimpleLineIcons" name="cart" /> */}
                            <Image style={{ height: '80%',width:20}} source={rcImages.back}/>
                        </Button>
                    </Body>    
                                
                </Header>  
            </View> 
       
            <TabView navigationState={state} renderScene={SceneMap(child)} tabContainerStyle={{ elevation:0}}
                onIndexChange={index => onPress(index)}
                initialLayout={{ width: Dimensions.get('window').width ,height:10}}   
                renderTabBar={(props) =>
                    <TabBar 
                    {...props}
                    labelStyle={ styles.title_color }
                        style={ [styles.tabBar]}
                    indicatorStyle={[{ backgroundColor: 'white',height:'100%' } ]}
                    />
            }/>                   
        </Container>
   
   
    );

    
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
        fontSize:100
    },
    tabBorder:{
        borderRadius: 10,
        borderColor:'white',
        borderWidth:2
    },
    tabBar:{
        backgroundColor: 'transparent' ,
       // marginBottom:5,
        // marginLeft:5,
        // marginRight:5,
        height:50,
        
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
    },
    title_color:{
        color:'rgb(92,91,92)' ,
        fontSize: 23,
    },

});