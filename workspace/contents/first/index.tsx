import React, {Component} from 'react';
import {Platform, StatusBar, View, Image, NativeModules, requireNativeComponent,ImageBackground , Dimensions, Alert, TouchableOpacity, Animated} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Item, Input, Label, Picker } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Actions } from 'react-native-router-flux';
import { rcImages } from './../../resources/images';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ConnectObservables } from './../../../helpers/storage/connect';
import { StorageInstance as Storage ,SettingsUserInfo,SettingsServerInfo} from './../../config';
import lang, { _ } from './../../../core/lang';
import iStyle from '../../resources/style/main-style.js';
import Device from '../../contents/react-native-device-detection-val';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import Camera from 'react-native-camera';



interface Props {
    lang: string;
    userInfo:SettingsUserInfo;
    serverInfo:SettingsServerInfo;
}

@ConnectObservables({
    lang: lang.getLangObservable(),
    userInfo: Storage.getObservable("settingsUserInfo"),
    serverInfo: Storage.getObservable("settingsServerInfo")

})

  
 

export class FirstContent extends Component<Props> {
    camera: Camera;
    stop = false;
    constructor(props) {
        super(props);
    
    }
    openCamera =()=>{
        this.setState({showBarcode:true})
    }
    firstRoute = () => (
        <View style={ [iStyle.imgBackground , iStyle.center] } >
            
            {this.props.serverInfo.url==""  &&
            [
                <Item regular style={[iStyle.no_border,{marginBottom:20}]}>
                    <Text style={[styles.item_input,styles.title_color,{fontSize:30}]}>{_("l_pleasescan")}</Text>                        
                </Item>,
                <Item regular style={[iStyle.no_border,{marginBottom:20}]}>
                <Button style={iStyle.scan_button} primary full  onPress={() => this.openCamera() } >
                    <Text style={styles.item_input}>{_("l_scan")}</Text>
                </Button>                        
                </Item>
            ] 
            }
            {this.props.serverInfo.url != "" && 
                <Item regular style={[iStyle.no_border,{marginBottom:20}]}>
                    <Text style={[styles.item_input,styles.title_color,{fontSize:30}]}>{_("l_getServerInfoSu")}</Text>                        
                </Item>
            }
           
            <Item regular style={[iStyle.no_border]}>
                <Button style={[iStyle.scan_button,{backgroundColor:'white'}]} primary full  onPress={() => Actions.push('login')}>
                    <Text style={[styles.item_input,styles.btnYellow]}>{_("l_enrolled")}</Text>
                </Button>                        
            </Item>
        </View>
    );
    secondRoute = () => (
        <View style={ [iStyle.imgBackground , iStyle.center]} >
            <Item regular style={[iStyle.no_border,{marginBottom:20}]}>
                <Text style={[styles.item_input,styles.title_color,{fontSize:30}]}>{_("l_pleasescan")}</Text>                        
            </Item>
            <Item regular style={[iStyle.no_border,{marginBottom:20}]}>
                <Button style={iStyle.scan_button} primary full  onPress={() =>  this.openCamera() } >
                    <Text style={styles.item_input}>{_("l_scan")}</Text>
                </Button>                        
            </Item>
            <Item regular style={[iStyle.no_border,{marginBottom:20}]}>
                         
            </Item>
        </View>
    ); 
    async onBarCodeRead(scanResult) {
       console.log(scanResult.data)
        if (this.stop) return
        this.stop = true
        if (scanResult.type == "CODE_128" || scanResult.type=="org.iso.Code128")
        {
            if (scanResult.data.indexOf("http")>-1)
            {
                Storage.update("settingsServerInfo", "url", scanResult.data);
                this.stop = false;
                this.setState({showBarcode:false})

            }else{
                console.log('scanResult.data' , scanResult.data)
                Storage.update("settingsUserInfo", "residentId", scanResult.data);
                Actions.push('newperson')
            }
           
        }
    }
    async componentWillReceiveProps(){
        this.setState({
            index: 0,
            routes: [
              { key: 'community', title: _("f_community") },
              { key: 'Household', title: _("f_Household") },
            ],
            camera: {
                barcodeFinderVisible: true,
                cameraType:Camera.constants.Type.back
            },
            showBarcode:false
        })
    }
    state = {
        index: 0,
        routes: [
          { key: 'community', title: _("f_community") },
          { key: 'Household', title: _("f_Household") },
        ],
        camera: {
            barcodeFinderVisible: true,
            cameraType:Camera.constants.Type.back
        },
        showBarcode:false
       
      };
   
