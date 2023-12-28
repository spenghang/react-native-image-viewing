/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ComponentType, useCallback, useRef, useEffect } from "react"
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
  VirtualizedList,
  ModalProps,
  Modal,
  Text,
} from "react-native"

import ImageItem from "./components/ImageItem/ImageItem"
import StatusBarManager from "./components/StatusBarManager"

import useAnimatedComponents from "./hooks/useAnimatedComponents"
import useImageIndexChange from "./hooks/useImageIndexChange"
import { ImageSource } from "./@types"
import { flexStyles } from '../../utils/style.util'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Props = {
  images: ImageSource[];
  keyExtractor?: (imageSrc: ImageSource, index: number) => string;
  imageIndex: number;
  visible: boolean;
  onRequestClose: () => void;
  onLongPress?: (image: ImageSource) => void;
  onImageIndexChange?: (imageIndex: number) => void;
  presentationStyle?: ModalProps["presentationStyle"];
  animationType?: ModalProps["animationType"];
  backgroundColor?: string;
  swipeToCloseEnabled?: boolean;
  doubleTapToZoomEnabled?: boolean;
  delayLongPress?: number;
  HeaderComponent?: ComponentType<{ imageIndex: number }>;
  FooterComponent?: ComponentType<{ imageIndex: number }>;
};

const DEFAULT_ANIMATION_TYPE = "fade"
const DEFAULT_BG_COLOR = "#000"
const DEFAULT_DELAY_LONG_PRESS = 800
const SCREEN = Dimensions.get("screen")
const WINDOW_WIDTH = SCREEN.width

function ImageViewing(props: Props) {
  let {
    images,
    keyExtractor,
    imageIndex,
    visible,
    onRequestClose,
    onLongPress = () => null,
    onImageIndexChange,
    animationType = DEFAULT_ANIMATION_TYPE,
    backgroundColor = DEFAULT_BG_COLOR,
    presentationStyle,
    swipeToCloseEnabled,
    doubleTapToZoomEnabled,
    delayLongPress = DEFAULT_DELAY_LONG_PRESS,
    HeaderComponent,
    FooterComponent,
  } = props

  const imageList = useRef<VirtualizedList<ImageSource>>(null)
  const [currentImageIndex, onScroll] = useImageIndexChange(imageIndex, SCREEN)
  const [headerTransform, footerTransform, toggleBarsVisible] = useAnimatedComponents()

  useEffect(() => {
    if (onImageIndexChange) {
      onImageIndexChange(currentImageIndex)
    }
  }, [currentImageIndex])

  const onZoom = useCallback((isScaled: boolean) => {
    // @ts-ignore
    imageList?.current?.setNativeProps({ scrollEnabled: !isScaled })
    toggleBarsVisible(!isScaled)
  }, [imageList])

  return (
      <Modal
          transparent={ presentationStyle === "overFullScreen" }
          statusBarTranslucent={ true }
          visible={ visible }
          presentationStyle={ presentationStyle }
          animationType={ animationType }
          onRequestClose={ onRequestClose }
          supportedOrientations={ ["portrait"] }
          hardwareAccelerated>
        <StatusBarManager/>

        <View style={ [styles.container, { backgroundColor }] }>

          <Animated.View style={ [styles.header, { transform: headerTransform }] }>
            { typeof HeaderComponent !== "undefined" ? (
                React.createElement(HeaderComponent, {
                  imageIndex: currentImageIndex,
                })
            ) : (
                <View style={ { ...flexStyles.flexCenter, height: 40, top: useSafeAreaInsets().top } }>
                  <Text style={ {
                    color: '#fff',
                    fontSize: 16,
                  } }>{ currentImageIndex + 1 } / { images.length }</Text>
                </View>
            ) }
          </Animated.View>

          <VirtualizedList
              ref={ imageList }
              data={ images }
              horizontal
              pagingEnabled
              windowSize={ 2 }
              initialNumToRender={ 1 }
              maxToRenderPerBatch={ 1 }
              showsHorizontalScrollIndicator={ false }
              showsVerticalScrollIndicator={ false }
              initialScrollIndex={ imageIndex }
              getItem={ (_: any, index: number) => images[index] }
              getItemCount={ () => images.length }
              getItemLayout={ (_: any, index: number) => ({
                length: WINDOW_WIDTH,
                offset: WINDOW_WIDTH * index,
                index,
              }) }
              //@ts-ignore
              renderItem={ ({ item: imageSrc }) => (
                  <ImageItem
                      onZoom={ onZoom }
                      imageSrc={ imageSrc }
                      onRequestClose={ onRequestClose }
                      onLongPress={ onLongPress }
                      delayLongPress={ delayLongPress }
                      swipeToCloseEnabled={ swipeToCloseEnabled }
                      doubleTapToZoomEnabled={ doubleTapToZoomEnabled }
                  />
              ) }
              onMomentumScrollEnd={ onScroll }
              //@ts-ignore
              keyExtractor={ (imageSrc, index) =>
                  keyExtractor ? keyExtractor(imageSrc, index)
                      : typeof imageSrc === "number"
                          ? `${ imageSrc }`
                          : imageSrc.uri
              }/>
          { typeof FooterComponent !== "undefined" && (
              <Animated.View style={ [styles.footer, { transform: footerTransform }] }>
                { React.createElement(FooterComponent, {
                  imageIndex: currentImageIndex,
                }) }
              </Animated.View>
          ) }
        </View>
      </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    position: "absolute",
    width: "100%",
    zIndex: 1,
    top: 0,
  },
  footer: {
    position: "absolute",
    width: "100%",
    zIndex: 1,
    bottom: 0,
  },
})

const EnhancedImageViewing = (props: Props) => (
    <ImageViewing key={ props.imageIndex } { ...props } />
)

export default EnhancedImageViewing
