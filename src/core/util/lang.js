/* @flow */
/**创建一个不允许改变的空的对象 */
export const emptyObject = Object.freeze({})

/**
 * Check if a string starts with $ or _
 * 判断字符串是否是以$字符或者是_字符开始
 */
export function isReserved (str: string): boolean 
{
  const c = (str + '').charCodeAt(0)
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 * 定义对象的属性
 */
export function def (obj: Object, key: string, val: any, enumerable?: boolean) 
{
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}

/**
 * Parse simple path.
 */
const bailRE = /[^\w.$]/
export function parsePath (path: string): any 
{
  if (bailRE.test(path)) 
  {
    return
  }
  const segments = path.split('.')
  return function (obj) 
  {
    for (let i = 0; i < segments.length; i++) 
    {
      if (!obj)
      {
        return
      }
      obj = obj[segments[i]]
    }
    return obj
  }
}
