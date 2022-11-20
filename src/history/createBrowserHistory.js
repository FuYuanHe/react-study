function createBrowserHistory(){
    let globalHistory = window.history
    let state
    let listeners = []
    // action 有三个常量PUSH POP REPLACE
    function push(pathname,nextState){
        const action = 'PUSH'
        if(typeof pathname === 'object'){
            state = pathname.state
            pathname = pathname.pathname
        }else{
            state = nextState
        }
        // 调用原生的pushState方法进行跳转，并更新history中的location属性
        globalHistory.pushState(state,null,pathname)
        let location = {pathname,state}
        notify({action,location})
    }
    function notify(newState){
        Object.assign(history,newState)
        // history.location = location
        // location.action = action
        listeners.forEach(listener => {
            listener(history.location)
        })
    }
    // 调用listen方法会传递一个监听过来，返回一个函数，执行这个函数会返回不包含这个监听的监听数组
    function listen(listener){
        listeners.push(listener)
        // 返回一个销毁函数，也就是取消监听
        return ()=> listeners = listeners.filter(l=>l !== listener)
    }
    // 监听方法，如果只是单纯的跳转，页面并不会刷新
    window.addEventListener('popstate',()=>{
        let {location:{pathname,state}} = window
        let location = {pathname,state}
        notify({action:'POP',location})
    })

    // go方法
    function go(n){
        //调用原生的go方法
        globalHistory.go(n)
    }
    function goBack(){
        // 向后跳一步
        globalHistory.go(1)
    }
    function goForward(){
        // 向前跳一步
        globalHistory.go(-1)
    }

    const history ={
        action:'POP',
        push,
        listen,
        go,
        goBack,
        goForward,
        location:{pathname:window.location.pathname,state:window.location.state}
    }
    return history
}

export default createBrowserHistory