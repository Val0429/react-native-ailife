import React, {Component} from 'react';
import {Dimensions} from 'react-native';
import { Container, Header, View, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Text, Icon, Item, Input, Label, Picker, CardItem, Card, Toast } from 'native-base';

import {
    EStyleSheet, Col, Row, Grid, Actions, rcImages, ConnectObservables, StorageInstance as Storage, lang, _ ,ReadedCount
} from './../../../../helpers/core-packages';

import { makeMainButton } from './../helpers/make-main-button';
import { HeaderContainer } from '../helpers/header-container';
import iStyle from '../../../resources/style/main-style.js'


interface Props {
    lang?: string;
    managerNotReadCount:number,
    mailNotReadCount:number,
    vistorNotReadCount:number,
    gasNotReadCount:number,
    returnNotReadCount :number
}

@ConnectObservables({
    lang: lang.getLangObservable(),
})
export class ResidentPage extends Component<Props> {
    render() {
        return (
            <HeaderContainer  title={_("w_Resident")} children={this.content()} />
        )
    }

    content() {
        return (
            <View style={iStyle.pageMargin}>
                <Item style={[iStyle.no_border ,iStyle.center , iStyle.full]}>
                    { makeMainButton(rcImages.money, _("r_manage"), () => Actions.push("manage"),this.props.managerNotReadCount ) }
                    { makeMainButton(rcImages.package, _("m_DepositItem"), () => Actions.push("package")) }
                </Item>
                <Item style={[iStyle.no_border ,iStyle.center , iStyle.full]}>
                    { makeMainButton(rcImages.email, _("w_Mail"), () => Actions.push("mail"),this.props.mailNotReadCount )}
                    { makeMainButton(rcImages.return, _("r_return"), () => Actions.push("returns") , this.props.returnNotReadCount) }
                </Item>
                <Item style={[iStyle.no_border ,iStyle.center , iStyle.full]}>
                    { makeMainButton(rcImages.vistor, _("r_vistor"), () => Actions.push("vistor"), this.props.vistorNotReadCount)}
                    { makeMainButton(rcImages.gas, _("r_gas"), () => Actions.push("gas") ,this.props.gasNotReadCount ) }
                </Item>       
            </View>            
        
        
        );
    }
}  

const styles = EStyleSheet.create({

    whitebtn:{
        width: Dimensions.get('window').height/5,
        margin:'13rem'
    }

});
  