/* @flow */
/**\vue-master\src\shared\util */
// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
/**这个文件定义了很多接口程序
 * 这里的程序大多使用了%checks用于将函数作为谓词函数即函数的主体是一个表达式，不支持局部变量的声明
 */

/**这个函数用于判断传入对象类型是否是未定义或者是null */
export function isUndef (v: any): boolean %checks 
{
  return v === undefined || v === null
}
/**判断传入的对象是否定义过 */
export function isDef (v: any): boolean %checks 
{
  return v !== undefined && v !== null
}
/**判断出入的对象的值是否为真 */
export function isTrue (v: any): boolean %checks 
{
  return v === true
}
/**判断传入对象的值是否为假 */
export function isFalse (v: any): boolean %checks 
{
  return v === false
}

/**检测传入对象的类型是否为字符串、数值或者是布尔型数据 */
export function isPrimitive (value: any): boolean %checks 
{
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  )
}

/**判断传入的数据的类型是否为对象型且不为null
 * mixed表示支持传入任何类型
 */
export function isObject (obj: mixed): boolean %checks 
{
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value e.g. [object Object]
 */
/**设置_toString为返回对象的字符串形式 */
const _toString = Object.prototype.toString

/**返回对象的类型 */
export function toRawType (value: any): string 
{
  return _toString.call(value).slice(8, -1)
}

/**判断传入的数据的类型是否是对象 */
export function isPlainObject (obj: any): boolean 
{
  return _toString.call(obj) === '[object Object]'
}
/**判断传入对象的类型是否是正则表达式 */
export function isRegExp (v: any): boolean 
{
  return _toString.call(v) === '[object RegExp]'
}

/**判断传入的数据是否是有效的数组索引值 */
export function isValidArrayIndex (val: any): boolean 
{
  const n = parseFloat(String(val))
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

/**将任意类型转换为字符串形式
 * 如果是null类型输出空字符串
 * 如果是对象类型转换为缩进为2个空格的字符串
 * 其他类型调用string类型输出其值
 */
export function toString (val: any): string 
{
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**将字符串转换为数字
 * 如果传入的字符串无法转换为数字返回此字符串，反之返回其数值
 */
export function toNumber (val: string): number | string {
  const n = parseFloat(val)
  return isNaN(n) ? val : n
}

/**将传入的字符串转换为判断对象中是否存在此属性 */
export function makeMap (
  str: string,
  expectsLowerCase?: boolean
): (key: string) => true | void 
{
  const map = Object.create(null)
  const list: Array<string> = str.split(',')
  for (let i = 0; i < list.length; i++) 
  {
    map[list[i]] = true
  }
  return expectsLowerCase
    ? val => map[val.toLowerCase()]
    : val => map[val]
}


export const isBuiltInTag = makeMap('slot,component', true)


export const isReservedAttribute = makeMap('key,ref,slot,slot-scope,is')

/**移除数组中指定位置的值 */
export function remove (arr: Array<any>, item: any): Array<any> | void 
{
  if (arr.length) 
  {
    const index = arr.indexOf(item)
    if (index > -1) 
    {
      return arr.splice(index, 1)
    }
  }
}

/**hasOwnProperty 对象原型链是否具有指定的函数 */
const hasOwnProperty = Object.prototype.hasOwnProperty
/**判断对象或者是数组是否具有指定的属性 */
export function hasOwn (obj: Object | Array<*>, key: string): boolean 
{
  return hasOwnProperty.call(obj, key)
}

/**使用闭包
 * 在cache对象中添加属性
 */
export function cached<F: Function> (fn: F): F 
{
  const cache = Object.create(null)
  return (function cachedFn (str: string) 
  {
    const hit = cache[str]
    return hit || (cache[str] = fn(str))
  }: any)
}


/**下面这部分用于设置对象对应属性的属性值
 * 将-后面的字符转换为大写即驼峰式
 */
const camelizeRE = /-(\w)/g;
export const camelize = cached((str: string): string => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : '')
})

/**这部分将传入的字符串 */
export const capitalize = cached((str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
})

/**将字符串中的单词除首字符后面的字符转换为小写形式 */
const hyphenateRE = /\B([A-Z])/g
export const hyphenate = cached((str: string): string => {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
})

/**bind函数的简单的实现版本，返回bind函数
 * 如果参数的个数大于1使用apply传入对象和参数数组
 * 如果参数的个数为1调用call传入对象和一个参数值
 * 如果参数的个数为0调用call传入对象
 */
export function bind (fn: Function, ctx: Object): Function {
  function boundFn (a) {
    const l: number = arguments.length
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }
  // record original fn length
  boundFn._length = fn.length
  return boundFn
}

/**将从数组转换为从start到末尾位置的数组 */
export function toArray (list: any, start?: number): Array<any> {
  start = start || 0
  let i = list.length - start
  const ret: Array<any> = new Array(i)
  while (i--) 
  {
    ret[i] = list[i + start]
  }
  return ret
}

/**
 * Mix properties into target object.
 */
export function extend (to: Object, _from: ?Object): Object {
  for (const key in _from) {
    to[key] = _from[key]
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
export function toObject (arr: Array<any>): Object {
  const res = {}
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i])
    }
  }
  return res
}

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
 * 
 */
export function noop (a?: any, b?: any, c?: any) {}

/**
 * Always return false.
 * 一直返回错误
 */
export const no = (a?: any, b?: any, c?: any) => false

/**
 * Return same value
 */
export const identity = (_: any) => _

/**
 * Generate a static keys string from compiler modules.
 */
export function genStaticKeys (modules: Array<ModuleOptions>): string 
{
  return modules.reduce((keys, m) => 
  {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
export function looseEqual (a: any, b: any): boolean 
{
  if (a === b) 
  {
    return true;
  }
  const isObjectA = isObject(a)
  const isObjectB = isObject(b)
  if (isObjectA && isObjectB) 
  {
    try {
      const isArrayA = Array.isArray(a)
      const isArrayB = Array.isArray(b)
      if (isArrayA && isArrayB) 
      {
        return a.length === b.length && a.every((e, i) => {
          return looseEqual(e, b[i])
        })
      } 
      else if (!isArrayA && !isArrayB) 
      {
        const keysA = Object.keys(a)
        const keysB = Object.keys(b)
        return keysA.length === keysB.length && keysA.every(key => {
          return looseEqual(a[key], b[key])
        })
      } 
      else 
      {
        /* istanbul ignore next */
        return false
      }
    } 
    catch (e) 
    {
      /* istanbul ignore next */
      return false
    }
  } 
  else if (!isObjectA && !isObjectB) 
  {
    return String(a) === String(b)
  } 
  else 
  {
    return false
  }
}

export function looseIndexOf (arr: Array<mixed>, val: mixed): number 
{
  for (let i = 0; i < arr.length; i++) 
  {
    if (looseEqual(arr[i], val)) 
    {
      return i;
    }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
export function once (fn: Function): Function 
{
  let called = false
  return function () 
  {
    if (!called) 
    {
      called = true
      fn.apply(this, arguments)
    }
  }
}
/**end \vue-master\src\shared\util */