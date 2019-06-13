import React, {Component, ReactElement} from 'react';
import {Platform, View, Image, TouchableOpacity} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Item, Input, H1 } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Actions } from 'react-native-router-flux';
import { rcImages } from '../../../../resources/images';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Iconion from 'react-native-vector-icons/Ionicons';
import frs, {RecognizedUser, UnRecognizedUser, UserType, Gender} from './../../../../services/frs-service';
import { Subscription } from 'rxjs';
import { VideoView } from 'react-native-stream-rtsp';
import moment from 'moment';
import 'moment/min/locales';

import { OutlineElement } from '../outline-element';
import { Face } from '../face';
import { StorageInstance as Storage, SettingsVideo } from './../../../../config';
import { Connect, ConnectObservables, ConnectIsEmpty } from './../../../../../helpers/storage/connect';
import lang, { _ } from './../../../../../core/lang';

import Shimmer from 'react-native-shimmer';


interface Props {
    lang: string;
}
interface States {
    faces?: ((RecognizedUser | UnRecognizedUser) & {touchtime: number})[];
    now?: Date;
}

@ConnectObservables({
    lang: lang.getLangObservable()
})
export class VideoPage extends Component<Props, States> {
    private config: SettingsVideo;
    private camset;
    constructor(props) {
        super(props);
        
        this.config = Storage.get("settingsVideo");
        if (this.config.videoSourceIp && this.config.videoSourcePort && this.config.videoSourceUri) {
            this.camset = {
                name: 'TEST-CAM',
                ip: this.config.videoSourceIp,
                port: +this.config.videoSourcePort,
                account: this.config.videoSourceAccount,
                password: this.config.videoSourcePassword,
                model: 'TEST-CAM',
                mac: '',
                channelid: 0,
                firmware: '',
                uri: this.config.videoSourceUri
            }
        }

        this.state = {
            faces: [],
            now: new Date()
        }
    }

    private subscription: Subscription;
    private subscription2: Subscription;
    private timer;
    componentDidMount() {
        this.subscription = frs.sjLiveFace.subscribe( (data) => {
            this.handleFace(data);
        });
        this.subscription2 = frs.livestream.subscribe();
        this.timer = setInterval( () => {
            /// remove outdate faces
            this.setState( (prevState) => {
                let changed = false;
                let now = new Date();
                var faces = prevState.faces.map( (face) => {
                    if (now.valueOf() - face.touchtime > 1000*(+this.config.mergeFaceDuration)) {
                        changed = true;
                        return;
                    }
                    return face;
                } );
                if (!changed) return {now};
                faces = faces.filter( (v) => v !== undefined );
                return { faces, now };
            });

        }, 1000);
    }
    componentWillUnmount() {
        this.subscription.unsubscribe();
        this.subscription2.unsubscribe();

        clearInterval(this.timer);

        this.thisref && this.thisref.Stop();
    }

    private getHourString(date: Date | number) {
        if (typeof date === 'number') date = new Date(date);
        return `${this.pad(date.getHours(), 2)}:${this.pad(date.getMinutes(), 2)}:${this.pad(date.getSeconds(), 2)}`;
    }
    private getDateString(date: Date | number) {
        if (ConnectIsEmpty(this.props.lang)) return;
        if (typeof date === 'number') date = new Date(date);
        /// to extract first part of lang
        let lang = this.props.lang;
        if (lang.indexOf("zh") < 0) {
            let regex = /^([a-z]+)\-?/i;
            lang = lang.match(regex)[1];
        }
        moment.locale(lang);
        return moment().format('LL');
    }
    private pad(n, width, z?) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
    private handleFace(face: RecognizedUser | UnRecognizedUser) {
        if (!this.config.showStranger && face.type === UserType.UnRecognized) return;

        /// filter Face Recognition Source
        let frSource = this.config.faceRecognitionSource;
        if (frSource && frSource.length > 0) {
            if (frSource.indexOf(face.channel) < 0) return;
        }

        this.setState( (prevState) => {
            let idx = -1;
            for (let i=0; i<prevState.faces.length; ++i) {
                let thisface = prevState.faces[i];
                if (face.valFaceId === thisface.valFaceId) {
                    idx = i;
                    break;
                }
            }
            return {
                faces: [
                    ...(idx > 0  ? prevState.faces.slice(0, idx) : []),
                    { ...face, face_feature: undefined, touchtime: new Date().valueOf() },
                    ...prevState.faces.slice(idx+1, prevState.faces.length)
                ]
            }
        });
    }

