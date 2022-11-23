import React from 'react'
import RouterContext from './RouterContext'
import Lifecyle from './Lifecyle'

export default function Redirect(props) {
  return (
    <RouterContext.Consumer>
        {
            (value) => {
                console.log('value',value);
                console.log('props',props);
                return (
                    <Lifecyle onMount={()=> value.history.push(props.to)} />
                )
            }
        }
    </RouterContext.Consumer>
  )
}
