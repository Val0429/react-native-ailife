import React, {Component, ReactElement} from 'react';
import {Platform, View, Image, StatusBar, TouchableOpacity, ScrollView} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Container, Header, Title, Content, List, ListItem, Footer, FooterTab, Button, Left, Right, Body, Text, Item, Input, H1 } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Actions } from 'react-native-router-flux';
import { rcImages } from '../../../../../resources/images';
import { rcMovies } from '../../../../../resources/movies';
import Iconion from 'react-native-vector-icons/Ionicons';
import { Subscription } from 'rxjs';
import { sjUserDemographic, sjWorkflowFinished } from './../../../../../config';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import frs, { RecognizedUser } from '../../../../../services/frs-service';

interface Props {
    user?: RecognizedUser
}

interface States {
    checked: Array<boolean>;
}

const fakeImage = "https://media.glamour.com/photos/5978ff1b998c9d5afe0b6050/master/w_644,c_limit/dakota-johnson-beauty-lede.jpg";
const flowOptions = [
    "廁所間衛生紙、擦手紙、洗手乳等檢查",
    "廁所間垃圾桶、便器、地板、洗手台等檢查",
    "吸煙區煙灰缸、垃圾桶、停車棚及花台檢查",
    "環保間垃圾清運",
    "飲水機及桶裝水檢查",
    "哺乳室冰箱、衛生紙、空調、垃圾桶檢查"
];
export class Workflow1Page extends Component<Props, States> {
    constructor(props) {
        super(props);
        this.state = {
            checked: new Array(flowOptions.length).fill(false)
        }
    }

    private isAllChecked() {
        return this.state.checked.reduce( (final, data) => {
            if (final === false) return final;
            if (data === false) return data;
            return data;
        }, true);
    }

    makeRows(title: string[]) {
        return title.map( (title, index) => this.makeRow(title, index) );
    }

    makeRow(title: string, index: number) {
        return (
            <ListItem key={index}>
                <Left><Text style={styles.subtitle}>{title}</Text></Left>

                <Right>
                    <Button style={styles.item_button_2} primary onPress={() => {
                        let checked = this.state.checked;
                        checked[index] = !checked[index];
                        this.setState({checked});
                    } }>
                        <Icon name='checkcircle' style={[styles.item_icon, {fontSize: 32, marginTop: 1}, this.state.checked[index] ? {color:'lightyellow'}: null ]} />
                        <Text style={styles.item_input}>確認</Text>
                    </Button>
                </Right>
                
                {/* <Right>
                    <Button style={styles.item_button_2} danger onPress={() => {} }>
                        <Icon name='exclamationcircle' style={[styles.item_icon, {fontSize: 32, marginTop: 1}]} />
                        <Text style={styles.item_input}>異常</Text>
                    </Button>
                </Right> */}

            </ListItem>
        );
    }

    private flowFinished() {
        Actions.pop();
        sjWorkflowFinished.next(true);
    }

    render() {
        return (
            <Container>
                <StatusBar hidden />
                <Content bounces={false} contentContainerStyle={{flex: 1}} style={[styles.content]}>
                    <Grid>
                        <Row size={1.5}>
                            <Col size={1} style={{flexDirection: 'row'}}>
                                <Image
                                    style={{width: 80, height: '100%', marginLeft: 10}}
                                    resizeMode='contain'
                                    source={{uri: this.props.user ? frs.snapshotUrl(this.props.user.snapshot) : fakeImage }} />
                                <Text style={[styles.subtitle, {marginLeft: 10}]}>{this.props.user ? this.props.user.person_info.fullname : "User"}</Text>
                            </Col>
                            <Col size={1} style={styles.row_1}>
                                <Text style={styles.title}>iSAP-11F</Text>
                            </Col>
                            <Col size={1}>
                            </Col>
                        </Row>

                        <Row size={8} style={{flexDirection: 'column'}}>

                        <ScrollView>
                            <List>
                                { this.makeRows(flowOptions) }
                            </List>
                        </ScrollView>

                        </Row>

                        <Row size={1.3} style={[styles.row_1]}>
                            <Button
                                onPress={() => this.flowFinished()}
                                primary={this.isAllChecked() ? true : false}
                                disabled={!this.isAllChecked() ? true : false}
                                style={styles.item_button}>
                                <Icon2 name='login' style={[styles.item_icon, {fontSize: 32, marginTop: 1}]} />
                                <Text style={styles.item_input}>打卡</Text>
                            </Button>
                            <Button style={styles.item_button} warning onPress={() => this.flowFinished()}>
                                <Icon2 name='cancel' style={[styles.item_icon, {fontSize: 32, marginTop: 1}]} />
                                <Text style={styles.item_input}>取消</Text>
                            </Button>
                        </Row>

                    </Grid>
                </Content>
            </Container>
        );
    }
}


{/* <Row size={1} style={styles.row_1}>
<Text style={styles.place}>iSAP-11F</Text>
</Row>
<Row size={3} style={styles.row_1}>

    <Col size={1} style={{alignItems: 'center'}}>
        <Image resizeMode='contain' style={styles.avatar} source={{
                uri: this.props.user ? frs.snapshotUrl(this.props.user.snapshot) : fakeImage
            }} />
        <Text style={styles.subtitle}>{ this.props.user ? this.props.user.person_info.fullname : "User" }</Text>
    </Col>
    <Col size={2}>
        <Row size={1} style={[styles.row_1]}>
            <Text style={styles.title}>開始進行清潔打卡流程</Text>
        </Row>
        <Row size={1} style={styles.row_1}>
            <Button style={styles.item_button} primary onPress={() => Actions.push('workflow-1', {user: this.props.user})}>
                <Icon name='login' style={[styles.item_icon, {fontSize: 32, marginTop: 1}]} />
                <Text style={styles.item_input}>打卡</Text>
            </Button>
            <Button style={styles.item_button} warning onPress={() => this.flowFinished()}>
                <Icon name='cancel' style={[styles.item_icon, {fontSize: 32, marginTop: 1}]} />
                <Text style={styles.item_input}>取消</Text>
            </Button>
        </Row>
    </Col>

</Row> */}

const styles = EStyleSheet.create({
    content: {
        backgroundColor: "$bgColor"
    },

    row_1: {
        alignItems: 'center',
        justifyContent: 'center'
    },

    row_2: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: "40 rem"
    },

    place: {
        alignSelf: 'center',
        color: "#9ACE32",
        fontSize: "24 rem"
    },

    title: {
        alignSelf: 'center',
        color: "white",
        fontSize: "18 rem"
    },

    subtitle: {
        alignSelf: 'center',
        color: "white",
        fontSize: "12 rem"
    },

    avatar: {
        width: '80%', height: '70%'
    },

    age: {
        position: "absolute",
        bottom: "25%",
        left: "8%",
        color: "#111133",
        fontSize: "32 rem"
    },

    incoming: {
        position: "absolute",
        bottom: "15%",
        left: "4%",
        color: "black",
        fontSize: "32 rem",
        fontWeight: "bold"
    },

    setup_icon_touchable: {
        position: "absolute",
        right: "5 rem",
        bottom: "8 rem"
    },
    setup_icon: {
        fontSize: "24 rem",
        color: "#AAAABB",
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
        fontSize: "8 rem"
    },
    item_button: {
        borderRadius: "2 rem",
        padding: "10 rem",
        margin: "5 rem",
        height: "18 rem",
    },

    check_icon: {
        fontSize: "14 rem"
    },

    item_button_2: {
        borderRadius: "2 rem",
        padding: "5 rem",
        height: "17 rem",
    },

});
  