    render() {

        return (
            <Container>
                <StatusBar hidden />
                    <Content bounces={false} contentContainerStyle={{flex: 1}} style={styles.content}>
                    { this.state.showBarcode &&
                    <View style={ [iStyle.imgBackground , iStyle.center]} >  
                        <Camera
                            style={ [iStyle.imgBackground , styles.barcode]} 
                            ref={ref => {
                            this.camera = ref;
                            }}
                            aspect={Camera.constants.Aspect.fill}
                            barcodeFinderVisible={this.state.camera.barcodeFinderVisible}
                            barcodeFinderWidth={200}
                            barcodeFinderHeight={200}
                            barcodeFinderBorderColor="white"
                            barcodeFinderBorderWidth={2}
                            defaultTouchToFocus
                            mirrorImage={false}
                            onBarCodeRead={this.onBarCodeRead.bind(this)}
                            onFocusChanged={() => {}}
                            onZoomChanged={() => {}}
                            permissionDialogTitle={'Permission to use camera'}
                            permissionDialogMessage={'We need your permission to use your camera phone'}
                            type={this.state.camera.cameraType}
                            >
                            <Button style={{ position: 'absolute', left: 20,top:20}}  transparent  onPress={() => this.setState({showBarcode:false})}>
                                <Image style={{ height: 30,width:30}} source={rcImages.back}/>
                            </Button>
                            {/* <View style={styles.rectangleContainer}>
                                <View style={styles.rectangle}/>
                                <Animated.View style={[
                                    styles.border,
                                    ]}/>
                            </View> */}
                        </Camera>
                    </View>
                    }
                     { !this.state.showBarcode &&
                    <ImageBackground style={ iStyle.imgBackground } 
                            resizeMode='cover' 
                            source={rcImages.backgroundImage} >
                            <View style={ [iStyle.imgBackground , iStyle.center]} >
                                <Item regular style={[iStyle.no_border,{flex:1}]}>
                                    <View style={ [iStyle.imgBackground ,styles.row_base, styles.center,{height:'auto'}] } >
                                        <Image style={{height: "60%"}} resizeMode="contain" source={rcImages.icon} />
                                    </View>
                                </Item>
                                <Item regular style={[iStyle.no_border,{flex:2,backgroundColor:'white',width: Dimensions.get('window').width}]}>
                                <TabView
                                    navigationState={this.state}
                                    renderScene={SceneMap({
                                    community: this.firstRoute,
                                    Household: this.secondRoute,
                                    })}
                                    tabContainerStyle={{
                                        elevation:0
                                      }}
                                    onIndexChange={index => this.setState({ index })}
                                    initialLayout={{ width: Dimensions.get('window').width ,height:10 }}   
                                    renderTabBar={(props) =>
                                        <TabBar
                                          {...props}
                                          labelStyle={ styles.title_color }
                                          style={{ backgroundColor: 'white'  }}
                                          indicatorStyle={[{height:'15%'  },styles.backYellow]}
                                        />
                                    }   
                                />
  
                                </Item>
                              
                            </View>
                        </ImageBackground>
                     }
                    </Content>
            </Container>
        );
    }

}  

const styles = EStyleSheet.create({
    content: {
        backgroundColor: "$bgColor"
    },
    btnYellow:{
        color:"$mainYellow"
    },
    backYellow:{
        backgroundColor:"$mainYellow"
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
    title_color:{
        color:'rgb(92,91,92)' ,
        fontSize: 23
    },
    scanbackground:{
        backgroundColor:'white'
    },
    barcode:{
        position: 'absolute',
        left: 0 ,
        top:0
    },
    rectangleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    rectangle: {
        height: 200,
        width: 200,
        borderWidth: 1,
        borderColor: '#00FF00',
        backgroundColor: 'transparent'
    },
    rectangleText: {
        flex: 0,
        color: '#fff',
        marginTop: 10
    },
    border: {
        flex: 0,
        width: 200,
        height: 2,
        backgroundColor: '#00FF00',
    }
  });
  