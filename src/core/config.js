/* @flow */
/** \vue-master\src\core\config.js */
/** 导入no,noop,indentity
 * no:无论传入什么参数总是返回否
 * noop:不做任何有效的处理
 * indentity:返回相同的参数
 */
import {
  no,
  noop,
  identity
} from 'shared/util'
/** 导入生命周期的钩子函数 */
import { LIFECYCLE_HOOKS } from 'shared/constants'
/**
 * 配置信息
 */
export type Config = {
  // 合并策略
  optionMergeStrategies: { [key: string]: Function };
  // 是否关闭所有日志和警告
  silent: boolean ;
  // 设置为 false 以阻止 vue 在启动时生成生产提示
  productionTip: boolean;
  // 设置为 true 以在浏览器开发工具的性能/时间线面板中启用对组件初始化、编译、渲染和打补丁的性能追踪
  performance: boolean;
  // 是否启用代码检查
  devtools: boolean ;
  // 错误处理函数
  errorHandler: ?(err: Error, vm: Component, info: string) => void;
  // 警告处理函数
  warnHandler: ?(msg: string, vm: Component, trace: string) => void;
  // 被忽略的元素
  ignoredElements: Array<string>;
  // 自定义键码名
  keyCodes: { [key: string]: number | Array<number> };

  // 是否是预留标签
  isReservedTag: (x?: string) => boolean;
  // 是否是预留属性
  isReservedAttr: (x?: string) => boolean;
  // 分析平台的标签名
  parsePlatformTagName: (x: string) => string;
  // 是未知的元素
  isUnknownElement: (x?: string) => boolean;
  // 获取标签的名称空间
  getTagNamespace: (x?: string) => string | void;
  // 必须使用Prop属性
  mustUseProp: (tag: string, type: ?string, name: string) => boolean;

  // 生命周期钩子
  _lifecycleHooks: Array<string>;
};
/** 默认导出 */
export default ({
  // 合并策略
  optionMergeStrategies: Object.create(null),
  // 是否抑制警告
  silent: false,

  // 是否在发布模式下的根节点对于警告进行提示
  productionTip: process.env.NODE_ENV !== 'production',

  // 是否使能开发者工具
  devtools: process.env.NODE_ENV !== 'production',

  // 是否记录性能
  performance: false,

  // 是否有错误处理函数对错误进行监听
  errorHandler: null,

  // 是否有错误处理函数对警告进行监听
  warnHandler: null,

  // 忽略某些自定义元素
  ignoredElements: [],

  // 用户使用的键值的名称
  keyCodes: Object.create(null),

  // 检测是否是预留的组件，如果是预留的标签使其不能作为组件
  isReservedTag: no,

  // 检测属性是不是预留的属性如果是预留的组件使其不能作为组件的prop属性
  isReservedAttr: no,

  // 检测标签是否是未知的元素
  isUnknownElement: no,

  // 获取元素的名称空间
  getTagNamespace: noop,

  // 解析特殊平台的真实的标签名称
  parsePlatformTagName: identity,

  // 检测属性是否被绑定到必须使用的属性
  mustUseProp: no,

  // 生命周期钩子函数
  _lifecycleHooks: LIFECYCLE_HOOKS
}: Config)
/** end \vue-master\src\core\config.js  */
