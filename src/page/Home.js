import React, { Component } from 'react'

export default class Home extends Component {
  render() {
    return (
      <>
      <div>Home</div>    
      <button onClick={()=> this.props.history.push('/user')}>跳到user</button>  
      </>
    )
  }
}
