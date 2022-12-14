import { REACT_TEXT, REACT_FORWARD_REF, MOVE, PLACEMENT, REACT_CONTEXT, REACT_PROVIDER, REACT_MEMO } from "./content"
import { addEvent } from "./event";


let hookStates = [] // 存放所有的useState状态
let hookIndex = 0 // 存放调用useState时的index
let scheduleUpdate //更新调度函数

function render(vdom, container) {
    mount(vdom, container)
    scheduleUpdate = () => {
        hookIndex = 0
        compareTwoVdom(container, vdom, vdom)
    }
}
// useState方法
export function useState(initialState) {
    hookStates[hookIndex] = hookStates[hookIndex] || initialState
    let currentIndex = hookIndex
    function setState(newState) {
        if (typeof newState === 'function') {
            newState = newState(hookStates[currentIndex])
        }
        hookStates[currentIndex] = newState
        scheduleUpdate()
    }
    return [hookStates[hookIndex++], setState]
}

// useEffect
export function useEffect(callback, deps) {
    let currentIndex = hookIndex
    if (hookStates[currentIndex]) {
        //第二次走更新的时候能取到值
        let [destory, lastDeps] = hookStates[currentIndex]
        // 如果依赖项中每一个都能在旧的依赖项中找到
        let everySame = deps && deps.every((item, index) => item === lastDeps[index])
        if (everySame) {
            // 如果依赖项一样，也就是依赖项没有发生改变，则不需要更新
            hookIndex++
        } else {
            // 如果依赖项有改变则触发更新
            destory && destory()
            setTimeout(() => {
                hookStates[currentIndex++] = [callback(), deps]
                hookIndex++
            })
        }

    } else {
        // 第一次取不到值，走初始加载方法，将值和依赖项加入hookState中，并最终返回
        setTimeout(() => {
            hookStates[currentIndex++] = [callback(), deps]
            hookIndex++
        })
    }
}
// useLayoutEffect 是微任务的，useEffect是宏任务
export function useLayoutEffect(callback,deps) {
    let currentIndex = hookIndex
    if (hookStates[currentIndex]) {
        //第二次走更新的时候能取到值
        let [destory, lastDeps] = hookStates[currentIndex]
        // 如果依赖项中每一个都能在旧的依赖项中找到
        let everySame = deps && deps.every((item, index) => item === lastDeps[index])
        if (everySame) {
            // 如果依赖项一样，也就是依赖项没有发生改变，则不需要更新
            hookIndex++
        } else {
            // 如果依赖项有改变则触发更新
            destory && destory()
            queueMicrotask(() => {
                hookStates[currentIndex++] = [callback(), deps]
                hookIndex++
            })
        }

    } else {
        // 第一次取不到值，走初始加载方法，将值和依赖项加入hookState中，并最终返回
        queueMicrotask(() => {
            hookStates[currentIndex++] = [callback(), deps]
            hookIndex++
        })
    }
}
// useReducer比useState要更先进
// useState = useReducer(null,initialState)
export function useReducer(reducer, initialState) {
    hookStates[hookIndex] = hookStates[hookIndex] || initialState
    let currentIndex = hookIndex
    function dispatch(action) {
        // 这里需要判断一下action的类型
        if (typeof action === 'function') {
            action = action(hookStates[currentIndex])
        }
        // debugger
        // reducer()需要使用currentIndex
        hookStates[currentIndex] = reducer ? reducer(hookStates[currentIndex], action) : action
        scheduleUpdate()
    }
    return [hookStates[hookIndex++], dispatch]
}

// useMemo方法：函数组件的更新优化
/**
 * 
 * @param {*} factory 一个函数，返回需要使用的值
 * @param {*} deps 依赖项数组
 */
