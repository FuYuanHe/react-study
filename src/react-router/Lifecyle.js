import React, { Component } from 'react'

export default class LIfecyle extends Component {
    componentDidMount(){
        debugger
        this.props.onMount && this.props.onMount(this)
    }
  render() {
    return null
  }
}
