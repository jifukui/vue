/* @flow */

import { isRegExp, remove } from 'shared/util'
import { getFirstComponentChild } from 'core/vdom/helpers/index'

type VNodeCache = { [key: string]: ?VNode };
/**获取组件的名称*/
function getComponentName (opts: ?VNodeComponentOptions): ?string 
{
  return opts && (opts.Ctor.options.name || opts.tag)
}
/**检测是否匹配 */
function matches (pattern: string | RegExp | Array<string>, name: string): boolean 
{
  if (Array.isArray(pattern)) 
  {
    return pattern.indexOf(name) > -1
  } 
  else if (typeof pattern === 'string') 
  {
    return pattern.split(',').indexOf(name) > -1
  } 
  else if (isRegExp(pattern)) 
  {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}
/**移除缓存中指定过滤的属性 */
function pruneCache (keepAliveInstance: any, filter: Function) 
{
  /**从保持活跃的实例中获取相关参数 */
  const { cache, keys, _vnode } = keepAliveInstance
  /**遍历cache遍历中的属性 */
  for (const key in cache) 
  {
    const cachedNode: ?VNode = cache[key]
    if (cachedNode) 
    {
      const name: ?string = getComponentName(cachedNode.componentOptions)
      if (name && !filter(name)) 
      {
        pruneCacheEntry(cache, key, keys, _vnode)
      }
    }
  }
}
/**删除指定为缓存属性
 * cache：缓存的虚拟节点
 * key:键
 * keys:
 * current:当前虚拟节点
 */
function pruneCacheEntry (
  cache: VNodeCache,
  key: string,
  keys: Array<string>,
  current?: VNode
) 
{
  /**获取传入的属性
   * 当此缓存存在且不等于当前的虚拟节点销毁此组件实例
   * 设置此缓存的值为空并在keys中移除此key
   */
  const cached = cache[key]
  if (cached && cached !== current) 
  {
    cached.componentInstance.$destroy()
  }
  cache[key] = null
  remove(keys, key)
}

const patternTypes: Array<Function> = [String, RegExp, Array]
/**导出默认 */
export default 
{
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created () 
  {
    this.cache = Object.create(null)
    this.keys = []
  },

  destroyed () 
  {
    for (const key in this.cache) 
    {
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },

  watch: 
  {
    include (val: string | RegExp | Array<string>) 
    {
      pruneCache(this, name => matches(val, name))
    },
    exclude (val: string | RegExp | Array<string>) 
    {
      pruneCache(this, name => !matches(val, name))
    }
  },

  render () 
  {
    const vnode: VNode = getFirstComponentChild(this.$slots.default)
    const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
    if (componentOptions) {
      // check pattern
      const name: ?string = getComponentName(componentOptions)
      if (name && (
        (this.include && !matches(this.include, name)) ||
        (this.exclude && matches(this.exclude, name))
      )) {
        return vnode
      }

      const { cache, keys } = this
      const key: ?string = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance
        // make current key freshest
        remove(keys, key)
        keys.push(key)
      } else {
        cache[key] = vnode
        keys.push(key)
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }

      vnode.data.keepAlive = true
    }
    return vnode
  }
}
