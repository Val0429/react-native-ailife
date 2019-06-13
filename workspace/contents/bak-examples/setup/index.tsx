import React, {Component, ReactElement} from 'react';
import {Platform, View, Image, TouchableOpacity} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Container, Header, Title, Content, ListItem, Switch, Footer, FooterTab, Button, Left, Right, Body, Text, Item, Input, H1 } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Actions } from 'react-native-router-flux';
import { rcImages } from './../../resources/images';
import { ModeSelection } from './libs/mode-selection';
import { ItemDivider, ItemNavigate } from './../../../core/components/form';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon3 from 'react-native-vector-icons/SimpleLineIcons';
import { StorageInstance as Storage, modesText, SettingsModes, makeIcon } from './../../config';
import { FRS } from './libs/frs';
import { DGS } from './libs/dgs';
import { Language } from './libs/language';
import { ConnectObservables } from './../../../helpers/storage/connect';
import lang, { _ } from './../../../core/lang';
let package = require('./../../../package.json');

interface Props {
    modes: SettingsModes;
    lang: string;
}

interface Selection {
    selection: "mode" | "frs" | "dgs" | "language";
}

type States = Selection;

@ConnectObservables({
    modes: Storage.getObservable("modes"),
    lang: lang.getLangObservable()
})
export class Setup extends Component<Props, States> {
    constructor(props) {
        super(props);
        this.state = {
            selection: "mode"
        };
    }

    render() {
        return (
            <Container>
                <Content style={styles.full_height} bounces={false}>
                    <Grid style={styles.full_height}>
                        <Col style={styles.col_left}>
                            <Header>
                                <Left>
                                    <Button transparent onPress={() => Actions.pop()}>
                                        <Icon2 style={styles.left_header_icon} name='ios-arrow-back' />
                                    </Button>
                                </Left>
                                <Body>
                                    <Title>{_("w_Settings")}</Title>
                                </Body>
                            </Header>

                            {/* Servers */}
                            <ItemDivider title={_("w_Server")} />
                            <ItemNavigate title="FRS" last onPress={() => this.setState({selection: "frs"}) }
                                icon={makeIcon(Icon, "face")}
                                />
                            {/* <ItemNavigate title="Demographic" last onPress={() => this.setState({selection: "dgs"}) }
                                icon={makeIcon(Icon, "face")}
                                /> */}
                            <ItemNavigate title={_("w_Language")} last onPress={() => this.setState({selection: "language"}) }
                                icon={makeIcon(Icon, "face")}
                                />

                            {/* ListItem - Modes */}
                            <ItemDivider title={_("w_General")} />
                            <ItemNavigate title={_("w_ModeSelection")} onPress={() => this.setState({selection: "mode"})}
                                value={_(`m_${modesText[this.props.modes.modes]}` as any)}
                                icon={makeIcon(Icon, "toggle-switch")}
                                />

                            {/* Others */}
                            <ItemDivider title={_("w_Others")} />
                            <ItemNavigate title={_("w_About")}
                                value={`v${package.version}`}
                                showArrow={false}
                                icon={makeIcon(Icon, "toggle-switch")}
                                />

                        </Col>

                        <Col size={1}>
                            { this.state.selection === "mode" && <ModeSelection style={styles.full_height} /> }
                            { this.state.selection === "frs" && <FRS style={styles.full_height} /> }
                            { this.state.selection === "dgs" && <DGS style={styles.full_height} /> }
                            { this.state.selection === "language" && <Language style={styles.full_height} /> }
                        </Col>
                    </Grid>
                </Content>
            </Container>
        );
    }
}  

const styles = EStyleSheet.create({
    content: {
        backgroundColor: "$bgColor"
    },

    full_height: {
        height: "100%-0",
    },

    col_left: {
        width: "130 rem",
        borderColor: "#888",
        borderRightWidth: 0.5
    },
    left_header_icon: {
        color: "white",
        fontSize: "10 rem"
    },
    left_listitem_icon: {
        color: "white",
        fontSize: "7 rem"
    },
    left_listitem_icon_light: {
        color: "#666",
        fontSize: "7 rem"
    },
    right_listitem_icon: {
        fontSize: "6 rem",
        marginLeft: "3 rem"
    }
});
  