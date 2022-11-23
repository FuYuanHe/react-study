
function createHashHistory(){
    let historyStack = [] // 历史栈
    let current = -1      // 当前栈顶指针
    let action = 'POP'
    let listeners = []
    let state
    function listen(listener){
        listeners.push(listener)
        return ()=> listeners = listeners.filter(l => l!==listener)
    }
    function hashChangeHandler(event){
        let pathname = window.location.hash.slice(1)
        let location = {pathname,state}
        Object.assign(history,{action,location})
        if(action === 'PUSH'){
            historyStack[++current] = location
        }
        listeners.forEach(listener => listener(history.location))
    }   
    window.addEventListener('hashchange',hashChangeHandler) 
    function go(n){
        action = 'POP'
        current += n
        console.log('historyStack',historyStack);
        let nextLocation = historyStack[current]
        state = nextLocation?.state
        window.location.hash = nextLocation?.pathname
    }
    function goBack(){
        go(-1)
    }
    function goFarword(){
        go(1)
    }          
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