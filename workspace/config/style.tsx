import React, {Component, ReactElement} from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Dimensions, PixelRatio } from 'react-native';
import { Button } from 'native-base';

EStyleSheet.build({
    $rem:Math.min(Dimensions.get('window').width,Dimensions.get('window').height) / 380 /PixelRatio.getFontScale(),
    // Dimensions.get('window').height / 380
    $bgColor: "rgb(241,243,241)",
    $mainYellow:"rgb(243,186,31)",
    $mainPurple:"rgb(248,54,232)",
    $mainRed:"rgb(205,54,69)",
    $mainGray:"rgb(182,182,182)",
    $lableColor:"rgb(111,111,114)",
    $titleTextColr:"rgb(92,91,92)"
});



export const defaultStyles = EStyleSheet.create({
    icon_button: {
        backgroundColor: "#193966",
    },
    icon_style: {
        color: "white",
        fontSize: 16
    }
});

export function makeIcon(IconClass, name: string) {
    return <Button style={defaultStyles.icon_button}><IconClass style={defaultStyles.icon_style} active name={name} /></Button>;
}
