import React, {Component} from 'react';
import {Platform, StatusBar, Image, NativeModules, requireNativeComponent,ImageBackground} from 'react-native';
import { Container, Header, View, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Icon, Item, Input, Label, Picker, CardItem, Card, Toast } from 'native-base';
import iStyle from '../../resources/style/main-style.js'

import {
    EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _, SettingsUserInfo,ReadedCount,ReadedItem
} from './../../../helpers/core-packages';
import { makeMainButton } from './helpers/make-main-button';

import { CommonPage } from './pages/common-page';
import { CommunityPage } from './pages/community-page';
import { AnnouncementPage} from './pages/community/announcement-page';
import { WeatherPage} from './pages/community/weather-page';
import { ResidentPage } from './pages/resident-page';
import { SettingPage } from './pages/settinng-page';
import server, { ManageCostGet } from './../../services/smart-community-server';
import { ReceiveStatus } from "../../enums";
import Device from '../../contents/react-native-device-detection-val';



interface Props {
    lang: string;
    userInfo:SettingsUserInfo;
    readedCount:ReadedCount
}

enum EPage {
    Common,
    Resident,
    Community,
    Weather,
    Setting
}

interface State {
    page: EPage;
    residentNotReadCount?:number;
    comunityNotReadCount?:number;
    commonNotReadCount?:number;
    managerNotReadCount?: number;
    packageNotReadCount?: number;
    mailNotReadCount?: number;
    returnNotReadCount?: number;
    vistorNotReadCount?: number;
    gasNotReadCount?: number;
    voteNotReadCount?: number;
    contactNotReadCount?: number;

    announcementNotReadCount?:number;
}

