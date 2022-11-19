import React from "react";
import ReactDOM from "react-dom";
import {HashRouter,Route} from './react-router-dom'

import Home from './page/Home'
import User from './page/User'
import Main from './page/Main'

ReactDOM.render(
<HashRouter>
    <div>
            <Route path="/" exact component={Home} />
            <Route path="/user"  component={User} />
            <Route path="/main"  component={Main} />
    </div>
</HashRouter>,document.getElementById('root'))