import React, { Component } from 'react'

export default class User extends Component {
  render() {
    return (
      <>
       <div>User</div>
       <button onClick={()=>this.props.history.goFarword()}>点我跳转</button>  
      </>
    )
  }
}

