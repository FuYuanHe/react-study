import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import RouterContext from './RouterContext'

export default class Route extends Component {
    static contextType = RouterContext
    render() {
        const { history, location } = this.context
        const { path, component:RouteElement } = this.props
        console.log('RouteElement',RouteElement);
        console.log('path',path);
        // console.log('element',RouteElement);
        console.log('loaction',location);
        let match = location.pathname === path
        const routeProps = { history, location }
        let newElement = null
        if (match) {
            newElement = <RouteElement {...routeProps}/>
        }
        return newElement
    }
}
