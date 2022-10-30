import { REACT_TEXT } from "./content"
import { addEvent } from "./event";



function render(vdom,container){
    mount(vdom,container)
}

function mount(vdom,parentDom){
    // 返回真实dom
    let newDom = createDOM(vdom)
    // console.log('newdom',newDom);
    // 将真实dom插入容器
    parentDom.appendChild(newDom)
}

// 将虚拟dom变成真实dom
function createDOM(vdom){
    let {type,props} = vdom
    let dom
    if(type === REACT_TEXT){
        dom = document.createTextNode(props.content)
    }else if(typeof type === 'function'){
        if(type.isReactComponent){
          return mountClassComponent(vdom)  
        }
        return mountFunctionComponent(vdom)
    } else if(typeof type === 'string'){
        dom = document.createElement(type)
    }
    if(props){
        // 更新dom的属性
        updateProps(dom,{},props)
        let children = props.children
        // 如果children是一个react元素,也是一个虚拟dom
        if(typeof children === 'object' && children.type){
            // 直接把这个虚拟dom挂载在dom上
            mount(children,dom)
        }else if(Array.isArray(children)){
            reconcileChildren(children,dom)
        }
    }
    vdom.dom = dom
    return dom
}

// 挂载类组件
function mountClassComponent(vdom){
    // type是类组件
    let {type,props} = vdom
    let classInstance = new type(props)
    let renderVdom = classInstance.render()
    // 在第一次挂载类组件的时候，让类组件的实例上新增一个oldrenderVdom属性
    classInstance.oldRenderVdom = renderVdom
    return createDOM(renderVdom)

}
// 挂载函数组件
function mountFunctionComponent(vdom){
    let {type,props} = vdom // 结构
    let renderVdom =  type(props) // 执行type获取虚拟dom
    return createDOM(renderVdom) // 继续获取真实dom
}

// 处理子节点
function reconcileChildren(children,parentDom){
    children.forEach(child => mount(child,parentDom))
}
// 整理props 
function updateProps(dom,oldProps,newProps){
    for(let key in newProps){
        if(key === 'children'){
            // 此处不处理子节点
            continue
        }else if(key === 'style'){
            let styleObj = newProps[key]
            for(let attr in styleObj){
                dom.style[attr] = styleObj[attr]
            }
        }else if(key.startsWith('on')){
            // key.startWith('on) 也可以换成正则 /^on[A-Z].*/.test(key)
            // console.log('newProps',newProps);
            // 绑定事件，属性是以on开头的
            // dom[key.toLocaleLowerCase()] = newProps[key]
            // 使用添加事件的函数来处理更新事件
            debugger
            addEvent(dom,key.toLocaleLowerCase(),newProps[key])
        } else{
            dom[key] = newProps[key]
        }
    }
    for(let key in oldProps){
        if(!newProps.hasOwnProperty(key)){
            dom[key] = null
        }
    }
}

/***
 * parentDom:父容器
 * oldVdom:老的虚拟dom
 * newVdom:新的虚拟dom
 */
// 比较新旧虚拟dom进行更新
export function compareTwoVdom(parentDom,oldVdom,newVdom){
    // 使用createDom方法获取新的真实dom
    let newDom = createDOM(newVdom)
    // 父容器替换真实dom，暂时先不考虑domdiff
    parentDom.replaceChild(newDom,oldVdom.dom)
}

const ReactDOM = {
    render
}

export default ReactDOM