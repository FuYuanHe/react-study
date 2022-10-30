import { updateQueue } from "./component"

export function addEvent(dom, eventType, handler) {
    let store
    // 保证dom上有store属性
    if (dom.store) {
        store = dom.store
    } else {
        store = dom.store = {}
    }
    // 虽然没有给每个子dom绑定事件，但是事件处理函数还是保存在dom上的
    // 从react17开始，事件变成委托在根组件root上了额，不再是document了
    store[eventType] = handler
    if (!document[eventType]) {
        document[eventType] = dispatchEvent
    }
}

// 合成事件的统一代理处理函数
function dispatchEvent(event) {
    let { target, type } = event // 从event对象上解构dom和事件类型
    let eventType = `on${type}` // 把click拼成onclick
    // 创建合成事件
    let syntheticEvent = createSyntheticEvent(event)
    updateQueue.isBatchingUpdate = true  // 将批量更新设置为true

    // 处理事件冒泡
    while (target) {
        let { store } = target // target 就是那个dom
        let handler = store && store[eventType] // 根据函数名，从之前保存在store中的函数中取出函数
        handler && handler(syntheticEvent) // 执行这个函数，完成对应的事件
        if(syntheticEvent.isPropagationStopped){
            break
        }else{
        target = target.parentNode   // 向上冒泡给父节点            
        }
    }

    // let { store } = target // target 就是那个dom
    // let handler = store && store[eventType] // 根据函数名，从之前保存在store中的函数中取出函数
    // handler && handler(syntheticEvent) // 执行这个函数，完成对应的事件

    updateQueue.isBatchingUpdate = false
    updateQueue.batchUpdate() // 执行批量更新
}

// 创建合成事件的函数
function createSyntheticEvent(nativeEvent) {
    // 将原生事件的属性拷贝到合成事件上并添加一个原生事件的属性，指向原生事件自身
    let syntheticEvent = {}
    for (let key in nativeEvent) {
        syntheticEvent[key] = nativeEvent[key]
    }
    syntheticEvent.nativeEvent = nativeEvent
    syntheticEvent.preventDefault = preventDefault
    syntheticEvent.stopPropagation = stopPropagation
    syntheticEvent.isDefaultPrevented = false
    syntheticEvent.isPropagationStopped = false
    return syntheticEvent
}

// 阻止默认行为
function preventDefault(event) {
    if (!event) {
        window.event.returnValue = false
    }
    if (event.preventDefault) {
        event.preventDefault()
    }
    this.isDefaultPrevented = true
}
function stopPropagation(event){
    const evevt = this.nativeEvent
    if(event.stopPropagation){
        event.stopPropagation()
    }else{
        event.cancelBubble = true
    }
    this.isPropagationStopped = true
}

