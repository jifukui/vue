import model from './model'
import text from './text'
import html from './html'

export default {
  model,  // 对传入的抽象元素生成模型
  text,   // 在抽象节点中添加 textContent属性及其属性值
  html    // 在抽象节点中添加 innerHTML属性及其属性值
}
