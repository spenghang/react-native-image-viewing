import { ImageSource } from './src/@types'
import { ModalProps, StatusBarStyle } from 'react-native'
import React, { ComponentType, Component } from 'react'

declare module 'react-native-image-viewing' {

    type Props = {
        images: ImageSource[];
        keyExtractor?: (imageSrc: ImageSource, index: number) => string;
        imageIndex: number;
        visible: boolean;
        onRequestClose: () => void;
        onLongPress?: (image: ImageSource) => void;
        longPressActionSheet?: React.ReactNode;
        onImageIndexChange?: (imageIndex: number) => void;
        presentationStyle?: ModalProps["presentationStyle"];
        animationType?: ModalProps["animationType"];
        backgroundColor?: string;
        swipeToCloseEnabled?: boolean;
        doubleTapToZoomEnabled?: boolean;
        delayLongPress?: number;
        HeaderComponent?: ComponentType<{ imageIndex: number }>;
        FooterComponent?: ComponentType<{ imageIndex: number }>;
        originalStatusBarStyle?: StatusBarStyle
    };

    export default class ImageViewing extends Component<Props, any> {

    }
}
