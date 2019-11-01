/* @flow */

import { emptyNode } from 'core/vdom/patch'
import { resolveAsset, handleError } from 'core/util/index'
import { mergeVNodeHook } from 'core/vdom/helpers/index'
/**
 * 
 */
export default {
  create: updateDirectives,
  update: updateDirectives,
  /**
   * 销毁指令
   * @param {*} vnode 
   */
  destroy: function unbindDirectives (vnode: VNodeWithData) 
  {
    updateDirectives(vnode, emptyNode)
  }
}
/**
 * 更新指令
 * @param {*} oldVnode  
 * @param {*} vnode 
 */
function updateDirectives (oldVnode: VNodeWithData, vnode: VNodeWithData) 
{
  /**对于新的对象的指令或者老的对象的值了的值为真的处理 */
  if (oldVnode.data.directives || vnode.data.directives) 
  {
    _update(oldVnode, vnode)
  }
}
/**
 * 更新的处理
 * @param {*} oldVnode 老的节点
 * @param {*} vnode 新的节点
 */
function _update (oldVnode, vnode) 
{
  /**设置是否创建变量 */
  const isCreate = oldVnode === emptyNode
  /**设置是否销毁变量 */
  const isDestroy = vnode === emptyNode
  /**获取老的指令 */
  const oldDirs = normalizeDirectives(oldVnode.data.directives, oldVnode.context)
  /**获取新的指令 */
  const newDirs = normalizeDirectives(vnode.data.directives, vnode.context)
  /**指令添加队列 */
  const dirsWithInsert = []
  /**更新指令队列 */
  const dirsWithPostpatch = []

  let key, oldDir, dir
  /**遍历所有新指令中的属性
   * 
   */
  for (key in newDirs) 
  {
    oldDir = oldDirs[key]
    dir = newDirs[key]
    /**老指令不存在此指令的处理调用钩子函数进行绑定
     * 如果此已经被定义且被插入将其添加到指令插入队列中
    */
    if (!oldDir) 
    {
      // new directive, bind
      callHook(dir, 'bind', vnode, oldVnode)
      if (dir.def && dir.def.inserted) 
      {
        dirsWithInsert.push(dir)
      }
    } 
    /**对于新老指令中都存在此指令的处理
     * 调用更新钩子函数
     * 如果已经被定义且组件已经更新添加到更指令更新数组中
     */
    else 
    {
      // existing directive, update
      dir.oldValue = oldDir.value
      callHook(dir, 'update', vnode, oldVnode)
      if (dir.def && dir.def.componentUpdated) 
      {
        dirsWithPostpatch.push(dir)
      }
    }
  }
  /**对于有添加新的指令的处理
   * 设置插入函数
   * 根据是否是创建进行处
   * 如果是创建聚合节点的钩子函数
   * 反之调用插入函数进行插入
   */
  if (dirsWithInsert.length) 
  {
    const callInsert = () => 
    {
      for (let i = 0; i < dirsWithInsert.length; i++) 
      {
        callHook(dirsWithInsert[i], 'inserted', vnode, oldVnode)
      }
    }
    if (isCreate) 
    {
      mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', callInsert)
    } 
    else 
    {
      callInsert()
    }
  }
  /**如果有更新指令进行节点的钩子函数的聚合 */
  if (dirsWithPostpatch.length) 
  {
    mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'postpatch', () => 
    {
      for (let i = 0; i < dirsWithPostpatch.length; i++) 
      {
        callHook(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode)
      }
    })
  }
  /**如果不是创建指令的处理
   * 变量所有的老的指令的属性
   * 如果此属性不存在于新的指令中设置去绑定操作
   */
  if (!isCreate) 
  {
    for (key in oldDirs) 
    {
      if (!newDirs[key]) 
      {
        // no longer present, unbind
        callHook(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy)
      }
    }
  }
}

const emptyModifiers = Object.create(null)
/**
 * 指令的规则化处理
 * @param {*} dirs  指令数组
 * @param {*} vm  组件对象
 */
function normalizeDirectives (
  dirs: ?Array<VNodeDirective>,
  vm: Component
): { [key: string]: VNodeDirective } 
{
  /**创建空的资源对象 */
  const res = Object.create(null)
  /**如果指令数组的值为假的处理，返回空的资源对象 */
  if (!dirs) 
  {
    return res
  }
  let i, dir
  /**遍历指令数组中的内容
   * 如果其属性的modifiers的值为假设置其值为空的对象
   * 设置资源的对应资源名为对应属性的值
   * 设置指令数组的def的值为调用resolveAsset后的结果
   */
  for (i = 0; i < dirs.length; i++) 
  {
    dir = dirs[i]
    if (!dir.modifiers) 
    {
      dir.modifiers = emptyModifiers
    }
    res[getRawDirName(dir)] = dir
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true)
  }
  return res
}
/**
 * 获取原始的指令名称
 * @param {*} dir 
 */
function getRawDirName (dir: VNodeDirective): string 
{
  return dir.rawName || `${dir.name}.${Object.keys(dir.modifiers || {}).join('.')}`
}
/**
 * 调用钩子函数
 * @param {*} dir 指令
 * @param {*} hook 钩子
 * @param {*} vnode 新的节点
 * @param {*} oldVnode 老的节点
 * @param {*} isDestroy 是否销毁
 */
function callHook (dir, hook, vnode, oldVnode, isDestroy) 
{
  /**设置fn的值为指令的处理函数 */
  const fn = dir.def && dir.def[hook]
  if (fn) 
  {
    try 
    {
      /**调用指令处理函数 */
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy)
    } 
    catch (e) 
    {
      handleError(e, vnode.context, `directive ${dir.name} ${hook} hook`)
    }
  }
}
