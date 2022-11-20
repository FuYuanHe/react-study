import React, { Component } from 'react'

export default class Main extends Component {
  render() {
    return (
      <>
      <div>Main</div>
      <button onClick={()=>this.props.history.goBack()}>点我跳转</button>      
      </>
    )
  }
}
