/* @flow */
/**\vue-master\src\core\util\lan.js */
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
 * 值为传入的值，可写可枚举
 * obj:对象
 * key:属性
 * enumerable:可枚举属性
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
/**判断字符是否只有数组字母下划线 */
const bailRE = /[^\w.$]/;
export function parsePath (path: string): any 
{
  /**如果包含非法字符返回 */
  if (bailRE.test(path)) 
  {
    return
  }
  /**将字符串以点号分隔 */
  const segments = path.split('.');
  /**返回处理函数
   * 如果传入的对象为否直接退出
   * 反之返回重新定义的结构体
   */
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
/**end \vue-master\src\core\util\lang.js */