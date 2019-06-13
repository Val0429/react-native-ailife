import React, {Component} from 'react';
import { ImageBackground, ScrollView  ,Image ,TextInput, TouchableOpacity} from 'react-native';
import { Container, Header, View, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Icon, Item, Input, Label, Picker, CardItem, Card, Toast ,Tab,Tabs} from 'native-base';

import { EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _, SettingsUserInfo,ReadedItem ,ReadedCount} from './../../../../../helpers/core-packages';

import iStyle from '../../../../resources/style/main-style.js'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import server, { ContactGet } from './../../../../services/smart-community-server';
import { makeGasItem } from '../../helpers/make-gas-item';
import { makeContactItem  } from '../../helpers/make-contact-item';
import Modal from "react-native-modal";
import ImagePicker from 'react-native-image-picker';

import Device from '../../../../contents/react-native-device-detection-val';
import { MainTapView } from "../../helpers/main-TapView";
import { ReceiveStatus } from "../../../../enums"

interface Props {
    lang?: string;
    userInfo:SettingsUserInfo;
    readedCount:ReadedCount
}
interface State {
    finishResults?: ContactGet.Output[];
    contetResults?: ContactGet.Output[];
    index: number,
    title:string,
    content:string,
    attachment?:string,
    modalVisible:boolean,
    modalImage:string
}
 



@ConnectObservables({
    lang: lang.getLangObservable(),
    userInfo:Storage.getObservable("settingsUserInfo"),
    readedCount:Storage.getObservable('readedCount'),

})


export class ContactPage extends Component<Props ,State> {
    first =false;
    state = {
        index: 0,
        finishResults :[],
        contetResults:[],
        modalVisible:false,
        title:"",
        content:"",
        attachment : "",
        modalImage:"",
        routes: [
            { key: 'tab1', title: "新增聯絡事項" },
            { key: 'tab2', title: "已聯絡事項" },
            { key: 'tab3', title: "完成事項" },
        ],
        child :{
            tab1: this.initRoute,
            tab2: this.initRoute,
            tab3: this.initRoute
        }
    };

    constructor(props) {
        super(props);
       
      }

    async componentWillReceiveProps(nextProps){
        if (nextProps.userInfo.residentId!=undefined){
            if (this.first){ 
                return
            }
            else{
                this.first= true;
                await this.getData(nextProps);
            }
        }
    }

    async getData(Props)
    {
        let finishResults:any= await this.getFinishResults(Props)
        let contetResults:any= await this.getContetResults(Props)

        let accountReadSatus = this.getAccountReadSatus();
        accountReadSatus.contactReadedCount = finishResults.content.length;
        this.updateAccountReadSatus(accountReadSatus);

        this.setState({ 
            finishResults: [...finishResults.content],
            contetResults: [...contetResults.content]
        },
        function(){ 
            this.setState({
                child :{
                    tab1: this.newContactRoute,
                    tab2: this.contentRoute,
                    tab3: this.finishedRoute

                },
            })
        }
        );

    } 

    getAccountReadSatus():ReadedItem{
        for (let index = 0; index < this.props.readedCount.totalReadedCount.length; index++) {
            const element:ReadedItem= this.props.readedCount.totalReadedCount[index];
            if (element.account==this.props.userInfo.account)
            {
                return element;
            }
            
        }
        return null;
    }

