
import {pathToRegexp} from 'path-to-regexp'
function compilePath(path,options){
    let keys = [] // 用来存储路径参数的数组
    let regexp = pathToRegexp(path,keys,options) // 根据字符串和规则返回正则表达式
    return { keys,regexp} // 返回参数数组和正则

}
function matchPath(pathname,options={}){
    let {path='/',exact=false,strict=false,sensitive=false} = options
    let {keys,regexp} = compilePath(path,{end:exact,strict,sensitive})
    const match = regexp.exec(pathname) // 根据正则校验路径是否匹配,exec会返回一个数组
    if(!match)return null
    const [url,...values] = match
    let isExact = pathname === url
    if(exact && !isExact) return null 
    return {
        path, // Route的路径
        url,  // Route路径转成的正则表达式匹配的路径部分
        isExact, // 是否是精确匹配
        params:keys.reduce((memo,key,index)=>{
            memo[key.name] = values[index]
            return memo
        },{})
    }
}

export default matchPath