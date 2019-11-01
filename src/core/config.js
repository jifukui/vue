/* @flow */
/**\vue-master\src\core\config.js */
/**导入no,noop,indentity
 * no:无论传入什么参数总是返回否
 * noop:不做任何有效的处理
 * indentity:返回相同的参数
 */
import {
  no,
  noop,
  identity
} from 'shared/util'
/**导入生命周期的钩子函数 */
import { LIFECYCLE_HOOKS } from 'shared/constants'
/**
 * 配置信息
 */
export type Config = 
{
  // user
  optionMergeStrategies: { [key: string]: Function };/**自定义合并策略函数 */
  silent: boolean;  /**是否关闭所有日志和警告 */
  productionTip: boolean; /**设置为 false 以阻止 vue 在启动时生成生产提示 */
  performance: boolean;/**设置为 true 以在浏览器开发工具的性能/时间线面板中启用对组件初始化、编译、渲染和打补丁的性能追踪 */
  devtools: boolean;    /**是否启用代码检查 */
  errorHandler: ?(err: Error, vm: Component, info: string) => void;/**捕获错误 */
  warnHandler: ?(msg: string, vm: Component, trace: string) => void;/**警告处理函数 */
  ignoredElements: Array<string>;/**定义忽略DOM元素 */
  keyCodes: { [key: string]: number | Array<number> };/**给v-on定义键位别名 */

  // platform
  isReservedTag: (x?: string) => boolean;
  isReservedAttr: (x?: string) => boolean;
  parsePlatformTagName: (x: string) => string;
  isUnknownElement: (x?: string) => boolean;
  getTagNamespace: (x?: string) => string | void;
  mustUseProp: (tag: string, type: ?string, name: string) => boolean;

  // legacy
  _lifecycleHooks: Array<string>;
};
/**默认导出 */
export default ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: process.env.NODE_ENV !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: process.env.NODE_ENV !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
}: Config)
/**end \vue-master\src\core\config.js */