    private first: boolean = true;
    private thisref;
    render() {
        return (
            <Container>
                <Content bounces={false} contentContainerStyle={{flex: 1}} style={styles.content}>
                    {/* background image */}
                    {/* <Image source={rcImages.rtsp_test} resizeMode="cover" style={{flex: 1, width: '100%'}} /> */}

				<VideoView style={{flex: 1, width: '100%'}}
					ref={(ref) => {
                        if (ref && this.first && this.camset) {
                            this.thisref = ref;
                            ref.Start([this.camset]);
                            this.first = false;
                        }
                    }}
					/>

                    {/* company name */}
                    <Shimmer style={styles.company_title_position} duration={2600}>
                        <H1 style={styles.company_title}>{this.config.companyName || "旭人科技股份有限公司"}</H1>
                    </Shimmer>

                    {/* time */}
                    <OutlineElement style={styles.time_position} width={3} shadowRadius={5}>
                        <H1 style={styles.time}>{this.getHourString(this.state.now)}</H1>
                    </OutlineElement>

                    {/* date */}
                    <OutlineElement style={styles.date_position} width={3} shadowRadius={5}>
                        <H1 style={styles.date}>{this.getDateString(this.state.now)}</H1>
                    </OutlineElement>

                    {/* face area */}
                    <View style={styles.face_area}>
                    {
                        this.state.faces.map( (user) => {
                            return <Face key={user.valFaceId} user={user} style={styles.face_area_faces} />
                        })
                    }
                    </View>

                    {/* Setup */}
                    <TouchableOpacity style={styles.setup_icon_touchable} activeOpacity={0.7} onPress={() => Actions.push('setup')}>
                        <Iconion name='md-cog' style={styles.setup_icon} />
                    </TouchableOpacity>

                </Content>
            </Container>
        );
    }
}

const styles = EStyleSheet.create({
    content: {
        backgroundColor: "$bgColor"
    },

    company_title_position: {
        position: "absolute",
        left: "6 rem", top: "6.5 rem"
    },

    company_title: {
        $fontSize: "20 rem",
        backgroundColor: '#26262688',
        color: "white",
        fontSize: "$fontSize",
        lineHeight: "$fontSize * 1.3",
        paddingLeft: "4 rem",
        paddingRight: "4 rem",
        borderRadius: "3 rem"
    },

    time_position: {
        position: "absolute",
        right: "4 rem",
        top: "3 rem",
    },
    time: {
        $fontSize: "22 rem",
        backgroundColor: "transparent",
        color: "black",
        fontFamily: 'monospace',
        fontSize: "$fontSize",
        lineHeight: "$fontSize * 1.1",
        textShadowColor: 'rgba(255, 255, 255, 0.75)',
    },

    date_position: {
        position: "absolute",
        right: "7 rem",
        top: "30 rem",
    },
    date: {
        $fontSize: "11 rem",
        backgroundColor: "transparent",
        color: "black",
        fontSize: "$fontSize",
        lineHeight: "$fontSize * 1.1",
        textShadowColor: 'rgba(255, 255, 255, 0.75)',
    },

    face_area: {
        position: 'absolute',
        left: '5 rem', bottom: '3 rem',
        flexDirection: 'row',
        alignItems: 'flex-end',
        // backgroundColor: 'red'
    },
    face_area_faces: {
        marginLeft: '1.5 rem', marginRight: '1.5 rem'
    },

    setup_icon_touchable: {
        position: "absolute",
        right: "5 rem",
        bottom: "5 rem"
    },
    setup_icon: {
        fontSize: "24 rem",
        color: "#AAAABB",
    }

});
  

let TEST_CAM = {
    name: 'TEST-CAM',
    ip: '172.16.10.38',
    port: 554,
    account: 'admin',
    password: '',
    model: 'TEST-CAM',
    mac: '',
    channelid: 0,
    firmware: '',
    uri: '/live2.sdp'
  }


