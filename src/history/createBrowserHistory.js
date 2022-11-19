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
    }
    function listen(listeners){

    }

    const history ={
        action:'POP',
        push,
        listen,
        location:{pathname:window.location.pathname,state:window.location.state}
    }
    return history
}

export default createBrowserHistory