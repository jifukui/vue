/* @flow */
/**引入vNode类 
 * 下面的语法是typesctipt语法中设置传入参数的类型有问号表示可以是未定义的类型使用|表示也支持这种类型
 * tag：标签
 * data：数据
 * children：子组件
 * text：文本内容
 * elm:节点元素
 * ns:
 * context：正文内容
 * key：
 * componentOptions：
 * componentInstance：
 * parent
 * raw：
 * isStatic：是否是静态
 * isRootInsert：是否在根中插入
 * isComment：是否是
 * isCloned:是否是克隆
 * isOnce：是否
 * asyncFactory：
 * asyncMeta：
 * isAsyncPlaceholder：
 * ssrContext：
 * functionalContext：
 * functionalOptions：
 * functionalScopeId：
*/
export default class VNode {
  /** 标签 */
  tag: string | void;
  /** 数据 */
  data: VNodeData | void;
  /** 子 */
  children: ?Array<VNode>;
  /** 文本 */
  text: string | void;
  /** 节点元素 */
  elm: Node | void;
  /** */
  ns: string | void;
  /** */
  context: Component | void; // rendered in this component's scope
  /** 键 */
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void; // component instance
  parent: VNode | void; // component placeholder node

  // strictly internal
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean; // empty comment placeholder?
  isCloned: boolean; // is a cloned node?
  isOnce: boolean; // is a v-once node?
  asyncFactory: Function | void; // async component factory function
  asyncMeta: Object | void;
  isAsyncPlaceholder: boolean;
  ssrContext: Object | void;
  functionalContext: Component | void; // real context vm for functional nodes
  functionalOptions: ?ComponentOptions; // for SSR caching
  functionalScopeId: ?string; // functioanl scope id support
/** 构造函数，下面的语法是typesctipt语法中设置传入参数的类型有问号表示可以是未定义的类型使用|表示也支持这种类型 */
  constructor (
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.ns = undefined
    this.context = context
    this.functionalContext = undefined
    this.functionalOptions = undefined
    this.functionalScopeId = undefined
    this.key = data && data.key
    this.componentOptions = componentOptions
    this.componentInstance = undefined
    this.parent = undefined
    this.raw = false
    this.isStatic = false
    this.isRootInsert = true
    this.isComment = false
    this.isCloned = false
    this.isOnce = false
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  get child (): Component | void {
    return this.componentInstance
  }
}
/** 创建一个空的虚拟节点
 * 使用构造函数创建一个虚拟节点
 * 设置节点的text属性为text值
 * 设置节点的isComment为真
 */
export const createEmptyVNode = (text: string = '') => {
  const node = new VNode()
  node.text = text
  node.isComment = true
  return node
}
/** 创建一个文本节点 */
export function createTextVNode (val: string | number) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
/** 节点复制，创建一个新的节点对象将传入节点的ns,istatic,key,iscomment的值进行复制设置iscloned的值设置为真
 * vnode:
 * deep:是否深度拷贝
 */
export function cloneVNode (vnode: VNode, deep?: boolean): VNode {
  const cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  )
  cloned.ns = vnode.ns
  cloned.isStatic = vnode.isStatic
  cloned.key = vnode.key
  cloned.isComment = vnode.isComment
  cloned.isCloned = true
  if (deep && vnode.children) {
    cloned.children = cloneVNodes(vnode.children)
  }
  return cloned
}
/** 将一个节点数组进行拷贝 */
export function cloneVNodes (vnodes: Array<VNode>, deep?: boolean): Array<VNode> {
  const len = vnodes.length
  const res = new Array(len)
  for (let i = 0; i < len; i++) {
    res[i] = cloneVNode(vnodes[i], deep)
  }
  return res
}
