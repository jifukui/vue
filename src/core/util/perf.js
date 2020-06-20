/** 这个应该主要是调试性能使用的吧 */
import { inBrowser } from './env'

export let mark
export let measure
/** 根据开发模式进行处理 */
/** 对于设置的开发环境不是生产环境的处理 */
if (process.env.NODE_ENV !== 'production') {
  /** 设置perf的值为window的performance */
  const perf = inBrowser && window.performance;
  // 如果这些条件都成立的处理
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = tag => perf.mark(tag)
    measure = (name, startTag, endTag) => {
      perf.measure(name, startTag, endTag)
      perf.clearMarks(startTag)
      perf.clearMarks(endTag)
      perf.clearMeasures(name)
    }
  }
}
/** end vue-master\src\core\util\env.js主要是判断寄主环境 */