    updateAccountReadSatus(newElement){
        for (let index = 0; index < this.props.readedCount.totalReadedCount.length; index++) {
            const element:ReadedItem= this.props.readedCount.totalReadedCount[index];
            if (element.account==this.props.userInfo.account)
            {
                this.props.readedCount.totalReadedCount[index] = newElement;
            }
            
        }
        Storage.update("readedCount" ,"totalReadedCount"  ,this.props.readedCount.totalReadedCount)
       
    }
    callListendApi= async() =>
    {
        let _date :any;
        if (this.state.attachment!="")
        {
            _date = {
                sessionId: this.props.userInfo.sessionId,
                residentId:this.props.userInfo.residentId,
                title:this.state.title,
                content:this.state.content,
                attachment :this.state.attachment
            }
        }else{
            _date = {
                sessionId: this.props.userInfo.sessionId,
                residentId:this.props.userInfo.residentId,
                title:this.state.title,
                content:this.state.content,
                
            }
        }
        //
        await server.C("/listen", _date).catch(err => {
            console.log(err);
        })
        await this.setState({title :"",content:"" ,attachment :""})
        await this.initViwe();
        await this.getData(this.props)
    }


    async getFinishResults(Props){
        let results:any= await server.R("/listen", {
            sessionId: Props.userInfo.sessionId,
            status:ReceiveStatus[0]
        }).catch(err => {
            console.log(err);
            return null;
        });
        return results
    }

    async getContetResults(Props){
        let results:any= await server.R("/listen", {
            sessionId: Props.userInfo.sessionId,
            status:ReceiveStatus[1]
        }).catch(err => {
            console.log(err);
            return null;
        });
        return results
    }


    render() {

        return (

            <Content>
                <MainTapView state ={this.state}  title={_("m_ContactManagementCommittee")} child={this.state.child}  onPress = { (_index) => this.setState({ index:_index }) }  />
            
                {this.modal()}
            </Content>
           
        )
    }
    modal()
    {
        return (
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
                            <TouchableOpacity style={{width:'100%',height:'100%'}}  onPress= {this.closeModalVisible} >
                                <ImageBackground style={ iStyle.imgBackground } 
                                resizeMode='cover' 
                                source={  {uri:this.state.modalImage}} />
                                <Item style={[styles.modalItem,iStyle.no_border]}>
                                </Item>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
        )
    }
    
    finishedRoute  =() => {
        return (
            <Content bounces={false} scrollEnabled={false} contentContainerStyle={{flex: 1}}>
                <ScrollView>
                    <View style={ [iStyle.imgBackground , iStyle.center,styles.mainView,iStyle.mainView] } >
                        {
                            this.state && this.state.finishResults && (
                            this.state.finishResults.map( (data ,index) => {
                                return makeContactItem(data, index,this.props.userInfo.name,() => this.openModalVisible(data));}))   
                        }
                       
                    
                    </View>        
                 </ScrollView>
            </Content>
        )
    };

    contentRoute  =() => {
        return (
            <Content bounces={false} scrollEnabled={false} contentContainerStyle={{flex: 1}}>
                <ScrollView>
                    <View style={ [iStyle.imgBackground , iStyle.center,styles.mainView,iStyle.mainView] } >
                        {
                            this.state && this.state.contetResults && (
                            this.state.contetResults.map( (data ,index) => {
                                return makeContactItem(data, index,this.props.userInfo.name,() => this.openModalVisible(data))}))   
                        }
                       
                    
                    </View>        
                 </ScrollView>
            </Content>
        )
    };

    initRoute () {
       return (
        <View style={ [iStyle.imgBackground , iStyle.center,styles.mainView ,iStyle.mainView] } >
        {/* { makeMessageItem("未讀郵件","2018/11/10收件" , "11:20" ,false ,  () => this.openModalVisible('2'))} */}
       </View>
       )
    }
  
