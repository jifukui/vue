/* @flow */

import {
  isPreTag,
  mustUseProp,
  isReservedTag,
  getTagNamespace
} from '../util/index'

import modules from './modules/index'
import directives from './directives/index'
import { genStaticKeys } from 'shared/util'
import { isUnaryTag, canBeLeftOpenTag } from './util'
/**
 * 定义基本的指令
 */
export const baseOptions: CompilerOptions = {
  expectHTML: true,   // 期待HTML属性值为真
  modules,            // 预转换节点函数
  directives,         //
  isPreTag,           //
  isUnaryTag,         //
  mustUseProp,        //
  canBeLeftOpenTag,   //
  isReservedTag,      // 是否是
  getTagNamespace,    //
  staticKeys: genStaticKeys(modules)  //
}
