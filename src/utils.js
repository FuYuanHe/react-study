import { REACT_TEXT } from "./content"

// 用来映射虚拟dom的
export const wrapToVdom = (element) => {
    return typeof element === 'number' || typeof element === 'string' ? 
    {type:REACT_TEXT,props:{content:element}} :
    element
} 