import { useEffect } from "react"
import {
    StatusBar,
} from "react-native"

const StatusBarManager = () => {
    StatusBar.setBarStyle('light-content')

    useEffect(() => {
        return () => StatusBar.setBarStyle('dark-content')
    }, [])

    return null
}

export default StatusBarManager