export function useMemo(factory, deps) {
    if (hookStates[hookIndex]) {
        //第二次走更新的时候能取到值，无论是否取到值，索引都要++
        let [lastMemo, lastDeps] = hookStates[hookIndex]
        // 如果依赖项中每一个都能在旧的依赖项中找到
        let everySame = deps.every((item, index) => item === lastDeps[index])
        if (everySame) {
            // 如果依赖项一样，也就是依赖项没有发生改变，则不需要更新
            hookIndex++
            return lastMemo
        } else {
            // 如果依赖项有改变则触发更新
            let newMemo = factory()
            hookStates[hookIndex++] = [newMemo, deps]
            return newMemo
        }

    } else {
        // 第一次取不到值，走初始加载方法，将值和依赖项加入hookState中，并最终返回
        let newMemo = factory()
        hookStates[hookIndex++] = [newMemo, deps]
        return newMemo
    }
}
// 函数的更新优化useCallBack  无论是否取到值，索引都要++
export function useCallBack(callback, deps) {
    if (hookStates[hookIndex]) {
        //第二次走更新的时候能取到值
        let [callback, lastDeps] = hookStates[hookIndex]
        // 如果依赖项中每一个都能在旧的依赖项中找到
        let everySame = deps.every((item, index) => item === lastDeps[index])
        if (everySame) {
            // 如果依赖项一样，也就是依赖项没有发生改变，则不需要更新
            hookIndex++
            return callback
        } else {
            // 如果依赖项有改变则触发更新
            hookStates[hookIndex++] = [callback, deps]
            return callback
        }

    } else {
        // 第一次取不到值，走初始加载方法，将值和依赖项加入hookState中，并最终返回
        hookStates[hookIndex++] = [callback, deps]
        return callback
    }
}

// useContext
export function useContext(context) {
    return context._currentValue
}
export function useRef(){
    return {current:null}
}
export function useImperativeHandle(ref,factory){
    ref.current = factory()
}


function mount(vdom, parentDom) {
    // 返回真实dom
    let newDom = createDOM(vdom)
    // console.log('newdom',newDom);
    // console.log('newdom',newDom);
    // 将真实dom插入容器
    if (newDom) parentDom.appendChild(newDom)
    // 将组件挂载的钩子放在这里
    if (newDom && newDom.componentDidMount) {
        newDom.componentDidMount()
    }
}

// 将虚拟dom变成真实dom
function createDOM(vdom) {
    let { type, props, ref } = vdom
    let dom
    if (type && type.$$typeof === REACT_FORWARD_REF) {
        return mountForwardComponent(vdom)
    } else if (type.$$typeof === REACT_MEMO) {
        return mountMemoComponent(vdom)
    } else if (type.$$typeof === REACT_CONTEXT) {
        return mountContextComponent(vdom)
    } else if (type.$$typeof === REACT_PROVIDER) {
        return mountProviderComponent(vdom)
    } else if (type === REACT_TEXT) {
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
            // 增加一个属性index
            // 直接把这个虚拟dom挂载在dom上
            children.mountIndex = 0
            mount(children, dom)
        } else if (Array.isArray(children)) {
            reconcileChildren(children, dom)
        }
    }
    vdom.dom = dom // 给虚拟dom身上加个dom属性
    if (ref) {
        ref.current = dom
    }
    return dom
}

function mountMemoComponent(vdom) {
    let { type, props } = vdom
    let renderVdom = type.type(props)
    vdom.prevProps = props // 记录之前的props进行对比
    vdom.oldRenderVdom = renderVdom
    if (!renderVdom) return null
    return createDOM(renderVdom)
}

// 挂载provider
function mountProviderComponent(vdom) {
    const { type, props } = vdom
    let context = type._context
    context._currentValue = props.value
    let renderVdom = props.children
    vdom.oldRenderVdom = renderVdom
    if (!renderVdom) return null
    return createDOM(renderVdom)
}
// 挂载constumer
function mountContextComponent(vdom) {
    const { type, props } = vdom
    let context = type._context
    let renderVdom = props.children(context._currentValue)
    vdom.oldRenderVdom = renderVdom
    if (!renderVdom) return null
    return createDOM(renderVdom)
}

// 挂载类组件
function mountClassComponent(vdom) {
    // type是类组件
    let { type, props, ref } = vdom
    let classInstance = new type(props)
    // 如果类组件上有contextType属性,给实例身上加个context属性，然后附上值
    if (type.contextType) {
        classInstance.context = type.contextType._currentValue
    }
    if (ref) ref.current = classInstance
    if (classInstance.componentWillMount) {
        classInstance.componentWillMount()
    }
    // 在虚拟dom身上加个classInstance属性
    vdom.classInstance = classInstance
    let renderVdom = classInstance.render()
    // 在第一次挂载类组件的时候，让类组件的实例上新增一个oldrenderVdom属性
    vdom.oldRenderVdom = classInstance.oldRenderVdom = renderVdom
    if (!renderVdom) return null
    let dom = createDOM(renderVdom)
    if (classInstance.componentDidMount) {
        // 这里需要把this绑定给实例，否则会出错
        dom.componentDidMount = classInstance.componentDidMount.bind(classInstance)
    }
    return dom

}
// 挂载函数组件
function mountFunctionComponent(vdom) {
    // debugger
    let { type, props } = vdom // 结构
    let renderVdom = type(props) // 执行type获取虚拟dom
    vdom.oldRenderVdom = renderVdom
    if (!renderVdom) return null
    return createDOM(renderVdom) // 继续获取真实dom
}

