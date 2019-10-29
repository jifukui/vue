/* @flow */

import type Watcher from './watcher'
import config from '../config'
import { callHook, activateChildComponent } from '../instance/lifecycle'

import {
  warn,
  nextTick,
  devtools
} from '../util/index'

export const MAX_UPDATE_COUNT = 100
/**监听队列 */
const queue: Array<Watcher> = []
/**有效的孩子，组件数组 */
const activatedChildren: Array<Component> = []
/**has 监听器对象*/
let has: { [key: number]: ?true } = {}
let circular: { [key: number]: number } = {}
let waiting = false
let flushing = false
let index = 0

/**
 * Reset the scheduler's state.
 */
/**复位调度器的状态
 * 设置队列长度和有效的子的长度都为0
 * 对于环境不是生产环境的设置circular对象为空对象
 * 设置等待和刷新为否
 */
function resetSchedulerState () 
{
  index = queue.length = activatedChildren.length = 0
  has = {}
  if (process.env.NODE_ENV !== 'production') 
  {
    circular = {}
  }
  waiting = flushing = false
}

/**
 * Flush both queues and run the watchers.
 */
/**刷新任务队列
 * 
 */
function flushSchedulerQueue () 
{
  flushing = true
  let watcher, id

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  /**对队列进行排序 */
  queue.sort((a, b) => a.id - b.id)

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) 
  {
    watcher = queue[index]
    id = watcher.id
    has[id] = null
    watcher.run()
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== 'production' && has[id] != null) 
    {
      circular[id] = (circular[id] || 0) + 1
      if (circular[id] > MAX_UPDATE_COUNT) 
      {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? `in watcher with expression "${watcher.expression}"`
              : `in a component render function.`
          ),
          watcher.vm
        )
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  const activatedQueue = activatedChildren.slice()
  const updatedQueue = queue.slice()

  resetSchedulerState()

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue)
  callUpdatedHooks(updatedQueue)

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) 
  {
    devtools.emit('flush')
  }
}
/**调用更新钩子
 * 如果组件的监视器对象与监视器队列中的监视器相等且组件的挂载状态为挂载
 * 调用主键的更新钩子函数
 */
function callUpdatedHooks (queue) 
{
  let i = queue.length
  while (i--) 
  {
    const watcher = queue[i]
    const vm = watcher.vm
    if (vm._watcher === watcher && vm._isMounted) 
    {
      callHook(vm, 'updated')
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
/**有效状态的组件的队列
 * vm:
 * 设置组件的_inactive的值为假
 * 将当前的主键添加至有效的孩子队列中
 */
export function queueActivatedComponent (vm: Component) 
{
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false
  activatedChildren.push(vm)
}
/**设置监视器队列中所有的监视器的_iacctive的值为真，调用activateChildComponent函数 */
function callActivatedHooks (queue) 
{
  for (let i = 0; i < queue.length; i++) 
  {
    queue[i]._inactive = true
    activateChildComponent(queue[i], true /* true */)
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
/**监听队列
 * 获取监听器的id
 * 对于不存在此监听器的处理
 */
export function queueWatcher (watcher: Watcher) 
{
  const id = watcher.id
  /**对于监听器数组中此项参数值为null的处理
   * 设置此属性的值为真
   * 对于刷新为假的监听器队列中添加此监听器。
   * 对于刷新为真的处理，将监听对象添加到监听数组中
   * 对于waiting的值为假设置其值为真且下一个是个运行刷新调度队列
   */
  if (has[id] == null) 
  {
    has[id] = true
    if (!flushing) 
    {
      queue.push(watcher)
    } 
    else 
    {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) 
      {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    // queue the flush
    if (!waiting) 
    {
      waiting = true
      nextTick(flushSchedulerQueue)
    }
  }
}
