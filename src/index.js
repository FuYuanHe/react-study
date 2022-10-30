import React from './react'
import ReactDOM from './react-dom';


// const element = React.createElement('h1',{
//     className:'title',
//     style:{
//         color:'red'
//     }
// },'Hello world!',React.createElement('span',{},'我的react源码学习'))

// console.log(element);

function FunCom(props){
    return <div className='title' style={{color:'#bfa'}}>Hello{props.name}</div>
}

class ClassComponent extends React.Component{
    render(){
        return <div className='title' style={{color:'#bfa'}}>Hello{this.props.name}</div>
    }
}

class Counter extends React.Component{
    constructor(props){
        super(props)
        this.state = {number:0}
    }
    handleAdd = () => {
        debugger
        this.setState({number:this.state.number+1})
        console.log(this.state.number);
        this.setState({number:this.state.number+1})
        console.log(this.state.number);
        setTimeout(()=>{
            this.setState({number:this.state.number+1})
            console.log(this.state.number);
            this.setState({number:this.state.number+1})
            console.log(this.state.number);
        },0)

    }
    render(){
        return <div>
            <p>{this.state.number}</p>
            <button onClick={this.handleAdd}>修改</button>
        </div>
    }
}

let element = <FunCom name="afu"/>

let element2 = <Counter/>

// 函数式组件，就是一个普通函数，返回一个组件
// 接收一个props作为参数，返回一个react元素 

// 将虚拟dom变成真实dom
ReactDOM.render(element2,document.getElementById('root'))