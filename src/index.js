import React from './react'
import ReactDOM from './react-dom';


// const element = React.createElement('h1',{
//     className:'title',
//     style:{
//         color:'red'
//     }
// },'Hello world!',React.createElement('span',{},'我的react源码学习'))

// console.log(element);

// function FunCom(props){
//     return <div className='title' style={{color:'#bfa'}}>Hello{props.name}</div>
// }

// class ClassComponent extends React.Component{
//     render(){
//         return <div className='title' style={{color:'#bfa'}}>Hello{this.props.name}</div>
//     }
// }

// class Counter extends React.Component{
//     constructor(props){
//         super(props)
//         this.state = {number:0}
//     }
//     handleAdd = () => {
//         this.setState({number:this.state.number+1})
//         console.log(this.state.number);
//         this.setState({number:this.state.number+1})
//         console.log(this.state.number);
//         setTimeout(()=>{
//             this.setState({number:this.state.number+1})
//             console.log(this.state.number);
//             this.setState({number:this.state.number+1})
//             console.log(this.state.number);
//         },0)

//     }
//     render(){
//         return <div>
//             <p>{this.state.number}</p>
//             <button onClick={this.handleAdd}>修改</button>
//         </div>
//     }
// }

// class Counter extends React.Component{
//     constructor(props){
//         super(props)
//         this.a = React.createRef() 
//         this.b = React.createRef() 
//         this.result = React.createRef() 
//     }
//     handleAdd = () => {
//         let v1 = this.a.current.value
//         let v2 = this.b.current.value
//         console.log('v1',v1);
//         console.log('v2',v2);
//         this.result.current.value = Number(v1)+Number(v2)
//     }

//     render(){
//         return (
//             <div>
//                 <input ref={this.a}/>+
//                 <input ref={this.b}/>
//                 <button onClick={this.handleAdd}>=</button>
//                 <input ref={this.result}></input>
//             </div>
//         )
//     }
// }

// class TsetInput extends React.Component{
//     constructor(props){
//         super(props)
//         this.input = React.createRef()
//     }
//     getFocus = () => {
//         this.input.current.focus()
//     }
//     render(){
//         return <input ref={this.input}></input>
//     }
// }
// function TsetInput(props,ref){
//     return <input ref={ref}/>
// }
// const ForwardTestInput = React.forwardRef(TsetInput)
// class Counter extends React.Component{
//     constructor(props){
//         super(props)
//         this.input = React.createRef()
//     }
//     getFocus = () => {
//         this.input.current.focus()
//     }
//     render(){
//         return (
//             <div>
//                 <ForwardTestInput ref={this.input} />
//                 <button onClick={this.getFocus}>获取焦点</button>
//             </div>
//         )
//     }
// }

class Counter extends React.Component{
    constructor(props){
        super(props)
        this.state = {list:['A','B','C','D','E','F']}
    }
    handleClick = () => {
        this.setState({
            list:['A','C','E','B','G']
        })
    }
    render(){
        return(
            <div>
                <ul>
                    {
                        this.state.list.map(item => <li key={item}>{item}</li>)
                    }
                </ul>
                <button onClick={this.handleClick}>+</button>
            </div>
        )
    }
}

// let element = <FunCom name="afu"/>

let element2 = <Counter/>

// 函数式组件，就是一个普通函数，返回一个组件
// 接收一个props作为参数，返回一个react元素 

// 将虚拟dom变成真实dom
ReactDOM.render(element2,document.getElementById('root'))