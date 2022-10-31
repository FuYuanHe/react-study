import { REACT_ELEMENT,REACT_FORWARD_REF} from './content'
import { wrapToVdom } from './utils';
import Component  from './component';

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

const react = {
    createElement,
    createRef,
    forwardRef,
    Component
}

export default react