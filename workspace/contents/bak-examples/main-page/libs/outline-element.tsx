import React, {Component, ReactElement} from 'react';
import {Platform, View, Image} from 'react-native';


interface OProps {
    style?: any;
    width?: number;
    shadowRadius?: number;
}
export class OutlineElement extends Component<OProps> {
    render() {
        let element: ReactElement<any> = this.props.children as ReactElement<any>;
        let { style, width, shadowRadius } = this.props;
        
        shadowRadius = shadowRadius || 1;
        width = width || 1;

        const snapshot = 8;
        let elements = [];
        for (let i=0; i<snapshot; ++i) {
            let value = i/snapshot;
            let x = Math.sin(value * Math.PI * 2) * width;
            let y = -Math.cos(value * Math.PI * 2) * width;
            elements.push(
                React.cloneElement(element, { key: i, style: [element.props.style, { position: i==0?'relative':'absolute', textShadowOffset: {width: x, height: y}, textShadowRadius: shadowRadius }] })
            );
        }

        return (
            <View style={style}>
                { elements }
            </View>
        );
    }
}