    initViwe(){
        this.setState({ 
            finishResults: [],
            contetResults:[]
        },
        function(){ 
            this.setState({
                child :{
                    tab1: this.initRoute,
                    tab2: this.initRoute,
                    tab3: this.initRoute,
                },
            })
        }
        );
    }
    showImagePicker(){
        // if (this.state.attachment !="") return;
        const options = {
            title: 'Select Avatar',
            customButtons: [{ name: 'phone', title: 'Choose Photo' }],
            storageOptions: {
              skipBackup: true,
              path: 'images',
            },
          };

        ImagePicker.launchImageLibrary(options, (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                this.setState({
                    attachment :'data:image/jpeg;base64,' + response.data
                })
    // You can also display the image using data:
    // const source = { uri: 'data:image/jpeg;base64,' + response.data };

            }
          });
    }

    newContactRoute =() => {
        return (
         <View style={ [iStyle.imgBackground , iStyle.center,styles.mainView] } >
            <View style={ [iStyle.imgBackground , iStyle.center,styles.mainView,styles.marginView] } >
                <Item regular style={[iStyle.no_border, iStyle.contactitemStyle]}>
                    <Input
                        maxLength={8}
                        placeholder={_("c_Title")}
                        style={[ styles.loginText,{height:'100%'}]}
                        autoCapitalize='none'
                        onChangeText={(value) => this.setState({ title:value })}
                        value={this.state.title} />                                      
                </Item>  

                <Item regular style={[iStyle.no_border, iStyle.contactStyle]}>
                    <Input
                        multiline = {true}  
                        numberOfLines = {8}    
                        placeholder={_("c_Contact")}
                        style={[styles.loginText ,styles.textInput_mult]}
                        autoCapitalize='none'
                        onChangeText={(value) => this.setState({ content:value })}
                        value={this.state.content}
                        />                                     
                </Item>  
                <Item regular style={[iStyle.no_border, iStyle.contactitemStyle,{backgroundColor:'Transparent'}]}>
                <TouchableOpacity style={[iStyle.no_border, iStyle.contactitemStyle,{backgroundColor:'Transparent'}]} onPress={() =>this.showImagePicker()} >
                    <Text style={[styles.loginText,{position:'absolute' ,left:0 ,color:'#737373'}]}>附加檔案</Text>   
                    <Image style={{ height: 20,width:20}} source={rcImages.paperclip}/>
                </TouchableOpacity>
                 
                </Item>

              
                <Item  style={[iStyle.no_border,styles.btn]}>
                    <Button style={[iStyle.item_button]} full onPress={() =>this.callListendApi()} >
                        <Text style={styles.item_input}>新增聯絡事項</Text>
                    </Button>   
                </Item>

            </View>
           
        </View>
        )
    }

    openModalVisible = (_data:ContactGet.Output)=> {
        if (_data.attachmentSrc == "") return
        this.setState({
            modalVisible: true,
            modalImage: server.getUrl()+_data.attachmentSrc ,
        });    
    
    }
    closeModalVisible = ()=> {
        this.setState({
            modalVisible: false
        });    
    
    }
}  





const styles = EStyleSheet.create({
    mainView:{
        backgroundColor:'rgb(241,243,241)',
        justifyContent:"flex-start",
        paddingLeft:10,
        paddingRight:10,
        paddingTop:10,
        paddingBottom:10,
    },
    marginView:{
      
    },
    modal: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
    },
    modalView:{
        flex: 1,
        backgroundColor:'transparent',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalImageView:{
        width: '300rem',
        height: '300rem' , 
    },
    modalTitle:{
        fontSize:'20rem', 
        position: 'absolute', 
        left: 0 
    },
    modalItem:{
        position:'absolute',
        top:5,right:5 ,
        height:50,
        width:50
    },
    modalcontent:{
        fontSize:'18rem', 
        position: 'absolute', 
        left: 50
    },
    loginText: {
        ...Device.select({
          phone: { fontSize: 19, },
          tablet: { fontSize: 16}
        }),
        color: 'black'
    },
    marginLeft:{
    },
    textInput_mult:{
        textAlign:'left',
        textAlignVertical:'top',
        alignSelf:'flex-start',
        justifyContent:'flex-start',
        alignItems:'flex-start', 
        width:'100%'
    },
    item_input: {
        color: "white",
        fontSize: "22 rem"
    },
    btn:{
        position:'absolute',
        bottom:0,
    }
});
  