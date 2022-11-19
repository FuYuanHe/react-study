import React from 'react'
import RouterContext from './RouterContext'

export default class Router extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            location:props.history.location
        }
        // 监听路径的变化会执行回调
        console.log('props',props);
        props.history.listen((location)=>{
            this.setState({location:location?.location})
        })
    }
    render(){
        let value = {
            history:this.props.history,
            location:this.state.location,
        }
        console.log(value);
        return(
            <RouterContext.Provider value={value}>
                {this.props.children}
            </RouterContext.Provider>
        )
    }
}