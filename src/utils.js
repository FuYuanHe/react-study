import { REACT_TEXT } from "./content"

// 用来映射虚拟dom的
export const wrapToVdom = (element) => {
    return typeof element === 'number' || typeof element === 'string' ? 
    {type:REACT_TEXT,props:{content:element}} :
    element
}

// 浅比较函数
export const shallowEqual = (obj1,obj2) => {
    // 如果两个对象地址值一样
    if(obj1 === obj2){
        return true
    }
    // 如果有一方不是对象
    if(obj1 === null || typeof obj1 !== 'object' || obj2 === null || typeof obj2 !== 'object'){
        return false 
    }
    let keys1 = Reflect.ownKeys(obj1)
    let keys2 = Reflect.ownKeys(obj2)
    // 如果两个对象的属性不一样多
    if(keys1.length !== keys2.length){
        return false
    }
    // 遍历属性数组
    for (let key of keys1) {
        // 如果第二个对象没有这个属性或者属性值不一样，注意只比较第一层
        if(!obj2.hasOwnProperty(key) || obj1[key] !== obj2[key]){
            return false 
        }
    }
    return true

}