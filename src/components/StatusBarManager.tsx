import React, { useEffect } from "react"
import {
    StatusBar, StatusBarStyle,
} from "react-native"

const StatusBarManager: React.FC<{
    originalStatusBarStyle?: StatusBarStyle
}> = (props) => {
    const {
        originalStatusBarStyle = 'dark-content',
    } = props
    
    StatusBar.setBarStyle('light-content')

    useEffect(() => {
        return () => StatusBar.setBarStyle(originalStatusBarStyle)
    }, [])

    return null
}

export default StatusBarManager
