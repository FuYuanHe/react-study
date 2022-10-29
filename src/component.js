import {compareTwoVdom} from './react-dom'


// 更新器的类
class Updater{
    constructor(classInstance){
        this.classInstance = classInstance // 实例
        this.pendingStates = [] // 缓存队列
    }
    addState(partialSatte){
        // 放入队列先缓存起来
        this.pendingStates.push(partialSatte)
        this.emitUpdate()
    }
    // 发射更新
    emitUpdate(){
        this.updateComponent()
    }
    // 更新组件
    updateComponent(){
        let {classInstance,pendingStates} = this
        if(pendingStates.length >0){
            // 如果等待更新的数组有内容，表示需要更新
            shouldUpdate(classInstance,this.getState())
        }
    }
    // 获取state的方法
    getState(){
        // 结构实例
        let {classInstance,pendingStates} = this
        // 拿到实例身上的初始state
        let {state} = classInstance
        pendingStates.forEach(nextState => {
            // nextState可能是一个函数
            if(typeof nextState === 'function'){
                nextState = nextState(state)
            }
            // 这里就是为啥多次setState相同的内容，只会执行一次的原因
            state = {...state,...nextState}
        })
        pendingStates.length = 0 // 清空等待更新的数组
        return state // 返回最后的state
    }
}

function shouldUpdate(classInstance,nextState){
    classInstance.state = nextState
    classInstance.forceUpdate()
}


// 类组件的类
class Component{
    static isReactComponent = true
    constructor(props){
        this.props = props
        // 初始化state对象
        this.state = {}
        // 获取更新器实例
        this.updater = new Updater(this)
    }
    // 唯一更新状态的方法
    setState(partialSatte){
        // 调用更新器实例的更新方法
        this.updater.addState(partialSatte)
    }
    forceUpdate(){
        let oldRenderVdom = this.oldRenderVdom // 拿到老的虚拟dom
        let oldDom = oldRenderVdom.dom  // 拿到老的真实dom
        let newRenderDom = this.render() // 获取新的虚拟dom
        compareTwoVdom(oldDom.parentNode,oldRenderVdom,newRenderDom)
        // 更新实例身上的虚拟dom属性
        this.oldRenderVdom = newRenderDom
    }
}


// 更新的原理：
/* 
初次挂载，在页面挂载好了dom
更新的时候使用新的状态，重新render生成新的虚拟dom，在产生新的真实dom
用新的真实dom替换掉原来的真实dom

*/

export default Component