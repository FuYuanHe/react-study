import React, { Component } from 'react'
import RouterContext from './RouterContext'
import matchPath from './matchPath'

export default class Route extends Component {
    static contextType = RouterContext
    render() {
        const { history, location } = this.context
        const { path, component:RouteElement } = this.props
        // console.log('RouteElement',RouteElement);
        // console.log('path',path);
        // console.log('element',RouteElement);
        // console.log('loaction',this.context);
        // let match = location.pathname === path
        let match = matchPath(location.pathname,this.props)
        const routeProps = { history, location }
        let newElement = null
        if (match) {
            routeProps.match = match
            newElement = <RouteElement {...routeProps}/>
        }
        return newElement
    }
}
