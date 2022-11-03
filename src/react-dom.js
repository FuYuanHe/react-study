import { REACT_TEXT, REACT_FORWARD_REF } from "./content"
import { addEvent } from "./event";



function render(vdom, container) {
    mount(vdom, container)
}

function mount(vdom, parentDom) {
    // 返回真实dom
    let newDom = createDOM(vdom)
    // console.log('newdom',newDom);
    // 将真实dom插入容器
    parentDom.appendChild(newDom)
    // 将组件挂载的钩子放在这里
    if (newDom.componentDidMount) {
        newDom.componentDidMount()
    }
}

// 将虚拟dom变成真实dom
function createDOM(vdom) {
    let { type, props, ref } = vdom
    let dom
    if (type && type.$$typeof === REACT_FORWARD_REF) {
        return mountForwardComponent(vdom)
    }
    if (type === REACT_TEXT) {
        dom = document.createTextNode(props.content)
    } else if (typeof type === 'function') {
        if (type.isReactComponent) {
            return mountClassComponent(vdom)
        }
        return mountFunctionComponent(vdom)
    } else if (typeof type === 'string') {
        dom = document.createElement(type)
    }
    if (props) {
        // 更新dom的属性
        updateProps(dom, {}, props)
        let children = props.children
        // 如果children是一个react元素,也是一个虚拟dom
        if (typeof children === 'object' && children.type) {
            // 直接把这个虚拟dom挂载在dom上
            mount(children, dom)
        } else if (Array.isArray(children)) {
            reconcileChildren(children, dom)
        }
    }
    if (ref) {
        ref.current = dom
    }
    vdom.dom = dom
    return dom
}

// 挂载类组件
function mountClassComponent(vdom) {
    // type是类组件
    let { type, props, ref } = vdom
    let classInstance = new type(props)
    if (ref) ref.current = classInstance
    if (classInstance.componentWillMount) {
        classInstance.componentWillMount()
    }
    // 在虚拟dom身上加个classInstance属性
    vdom.classInstance = classInstance
    let renderVdom = classInstance.render()
    // 在第一次挂载类组件的时候，让类组件的实例上新增一个oldrenderVdom属性
    vdom.oldRenderVdom = classInstance.oldRenderVdom = renderVdom
    let dom = createDOM(renderVdom)
    if (classInstance.componentDidMount) {
        dom.componentDidMount = classInstance.componentDidMount
    }
    return dom

}
// 挂载函数组件
function mountFunctionComponent(vdom) {
    let { type, props } = vdom // 结构
    let renderVdom = type(props) // 执行type获取虚拟dom
    vdom.oldRenderVdom = renderVdom
    return createDOM(renderVdom) // 继续获取真实dom
}

function mountForwardComponent(vdom) {
    let { type: { render }, ref, props } = vdom
    let renderVdom = render(props, ref)
    return createDOM(renderVdom)
}

// 处理子节点
function reconcileChildren(children, parentDom) {
    children.forEach(child => mount(child, parentDom))
}
// 整理props 
function updateProps(dom, oldProps, newProps) {
    for (let key in newProps) {
        if (key === 'children') {
            // 此处不处理子节点
            continue
        } else if (key === 'style') {
            let styleObj = newProps[key]
            for (let attr in styleObj) {
                dom.style[attr] = styleObj[attr]
            }
        } else if (key.startsWith('on')) {
            // key.startWith('on) 也可以换成正则 /^on[A-Z].*/.test(key)
            // console.log('newProps',newProps);
            // 绑定事件，属性是以on开头的
            // dom[key.toLocaleLowerCase()] = newProps[key]
            // 使用添加事件的函数来处理更新事件
            addEvent(dom, key.toLocaleLowerCase(), newProps[key])
        } else {
            dom[key] = newProps[key]
        }
    }
    for (let key in oldProps) {
        if (!newProps.hasOwnProperty(key)) {
            dom[key] = null
        }
    }
}

/***
 * parentDom:父容器
 * oldVdom:老的虚拟dom
 * newVdom:新的虚拟dom
 * nextDom:需要插到那个节点前面
 */
// 比较新旧虚拟dom进行更新,需要进行深度递归，尽可能复用老的dom
export function compareTwoVdom(parentDom, oldVdom, newVdom, nextDom) {
    // 使用createDom方法获取新的真实dom
    // let newDom = createDOM(newVdom)
    // let oldDom = findDom(oldVdom)
    // // 父容器替换真实dom，暂时先不考虑domdiff
    // parentDom.replaceChild(newDom,oldDom)
    // 如果老节点是null，新节点也是null
    if (!oldVdom && !newVdom) {
        return
        // 如果老的有新的没有，卸载老节点
    } else if (oldVdom && !newVdom) {
        unMountVdom(oldVdom)
        // 老的没有新的有
    } else if (!oldVdom && newVdom) {
        // 创建新的dom，插入到父元素
        mountNewVdom(parentDom, newVdom, nextDom)
        // 如果老的有新的也有
    } else {
        //需要判断类型，如果类型不一样，不复用，类型一样，继续判断
        if (oldVdom.type !== newVdom.type) {
            unMountVdom(oldVdom)
            mountNewVdom(parentDom, newVdom, nextDom)
        } else {
            // 深度DOMdiff
            updateElement(parentDom, oldVdom, newVdom, nextDom)
        }
    }
}

// 深度domdiff 方法
function updateElement(parentDom,oldVdom,newVdom,nextDom){
    
}

// 加载新节点
function mountNewVdom(parentDom, newVdom, nextDom) {
    // 创建新的dom，插入到父元素
    let newDom = createDOM(newVdom)
    // 如果传了旁边节点，就插入到旁边
    // 如果没传，就直接插入
    if (nextDom) {
        parentDom.insertBefore(newDom, nextDom)
    } else {
        parentDom.appendChild(newDom)
    }
    if (newDom.componentDidMount) {
        newDom.componentDidMount()
    }
}


// 卸载老节点
function unMountVdom(vdom) {
    let { type, props, ref, classInstance } = vdom
    let currentDom = findDom(vdom)

    if (classInstance && classInstance.componentWillUnmount()) {
        classInstance.componentWillUnmount()
    }
    // 如果加了ref
    if (ref) {
        ref.current = null
    }
    // 如果有子节点
    if (props.children) {
        let children = Array.isArray(props.children) ? props.children : [props.children]
        children.forEach(unMountVdom) // 让每个儿子都走卸载逻辑
    }
    // 卸载自己
    if (currentDom) {
        currentDom.parentNode.removeChild(createDOM)
    }
}

// 递归查找dom属性，因为组件嵌套，有可能无法一次拿到dom属性
export function findDom(vdom) {
    if (!vdom) return null
    // 如果有dom属性，就直接返回
    if (vdom.dom) {
        return vdom.dom
    } else {
        // 如果没有，
        return findDom(vdom.oldRenderVdom)
    }
}

const ReactDOM = {
    render
}

export default ReactDOM