@ConnectObservables({
    lang: lang.getLangObservable(),
    readedCount:Storage.getObservable('readedCount'),
    userInfo:Storage.getObservable("settingsUserInfo")
})
export class MainContent extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            page: EPage.Common,
            residentNotReadCount: 0,
            comunityNotReadCount : 0,
            commonNotReadCount : 0,
            managerNotReadCount: 0,
            packageNotReadCount: 0,
            mailNotReadCount: 0,
            returnNotReadCount: 0,
            vistorNotReadCount: 0,
            gasNotReadCount: 0,
            voteNotReadCount: 0,
            contactNotReadCount: 0,
            announcementNotReadCount:0,
         
        }
    }
   

    async componentWillReceiveProps(props){
        console.log('props.userInfo.totalReadedCount',props.readedCount.totalReadedCount!)
        if (props.readedCount.totalReadedCount!=undefined ){
            await this.getResidentData(props);
            await this.getComunityData(props);
        }
        await this.setState({
            commonNotReadCount : this.state.announcementNotReadCount+
                                 this.state.mailNotReadCount+this.state.managerNotReadCount
        })
    }

    async getComunityData (props){
        let allAnnouncementCount = await this.getAnnouncementCount(props);
        let allVoteCount = await this.getVoteCount(props);
        let allContactCount = await this.getContactResults(props);
        let totalCount = allAnnouncementCount + allVoteCount +allContactCount;

        let readCountByAccount:ReadedItem = this.getAccountReadSatus();
        console.log('readCountByAccount' ,readCountByAccount)
        let totalReadedCount = readCountByAccount.announcmentReadedCount+readCountByAccount.voteReadedCount+
        readCountByAccount.contactReadedCount
                           
        if (!isNaN(parseInt(totalCount)-totalReadedCount))
        await this.setState({
            comunityNotReadCount:totalCount-totalReadedCount,
            announcementNotReadCount :allAnnouncementCount-readCountByAccount.announcmentReadedCount,
            voteNotReadCount:allVoteCount-readCountByAccount.voteReadedCount,
            contactNotReadCount:allContactCount-readCountByAccount.contactReadedCount
        })
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
  
    async getResidentData (props){
        let allManagerCount = await this.getManagerCount(props);
        let allMailCount = await this.getMailCount(props);
        let allReturnCount = await this.getReturnCount(props);
        let allVistorCount = await this.getVistorCount(props);
        let allGasCount = await this.getGasCount(props);
        let totalCount = allManagerCount + allMailCount +allReturnCount +allVistorCount +allGasCount;
        let readCountByAccount:ReadedItem = this.getAccountReadSatus();
        console.log('readCountByAccount' ,readCountByAccount)
        let totalReadedCount = readCountByAccount.managerReadedCount+readCountByAccount.mailReadedCount+
                               readCountByAccount.gasReadedCount+readCountByAccount.returnReadedCount
                               +readCountByAccount.vistorReadedCount;
        // let totalReadedCount = this.props.readedCount.managerReadedCount+this.props.readedCount.mailReadedCount+
        //                       this.props.readedCount.gasReadedCount+this.props.readedCount.returnReadedCount+
        //                       this.props.readedCount.vistorReadedCount
        if (!isNaN(parseInt(totalCount)-totalReadedCount))
        await this.setState({
            residentNotReadCount:totalCount-totalReadedCount,
            managerNotReadCount:allManagerCount-readCountByAccount.managerReadedCount,
            mailNotReadCount:allMailCount-readCountByAccount.mailReadedCount,
            vistorNotReadCount :allVistorCount-readCountByAccount.vistorReadedCount,
            gasNotReadCount : allGasCount-readCountByAccount.gasReadedCount,
            returnNotReadCount:allReturnCount-readCountByAccount.returnReadedCount
        })

    }

    async getManagerCount(props){
        let results:any= await server.R("/manage-cost", {
            sessionId: props.userInfo.sessionId,
            status: "all",
        }).catch(err => {
            console.log(err);
            return 0;
        })
      //  Storage.update("readedCount","managerTotalCount",results.content.length)
        return results.content.length;
    }
    
    async getMailCount(props)
    {
        let results:any= await server.R("/package/receive", {
            sessionId: props.userInfo.sessionId,
            status:  ReceiveStatus[1],
        }).catch(err => {
            console.log(err);
            return 0;
            //Alert.alert(_("a_title"),_("a_loginError"))
        })
       // Storage.update("readedCount","mailTotalCount",results.content.length)

        return results.content.length;
    }

    async getReturnCount(props)
    {
        let results:any= await server.R("/package/return", {
            sessionId: props.userInfo.sessionId,
            status: ReceiveStatus[1],
        }).catch(err => {
            console.log(err);
            return 0;

        })
       // Storage.update("readedCount","returnTotalCount",results.content.length)

        return results.content.length;

    }
    async getVistorCount(props)
    {
        let results:any= await server.R("/visitor", {
            sessionId: props.userInfo.sessionId,
            status: "prev",
        }).catch(err => {
            console.log(err);
            return 0;
        })
       // Storage.update("readedCount","vistorTotalCount",results.content.length)

        return results.content.length;
    }

    async getGasCount(props)
    {
        let results:any= await server.R("/gas", {
            sessionId: props.userInfo.sessionId,
            status: "all",
        }).catch(err => {
            console.log(err);
            return 0;
        });
       // Storage.update("readedCount","gasTotalCount",results.content.length)
        return results.content.length;
    }

    async getAnnouncementCount(props)
    {
        let results:any= await server.R("/public-notify", {
            sessionId: props.userInfo.sessionId
        }).catch(err => {
            console.log(err);
            return 0;
        });
        return results.content.length;
    }

    async getVoteCount(Props)
    {
        let results:any= await server.R("/vote/history", {
            sessionId: Props.userInfo.sessionId,
            status:ReceiveStatus[1]
        }).catch(err => {
            console.log(err);
            return 0;
        });

        return results.content.length;
    }

    async getContactResults(Props){
        let results:any= await server.R("/listen", {
            sessionId: Props.userInfo.sessionId,
            status:ReceiveStatus[0]
        }).catch(err => {
            console.log(err);
            return 0;
        });
        return results.content.length;
    }

    render() {
        return (
            <Container  style={{backgroundColor:'rgb(241,243,241)',margin:0}}>
                <StatusBar hidden />
                
                {
                    this.state.page === EPage.Common ? <CommonPage announcementNotReadCount={this.state.announcementNotReadCount}
                    managerNotReadCount={this.state.managerNotReadCount} mailNotReadCount={this.state.mailNotReadCount}  /> :

                    this.state.page === EPage.Community ? <CommunityPage announcementNotReadCount={this.state.announcementNotReadCount}  
                    voteNotReadCount={this.state.voteNotReadCount} contactNotReadCount={this.state.contactNotReadCount}/> :
                                    
                    this.state.page === EPage.Resident ? <ResidentPage managerNotReadCount={this.state.managerNotReadCount} 
                    mailNotReadCount={this.state.mailNotReadCount} vistorNotReadCount={this.state.vistorNotReadCount} 
                    gasNotReadCount={this.state.gasNotReadCount} returnNotReadCount={this.state.returnNotReadCount} /> : 
                 
                    this.state.page === EPage.Setting && <SettingPage /> 
                    
                    // <CommonPage />
                }
               

                <Footer style={Platform.Version ?styles.footer : styles.footer}  >
                        <Button style={[styles.btn]} active={this.state.page===EPage.Common} vertical onPress={() => this.setState({page: EPage.Common})}>
                            {this.state.commonNotReadCount>0 &&  
                                <View style={styles.smallCircle} >
                                    <Text style={styles.smallText}>{this.state.commonNotReadCount}</Text>
                                </View>
                            }
                            <Grid>
                                <Row size={6} style={[styles.row_base, styles.row_1_icon ]}>
                                    <Image style={{height: "100%"}} resizeMode="contain" 
                                        source={ this.state.page===EPage.Common ? rcImages.tabbar_icon1_g :rcImages.tabbar_icon1} />
                                </Row>
                                <Row size={3} style={[styles.row_base, styles.row_1_icon]}>
                                    <Text style={ [this.state.page===EPage.Common ?styles.footerTabButtonActive :styles.footerTabButton,styles.btnFontsize]}>{_("w_Common")}</Text>
                                </Row>
                            </Grid>
                        
                            
                        </Button>    

                        <Button style={styles.btn} active={this.state.page===EPage.Resident} vertical onPress={() => this.setState({page: EPage.Resident})}>
                            {this.state.residentNotReadCount>0 &&  
                                <View style={styles.smallCircle} >
                                    <Text style={styles.smallText}>{this.state.residentNotReadCount}</Text>
                                </View>
                            }
                            <Grid>
                                <Row size={6} style={[styles.row_base, styles.row_1_icon ]}>
                                    <Image style={{height: "100%"}} resizeMode="contain" 
                                        source={ this.state.page===EPage.Resident ? rcImages.tabbar_icon2_g :rcImages.tabbar_icon2} />
                                </Row>
                                <Row size={3} style={[styles.row_base, styles.row_1_icon]}>
                                    <Text style={ [this.state.page===EPage.Resident ?styles.footerTabButtonActive :styles.footerTabButton,styles.btnFontsize ] }>{_("w_Resident")}</Text>
                                </Row>
                            </Grid>
                        </Button>

                        <Button style={styles.btn} active={this.state.page===EPage.Community} vertical onPress={() => this.setState({page: EPage.Community})}>
                            {this.state.comunityNotReadCount>0 &&  
                                <View style={styles.smallCircle} >
                                    <Text style={styles.smallText}>{this.state.comunityNotReadCount}</Text>
                                </View>
                            }
                            <Grid>
                                <Row size={6} style={[styles.row_base, styles.row_1_icon ]}>
                                    <Image style={{height: "100%"}} resizeMode="contain" 
                                        source={ this.state.page===EPage.Community ? rcImages.tabbar_icon3_g :rcImages.tabbar_icon3} />
                                </Row>
                                <Row size={3} style={[styles.row_base, styles.row_1_icon]}>
                                    <Text style={ [this.state.page===EPage.Community ?styles.footerTabButtonActive :styles.footerTabButton,styles.btnFontsize ]}>{_("w_Community")}</Text>
                                </Row>
                            </Grid>
                        </Button>


                        <Button style={styles.btn} active={this.state.page===EPage.Setting} vertical onPress={() => this.setState({page: EPage.Setting})}>
                           
                            <Grid>
                                <Row size={6} style={[styles.row_base, styles.row_1_icon ]}>
                                    <Image style={{height: "100%"}} resizeMode="contain" 
                                    source={ this.state.page===EPage.Setting ? rcImages.tabbar_icon5_g :rcImages.tabbar_icon5} />
                                </Row>
                                <Row size={3} style={[styles.row_base, styles.row_1_icon]}>
                                    <Text style={  [this.state.page===EPage.Setting ?styles.footerTabButtonActive :styles.footerTabButton ,styles.btnFontsize] } >{_("w_setting")}</Text>
                                </Row>
                            </Grid>
                    </Button>  
                
                
                
                </Footer>
           
            </Container>
        )
    }
}  

const styles = EStyleSheet.create({
    footer:{
        // height:'70 rem',
        ...Device.select({
            phone: { height: 75 },
            tablet: {  height: 80 }
        }),
        backgroundColor:'white' ,  
        borderTopColor:'#DADBDA',
        borderTopWidth:1 ,
        width:'100%'
    },
    main_grid: {
        marginBottom: "15rem"
    },
    footerTabButton:{
        color:'#9B9B9B'
    },
    footerTabButtonActive:{
        color:'#A0C251'
    },
    btnFontsize:{
        fontSize: "16 rem",
    },
    btn:{
        backgroundColor:'white',
        width:'25%',
    },
    row_base: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    row_1_icon: {
       marginTop:3
    },
    smallCircle: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        backgroundColor:'red',
        top: '7rem',
        right: '15%',
        // height: '25rem',
        // width: '25rem',
        borderRadius: '15rem',
        zIndex:1000,
        ...Device.select({
            phone: { height: 25,width:25 },
            tablet: {  height: 25,width:25  }
        }),
    },
    smallText:{
        fontSize : "15rem",
        color:'white'
    }
});
  