let testregistered = { type: 1,
    person_info: { fullname: 'I-00044', employeeno: 'I-00044', cardno: '123456' },
    last_recognized: 
     { timestamp: 1542357389723,
       face_id_number: 'jl5205xgKGbkVH5f5E7bVl1f' },
    person_id: '5b7d489c9d34e0054692fd29',
    score: 0.99237,
    target_score: 0.9,
    snapshot: 'i1542357395827_5f6286893f37ecfe.jpg',
    channel: 'Camera_04_01',
    timestamp: 1542357395828,
    verify_face_id: '5bee81939b1074079691cc57',
    action_enable: 1,
    request_client_param: 'joh5qvmsmAbnLgWOlVj4zWZm',
    groups: [],
    valFaceId: 1,
    face_feature: undefined };  

let testvip = { type: 1,
    person_info: { fullname: 'I-00044', employeeno: 'I-00044', cardno: '123456' },
    last_recognized: 
     { timestamp: 1542357389723,
       face_id_number: 'jl5205xgKGbkVH5f5E7bVl1f' },
    person_id: '5b7d489c9d34e0054692fd29',
    score: 0.99237,
    target_score: 0.9,
    snapshot: 'i1542357395827_5f6286893f37ecfe.jpg',
    channel: 'Camera_04_01',
    timestamp: 1542357395828,
    verify_face_id: '5bee81939b1074079691cc57',
    action_enable: 1,
    request_client_param: 'joh5qvmsmAbnLgWOlVj4zWZm',
    groups: [ { name: 'VIP', group_id: '5be2f8809b10740796916a2c' } ],
    valFaceId: 1,
    face_feature: undefined };

let testblacklist = { type: 1,
    person_info: { fullname: 'I-00044', employeeno: 'I-00044', cardno: '123456' },
    last_recognized: 
        { timestamp: 1542357389723,
        face_id_number: 'jl5205xgKGbkVH5f5E7bVl1f' },
    person_id: '5b7d489c9d34e0054692fd29',
    score: 0.99237,
    target_score: 0.9,
    snapshot: 'i1542357395827_5f6286893f37ecfe.jpg',
    channel: 'Camera_04_01',
    timestamp: 1542357395828,
    verify_face_id: '5bee81939b1074079691cc57',
    action_enable: 1,
    request_client_param: 'joh5qvmsmAbnLgWOlVj4zWZm',
    groups: [ { name: 'Blacklist', group_id: '5be2f8809b10740796916a2c' } ],
    valFaceId: 1,
    face_feature: undefined };    

let testvisitor = { type: 1,
    person_info: { fullname: 'I-00044', employeeno: 'I-00044', cardno: '123456' },
    last_recognized: 
        { timestamp: 1542357389723,
        face_id_number: 'jl5205xgKGbkVH5f5E7bVl1f' },
    person_id: '5b7d489c9d34e0054692fd29',
    score: 0.99237,
    target_score: 0.9,
    snapshot: 'i1542357395827_5f6286893f37ecfe.jpg',
    channel: 'Camera_04_01',
    timestamp: 1542357395828,
    verify_face_id: '5bee81939b1074079691cc57',
    action_enable: 1,
    request_client_param: 'joh5qvmsmAbnLgWOlVj4zWZm',
    groups: [ { name: 'Visitor', group_id: '5be2f8809b10740796916a2c' } ],
    valFaceId: 1,
    face_feature: undefined };        

let teststranger = { type: 0,
        person_info: { fullname: 'I-00044', employeeno: 'I-00044', cardno: '123456' },
        highest_score: {
            score: 0.7,
            name: "Val"
        },
        last_recognized: 
            { timestamp: 1542357389723,
            face_id_number: 'jl5205xgKGbkVH5f5E7bVl1f' },
        person_id: '5b7d489c9d34e0054692fd29',
        score: 0.99237,
        target_score: 0.9,
        snapshot: 'i1542357395827_5f6286893f37ecfe.jpg',
        channel: 'Camera_04_01',
        timestamp: 1542357395828,
        verify_face_id: '5bee81939b1074079691cc57',
        action_enable: 1,
        request_client_param: 'joh5qvmsmAbnLgWOlVj4zWZm',
        groups: [ { name: 'Blacklist', group_id: '5be2f8809b10740796916a2c' } ],
        valFaceId: 1,
        face_feature: undefined };    