
function createHashHistory(){
    let historyStack = []
    let current = -1
    let action = 'POP'
    let listeners = []
    let state
    
    function push(pathname,nextState){
        action = 'PUSH'
        if(typeof pathname === 'object'){
            state = pathname.state
            pathname = pathname.pathname
        }else{
            state = nextState
        }
        // 修改location的hash值
        window.location.hash = pathname
    }
    window.addEventListener('hashchange',hashChangeHandler)
    function hashChangeHandler(){
        let pathname = window.location.hash.slice(1)
        let location = {pathname,state}
        Object.assign(history,{action,location})
        if(action === 'PUSH'){
            historyStack[++current] = location
        }
        listeners.forEach(listener => listener(history.location))
    }
    function listen(listener){
        listeners.push(listener)
        return ()=> listeners = listeners.filter(l => l!==listener)
    }
    function go(n){
        action = 'POP'
        current += n
        let nextLocation = historyStack[current]
        state = nextLocation.state
        window.location.hash = nextLocation.pathname
    }
    function goBack(){
        go(-1)
    }
    function goFarword(){
        go(1)
    }
    let history = {
        action:'POP',
        push,
        listen,
        go,
        goBack,
        goFarword,
        location:{pathname:'/',state:undefined}
    }
    // 初次加载hash值可能为空
    if(window.location.hash){
        // 如果有值，直接入栈并调用
        action='PUSH'
        hashChangeHandler()
    }else{
        window.location.hash = '/'
    }
    return history
}
export default createHashHistory