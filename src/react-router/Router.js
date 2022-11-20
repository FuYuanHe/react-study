import React from 'react'
import RouterContext from './RouterContext'

export default class Router extends React.Component {
    static computedRootMatch(pathname){
        return {path:'/',url:'/',params:{},isExact:pathname==='/'}
    }
    constructor(props) {
        super(props)
        console.log('props', props);
        this.state = {
            location: props.history.location
        }
        // 监听路径的变化会执行回调
        // console.log('props',props);
        this.unlisten = props.history.listen((location) => {
            // 这里需要区分hash和browser
            // console.log(window.location.hash);
            if (window.location.hash) {
                this.setState({ location })
            } else {
                this.setState({ location: location?.location })
            }
            // this.setState({location:location?.location})
            // this.setState({ location })
        })
    }
    // 组件卸载的时候
    componentWillUnmount() {
        this.unlisten()
    }
    render() {
        let value = {
            history: this.props.history,
            location: this.state.location,
            match:Router.computedRootMatch(this.state.location.pathname)
        }
        // console.log(value);
        return (
            <RouterContext.Provider value={value}>
                {this.props.children}
            </RouterContext.Provider>
        )
    }
}