function mountForwardComponent(vdom) {
    let { type: { render }, ref, props } = vdom
    let renderVdom = render(props, ref)
    if (!renderVdom) return null
    return createDOM(renderVdom)
}

// 处理子节点
function reconcileChildren(children, parentDom) {
    // 给节点增加一个属性index
    children.forEach((child, index) => {
        child.mountIndex = index
        mount(child, parentDom)
    })
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
            // 深度DOMdiff 复用当前节点
            updateElement(oldVdom, newVdom)
        }
    }
}

// 深度domdiff 方法
function updateElement(oldVdom, newVdom) {
    // 如果是文本节点
    if (oldVdom.type.$$typeof === REACT_MEMO) {
        updateMemoComponent(oldVdom, newVdom)
    } else if (oldVdom.type.$$typeof === REACT_CONTEXT) {
        updateContextComponent(oldVdom, newVdom)
    } else if (oldVdom.type.$$typeof === REACT_PROVIDER) {
        updateProviderComponent(oldVdom, newVdom)
    } else if (oldVdom.type === REACT_TEXT) {
        // 拿到老的真实dom，赋值给新的虚拟dom的dom属性，并将新的真实dom的值改为要修改的值
        let currentDom = newVdom.dom = findDom(oldVdom)
        currentDom.textContent = newVdom.props.content
    } else if (typeof oldVdom.type === 'string') {
        // 如果是字符串
        let currentDom = newVdom.dom = findDom(oldVdom)
        updateProps(currentDom, oldVdom.props, newVdom.props)
        updateChildren(currentDom, oldVdom.props.children, newVdom.props.children)
    } else if (typeof oldVdom.type === 'function') {
        // 如果是类组件或者函数组件
        if (oldVdom.type.isReactComponent) {
            newVdom.classInstance = oldVdom.classInstance
            updateClassComponent(oldVdom, newVdom)
        } else {
            updateFunctionComponent(oldVdom, newVdom)
        }
    }
}

// 更新reactmemo
function updateMemoComponent(oldVdom, newVdom) {
    let { type, prevProps } = oldVdom
    // 对比新旧虚拟dom的props属性，使用浅对比函数，shallowEqual
    if (!type.compare(prevProps, newVdom.props)) {
        // 新旧props不一样，走更新逻辑
        let oldDom = findDom(oldVdom)
        let parentDom = oldDom.parentNode
        let { type, props } = newVdom
        let renderVdom = type.type(props)
        compareTwoVdom(parentDom, oldVdom.oldRenderVdom, renderVdom)
        newVdom.oldRenderVdom = renderVdom
        newVdom.prevProps = props
    } else {
        // 不更新，直接使用之前的虚拟dom
        newVdom.prevProps = prevProps
        newVdom.oldRenderVdom = oldVdom.oldRenderVdom
    }

}

// 更新context
function updateContextComponent(oldVdom, newVdom) {
    let oldDom = findDom(oldVdom) // 老的真实dom
    let parentDom = oldDom.parentNode
    let { type, props } = newVdom
    let context = type._context
    let renderVdom = props.children(context._currentValue)
    compareTwoVdom(parentDom, oldVdom.oldRenderVdom, renderVdom)
    newVdom.oldRenderVdom = renderVdom
}

// 更新provider
function updateProviderComponent(oldVdom, newVdom) {
    let oldDom = findDom(oldVdom)
    let parentDom = oldDom.parentNode
    let { type, props } = newVdom
    let context = type._context
    context._currentValue = props.value
    let renderVdom = props.children
    compareTwoVdom(parentDom, oldVdom.oldRenderVdom, renderVdom)
    newVdom.oldRenderVdom = renderVdom
}

