/* @flow */

import { namespaceMap } from 'web/util/index'
/**
 * 创建元素节点
 * @param {*} tagName 
 * @param {*} vnode 
 */
export function createElement (tagName: string, vnode: VNode): Element {
  const elm = document.createElement(tagName)
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple')
  }
  return elm
}
/**
 * 创建元素节点
 * @param {*} namespace 
 * @param {*} tagName 
 */
export function createElementNS (namespace: string, tagName: string): Element {
  return document.createElementNS(namespaceMap[namespace], tagName)
}
/**
 * 创建文本节点
 * @param {*} text 
 */
export function createTextNode (text: string): Text {
  return document.createTextNode(text)
}
/**
 * 创建
 * @param {*} text 
 */
export function createComment (text: string): Comment {
  return document.createComment(text)
}
/**
 * 元素节点前面插入节点
 * @param {*} parentNode 父元素节点
 * @param {*} newNode 新的元素节点
 * @param {*} referenceNode 引用的元素节点
 */
export function insertBefore (parentNode: Node, newNode: Node, referenceNode: Node) {
  parentNode.insertBefore(newNode, referenceNode)
}
/**
 * 删除元素节点的子节点
 * @param {*} node 元素节点
 * @param {*} child 子元素节点
 */
export function removeChild (node: Node, child: Node) {
  node.removeChild(child)
}
/**
 * 在元素节点后面添加子节点
 * @param {*} node 元素节点
 * @param {*} child 子元素节点
 */
export function appendChild (node: Node, child: Node) {
  node.appendChild(child)
}
/**
 * 获取此节点的父节点
 * @param {*} node 元素节点
 */
export function parentNode (node: Node): ?Node {
  return node.parentNode
}
/**
 * 
 * @param {*} node 
 */
export function nextSibling (node: Node): ?Node {
  return node.nextSibling
}
/**
 * 获取元素节点的标签名称
 * @param {*} node 节点
 */
export function tagName (node: Element): string {
  return node.tagName
}
/**
 * 设置文本内容
 * @param {*} node 元素节点
 * @param {*} text 内容字符串
 */
export function setTextContent (node: Node, text: string) {
  node.textContent = text
}
/**
 * 设置属性
 * @param {*} node 元素节点
 * @param {*} key 属性
 * @param {*} val 属性值
 */
export function setAttribute (node: Element, key: string, val: string) {
  node.setAttribute(key, val)
}
