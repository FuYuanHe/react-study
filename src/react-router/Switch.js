import React, { Component } from 'react'
import matchPath from './matchPath'
import RouterContext from './RouterContext'

export default class Switch extends Component {
    static contextType = RouterContext
    render() {
        const {location} = this.context
        let element,match
        React.Children.forEach(this.props.children,(route)=>{
            if(!match && React.isValidElement(route)){
                element = route
                match = matchPath(location.pathname,route.props)
            } 
        })
        return match ? React.cloneElement(element,{computedMatch:match}) :null
    }
}
