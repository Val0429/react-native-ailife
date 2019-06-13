import React, {Component, ReactElement} from 'react';
import {Platform, View, Image, StatusBar, TouchableOpacity} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Item, Input, H1 } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Actions } from 'react-native-router-flux';
import { rcImages } from '../../../../../resources/images';
import { rcMovies } from '../../../../../resources/movies';
import Iconion from 'react-native-vector-icons/Ionicons';
import { Subscription } from 'rxjs';
import { sjUserDemographic, sjWorkflowFinished } from './../../../../../config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import frs, { RecognizedUser } from '../../../../../services/frs-service';

interface Props {
    user?: RecognizedUser
}

interface States {
    timeout: number;
}

const fakeImage = "https://media.glamour.com/photos/5978ff1b998c9d5afe0b6050/master/w_644,c_limit/dakota-johnson-beauty-lede.jpg";
export class WorkflowPage extends Component<Props, States> {
    constructor(props) {
        super(props);
        this.state = {
            timeout: 5
        }
    }

    private subscription: Subscription;
    private interval;
    componentDidMount() {
        this.subscription = sjUserDemographic.subscribe( (data) => {

        });

        this.interval = setInterval( () => {
            if (this.state.timeout === 0) {
                this.flowFinished();
                return;
            }
            this.setState({timeout: this.state.timeout-1});
        }, 1000);
    }
    componentWillUnmount() {
        this.subscription.unsubscribe();
        clearInterval(this.interval);
    }

    private flowFinished() {
        clearInterval(this.interval);
        Actions.pop();
        sjWorkflowFinished.next(true);
    }

    render() {
        return (
            <Container>
                <StatusBar hidden />
                <Content bounces={false} contentContainerStyle={{flex: 1}} style={[styles.content]}>
                    <Grid>
                        <Row size={1} style={styles.row_1}>
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
                                        <Button style={styles.item_button} primary onPress={() => Actions.replace('workflow1', {user: this.props.user})}>
                                            <Icon name='login' style={[styles.item_icon, {fontSize: 32, marginTop: 1}]} />
                                            <Text style={styles.item_input}>打卡</Text>
                                        </Button>
                                        <Button style={styles.item_button} warning onPress={() => this.flowFinished()}>
                                            <Icon name='cancel' style={[styles.item_icon, {fontSize: 32, marginTop: 1}]} />
                                            <Text style={styles.item_input}>取消</Text>
                                        </Button>
                                    </Row>
                                </Col>

                        </Row>
                        <Row size={1} style={styles.row_2}>
                            <Text style={styles.subtitle}>倒數 {this.state.timeout} 秒後跳離</Text>
                        </Row>
                    </Grid>

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
        marginLeft: "4 rem",
        fontSize: "8 rem"
    },
    item_button: {
        borderRadius: "2 rem",
        padding: "10 rem",
        margin: "5 rem",
        height: "18 rem",
    }

});
  