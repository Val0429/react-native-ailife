import React, {Component, ReactElement} from 'react';
import {Platform, View, Image, TouchableOpacity, StyleProp, ViewStyle, Settings} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Container, Header, Title, Segment, Tabs, Tab, TabHeading, Content, ListItem, Switch, Footer, FooterTab, Button, Left, Right, Body, Text, Item, Input, H1, Label, Picker, CheckBox } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Actions } from 'react-native-router-flux';
import { rcImages } from './../../../../resources/images';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMaterial from 'react-native-vector-icons/MaterialIcons'
import IconOcticons from 'react-native-vector-icons/Octicons';
import { StorageInstance as Storage, SettingsVideo, makeIcon } from './../../../../config';
import { ItemDivider, ItemSwitch, ItemText, ItemColor, ItemPicker, ItemNavigate } from './../../../../../core/components/form';
import lang, { _ } from './../../../../../core/lang';
import { ConnectObservables } from './../../../../../helpers/storage/connect';
import frs, {RecognizedUser, UnRecognizedUser, UserType, Gender, IFCSSettings} from './../../../../services/frs-service';
import { timestamp } from 'rxjs/operator/timestamp';

interface IVideoSource {
    sourceId: string;
    url: string;
    ip: string;
    port: number;
    account: string;
    password: string;
    uri: string;
}

interface Props {
    settingsVideo?: SettingsVideo;
}

interface State {
    FRSConnected: boolean;
    videoSources?: IVideoSource[];
}


