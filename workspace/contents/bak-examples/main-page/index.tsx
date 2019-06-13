import React, {Component, ReactElement} from 'react';
import {Platform, View, Image, TouchableOpacity} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Item, Input, H1 } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Actions } from 'react-native-router-flux';
import { rcImages } from './../../resources/images';

import { VideoPage } from './libs/pages/video-page';
import { DigitalPage } from './libs/pages/digital-page';
import { AttendanceTakingPage } from './libs/pages/attendance-taking-page';
import { Video } from '../setup/libs/mode-selection/video';

import { StorageInstance as Storage, modesText, SettingsModes, Modes } from './../../config';

interface Props {

}

type States = SettingsModes;

export class MainPage extends Component<Props, States> {
    constructor(props) {
        super(props);
        this.state = {
            modes: Modes.Video
        };
    }

    private subject = Storage.getSubject("modes");
    private subscription;
    componentDidMount() {
        this.subscription = this.subject.subscribe( (value) => {
            this.setState({...value});
        });
    }
    componentWillUnmount() {
        this.subscription.unsubscribe();
    }

    render() {
        return (
            <Container>
                { this.state.modes === Modes.Video && <VideoPage /> }
                { this.state.modes === Modes.Digital && <DigitalPage /> }
                { this.state.modes === Modes.Attendance && <AttendanceTakingPage /> }
            </Container>
        );
    }
}  

const styles = EStyleSheet.create({

});
  