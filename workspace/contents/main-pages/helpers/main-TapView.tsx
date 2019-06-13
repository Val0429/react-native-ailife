import React, {Component} from 'react';
import {Platform, StatusBar, GestureResponderEvent,Image, Dimensions ,Text ,TouchableOpacity, Animated} from 'react-native';

import { Container, Header, View, Title, Body ,Button ,Content} from 'native-base';
import {
    EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _
} from './../../../../helpers/core-packages';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import iStyle from '../../../resources/style/main-style.js'
import { setStyleAttributePreprocessor } from "react-native-extended-stylesheet";
import Device from '../../../contents/react-native-device-detection-val';


interface Props {
    lang?: string;
    title: string;
    child?: any;
    state : any;
    onPress :any ;
    mainView?: any;
}




@ConnectObservables({
    lang: lang.getLangObservable()
})


export class MainTapView extends Component<Props> {
    constructor(props) {
        super(props);
    }
    _renderTabBar = props => {
        const inputRange = props.navigationState.routes.map((x, i) => i);
        
        return (
          <View style={styles.tabBar}>
            {props.navigationState.routes.map((route, i) => {
                var bkcolor = props.position.interpolate({
                    inputRange,
                    outputRange: inputRange.map(
                      inputIndex => (inputIndex === i ? 'white' :  'transparent')
                    ),
                });
              const color = props.position.interpolate({
                inputRange,
                outputRange: inputRange.map(
                  inputIndex => (inputIndex === i ? '#5C5B61' : 'white')
                ),
              });
                return (
                    <Animated.View key={i} style={[{backgroundColor:bkcolor},styles.tabItem , styles.tabItemCenter,
                    i == 0 && styles.tabItemLeft , i == props.navigationState.routes.length-1 && styles.tabItemRight]} >
                        <TouchableOpacity onPress={() => this.props.onPress(i)} >
                            { route.title.length ==6 && 
                             <Animated.Text style={[{ color} ,styles.fontSize1]}>{route.title}</Animated.Text>
                            }
                            { route.title.length ==5 && 
                             <Animated.Text style={[{ color },styles.fontSize2]}>{route.title}</Animated.Text>
                            }
                            { route.title.length<=4 && 
                             <Animated.Text style={[{ color },,styles.fontSize3]}>{route.title}</Animated.Text>
                            }
                           
                        </TouchableOpacity>
                    </Animated.View>
               
              );
            })}
          </View>
        );
    }
    render() {
        return (
            <Container style={{backgroundColor:'rgb(241,243,241)',padding:0,margin:0}}  >
            {/* hidden */}
            <StatusBar hidden/>
            <Image style={{ height: '20%',width:'100%',position: 'absolute', top: 0, left: 0}} source={rcImages.header}/>

            <Header style={styles.headerstyle}>
                
                <Body style={{  justifyContent: 'center',alignItems: 'center'}}>
                    <Title style={styles.title} >{this.props.title}</Title>
                    <Button style={{ position: 'absolute', left: 0}}  transparent  onPress={() => 
                      Actions.pop()

                     }>
                        <Image style={{ height: '80%',width:20}} source={rcImages.back}/>
                    </Button>
                </Body>    
                                
            </Header>      
        
             {/* //renderScene={SceneMap(this.props.child)}  */}
            {this.props.child != null &&
            <TabView navigationState={this.props.state} renderScene={SceneMap(this.props.child)}  tabContainerStyle={{ elevation:0}}
                onIndexChange={index => this.props.onPress(index)}
                style={{borderColor:'transparent', borderRadius:7 ,}}
                initialLayout={{ width: Dimensions.get('window').width ,...Device.select({
                  phone: { height: 10 },
                  tablet: { height: 10  }
                }) }}   
                renderTabBar={this._renderTabBar}
            />  
            }
             {this.props.mainView != null &&
              this.props.mainView
            }
           
            
                            
        </Container>
        )
    }
}  



const styles = EStyleSheet.create({
    fontSize1 :{
      fontSize:'16rem'
    },
    fontSize2 :{
      fontSize:'18rem'
    },
    fontSize3 :{
      fontSize:'22rem'
    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        // paddingTop: 20,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10,
      
    },
    tabItem: {
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        ...Device.select({
          phone: {  height: 40,   padding: 0,width: 50,},
          tablet: {  height: 40,  padding: 0,width: 50, }
        })
    },
    
    tabItemLeft:{
        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 0,
        borderBottomWidth: 1.5,
        borderRightWidth: 0,
        borderTopWidth: 1.5,
        borderLeftWidth: 1.5,
        borderBottomColor: 'white',
        borderRightColor: 'transparent',
        borderTopColor: 'white',
        borderLeftColor: 'white'
     
    },
    tabItemCenter:{
        borderWidth: 1.5,
        borderColor: 'white',
    },
    tabItemRight:{
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 6,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 6,
        borderBottomWidth: 1.5,
        borderRightWidth: 1.5,
        borderTopWidth: 1.5,
        borderLeftWidth: 0,
        borderBottomColor: 'white',
        borderRightColor: 'white',
        borderTopColor: 'white',
        borderLeftColor: 'transparent'
        // borderTopRightRadius:6,
        // borderBottomRightRadius:6,
        // borderWidth: 1.5,
        // borderColor: 'white',
    },
    headerstyle: {
        backgroundColor: 'transparent',
        shadowColor: 'transparent',
        shadowRadius: 0,
        elevation: 0,
        shadowOffset: {
            height: 0,
        },
        ...Device.select({
          phone: {  },
          tablet: {  height: 50 }
      }),
    },
    title:{
      fontSize:'20rem',
      color:'white'
  },


});