@ConnectObservables({
    settingsVideo: Storage.getObservable("settingsVideo"),
    lang: lang.getLangObservable()
})
export class Video extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            FRSConnected: frs.sjLogined.getValue()
        };
    }

    componentDidMount() {
        frs.sjLogined.getValue() &&
        frs.getFCSSettings()
            .then( (data) => {
                let sources = data.reduce( (final, item, index) => {
                    if (item.video_source_type !== 'rtsp') return final;
                    final.push({
                        sourceId: item.video_source_sourceid,   ///+`_${index}`,
                        url: `rtsp://${item.video_source_username}:${item.video_source_password}@${item.video_source_ip}:${item.video_source_port}${item.video_source_rtsp_path}`,
                        ip: item.video_source_ip,
                        port: item.video_source_port,
                        account: item.video_source_username,
                        password: item.video_source_password,
                        uri: item.video_source_rtsp_path,
                    });
                    return final;
                }, []);
                /// save for first time
                if (sources.length > 0) {
                    let source: IVideoSource = sources[0];
                    if (!this.props.settingsVideo.videoSourceId) {
                        this.saveRTSPSource(source);
                    }
                    if (!this.props.settingsVideo.faceRecognitionSource) {
                        Storage.update("settingsVideo", "faceRecognitionSource", [source.sourceId]);
                    }
                }
                this.setState({
                    videoSources: sources
                });
            });
    }

    private saveRTSPSource(source: IVideoSource) {
        Storage.update("settingsVideo", "videoSourceId", source.sourceId);
        Storage.update("settingsVideo", "videoSourceUrl", source.url);
        Storage.update("settingsVideo", "videoSourceIp", source.ip);
        Storage.update("settingsVideo", "videoSourcePort", source.port);
        Storage.update("settingsVideo", "videoSourceAccount", source.account);
        Storage.update("settingsVideo", "videoSourcePassword", source.password);
        Storage.update("settingsVideo", "videoSourceUri", source.uri);
    }

    render() {
        return (
            <View>
                <Button warning full><Text uppercase={false}>{_("m_RestartRequired")}</Text></Button>

                {/* Display */}
                <ItemDivider title={_("w_Display")} />
                <ItemText
                    title={_("w_CompanyName")}
                    { ...Storage.vbind(this, "settingsVideo", "companyName") }
                    icon={makeIcon(IconMaterial, "people")}
                    />
                
                {/* Video Source Selection */}
                {
                    this.state.FRSConnected ? (
                        <ItemPicker
                            title={_("m_VideoSourceSelection")}
                            items={this.state.videoSources && this.state.videoSources.map(v => v.sourceId)}
                            value={this.props.settingsVideo.videoSourceId}
                            onValueChange={(value) => {
                                let idx = this.state.videoSources.findIndex( (v) => v.sourceId === value );
                                if (idx >= 0) {
                                    let item = this.state.videoSources[idx];
                                    this.saveRTSPSource(item);
                                }
                            }}
                            icon={makeIcon(Icon, "video-input-antenna")}
                            />
                    ) : (
                        <ItemNavigate icon={makeIcon(Icon, "video-input-antenna")}
                            title={_("m_VideoSourceSelection")}
                            value={_("m_LoginFRSFailed")}
                            showArrow={false}
                        />
                    )
                }

                {/* Video Source Url */}
                {
                    this.props.settingsVideo.videoSourceUrl &&
                    <ItemNavigate icon={makeIcon(Icon, "comment-text-outline")}
                        title={_("m_VideoSourceUrl")}
                        value={this.props.settingsVideo.videoSourceUrl}
                        showArrow={false}
                    />
                }

                {/* Face Recognition Source */}
                {
                    this.state.FRSConnected && <ItemDivider title={_("m_FaceRecognitionSource")} />
                }
                {
                    this.state.FRSConnected && this.state.videoSources && (
                        this.state.videoSources.map( (source, index) => {
                            let sourceId = source.sourceId;
                            //let checked = sourceId === this.props.settingsVideo.videoSourceId;
                            let checked = this.props.settingsVideo.faceRecognitionSource.findIndex((v) => v===sourceId) >= 0;
                            return (
                                <ListItem key={index}>
                                    <CheckBox
                                        checked={checked}
                                        onPress={() => {
                                            let source = this.props.settingsVideo.faceRecognitionSource;
                                            if (checked) {
                                                let idx = source.findIndex((v) => v === sourceId);
                                                if (idx < 0) return;
                                                source.splice(idx, 1);
                                                Storage.update( "settingsVideo", "faceRecognitionSource", source);
                                            } else {
                                                let idx = source.findIndex((v) => v === sourceId);
                                                if (idx >= 0) return;
                                                Storage.update( "settingsVideo", "faceRecognitionSource", [...source, sourceId] );
                                            }
                                        }}
                                        />
                                    <Body>
                                        <Text>{source.sourceId}</Text>
                                    </Body>
                                </ListItem>
                            )
                        })
                    )
                }

                {/* RTSP Source
                <ItemDivider title="RTSP Source" />
                <ItemText
                    title="IP Address"
                    { ...Storage.vbind(this, "settingsVideo", "cameraIp") }
                    icon={makeIcon(Icon, "access-point-network")}                                        
                    />
                <ItemText
                    title="Port"
                    { ...Storage.vbind(this, "settingsVideo", "cameraPort") }
                    icon={makeIcon(Icon, "folder-network")}                                        
                    />
                <ItemText
                    title="Account"
                    { ...Storage.vbind(this, "settingsVideo", "cameraAccount") }
                    icon={makeIcon(Icon, "account")}                                        
                    />
                <ItemText
                    title="Password"
                    { ...Storage.vbind(this, "settingsVideo", "cameraPassword") }
                    secureTextEntry={true}
                    icon={makeIcon(Icon, "onepassword")}                                        
                    />
                <ItemText last
                    title="URI"
                    { ...Storage.vbind(this, "settingsVideo", "cameraUri") }
                    icon={makeIcon(Icon, "comment-text-outline")}
                    /> */}

                {/* Display */}
                <ItemDivider title="Display" />
                <ItemSwitch
                    title={_("m_ShowStranger")}
                    { ...Storage.vbind(this, "settingsVideo", "showStranger") }
                    icon={makeIcon(Icon, "toggle-switch")}
                    />
                <ItemText last
                    title={_("m_MergeFaceDuration")}
                    { ...Storage.vbind(this, "settingsVideo", "mergeFaceDuration", /^[0-9]+$/) }
                    icon={makeIcon(Icon, "timer")}
                    />

                {/* Legends */}
                <ItemDivider title="Legends" />
                <ItemColor
                    title="VIP"
                    color="#FF8C00AA"
                    colorTitle="Orange"
                    icon={<Button style={{ backgroundColor: "#FF8C00AA" }}><Icon style={styles.listitem_icon} active name="human-male" /></Button>}
                    />
                <ItemColor
                    title="Blacklist"
                    color="#B22222AA"
                    colorTitle="Red"
                    icon={<Button style={{ backgroundColor: "#B22222AA" }}><Icon style={styles.listitem_icon} active name="human-male" /></Button>}
                    />
                <ItemColor
                    title="Registered (No Group)"
                    color="#939798DD"
                    colorTitle="Gray"
                    icon={<Button style={{ backgroundColor: "#939798DD" }}><Icon style={styles.listitem_icon} active name="human-male" /></Button>}
                    />
                <ItemColor
                    title="Visitor"
                    color="#2E8B57AA"
                    colorTitle="Green"
                    icon={<Button style={{ backgroundColor: "#2E8B57AA" }}><Icon style={styles.listitem_icon} active name="human-male" /></Button>}
                    />
                <ItemColor last
                    title="Stranger"
                    color="#1D2073AA"
                    colorTitle="Dark Blue"
                    icon={<Button style={{ backgroundColor: "#1D2073AA" }}><Icon style={styles.listitem_icon} active name="human-male" /></Button>}
                    />

            </View>
        );
    }
}  

const styles = EStyleSheet.create({
    listitem_icon: {
        color: "white",
        fontSize: "7 rem"
    },
    listitem_icon_channel: {
        fontSize: "5.5 rem"
    },
});