// 更新类组件
function updateClassComponent(oldVdom, newVdom) {
    let classInstance = newVdom.classInstance = oldVdom.classInstance
    if (classInstance.componentWillReceiveProps) {
        classInstance.componentWillReceiveProps(newVdom.props)
    }
    classInstance.updater.emitUpdate(newVdom.props)
}
// 更新函数组件
function updateFunctionComponent(oldVdom, newVdom) {
    let parentDom = findDom(oldVdom).parentNode
    let { type, props } = newVdom
    let newRenderVdom = type(props)
    // 这里需要先比较再赋值，不然会报错
    compareTwoVdom(parentDom, oldVdom.oldRenderVdom, newRenderVdom)
    newVdom.oldRenderVdom = newRenderVdom
}

// 完整的dom different对比方法
function updateChildren(parentDom, oldChildren, newChildren) {
    // debugger
    // 先判断这两是不是数组，不是数组就变成数组,还要过滤一下为空的元素
    oldChildren = (Array.isArray(oldChildren) ? oldChildren : [oldChildren]).filter(item => item)
    newChildren = (Array.isArray(newChildren) ? newChildren : [newChildren]).filter(item => item)
    // 旧的对比方式，全量更新
    // let maxLength = Math.max(oldChildren.length,newChildren.length)
    // for(let i = 0;i<maxLength;i++){
    //     let nextVdom = oldChildren.find((item,index)=> {index > i && item && findDom(item)})
    //     compareTwoVdom(currentDom,oldChildren[i],newChildren[i],nextVdom&&findDom(nextVdom))
    // }
    // 构建老的map
    let oldKeyMap = {}
    oldChildren.forEach((oldVChild, index) => {
        // key一般是唯一的，不然就是index
        let oldKey = oldVChild.key ? oldVChild.key : index
        // 把老的儿子数组中的数据映射到map上
        oldKeyMap[oldKey] = oldVChild
    })
    // 定义一个存放需要删除和移动位置的子元素的数组
    let patch = []
    // 定义最后一个不需要修改的元素的索引
    let lastPlactIndex = 0
    newChildren.forEach((newVChild, index) => {
        newVChild.mountIndex = index
        let newKey = newVChild.key ? newVChild.key : index
        // 拿新的key到旧的map中去找对应的值
        let oldVChild = oldKeyMap[newKey]
        // 如果真的取到这个节点，可以复用节点
        if (oldVChild) {
            // 先更新元素
            updateElement(oldVChild, newVChild)
            // 需要移动 ,可能这里的判断还有点迷糊
            if (oldVChild.mountIndex < lastPlactIndex) {
                patch.push({
                    type: MOVE,
                    oldVChild,
                    newVChild,
                    mountIndex: index
                })
            }
            // 删掉刚才记录的这个元素
            delete oldKeyMap[newKey]
            lastPlactIndex = Math.max(oldVChild.mountIndex, lastPlactIndex)
        } else {
            // 插入一个新的元素
            patch.push({
                type: PLACEMENT,
                newVChild,
                mountIndex: index
            })
        }
    })
    // 获取需要移动的元素
    let moveChildren = patch.filter(action => action.type === MOVE).map(action => action.oldVChild)
    // 删除oldKeyMap中的所有留存的元素，这些元素没有被复用
    Object.values(oldKeyMap).concat(moveChildren).forEach(oldVChild => {
        let currentDom = findDom(oldVChild)
        parentDom.removeChild(currentDom)
    })
    patch.forEach(action => {
        let { type, oldVChild, newVChild, mountIndex } = action
        let childNodes = parentDom.childNodes
        if (type === PLACEMENT) {
            let newDom = createDOM(newVChild)
            let childNode = childNodes[mountIndex]
            if (childNode) {
                parentDom.idsertBefore(newDom, childNode)
            } else {
                parentDom.appendChild(newDom)
            }
        } else if (type === MOVE) {
            // 复用节点
            let oldDom = findDom(oldVChild)
            let childNode = childNodes[mountIndex]
            if (childNode) {
                parentDom.insertBefore(oldDom, childNode)
            } else {
                parentDom.appendChild(oldDom)
            }
        }
    })
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
        currentDom.parentNode.removeChild(currentDom)
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
    render,
    createPortal: render
}

export default ReactDOM