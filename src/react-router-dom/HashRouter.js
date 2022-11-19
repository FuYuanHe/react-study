import React,{Component} from 'react'
import {createHashHistory} from 'history'
import {Router} from '../react-router'

export default class HashRouter extends Component{
    history = createHashHistory()
    render(){
        console.log('hash',this.history);
        return (
            <Router history={this.history}>
                {this.props.children}
            </Router>
        )
    }
}