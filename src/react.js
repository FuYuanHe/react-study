import { REACT_ELEMENT,REACT_FORWARD_REF,REACT_CONTEXT,REACT_PROVIDER,REACT_MEMO} from './content'
import { shallowEqual, wrapToVdom } from './utils';
import Component  from './component';
import {useState} from './react-dom'

// 创建虚拟dom的方法
function createElement(type,config,children){
    let ref,key;
    if(config){
        ref = config.ref
        key = config.key
        delete config.ref
        delete config.key
    }
    let props = {...config}  
    if(arguments.length >3){
        // 说明有多个children
        props.children = Array.prototype.slice.call(arguments,2).map(wrapToVdom)
    }else if(arguments.length === 3){
        props.children = wrapToVdom(children)
    }

    // 虚拟dom
    return {
        $$typeof:REACT_ELEMENT,
        type,
        ref,
        key,
        props
    }
}

// createRef方法
function createRef(){
    return{
        current:null
    }
}

// 接收ref的函数组件
function forwardRef(render){
    return{
        $$typeof:REACT_FORWARD_REF,
        render
    }
}

// context上下文
function createContext(){
    let context = {
        $$typeof:REACT_CONTEXT,
        _currentValue:undefined
    }
    context.Provider = {
        $$typeof:REACT_PROVIDER,
        _context:context
    }
    context.Consumer = {
        $$typeof:REACT_CONTEXT,
        _context:context
    }
    return context
}
function cloneElement(oldElement,props,children){
    if(arguments.length >3){
        // 说明有多个children
        props.children = Array.prototype.slice.call(arguments,2).map(wrapToVdom)
    }else if(arguments.length === 3){
        props.children = wrapToVdom(children)
    }
    return {...oldElement,props}
}

// 函数组件的更新优化函数memo
function memo(type,compare=shallowEqual){
    return{
        $$typeof:REACT_MEMO,
        compare,
        type
    }

}

// PureComponent 类
class PureComponent extends Component{
    // 重写shouldComponentUpdate方法
    shouldComponentUpdate(nextProps,nextState){
        return !shallowEqual(this.props,nextProps) || !shallowEqual(this.state,nextState)
    }
}

const react = {
    createElement,
    cloneElement,
    createRef,
    createContext,
    forwardRef,
    memo,
    Component,
    PureComponent,
    // hooks
    useState,
}

export default react