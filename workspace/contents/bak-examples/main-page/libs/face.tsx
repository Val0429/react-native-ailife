import React, {Component, ReactElement} from 'react';
import {Platform, Image, StyleProp, ViewStyle} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { View, Container, Thumbnail, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Item, Input, H1 } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import frs, {RecognizedUser, UnRecognizedUser, UserType, Gender} from './../../../services/frs-service';

import { rcImages } from './../../../resources/images';

interface Props {
    user: RecognizedUser | UnRecognizedUser;
    style?: StyleProp<ViewStyle>;
}

export class Face extends Component<Props> {
    getFace() {
        return this.props.user.type === UserType.Recognized ? this.getRecognizedFace() : this.getUnRecognizedFace();
    }

    private getHourString(date: Date | number) {
        if (typeof date === 'number') date = new Date(date);
        return `${this.pad(date.getHours(), 2)}:${this.pad(date.getMinutes(), 2)}:${this.pad(date.getSeconds(), 2)}`;
    }
    private pad(n, width, z?) {
        z = z || '0';
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    getRecognizedFace() {
        let user = this.props.user as RecognizedUser;
        let datestring = this.getHourString(user.timestamp);
        let group = (user.groups || []).reduce( (final, group) => {
            if (final) return final;
            return group.name;
        }, undefined);

        let baseStyle = [styles.main];
        if (group) {
            if (group === 'VIP') baseStyle.push(styles.role_vip);
            else if (group === 'Blacklist') baseStyle.push(styles.role_blacklist);
            else if (group === 'Visitor') baseStyle.push(styles.role_visitor);
        }

        return (
            <View padder={true} style={[...baseStyle, this.props.style]}>
                <Row style={[styles.row_main]} size={3.2}>
                    <Image style={styles.row_image_1} resizeMode="contain" source={{ uri: frs.snapshotUrl(this.props.user.snapshot) }} />
                </Row>
                <Row style={[styles.row_main]} size={1}>
                    <Text style={[styles.row_text, styles.row_text_1_id]}>{user.person_info.employeeno}</Text>
                </Row>
                <Row style={[styles.row_main, styles.row_main_2]} size={0.8}>
                    <Text style={[styles.row_text, styles.row_text_2_title]} numberOfLines={1}>{user.person_info.fullname}</Text>
                </Row>
                <Row style={[styles.row_main, styles.row_main_3]} size={1}>
                    <Text style={styles.row_text}>{datestring}</Text>
                </Row>
            </View>
        );
    }
    getUnRecognizedFace() {
        let user = this.props.user as UnRecognizedUser;
        let datestring = this.getHourString(user.timestamp);

        let baseStyle = [styles.main, styles.role_stranger];
        
        return (
            <View padder={true} style={[...baseStyle, this.props.style]}>
                <Row style={[styles.row_main]} size={3.2}>
                    <Image style={styles.row_image_1} resizeMode="contain" source={{ uri: frs.snapshotUrl(this.props.user.snapshot) }} />
                </Row>
                <Row style={[styles.row_main]} size={1}>
                    <Text numberOfLines={1} style={[styles.row_text, styles.row_text_1_id]}>{`${Math.floor(user.highest_score.score*100)}% (${user.highest_score.fullname})`}</Text>
                </Row>
                <Row style={[styles.row_main, styles.row_main_2]} size={0.8}>
                    <Text style={[styles.row_text, styles.row_text_2_title]} numberOfLines={1}>No Match</Text>
                </Row>
                <Row style={[styles.row_main, styles.row_main_3]} size={1}>
                    <Text style={styles.row_text}>{datestring}</Text>
                </Row>
            </View>
        );
    }

    render() {
        return this.getFace();
    }
}  

const styles = EStyleSheet.create({
    main: {
        // width: "48 rem",
        // height: "62 rem",
        width: "41 rem",
        height: "53 rem",
        backgroundColor: '#939798DD',
        color: "white",
        borderRadius: 8
    },

    role_vip: {
        backgroundColor: '#FF8C00AA'
    },
    role_blacklist: {
        backgroundColor: '#B22222AA'
    },
    role_visitor: {
        backgroundColor: '#2E8B57AA'
    },
    role_stranger: {
        backgroundColor: '#1D2073AA'
    },

    row_main: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    row_main_2: {
        marginLeft: 6,
        marginRight: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE' 
    },
    row_main_3: {
        alignItems: 'flex-end'
    },

    row_image_1: {
        height:'100%', width: '85%', borderColor: '#DDDDDD', borderWidth: 1
    },

    row_text: {
        color: 'white',
        fontSize: '5.6 rem'
    },
    row_text_1_id: {
        fontSize: '6 rem',
        fontWeight: 'bold'
    },
    row_text_2_title: {
        fontSize: '6.2 rem'
    },

});

