import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Redirect, Route, Switch,Link } from './react-router-dom'

import Home from './page/Home'
import User from './page/User'
import Main from './page/Main'

ReactDOM.render(
    <HashRouter>
        <div>
            <ul>
                <li><Link to='/'>首页</Link></li>
                <li><Link to='/user'>用户</Link></li>
                <li><Link to='/main'>主页</Link></li>
            </ul>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/user" component={User} />
                <Route path="/main" component={Main} />
                <Redirect to='/' />
            </Switch>
        </div>
    </HashRouter>, document.getElementById('root'))