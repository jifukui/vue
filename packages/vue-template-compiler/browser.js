(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.VueTemplateCompiler = {})));
}(this, (function (exports) { 'use strict';

var splitRE$1 = /\r?\n/g;
var emptyRE = /^\s*$/;
var needFixRE = /^(\r?\n)*[\t\s]/;

var deIndent = function deindent (str) {
  if (!needFixRE.test(str)) {
    return str
  }
  var lines = str.split(splitRE$1);
  var min = Infinity;
  var type, cur, c;
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (!emptyRE.test(line)) {
      if (!type) {
        c = line.charAt(0);
        if (c === ' ' || c === '\t') {
          type = c;
          cur = count(line, type);
          if (cur < min) {
            min = cur;
          }
        } else {
          return str
        }
      } else {
        cur = count(line, type);
        if (cur < min) {
          min = cur;
        }
      }
    }
  }
  return lines.map(function (line) {
    return line.slice(min)
  }).join('\n')
};

function count (line, type) {
  var i = 0;
  while (line.charAt(i) === type) {
    i++;
  }
  return i
}

/*  */
/** \vue-master\src\shared\util */
// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
/** 这个文件定义了很多接口程序
 * 这里的程序大多使用了%checks用于将函数作为谓词函数即函数的主体是一个表达式，不支持局部变量的声明
 */

/** 这个函数用于判断传入对象类型是否是未定义或者是null */

/** 判断传入的对象是否定义过 */

/** 判断出入的对象的值是否为真 */

/** 判断传入对象的值是否为假 */


/** 检测传入对象的类型是否为字符串、数值或者是布尔型数据 */


/** 判断传入的数据的类型是否为对象型且不为null
 * mixed表示支持传入任何类型
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value e.g. [object Object]
 */
/** 设置_toString为返回对象的字符串形式 */
var _toString = Object.prototype.toString;

/** 返回对象的类型 */
function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/** 判断传入的数据的类型是否是对象 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}
/** 判断传入对象的类型是否是正则表达式 */


/** 判断传入的数据是否是有效的数组索引值 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

/** 将任意类型转换为字符串形式
 * 如果是null类型输出空字符串
 * 如果是对象类型转换为缩进为2个空格的字符串
 * 其他类型调用string类型输出其值
 */


/** 将字符串转换为数字
 * 如果传入的字符串无法转换为数字返回此字符串，反之返回其数值
 */


/** 将传入的字符串转换为判断对象中是否存在此属性 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

var isBuiltInTag = makeMap('slot,component', true);

var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/** 移除数组中指定位置的值 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/** hasOwnProperty 对象原型链是否具有指定的函数 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
/** 判断对象或者是数组是否具有指定的属性 */
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/** 使用闭包
 * 在cache对象中添加属性
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**下面这部分用于设置对象对应属性的属性值
 * 将-后面的字符转换为大写即驼峰式
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * 将字符串的首字符大写
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * 将字符串中的单词除首字符后面的字符转换为小写形式
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * 绑定函数
 * @param {*} fn 
 * @param {*} ctx 
 */


/** 将从数组转换为从start到末尾位置的数组 */


/**
 * 扩展函数
 * 将form对象中的数据拷贝到to中，但是这种拷贝属于浅拷贝，并返回to
 * @param {*} to 目的
 * @param {*} _from 源
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * 将数组转换为对象
 * @param {*} arr
 */


/**
 * 定义空函数
 * @param {*} a 
 * @param {*} b 
 * @param {*} c 
 */
function noop (a, b, c) {}

/**
 * 定义函数只返回错
 * @param {*} a 
 * @param {*} b 
 * @param {*} c 
 */
var no = function (a, b, c) { return false; };

/**
 *
 * @param {*} _ 
 */
var identity = function (_) { return _; };

/**
 * Generate a static keys string from compiler modules.
 */
/**
 * 产生静态的
 * @param {*} modules 
 */
function genStaticKeys (modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}

/**
 * 判断两个参数是否相等
 * @param {*} a 参数1
 * @param {*} b 参数2
 */

/**
 * 判断数组中是否有值等于val
 * @param {*} arr 数组
 * @param {*} val 数值
 */


/**
 * 设置这个函数只执行一次
 * @param {*} fn 函数
 */

/** end \vue-master\src\shared\util*/

/*  */

var isUnaryTag = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr'
);

// Elements that you can, intentionally, leave open
// (and which close themselves)
var canBeLeftOpenTag = makeMap(
  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
);

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var isNonPhrasingTag = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track'
);

/**
 * Not type-checking this file because it's mostly vendor code.
 */

/*!
 * HTML Parser By John Resig (ejohn.org)
 * Modified by Juriy "kangax" Zaytsev
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 */

// Regular Expressions for parsing tags and attributes
/** 匹配属性[0]为整体匹配的值[1]为匹配到的属性[2]为等号[3]为属性的值 */
var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
// but for Vue templates we can enforce a simple charset
/** 匹配a-zA-Z_一个后面接0到多个 */
var ncname = '[a-zA-Z_][\\w\\-\\.]*';
/** 匹配 */
var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")";
var startTagOpen = new RegExp(("^<" + qnameCapture));
/** 匹配开始标签的结束标签 */
var startTagClose = /^\s*(\/?)>/;
var endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>"));
/** 匹配以<!doctype开始 +任意非>字符 并以>结束的字符 */
var doctype = /^<!DOCTYPE [^>]+>/i;
/** 匹配以<!--开始的字符串 */
var comment = /^<!--/;
/** 匹配以<![开始的字符 */
var conditionalComment = /^<!\[/;

var IS_REGEX_CAPTURING_BROKEN = false;
'x'.replace(/x(.)?/g, function (m, g) {
  IS_REGEX_CAPTURING_BROKEN = g === '';
});

/**
 * 定义原生的文本元素
 */
var isPlainTextElement = makeMap('script,style,textarea', true);
var reCache = {};
/** 解码的映射表 */
var decodingMap = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n'
};
/** 编码的属性 */
var encodedAttr = /&(?:lt|gt|quot|amp);/g;
/** 编码的属性 */
var encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10);/g;

// #5992
/** 忽略新行的标签正则表达式 */
var isIgnoreNewlineTag = makeMap('pre,textarea', true);
var shouldIgnoreFirstNewline = function (tag, html) { return tag && isIgnoreNewlineTag(tag) && html[0] === '\n'; };
/**
 * 解码属性
 * @param {*} value 
 * @param {*} shouldDecodeNewlines 
 */
function decodeAttr (value, shouldDecodeNewlines) {
  var re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr;
  return value.replace(re, function (match) { return decodingMap[match]; })
}
/**
 * 分析HTML的函数
 * @param {*} html 模板字符串
 * @param {*} options 传入的处理方法和参数
 */
function parseHTML (html, options) 
{
  var stack = [];
  var expectHTML = options.expectHTML;
  var isUnaryTag$$1 = options.isUnaryTag || no;
  var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
  var index = 0;
  var last, lastTag;
  while (html) 
  {
    last = html;
    /**
     * 对于lastTag的值不为空或者不是原生的文本元素的处理
     */
    if (!lastTag || !isPlainTextElement(lastTag)) 
    {
      /**
       * 获取第一个<符出现的位置对于出现的位置为第一个值的处理
       */
      var textEnd = html.indexOf('<');
      if (textEnd === 0) 
      {
        if (comment.test(html)) 
        {
          var commentEnd = html.indexOf('-->');

          if (commentEnd >= 0) 
          {
            if (options.shouldKeepComment) 
            {
              options.comment(html.substring(4, commentEnd));
            }
            advance(commentEnd + 3);
            continue
          }
        }
        if (conditionalComment.test(html)) 
        {
          var conditionalEnd = html.indexOf(']>');

          if (conditionalEnd >= 0) 
          {
            advance(conditionalEnd + 2);
            continue
          }
        }
        var doctypeMatch = html.match(doctype);
        if (doctypeMatch) 
        {
          advance(doctypeMatch[0].length);
          continue
        }
        /**匹配结束标签 */
        var endTagMatch = html.match(endTag);
        if (endTagMatch) 
        {
          var curIndex = index;
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue
        }

        /**获取处理开始标签的处理 */
        var startTagMatch = parseStartTag();
        /**对于处理结果为真的处理 */
        if (startTagMatch) 
        {
          handleStartTag(startTagMatch);
          if (shouldIgnoreFirstNewline(lastTag, html)) 
          {
            advance(1);
          }
          continue
        }
      }

      var text = (void 0), rest = (void 0), next = (void 0);
      if (textEnd >= 0) 
      {
        rest = html.slice(textEnd);
        while (
          !endTag.test(rest) &&
          !startTagOpen.test(rest) &&
          !comment.test(rest) &&
          !conditionalComment.test(rest)
        ) 
        {
          // < in plain text, be forgiving and treat it as text
          next = rest.indexOf('<', 1);
          if (next < 0) 
          {
            break
          }
          textEnd += next;
          rest = html.slice(textEnd);
        }
        text = html.substring(0, textEnd);
        advance(textEnd);
      }

      if (textEnd < 0) 
      {
        text = html;
        html = '';
      }

      if (options.chars && text) 
      {
        options.chars(text);
      }
    } 
    /**
     * 对于lasttag的值为空或者lastTag的值为原生文本元素的处理
     */
    else 
    {
      var endTagLength = 0;
      var stackedTag = lastTag.toLowerCase();
      var reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
      var rest$1 = html.replace(reStackedTag, function (all, text, endTag) 
      {
        endTagLength = endTag.length;
        if (!isPlainTextElement(stackedTag) && stackedTag !== 'noscript') 
        {
          text = text
            .replace(/<!--([\s\S]*?)-->/g, '$1')
            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
        }
        if (shouldIgnoreFirstNewline(stackedTag, text)) 
        {
          text = text.slice(1);
        }
        if (options.chars) 
        {
          options.chars(text);
        }
        return ''
      });
      index += html.length - rest$1.length;
      html = rest$1;
      parseEndTag(stackedTag, index - endTagLength, index);
    }
    /**
     * 对于html的值为last的值的处理
     */
    if (html === last) 
    {
      options.chars && options.chars(html);
      if ("development" !== 'production' && !stack.length && options.warn) 
      {
        options.warn(("Mal-formatted tag at end of template: \"" + html + "\""));
      }
      break
    }
  }
  /**分析结束标签 */
  parseEndTag();
  /**
   * 更新当前的索引值获取字符串在此索引值后面的内容
   * @param {*} n 
   */
  function advance (n) 
  {
    index += n;
    html = html.substring(n);
  }
  /**
   * 分析开始标签
   * 返回匹配到结果
   */
  function parseStartTag () 
  {
    /**匹配开始标签 */
    var start = html.match(startTagOpen);
    if (start) 
    {
      var match = {
        tagName: start[1],
        attrs: [],
        start: index
      };
      /**前进 */
      advance(start[0].length);
      var end, attr;
      /**
       * 对于没有匹配到结束标签或者是匹配到属性的处理
       * 前进属性个数据长度，添加到匹配的属性数组中
       */
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) 
      {
        advance(attr[0].length);
        match.attrs.push(attr);
      }
      /**对于匹配到结束标签的处理
       * 返回匹配结果
       */
      if (end) 
      {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match
      }
    }
  }
  /**
   * 开始标签的处理
   * @param {*} match 开始标签中的属性数组
   * 获取标签名
   */
  function handleStartTag (match) 
  {
    /**标签名 */
    var tagName = match.tagName;
    var unarySlash = match.unarySlash;
    /**这个值应该一直是真 */
    if (expectHTML) 
    {
      /**对于结束标签是p或者是非短语标签的处理 */
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) 
      {
        parseEndTag(lastTag);
      }
      /** */
      if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) 
      {
        parseEndTag(tagName);
      }
    }

    var unary = isUnaryTag$$1(tagName) || !!unarySlash;

    var l = match.attrs.length;
    var attrs = new Array(l);
    for (var i = 0; i < l; i++) 
    {
      var args = match.attrs[i];
      // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
      if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) 
      {
        if (args[3] === '') 
        { 
          delete args[3]; 
        }
        if (args[4] === '') 
        { 
          delete args[4]; 
        }
        if (args[5] === '') 
        { 
          delete args[5]; 
        }
      }
      var value = args[3] || args[4] || args[5] || '';
      attrs[i] = {
        name: args[1],
        value: decodeAttr(
          value,
          options.shouldDecodeNewlines
        )
      };
    }

    if (!unary) 
    {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs });
      lastTag = tagName;
    }

    if (options.start) 
    {
      options.start(tagName, attrs, unary, match.start, match.end);
    }
  }
  /**
   * 分析结束标签
   * @param {*} tagName 
   * @param {*} start 
   * @param {*} end 
   */
  function parseEndTag (tagName, start, end) 
  {
    var pos, lowerCasedTagName;
    if (start == null) 
    {
      start = index;
    }
    if (end == null) 
    {
      end = index;
    }

    if (tagName) 
    {
      lowerCasedTagName = tagName.toLowerCase();
    }

    // Find the closest opened tag of the same type
    if (tagName) 
    {
      for (pos = stack.length - 1; pos >= 0; pos--) 
      {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) 
        {
          break
        }
      }
    } 
    else 
    {
      // If no tag name is provided, clean shop
      pos = 0;
    }

    if (pos >= 0) 
    {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i--) 
      {
        if ("development" !== 'production' &&
          (i > pos || !tagName) &&
          options.warn
        ) 
        {
          options.warn(
            ("tag <" + (stack[i].tag) + "> has no matching end tag.")
          );
        }
        if (options.end) 
        {
          options.end(stack[i].tag, start, end);
        }
      }

      // Remove the open elements from the stack
      stack.length = pos;
      lastTag = pos && stack[pos - 1].tag;
    } 
    else if (lowerCasedTagName === 'br') 
    {
      if (options.start) 
      {
        options.start(tagName, [], true, start, end);
      }
    } 
    else if (lowerCasedTagName === 'p') 
    {
      if (options.start) 
      {
        options.start(tagName, [], false, start, end);
      }
      if (options.end) 
      {
        options.end(tagName, start, end);
      }
    }
  }
}

/*  */

// 隔离正则表达式
var splitRE = /\r?\n/g;
// 替换正则表达式
var replaceRE = /./g;
// 特殊标签
var isSpecialTag = makeMap('script,style,template', true);
/**
 * 属性
 */


/**
 * 组件分析
 * @param {*} content 内容  内容字符串
 * @param {*} options 操作  操纵对象
 */
function parseComponent (
  content,
  options
 ) 
 {
  if ( options === void 0 ) options = {};

  var sfc = {
    template: null,
    script: null,
    styles: [],
    customBlocks: []
  };
  var depth = 0;
  var currentBlock = null;
  /**
   * 开始处理组件
   * @param {*} tag     开始标签
   * @param {*} attrs   属性
   * @param {*} unary 
   * @param {*} start   开始位置
   * @param {*} end     结束位置
   */
  function start (
    tag,
    attrs,
    unary,
    start,
    end
  ) {
    // 对于深度为0的处理，设置当前块的属性
    if (depth === 0) {
      currentBlock = {
        type: tag,
        content: '',
        start: end,
        attrs: attrs.reduce(function (cumulated, ref) {
          var name = ref.name;
          var value = ref.value;

          cumulated[name] = value || true;
          return cumulated
        }, Object.create(null))
      };
      /**
       * 对于特殊的标签的处理
       * 检测当前块和属相数组
       */
      if (isSpecialTag(tag)) {
        checkAttrs(currentBlock, attrs);
        if (tag === 'style') {
          // 对于标签是style的处理，加入到sfc的styles数组中
          sfc.styles.push(currentBlock);
        } else {
          // 对于是其他类型的标签替换此标签的值
          sfc[tag] = currentBlock;
        }
      } else { // custom blocks
        sfc.customBlocks.push(currentBlock);
      }
    }
    // 对于unary的值不为真设置depth的值自加一
    if (!unary) {
      depth++;
    }
  }
  /**
   * 检测属性
   * @param {*} block 块
   * @param {*} attrs 属性数组
   */
  function checkAttrs (block, attrs) {
    // 获取属相对象的长度
    for (var i = 0; i < attrs.length; i++) {
      // 获取属性值
      var attr = attrs[i];
      // 对于属性的name为lang
      if (attr.name === 'lang') {
        block.lang = attr.value;
      }
      // 对于属性的name为scoped的处理
      if (attr.name === 'scoped') {
        block.scoped = true;
      }
      // 对于属性的name为module的处理
      if (attr.name === 'module') {
        block.module = attr.value || true;
      }
      // 对于属性的name的值为src的处理
      if (attr.name === 'src') {
        block.src = attr.value;
      }
    }
  }
  /**
   * 结束分析标签
   * @param {*} tag 标签字符串
   * @param {*} start 开始的位置
   * @param {*} end 结束位置
   */
  function end (tag, start, end) {
    // 对于甚多值为1且当前块存在的处理
    if (depth === 1 && currentBlock) {
      currentBlock.end = start;
      var text = deIndent(content.slice(currentBlock.start, currentBlock.end));
      // pad content so that linters and pre-processors can output correct
      // line numbers in errors and warnings
      if (currentBlock.type !== 'template' && options.pad) {
        text = padContent(currentBlock, options.pad) + text;
      }
      currentBlock.content = text;
      currentBlock = null;
    }
    depth--;
  }
  /**
   * 填充内容
   * @param {*} block 块
   * @param {*} pad  填充内容
   */
  function padContent (block, pad) {
    // 对于填充的内容是space的处理将内容的开始到block.start的值截取并将替换正则表达式转换为空格符
    if (pad === 'space') {
      return content.slice(0, block.start).replace(replaceRE, ' ')
    } else {
      var offset = content.slice(0, block.start).split(splitRE).length;
      var padChar = block.type === 'script' && !block.lang
        ? '//\n'
        : '\n';
      return Array(offset).join(padChar)
    }
  }
  /** 分许HTML */
  parseHTML(content, {
    start: start,
    end: end
  });

  return sfc
}

/*  */
/**\vue-master\src\core\util\lan.js */
/**创建一个不允许改变的空的对象 */
var emptyObject = Object.freeze({});

/**
 * Check if a string starts with $ or _
 * 判断字符串是否是以$字符或者是_字符开始
 */


/**
 * Define a property.
 * 定义对象的属性
 * 值为传入的值，可写可枚举
 * obj:对象
 * key:属性
 * enumerable:可枚举属性
 */
function def (obj, key, val, enumerable) 
{
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}


/**end \vue-master\src\core\util\lang.js */

/** 有价值的类型 */
var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];
/** 生命周期钩子函数 */
var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured'
];

/*  */
/**\vue-master\src\core\config.js */
/**导入no,noop,indentity
 * no:无论传入什么参数总是返回否
 * noop:不做任何有效的处理
 * indentity:返回相同的参数
 */
/**导入生命周期的钩子函数 */
/**
 * 配置信息
 */

/**默认导出 */
var config = ({
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
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

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
});
/**end \vue-master\src\core\config.js */

/*  */

var warn = noop;

var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);
/**如果开发环境不是生产模式的处理 */
{
  /**判断是否有定义console */
  var hasConsole = typeof console !== 'undefined';
  /** */
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };
  /**警告函数 */
  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';
    /**对于有警告处理函数的处理，使用警告处理函数 */
    if (config.warnHandler) 
    {
      config.warnHandler.call(null, msg, vm, trace);
    } 
    /**对于没有警告处理函数的处理使用控制台输出 */
    else if (hasConsole && (!config.silent)) 
    {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };
  /**提示函数的实现 */
  formatComponentName = function (vm, includeFile) {
    /**对于是根组件的处理 */
    if (vm.$root === vm) 
    {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm || {};
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) 
    {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };
  /**重复函数的实现，将字符串重复多次 */
  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };
  /**产生组件追踪 */
  generateComponentTrace = function (vm) {
    /**对于组件是 */
    if (vm._isVue && vm.$parent) 
    {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) 
      {
        /**对于树的长度大于0的处理 */
        if (tree.length > 0) 
        {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) 
          {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } 
          else if (currentRecursiveSequence > 0) 
          {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        /**向树中添加对象并设置vm为当前vm的父对象 */
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } 
    else 
    {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */
/**vue-master\src\core\util\util.js 错误处理相关函数*/
/**错误处理函数 */
function handleError (err, vm, info) 
{
  if (vm) 
  {
    var cur = vm;
    while ((cur = cur.$parent)) 
    {
      /**设置hooks为错误捕捉函数 */
      var hooks = cur.$options.errorCaptured;
      if (hooks) 
      {
        for (var i = 0; i < hooks.length; i++) 
        {
          try 
          {
            /**错误捕捉 */
            var capture = hooks[i].call(cur, err, vm, info) === false;
            if (capture) 
            {
              return
            }
          } 
          catch (e) 
          {
            /**出现错误调用错误处理函数 */
            globalHandleError(e, cur, 'errorCaptured hook');
          }
        }
      }
    }
  }
  globalHandleError(err, vm, info);
}

function globalHandleError (err, vm, info) 
{
  /**判断是否配置了错误处理 */
  if (config.errorHandler) 
  {
    try 
    {
      /**调用错误处理 */
      return config.errorHandler.call(null, err, vm, info)
    } 
    catch (e) 
    {
      /**输出错误信息 */
      logError(e, null, 'config.errorHandler');
    }
  }
  /**输出错误信息 */
  logError(err, vm, info);
}
/**输出错误信息 */
function logError (err, vm, info) 
{
  /**对于开发环境不是生产模式输出错误原因和错误 */
  {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  /**控制台输出错误信息 */
  if (inBrowser && typeof console !== 'undefined') 
  {
    console.error(err);
  } 
  else 
  {
    throw err
  }
}
/**end vue-master\src\core\util\util.js */

/*  */
/* globals MessageChannel */
/** vue-master\src\core\util\env.js主要是判断寄主环境 */
// can we use __proto__?
/** 对象是否具有__proto__属性 */
var hasProto = '__proto__' in {};

// Browser environment sniffing
/** isBrowser判断是否是浏览器根据是否存在window对象，返回的是一个布尔值 */
var inBrowser = typeof window !== 'undefined';
/** 如果是浏览器获取用户代理 */
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
/** 判断浏览器是否是IE的内核 */
var isIE = UA && /msie|trident/.test(UA);
/** 判断浏览器是否是IE9 */
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
/** 判断浏览器是否是edge浏览器 */
var isEdge = UA && UA.indexOf('edge/') > 0;
/** 判断是否是安卓的浏览器 */
var isAndroid = UA && UA.indexOf('android') > 0;
/** 判断是否是IOS的浏览器 */
var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);
/** 判断是否是谷歌的浏览器 */
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// Firefox has a "watch" function on Object.prototype...
/** 原生对象是否具有watch功能 */
var nativeWatch = ({}).watch;


/** 对于inBrower的值不为否的处理
 * 给全局变量添加属性和监听器
 */
if (inBrowser) {
  try {
    var opts = {};
    /** 设置在opts对象上定义属性passive的获取函数 */
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        
      }
    } )); 
    // https://github.com/facebook/flow/issues/285
    /** 为对象添加 */
    window.addEventListener('test-passive', null, opts);
  } catch (e) {
    console.log("Add event listener have error " + e);
  }
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;

/** 判断是否是服务器端渲染
 *  设置_isServer属性的值
 */
var isServerRendering = function () {
  /** 对于服务器未定义的处理 */
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
/** 设置devtool的值 */


/* istanbul ignore next */
/** 判断是否是原生的 */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}
/** 判断是否支持Symbol和Reflect*/
var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

/**
 * Defer a task to execute it asynchronously.
 */
/** 定义nextTick函数，异步执行的实现
 * 
*/
var nextTick = (function () {
  /** 回调函数数组 */
  var callbacks = [];
  /** 挂起状态 */
  var pending = false;
  /** */
  var timerFunc;
  /** 定义下一个时刻处理函数 
   * 根据浏览器的情况进行下一时刻处理函数的处理
  */
  function nextTickHandler () {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }
  /** 对于setImmediate不是未定义的且是原生的处理
   * 设置事件处理函数
   */
  if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
    timerFunc = function () {
      setImmediate(nextTickHandler);
    };
  } else if (typeof MessageChannel !== 'undefined' && (isNative(MessageChannel) ||MessageChannel.toString() === '[object MessageChannelConstructor]')) {
    var channel = new MessageChannel();
    var port = channel.port2;
    channel.port1.onmessage = nextTickHandler;
    timerFunc = function () {
      port.postMessage(1);
    };
  } /** 对于没有以上两个函数的处理 */ else {
    /* istanbul ignore next */
    /** 对于有Promise的处理 */
    if (typeof Promise !== 'undefined' && isNative(Promise)) {
      // use microtask in non-DOM environments, e.g. Weex
      var p = Promise.resolve();
      timerFunc = function () {
        p.then(nextTickHandler);
      };
    } else {
      // fallback to setTimeout
      timerFunc = function () {
        setTimeout(nextTickHandler, 0);
      };
    }
  }
  /** 返回任务回调函数入队函数，回调函数入队
   * cb:回调函数
   * ctx:参数
   */
  return function queueNextTick (cb, ctx) {
    var _resolve;
    /** 回调函数入队 */
    callbacks.push(function () {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve, reject) {
        _resolve = resolve;
      })
    }
  }
})();

/** 设置集合_Set
 *  如果支持Set使用原生的Set
 *  如果不支持Set实现Set方法
 */
var _Set;
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  /** 设置Set类匹配ISet */
  _Set = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    /** has函数的实现，即判断集合中是否有此参数 */
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    /** add函数的实现，向集合中添加数据*/
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    /** clear函数的实现,设置set的值为一个空对对象没有原型链 */
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

/**类型别名 PropOptions
 * type
 * default
 * required
 * validator
*/

/**有效的数据Prop
 * key:键值
 * propOptions:对象
 * propData:
 * vm
 */

/*  */
/** 这个文件没有什么用只是引入了很多的接口 */

/*  */


/**设置uid的值为0 */
var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
/**创建Dep类 */
var Dep = function Dep () 
{
  this.id = uid++;
  this.subs = [];
};
/**将sub压入对象数组中 */
Dep.prototype.addSub = function addSub (sub) 
{
  this.subs.push(sub);
};
/**移除对象中的数据 */
Dep.prototype.removeSub = function removeSub (sub) 
{
  remove(this.subs, sub);
};
/**定义depend函数
 * 设置Dep对象的压入数组中
 */
Dep.prototype.depend = function depend () 
{
  if (Dep.target) 
  {
    Dep.target.addDep(this);
  }
};
/**Dep的通知函数
 * 设置此对象的所有子进行更新
 */
Dep.prototype.notify = function notify () 
{
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) 
  {
    subs[i].update();
  }
};

/**定义Dep的目标为空 */
Dep.target = null;
/**向目标栈中压入数据 */

/**提取目标栈中的数据 */

/*  */
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
var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.functionalContext = undefined;
  this.functionalOptions = undefined;
  this.functionalScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

/** 创建一个空的虚拟节点
 * 使用构造函数创建一个虚拟节点
 * 设置节点的text属性为text值
 * 设置节点的isComment为真
 */

/** 创建一个文本节点 */


// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
/** 节点复制，创建一个新的节点对象将传入节点的ns,istatic,key,iscomment的值进行复制设置iscloned的值设置为真
 * vnode:
 * deep:是否深度拷贝
 */

/** 将一个节点数组进行拷贝 */

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

/**设置arrayProto的值为数组构造函数的原型 */
var arrayProto = Array.prototype;
/**数组的实现 */
var arrayMethods = Object.create(arrayProto);[
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]
.forEach(function (method) 
{
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () 
  {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) 
    {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) 
    {
      ob.observeArray(inserted);
    }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

/** 获取对象的所用属性名称 */
var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * By default, when a reactive property is set, the new value is
 * also converted to become reactive. However when passing down props,
 * we don't want to force conversion because the value may be a nested value
 * under a frozen data structure. Converting it would defeat the optimization.
 */
/** 设置observerState的值 */
var observerState = {
  shouldConvert: true
};

/**
 * Observer class that are attached to each observed
 * object. Once attached, the observer converts target
 * object's property keys into getter/setters that
 * collect dependencies and dispatches updates.
 */
/** 定义Observer类
 * value:对象
 * dep:依赖
 * vmCount:
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  /** 定义对象的__ob__属性 */
  def(value, '__ob__', this);
  /** 对于值为数组的处理 */
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
/** */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i], obj[keys[i]]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
/** 设置target的__proto__属性为src */
function protoAugment (target, src, keys) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/** 拷贝参数
 * 将src中的keys属性拷贝到target对象中
 */
function copyAugment (target, src, keys) 
{
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
/**
 * value：
 * asRootData：
 * 返回发布对象
 */
function observe (value, asRootData) {
  /** 对于value的不是对象或者value是VNode的实例的处理
   * 直接返回
   */
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  /** 设置Ob的值为Observer或者是空对象 */
  var ob;
  /** 对于value自身具有__ob__属性且其是Observer的实例的处理
   * 设置ob的值为value.__ob__
   */
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    /** 对于observerState的shouldConvert属性为真
   * 且不是服务器端渲染
   * 且value不是数组或者不是
   * 且
   * 且value的isVue属性不为真的处理
   * 根据value创建一个新的Observer对象
   */
    ob = new Observer(value);
  }
  /** 如果asRootData的值和ob的值为针对处理设置ob的vmCount的值自增1 */
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * 定义对象的反应属性
 * @param {*} obj 反应的对象
 * @param {*} key 属性
 * @param {*} val 值
 * @param {*} customSetter 用户定义的设置处理函数
 * @param {*} shallow 是否隐藏
 */
function defineReactive (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();
  /** 获取对象的对应属性的属性描述符 */
  var property = Object.getOwnPropertyDescriptor(obj, key);
  /** 如果属性的可配置属性为否则退出 */
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  /** 获取获取和设置函数 */
  var getter = property && property.get;
  var setter = property && property.set;

  var childOb = !shallow && observe(val);
  /** 定义属性
   * obj:对象
   * key:属性
   * 定义对象的属性为可枚举和可配置以及设置函数和获取函数
   */
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      /** 获取属性值 */
      var value = getter ? getter.call(obj) : val;
      /** 对于Dep的target的属性不为否的处理
       * 更新依赖数组
       */
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* 对于参数没有发生变化的处理 */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ("development" !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * 为对象设置属性值
 * @param {*} target 数组型的数据对象
 * @param {*} key 属性
 * @param {*} val 值
 */
function set (target, key, val) {
  /** 对于对象是数组且key为有效的索引值的处理
   * 删除指定位置的值并向指定位置添加新的值
  */
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  /** 对于对象具有此属性的处理
   * 设置此对象此属性的值
   */
  if (hasOwn(target, key)) {
    target[key] = val;
    return val
  }
  /** 获取对象的__ob__的值存在在ob中 */
  var ob = (target).__ob__;
  /** 对于对象的_isVue的属性为真或者ob存在且ob的vmCount的值不为0的处理
   * 进行警告和退出 */
  if (target._isVue || (ob && ob.vmCount)) {
    "development" !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  /** ob的值为否，添加对象的此属性和属性值 */
  if (!ob) {
    target[key] = val;
    return val
  }
  /** 定义反应处理*/
  defineReactive(ob.value, key, val);
  /** 定义提示 */
  ob.dep.notify();
  /** 返回参数值 */
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
/** 删除功能,删除数组此索引位置的值或者是对象的此自身属性
 * target:数组对象或者是对象
 * key:键值或者是索引号
 */


/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
/** 依赖数组，更新对象的相关依赖数组 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**创建strats对象为一个空的对象
 * strats为配置的config.optionMergeStrategies属性
 * 即为创建空对象的函数
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
/**对于环境不是生产模式的处理 */
{
  /** */
  strats.el = strats.propsData = function (parent, child, vm, key) 
  {
    /**如果vm对象的值为否进行警告
     * 返回默认的strat
     */
    if (!vm) 
    {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    /**子不存在返回父 */
    return defaultStrat(parent, child)
  };
}

/**
 * 进行数据的合并，将from中的属性添加至to对象
 * @param {*} to 数据目标
 * @param {*} from 数据源
 */
function mergeData (to, from) 
{
  /**对于数据源的值为空的处理，直接返回目的数据 */
  if (!from) 
  {
    return to
  }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  /**将源数据中的数据合并到目的数据 */
  for (var i = 0; i < keys.length; i++) 
  {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    /**如果目的对象没有这个属性的处理添加此属性 */
    if (!hasOwn(to, key)) 
    {
      set(to, key, fromVal);
    } 
    /**对于目的对象没有此属性且目的对象的值为对象且源对象的值为对象的处理，递归调用此函数进行深度的复制 */
    else if (isPlainObject(toVal) && isPlainObject(fromVal)) 
    {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * 聚合数据
 * @param {*} parentVal 
 * @param {*} childVal 
 * @param {*} vm Vue对象
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) 
{
  /**对于Vue对象不存在的处理方式 */
  if (!vm) 
  {
    // in a Vue.extend merge, both should be functions
    if (!childVal) 
    {
      return parentVal
    }
    if (!parentVal) 
    {
      return childVal
    }
    return function mergedDataFn () 
    {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this) : parentVal
      )
    }
  } 
  /**对于两个对象有一个存在的处理 */
  else if (parentVal || childVal) 
  {
    return function mergedInstanceDataFn () 
    {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm)
        : parentVal;
      if (instanceData) 
      {
        return mergeData(instanceData, defaultData)
      } 
      else 
      {
        return defaultData
      }
    }
  }
}
/**strats对象的data属性
 * parentVal：父值
 * childVal：子值
 * vm：组件对象
 * 如果vm的值为否
 * 如果子存在且子的类型不为方法，返回父的值
 * 反之返回当前strats的值与父的值聚合到子的值
 * 反之返回聚合父的值和子的值到vm的值
 */
strats.data = function (
  parentVal,
  childVal,
  vm
) 
{
  if (!vm) 
  {
    if (childVal && typeof childVal !== 'function') 
    {
      "development" !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn.call(this, parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
/**聚合钩子
 * parentVal:
 * childVal:
 * 如果子的值为否返回父的值
 * 如果子的值为真
 * 如果父的值为真返回父的值concat后的值
 * 如果父的值为假判断子是否是数组
 * 如果子的属性为数组返回子，返回子的数组化形式
 */
function mergeHook (
  parentVal,
  childVal
) 
{
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}
/**设置strats的钩子的方法 */
LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});


/**聚合资源
 * parentVal：父值
 * childVal：子值
 * vm：组件
 * key：键值
 * 如果子的值为真，将子的值浅拷贝到资源对象中
 * 如果子的值为假，不对资源对象进行处理
 * 返回资源对象
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) 
{
  /**创建资源对象 */
  var res = Object.create(parentVal || null);
  if (childVal) 
  {
    "development" !== 'production' && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } 
  else 
  {
    return res
  }
}
/**strats对象中添加对应的资源的方法 */
ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});


/**strats对象的watch属性
 * parentVal：
 * childVal：
 * vm：
 * key：
 * 如果父的值和子的值都是对象的watch属性设置其值为undefined
 * 如果子的值为否返回父对象或者是空对象
 * 如果子的值为真父的值为否返回子对象
 * 如果父子对象都存在
 * 将父对象浅拷贝值资源对象中
 * 遍历子对象的属性
 * 如果也存在于父值中且不是数组设置临时变量为此属性值的数组化结构
 * 反之不做任何处理
 * 设置父对象的浅拷贝的此属性值为
 * 当此属性在父对象中设置此属性为数组拼接此子属性
 * 当存在于父属性中此属性在子对象中为数组设置为此子属性反之设置为子对象此属性的数组形式
 * 返回此对象的父对象的浅拷贝的合并版本
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) 
{
  /**如果父的值和子的值都是对象的watch属性设置其值为undefined */
  if (parentVal === nativeWatch) 
  {
    parentVal = undefined;
  }
  if (childVal === nativeWatch) 
  {
    childVal = undefined;
  }
  /* istanbul ignore if */
  if (!childVal) 
  {
    return Object.create(parentVal || null)
  }
  {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) 
  {
    return childVal
  }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) 
  {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) 
    {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};
/**设置strats对象的props属性，methods属性，inject属性和computed属性
 * parentVal：
 * childVal：
 * vm：
 * key：
 * 如果父对象的值为假返回子对象
 * 如果父对象的值不为假的处理
 * 创建一个空格对象，浅拷贝父对象
 * 如果子对象存在，再将此对象浅拷贝子对象，返回合并之后的对象
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) 
{
  if (childVal && "development" !== 'production') 
  {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) 
  {
    return childVal
  }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) 
  {
    extend(ret, childVal);
  }
  return ret
};
/** 设置strats对象的provide属性为聚合数据和方法的函数 */
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
/** childVal的值为未定义返回parent的值反之返回child的值 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * 
 * @param {*} name 
 * @param {*} value 
 * @param {*} vm 
 */
function assertObjectType (name, value, vm) 
{
  if (!isPlainObject(value)) 
  {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
/**聚合两个对象的参数
 * parent：父对象
 * child：子对象
 * vm：
 */

/**
 * 
 * @param {*} options 
 * @param {*} type 
 * @param {*} id 
 * @param {*} warnMissing 
 */

/*  */
/** 这个文件没有什么用只是引入了很多的接口 */

/*  */

/** 预留属性 */
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
/** 接收值的属性 */
var acceptValue = makeMap('input,textarea,option,select,progress');
/**
 * 必须使用的属性
 * @param {*} tag
 * @param {*} type
 * @param {*} attr 属性名称
 */
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};
/** 枚举属性 */
var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');
/** bool属性 */
var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);


/**
 * 判断是否是xlink
 * @param {*} name
 */

/**
 * 获取xlink属性的值
 * @param {*} name
 */

/**
 * 
 * @param {*} val
 */

/*  */

/**
 * 为节点
 * @param {*} vnode 
 */

/**
 * 如果动态样式或者是静态样式有一个存在进行样式的和合并，反之返回空字符串
 * 样式合并
 * @param {*} staticClass 静态样式
 * @param {*} dynamicClass 动态样式
 */

/**
 * 如果两个字符串都不为空返回两个字符串的合并，反之返回存在的字符串
 * @param {*} a  字符串
 * @param {*} b  字符串
 */

/**
 * 数据字符串化
 * 将数组和对象转换为字符串
 * 字符串直接返回
 * 其他类型转化为空字符串
 * @param {*} value
 */

/*  */
/* globals MessageChannel */
/** vue-master\src\core\util\env.js主要是判断寄主环境 */
// can we use __proto__?
/** 对象是否具有__proto__属性 */


// Browser environment sniffing
/** isBrowser判断是否是浏览器根据是否存在window对象，返回的是一个布尔值 */
var inBrowser$1 = typeof window !== 'undefined';
/** 如果是浏览器获取用户代理 */
var UA$1 = inBrowser$1 && window.navigator.userAgent.toLowerCase();
/** 判断浏览器是否是IE的内核 */
var isIE$1 = UA$1 && /msie|trident/.test(UA$1);
/** 判断浏览器是否是IE9 */
var isIE9$1 = UA$1 && UA$1.indexOf('msie 9.0') > 0;
/** 判断浏览器是否是edge浏览器 */
var isEdge$1 = UA$1 && UA$1.indexOf('edge/') > 0;
/** 判断是否是安卓的浏览器 */
var isAndroid$1 = UA$1 && UA$1.indexOf('android') > 0;
/** 判断是否是IOS的浏览器 */
var isIOS$1 = UA$1 && /iphone|ipad|ipod|ios/.test(UA$1);
/** 判断是否是谷歌的浏览器 */
var isChrome$1 = UA$1 && /chrome\/\d+/.test(UA$1) && !isEdge$1;

// Firefox has a "watch" function on Object.prototype...
/** 原生对象是否具有watch功能 */



/** 对于inBrower的值不为否的处理
 * 给全局变量添加属性和监听器
 */
if (inBrowser$1) {
  try {
    var opts$1 = {};
    /** 设置在opts对象上定义属性passive的获取函数 */
    Object.defineProperty(opts$1, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        
      }
    } )); 
    // https://github.com/facebook/flow/issues/285
    /** 为对象添加 */
    window.addEventListener('test-passive', null, opts$1);
  } catch (e) {
    console.log("Add event listener have error " + e);
  }
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer$1;

/** 判断是否是服务器端渲染
 *  设置_isServer属性的值
 */
var isServerRendering$1 = function () {
  /** 对于服务器未定义的处理 */
  if (_isServer$1 === undefined) {
    /* istanbul ignore if */
    if (!inBrowser$1 && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer$1 = global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer$1 = false;
    }
  }
  return _isServer$1
};

// detect devtools
/** 设置devtool的值 */


/* istanbul ignore next */
/** 判断是否是原生的 */
function isNative$1 (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}
/** 判断是否支持Symbol和Reflect*/
var hasSymbol$1 =
  typeof Symbol !== 'undefined' && isNative$1(Symbol) &&
  typeof Reflect !== 'undefined' && isNative$1(Reflect.ownKeys);

/**
 * Defer a task to execute it asynchronously.
 */
/** 定义nextTick函数，异步执行的实现
 * 
*/
var nextTick$1 = (function () {
  /** 回调函数数组 */
  var callbacks = [];
  /** 挂起状态 */
  var pending = false;
  /** */
  var timerFunc;
  /** 定义下一个时刻处理函数 
   * 根据浏览器的情况进行下一时刻处理函数的处理
  */
  function nextTickHandler () {
    pending = false;
    var copies = callbacks.slice(0);
    callbacks.length = 0;
    for (var i = 0; i < copies.length; i++) {
      copies[i]();
    }
  }
  /** 对于setImmediate不是未定义的且是原生的处理
   * 设置事件处理函数
   */
  if (typeof setImmediate !== 'undefined' && isNative$1(setImmediate)) {
    timerFunc = function () {
      setImmediate(nextTickHandler);
    };
  } else if (typeof MessageChannel !== 'undefined' && (isNative$1(MessageChannel) ||MessageChannel.toString() === '[object MessageChannelConstructor]')) {
    var channel = new MessageChannel();
    var port = channel.port2;
    channel.port1.onmessage = nextTickHandler;
    timerFunc = function () {
      port.postMessage(1);
    };
  } /** 对于没有以上两个函数的处理 */ else {
    /* istanbul ignore next */
    /** 对于有Promise的处理 */
    if (typeof Promise !== 'undefined' && isNative$1(Promise)) {
      // use microtask in non-DOM environments, e.g. Weex
      var p = Promise.resolve();
      timerFunc = function () {
        p.then(nextTickHandler);
      };
    } else {
      // fallback to setTimeout
      timerFunc = function () {
        setTimeout(nextTickHandler, 0);
      };
    }
  }
  /** 返回任务回调函数入队函数，回调函数入队
   * cb:回调函数
   * ctx:参数
   */
  return function queueNextTick (cb, ctx) {
    var _resolve;
    /** 回调函数入队 */
    callbacks.push(function () {
      if (cb) {
        try {
          cb.call(ctx);
        } catch (e) {
          handleError(e, ctx, 'nextTick');
        }
      } else if (_resolve) {
        _resolve(ctx);
      }
    });
    if (!pending) {
      pending = true;
      timerFunc();
    }
    // $flow-disable-line
    if (!cb && typeof Promise !== 'undefined') {
      return new Promise(function (resolve, reject) {
        _resolve = resolve;
      })
    }
  }
})();

/** 设置集合_Set
 *  如果支持Set使用原生的Set
 *  如果不支持Set实现Set方法
 */
var _Set$1;
if (typeof Set !== 'undefined' && isNative$1(Set)) {
  // use native Set when available.
  _Set$1 = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  /** 设置Set类匹配ISet */
  _Set$1 = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    /** has函数的实现，即判断集合中是否有此参数 */
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    /** add函数的实现，向集合中添加数据*/
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    /** clear函数的实现,设置set的值为一个空对对象没有原型链 */
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */


/**HTML标签 */
var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);
/**判断是否是预指令 */
var isPreTag = function (tag) { return tag === 'pre'; };
/**
 * 判断是否是预留指令 
 * @param {*} tag 
 */
var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};
/**
 * 
 * @param {*} tag 
 */
function getTagNamespace (tag) {
  if (isSVG(tag)) 
  {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') 
  {
    return 'math'
  }
}

/**
 * 
 * @param {*} tag 
 */


var isTextInputType = makeMap('text,number,password,search,email,tel,url');

/*  */

/**
 * 返回此对象的dom元素
 * @param {*} el 字符串或者是元素DOM对象
 */

/*  */

var validDivisionCharRE = /[\w).+\-_$\]]/;
/**
 * 根据输入的表达式转换为表达式
 * @param {*} exp 传入的属性  "{ fontSize: postFontSize + 'em' }"
 */
function parseFilters (exp) {
  var inSingle = false;
  var inDouble = false;
  var inTemplateString = false;
  var inRegex = false;
  var curly = 0;
  var square = 0;
  var paren = 0;
  var lastFilterIndex = 0;
  /**
   * c为当前字符的值
   * prev为之前字符的值
   */
  var c, prev, i, expression, filters;

  for (i = 0; i < exp.length; i++) 
  {
    prev = c;
    c = exp.charCodeAt(i);
    if (inSingle) 
    {
      /**当前字符为单引号，之前字符不是反斜杠 */
      if (c === 0x27 && prev !== 0x5C) 
      {
        inSingle = false;
      }
    } 
    else if (inDouble) 
    {
      /**当前字符为双引号，之前字符不为反斜杠 */
      if (c === 0x22 && prev !== 0x5C) 
      {
        inDouble = false;
      }
    } 
    else if (inTemplateString) 
    {
      /**当前字符为反单引号，之前字符不是反斜杠 */
      if (c === 0x60 && prev !== 0x5C) 
      {
        inTemplateString = false;
      }
    } 
    else if (inRegex) 
    {
      /**当前字符为斜杠，之前字符不是反斜杠 */
      if (c === 0x2f && prev !== 0x5C) 
      {
        inRegex = false;
      }
    } 
    /**当前字符为竖杠之后的字符不是竖杠且之前的字符不是竖杠且curly的值为否且square的值为否且paren的值为否 */
    else if (
      c === 0x7C && // pipe
      exp.charCodeAt(i + 1) !== 0x7C &&
      exp.charCodeAt(i - 1) !== 0x7C &&
      !curly && !square && !paren
    ) 
    {
      if (expression === undefined) 
      {
        // first filter, end of expression
        lastFilterIndex = i + 1;
        expression = exp.slice(0, i).trim();
      } 
      else 
      {
        pushFilter();
      }
    } 
    else 
    {
      switch (c) 
      {
        case 0x22: inDouble = true; break         // "
        case 0x27: inSingle = true; break         // '
        case 0x60: inTemplateString = true; break // `
        case 0x28: paren++; break                 // (
        case 0x29: paren--; break                 // )
        case 0x5B: square++; break                // [
        case 0x5D: square--; break                // ]
        case 0x7B: curly++; break                 // {
        case 0x7D: curly--; break                 // }
      }
      if (c === 0x2f) 
      { // /
        var j = i - 1;
        var p = (void 0);
        // find first non-whitespace prev char
        for (; j >= 0; j--) 
        {
          p = exp.charAt(j);
          if (p !== ' ') 
          {
            break
          }
        }
        if (!p || !validDivisionCharRE.test(p)) 
        {
          inRegex = true;
        }
      }
    }
  }

  if (expression === undefined) 
  {
    expression = exp.slice(0, i).trim();
  } 
  else if (lastFilterIndex !== 0) 
  {
    pushFilter();
  }

  function pushFilter () 
  {
    (filters || (filters = [])).push(exp.slice(lastFilterIndex, i).trim());
    lastFilterIndex = i + 1;
  }

  if (filters) 
  {
    for (i = 0; i < filters.length; i++) 
    {
      expression = wrapFilter(expression, filters[i]);
    }
  }

  return expression
}
/**
 * 过滤器的封装
 * @param {*} exp 
 * @param {*} filter 
 */
function wrapFilter (exp, filter) 
{
  /**获取字符串中的左括号 */
  var i = filter.indexOf('(');
  /**没有找到的处理 */
  if (i < 0) 
  {
    return ("_f(\"" + filter + "\")(" + exp + ")")
  } 
  /**找到的处理 */
  else 
  {
    var name = filter.slice(0, i);
    var args = filter.slice(i + 1);
    return ("_f(\"" + name + "\")(" + exp + "," + args)
  }
}

/*  */

/**默认的标签正则表达式 {{}}小括号中的.号和换行符只能出现0或者是1次*/
var defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;
/**扩展的标签正则表达式 */
var regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g;
/**创建正则表达式 */
var buildRegex = cached(function (delimiters) {
  var open = delimiters[0].replace(regexEscapeRE, '\\$&');
  var close = delimiters[1].replace(regexEscapeRE, '\\$&');
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
});
/**
 * 分析处理文本
 * @param {*} text 
 * @param {*} delimiters 
 */
function parseText (
  text,
  delimiters
) 
{
  /**定义使用的正则表达式 */
  var tagRE = delimiters ? buildRegex(delimiters) : defaultTagRE;
  /**对于没有匹配上的处理 */
  if (!tagRE.test(text)) 
  {
    return
  }
  var tokens = [];
  var lastIndex = tagRE.lastIndex = 0;
  var match, index;
  /**一直提取匹配的项 */
  while ((match = tagRE.exec(text))) 
  {
    index = match.index;
    // push text token
    if (index > lastIndex) 
    {
      tokens.push(JSON.stringify(text.slice(lastIndex, index)));
    }
    // tag token
    var exp = parseFilters(match[1].trim());
    tokens.push(("_s(" + exp + ")"));
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) 
  {
    tokens.push(JSON.stringify(text.slice(lastIndex)));
  }
  return tokens.join('+')
}

/*  */

/**
 * 基本警告
 * 控制台输出错误信息
 * @param {*} msg 错误信息
 */
function baseWarn (msg) {
  console.error(("[Vue compiler]: " + msg));
}
/**
 * 去除模块功能
 * @param {*} modules 
 * @param {*} key 
 */

/**
 * 向props数组中添加参数
 * @param {*} el 抽象元素
 * @param {*} name 属性名称
 * @param {*} value 属性值
 */
function addProp (el, name, value) 
{
  (el.props || (el.props = [])).push({ name: name, value: value });
}
/**
 * 向attr数组中添加参数
 * @param {*} el 
 * @param {*} name 
 * @param {*} value 
 */

/**
 * 向directive数组中添加参数，即添加指令
 * @param {*} el 对象
 * @param {*} name 
 * @param {*} rawName 
 * @param {*} value 
 * @param {*} arg 
 * @param {*} modifiers 
 */


/**
 * 添加处理函数
 * @param {*} el 对象
 * @param {*} name 
 * @param {*} value 
 * @param {*} modifiers 
 * @param {*} important 
 * @param {*} warn 
 */
function addHandler (
  el,
  name,
  value,
  modifiers,
  important,
  warn
) 
{
  // warn prevent and passive modifier
  /* istanbul ignore if */
  if (
    "development" !== 'production' && warn &&
    modifiers && modifiers.prevent && modifiers.passive
  ) {
    warn(
      'passive and prevent can\'t be used together. ' +
      'Passive handler can\'t prevent default event.'
    );
  }
  // check capture modifier
  if (modifiers && modifiers.capture) 
  {
    delete modifiers.capture;
    name = '!' + name; // mark the event as captured
  }
  if (modifiers && modifiers.once) 
  {
    delete modifiers.once;
    name = '~' + name; // mark the event as once
  }
  /* istanbul ignore if */
  if (modifiers && modifiers.passive) 
  {
    delete modifiers.passive;
    name = '&' + name; // mark the event as passive
  }
  var events;
  if (modifiers && modifiers.native) 
  {
    delete modifiers.native;
    events = el.nativeEvents || (el.nativeEvents = {});
  } 
  else 
  {
    events = el.events || (el.events = {});
  }
  var newHandler = { value: value, modifiers: modifiers };
  var handlers = events[name];
  /* istanbul ignore if */
  if (Array.isArray(handlers)) 
  {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler);
  } 
  else if (handlers) 
  {
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
  } 
  else 
  {
    events[name] = newHandler;
  }
}
/**
 * 获取绑定的属性
 * @param {*} el DOM对象
 * @param {*} name 属性名称
 * @param {*} getStatic 获取静态状态,这里是是否获取原生的属性的标记
 */
function getBindingAttr (
  el,
  name,
  getStatic
) 
{
  /**获取绑定属性 */
  var dynamicValue =
    getAndRemoveAttr(el, ':' + name) ||
    getAndRemoveAttr(el, 'v-bind:' + name);
  /**对于绑定属性不为空的处理 */
  if (dynamicValue != null) 
  {
    /**返回处理之后的表达式 */
    return parseFilters(dynamicValue)
  } 
  /**对于 */
  else if (getStatic !== false) 
  {
    var staticValue = getAndRemoveAttr(el, name);
    if (staticValue != null) 
    {
      return JSON.stringify(staticValue)
    }
  }
}

/**
 * 获取或者是移除属性，返回对应属性的值
 * @param {*} el 对象
 * @param {*} name 指令名称
 * @param {*} removeFromMap 是否删除
 */
function getAndRemoveAttr (
  el,
  name,
  removeFromMap
) 
{
  var val;
  /**对于对象存在此属性的处理 */
  if ((val = el.attrsMap[name]) != null) 
  {
    /**获取属性列表 */
    var list = el.attrsList;
    for (var i = 0, l = list.length; i < l; i++) 
    {
      if (list[i].name === name) 
      {
        list.splice(i, 1);
        break
      }
    }
  }
  /**删除的处理 */
  if (removeFromMap) 
  {
    delete el.attrsMap[name];
  }
  return val
}

/*  */

function transformNode (el, options) {
  var warn = options.warn || baseWarn;
  var staticClass = getAndRemoveAttr(el, 'class');
  if ("development" !== 'production' && staticClass) {
    var expression = parseText(staticClass, options.delimiters);
    if (expression) {
      warn(
        "class=\"" + staticClass + "\": " +
        'Interpolation inside attributes has been removed. ' +
        'Use v-bind or the colon shorthand instead. For example, ' +
        'instead of <div class="{{ val }}">, use <div :class="val">.'
      );
    }
  }
  if (staticClass) {
    el.staticClass = JSON.stringify(staticClass);
  }
  var classBinding = getBindingAttr(el, 'class', false /* getStatic */);
  if (classBinding) {
    el.classBinding = classBinding;
  }
}

function genData (el) {
  var data = '';
  if (el.staticClass) {
    data += "staticClass:" + (el.staticClass) + ",";
  }
  if (el.classBinding) {
    data += "class:" + (el.classBinding) + ",";
  }
  return data
}

var klass = {
  staticKeys: ['staticClass'],
  transformNode: transformNode,
  genData: genData
};

/*  */

/**
 * 分析处理样式的文本内容
 */
var parseStyleText = cached(function (cssText) 
{
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  /** */
  cssText.split(listDelimiter).forEach(function (item) 
  {
    if (item) 
    {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

/**
 * 将字符串或者是数组转换为对象形式
 * @param {*} bindingStyle 
 */

/**
 * 
 * @param {*} vnode 
 * @param {*} checkChild 
 */

/*  */

function transformNode$1 (el, options) {
  var warn = options.warn || baseWarn;
  var staticStyle = getAndRemoveAttr(el, 'style');
  if (staticStyle) {
    /* istanbul ignore if */
    {
      var expression = parseText(staticStyle, options.delimiters);
      if (expression) {
        warn(
          "style=\"" + staticStyle + "\": " +
          'Interpolation inside attributes has been removed. ' +
          'Use v-bind or the colon shorthand instead. For example, ' +
          'instead of <div style="{{ val }}">, use <div :style="val">.'
        );
      }
    }
    el.staticStyle = JSON.stringify(parseStyleText(staticStyle));
  }

  var styleBinding = getBindingAttr(el, 'style', false /* getStatic */);
  if (styleBinding) {
    el.styleBinding = styleBinding;
  }
}

function genData$1 (el) {
  var data = '';
  if (el.staticStyle) {
    data += "staticStyle:" + (el.staticStyle) + ",";
  }
  if (el.styleBinding) {
    data += "style:(" + (el.styleBinding) + "),";
  }
  return data
}

var style = {
  staticKeys: ['staticStyle'],
  transformNode: transformNode$1,
  genData: genData$1
};

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var he = createCommonjsModule(function (module, exports) {
/*! https://mths.be/he v1.1.1 by @mathias | MIT license */
(function(root) {

	// Detect free variables `exports`.
	var freeExports = 'object' == 'object' && exports;

	// Detect free variable `module`.
	var freeModule = 'object' == 'object' && module &&
		module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code,
	// and use it as `root`.
	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	// All astral symbols.
	var regexAstralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
	// All ASCII symbols (not just printable ASCII) except those listed in the
	// first column of the overrides table.
	// https://html.spec.whatwg.org/multipage/syntax.html#table-charref-overrides
	var regexAsciiWhitelist = /[\x01-\x7F]/g;
	// All BMP symbols that are not ASCII newlines, printable ASCII symbols, or
	// code points listed in the first column of the overrides table on
	// https://html.spec.whatwg.org/multipage/syntax.html#table-charref-overrides.
	var regexBmpWhitelist = /[\x01-\t\x0B\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g;

	var regexEncodeNonAscii = /<\u20D2|=\u20E5|>\u20D2|\u205F\u200A|\u219D\u0338|\u2202\u0338|\u2220\u20D2|\u2229\uFE00|\u222A\uFE00|\u223C\u20D2|\u223D\u0331|\u223E\u0333|\u2242\u0338|\u224B\u0338|\u224D\u20D2|\u224E\u0338|\u224F\u0338|\u2250\u0338|\u2261\u20E5|\u2264\u20D2|\u2265\u20D2|\u2266\u0338|\u2267\u0338|\u2268\uFE00|\u2269\uFE00|\u226A\u0338|\u226A\u20D2|\u226B\u0338|\u226B\u20D2|\u227F\u0338|\u2282\u20D2|\u2283\u20D2|\u228A\uFE00|\u228B\uFE00|\u228F\u0338|\u2290\u0338|\u2293\uFE00|\u2294\uFE00|\u22B4\u20D2|\u22B5\u20D2|\u22D8\u0338|\u22D9\u0338|\u22DA\uFE00|\u22DB\uFE00|\u22F5\u0338|\u22F9\u0338|\u2933\u0338|\u29CF\u0338|\u29D0\u0338|\u2A6D\u0338|\u2A70\u0338|\u2A7D\u0338|\u2A7E\u0338|\u2AA1\u0338|\u2AA2\u0338|\u2AAC\uFE00|\u2AAD\uFE00|\u2AAF\u0338|\u2AB0\u0338|\u2AC5\u0338|\u2AC6\u0338|\u2ACB\uFE00|\u2ACC\uFE00|\u2AFD\u20E5|[\xA0-\u0113\u0116-\u0122\u0124-\u012B\u012E-\u014D\u0150-\u017E\u0192\u01B5\u01F5\u0237\u02C6\u02C7\u02D8-\u02DD\u0311\u0391-\u03A1\u03A3-\u03A9\u03B1-\u03C9\u03D1\u03D2\u03D5\u03D6\u03DC\u03DD\u03F0\u03F1\u03F5\u03F6\u0401-\u040C\u040E-\u044F\u0451-\u045C\u045E\u045F\u2002-\u2005\u2007-\u2010\u2013-\u2016\u2018-\u201A\u201C-\u201E\u2020-\u2022\u2025\u2026\u2030-\u2035\u2039\u203A\u203E\u2041\u2043\u2044\u204F\u2057\u205F-\u2063\u20AC\u20DB\u20DC\u2102\u2105\u210A-\u2113\u2115-\u211E\u2122\u2124\u2127-\u2129\u212C\u212D\u212F-\u2131\u2133-\u2138\u2145-\u2148\u2153-\u215E\u2190-\u219B\u219D-\u21A7\u21A9-\u21AE\u21B0-\u21B3\u21B5-\u21B7\u21BA-\u21DB\u21DD\u21E4\u21E5\u21F5\u21FD-\u2205\u2207-\u2209\u220B\u220C\u220F-\u2214\u2216-\u2218\u221A\u221D-\u2238\u223A-\u2257\u2259\u225A\u225C\u225F-\u2262\u2264-\u228B\u228D-\u229B\u229D-\u22A5\u22A7-\u22B0\u22B2-\u22BB\u22BD-\u22DB\u22DE-\u22E3\u22E6-\u22F7\u22F9-\u22FE\u2305\u2306\u2308-\u2310\u2312\u2313\u2315\u2316\u231C-\u231F\u2322\u2323\u232D\u232E\u2336\u233D\u233F\u237C\u23B0\u23B1\u23B4-\u23B6\u23DC-\u23DF\u23E2\u23E7\u2423\u24C8\u2500\u2502\u250C\u2510\u2514\u2518\u251C\u2524\u252C\u2534\u253C\u2550-\u256C\u2580\u2584\u2588\u2591-\u2593\u25A1\u25AA\u25AB\u25AD\u25AE\u25B1\u25B3-\u25B5\u25B8\u25B9\u25BD-\u25BF\u25C2\u25C3\u25CA\u25CB\u25EC\u25EF\u25F8-\u25FC\u2605\u2606\u260E\u2640\u2642\u2660\u2663\u2665\u2666\u266A\u266D-\u266F\u2713\u2717\u2720\u2736\u2758\u2772\u2773\u27C8\u27C9\u27E6-\u27ED\u27F5-\u27FA\u27FC\u27FF\u2902-\u2905\u290C-\u2913\u2916\u2919-\u2920\u2923-\u292A\u2933\u2935-\u2939\u293C\u293D\u2945\u2948-\u294B\u294E-\u2976\u2978\u2979\u297B-\u297F\u2985\u2986\u298B-\u2996\u299A\u299C\u299D\u29A4-\u29B7\u29B9\u29BB\u29BC\u29BE-\u29C5\u29C9\u29CD-\u29D0\u29DC-\u29DE\u29E3-\u29E5\u29EB\u29F4\u29F6\u2A00-\u2A02\u2A04\u2A06\u2A0C\u2A0D\u2A10-\u2A17\u2A22-\u2A27\u2A29\u2A2A\u2A2D-\u2A31\u2A33-\u2A3C\u2A3F\u2A40\u2A42-\u2A4D\u2A50\u2A53-\u2A58\u2A5A-\u2A5D\u2A5F\u2A66\u2A6A\u2A6D-\u2A75\u2A77-\u2A9A\u2A9D-\u2AA2\u2AA4-\u2AB0\u2AB3-\u2AC8\u2ACB\u2ACC\u2ACF-\u2ADB\u2AE4\u2AE6-\u2AE9\u2AEB-\u2AF3\u2AFD\uFB00-\uFB04]|\uD835[\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDCCF\uDD04\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDD6B]/g;
	var encodeMap = {'\xAD':'shy','\u200C':'zwnj','\u200D':'zwj','\u200E':'lrm','\u2063':'ic','\u2062':'it','\u2061':'af','\u200F':'rlm','\u200B':'ZeroWidthSpace','\u2060':'NoBreak','\u0311':'DownBreve','\u20DB':'tdot','\u20DC':'DotDot','\t':'Tab','\n':'NewLine','\u2008':'puncsp','\u205F':'MediumSpace','\u2009':'thinsp','\u200A':'hairsp','\u2004':'emsp13','\u2002':'ensp','\u2005':'emsp14','\u2003':'emsp','\u2007':'numsp','\xA0':'nbsp','\u205F\u200A':'ThickSpace','\u203E':'oline','_':'lowbar','\u2010':'dash','\u2013':'ndash','\u2014':'mdash','\u2015':'horbar',',':'comma',';':'semi','\u204F':'bsemi',':':'colon','\u2A74':'Colone','!':'excl','\xA1':'iexcl','?':'quest','\xBF':'iquest','.':'period','\u2025':'nldr','\u2026':'mldr','\xB7':'middot','\'':'apos','\u2018':'lsquo','\u2019':'rsquo','\u201A':'sbquo','\u2039':'lsaquo','\u203A':'rsaquo','"':'quot','\u201C':'ldquo','\u201D':'rdquo','\u201E':'bdquo','\xAB':'laquo','\xBB':'raquo','(':'lpar',')':'rpar','[':'lsqb',']':'rsqb','{':'lcub','}':'rcub','\u2308':'lceil','\u2309':'rceil','\u230A':'lfloor','\u230B':'rfloor','\u2985':'lopar','\u2986':'ropar','\u298B':'lbrke','\u298C':'rbrke','\u298D':'lbrkslu','\u298E':'rbrksld','\u298F':'lbrksld','\u2990':'rbrkslu','\u2991':'langd','\u2992':'rangd','\u2993':'lparlt','\u2994':'rpargt','\u2995':'gtlPar','\u2996':'ltrPar','\u27E6':'lobrk','\u27E7':'robrk','\u27E8':'lang','\u27E9':'rang','\u27EA':'Lang','\u27EB':'Rang','\u27EC':'loang','\u27ED':'roang','\u2772':'lbbrk','\u2773':'rbbrk','\u2016':'Vert','\xA7':'sect','\xB6':'para','@':'commat','*':'ast','/':'sol','undefined':null,'&':'amp','#':'num','%':'percnt','\u2030':'permil','\u2031':'pertenk','\u2020':'dagger','\u2021':'Dagger','\u2022':'bull','\u2043':'hybull','\u2032':'prime','\u2033':'Prime','\u2034':'tprime','\u2057':'qprime','\u2035':'bprime','\u2041':'caret','`':'grave','\xB4':'acute','\u02DC':'tilde','^':'Hat','\xAF':'macr','\u02D8':'breve','\u02D9':'dot','\xA8':'die','\u02DA':'ring','\u02DD':'dblac','\xB8':'cedil','\u02DB':'ogon','\u02C6':'circ','\u02C7':'caron','\xB0':'deg','\xA9':'copy','\xAE':'reg','\u2117':'copysr','\u2118':'wp','\u211E':'rx','\u2127':'mho','\u2129':'iiota','\u2190':'larr','\u219A':'nlarr','\u2192':'rarr','\u219B':'nrarr','\u2191':'uarr','\u2193':'darr','\u2194':'harr','\u21AE':'nharr','\u2195':'varr','\u2196':'nwarr','\u2197':'nearr','\u2198':'searr','\u2199':'swarr','\u219D':'rarrw','\u219D\u0338':'nrarrw','\u219E':'Larr','\u219F':'Uarr','\u21A0':'Rarr','\u21A1':'Darr','\u21A2':'larrtl','\u21A3':'rarrtl','\u21A4':'mapstoleft','\u21A5':'mapstoup','\u21A6':'map','\u21A7':'mapstodown','\u21A9':'larrhk','\u21AA':'rarrhk','\u21AB':'larrlp','\u21AC':'rarrlp','\u21AD':'harrw','\u21B0':'lsh','\u21B1':'rsh','\u21B2':'ldsh','\u21B3':'rdsh','\u21B5':'crarr','\u21B6':'cularr','\u21B7':'curarr','\u21BA':'olarr','\u21BB':'orarr','\u21BC':'lharu','\u21BD':'lhard','\u21BE':'uharr','\u21BF':'uharl','\u21C0':'rharu','\u21C1':'rhard','\u21C2':'dharr','\u21C3':'dharl','\u21C4':'rlarr','\u21C5':'udarr','\u21C6':'lrarr','\u21C7':'llarr','\u21C8':'uuarr','\u21C9':'rrarr','\u21CA':'ddarr','\u21CB':'lrhar','\u21CC':'rlhar','\u21D0':'lArr','\u21CD':'nlArr','\u21D1':'uArr','\u21D2':'rArr','\u21CF':'nrArr','\u21D3':'dArr','\u21D4':'iff','\u21CE':'nhArr','\u21D5':'vArr','\u21D6':'nwArr','\u21D7':'neArr','\u21D8':'seArr','\u21D9':'swArr','\u21DA':'lAarr','\u21DB':'rAarr','\u21DD':'zigrarr','\u21E4':'larrb','\u21E5':'rarrb','\u21F5':'duarr','\u21FD':'loarr','\u21FE':'roarr','\u21FF':'hoarr','\u2200':'forall','\u2201':'comp','\u2202':'part','\u2202\u0338':'npart','\u2203':'exist','\u2204':'nexist','\u2205':'empty','\u2207':'Del','\u2208':'in','\u2209':'notin','\u220B':'ni','\u220C':'notni','\u03F6':'bepsi','\u220F':'prod','\u2210':'coprod','\u2211':'sum','+':'plus','\xB1':'pm','\xF7':'div','\xD7':'times','<':'lt','\u226E':'nlt','<\u20D2':'nvlt','=':'equals','\u2260':'ne','=\u20E5':'bne','\u2A75':'Equal','>':'gt','\u226F':'ngt','>\u20D2':'nvgt','\xAC':'not','|':'vert','\xA6':'brvbar','\u2212':'minus','\u2213':'mp','\u2214':'plusdo','\u2044':'frasl','\u2216':'setmn','\u2217':'lowast','\u2218':'compfn','\u221A':'Sqrt','\u221D':'prop','\u221E':'infin','\u221F':'angrt','\u2220':'ang','\u2220\u20D2':'nang','\u2221':'angmsd','\u2222':'angsph','\u2223':'mid','\u2224':'nmid','\u2225':'par','\u2226':'npar','\u2227':'and','\u2228':'or','\u2229':'cap','\u2229\uFE00':'caps','\u222A':'cup','\u222A\uFE00':'cups','\u222B':'int','\u222C':'Int','\u222D':'tint','\u2A0C':'qint','\u222E':'oint','\u222F':'Conint','\u2230':'Cconint','\u2231':'cwint','\u2232':'cwconint','\u2233':'awconint','\u2234':'there4','\u2235':'becaus','\u2236':'ratio','\u2237':'Colon','\u2238':'minusd','\u223A':'mDDot','\u223B':'homtht','\u223C':'sim','\u2241':'nsim','\u223C\u20D2':'nvsim','\u223D':'bsim','\u223D\u0331':'race','\u223E':'ac','\u223E\u0333':'acE','\u223F':'acd','\u2240':'wr','\u2242':'esim','\u2242\u0338':'nesim','\u2243':'sime','\u2244':'nsime','\u2245':'cong','\u2247':'ncong','\u2246':'simne','\u2248':'ap','\u2249':'nap','\u224A':'ape','\u224B':'apid','\u224B\u0338':'napid','\u224C':'bcong','\u224D':'CupCap','\u226D':'NotCupCap','\u224D\u20D2':'nvap','\u224E':'bump','\u224E\u0338':'nbump','\u224F':'bumpe','\u224F\u0338':'nbumpe','\u2250':'doteq','\u2250\u0338':'nedot','\u2251':'eDot','\u2252':'efDot','\u2253':'erDot','\u2254':'colone','\u2255':'ecolon','\u2256':'ecir','\u2257':'cire','\u2259':'wedgeq','\u225A':'veeeq','\u225C':'trie','\u225F':'equest','\u2261':'equiv','\u2262':'nequiv','\u2261\u20E5':'bnequiv','\u2264':'le','\u2270':'nle','\u2264\u20D2':'nvle','\u2265':'ge','\u2271':'nge','\u2265\u20D2':'nvge','\u2266':'lE','\u2266\u0338':'nlE','\u2267':'gE','\u2267\u0338':'ngE','\u2268\uFE00':'lvnE','\u2268':'lnE','\u2269':'gnE','\u2269\uFE00':'gvnE','\u226A':'ll','\u226A\u0338':'nLtv','\u226A\u20D2':'nLt','\u226B':'gg','\u226B\u0338':'nGtv','\u226B\u20D2':'nGt','\u226C':'twixt','\u2272':'lsim','\u2274':'nlsim','\u2273':'gsim','\u2275':'ngsim','\u2276':'lg','\u2278':'ntlg','\u2277':'gl','\u2279':'ntgl','\u227A':'pr','\u2280':'npr','\u227B':'sc','\u2281':'nsc','\u227C':'prcue','\u22E0':'nprcue','\u227D':'sccue','\u22E1':'nsccue','\u227E':'prsim','\u227F':'scsim','\u227F\u0338':'NotSucceedsTilde','\u2282':'sub','\u2284':'nsub','\u2282\u20D2':'vnsub','\u2283':'sup','\u2285':'nsup','\u2283\u20D2':'vnsup','\u2286':'sube','\u2288':'nsube','\u2287':'supe','\u2289':'nsupe','\u228A\uFE00':'vsubne','\u228A':'subne','\u228B\uFE00':'vsupne','\u228B':'supne','\u228D':'cupdot','\u228E':'uplus','\u228F':'sqsub','\u228F\u0338':'NotSquareSubset','\u2290':'sqsup','\u2290\u0338':'NotSquareSuperset','\u2291':'sqsube','\u22E2':'nsqsube','\u2292':'sqsupe','\u22E3':'nsqsupe','\u2293':'sqcap','\u2293\uFE00':'sqcaps','\u2294':'sqcup','\u2294\uFE00':'sqcups','\u2295':'oplus','\u2296':'ominus','\u2297':'otimes','\u2298':'osol','\u2299':'odot','\u229A':'ocir','\u229B':'oast','\u229D':'odash','\u229E':'plusb','\u229F':'minusb','\u22A0':'timesb','\u22A1':'sdotb','\u22A2':'vdash','\u22AC':'nvdash','\u22A3':'dashv','\u22A4':'top','\u22A5':'bot','\u22A7':'models','\u22A8':'vDash','\u22AD':'nvDash','\u22A9':'Vdash','\u22AE':'nVdash','\u22AA':'Vvdash','\u22AB':'VDash','\u22AF':'nVDash','\u22B0':'prurel','\u22B2':'vltri','\u22EA':'nltri','\u22B3':'vrtri','\u22EB':'nrtri','\u22B4':'ltrie','\u22EC':'nltrie','\u22B4\u20D2':'nvltrie','\u22B5':'rtrie','\u22ED':'nrtrie','\u22B5\u20D2':'nvrtrie','\u22B6':'origof','\u22B7':'imof','\u22B8':'mumap','\u22B9':'hercon','\u22BA':'intcal','\u22BB':'veebar','\u22BD':'barvee','\u22BE':'angrtvb','\u22BF':'lrtri','\u22C0':'Wedge','\u22C1':'Vee','\u22C2':'xcap','\u22C3':'xcup','\u22C4':'diam','\u22C5':'sdot','\u22C6':'Star','\u22C7':'divonx','\u22C8':'bowtie','\u22C9':'ltimes','\u22CA':'rtimes','\u22CB':'lthree','\u22CC':'rthree','\u22CD':'bsime','\u22CE':'cuvee','\u22CF':'cuwed','\u22D0':'Sub','\u22D1':'Sup','\u22D2':'Cap','\u22D3':'Cup','\u22D4':'fork','\u22D5':'epar','\u22D6':'ltdot','\u22D7':'gtdot','\u22D8':'Ll','\u22D8\u0338':'nLl','\u22D9':'Gg','\u22D9\u0338':'nGg','\u22DA\uFE00':'lesg','\u22DA':'leg','\u22DB':'gel','\u22DB\uFE00':'gesl','\u22DE':'cuepr','\u22DF':'cuesc','\u22E6':'lnsim','\u22E7':'gnsim','\u22E8':'prnsim','\u22E9':'scnsim','\u22EE':'vellip','\u22EF':'ctdot','\u22F0':'utdot','\u22F1':'dtdot','\u22F2':'disin','\u22F3':'isinsv','\u22F4':'isins','\u22F5':'isindot','\u22F5\u0338':'notindot','\u22F6':'notinvc','\u22F7':'notinvb','\u22F9':'isinE','\u22F9\u0338':'notinE','\u22FA':'nisd','\u22FB':'xnis','\u22FC':'nis','\u22FD':'notnivc','\u22FE':'notnivb','\u2305':'barwed','\u2306':'Barwed','\u230C':'drcrop','\u230D':'dlcrop','\u230E':'urcrop','\u230F':'ulcrop','\u2310':'bnot','\u2312':'profline','\u2313':'profsurf','\u2315':'telrec','\u2316':'target','\u231C':'ulcorn','\u231D':'urcorn','\u231E':'dlcorn','\u231F':'drcorn','\u2322':'frown','\u2323':'smile','\u232D':'cylcty','\u232E':'profalar','\u2336':'topbot','\u233D':'ovbar','\u233F':'solbar','\u237C':'angzarr','\u23B0':'lmoust','\u23B1':'rmoust','\u23B4':'tbrk','\u23B5':'bbrk','\u23B6':'bbrktbrk','\u23DC':'OverParenthesis','\u23DD':'UnderParenthesis','\u23DE':'OverBrace','\u23DF':'UnderBrace','\u23E2':'trpezium','\u23E7':'elinters','\u2423':'blank','\u2500':'boxh','\u2502':'boxv','\u250C':'boxdr','\u2510':'boxdl','\u2514':'boxur','\u2518':'boxul','\u251C':'boxvr','\u2524':'boxvl','\u252C':'boxhd','\u2534':'boxhu','\u253C':'boxvh','\u2550':'boxH','\u2551':'boxV','\u2552':'boxdR','\u2553':'boxDr','\u2554':'boxDR','\u2555':'boxdL','\u2556':'boxDl','\u2557':'boxDL','\u2558':'boxuR','\u2559':'boxUr','\u255A':'boxUR','\u255B':'boxuL','\u255C':'boxUl','\u255D':'boxUL','\u255E':'boxvR','\u255F':'boxVr','\u2560':'boxVR','\u2561':'boxvL','\u2562':'boxVl','\u2563':'boxVL','\u2564':'boxHd','\u2565':'boxhD','\u2566':'boxHD','\u2567':'boxHu','\u2568':'boxhU','\u2569':'boxHU','\u256A':'boxvH','\u256B':'boxVh','\u256C':'boxVH','\u2580':'uhblk','\u2584':'lhblk','\u2588':'block','\u2591':'blk14','\u2592':'blk12','\u2593':'blk34','\u25A1':'squ','\u25AA':'squf','\u25AB':'EmptyVerySmallSquare','\u25AD':'rect','\u25AE':'marker','\u25B1':'fltns','\u25B3':'xutri','\u25B4':'utrif','\u25B5':'utri','\u25B8':'rtrif','\u25B9':'rtri','\u25BD':'xdtri','\u25BE':'dtrif','\u25BF':'dtri','\u25C2':'ltrif','\u25C3':'ltri','\u25CA':'loz','\u25CB':'cir','\u25EC':'tridot','\u25EF':'xcirc','\u25F8':'ultri','\u25F9':'urtri','\u25FA':'lltri','\u25FB':'EmptySmallSquare','\u25FC':'FilledSmallSquare','\u2605':'starf','\u2606':'star','\u260E':'phone','\u2640':'female','\u2642':'male','\u2660':'spades','\u2663':'clubs','\u2665':'hearts','\u2666':'diams','\u266A':'sung','\u2713':'check','\u2717':'cross','\u2720':'malt','\u2736':'sext','\u2758':'VerticalSeparator','\u27C8':'bsolhsub','\u27C9':'suphsol','\u27F5':'xlarr','\u27F6':'xrarr','\u27F7':'xharr','\u27F8':'xlArr','\u27F9':'xrArr','\u27FA':'xhArr','\u27FC':'xmap','\u27FF':'dzigrarr','\u2902':'nvlArr','\u2903':'nvrArr','\u2904':'nvHarr','\u2905':'Map','\u290C':'lbarr','\u290D':'rbarr','\u290E':'lBarr','\u290F':'rBarr','\u2910':'RBarr','\u2911':'DDotrahd','\u2912':'UpArrowBar','\u2913':'DownArrowBar','\u2916':'Rarrtl','\u2919':'latail','\u291A':'ratail','\u291B':'lAtail','\u291C':'rAtail','\u291D':'larrfs','\u291E':'rarrfs','\u291F':'larrbfs','\u2920':'rarrbfs','\u2923':'nwarhk','\u2924':'nearhk','\u2925':'searhk','\u2926':'swarhk','\u2927':'nwnear','\u2928':'toea','\u2929':'tosa','\u292A':'swnwar','\u2933':'rarrc','\u2933\u0338':'nrarrc','\u2935':'cudarrr','\u2936':'ldca','\u2937':'rdca','\u2938':'cudarrl','\u2939':'larrpl','\u293C':'curarrm','\u293D':'cularrp','\u2945':'rarrpl','\u2948':'harrcir','\u2949':'Uarrocir','\u294A':'lurdshar','\u294B':'ldrushar','\u294E':'LeftRightVector','\u294F':'RightUpDownVector','\u2950':'DownLeftRightVector','\u2951':'LeftUpDownVector','\u2952':'LeftVectorBar','\u2953':'RightVectorBar','\u2954':'RightUpVectorBar','\u2955':'RightDownVectorBar','\u2956':'DownLeftVectorBar','\u2957':'DownRightVectorBar','\u2958':'LeftUpVectorBar','\u2959':'LeftDownVectorBar','\u295A':'LeftTeeVector','\u295B':'RightTeeVector','\u295C':'RightUpTeeVector','\u295D':'RightDownTeeVector','\u295E':'DownLeftTeeVector','\u295F':'DownRightTeeVector','\u2960':'LeftUpTeeVector','\u2961':'LeftDownTeeVector','\u2962':'lHar','\u2963':'uHar','\u2964':'rHar','\u2965':'dHar','\u2966':'luruhar','\u2967':'ldrdhar','\u2968':'ruluhar','\u2969':'rdldhar','\u296A':'lharul','\u296B':'llhard','\u296C':'rharul','\u296D':'lrhard','\u296E':'udhar','\u296F':'duhar','\u2970':'RoundImplies','\u2971':'erarr','\u2972':'simrarr','\u2973':'larrsim','\u2974':'rarrsim','\u2975':'rarrap','\u2976':'ltlarr','\u2978':'gtrarr','\u2979':'subrarr','\u297B':'suplarr','\u297C':'lfisht','\u297D':'rfisht','\u297E':'ufisht','\u297F':'dfisht','\u299A':'vzigzag','\u299C':'vangrt','\u299D':'angrtvbd','\u29A4':'ange','\u29A5':'range','\u29A6':'dwangle','\u29A7':'uwangle','\u29A8':'angmsdaa','\u29A9':'angmsdab','\u29AA':'angmsdac','\u29AB':'angmsdad','\u29AC':'angmsdae','\u29AD':'angmsdaf','\u29AE':'angmsdag','\u29AF':'angmsdah','\u29B0':'bemptyv','\u29B1':'demptyv','\u29B2':'cemptyv','\u29B3':'raemptyv','\u29B4':'laemptyv','\u29B5':'ohbar','\u29B6':'omid','\u29B7':'opar','\u29B9':'operp','\u29BB':'olcross','\u29BC':'odsold','\u29BE':'olcir','\u29BF':'ofcir','\u29C0':'olt','\u29C1':'ogt','\u29C2':'cirscir','\u29C3':'cirE','\u29C4':'solb','\u29C5':'bsolb','\u29C9':'boxbox','\u29CD':'trisb','\u29CE':'rtriltri','\u29CF':'LeftTriangleBar','\u29CF\u0338':'NotLeftTriangleBar','\u29D0':'RightTriangleBar','\u29D0\u0338':'NotRightTriangleBar','\u29DC':'iinfin','\u29DD':'infintie','\u29DE':'nvinfin','\u29E3':'eparsl','\u29E4':'smeparsl','\u29E5':'eqvparsl','\u29EB':'lozf','\u29F4':'RuleDelayed','\u29F6':'dsol','\u2A00':'xodot','\u2A01':'xoplus','\u2A02':'xotime','\u2A04':'xuplus','\u2A06':'xsqcup','\u2A0D':'fpartint','\u2A10':'cirfnint','\u2A11':'awint','\u2A12':'rppolint','\u2A13':'scpolint','\u2A14':'npolint','\u2A15':'pointint','\u2A16':'quatint','\u2A17':'intlarhk','\u2A22':'pluscir','\u2A23':'plusacir','\u2A24':'simplus','\u2A25':'plusdu','\u2A26':'plussim','\u2A27':'plustwo','\u2A29':'mcomma','\u2A2A':'minusdu','\u2A2D':'loplus','\u2A2E':'roplus','\u2A2F':'Cross','\u2A30':'timesd','\u2A31':'timesbar','\u2A33':'smashp','\u2A34':'lotimes','\u2A35':'rotimes','\u2A36':'otimesas','\u2A37':'Otimes','\u2A38':'odiv','\u2A39':'triplus','\u2A3A':'triminus','\u2A3B':'tritime','\u2A3C':'iprod','\u2A3F':'amalg','\u2A40':'capdot','\u2A42':'ncup','\u2A43':'ncap','\u2A44':'capand','\u2A45':'cupor','\u2A46':'cupcap','\u2A47':'capcup','\u2A48':'cupbrcap','\u2A49':'capbrcup','\u2A4A':'cupcup','\u2A4B':'capcap','\u2A4C':'ccups','\u2A4D':'ccaps','\u2A50':'ccupssm','\u2A53':'And','\u2A54':'Or','\u2A55':'andand','\u2A56':'oror','\u2A57':'orslope','\u2A58':'andslope','\u2A5A':'andv','\u2A5B':'orv','\u2A5C':'andd','\u2A5D':'ord','\u2A5F':'wedbar','\u2A66':'sdote','\u2A6A':'simdot','\u2A6D':'congdot','\u2A6D\u0338':'ncongdot','\u2A6E':'easter','\u2A6F':'apacir','\u2A70':'apE','\u2A70\u0338':'napE','\u2A71':'eplus','\u2A72':'pluse','\u2A73':'Esim','\u2A77':'eDDot','\u2A78':'equivDD','\u2A79':'ltcir','\u2A7A':'gtcir','\u2A7B':'ltquest','\u2A7C':'gtquest','\u2A7D':'les','\u2A7D\u0338':'nles','\u2A7E':'ges','\u2A7E\u0338':'nges','\u2A7F':'lesdot','\u2A80':'gesdot','\u2A81':'lesdoto','\u2A82':'gesdoto','\u2A83':'lesdotor','\u2A84':'gesdotol','\u2A85':'lap','\u2A86':'gap','\u2A87':'lne','\u2A88':'gne','\u2A89':'lnap','\u2A8A':'gnap','\u2A8B':'lEg','\u2A8C':'gEl','\u2A8D':'lsime','\u2A8E':'gsime','\u2A8F':'lsimg','\u2A90':'gsiml','\u2A91':'lgE','\u2A92':'glE','\u2A93':'lesges','\u2A94':'gesles','\u2A95':'els','\u2A96':'egs','\u2A97':'elsdot','\u2A98':'egsdot','\u2A99':'el','\u2A9A':'eg','\u2A9D':'siml','\u2A9E':'simg','\u2A9F':'simlE','\u2AA0':'simgE','\u2AA1':'LessLess','\u2AA1\u0338':'NotNestedLessLess','\u2AA2':'GreaterGreater','\u2AA2\u0338':'NotNestedGreaterGreater','\u2AA4':'glj','\u2AA5':'gla','\u2AA6':'ltcc','\u2AA7':'gtcc','\u2AA8':'lescc','\u2AA9':'gescc','\u2AAA':'smt','\u2AAB':'lat','\u2AAC':'smte','\u2AAC\uFE00':'smtes','\u2AAD':'late','\u2AAD\uFE00':'lates','\u2AAE':'bumpE','\u2AAF':'pre','\u2AAF\u0338':'npre','\u2AB0':'sce','\u2AB0\u0338':'nsce','\u2AB3':'prE','\u2AB4':'scE','\u2AB5':'prnE','\u2AB6':'scnE','\u2AB7':'prap','\u2AB8':'scap','\u2AB9':'prnap','\u2ABA':'scnap','\u2ABB':'Pr','\u2ABC':'Sc','\u2ABD':'subdot','\u2ABE':'supdot','\u2ABF':'subplus','\u2AC0':'supplus','\u2AC1':'submult','\u2AC2':'supmult','\u2AC3':'subedot','\u2AC4':'supedot','\u2AC5':'subE','\u2AC5\u0338':'nsubE','\u2AC6':'supE','\u2AC6\u0338':'nsupE','\u2AC7':'subsim','\u2AC8':'supsim','\u2ACB\uFE00':'vsubnE','\u2ACB':'subnE','\u2ACC\uFE00':'vsupnE','\u2ACC':'supnE','\u2ACF':'csub','\u2AD0':'csup','\u2AD1':'csube','\u2AD2':'csupe','\u2AD3':'subsup','\u2AD4':'supsub','\u2AD5':'subsub','\u2AD6':'supsup','\u2AD7':'suphsub','\u2AD8':'supdsub','\u2AD9':'forkv','\u2ADA':'topfork','\u2ADB':'mlcp','\u2AE4':'Dashv','\u2AE6':'Vdashl','\u2AE7':'Barv','\u2AE8':'vBar','\u2AE9':'vBarv','\u2AEB':'Vbar','\u2AEC':'Not','\u2AED':'bNot','\u2AEE':'rnmid','\u2AEF':'cirmid','\u2AF0':'midcir','\u2AF1':'topcir','\u2AF2':'nhpar','\u2AF3':'parsim','\u2AFD':'parsl','\u2AFD\u20E5':'nparsl','\u266D':'flat','\u266E':'natur','\u266F':'sharp','\xA4':'curren','\xA2':'cent','$':'dollar','\xA3':'pound','\xA5':'yen','\u20AC':'euro','\xB9':'sup1','\xBD':'half','\u2153':'frac13','\xBC':'frac14','\u2155':'frac15','\u2159':'frac16','\u215B':'frac18','\xB2':'sup2','\u2154':'frac23','\u2156':'frac25','\xB3':'sup3','\xBE':'frac34','\u2157':'frac35','\u215C':'frac38','\u2158':'frac45','\u215A':'frac56','\u215D':'frac58','\u215E':'frac78','\uD835\uDCB6':'ascr','\uD835\uDD52':'aopf','\uD835\uDD1E':'afr','\uD835\uDD38':'Aopf','\uD835\uDD04':'Afr','\uD835\uDC9C':'Ascr','\xAA':'ordf','\xE1':'aacute','\xC1':'Aacute','\xE0':'agrave','\xC0':'Agrave','\u0103':'abreve','\u0102':'Abreve','\xE2':'acirc','\xC2':'Acirc','\xE5':'aring','\xC5':'angst','\xE4':'auml','\xC4':'Auml','\xE3':'atilde','\xC3':'Atilde','\u0105':'aogon','\u0104':'Aogon','\u0101':'amacr','\u0100':'Amacr','\xE6':'aelig','\xC6':'AElig','\uD835\uDCB7':'bscr','\uD835\uDD53':'bopf','\uD835\uDD1F':'bfr','\uD835\uDD39':'Bopf','\u212C':'Bscr','\uD835\uDD05':'Bfr','\uD835\uDD20':'cfr','\uD835\uDCB8':'cscr','\uD835\uDD54':'copf','\u212D':'Cfr','\uD835\uDC9E':'Cscr','\u2102':'Copf','\u0107':'cacute','\u0106':'Cacute','\u0109':'ccirc','\u0108':'Ccirc','\u010D':'ccaron','\u010C':'Ccaron','\u010B':'cdot','\u010A':'Cdot','\xE7':'ccedil','\xC7':'Ccedil','\u2105':'incare','\uD835\uDD21':'dfr','\u2146':'dd','\uD835\uDD55':'dopf','\uD835\uDCB9':'dscr','\uD835\uDC9F':'Dscr','\uD835\uDD07':'Dfr','\u2145':'DD','\uD835\uDD3B':'Dopf','\u010F':'dcaron','\u010E':'Dcaron','\u0111':'dstrok','\u0110':'Dstrok','\xF0':'eth','\xD0':'ETH','\u2147':'ee','\u212F':'escr','\uD835\uDD22':'efr','\uD835\uDD56':'eopf','\u2130':'Escr','\uD835\uDD08':'Efr','\uD835\uDD3C':'Eopf','\xE9':'eacute','\xC9':'Eacute','\xE8':'egrave','\xC8':'Egrave','\xEA':'ecirc','\xCA':'Ecirc','\u011B':'ecaron','\u011A':'Ecaron','\xEB':'euml','\xCB':'Euml','\u0117':'edot','\u0116':'Edot','\u0119':'eogon','\u0118':'Eogon','\u0113':'emacr','\u0112':'Emacr','\uD835\uDD23':'ffr','\uD835\uDD57':'fopf','\uD835\uDCBB':'fscr','\uD835\uDD09':'Ffr','\uD835\uDD3D':'Fopf','\u2131':'Fscr','\uFB00':'fflig','\uFB03':'ffilig','\uFB04':'ffllig','\uFB01':'filig','fj':'fjlig','\uFB02':'fllig','\u0192':'fnof','\u210A':'gscr','\uD835\uDD58':'gopf','\uD835\uDD24':'gfr','\uD835\uDCA2':'Gscr','\uD835\uDD3E':'Gopf','\uD835\uDD0A':'Gfr','\u01F5':'gacute','\u011F':'gbreve','\u011E':'Gbreve','\u011D':'gcirc','\u011C':'Gcirc','\u0121':'gdot','\u0120':'Gdot','\u0122':'Gcedil','\uD835\uDD25':'hfr','\u210E':'planckh','\uD835\uDCBD':'hscr','\uD835\uDD59':'hopf','\u210B':'Hscr','\u210C':'Hfr','\u210D':'Hopf','\u0125':'hcirc','\u0124':'Hcirc','\u210F':'hbar','\u0127':'hstrok','\u0126':'Hstrok','\uD835\uDD5A':'iopf','\uD835\uDD26':'ifr','\uD835\uDCBE':'iscr','\u2148':'ii','\uD835\uDD40':'Iopf','\u2110':'Iscr','\u2111':'Im','\xED':'iacute','\xCD':'Iacute','\xEC':'igrave','\xCC':'Igrave','\xEE':'icirc','\xCE':'Icirc','\xEF':'iuml','\xCF':'Iuml','\u0129':'itilde','\u0128':'Itilde','\u0130':'Idot','\u012F':'iogon','\u012E':'Iogon','\u012B':'imacr','\u012A':'Imacr','\u0133':'ijlig','\u0132':'IJlig','\u0131':'imath','\uD835\uDCBF':'jscr','\uD835\uDD5B':'jopf','\uD835\uDD27':'jfr','\uD835\uDCA5':'Jscr','\uD835\uDD0D':'Jfr','\uD835\uDD41':'Jopf','\u0135':'jcirc','\u0134':'Jcirc','\u0237':'jmath','\uD835\uDD5C':'kopf','\uD835\uDCC0':'kscr','\uD835\uDD28':'kfr','\uD835\uDCA6':'Kscr','\uD835\uDD42':'Kopf','\uD835\uDD0E':'Kfr','\u0137':'kcedil','\u0136':'Kcedil','\uD835\uDD29':'lfr','\uD835\uDCC1':'lscr','\u2113':'ell','\uD835\uDD5D':'lopf','\u2112':'Lscr','\uD835\uDD0F':'Lfr','\uD835\uDD43':'Lopf','\u013A':'lacute','\u0139':'Lacute','\u013E':'lcaron','\u013D':'Lcaron','\u013C':'lcedil','\u013B':'Lcedil','\u0142':'lstrok','\u0141':'Lstrok','\u0140':'lmidot','\u013F':'Lmidot','\uD835\uDD2A':'mfr','\uD835\uDD5E':'mopf','\uD835\uDCC2':'mscr','\uD835\uDD10':'Mfr','\uD835\uDD44':'Mopf','\u2133':'Mscr','\uD835\uDD2B':'nfr','\uD835\uDD5F':'nopf','\uD835\uDCC3':'nscr','\u2115':'Nopf','\uD835\uDCA9':'Nscr','\uD835\uDD11':'Nfr','\u0144':'nacute','\u0143':'Nacute','\u0148':'ncaron','\u0147':'Ncaron','\xF1':'ntilde','\xD1':'Ntilde','\u0146':'ncedil','\u0145':'Ncedil','\u2116':'numero','\u014B':'eng','\u014A':'ENG','\uD835\uDD60':'oopf','\uD835\uDD2C':'ofr','\u2134':'oscr','\uD835\uDCAA':'Oscr','\uD835\uDD12':'Ofr','\uD835\uDD46':'Oopf','\xBA':'ordm','\xF3':'oacute','\xD3':'Oacute','\xF2':'ograve','\xD2':'Ograve','\xF4':'ocirc','\xD4':'Ocirc','\xF6':'ouml','\xD6':'Ouml','\u0151':'odblac','\u0150':'Odblac','\xF5':'otilde','\xD5':'Otilde','\xF8':'oslash','\xD8':'Oslash','\u014D':'omacr','\u014C':'Omacr','\u0153':'oelig','\u0152':'OElig','\uD835\uDD2D':'pfr','\uD835\uDCC5':'pscr','\uD835\uDD61':'popf','\u2119':'Popf','\uD835\uDD13':'Pfr','\uD835\uDCAB':'Pscr','\uD835\uDD62':'qopf','\uD835\uDD2E':'qfr','\uD835\uDCC6':'qscr','\uD835\uDCAC':'Qscr','\uD835\uDD14':'Qfr','\u211A':'Qopf','\u0138':'kgreen','\uD835\uDD2F':'rfr','\uD835\uDD63':'ropf','\uD835\uDCC7':'rscr','\u211B':'Rscr','\u211C':'Re','\u211D':'Ropf','\u0155':'racute','\u0154':'Racute','\u0159':'rcaron','\u0158':'Rcaron','\u0157':'rcedil','\u0156':'Rcedil','\uD835\uDD64':'sopf','\uD835\uDCC8':'sscr','\uD835\uDD30':'sfr','\uD835\uDD4A':'Sopf','\uD835\uDD16':'Sfr','\uD835\uDCAE':'Sscr','\u24C8':'oS','\u015B':'sacute','\u015A':'Sacute','\u015D':'scirc','\u015C':'Scirc','\u0161':'scaron','\u0160':'Scaron','\u015F':'scedil','\u015E':'Scedil','\xDF':'szlig','\uD835\uDD31':'tfr','\uD835\uDCC9':'tscr','\uD835\uDD65':'topf','\uD835\uDCAF':'Tscr','\uD835\uDD17':'Tfr','\uD835\uDD4B':'Topf','\u0165':'tcaron','\u0164':'Tcaron','\u0163':'tcedil','\u0162':'Tcedil','\u2122':'trade','\u0167':'tstrok','\u0166':'Tstrok','\uD835\uDCCA':'uscr','\uD835\uDD66':'uopf','\uD835\uDD32':'ufr','\uD835\uDD4C':'Uopf','\uD835\uDD18':'Ufr','\uD835\uDCB0':'Uscr','\xFA':'uacute','\xDA':'Uacute','\xF9':'ugrave','\xD9':'Ugrave','\u016D':'ubreve','\u016C':'Ubreve','\xFB':'ucirc','\xDB':'Ucirc','\u016F':'uring','\u016E':'Uring','\xFC':'uuml','\xDC':'Uuml','\u0171':'udblac','\u0170':'Udblac','\u0169':'utilde','\u0168':'Utilde','\u0173':'uogon','\u0172':'Uogon','\u016B':'umacr','\u016A':'Umacr','\uD835\uDD33':'vfr','\uD835\uDD67':'vopf','\uD835\uDCCB':'vscr','\uD835\uDD19':'Vfr','\uD835\uDD4D':'Vopf','\uD835\uDCB1':'Vscr','\uD835\uDD68':'wopf','\uD835\uDCCC':'wscr','\uD835\uDD34':'wfr','\uD835\uDCB2':'Wscr','\uD835\uDD4E':'Wopf','\uD835\uDD1A':'Wfr','\u0175':'wcirc','\u0174':'Wcirc','\uD835\uDD35':'xfr','\uD835\uDCCD':'xscr','\uD835\uDD69':'xopf','\uD835\uDD4F':'Xopf','\uD835\uDD1B':'Xfr','\uD835\uDCB3':'Xscr','\uD835\uDD36':'yfr','\uD835\uDCCE':'yscr','\uD835\uDD6A':'yopf','\uD835\uDCB4':'Yscr','\uD835\uDD1C':'Yfr','\uD835\uDD50':'Yopf','\xFD':'yacute','\xDD':'Yacute','\u0177':'ycirc','\u0176':'Ycirc','\xFF':'yuml','\u0178':'Yuml','\uD835\uDCCF':'zscr','\uD835\uDD37':'zfr','\uD835\uDD6B':'zopf','\u2128':'Zfr','\u2124':'Zopf','\uD835\uDCB5':'Zscr','\u017A':'zacute','\u0179':'Zacute','\u017E':'zcaron','\u017D':'Zcaron','\u017C':'zdot','\u017B':'Zdot','\u01B5':'imped','\xFE':'thorn','\xDE':'THORN','\u0149':'napos','\u03B1':'alpha','\u0391':'Alpha','\u03B2':'beta','\u0392':'Beta','\u03B3':'gamma','\u0393':'Gamma','\u03B4':'delta','\u0394':'Delta','\u03B5':'epsi','\u03F5':'epsiv','\u0395':'Epsilon','\u03DD':'gammad','\u03DC':'Gammad','\u03B6':'zeta','\u0396':'Zeta','\u03B7':'eta','\u0397':'Eta','\u03B8':'theta','\u03D1':'thetav','\u0398':'Theta','\u03B9':'iota','\u0399':'Iota','\u03BA':'kappa','\u03F0':'kappav','\u039A':'Kappa','\u03BB':'lambda','\u039B':'Lambda','\u03BC':'mu','\xB5':'micro','\u039C':'Mu','\u03BD':'nu','\u039D':'Nu','\u03BE':'xi','\u039E':'Xi','\u03BF':'omicron','\u039F':'Omicron','\u03C0':'pi','\u03D6':'piv','\u03A0':'Pi','\u03C1':'rho','\u03F1':'rhov','\u03A1':'Rho','\u03C3':'sigma','\u03A3':'Sigma','\u03C2':'sigmaf','\u03C4':'tau','\u03A4':'Tau','\u03C5':'upsi','\u03A5':'Upsilon','\u03D2':'Upsi','\u03C6':'phi','\u03D5':'phiv','\u03A6':'Phi','\u03C7':'chi','\u03A7':'Chi','\u03C8':'psi','\u03A8':'Psi','\u03C9':'omega','\u03A9':'ohm','\u0430':'acy','\u0410':'Acy','\u0431':'bcy','\u0411':'Bcy','\u0432':'vcy','\u0412':'Vcy','\u0433':'gcy','\u0413':'Gcy','\u0453':'gjcy','\u0403':'GJcy','\u0434':'dcy','\u0414':'Dcy','\u0452':'djcy','\u0402':'DJcy','\u0435':'iecy','\u0415':'IEcy','\u0451':'iocy','\u0401':'IOcy','\u0454':'jukcy','\u0404':'Jukcy','\u0436':'zhcy','\u0416':'ZHcy','\u0437':'zcy','\u0417':'Zcy','\u0455':'dscy','\u0405':'DScy','\u0438':'icy','\u0418':'Icy','\u0456':'iukcy','\u0406':'Iukcy','\u0457':'yicy','\u0407':'YIcy','\u0439':'jcy','\u0419':'Jcy','\u0458':'jsercy','\u0408':'Jsercy','\u043A':'kcy','\u041A':'Kcy','\u045C':'kjcy','\u040C':'KJcy','\u043B':'lcy','\u041B':'Lcy','\u0459':'ljcy','\u0409':'LJcy','\u043C':'mcy','\u041C':'Mcy','\u043D':'ncy','\u041D':'Ncy','\u045A':'njcy','\u040A':'NJcy','\u043E':'ocy','\u041E':'Ocy','\u043F':'pcy','\u041F':'Pcy','\u0440':'rcy','\u0420':'Rcy','\u0441':'scy','\u0421':'Scy','\u0442':'tcy','\u0422':'Tcy','\u045B':'tshcy','\u040B':'TSHcy','\u0443':'ucy','\u0423':'Ucy','\u045E':'ubrcy','\u040E':'Ubrcy','\u0444':'fcy','\u0424':'Fcy','\u0445':'khcy','\u0425':'KHcy','\u0446':'tscy','\u0426':'TScy','\u0447':'chcy','\u0427':'CHcy','\u045F':'dzcy','\u040F':'DZcy','\u0448':'shcy','\u0428':'SHcy','\u0449':'shchcy','\u0429':'SHCHcy','\u044A':'hardcy','\u042A':'HARDcy','\u044B':'ycy','\u042B':'Ycy','\u044C':'softcy','\u042C':'SOFTcy','\u044D':'ecy','\u042D':'Ecy','\u044E':'yucy','\u042E':'YUcy','\u044F':'yacy','\u042F':'YAcy','\u2135':'aleph','\u2136':'beth','\u2137':'gimel','\u2138':'daleth'};

	var regexEscape = /["&'<>`]/g;
	var escapeMap = {
		'"': '&quot;',
		'&': '&amp;',
		'\'': '&#x27;',
		'<': '&lt;',
		// See https://mathiasbynens.be/notes/ambiguous-ampersands: in HTML, the
		// following is not strictly necessary unless it’s part of a tag or an
		// unquoted attribute value. We’re only escaping it to support those
		// situations, and for XML support.
		'>': '&gt;',
		// In Internet Explorer ≤ 8, the backtick character can be used
		// to break out of (un)quoted attribute values or HTML comments.
		// See http://html5sec.org/#102, http://html5sec.org/#108, and
		// http://html5sec.org/#133.
		'`': '&#x60;'
	};

	var regexInvalidEntity = /&#(?:[xX][^a-fA-F0-9]|[^0-9xX])/;
	var regexInvalidRawCodePoint = /[\0-\x08\x0B\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]|[\uD83F\uD87F\uD8BF\uD8FF\uD93F\uD97F\uD9BF\uD9FF\uDA3F\uDA7F\uDABF\uDAFF\uDB3F\uDB7F\uDBBF\uDBFF][\uDFFE\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
	var regexDecode = /&#([0-9]+)(;?)|&#[xX]([a-fA-F0-9]+)(;?)|&([0-9a-zA-Z]+);|&(Aacute|Agrave|Atilde|Ccedil|Eacute|Egrave|Iacute|Igrave|Ntilde|Oacute|Ograve|Oslash|Otilde|Uacute|Ugrave|Yacute|aacute|agrave|atilde|brvbar|ccedil|curren|divide|eacute|egrave|frac12|frac14|frac34|iacute|igrave|iquest|middot|ntilde|oacute|ograve|oslash|otilde|plusmn|uacute|ugrave|yacute|AElig|Acirc|Aring|Ecirc|Icirc|Ocirc|THORN|Ucirc|acirc|acute|aelig|aring|cedil|ecirc|icirc|iexcl|laquo|micro|ocirc|pound|raquo|szlig|thorn|times|ucirc|Auml|COPY|Euml|Iuml|Ouml|QUOT|Uuml|auml|cent|copy|euml|iuml|macr|nbsp|ordf|ordm|ouml|para|quot|sect|sup1|sup2|sup3|uuml|yuml|AMP|ETH|REG|amp|deg|eth|not|reg|shy|uml|yen|GT|LT|gt|lt)([=a-zA-Z0-9])?/g;
	var decodeMap = {'aacute':'\xE1','Aacute':'\xC1','abreve':'\u0103','Abreve':'\u0102','ac':'\u223E','acd':'\u223F','acE':'\u223E\u0333','acirc':'\xE2','Acirc':'\xC2','acute':'\xB4','acy':'\u0430','Acy':'\u0410','aelig':'\xE6','AElig':'\xC6','af':'\u2061','afr':'\uD835\uDD1E','Afr':'\uD835\uDD04','agrave':'\xE0','Agrave':'\xC0','alefsym':'\u2135','aleph':'\u2135','alpha':'\u03B1','Alpha':'\u0391','amacr':'\u0101','Amacr':'\u0100','amalg':'\u2A3F','amp':'&','AMP':'&','and':'\u2227','And':'\u2A53','andand':'\u2A55','andd':'\u2A5C','andslope':'\u2A58','andv':'\u2A5A','ang':'\u2220','ange':'\u29A4','angle':'\u2220','angmsd':'\u2221','angmsdaa':'\u29A8','angmsdab':'\u29A9','angmsdac':'\u29AA','angmsdad':'\u29AB','angmsdae':'\u29AC','angmsdaf':'\u29AD','angmsdag':'\u29AE','angmsdah':'\u29AF','angrt':'\u221F','angrtvb':'\u22BE','angrtvbd':'\u299D','angsph':'\u2222','angst':'\xC5','angzarr':'\u237C','aogon':'\u0105','Aogon':'\u0104','aopf':'\uD835\uDD52','Aopf':'\uD835\uDD38','ap':'\u2248','apacir':'\u2A6F','ape':'\u224A','apE':'\u2A70','apid':'\u224B','apos':'\'','ApplyFunction':'\u2061','approx':'\u2248','approxeq':'\u224A','aring':'\xE5','Aring':'\xC5','ascr':'\uD835\uDCB6','Ascr':'\uD835\uDC9C','Assign':'\u2254','ast':'*','asymp':'\u2248','asympeq':'\u224D','atilde':'\xE3','Atilde':'\xC3','auml':'\xE4','Auml':'\xC4','awconint':'\u2233','awint':'\u2A11','backcong':'\u224C','backepsilon':'\u03F6','backprime':'\u2035','backsim':'\u223D','backsimeq':'\u22CD','Backslash':'\u2216','Barv':'\u2AE7','barvee':'\u22BD','barwed':'\u2305','Barwed':'\u2306','barwedge':'\u2305','bbrk':'\u23B5','bbrktbrk':'\u23B6','bcong':'\u224C','bcy':'\u0431','Bcy':'\u0411','bdquo':'\u201E','becaus':'\u2235','because':'\u2235','Because':'\u2235','bemptyv':'\u29B0','bepsi':'\u03F6','bernou':'\u212C','Bernoullis':'\u212C','beta':'\u03B2','Beta':'\u0392','beth':'\u2136','between':'\u226C','bfr':'\uD835\uDD1F','Bfr':'\uD835\uDD05','bigcap':'\u22C2','bigcirc':'\u25EF','bigcup':'\u22C3','bigodot':'\u2A00','bigoplus':'\u2A01','bigotimes':'\u2A02','bigsqcup':'\u2A06','bigstar':'\u2605','bigtriangledown':'\u25BD','bigtriangleup':'\u25B3','biguplus':'\u2A04','bigvee':'\u22C1','bigwedge':'\u22C0','bkarow':'\u290D','blacklozenge':'\u29EB','blacksquare':'\u25AA','blacktriangle':'\u25B4','blacktriangledown':'\u25BE','blacktriangleleft':'\u25C2','blacktriangleright':'\u25B8','blank':'\u2423','blk12':'\u2592','blk14':'\u2591','blk34':'\u2593','block':'\u2588','bne':'=\u20E5','bnequiv':'\u2261\u20E5','bnot':'\u2310','bNot':'\u2AED','bopf':'\uD835\uDD53','Bopf':'\uD835\uDD39','bot':'\u22A5','bottom':'\u22A5','bowtie':'\u22C8','boxbox':'\u29C9','boxdl':'\u2510','boxdL':'\u2555','boxDl':'\u2556','boxDL':'\u2557','boxdr':'\u250C','boxdR':'\u2552','boxDr':'\u2553','boxDR':'\u2554','boxh':'\u2500','boxH':'\u2550','boxhd':'\u252C','boxhD':'\u2565','boxHd':'\u2564','boxHD':'\u2566','boxhu':'\u2534','boxhU':'\u2568','boxHu':'\u2567','boxHU':'\u2569','boxminus':'\u229F','boxplus':'\u229E','boxtimes':'\u22A0','boxul':'\u2518','boxuL':'\u255B','boxUl':'\u255C','boxUL':'\u255D','boxur':'\u2514','boxuR':'\u2558','boxUr':'\u2559','boxUR':'\u255A','boxv':'\u2502','boxV':'\u2551','boxvh':'\u253C','boxvH':'\u256A','boxVh':'\u256B','boxVH':'\u256C','boxvl':'\u2524','boxvL':'\u2561','boxVl':'\u2562','boxVL':'\u2563','boxvr':'\u251C','boxvR':'\u255E','boxVr':'\u255F','boxVR':'\u2560','bprime':'\u2035','breve':'\u02D8','Breve':'\u02D8','brvbar':'\xA6','bscr':'\uD835\uDCB7','Bscr':'\u212C','bsemi':'\u204F','bsim':'\u223D','bsime':'\u22CD','bsol':'\\','bsolb':'\u29C5','bsolhsub':'\u27C8','bull':'\u2022','bullet':'\u2022','bump':'\u224E','bumpe':'\u224F','bumpE':'\u2AAE','bumpeq':'\u224F','Bumpeq':'\u224E','cacute':'\u0107','Cacute':'\u0106','cap':'\u2229','Cap':'\u22D2','capand':'\u2A44','capbrcup':'\u2A49','capcap':'\u2A4B','capcup':'\u2A47','capdot':'\u2A40','CapitalDifferentialD':'\u2145','caps':'\u2229\uFE00','caret':'\u2041','caron':'\u02C7','Cayleys':'\u212D','ccaps':'\u2A4D','ccaron':'\u010D','Ccaron':'\u010C','ccedil':'\xE7','Ccedil':'\xC7','ccirc':'\u0109','Ccirc':'\u0108','Cconint':'\u2230','ccups':'\u2A4C','ccupssm':'\u2A50','cdot':'\u010B','Cdot':'\u010A','cedil':'\xB8','Cedilla':'\xB8','cemptyv':'\u29B2','cent':'\xA2','centerdot':'\xB7','CenterDot':'\xB7','cfr':'\uD835\uDD20','Cfr':'\u212D','chcy':'\u0447','CHcy':'\u0427','check':'\u2713','checkmark':'\u2713','chi':'\u03C7','Chi':'\u03A7','cir':'\u25CB','circ':'\u02C6','circeq':'\u2257','circlearrowleft':'\u21BA','circlearrowright':'\u21BB','circledast':'\u229B','circledcirc':'\u229A','circleddash':'\u229D','CircleDot':'\u2299','circledR':'\xAE','circledS':'\u24C8','CircleMinus':'\u2296','CirclePlus':'\u2295','CircleTimes':'\u2297','cire':'\u2257','cirE':'\u29C3','cirfnint':'\u2A10','cirmid':'\u2AEF','cirscir':'\u29C2','ClockwiseContourIntegral':'\u2232','CloseCurlyDoubleQuote':'\u201D','CloseCurlyQuote':'\u2019','clubs':'\u2663','clubsuit':'\u2663','colon':':','Colon':'\u2237','colone':'\u2254','Colone':'\u2A74','coloneq':'\u2254','comma':',','commat':'@','comp':'\u2201','compfn':'\u2218','complement':'\u2201','complexes':'\u2102','cong':'\u2245','congdot':'\u2A6D','Congruent':'\u2261','conint':'\u222E','Conint':'\u222F','ContourIntegral':'\u222E','copf':'\uD835\uDD54','Copf':'\u2102','coprod':'\u2210','Coproduct':'\u2210','copy':'\xA9','COPY':'\xA9','copysr':'\u2117','CounterClockwiseContourIntegral':'\u2233','crarr':'\u21B5','cross':'\u2717','Cross':'\u2A2F','cscr':'\uD835\uDCB8','Cscr':'\uD835\uDC9E','csub':'\u2ACF','csube':'\u2AD1','csup':'\u2AD0','csupe':'\u2AD2','ctdot':'\u22EF','cudarrl':'\u2938','cudarrr':'\u2935','cuepr':'\u22DE','cuesc':'\u22DF','cularr':'\u21B6','cularrp':'\u293D','cup':'\u222A','Cup':'\u22D3','cupbrcap':'\u2A48','cupcap':'\u2A46','CupCap':'\u224D','cupcup':'\u2A4A','cupdot':'\u228D','cupor':'\u2A45','cups':'\u222A\uFE00','curarr':'\u21B7','curarrm':'\u293C','curlyeqprec':'\u22DE','curlyeqsucc':'\u22DF','curlyvee':'\u22CE','curlywedge':'\u22CF','curren':'\xA4','curvearrowleft':'\u21B6','curvearrowright':'\u21B7','cuvee':'\u22CE','cuwed':'\u22CF','cwconint':'\u2232','cwint':'\u2231','cylcty':'\u232D','dagger':'\u2020','Dagger':'\u2021','daleth':'\u2138','darr':'\u2193','dArr':'\u21D3','Darr':'\u21A1','dash':'\u2010','dashv':'\u22A3','Dashv':'\u2AE4','dbkarow':'\u290F','dblac':'\u02DD','dcaron':'\u010F','Dcaron':'\u010E','dcy':'\u0434','Dcy':'\u0414','dd':'\u2146','DD':'\u2145','ddagger':'\u2021','ddarr':'\u21CA','DDotrahd':'\u2911','ddotseq':'\u2A77','deg':'\xB0','Del':'\u2207','delta':'\u03B4','Delta':'\u0394','demptyv':'\u29B1','dfisht':'\u297F','dfr':'\uD835\uDD21','Dfr':'\uD835\uDD07','dHar':'\u2965','dharl':'\u21C3','dharr':'\u21C2','DiacriticalAcute':'\xB4','DiacriticalDot':'\u02D9','DiacriticalDoubleAcute':'\u02DD','DiacriticalGrave':'`','DiacriticalTilde':'\u02DC','diam':'\u22C4','diamond':'\u22C4','Diamond':'\u22C4','diamondsuit':'\u2666','diams':'\u2666','die':'\xA8','DifferentialD':'\u2146','digamma':'\u03DD','disin':'\u22F2','div':'\xF7','divide':'\xF7','divideontimes':'\u22C7','divonx':'\u22C7','djcy':'\u0452','DJcy':'\u0402','dlcorn':'\u231E','dlcrop':'\u230D','dollar':'$','dopf':'\uD835\uDD55','Dopf':'\uD835\uDD3B','dot':'\u02D9','Dot':'\xA8','DotDot':'\u20DC','doteq':'\u2250','doteqdot':'\u2251','DotEqual':'\u2250','dotminus':'\u2238','dotplus':'\u2214','dotsquare':'\u22A1','doublebarwedge':'\u2306','DoubleContourIntegral':'\u222F','DoubleDot':'\xA8','DoubleDownArrow':'\u21D3','DoubleLeftArrow':'\u21D0','DoubleLeftRightArrow':'\u21D4','DoubleLeftTee':'\u2AE4','DoubleLongLeftArrow':'\u27F8','DoubleLongLeftRightArrow':'\u27FA','DoubleLongRightArrow':'\u27F9','DoubleRightArrow':'\u21D2','DoubleRightTee':'\u22A8','DoubleUpArrow':'\u21D1','DoubleUpDownArrow':'\u21D5','DoubleVerticalBar':'\u2225','downarrow':'\u2193','Downarrow':'\u21D3','DownArrow':'\u2193','DownArrowBar':'\u2913','DownArrowUpArrow':'\u21F5','DownBreve':'\u0311','downdownarrows':'\u21CA','downharpoonleft':'\u21C3','downharpoonright':'\u21C2','DownLeftRightVector':'\u2950','DownLeftTeeVector':'\u295E','DownLeftVector':'\u21BD','DownLeftVectorBar':'\u2956','DownRightTeeVector':'\u295F','DownRightVector':'\u21C1','DownRightVectorBar':'\u2957','DownTee':'\u22A4','DownTeeArrow':'\u21A7','drbkarow':'\u2910','drcorn':'\u231F','drcrop':'\u230C','dscr':'\uD835\uDCB9','Dscr':'\uD835\uDC9F','dscy':'\u0455','DScy':'\u0405','dsol':'\u29F6','dstrok':'\u0111','Dstrok':'\u0110','dtdot':'\u22F1','dtri':'\u25BF','dtrif':'\u25BE','duarr':'\u21F5','duhar':'\u296F','dwangle':'\u29A6','dzcy':'\u045F','DZcy':'\u040F','dzigrarr':'\u27FF','eacute':'\xE9','Eacute':'\xC9','easter':'\u2A6E','ecaron':'\u011B','Ecaron':'\u011A','ecir':'\u2256','ecirc':'\xEA','Ecirc':'\xCA','ecolon':'\u2255','ecy':'\u044D','Ecy':'\u042D','eDDot':'\u2A77','edot':'\u0117','eDot':'\u2251','Edot':'\u0116','ee':'\u2147','efDot':'\u2252','efr':'\uD835\uDD22','Efr':'\uD835\uDD08','eg':'\u2A9A','egrave':'\xE8','Egrave':'\xC8','egs':'\u2A96','egsdot':'\u2A98','el':'\u2A99','Element':'\u2208','elinters':'\u23E7','ell':'\u2113','els':'\u2A95','elsdot':'\u2A97','emacr':'\u0113','Emacr':'\u0112','empty':'\u2205','emptyset':'\u2205','EmptySmallSquare':'\u25FB','emptyv':'\u2205','EmptyVerySmallSquare':'\u25AB','emsp':'\u2003','emsp13':'\u2004','emsp14':'\u2005','eng':'\u014B','ENG':'\u014A','ensp':'\u2002','eogon':'\u0119','Eogon':'\u0118','eopf':'\uD835\uDD56','Eopf':'\uD835\uDD3C','epar':'\u22D5','eparsl':'\u29E3','eplus':'\u2A71','epsi':'\u03B5','epsilon':'\u03B5','Epsilon':'\u0395','epsiv':'\u03F5','eqcirc':'\u2256','eqcolon':'\u2255','eqsim':'\u2242','eqslantgtr':'\u2A96','eqslantless':'\u2A95','Equal':'\u2A75','equals':'=','EqualTilde':'\u2242','equest':'\u225F','Equilibrium':'\u21CC','equiv':'\u2261','equivDD':'\u2A78','eqvparsl':'\u29E5','erarr':'\u2971','erDot':'\u2253','escr':'\u212F','Escr':'\u2130','esdot':'\u2250','esim':'\u2242','Esim':'\u2A73','eta':'\u03B7','Eta':'\u0397','eth':'\xF0','ETH':'\xD0','euml':'\xEB','Euml':'\xCB','euro':'\u20AC','excl':'!','exist':'\u2203','Exists':'\u2203','expectation':'\u2130','exponentiale':'\u2147','ExponentialE':'\u2147','fallingdotseq':'\u2252','fcy':'\u0444','Fcy':'\u0424','female':'\u2640','ffilig':'\uFB03','fflig':'\uFB00','ffllig':'\uFB04','ffr':'\uD835\uDD23','Ffr':'\uD835\uDD09','filig':'\uFB01','FilledSmallSquare':'\u25FC','FilledVerySmallSquare':'\u25AA','fjlig':'fj','flat':'\u266D','fllig':'\uFB02','fltns':'\u25B1','fnof':'\u0192','fopf':'\uD835\uDD57','Fopf':'\uD835\uDD3D','forall':'\u2200','ForAll':'\u2200','fork':'\u22D4','forkv':'\u2AD9','Fouriertrf':'\u2131','fpartint':'\u2A0D','frac12':'\xBD','frac13':'\u2153','frac14':'\xBC','frac15':'\u2155','frac16':'\u2159','frac18':'\u215B','frac23':'\u2154','frac25':'\u2156','frac34':'\xBE','frac35':'\u2157','frac38':'\u215C','frac45':'\u2158','frac56':'\u215A','frac58':'\u215D','frac78':'\u215E','frasl':'\u2044','frown':'\u2322','fscr':'\uD835\uDCBB','Fscr':'\u2131','gacute':'\u01F5','gamma':'\u03B3','Gamma':'\u0393','gammad':'\u03DD','Gammad':'\u03DC','gap':'\u2A86','gbreve':'\u011F','Gbreve':'\u011E','Gcedil':'\u0122','gcirc':'\u011D','Gcirc':'\u011C','gcy':'\u0433','Gcy':'\u0413','gdot':'\u0121','Gdot':'\u0120','ge':'\u2265','gE':'\u2267','gel':'\u22DB','gEl':'\u2A8C','geq':'\u2265','geqq':'\u2267','geqslant':'\u2A7E','ges':'\u2A7E','gescc':'\u2AA9','gesdot':'\u2A80','gesdoto':'\u2A82','gesdotol':'\u2A84','gesl':'\u22DB\uFE00','gesles':'\u2A94','gfr':'\uD835\uDD24','Gfr':'\uD835\uDD0A','gg':'\u226B','Gg':'\u22D9','ggg':'\u22D9','gimel':'\u2137','gjcy':'\u0453','GJcy':'\u0403','gl':'\u2277','gla':'\u2AA5','glE':'\u2A92','glj':'\u2AA4','gnap':'\u2A8A','gnapprox':'\u2A8A','gne':'\u2A88','gnE':'\u2269','gneq':'\u2A88','gneqq':'\u2269','gnsim':'\u22E7','gopf':'\uD835\uDD58','Gopf':'\uD835\uDD3E','grave':'`','GreaterEqual':'\u2265','GreaterEqualLess':'\u22DB','GreaterFullEqual':'\u2267','GreaterGreater':'\u2AA2','GreaterLess':'\u2277','GreaterSlantEqual':'\u2A7E','GreaterTilde':'\u2273','gscr':'\u210A','Gscr':'\uD835\uDCA2','gsim':'\u2273','gsime':'\u2A8E','gsiml':'\u2A90','gt':'>','Gt':'\u226B','GT':'>','gtcc':'\u2AA7','gtcir':'\u2A7A','gtdot':'\u22D7','gtlPar':'\u2995','gtquest':'\u2A7C','gtrapprox':'\u2A86','gtrarr':'\u2978','gtrdot':'\u22D7','gtreqless':'\u22DB','gtreqqless':'\u2A8C','gtrless':'\u2277','gtrsim':'\u2273','gvertneqq':'\u2269\uFE00','gvnE':'\u2269\uFE00','Hacek':'\u02C7','hairsp':'\u200A','half':'\xBD','hamilt':'\u210B','hardcy':'\u044A','HARDcy':'\u042A','harr':'\u2194','hArr':'\u21D4','harrcir':'\u2948','harrw':'\u21AD','Hat':'^','hbar':'\u210F','hcirc':'\u0125','Hcirc':'\u0124','hearts':'\u2665','heartsuit':'\u2665','hellip':'\u2026','hercon':'\u22B9','hfr':'\uD835\uDD25','Hfr':'\u210C','HilbertSpace':'\u210B','hksearow':'\u2925','hkswarow':'\u2926','hoarr':'\u21FF','homtht':'\u223B','hookleftarrow':'\u21A9','hookrightarrow':'\u21AA','hopf':'\uD835\uDD59','Hopf':'\u210D','horbar':'\u2015','HorizontalLine':'\u2500','hscr':'\uD835\uDCBD','Hscr':'\u210B','hslash':'\u210F','hstrok':'\u0127','Hstrok':'\u0126','HumpDownHump':'\u224E','HumpEqual':'\u224F','hybull':'\u2043','hyphen':'\u2010','iacute':'\xED','Iacute':'\xCD','ic':'\u2063','icirc':'\xEE','Icirc':'\xCE','icy':'\u0438','Icy':'\u0418','Idot':'\u0130','iecy':'\u0435','IEcy':'\u0415','iexcl':'\xA1','iff':'\u21D4','ifr':'\uD835\uDD26','Ifr':'\u2111','igrave':'\xEC','Igrave':'\xCC','ii':'\u2148','iiiint':'\u2A0C','iiint':'\u222D','iinfin':'\u29DC','iiota':'\u2129','ijlig':'\u0133','IJlig':'\u0132','Im':'\u2111','imacr':'\u012B','Imacr':'\u012A','image':'\u2111','ImaginaryI':'\u2148','imagline':'\u2110','imagpart':'\u2111','imath':'\u0131','imof':'\u22B7','imped':'\u01B5','Implies':'\u21D2','in':'\u2208','incare':'\u2105','infin':'\u221E','infintie':'\u29DD','inodot':'\u0131','int':'\u222B','Int':'\u222C','intcal':'\u22BA','integers':'\u2124','Integral':'\u222B','intercal':'\u22BA','Intersection':'\u22C2','intlarhk':'\u2A17','intprod':'\u2A3C','InvisibleComma':'\u2063','InvisibleTimes':'\u2062','iocy':'\u0451','IOcy':'\u0401','iogon':'\u012F','Iogon':'\u012E','iopf':'\uD835\uDD5A','Iopf':'\uD835\uDD40','iota':'\u03B9','Iota':'\u0399','iprod':'\u2A3C','iquest':'\xBF','iscr':'\uD835\uDCBE','Iscr':'\u2110','isin':'\u2208','isindot':'\u22F5','isinE':'\u22F9','isins':'\u22F4','isinsv':'\u22F3','isinv':'\u2208','it':'\u2062','itilde':'\u0129','Itilde':'\u0128','iukcy':'\u0456','Iukcy':'\u0406','iuml':'\xEF','Iuml':'\xCF','jcirc':'\u0135','Jcirc':'\u0134','jcy':'\u0439','Jcy':'\u0419','jfr':'\uD835\uDD27','Jfr':'\uD835\uDD0D','jmath':'\u0237','jopf':'\uD835\uDD5B','Jopf':'\uD835\uDD41','jscr':'\uD835\uDCBF','Jscr':'\uD835\uDCA5','jsercy':'\u0458','Jsercy':'\u0408','jukcy':'\u0454','Jukcy':'\u0404','kappa':'\u03BA','Kappa':'\u039A','kappav':'\u03F0','kcedil':'\u0137','Kcedil':'\u0136','kcy':'\u043A','Kcy':'\u041A','kfr':'\uD835\uDD28','Kfr':'\uD835\uDD0E','kgreen':'\u0138','khcy':'\u0445','KHcy':'\u0425','kjcy':'\u045C','KJcy':'\u040C','kopf':'\uD835\uDD5C','Kopf':'\uD835\uDD42','kscr':'\uD835\uDCC0','Kscr':'\uD835\uDCA6','lAarr':'\u21DA','lacute':'\u013A','Lacute':'\u0139','laemptyv':'\u29B4','lagran':'\u2112','lambda':'\u03BB','Lambda':'\u039B','lang':'\u27E8','Lang':'\u27EA','langd':'\u2991','langle':'\u27E8','lap':'\u2A85','Laplacetrf':'\u2112','laquo':'\xAB','larr':'\u2190','lArr':'\u21D0','Larr':'\u219E','larrb':'\u21E4','larrbfs':'\u291F','larrfs':'\u291D','larrhk':'\u21A9','larrlp':'\u21AB','larrpl':'\u2939','larrsim':'\u2973','larrtl':'\u21A2','lat':'\u2AAB','latail':'\u2919','lAtail':'\u291B','late':'\u2AAD','lates':'\u2AAD\uFE00','lbarr':'\u290C','lBarr':'\u290E','lbbrk':'\u2772','lbrace':'{','lbrack':'[','lbrke':'\u298B','lbrksld':'\u298F','lbrkslu':'\u298D','lcaron':'\u013E','Lcaron':'\u013D','lcedil':'\u013C','Lcedil':'\u013B','lceil':'\u2308','lcub':'{','lcy':'\u043B','Lcy':'\u041B','ldca':'\u2936','ldquo':'\u201C','ldquor':'\u201E','ldrdhar':'\u2967','ldrushar':'\u294B','ldsh':'\u21B2','le':'\u2264','lE':'\u2266','LeftAngleBracket':'\u27E8','leftarrow':'\u2190','Leftarrow':'\u21D0','LeftArrow':'\u2190','LeftArrowBar':'\u21E4','LeftArrowRightArrow':'\u21C6','leftarrowtail':'\u21A2','LeftCeiling':'\u2308','LeftDoubleBracket':'\u27E6','LeftDownTeeVector':'\u2961','LeftDownVector':'\u21C3','LeftDownVectorBar':'\u2959','LeftFloor':'\u230A','leftharpoondown':'\u21BD','leftharpoonup':'\u21BC','leftleftarrows':'\u21C7','leftrightarrow':'\u2194','Leftrightarrow':'\u21D4','LeftRightArrow':'\u2194','leftrightarrows':'\u21C6','leftrightharpoons':'\u21CB','leftrightsquigarrow':'\u21AD','LeftRightVector':'\u294E','LeftTee':'\u22A3','LeftTeeArrow':'\u21A4','LeftTeeVector':'\u295A','leftthreetimes':'\u22CB','LeftTriangle':'\u22B2','LeftTriangleBar':'\u29CF','LeftTriangleEqual':'\u22B4','LeftUpDownVector':'\u2951','LeftUpTeeVector':'\u2960','LeftUpVector':'\u21BF','LeftUpVectorBar':'\u2958','LeftVector':'\u21BC','LeftVectorBar':'\u2952','leg':'\u22DA','lEg':'\u2A8B','leq':'\u2264','leqq':'\u2266','leqslant':'\u2A7D','les':'\u2A7D','lescc':'\u2AA8','lesdot':'\u2A7F','lesdoto':'\u2A81','lesdotor':'\u2A83','lesg':'\u22DA\uFE00','lesges':'\u2A93','lessapprox':'\u2A85','lessdot':'\u22D6','lesseqgtr':'\u22DA','lesseqqgtr':'\u2A8B','LessEqualGreater':'\u22DA','LessFullEqual':'\u2266','LessGreater':'\u2276','lessgtr':'\u2276','LessLess':'\u2AA1','lesssim':'\u2272','LessSlantEqual':'\u2A7D','LessTilde':'\u2272','lfisht':'\u297C','lfloor':'\u230A','lfr':'\uD835\uDD29','Lfr':'\uD835\uDD0F','lg':'\u2276','lgE':'\u2A91','lHar':'\u2962','lhard':'\u21BD','lharu':'\u21BC','lharul':'\u296A','lhblk':'\u2584','ljcy':'\u0459','LJcy':'\u0409','ll':'\u226A','Ll':'\u22D8','llarr':'\u21C7','llcorner':'\u231E','Lleftarrow':'\u21DA','llhard':'\u296B','lltri':'\u25FA','lmidot':'\u0140','Lmidot':'\u013F','lmoust':'\u23B0','lmoustache':'\u23B0','lnap':'\u2A89','lnapprox':'\u2A89','lne':'\u2A87','lnE':'\u2268','lneq':'\u2A87','lneqq':'\u2268','lnsim':'\u22E6','loang':'\u27EC','loarr':'\u21FD','lobrk':'\u27E6','longleftarrow':'\u27F5','Longleftarrow':'\u27F8','LongLeftArrow':'\u27F5','longleftrightarrow':'\u27F7','Longleftrightarrow':'\u27FA','LongLeftRightArrow':'\u27F7','longmapsto':'\u27FC','longrightarrow':'\u27F6','Longrightarrow':'\u27F9','LongRightArrow':'\u27F6','looparrowleft':'\u21AB','looparrowright':'\u21AC','lopar':'\u2985','lopf':'\uD835\uDD5D','Lopf':'\uD835\uDD43','loplus':'\u2A2D','lotimes':'\u2A34','lowast':'\u2217','lowbar':'_','LowerLeftArrow':'\u2199','LowerRightArrow':'\u2198','loz':'\u25CA','lozenge':'\u25CA','lozf':'\u29EB','lpar':'(','lparlt':'\u2993','lrarr':'\u21C6','lrcorner':'\u231F','lrhar':'\u21CB','lrhard':'\u296D','lrm':'\u200E','lrtri':'\u22BF','lsaquo':'\u2039','lscr':'\uD835\uDCC1','Lscr':'\u2112','lsh':'\u21B0','Lsh':'\u21B0','lsim':'\u2272','lsime':'\u2A8D','lsimg':'\u2A8F','lsqb':'[','lsquo':'\u2018','lsquor':'\u201A','lstrok':'\u0142','Lstrok':'\u0141','lt':'<','Lt':'\u226A','LT':'<','ltcc':'\u2AA6','ltcir':'\u2A79','ltdot':'\u22D6','lthree':'\u22CB','ltimes':'\u22C9','ltlarr':'\u2976','ltquest':'\u2A7B','ltri':'\u25C3','ltrie':'\u22B4','ltrif':'\u25C2','ltrPar':'\u2996','lurdshar':'\u294A','luruhar':'\u2966','lvertneqq':'\u2268\uFE00','lvnE':'\u2268\uFE00','macr':'\xAF','male':'\u2642','malt':'\u2720','maltese':'\u2720','map':'\u21A6','Map':'\u2905','mapsto':'\u21A6','mapstodown':'\u21A7','mapstoleft':'\u21A4','mapstoup':'\u21A5','marker':'\u25AE','mcomma':'\u2A29','mcy':'\u043C','Mcy':'\u041C','mdash':'\u2014','mDDot':'\u223A','measuredangle':'\u2221','MediumSpace':'\u205F','Mellintrf':'\u2133','mfr':'\uD835\uDD2A','Mfr':'\uD835\uDD10','mho':'\u2127','micro':'\xB5','mid':'\u2223','midast':'*','midcir':'\u2AF0','middot':'\xB7','minus':'\u2212','minusb':'\u229F','minusd':'\u2238','minusdu':'\u2A2A','MinusPlus':'\u2213','mlcp':'\u2ADB','mldr':'\u2026','mnplus':'\u2213','models':'\u22A7','mopf':'\uD835\uDD5E','Mopf':'\uD835\uDD44','mp':'\u2213','mscr':'\uD835\uDCC2','Mscr':'\u2133','mstpos':'\u223E','mu':'\u03BC','Mu':'\u039C','multimap':'\u22B8','mumap':'\u22B8','nabla':'\u2207','nacute':'\u0144','Nacute':'\u0143','nang':'\u2220\u20D2','nap':'\u2249','napE':'\u2A70\u0338','napid':'\u224B\u0338','napos':'\u0149','napprox':'\u2249','natur':'\u266E','natural':'\u266E','naturals':'\u2115','nbsp':'\xA0','nbump':'\u224E\u0338','nbumpe':'\u224F\u0338','ncap':'\u2A43','ncaron':'\u0148','Ncaron':'\u0147','ncedil':'\u0146','Ncedil':'\u0145','ncong':'\u2247','ncongdot':'\u2A6D\u0338','ncup':'\u2A42','ncy':'\u043D','Ncy':'\u041D','ndash':'\u2013','ne':'\u2260','nearhk':'\u2924','nearr':'\u2197','neArr':'\u21D7','nearrow':'\u2197','nedot':'\u2250\u0338','NegativeMediumSpace':'\u200B','NegativeThickSpace':'\u200B','NegativeThinSpace':'\u200B','NegativeVeryThinSpace':'\u200B','nequiv':'\u2262','nesear':'\u2928','nesim':'\u2242\u0338','NestedGreaterGreater':'\u226B','NestedLessLess':'\u226A','NewLine':'\n','nexist':'\u2204','nexists':'\u2204','nfr':'\uD835\uDD2B','Nfr':'\uD835\uDD11','nge':'\u2271','ngE':'\u2267\u0338','ngeq':'\u2271','ngeqq':'\u2267\u0338','ngeqslant':'\u2A7E\u0338','nges':'\u2A7E\u0338','nGg':'\u22D9\u0338','ngsim':'\u2275','ngt':'\u226F','nGt':'\u226B\u20D2','ngtr':'\u226F','nGtv':'\u226B\u0338','nharr':'\u21AE','nhArr':'\u21CE','nhpar':'\u2AF2','ni':'\u220B','nis':'\u22FC','nisd':'\u22FA','niv':'\u220B','njcy':'\u045A','NJcy':'\u040A','nlarr':'\u219A','nlArr':'\u21CD','nldr':'\u2025','nle':'\u2270','nlE':'\u2266\u0338','nleftarrow':'\u219A','nLeftarrow':'\u21CD','nleftrightarrow':'\u21AE','nLeftrightarrow':'\u21CE','nleq':'\u2270','nleqq':'\u2266\u0338','nleqslant':'\u2A7D\u0338','nles':'\u2A7D\u0338','nless':'\u226E','nLl':'\u22D8\u0338','nlsim':'\u2274','nlt':'\u226E','nLt':'\u226A\u20D2','nltri':'\u22EA','nltrie':'\u22EC','nLtv':'\u226A\u0338','nmid':'\u2224','NoBreak':'\u2060','NonBreakingSpace':'\xA0','nopf':'\uD835\uDD5F','Nopf':'\u2115','not':'\xAC','Not':'\u2AEC','NotCongruent':'\u2262','NotCupCap':'\u226D','NotDoubleVerticalBar':'\u2226','NotElement':'\u2209','NotEqual':'\u2260','NotEqualTilde':'\u2242\u0338','NotExists':'\u2204','NotGreater':'\u226F','NotGreaterEqual':'\u2271','NotGreaterFullEqual':'\u2267\u0338','NotGreaterGreater':'\u226B\u0338','NotGreaterLess':'\u2279','NotGreaterSlantEqual':'\u2A7E\u0338','NotGreaterTilde':'\u2275','NotHumpDownHump':'\u224E\u0338','NotHumpEqual':'\u224F\u0338','notin':'\u2209','notindot':'\u22F5\u0338','notinE':'\u22F9\u0338','notinva':'\u2209','notinvb':'\u22F7','notinvc':'\u22F6','NotLeftTriangle':'\u22EA','NotLeftTriangleBar':'\u29CF\u0338','NotLeftTriangleEqual':'\u22EC','NotLess':'\u226E','NotLessEqual':'\u2270','NotLessGreater':'\u2278','NotLessLess':'\u226A\u0338','NotLessSlantEqual':'\u2A7D\u0338','NotLessTilde':'\u2274','NotNestedGreaterGreater':'\u2AA2\u0338','NotNestedLessLess':'\u2AA1\u0338','notni':'\u220C','notniva':'\u220C','notnivb':'\u22FE','notnivc':'\u22FD','NotPrecedes':'\u2280','NotPrecedesEqual':'\u2AAF\u0338','NotPrecedesSlantEqual':'\u22E0','NotReverseElement':'\u220C','NotRightTriangle':'\u22EB','NotRightTriangleBar':'\u29D0\u0338','NotRightTriangleEqual':'\u22ED','NotSquareSubset':'\u228F\u0338','NotSquareSubsetEqual':'\u22E2','NotSquareSuperset':'\u2290\u0338','NotSquareSupersetEqual':'\u22E3','NotSubset':'\u2282\u20D2','NotSubsetEqual':'\u2288','NotSucceeds':'\u2281','NotSucceedsEqual':'\u2AB0\u0338','NotSucceedsSlantEqual':'\u22E1','NotSucceedsTilde':'\u227F\u0338','NotSuperset':'\u2283\u20D2','NotSupersetEqual':'\u2289','NotTilde':'\u2241','NotTildeEqual':'\u2244','NotTildeFullEqual':'\u2247','NotTildeTilde':'\u2249','NotVerticalBar':'\u2224','npar':'\u2226','nparallel':'\u2226','nparsl':'\u2AFD\u20E5','npart':'\u2202\u0338','npolint':'\u2A14','npr':'\u2280','nprcue':'\u22E0','npre':'\u2AAF\u0338','nprec':'\u2280','npreceq':'\u2AAF\u0338','nrarr':'\u219B','nrArr':'\u21CF','nrarrc':'\u2933\u0338','nrarrw':'\u219D\u0338','nrightarrow':'\u219B','nRightarrow':'\u21CF','nrtri':'\u22EB','nrtrie':'\u22ED','nsc':'\u2281','nsccue':'\u22E1','nsce':'\u2AB0\u0338','nscr':'\uD835\uDCC3','Nscr':'\uD835\uDCA9','nshortmid':'\u2224','nshortparallel':'\u2226','nsim':'\u2241','nsime':'\u2244','nsimeq':'\u2244','nsmid':'\u2224','nspar':'\u2226','nsqsube':'\u22E2','nsqsupe':'\u22E3','nsub':'\u2284','nsube':'\u2288','nsubE':'\u2AC5\u0338','nsubset':'\u2282\u20D2','nsubseteq':'\u2288','nsubseteqq':'\u2AC5\u0338','nsucc':'\u2281','nsucceq':'\u2AB0\u0338','nsup':'\u2285','nsupe':'\u2289','nsupE':'\u2AC6\u0338','nsupset':'\u2283\u20D2','nsupseteq':'\u2289','nsupseteqq':'\u2AC6\u0338','ntgl':'\u2279','ntilde':'\xF1','Ntilde':'\xD1','ntlg':'\u2278','ntriangleleft':'\u22EA','ntrianglelefteq':'\u22EC','ntriangleright':'\u22EB','ntrianglerighteq':'\u22ED','nu':'\u03BD','Nu':'\u039D','num':'#','numero':'\u2116','numsp':'\u2007','nvap':'\u224D\u20D2','nvdash':'\u22AC','nvDash':'\u22AD','nVdash':'\u22AE','nVDash':'\u22AF','nvge':'\u2265\u20D2','nvgt':'>\u20D2','nvHarr':'\u2904','nvinfin':'\u29DE','nvlArr':'\u2902','nvle':'\u2264\u20D2','nvlt':'<\u20D2','nvltrie':'\u22B4\u20D2','nvrArr':'\u2903','nvrtrie':'\u22B5\u20D2','nvsim':'\u223C\u20D2','nwarhk':'\u2923','nwarr':'\u2196','nwArr':'\u21D6','nwarrow':'\u2196','nwnear':'\u2927','oacute':'\xF3','Oacute':'\xD3','oast':'\u229B','ocir':'\u229A','ocirc':'\xF4','Ocirc':'\xD4','ocy':'\u043E','Ocy':'\u041E','odash':'\u229D','odblac':'\u0151','Odblac':'\u0150','odiv':'\u2A38','odot':'\u2299','odsold':'\u29BC','oelig':'\u0153','OElig':'\u0152','ofcir':'\u29BF','ofr':'\uD835\uDD2C','Ofr':'\uD835\uDD12','ogon':'\u02DB','ograve':'\xF2','Ograve':'\xD2','ogt':'\u29C1','ohbar':'\u29B5','ohm':'\u03A9','oint':'\u222E','olarr':'\u21BA','olcir':'\u29BE','olcross':'\u29BB','oline':'\u203E','olt':'\u29C0','omacr':'\u014D','Omacr':'\u014C','omega':'\u03C9','Omega':'\u03A9','omicron':'\u03BF','Omicron':'\u039F','omid':'\u29B6','ominus':'\u2296','oopf':'\uD835\uDD60','Oopf':'\uD835\uDD46','opar':'\u29B7','OpenCurlyDoubleQuote':'\u201C','OpenCurlyQuote':'\u2018','operp':'\u29B9','oplus':'\u2295','or':'\u2228','Or':'\u2A54','orarr':'\u21BB','ord':'\u2A5D','order':'\u2134','orderof':'\u2134','ordf':'\xAA','ordm':'\xBA','origof':'\u22B6','oror':'\u2A56','orslope':'\u2A57','orv':'\u2A5B','oS':'\u24C8','oscr':'\u2134','Oscr':'\uD835\uDCAA','oslash':'\xF8','Oslash':'\xD8','osol':'\u2298','otilde':'\xF5','Otilde':'\xD5','otimes':'\u2297','Otimes':'\u2A37','otimesas':'\u2A36','ouml':'\xF6','Ouml':'\xD6','ovbar':'\u233D','OverBar':'\u203E','OverBrace':'\u23DE','OverBracket':'\u23B4','OverParenthesis':'\u23DC','par':'\u2225','para':'\xB6','parallel':'\u2225','parsim':'\u2AF3','parsl':'\u2AFD','part':'\u2202','PartialD':'\u2202','pcy':'\u043F','Pcy':'\u041F','percnt':'%','period':'.','permil':'\u2030','perp':'\u22A5','pertenk':'\u2031','pfr':'\uD835\uDD2D','Pfr':'\uD835\uDD13','phi':'\u03C6','Phi':'\u03A6','phiv':'\u03D5','phmmat':'\u2133','phone':'\u260E','pi':'\u03C0','Pi':'\u03A0','pitchfork':'\u22D4','piv':'\u03D6','planck':'\u210F','planckh':'\u210E','plankv':'\u210F','plus':'+','plusacir':'\u2A23','plusb':'\u229E','pluscir':'\u2A22','plusdo':'\u2214','plusdu':'\u2A25','pluse':'\u2A72','PlusMinus':'\xB1','plusmn':'\xB1','plussim':'\u2A26','plustwo':'\u2A27','pm':'\xB1','Poincareplane':'\u210C','pointint':'\u2A15','popf':'\uD835\uDD61','Popf':'\u2119','pound':'\xA3','pr':'\u227A','Pr':'\u2ABB','prap':'\u2AB7','prcue':'\u227C','pre':'\u2AAF','prE':'\u2AB3','prec':'\u227A','precapprox':'\u2AB7','preccurlyeq':'\u227C','Precedes':'\u227A','PrecedesEqual':'\u2AAF','PrecedesSlantEqual':'\u227C','PrecedesTilde':'\u227E','preceq':'\u2AAF','precnapprox':'\u2AB9','precneqq':'\u2AB5','precnsim':'\u22E8','precsim':'\u227E','prime':'\u2032','Prime':'\u2033','primes':'\u2119','prnap':'\u2AB9','prnE':'\u2AB5','prnsim':'\u22E8','prod':'\u220F','Product':'\u220F','profalar':'\u232E','profline':'\u2312','profsurf':'\u2313','prop':'\u221D','Proportion':'\u2237','Proportional':'\u221D','propto':'\u221D','prsim':'\u227E','prurel':'\u22B0','pscr':'\uD835\uDCC5','Pscr':'\uD835\uDCAB','psi':'\u03C8','Psi':'\u03A8','puncsp':'\u2008','qfr':'\uD835\uDD2E','Qfr':'\uD835\uDD14','qint':'\u2A0C','qopf':'\uD835\uDD62','Qopf':'\u211A','qprime':'\u2057','qscr':'\uD835\uDCC6','Qscr':'\uD835\uDCAC','quaternions':'\u210D','quatint':'\u2A16','quest':'?','questeq':'\u225F','quot':'"','QUOT':'"','rAarr':'\u21DB','race':'\u223D\u0331','racute':'\u0155','Racute':'\u0154','radic':'\u221A','raemptyv':'\u29B3','rang':'\u27E9','Rang':'\u27EB','rangd':'\u2992','range':'\u29A5','rangle':'\u27E9','raquo':'\xBB','rarr':'\u2192','rArr':'\u21D2','Rarr':'\u21A0','rarrap':'\u2975','rarrb':'\u21E5','rarrbfs':'\u2920','rarrc':'\u2933','rarrfs':'\u291E','rarrhk':'\u21AA','rarrlp':'\u21AC','rarrpl':'\u2945','rarrsim':'\u2974','rarrtl':'\u21A3','Rarrtl':'\u2916','rarrw':'\u219D','ratail':'\u291A','rAtail':'\u291C','ratio':'\u2236','rationals':'\u211A','rbarr':'\u290D','rBarr':'\u290F','RBarr':'\u2910','rbbrk':'\u2773','rbrace':'}','rbrack':']','rbrke':'\u298C','rbrksld':'\u298E','rbrkslu':'\u2990','rcaron':'\u0159','Rcaron':'\u0158','rcedil':'\u0157','Rcedil':'\u0156','rceil':'\u2309','rcub':'}','rcy':'\u0440','Rcy':'\u0420','rdca':'\u2937','rdldhar':'\u2969','rdquo':'\u201D','rdquor':'\u201D','rdsh':'\u21B3','Re':'\u211C','real':'\u211C','realine':'\u211B','realpart':'\u211C','reals':'\u211D','rect':'\u25AD','reg':'\xAE','REG':'\xAE','ReverseElement':'\u220B','ReverseEquilibrium':'\u21CB','ReverseUpEquilibrium':'\u296F','rfisht':'\u297D','rfloor':'\u230B','rfr':'\uD835\uDD2F','Rfr':'\u211C','rHar':'\u2964','rhard':'\u21C1','rharu':'\u21C0','rharul':'\u296C','rho':'\u03C1','Rho':'\u03A1','rhov':'\u03F1','RightAngleBracket':'\u27E9','rightarrow':'\u2192','Rightarrow':'\u21D2','RightArrow':'\u2192','RightArrowBar':'\u21E5','RightArrowLeftArrow':'\u21C4','rightarrowtail':'\u21A3','RightCeiling':'\u2309','RightDoubleBracket':'\u27E7','RightDownTeeVector':'\u295D','RightDownVector':'\u21C2','RightDownVectorBar':'\u2955','RightFloor':'\u230B','rightharpoondown':'\u21C1','rightharpoonup':'\u21C0','rightleftarrows':'\u21C4','rightleftharpoons':'\u21CC','rightrightarrows':'\u21C9','rightsquigarrow':'\u219D','RightTee':'\u22A2','RightTeeArrow':'\u21A6','RightTeeVector':'\u295B','rightthreetimes':'\u22CC','RightTriangle':'\u22B3','RightTriangleBar':'\u29D0','RightTriangleEqual':'\u22B5','RightUpDownVector':'\u294F','RightUpTeeVector':'\u295C','RightUpVector':'\u21BE','RightUpVectorBar':'\u2954','RightVector':'\u21C0','RightVectorBar':'\u2953','ring':'\u02DA','risingdotseq':'\u2253','rlarr':'\u21C4','rlhar':'\u21CC','rlm':'\u200F','rmoust':'\u23B1','rmoustache':'\u23B1','rnmid':'\u2AEE','roang':'\u27ED','roarr':'\u21FE','robrk':'\u27E7','ropar':'\u2986','ropf':'\uD835\uDD63','Ropf':'\u211D','roplus':'\u2A2E','rotimes':'\u2A35','RoundImplies':'\u2970','rpar':')','rpargt':'\u2994','rppolint':'\u2A12','rrarr':'\u21C9','Rrightarrow':'\u21DB','rsaquo':'\u203A','rscr':'\uD835\uDCC7','Rscr':'\u211B','rsh':'\u21B1','Rsh':'\u21B1','rsqb':']','rsquo':'\u2019','rsquor':'\u2019','rthree':'\u22CC','rtimes':'\u22CA','rtri':'\u25B9','rtrie':'\u22B5','rtrif':'\u25B8','rtriltri':'\u29CE','RuleDelayed':'\u29F4','ruluhar':'\u2968','rx':'\u211E','sacute':'\u015B','Sacute':'\u015A','sbquo':'\u201A','sc':'\u227B','Sc':'\u2ABC','scap':'\u2AB8','scaron':'\u0161','Scaron':'\u0160','sccue':'\u227D','sce':'\u2AB0','scE':'\u2AB4','scedil':'\u015F','Scedil':'\u015E','scirc':'\u015D','Scirc':'\u015C','scnap':'\u2ABA','scnE':'\u2AB6','scnsim':'\u22E9','scpolint':'\u2A13','scsim':'\u227F','scy':'\u0441','Scy':'\u0421','sdot':'\u22C5','sdotb':'\u22A1','sdote':'\u2A66','searhk':'\u2925','searr':'\u2198','seArr':'\u21D8','searrow':'\u2198','sect':'\xA7','semi':';','seswar':'\u2929','setminus':'\u2216','setmn':'\u2216','sext':'\u2736','sfr':'\uD835\uDD30','Sfr':'\uD835\uDD16','sfrown':'\u2322','sharp':'\u266F','shchcy':'\u0449','SHCHcy':'\u0429','shcy':'\u0448','SHcy':'\u0428','ShortDownArrow':'\u2193','ShortLeftArrow':'\u2190','shortmid':'\u2223','shortparallel':'\u2225','ShortRightArrow':'\u2192','ShortUpArrow':'\u2191','shy':'\xAD','sigma':'\u03C3','Sigma':'\u03A3','sigmaf':'\u03C2','sigmav':'\u03C2','sim':'\u223C','simdot':'\u2A6A','sime':'\u2243','simeq':'\u2243','simg':'\u2A9E','simgE':'\u2AA0','siml':'\u2A9D','simlE':'\u2A9F','simne':'\u2246','simplus':'\u2A24','simrarr':'\u2972','slarr':'\u2190','SmallCircle':'\u2218','smallsetminus':'\u2216','smashp':'\u2A33','smeparsl':'\u29E4','smid':'\u2223','smile':'\u2323','smt':'\u2AAA','smte':'\u2AAC','smtes':'\u2AAC\uFE00','softcy':'\u044C','SOFTcy':'\u042C','sol':'/','solb':'\u29C4','solbar':'\u233F','sopf':'\uD835\uDD64','Sopf':'\uD835\uDD4A','spades':'\u2660','spadesuit':'\u2660','spar':'\u2225','sqcap':'\u2293','sqcaps':'\u2293\uFE00','sqcup':'\u2294','sqcups':'\u2294\uFE00','Sqrt':'\u221A','sqsub':'\u228F','sqsube':'\u2291','sqsubset':'\u228F','sqsubseteq':'\u2291','sqsup':'\u2290','sqsupe':'\u2292','sqsupset':'\u2290','sqsupseteq':'\u2292','squ':'\u25A1','square':'\u25A1','Square':'\u25A1','SquareIntersection':'\u2293','SquareSubset':'\u228F','SquareSubsetEqual':'\u2291','SquareSuperset':'\u2290','SquareSupersetEqual':'\u2292','SquareUnion':'\u2294','squarf':'\u25AA','squf':'\u25AA','srarr':'\u2192','sscr':'\uD835\uDCC8','Sscr':'\uD835\uDCAE','ssetmn':'\u2216','ssmile':'\u2323','sstarf':'\u22C6','star':'\u2606','Star':'\u22C6','starf':'\u2605','straightepsilon':'\u03F5','straightphi':'\u03D5','strns':'\xAF','sub':'\u2282','Sub':'\u22D0','subdot':'\u2ABD','sube':'\u2286','subE':'\u2AC5','subedot':'\u2AC3','submult':'\u2AC1','subne':'\u228A','subnE':'\u2ACB','subplus':'\u2ABF','subrarr':'\u2979','subset':'\u2282','Subset':'\u22D0','subseteq':'\u2286','subseteqq':'\u2AC5','SubsetEqual':'\u2286','subsetneq':'\u228A','subsetneqq':'\u2ACB','subsim':'\u2AC7','subsub':'\u2AD5','subsup':'\u2AD3','succ':'\u227B','succapprox':'\u2AB8','succcurlyeq':'\u227D','Succeeds':'\u227B','SucceedsEqual':'\u2AB0','SucceedsSlantEqual':'\u227D','SucceedsTilde':'\u227F','succeq':'\u2AB0','succnapprox':'\u2ABA','succneqq':'\u2AB6','succnsim':'\u22E9','succsim':'\u227F','SuchThat':'\u220B','sum':'\u2211','Sum':'\u2211','sung':'\u266A','sup':'\u2283','Sup':'\u22D1','sup1':'\xB9','sup2':'\xB2','sup3':'\xB3','supdot':'\u2ABE','supdsub':'\u2AD8','supe':'\u2287','supE':'\u2AC6','supedot':'\u2AC4','Superset':'\u2283','SupersetEqual':'\u2287','suphsol':'\u27C9','suphsub':'\u2AD7','suplarr':'\u297B','supmult':'\u2AC2','supne':'\u228B','supnE':'\u2ACC','supplus':'\u2AC0','supset':'\u2283','Supset':'\u22D1','supseteq':'\u2287','supseteqq':'\u2AC6','supsetneq':'\u228B','supsetneqq':'\u2ACC','supsim':'\u2AC8','supsub':'\u2AD4','supsup':'\u2AD6','swarhk':'\u2926','swarr':'\u2199','swArr':'\u21D9','swarrow':'\u2199','swnwar':'\u292A','szlig':'\xDF','Tab':'\t','target':'\u2316','tau':'\u03C4','Tau':'\u03A4','tbrk':'\u23B4','tcaron':'\u0165','Tcaron':'\u0164','tcedil':'\u0163','Tcedil':'\u0162','tcy':'\u0442','Tcy':'\u0422','tdot':'\u20DB','telrec':'\u2315','tfr':'\uD835\uDD31','Tfr':'\uD835\uDD17','there4':'\u2234','therefore':'\u2234','Therefore':'\u2234','theta':'\u03B8','Theta':'\u0398','thetasym':'\u03D1','thetav':'\u03D1','thickapprox':'\u2248','thicksim':'\u223C','ThickSpace':'\u205F\u200A','thinsp':'\u2009','ThinSpace':'\u2009','thkap':'\u2248','thksim':'\u223C','thorn':'\xFE','THORN':'\xDE','tilde':'\u02DC','Tilde':'\u223C','TildeEqual':'\u2243','TildeFullEqual':'\u2245','TildeTilde':'\u2248','times':'\xD7','timesb':'\u22A0','timesbar':'\u2A31','timesd':'\u2A30','tint':'\u222D','toea':'\u2928','top':'\u22A4','topbot':'\u2336','topcir':'\u2AF1','topf':'\uD835\uDD65','Topf':'\uD835\uDD4B','topfork':'\u2ADA','tosa':'\u2929','tprime':'\u2034','trade':'\u2122','TRADE':'\u2122','triangle':'\u25B5','triangledown':'\u25BF','triangleleft':'\u25C3','trianglelefteq':'\u22B4','triangleq':'\u225C','triangleright':'\u25B9','trianglerighteq':'\u22B5','tridot':'\u25EC','trie':'\u225C','triminus':'\u2A3A','TripleDot':'\u20DB','triplus':'\u2A39','trisb':'\u29CD','tritime':'\u2A3B','trpezium':'\u23E2','tscr':'\uD835\uDCC9','Tscr':'\uD835\uDCAF','tscy':'\u0446','TScy':'\u0426','tshcy':'\u045B','TSHcy':'\u040B','tstrok':'\u0167','Tstrok':'\u0166','twixt':'\u226C','twoheadleftarrow':'\u219E','twoheadrightarrow':'\u21A0','uacute':'\xFA','Uacute':'\xDA','uarr':'\u2191','uArr':'\u21D1','Uarr':'\u219F','Uarrocir':'\u2949','ubrcy':'\u045E','Ubrcy':'\u040E','ubreve':'\u016D','Ubreve':'\u016C','ucirc':'\xFB','Ucirc':'\xDB','ucy':'\u0443','Ucy':'\u0423','udarr':'\u21C5','udblac':'\u0171','Udblac':'\u0170','udhar':'\u296E','ufisht':'\u297E','ufr':'\uD835\uDD32','Ufr':'\uD835\uDD18','ugrave':'\xF9','Ugrave':'\xD9','uHar':'\u2963','uharl':'\u21BF','uharr':'\u21BE','uhblk':'\u2580','ulcorn':'\u231C','ulcorner':'\u231C','ulcrop':'\u230F','ultri':'\u25F8','umacr':'\u016B','Umacr':'\u016A','uml':'\xA8','UnderBar':'_','UnderBrace':'\u23DF','UnderBracket':'\u23B5','UnderParenthesis':'\u23DD','Union':'\u22C3','UnionPlus':'\u228E','uogon':'\u0173','Uogon':'\u0172','uopf':'\uD835\uDD66','Uopf':'\uD835\uDD4C','uparrow':'\u2191','Uparrow':'\u21D1','UpArrow':'\u2191','UpArrowBar':'\u2912','UpArrowDownArrow':'\u21C5','updownarrow':'\u2195','Updownarrow':'\u21D5','UpDownArrow':'\u2195','UpEquilibrium':'\u296E','upharpoonleft':'\u21BF','upharpoonright':'\u21BE','uplus':'\u228E','UpperLeftArrow':'\u2196','UpperRightArrow':'\u2197','upsi':'\u03C5','Upsi':'\u03D2','upsih':'\u03D2','upsilon':'\u03C5','Upsilon':'\u03A5','UpTee':'\u22A5','UpTeeArrow':'\u21A5','upuparrows':'\u21C8','urcorn':'\u231D','urcorner':'\u231D','urcrop':'\u230E','uring':'\u016F','Uring':'\u016E','urtri':'\u25F9','uscr':'\uD835\uDCCA','Uscr':'\uD835\uDCB0','utdot':'\u22F0','utilde':'\u0169','Utilde':'\u0168','utri':'\u25B5','utrif':'\u25B4','uuarr':'\u21C8','uuml':'\xFC','Uuml':'\xDC','uwangle':'\u29A7','vangrt':'\u299C','varepsilon':'\u03F5','varkappa':'\u03F0','varnothing':'\u2205','varphi':'\u03D5','varpi':'\u03D6','varpropto':'\u221D','varr':'\u2195','vArr':'\u21D5','varrho':'\u03F1','varsigma':'\u03C2','varsubsetneq':'\u228A\uFE00','varsubsetneqq':'\u2ACB\uFE00','varsupsetneq':'\u228B\uFE00','varsupsetneqq':'\u2ACC\uFE00','vartheta':'\u03D1','vartriangleleft':'\u22B2','vartriangleright':'\u22B3','vBar':'\u2AE8','Vbar':'\u2AEB','vBarv':'\u2AE9','vcy':'\u0432','Vcy':'\u0412','vdash':'\u22A2','vDash':'\u22A8','Vdash':'\u22A9','VDash':'\u22AB','Vdashl':'\u2AE6','vee':'\u2228','Vee':'\u22C1','veebar':'\u22BB','veeeq':'\u225A','vellip':'\u22EE','verbar':'|','Verbar':'\u2016','vert':'|','Vert':'\u2016','VerticalBar':'\u2223','VerticalLine':'|','VerticalSeparator':'\u2758','VerticalTilde':'\u2240','VeryThinSpace':'\u200A','vfr':'\uD835\uDD33','Vfr':'\uD835\uDD19','vltri':'\u22B2','vnsub':'\u2282\u20D2','vnsup':'\u2283\u20D2','vopf':'\uD835\uDD67','Vopf':'\uD835\uDD4D','vprop':'\u221D','vrtri':'\u22B3','vscr':'\uD835\uDCCB','Vscr':'\uD835\uDCB1','vsubne':'\u228A\uFE00','vsubnE':'\u2ACB\uFE00','vsupne':'\u228B\uFE00','vsupnE':'\u2ACC\uFE00','Vvdash':'\u22AA','vzigzag':'\u299A','wcirc':'\u0175','Wcirc':'\u0174','wedbar':'\u2A5F','wedge':'\u2227','Wedge':'\u22C0','wedgeq':'\u2259','weierp':'\u2118','wfr':'\uD835\uDD34','Wfr':'\uD835\uDD1A','wopf':'\uD835\uDD68','Wopf':'\uD835\uDD4E','wp':'\u2118','wr':'\u2240','wreath':'\u2240','wscr':'\uD835\uDCCC','Wscr':'\uD835\uDCB2','xcap':'\u22C2','xcirc':'\u25EF','xcup':'\u22C3','xdtri':'\u25BD','xfr':'\uD835\uDD35','Xfr':'\uD835\uDD1B','xharr':'\u27F7','xhArr':'\u27FA','xi':'\u03BE','Xi':'\u039E','xlarr':'\u27F5','xlArr':'\u27F8','xmap':'\u27FC','xnis':'\u22FB','xodot':'\u2A00','xopf':'\uD835\uDD69','Xopf':'\uD835\uDD4F','xoplus':'\u2A01','xotime':'\u2A02','xrarr':'\u27F6','xrArr':'\u27F9','xscr':'\uD835\uDCCD','Xscr':'\uD835\uDCB3','xsqcup':'\u2A06','xuplus':'\u2A04','xutri':'\u25B3','xvee':'\u22C1','xwedge':'\u22C0','yacute':'\xFD','Yacute':'\xDD','yacy':'\u044F','YAcy':'\u042F','ycirc':'\u0177','Ycirc':'\u0176','ycy':'\u044B','Ycy':'\u042B','yen':'\xA5','yfr':'\uD835\uDD36','Yfr':'\uD835\uDD1C','yicy':'\u0457','YIcy':'\u0407','yopf':'\uD835\uDD6A','Yopf':'\uD835\uDD50','yscr':'\uD835\uDCCE','Yscr':'\uD835\uDCB4','yucy':'\u044E','YUcy':'\u042E','yuml':'\xFF','Yuml':'\u0178','zacute':'\u017A','Zacute':'\u0179','zcaron':'\u017E','Zcaron':'\u017D','zcy':'\u0437','Zcy':'\u0417','zdot':'\u017C','Zdot':'\u017B','zeetrf':'\u2128','ZeroWidthSpace':'\u200B','zeta':'\u03B6','Zeta':'\u0396','zfr':'\uD835\uDD37','Zfr':'\u2128','zhcy':'\u0436','ZHcy':'\u0416','zigrarr':'\u21DD','zopf':'\uD835\uDD6B','Zopf':'\u2124','zscr':'\uD835\uDCCF','Zscr':'\uD835\uDCB5','zwj':'\u200D','zwnj':'\u200C'};
	var decodeMapLegacy = {'aacute':'\xE1','Aacute':'\xC1','acirc':'\xE2','Acirc':'\xC2','acute':'\xB4','aelig':'\xE6','AElig':'\xC6','agrave':'\xE0','Agrave':'\xC0','amp':'&','AMP':'&','aring':'\xE5','Aring':'\xC5','atilde':'\xE3','Atilde':'\xC3','auml':'\xE4','Auml':'\xC4','brvbar':'\xA6','ccedil':'\xE7','Ccedil':'\xC7','cedil':'\xB8','cent':'\xA2','copy':'\xA9','COPY':'\xA9','curren':'\xA4','deg':'\xB0','divide':'\xF7','eacute':'\xE9','Eacute':'\xC9','ecirc':'\xEA','Ecirc':'\xCA','egrave':'\xE8','Egrave':'\xC8','eth':'\xF0','ETH':'\xD0','euml':'\xEB','Euml':'\xCB','frac12':'\xBD','frac14':'\xBC','frac34':'\xBE','gt':'>','GT':'>','iacute':'\xED','Iacute':'\xCD','icirc':'\xEE','Icirc':'\xCE','iexcl':'\xA1','igrave':'\xEC','Igrave':'\xCC','iquest':'\xBF','iuml':'\xEF','Iuml':'\xCF','laquo':'\xAB','lt':'<','LT':'<','macr':'\xAF','micro':'\xB5','middot':'\xB7','nbsp':'\xA0','not':'\xAC','ntilde':'\xF1','Ntilde':'\xD1','oacute':'\xF3','Oacute':'\xD3','ocirc':'\xF4','Ocirc':'\xD4','ograve':'\xF2','Ograve':'\xD2','ordf':'\xAA','ordm':'\xBA','oslash':'\xF8','Oslash':'\xD8','otilde':'\xF5','Otilde':'\xD5','ouml':'\xF6','Ouml':'\xD6','para':'\xB6','plusmn':'\xB1','pound':'\xA3','quot':'"','QUOT':'"','raquo':'\xBB','reg':'\xAE','REG':'\xAE','sect':'\xA7','shy':'\xAD','sup1':'\xB9','sup2':'\xB2','sup3':'\xB3','szlig':'\xDF','thorn':'\xFE','THORN':'\xDE','times':'\xD7','uacute':'\xFA','Uacute':'\xDA','ucirc':'\xFB','Ucirc':'\xDB','ugrave':'\xF9','Ugrave':'\xD9','uml':'\xA8','uuml':'\xFC','Uuml':'\xDC','yacute':'\xFD','Yacute':'\xDD','yen':'\xA5','yuml':'\xFF'};
	var decodeMapNumeric = {'0':'\uFFFD','128':'\u20AC','130':'\u201A','131':'\u0192','132':'\u201E','133':'\u2026','134':'\u2020','135':'\u2021','136':'\u02C6','137':'\u2030','138':'\u0160','139':'\u2039','140':'\u0152','142':'\u017D','145':'\u2018','146':'\u2019','147':'\u201C','148':'\u201D','149':'\u2022','150':'\u2013','151':'\u2014','152':'\u02DC','153':'\u2122','154':'\u0161','155':'\u203A','156':'\u0153','158':'\u017E','159':'\u0178'};
	var invalidReferenceCodePoints = [1,2,3,4,5,6,7,8,11,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,64976,64977,64978,64979,64980,64981,64982,64983,64984,64985,64986,64987,64988,64989,64990,64991,64992,64993,64994,64995,64996,64997,64998,64999,65000,65001,65002,65003,65004,65005,65006,65007,65534,65535,131070,131071,196606,196607,262142,262143,327678,327679,393214,393215,458750,458751,524286,524287,589822,589823,655358,655359,720894,720895,786430,786431,851966,851967,917502,917503,983038,983039,1048574,1048575,1114110,1114111];

	/*--------------------------------------------------------------------------*/

	var stringFromCharCode = String.fromCharCode;

	var object = {};
	var hasOwnProperty = object.hasOwnProperty;
	var has = function(object, propertyName) {
		return hasOwnProperty.call(object, propertyName);
	};

	var contains = function(array, value) {
		var index = -1;
		var length = array.length;
		while (++index < length) {
			if (array[index] == value) {
				return true;
			}
		}
		return false;
	};

	var merge = function(options, defaults) {
		if (!options) {
			return defaults;
		}
		var result = {};
		var key;
		for (key in defaults) {
			// A `hasOwnProperty` check is not needed here, since only recognized
			// option names are used anyway. Any others are ignored.
			result[key] = has(options, key) ? options[key] : defaults[key];
		}
		return result;
	};

	// Modified version of `ucs2encode`; see https://mths.be/punycode.
	var codePointToSymbol = function(codePoint, strict) {
		var output = '';
		if ((codePoint >= 0xD800 && codePoint <= 0xDFFF) || codePoint > 0x10FFFF) {
			// See issue #4:
			// “Otherwise, if the number is in the range 0xD800 to 0xDFFF or is
			// greater than 0x10FFFF, then this is a parse error. Return a U+FFFD
			// REPLACEMENT CHARACTER.”
			if (strict) {
				parseError('character reference outside the permissible Unicode range');
			}
			return '\uFFFD';
		}
		if (has(decodeMapNumeric, codePoint)) {
			if (strict) {
				parseError('disallowed character reference');
			}
			return decodeMapNumeric[codePoint];
		}
		if (strict && contains(invalidReferenceCodePoints, codePoint)) {
			parseError('disallowed character reference');
		}
		if (codePoint > 0xFFFF) {
			codePoint -= 0x10000;
			output += stringFromCharCode(codePoint >>> 10 & 0x3FF | 0xD800);
			codePoint = 0xDC00 | codePoint & 0x3FF;
		}
		output += stringFromCharCode(codePoint);
		return output;
	};

	var hexEscape = function(codePoint) {
		return '&#x' + codePoint.toString(16).toUpperCase() + ';';
	};

	var decEscape = function(codePoint) {
		return '&#' + codePoint + ';';
	};

	var parseError = function(message) {
		throw Error('Parse error: ' + message);
	};

	/*--------------------------------------------------------------------------*/

	var encode = function(string, options) {
		options = merge(options, encode.options);
		var strict = options.strict;
		if (strict && regexInvalidRawCodePoint.test(string)) {
			parseError('forbidden code point');
		}
		var encodeEverything = options.encodeEverything;
		var useNamedReferences = options.useNamedReferences;
		var allowUnsafeSymbols = options.allowUnsafeSymbols;
		var escapeCodePoint = options.decimal ? decEscape : hexEscape;

		var escapeBmpSymbol = function(symbol) {
			return escapeCodePoint(symbol.charCodeAt(0));
		};

		if (encodeEverything) {
			// Encode ASCII symbols.
			string = string.replace(regexAsciiWhitelist, function(symbol) {
				// Use named references if requested & possible.
				if (useNamedReferences && has(encodeMap, symbol)) {
					return '&' + encodeMap[symbol] + ';';
				}
				return escapeBmpSymbol(symbol);
			});
			// Shorten a few escapes that represent two symbols, of which at least one
			// is within the ASCII range.
			if (useNamedReferences) {
				string = string
					.replace(/&gt;\u20D2/g, '&nvgt;')
					.replace(/&lt;\u20D2/g, '&nvlt;')
					.replace(/&#x66;&#x6A;/g, '&fjlig;');
			}
			// Encode non-ASCII symbols.
			if (useNamedReferences) {
				// Encode non-ASCII symbols that can be replaced with a named reference.
				string = string.replace(regexEncodeNonAscii, function(string) {
					// Note: there is no need to check `has(encodeMap, string)` here.
					return '&' + encodeMap[string] + ';';
				});
			}
			// Note: any remaining non-ASCII symbols are handled outside of the `if`.
		} else if (useNamedReferences) {
			// Apply named character references.
			// Encode `<>"'&` using named character references.
			if (!allowUnsafeSymbols) {
				string = string.replace(regexEscape, function(string) {
					return '&' + encodeMap[string] + ';'; // no need to check `has()` here
				});
			}
			// Shorten escapes that represent two symbols, of which at least one is
			// `<>"'&`.
			string = string
				.replace(/&gt;\u20D2/g, '&nvgt;')
				.replace(/&lt;\u20D2/g, '&nvlt;');
			// Encode non-ASCII symbols that can be replaced with a named reference.
			string = string.replace(regexEncodeNonAscii, function(string) {
				// Note: there is no need to check `has(encodeMap, string)` here.
				return '&' + encodeMap[string] + ';';
			});
		} else if (!allowUnsafeSymbols) {
			// Encode `<>"'&` using hexadecimal escapes, now that they’re not handled
			// using named character references.
			string = string.replace(regexEscape, escapeBmpSymbol);
		}
		return string
			// Encode astral symbols.
			.replace(regexAstralSymbols, function($0) {
				// https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
				var high = $0.charCodeAt(0);
				var low = $0.charCodeAt(1);
				var codePoint = (high - 0xD800) * 0x400 + low - 0xDC00 + 0x10000;
				return escapeCodePoint(codePoint);
			})
			// Encode any remaining BMP symbols that are not printable ASCII symbols
			// using a hexadecimal escape.
			.replace(regexBmpWhitelist, escapeBmpSymbol);
	};
	// Expose default options (so they can be overridden globally).
	encode.options = {
		'allowUnsafeSymbols': false,
		'encodeEverything': false,
		'strict': false,
		'useNamedReferences': false,
		'decimal' : false
	};

	var decode = function(html, options) {
		options = merge(options, decode.options);
		var strict = options.strict;
		if (strict && regexInvalidEntity.test(html)) {
			parseError('malformed character reference');
		}
		return html.replace(regexDecode, function($0, $1, $2, $3, $4, $5, $6, $7) {
			var codePoint;
			var semicolon;
			var decDigits;
			var hexDigits;
			var reference;
			var next;
			if ($1) {
				// Decode decimal escapes, e.g. `&#119558;`.
				decDigits = $1;
				semicolon = $2;
				if (strict && !semicolon) {
					parseError('character reference was not terminated by a semicolon');
				}
				codePoint = parseInt(decDigits, 10);
				return codePointToSymbol(codePoint, strict);
			}
			if ($3) {
				// Decode hexadecimal escapes, e.g. `&#x1D306;`.
				hexDigits = $3;
				semicolon = $4;
				if (strict && !semicolon) {
					parseError('character reference was not terminated by a semicolon');
				}
				codePoint = parseInt(hexDigits, 16);
				return codePointToSymbol(codePoint, strict);
			}
			if ($5) {
				// Decode named character references with trailing `;`, e.g. `&copy;`.
				reference = $5;
				if (has(decodeMap, reference)) {
					return decodeMap[reference];
				} else {
					// Ambiguous ampersand. https://mths.be/notes/ambiguous-ampersands
					if (strict) {
						parseError(
							'named character reference was not terminated by a semicolon'
						);
					}
					return $0;
				}
			}
			// If we’re still here, it’s a legacy reference for sure. No need for an
			// extra `if` check.
			// Decode named character references without trailing `;`, e.g. `&amp`
			// This is only a parse error if it gets converted to `&`, or if it is
			// followed by `=` in an attribute context.
			reference = $6;
			next = $7;
			if (next && options.isAttributeValue) {
				if (strict && next == '=') {
					parseError('`&` did not start a character reference');
				}
				return $0;
			} else {
				if (strict) {
					parseError(
						'named character reference was not terminated by a semicolon'
					);
				}
				// Note: there is no need to check `has(decodeMapLegacy, reference)`.
				return decodeMapLegacy[reference] + (next || '');
			}
		});
	};
	// Expose default options (so they can be overridden globally).
	decode.options = {
		'isAttributeValue': false,
		'strict': false
	};

	var escape = function(string) {
		return string.replace(regexEscape, function($0) {
			// Note: there is no need to check `has(escapeMap, $0)` here.
			return escapeMap[$0];
		});
	};

	/*--------------------------------------------------------------------------*/

	var he = {
		'version': '1.1.1',
		'encode': encode,
		'decode': decode,
		'escape': escape,
		'unescape': decode
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof undefined == 'function' &&
		typeof undefined.amd == 'object' &&
		undefined.amd
	) {
		undefined(function() {
			return he;
		});
	}	else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = he;
		} else { // in Narwhal or RingoJS v0.7.0-
			for (var key in he) {
				has(he, key) && (freeExports[key] = he[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.he = he;
	}

}(commonjsGlobal));
});

/**
 * Not type-checking this file because it's mostly vendor code.
 */

/*!
 * HTML Parser By John Resig (ejohn.org)
 * Modified by Juriy "kangax" Zaytsev
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 */

// Regular Expressions for parsing tags and attributes
/** 匹配属性[0]为整体匹配的值[1]为匹配到的属性[2]为等号[3]为属性的值 */
var attribute$1 = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
// but for Vue templates we can enforce a simple charset
/** 匹配a-zA-Z_一个后面接0到多个 */
var ncname$1 = '[a-zA-Z_][\\w\\-\\.]*';
/** 匹配 */
var qnameCapture$1 = "((?:" + ncname$1 + "\\:)?" + ncname$1 + ")";
var startTagOpen$1 = new RegExp(("^<" + qnameCapture$1));
/** 匹配开始标签的结束标签 */
var startTagClose$1 = /^\s*(\/?)>/;
var endTag$1 = new RegExp(("^<\\/" + qnameCapture$1 + "[^>]*>"));
/** 匹配以<!doctype开始 +任意非>字符 并以>结束的字符 */
var doctype$1 = /^<!DOCTYPE [^>]+>/i;
/** 匹配以<!--开始的字符串 */
var comment$1 = /^<!--/;
/** 匹配以<![开始的字符 */
var conditionalComment$1 = /^<!\[/;

var IS_REGEX_CAPTURING_BROKEN$1 = false;
'x'.replace(/x(.)?/g, function (m, g) {
  IS_REGEX_CAPTURING_BROKEN$1 = g === '';
});

/**
 * 定义原生的文本元素
 */
var isPlainTextElement$1 = makeMap('script,style,textarea', true);
var reCache$1 = {};
/** 解码的映射表 */
var decodingMap$1 = {
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&amp;': '&',
  '&#10;': '\n'
};
/** 编码的属性 */
var encodedAttr$1 = /&(?:lt|gt|quot|amp);/g;
/** 编码的属性 */
var encodedAttrWithNewLines$1 = /&(?:lt|gt|quot|amp|#10);/g;

// #5992
/** 忽略新行的标签正则表达式 */
var isIgnoreNewlineTag$1 = makeMap('pre,textarea', true);
var shouldIgnoreFirstNewline$1 = function (tag, html) { return tag && isIgnoreNewlineTag$1(tag) && html[0] === '\n'; };
/**
 * 解码属性
 * @param {*} value 
 * @param {*} shouldDecodeNewlines 
 */
function decodeAttr$1 (value, shouldDecodeNewlines) {
  var re = shouldDecodeNewlines ? encodedAttrWithNewLines$1 : encodedAttr$1;
  return value.replace(re, function (match) { return decodingMap$1[match]; })
}
/**
 * 分析HTML的函数
 * @param {*} html 模板字符串
 * @param {*} options 传入的处理方法和参数
 */
function parseHTML$1 (html, options) 
{
  var stack = [];
  var expectHTML = options.expectHTML;
  var isUnaryTag$$1 = options.isUnaryTag || no;
  var canBeLeftOpenTag$$1 = options.canBeLeftOpenTag || no;
  var index = 0;
  var last, lastTag;
  while (html) 
  {
    last = html;
    /**
     * 对于lastTag的值不为空或者不是原生的文本元素的处理
     */
    if (!lastTag || !isPlainTextElement$1(lastTag)) 
    {
      /**
       * 获取第一个<符出现的位置对于出现的位置为第一个值的处理
       */
      var textEnd = html.indexOf('<');
      if (textEnd === 0) 
      {
        if (comment$1.test(html)) 
        {
          var commentEnd = html.indexOf('-->');

          if (commentEnd >= 0) 
          {
            if (options.shouldKeepComment) 
            {
              options.comment(html.substring(4, commentEnd));
            }
            advance(commentEnd + 3);
            continue
          }
        }
        if (conditionalComment$1.test(html)) 
        {
          var conditionalEnd = html.indexOf(']>');

          if (conditionalEnd >= 0) 
          {
            advance(conditionalEnd + 2);
            continue
          }
        }
        var doctypeMatch = html.match(doctype$1);
        if (doctypeMatch) 
        {
          advance(doctypeMatch[0].length);
          continue
        }
        /**匹配结束标签 */
        var endTagMatch = html.match(endTag$1);
        if (endTagMatch) 
        {
          var curIndex = index;
          advance(endTagMatch[0].length);
          parseEndTag(endTagMatch[1], curIndex, index);
          continue
        }

        /**获取处理开始标签的处理 */
        var startTagMatch = parseStartTag();
        /**对于处理结果为真的处理 */
        if (startTagMatch) 
        {
          handleStartTag(startTagMatch);
          if (shouldIgnoreFirstNewline$1(lastTag, html)) 
          {
            advance(1);
          }
          continue
        }
      }

      var text = (void 0), rest = (void 0), next = (void 0);
      if (textEnd >= 0) 
      {
        rest = html.slice(textEnd);
        while (
          !endTag$1.test(rest) &&
          !startTagOpen$1.test(rest) &&
          !comment$1.test(rest) &&
          !conditionalComment$1.test(rest)
        ) 
        {
          // < in plain text, be forgiving and treat it as text
          next = rest.indexOf('<', 1);
          if (next < 0) 
          {
            break
          }
          textEnd += next;
          rest = html.slice(textEnd);
        }
        text = html.substring(0, textEnd);
        advance(textEnd);
      }

      if (textEnd < 0) 
      {
        text = html;
        html = '';
      }

      if (options.chars && text) 
      {
        options.chars(text);
      }
    } 
    /**
     * 对于lasttag的值为空或者lastTag的值为原生文本元素的处理
     */
    else 
    {
      var endTagLength = 0;
      var stackedTag = lastTag.toLowerCase();
      var reStackedTag = reCache$1[stackedTag] || (reCache$1[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
      var rest$1 = html.replace(reStackedTag, function (all, text, endTag) 
      {
        endTagLength = endTag.length;
        if (!isPlainTextElement$1(stackedTag) && stackedTag !== 'noscript') 
        {
          text = text
            .replace(/<!--([\s\S]*?)-->/g, '$1')
            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
        }
        if (shouldIgnoreFirstNewline$1(stackedTag, text)) 
        {
          text = text.slice(1);
        }
        if (options.chars) 
        {
          options.chars(text);
        }
        return ''
      });
      index += html.length - rest$1.length;
      html = rest$1;
      parseEndTag(stackedTag, index - endTagLength, index);
    }
    /**
     * 对于html的值为last的值的处理
     */
    if (html === last) 
    {
      options.chars && options.chars(html);
      if ("development" !== 'production' && !stack.length && options.warn) 
      {
        options.warn(("Mal-formatted tag at end of template: \"" + html + "\""));
      }
      break
    }
  }
  /**分析结束标签 */
  parseEndTag();
  /**
   * 更新当前的索引值获取字符串在此索引值后面的内容
   * @param {*} n 
   */
  function advance (n) 
  {
    index += n;
    html = html.substring(n);
  }
  /**
   * 分析开始标签
   * 返回匹配到结果
   */
  function parseStartTag () 
  {
    /**匹配开始标签 */
    var start = html.match(startTagOpen$1);
    if (start) 
    {
      var match = {
        tagName: start[1],
        attrs: [],
        start: index
      };
      /**前进 */
      advance(start[0].length);
      var end, attr;
      /**
       * 对于没有匹配到结束标签或者是匹配到属性的处理
       * 前进属性个数据长度，添加到匹配的属性数组中
       */
      while (!(end = html.match(startTagClose$1)) && (attr = html.match(attribute$1))) 
      {
        advance(attr[0].length);
        match.attrs.push(attr);
      }
      /**对于匹配到结束标签的处理
       * 返回匹配结果
       */
      if (end) 
      {
        match.unarySlash = end[1];
        advance(end[0].length);
        match.end = index;
        return match
      }
    }
  }
  /**
   * 开始标签的处理
   * @param {*} match 开始标签中的属性数组
   * 获取标签名
   */
  function handleStartTag (match) 
  {
    /**标签名 */
    var tagName = match.tagName;
    var unarySlash = match.unarySlash;
    /**这个值应该一直是真 */
    if (expectHTML) 
    {
      /**对于结束标签是p或者是非短语标签的处理 */
      if (lastTag === 'p' && isNonPhrasingTag(tagName)) 
      {
        parseEndTag(lastTag);
      }
      /** */
      if (canBeLeftOpenTag$$1(tagName) && lastTag === tagName) 
      {
        parseEndTag(tagName);
      }
    }

    var unary = isUnaryTag$$1(tagName) || !!unarySlash;

    var l = match.attrs.length;
    var attrs = new Array(l);
    for (var i = 0; i < l; i++) 
    {
      var args = match.attrs[i];
      // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
      if (IS_REGEX_CAPTURING_BROKEN$1 && args[0].indexOf('""') === -1) 
      {
        if (args[3] === '') 
        { 
          delete args[3]; 
        }
        if (args[4] === '') 
        { 
          delete args[4]; 
        }
        if (args[5] === '') 
        { 
          delete args[5]; 
        }
      }
      var value = args[3] || args[4] || args[5] || '';
      attrs[i] = {
        name: args[1],
        value: decodeAttr$1(
          value,
          options.shouldDecodeNewlines
        )
      };
    }

    if (!unary) 
    {
      stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs });
      lastTag = tagName;
    }

    if (options.start) 
    {
      options.start(tagName, attrs, unary, match.start, match.end);
    }
  }
  /**
   * 分析结束标签
   * @param {*} tagName 
   * @param {*} start 
   * @param {*} end 
   */
  function parseEndTag (tagName, start, end) 
  {
    var pos, lowerCasedTagName;
    if (start == null) 
    {
      start = index;
    }
    if (end == null) 
    {
      end = index;
    }

    if (tagName) 
    {
      lowerCasedTagName = tagName.toLowerCase();
    }

    // Find the closest opened tag of the same type
    if (tagName) 
    {
      for (pos = stack.length - 1; pos >= 0; pos--) 
      {
        if (stack[pos].lowerCasedTag === lowerCasedTagName) 
        {
          break
        }
      }
    } 
    else 
    {
      // If no tag name is provided, clean shop
      pos = 0;
    }

    if (pos >= 0) 
    {
      // Close all the open elements, up the stack
      for (var i = stack.length - 1; i >= pos; i--) 
      {
        if ("development" !== 'production' &&
          (i > pos || !tagName) &&
          options.warn
        ) 
        {
          options.warn(
            ("tag <" + (stack[i].tag) + "> has no matching end tag.")
          );
        }
        if (options.end) 
        {
          options.end(stack[i].tag, start, end);
        }
      }

      // Remove the open elements from the stack
      stack.length = pos;
      lastTag = pos && stack[pos - 1].tag;
    } 
    else if (lowerCasedTagName === 'br') 
    {
      if (options.start) 
      {
        options.start(tagName, [], true, start, end);
      }
    } 
    else if (lowerCasedTagName === 'p') 
    {
      if (options.start) 
      {
        options.start(tagName, [], false, start, end);
      }
      if (options.end) 
      {
        options.end(tagName, start, end);
      }
    }
  }
}

/*  */

/**默认的标签正则表达式 {{}}小括号中的.号和换行符只能出现0或者是1次*/
var defaultTagRE$1 = /\{\{((?:.|\n)+?)\}\}/g;
/**扩展的标签正则表达式 */
var regexEscapeRE$1 = /[-.*+?^${}()|[\]\/\\]/g;
/**创建正则表达式 */
var buildRegex$1 = cached(function (delimiters) {
  var open = delimiters[0].replace(regexEscapeRE$1, '\\$&');
  var close = delimiters[1].replace(regexEscapeRE$1, '\\$&');
  return new RegExp(open + '((?:.|\\n)+?)' + close, 'g')
});
/**
 * 分析处理文本
 * @param {*} text 
 * @param {*} delimiters 
 */
function parseText$1 (
  text,
  delimiters
) 
{
  /**定义使用的正则表达式 */
  var tagRE = delimiters ? buildRegex$1(delimiters) : defaultTagRE$1;
  /**对于没有匹配上的处理 */
  if (!tagRE.test(text)) 
  {
    return
  }
  var tokens = [];
  var lastIndex = tagRE.lastIndex = 0;
  var match, index;
  /**一直提取匹配的项 */
  while ((match = tagRE.exec(text))) 
  {
    index = match.index;
    // push text token
    if (index > lastIndex) 
    {
      tokens.push(JSON.stringify(text.slice(lastIndex, index)));
    }
    // tag token
    var exp = parseFilters(match[1].trim());
    tokens.push(("_s(" + exp + ")"));
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) 
  {
    tokens.push(JSON.stringify(text.slice(lastIndex)));
  }
  return tokens.join('+')
}

/*  */

/**
 * 产生组件模式
 * @param {*} el 
 * @param {*} value 
 * @param {*} modifiers 
 */


/**
 * 根据传入的数值，设置其数值或是设置方法
 * @param {*} value 
 * @param {*} assignment 
 */
function genAssignmentCode (
  value,
  assignment
) {
  /** 返回进行模块化处理结束后的值 */
  var res = parseModel(value);
  /** 对于值不为空的处理设置value的值为assignment的值 */
  if (res.key === null) {
    return (value + "=" + assignment)
  } else {
    /** 对于值为空的处理 */
    return ("$set(" + (res.exp) + ", " + (res.key) + ", " + assignment + ")")
  }
}

/**
 * Parse a v-model expression into a base path and a final key segment.
 * Handles both dot-path and possible square brackets.
 *
 * Possible cases:
 *
 * - test
 * - test[key]
 * - test[test1[key]]
 * - test["a"][key]
 * - xxx.test[a[a].test1[key]]
 * - test.xxx.a["asa"][test1[key]]
 *
 */

var len;
var str;
var chr;
var index;
var expressionPos;
var expressionEndPos;


/**
 * 模块分析
 * @param {*} val 
 */
function parseModel (val) {
  /** 获取字符串的长度 */
  len = val.length;
  /** 对于字符串中不存在方括号的处理 */
  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len - 1) {
    /** 获取最后一个点号的位置 */
    index = val.lastIndexOf('.');
    /** 对于找到点号的处理
     * 设置exp为属性key为值
     */
    if (index > -1) {
      return {
        exp: val.slice(0, index),
        key: '"' + val.slice(index + 1) + '"'
      }
    } else {
      /** 对于没有找到点号的处理 */
      return {
        exp: val,
        key: null
      }
    }
  }
  /** 对于存在方括号的处理 */
  str = val;
  index = expressionPos = expressionEndPos = 0;

  while (!eof()) {
    chr = next();
    /** 对于是头字符的处理 */
    if (isStringStart(chr)) {
      parseString(chr);
    } 
    /** 对于是方括号的处理 */
    else if (chr === 0x5B) {
      parseBracket(chr);
    }
  }
  return {
    exp: val.slice(0, expressionPos),
    key: val.slice(expressionPos + 1, expressionEndPos)
  }
}
/**
 * 获取字符串的下一个字符的编码值
 */
function next () 
{
  return str.charCodeAt(++index)
}
/**
 * 判断是否到了字符串的结尾
 */
function eof () {
  return index >= len
}
/**
 * 是否是字符串的开始，即判断传入的参数是否时单引号或者是双引号
 * @param {*} chr 
 */
function isStringStart (chr) {
  return chr === 0x22 || chr === 0x27
}
/**
 * 方括号的处理，返回找到匹配的方括号结束位置
 * @param {*} chr 
 */
function parseBracket (chr) {
  var inBracket = 1;
  expressionPos = index;
  while (!eof()) {
    chr = next();
    if (isStringStart(chr)) {
      parseString(chr);
      continue
    }
    /** 对于是方括号的处理 */
    if (chr === 0x5B) {
      inBracket++;
    }
    /** 对于是方括号结束的处理 */
    if (chr === 0x5D) {
      inBracket--;
    }
    if (inBracket === 0) {
      expressionEndPos = index;
      break
    }
  }
}
/**
 * 字符串分析
 * 在字符串中寻找是否还有此字符
 * @param {*} chr 
 */
function parseString (chr) {
  var stringQuote = chr;
  /** 一直循环到字符串结束 */
  while (!eof()) {
    /** 获取下一个字符的值 */
    chr = next();
    /** 如果在后续的字符串中找到此字符退出 */
    if (chr === stringQuote) {
      break
    }
  }
}

/*  */

/**
 * 基本警告
 * 控制台输出错误信息
 * @param {*} msg 错误信息
 */
function baseWarn$1 (msg) {
  console.error(("[Vue compiler]: " + msg));
}
/**
 * 去除模块功能
 * @param {*} modules 
 * @param {*} key 
 */
function pluckModuleFunction$1 (
  modules,
  key
) 
{
  return modules
    ? modules.map(function (m) { return m[key]; }).filter(function (_) { return _; })
    : []
}
/**
 * 向props数组中添加参数
 * @param {*} el 抽象元素
 * @param {*} name 属性名称
 * @param {*} value 属性值
 */
function addProp$1 (el, name, value) 
{
  (el.props || (el.props = [])).push({ name: name, value: value });
}
/**
 * 向attr数组中添加参数
 * @param {*} el 
 * @param {*} name 
 * @param {*} value 
 */
function addAttr$1 (el, name, value) 
{
  (el.attrs || (el.attrs = [])).push({ name: name, value: value });
}
/**
 * 向directive数组中添加参数，即添加指令
 * @param {*} el 对象
 * @param {*} name 
 * @param {*} rawName 
 * @param {*} value 
 * @param {*} arg 
 * @param {*} modifiers 
 */
function addDirective$1 (
  el,
  name,
  rawName,
  value,
  arg,
  modifiers
) 
{
  (el.directives || (el.directives = [])).push({ name: name, rawName: rawName, value: value, arg: arg, modifiers: modifiers });
}

/**
 * 添加处理函数
 * @param {*} el 对象
 * @param {*} name 
 * @param {*} value 
 * @param {*} modifiers 
 * @param {*} important 
 * @param {*} warn 
 */
function addHandler$1 (
  el,
  name,
  value,
  modifiers,
  important,
  warn
) 
{
  // warn prevent and passive modifier
  /* istanbul ignore if */
  if (
    "development" !== 'production' && warn &&
    modifiers && modifiers.prevent && modifiers.passive
  ) {
    warn(
      'passive and prevent can\'t be used together. ' +
      'Passive handler can\'t prevent default event.'
    );
  }
  // check capture modifier
  if (modifiers && modifiers.capture) 
  {
    delete modifiers.capture;
    name = '!' + name; // mark the event as captured
  }
  if (modifiers && modifiers.once) 
  {
    delete modifiers.once;
    name = '~' + name; // mark the event as once
  }
  /* istanbul ignore if */
  if (modifiers && modifiers.passive) 
  {
    delete modifiers.passive;
    name = '&' + name; // mark the event as passive
  }
  var events;
  if (modifiers && modifiers.native) 
  {
    delete modifiers.native;
    events = el.nativeEvents || (el.nativeEvents = {});
  } 
  else 
  {
    events = el.events || (el.events = {});
  }
  var newHandler = { value: value, modifiers: modifiers };
  var handlers = events[name];
  /* istanbul ignore if */
  if (Array.isArray(handlers)) 
  {
    important ? handlers.unshift(newHandler) : handlers.push(newHandler);
  } 
  else if (handlers) 
  {
    events[name] = important ? [newHandler, handlers] : [handlers, newHandler];
  } 
  else 
  {
    events[name] = newHandler;
  }
}
/**
 * 获取绑定的属性
 * @param {*} el DOM对象
 * @param {*} name 属性名称
 * @param {*} getStatic 获取静态状态,这里是是否获取原生的属性的标记
 */
function getBindingAttr$1 (
  el,
  name,
  getStatic
) 
{
  /**获取绑定属性 */
  var dynamicValue =
    getAndRemoveAttr$1(el, ':' + name) ||
    getAndRemoveAttr$1(el, 'v-bind:' + name);
  /**对于绑定属性不为空的处理 */
  if (dynamicValue != null) 
  {
    /**返回处理之后的表达式 */
    return parseFilters(dynamicValue)
  } 
  /**对于 */
  else if (getStatic !== false) 
  {
    var staticValue = getAndRemoveAttr$1(el, name);
    if (staticValue != null) 
    {
      return JSON.stringify(staticValue)
    }
  }
}

/**
 * 获取或者是移除属性，返回对应属性的值
 * @param {*} el 对象
 * @param {*} name 指令名称
 * @param {*} removeFromMap 是否删除
 */
function getAndRemoveAttr$1 (
  el,
  name,
  removeFromMap
) 
{
  var val;
  /**对于对象存在此属性的处理 */
  if ((val = el.attrsMap[name]) != null) 
  {
    /**获取属性列表 */
    var list = el.attrsList;
    for (var i = 0, l = list.length; i < l; i++) 
    {
      if (list[i].name === name) 
      {
        list.splice(i, 1);
        break
      }
    }
  }
  /**删除的处理 */
  if (removeFromMap) 
  {
    delete el.attrsMap[name];
  }
  return val
}

/*  */

var onRE = /^@|^v-on:/;
var dirRE = /^v-|^@|^:/;
var forAliasRE = /(.*?)\s+(?:in|of)\s+(.*)/;
var forIteratorRE = /\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/;

var argRE = /:(.*)$/;
var bindRE = /^:|^v-bind:/;
var modifierRE = /\.[^.]+/g;

var decodeHTMLCached = cached(he.decode);

// configurable state
var warn$1;
var delimiters;
var transforms;
var preTransforms;
var postTransforms;
var platformIsPreTag;
var platformMustUseProp;
var platformGetTagNamespace;
/** 定义属性的格式 */


/**
 * 产生抽象元素
 * 根据对标签的解析产生对应的抽象结构
 * @param {*} tag 元素标签
 * @param {*} attrs 元素属性
 * @param {*} parent 元素的父节点
 */
function createASTElement (
  tag,
  attrs,
  parent
) 
{
  return {
    type: 1,
    tag: tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap(attrs),
    parent: parent,
    children: []
  }
}

/**
 * 将HTML文本转换为抽象结构
 * @param {*} template HTML字符串，即模板字符串
 * @param {*} options 抽象结构体
 * 获取对象的
 * 实现只是警告一次的函数
 * 实现结束预处理的函数
 * 调用分析HTML
 */
function parse (
  template,
  options
) 
{
  warn$1 = options.warn || baseWarn$1;

  platformIsPreTag = options.isPreTag || no;
  platformMustUseProp = options.mustUseProp || no;
  platformGetTagNamespace = options.getTagNamespace || no;

  transforms = pluckModuleFunction$1(options.modules, 'transformNode');
  preTransforms = pluckModuleFunction$1(options.modules, 'preTransformNode');
  postTransforms = pluckModuleFunction$1(options.modules, 'postTransformNode');

  delimiters = options.delimiters;

  var stack = [];
  var preserveWhitespace = options.preserveWhitespace !== false;
  var root;
  var currentParent;
  var inVPre = false;
  var inPre = false;
  var warned = false;
  /**
   * 警告一次的处理，
   * 如果没有警告过进行警告，如果已经警告过不在进行警告
   * @param {*} msg 
   */
  function warnOnce (msg) {
    if (!warned) 
    {
      warned = true;
      warn$1(msg);
    }
  }
  /**
   * 
   * @param {*} element 
   */
  function endPre (element) 
  {
    // check pre state
    if (element.pre) 
    {
      inVPre = false;
    }
    if (platformIsPreTag(element.tag)) 
    {
      inPre = false;
    }
  }
  /**
   * 调用分析HTML文件
   */
  parseHTML$1(template, {
    warn: warn$1,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldKeepComment: options.comments,
    /**
     * 
     * @param {*} tag 
     * @param {*} attrs 
     * @param {*} unary 
     */
    start: function start (tag, attrs, unary) 
    {
      // check namespace.
      // inherit parent ns if there is one
      var ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag);

      // handle IE svg bug
      /* istanbul ignore if */
      if (isIE$1 && ns === 'svg') 
      {
        attrs = guardIESVGBug(attrs);
      }

      var element = createASTElement(tag, attrs, currentParent);
      if (ns) 
      {
        element.ns = ns;
      }

      if (isForbiddenTag(element) && !isServerRendering$1()) 
      {
        element.forbidden = true;
        "development" !== 'production' && warn$1(
          'Templates should only be responsible for mapping the state to the ' +
          'UI. Avoid placing tags with side-effects in your templates, such as ' +
          "<" + tag + ">" + ', as they will not be parsed.'
        );
      }

      // apply pre-transforms
      for (var i = 0; i < preTransforms.length; i++) 
      {
        element = preTransforms[i](element, options) || element;
      }

      if (!inVPre) 
      {
        processPre(element);
        if (element.pre) 
        {
          inVPre = true;
        }
      }
      if (platformIsPreTag(element.tag)) 
      {
        inPre = true;
      }
      if (inVPre) 
      {
        processRawAttrs(element);
      } 
      else if (!element.processed) 
      {
        // structural directives
        processFor(element);
        processIf(element);
        processOnce(element);
        // element-scope stuff
        processElement(element, options);
      }
      /**
       * 检测根的约束条件
       * @param {*} el 
       */
      function checkRootConstraints (el) 
      {
        {
          /**
           * 获取el 对象的标签
           */
          if (el.tag === 'slot' || el.tag === 'template') 
          {
            warnOnce(
              "Cannot use <" + (el.tag) + "> as component root element because it may " +
              'contain multiple nodes.'
            );
          }
          if (el.attrsMap.hasOwnProperty('v-for')) 
          {
            warnOnce(
              'Cannot use v-for on stateful component root element because ' +
              'it renders multiple elements.'
            );
          }
        }
      }

      // tree management
      if (!root) 
      {
        root = element;
        checkRootConstraints(root);
      } 
      else if (!stack.length) 
      {
        // allow root elements with v-if, v-else-if and v-else
        if (root.if && (element.elseif || element.else)) 
        {
          checkRootConstraints(element);
          addIfCondition(root, {
            exp: element.elseif,
            block: element
          });
        } 
        else {
          warnOnce(
            "Component template should contain exactly one root element. " +
            "If you are using v-if on multiple elements, " +
            "use v-else-if to chain them instead."
          );
        }
      }
      if (currentParent && !element.forbidden) 
      {
        if (element.elseif || element.else) 
        {
          processIfConditions(element, currentParent);
        } 
        else if (element.slotScope) 
        { // scoped slot
          currentParent.plain = false;
          var name = element.slotTarget || '"default"';(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
        } 
        else 
        {
          currentParent.children.push(element);
          element.parent = currentParent;
        }
      }
      if (!unary) 
      {
        currentParent = element;
        stack.push(element);
      } 
      else 
      {
        endPre(element);
      }
      // apply post-transforms
      for (var i$1 = 0; i$1 < postTransforms.length; i$1++) 
      {
        postTransforms[i$1](element, options);
      }
    },
    /**
     * 
     */
    end: function end () 
    {
      // remove trailing whitespace
      var element = stack[stack.length - 1];
      var lastNode = element.children[element.children.length - 1];
      if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
        element.children.pop();
      }
      // pop stack
      stack.length -= 1;
      currentParent = stack[stack.length - 1];
      endPre(element);
    },
    /**
     * 
     * @param {*} text 
     */
    chars: function chars (text) 
    {
      if (!currentParent) 
      {
        {
          if (text === template) 
          {
            warnOnce(
              'Component template requires a root element, rather than just text.'
            );
          } 
          else if ((text = text.trim())) 
          {
            warnOnce(
              ("text \"" + text + "\" outside root element will be ignored.")
            );
          }
        }
        return
      }
      // IE textarea placeholder bug
      /* istanbul ignore if */
      if (isIE$1 &&
        currentParent.tag === 'textarea' &&
        currentParent.attrsMap.placeholder === text
      ) 
      {
        return
      }
      var children = currentParent.children;
      text = inPre || text.trim()
        ? isTextTag(currentParent) ? text : decodeHTMLCached(text)
        // only preserve whitespace if its not right after a starting tag
        : preserveWhitespace && children.length ? ' ' : '';
      if (text) 
      {
        var expression;
        if (!inVPre && text !== ' ' && (expression = parseText$1(text, delimiters))) 
        {
          children.push({
            type: 2,
            expression: expression,
            text: text
          });
        } 
        else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') 
        {
          children.push({
            type: 3,
            text: text
          });
        }
      }
    },
    /**
     * 
     * @param {*} text 
     */
    comment: function comment (text) 
    {
      currentParent.children.push({
        type: 3,
        text: text,
        isComment: true
      });
    }
  });
  return root
}
/**
 * 预指令的处理
 * 获取元素对象中的预处理的属性值，
 * 如果值不为NULL设置值的pre属性的值为真
 * @param {*} el 
 */
function processPre (el) {
  if (getAndRemoveAttr$1(el, 'v-pre') != null) {
    el.pre = true;
  }
}
/**
 * 原始属性的处理
 * @param {*} el 
 */
function processRawAttrs (el) {
  /** 获取对象的属性数组 */
  var l = el.attrsList.length;
  /** 对于数组长度大于0的处理
   * 将属性名和属性值组成的数组存储在el的attrs数组中
   */
  if (l) {
    var attrs = el.attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      attrs[i] = {
        name: el.attrsList[i].name,
        value: JSON.stringify(el.attrsList[i].value)
      };
    }
  } else if (!el.pre) {
    /** 对于el的预处理属性为假的处理，设置元素的plain属性为真 */
    // non root node in pre blocks with no attributes
    el.plain = true;
  }
}
/**
 * 处理元素
 * @param {*} element 
 * @param {*} options 
 */
function processElement (element, options) {
  processKey(element);

  // determine whether this is a plain element after
  // removing structural attributes
  element.plain = !element.key && !element.attrsList.length;

  processRef(element);
  processSlot(element);
  processComponent(element);
  for (var i = 0; i < transforms.length; i++) {
    element = transforms[i](element, options) || element;
  }
  processAttrs(element);
}
/**
 * 处理key属性
 * 如果此属性存在设置此元素的key属性的值为返回的表达式
 * @param {*} el 
 */
function processKey (el) {
  var exp = getBindingAttr$1(el, 'key');
  if (exp) {
    if ("development" !== 'production' && el.tag === 'template') {
      warn$1("<template> cannot be keyed. Place the key on real elements instead.");
    }
    el.key = exp;
  }
}
/**
 * 处理ref属性
 * @param {*} el 
 */
function processRef (el) {
  /** 获取此对象ref属性的值 */
  var ref = getBindingAttr$1(el, 'ref');
  /** 对于值不为假的处理
   * 设置el的ref属性为ref属性的值
   * 设置refInFor，即是否有for属性
   */
  if (ref) {
    el.ref = ref;
    el.refInFor = checkInFor(el);
  }
}
/**
 * for指令的处理
 * @param {*} el 
 */
function processFor (el) {
  var exp;
  if ((exp = getAndRemoveAttr$1(el, 'v-for'))) {
    var inMatch = exp.match(forAliasRE);
    if (!inMatch) {
      "development" !== 'production' && warn$1(
        ("Invalid v-for expression: " + exp)
      );
      return
    }
    el.for = inMatch[2].trim();
    var alias = inMatch[1].trim();
    var iteratorMatch = alias.match(forIteratorRE);
    if (iteratorMatch) {
      el.alias = iteratorMatch[1].trim();
      el.iterator1 = iteratorMatch[2].trim();
      if (iteratorMatch[3]) {
        el.iterator2 = iteratorMatch[3].trim();
      }
    } else {
      el.alias = alias;
    }
  }
}
/**
 * 处理v-if指令
 * @param {*} el 
 */
function processIf (el) {
  var exp = getAndRemoveAttr$1(el, 'v-if');
  if (exp) {
    el.if = exp;
    addIfCondition(el, {
      exp: exp,
      block: el
    });
  } else {
    if (getAndRemoveAttr$1(el, 'v-else') != null) {
      el.else = true;
    }
    var elseif = getAndRemoveAttr$1(el, 'v-else-if');
    if (elseif) {
      el.elseif = elseif;
    }
  }
}
/**
 * 
 * @param {*} el 
 * @param {*} parent 
 */
function processIfConditions (el, parent) {
  var prev = findPrevElement(parent.children);
  if (prev && prev.if) {
    addIfCondition(prev, 
      {
      exp: el.elseif,
      block: el
    });
  } else {
    warn$1(
      "v-" + (el.elseif ? ('else-if="' + el.elseif + '"') : 'else') + " " +
      "used on element <" + (el.tag) + "> without corresponding v-if."
    );
  }
}
/**
 * 查找前面的元素
 * @param {*} children 
 */
function findPrevElement (children) {
  var i = children.length;
  while (i--) {
    if (children[i].type === 1) {
      return children[i]
    } else {
      if ("development" !== 'production' && children[i].text !== ' ') {
        warn$1(
          "text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
          "will be ignored."
        );
      }
      children.pop();
    }
  }
}
/**
 * 
 * @param {*} el 
 * @param {*} condition 
 */
function addIfCondition (el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }
  el.ifConditions.push(condition);
}
/**
 * 处理一次
 * @param {*} el 
 */
function processOnce (el) {
  /**
   * 获取v-once属性，并设置对象的once属性为此属性中是否存在v-once
   */
  var once$$1 = getAndRemoveAttr$1(el, 'v-once');
  if (once$$1 != null) {
    el.once = true;
  }
}
/**
 * 处理槽
 * @param {*} el 
 */
function processSlot (el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr$1(el, 'name');
    if ("development" !== 'production' && el.key) {
      warn$1(
        "`key` does not work on <slot> because slots are abstract outlets " +
        "and can possibly expand into multiple elements. " +
        "Use the key on a wrapping element instead."
      );
    }
  } else {
    var slotScope;
    if (el.tag === 'template') {
      slotScope = getAndRemoveAttr$1(el, 'scope');
      /* istanbul ignore if */
      if ("development" !== 'production' && slotScope) {
        warn$1(
          "the \"scope\" attribute for scoped slots have been deprecated and " +
          "replaced by \"slot-scope\" since 2.5. The new \"slot-scope\" attribute " +
          "can also be used on plain elements in addition to <template> to " +
          "denote scoped slots.",
          true
        );
      }
      el.slotScope = slotScope || getAndRemoveAttr$1(el, 'slot-scope');
    } else if ((slotScope = getAndRemoveAttr$1(el, 'slot-scope'))) {
      el.slotScope = slotScope;
    }
    var slotTarget = getBindingAttr$1(el, 'slot');
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
      // preserve slot as an attribute for native shadow DOM compat
      // only for non-scoped slots.
      if (!el.slotScope) {
        addAttr$1(el, 'slot', slotTarget);
      }
    }
  }
}
/**
 * 组件处理
 * @param {*} el 
 */
function processComponent (el) {
  var binding;
  if ((binding = getBindingAttr$1(el, 'is'))) {
    el.component = binding;
  }
  if (getAndRemoveAttr$1(el, 'inline-template') != null) {
    el.inlineTemplate = true;
  }
}
/**
 * 处理属性
 * @param {*} el 
 */
function processAttrs (el) {
  var list = el.attrsList;
  var i, l, name, rawName, value, modifiers, isProp;
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name;
    value = list[i].value;
    if (dirRE.test(name)) {
      // mark element as dynamic
      el.hasBindings = true;
      // modifiers
      modifiers = parseModifiers(name);
      if (modifiers) {
        name = name.replace(modifierRE, '');
      }
      if (bindRE.test(name)) { // v-bind
        name = name.replace(bindRE, '');
        value = parseFilters(value);
        isProp = false;
        if (modifiers) {
          if (modifiers.prop) {
            isProp = true;
            name = camelize(name);
            if (name === 'innerHtml') { name = 'innerHTML'; }
          }
          if (modifiers.camel) {
            name = camelize(name);
          }
          if (modifiers.sync) {
            addHandler$1(
              el,
              ("update:" + (camelize(name))),
              genAssignmentCode(value, "$event")
            );
          }
        }
        if (isProp || (
          !el.component && platformMustUseProp(el.tag, el.attrsMap.type, name)
        )) {
          addProp$1(el, name, value);
        } else {
          addAttr$1(el, name, value);
        }
      } else if (onRE.test(name)) { // v-on
        name = name.replace(onRE, '');
        addHandler$1(el, name, value, modifiers, false, warn$1);
      } else { // normal directives
        name = name.replace(dirRE, '');
        // parse arg
        var argMatch = name.match(argRE);
        var arg = argMatch && argMatch[1];
        if (arg) {
          name = name.slice(0, -(arg.length + 1));
        }
        addDirective$1(el, name, rawName, value, arg, modifiers);
        if ("development" !== 'production' && name === 'model') {
          checkForAliasModel(el, value);
        }
      }
    } else {
      // literal attribute
      {
        var expression = parseText$1(value, delimiters);
        if (expression) {
          warn$1(
            name + "=\"" + value + "\": " +
            'Interpolation inside attributes has been removed. ' +
            'Use v-bind or the colon shorthand instead. For example, ' +
            'instead of <div id="{{ val }}">, use <div :id="val">.'
          );
        }
      }
      addAttr$1(el, name, JSON.stringify(value));
    }
  }
}
/**
 * 判断此属性向上是否有for属性
 * @param {*} el 
 */
function checkInFor (el) {
  var parent = el;
  while (parent) {
    if (parent.for !== undefined) {
      return true
    }
    parent = parent.parent;
  }
  return false
}
/**
 * 
 * @param {*} name 
 */
function parseModifiers (name) {
  var match = name.match(modifierRE);
  if (match) {
    var ret = {};
    match.forEach(function (m) { ret[m.slice(1)] = true; });
    return ret
  }
}
/**
 * 将属性数组中的name属性值为键value属性值为值的映射表
 * @param {*} attrs 属性数组
 */
function makeAttrsMap (attrs) {
  var map = {};
  for (var i = 0, l = attrs.length; i < l; i++) {
    if (
      "development" !== 'production' &&
      map[attrs[i].name] && !isIE$1 && !isEdge$1
    ) {
      warn$1('duplicate attribute: ' + attrs[i].name);
    }
    map[attrs[i].name] = attrs[i].value;
  }
  return map
}

// for script (e.g. type="x/template") or style, do not decode content
/**
 * 判断是否是文本标签即是否是script和style标签
 * @param {*} el 
 */
function isTextTag (el) {
  return el.tag === 'script' || el.tag === 'style'
}
/**
 * 
 * @param {*} el DOM对象的抽象形式
 */
function isForbiddenTag (el) {
  return (
    el.tag === 'style' ||
    (el.tag === 'script' && (
      !el.attrsMap.type ||
      el.attrsMap.type === 'text/javascript'
    ))
  )
}

var ieNSBug = /^xmlns:NS\d+/;
var ieNSPrefix = /^NS\d+:/;

/**
 * 
 * @param {*} attrs 
 */
function guardIESVGBug (attrs) {
  var res = [];
  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    if (!ieNSBug.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix, '');
      res.push(attr);
    }
  }
  return res
}
/**
 * 
 * @param {*} el 
 * @param {*} value 
 */
function checkForAliasModel (el, value) {
  var _el = el;
  while (_el) {
    if (_el.for && _el.alias === value) {
      warn$1(
        "<" + (el.tag) + " v-model=\"" + value + "\">: " +
        "You are binding v-model directly to a v-for iteration alias. " +
        "This will not be able to modify the v-for source array because " +
        "writing to the alias is like modifying a function local variable. " +
        "Consider using an array of objects and use v-model on an object property instead."
      );
    }
    _el = _el.parent;
  }
}

/*  */

/**
 * Expand input[v-model] with dyanmic type bindings into v-if-else chains
 * Turn this:
 *   <input v-model="data[type]" :type="type">
 * into this:
 *   <input v-if="type === 'checkbox'" type="checkbox" v-model="data[type]">
 *   <input v-else-if="type === 'radio'" type="radio" v-model="data[type]">
 *   <input v-else :type="type" v-model="data[type]">
 */

function preTransformNode (el, options) {
  if (el.tag === 'input') {
    var map = el.attrsMap;
    if (map['v-model'] && (map['v-bind:type'] || map[':type'])) {
      var typeBinding = getBindingAttr(el, 'type');
      var ifCondition = getAndRemoveAttr(el, 'v-if', true);
      var ifConditionExtra = ifCondition ? ("&&(" + ifCondition + ")") : "";
      // 1. checkbox
      var branch0 = cloneASTElement(el);
      // process for on the main node
      processFor(branch0);
      addRawAttr(branch0, 'type', 'checkbox');
      processElement(branch0, options);
      branch0.processed = true; // prevent it from double-processed
      branch0.if = "type==='checkbox'" + ifConditionExtra;
      addIfCondition(branch0, {
        exp: branch0.if,
        block: branch0
      });
      // 2. add radio else-if condition
      var branch1 = cloneASTElement(el);
      getAndRemoveAttr(branch1, 'v-for', true);
      addRawAttr(branch1, 'type', 'radio');
      processElement(branch1, options);
      addIfCondition(branch0, {
        exp: "type==='radio'" + ifConditionExtra,
        block: branch1
      });
      // 3. other
      var branch2 = cloneASTElement(el);
      getAndRemoveAttr(branch2, 'v-for', true);
      addRawAttr(branch2, ':type', typeBinding);
      processElement(branch2, options);
      addIfCondition(branch0, {
        exp: ifCondition,
        block: branch2
      });
      return branch0
    }
  }
}

function cloneASTElement (el) {
  return createASTElement(el.tag, el.attrsList.slice(), el.parent)
}

function addRawAttr (el, name, value) {
  el.attrsMap[name] = value;
  el.attrsList.push({ name: name, value: value });
}

var model = {
  preTransformNode: preTransformNode
};

var modules = [
  klass,
  style,
  model
];

/*  */
/**\vue-master\src\core\config.js */
/**导入no,noop,indentity
 * no:无论传入什么参数总是返回否
 * noop:不做任何有效的处理
 * indentity:返回相同的参数
 */
/**导入生命周期的钩子函数 */
/**
 * 配置信息
 */

/**默认导出 */
var config$1 = ({
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
  productionTip: "development" !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: "development" !== 'production',

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
});
/**end \vue-master\src\core\config.js */

/*  */

/**
 * 产生组件模式
 * @param {*} el 
 * @param {*} value 
 * @param {*} modifiers 
 */
function genComponentModel$1 (
  el,
  value,
  modifiers
) {
  var ref = modifiers || {};
  var number = ref.number;
  var trim = ref.trim;
  /** 设置基本的表达式 */
  var baseValueExpression = '$$v';
  var valueExpression = baseValueExpression;
  if (trim) {
    valueExpression =
      "(typeof " + baseValueExpression + " === 'string'" +
        "? " + baseValueExpression + ".trim()" +
        ": " + baseValueExpression + ")";
  }
  if (number) {
    valueExpression = "_n(" + valueExpression + ")";
  }
  var assignment = genAssignmentCode$1(value, valueExpression);

  el.model = {
    value: ("(" + value + ")"),
    expression: ("\"" + value + "\""),
    callback: ("function (" + baseValueExpression + ") {" + assignment + "}")
  };
}

/**
 * 根据传入的数值，设置其数值或是设置方法
 * @param {*} value 
 * @param {*} assignment 
 */
function genAssignmentCode$1 (
  value,
  assignment
) {
  /** 返回进行模块化处理结束后的值 */
  var res = parseModel$1(value);
  /** 对于值不为空的处理设置value的值为assignment的值 */
  if (res.key === null) {
    return (value + "=" + assignment)
  } else {
    /** 对于值为空的处理 */
    return ("$set(" + (res.exp) + ", " + (res.key) + ", " + assignment + ")")
  }
}

/**
 * Parse a v-model expression into a base path and a final key segment.
 * Handles both dot-path and possible square brackets.
 *
 * Possible cases:
 *
 * - test
 * - test[key]
 * - test[test1[key]]
 * - test["a"][key]
 * - xxx.test[a[a].test1[key]]
 * - test.xxx.a["asa"][test1[key]]
 *
 */

var len$1;
var str$1;
var chr$1;
var index$1;
var expressionPos$1;
var expressionEndPos$1;


/**
 * 模块分析
 * @param {*} val 
 */
function parseModel$1 (val) {
  /** 获取字符串的长度 */
  len$1 = val.length;
  /** 对于字符串中不存在方括号的处理 */
  if (val.indexOf('[') < 0 || val.lastIndexOf(']') < len$1 - 1) {
    /** 获取最后一个点号的位置 */
    index$1 = val.lastIndexOf('.');
    /** 对于找到点号的处理
     * 设置exp为属性key为值
     */
    if (index$1 > -1) {
      return {
        exp: val.slice(0, index$1),
        key: '"' + val.slice(index$1 + 1) + '"'
      }
    } else {
      /** 对于没有找到点号的处理 */
      return {
        exp: val,
        key: null
      }
    }
  }
  /** 对于存在方括号的处理 */
  str$1 = val;
  index$1 = expressionPos$1 = expressionEndPos$1 = 0;

  while (!eof$1()) {
    chr$1 = next$1();
    /** 对于是头字符的处理 */
    if (isStringStart$1(chr$1)) {
      parseString$1(chr$1);
    } 
    /** 对于是方括号的处理 */
    else if (chr$1 === 0x5B) {
      parseBracket$1(chr$1);
    }
  }
  return {
    exp: val.slice(0, expressionPos$1),
    key: val.slice(expressionPos$1 + 1, expressionEndPos$1)
  }
}
/**
 * 获取字符串的下一个字符的编码值
 */
function next$1 () 
{
  return str$1.charCodeAt(++index$1)
}
/**
 * 判断是否到了字符串的结尾
 */
function eof$1 () {
  return index$1 >= len$1
}
/**
 * 是否是字符串的开始，即判断传入的参数是否时单引号或者是双引号
 * @param {*} chr 
 */
function isStringStart$1 (chr) {
  return chr === 0x22 || chr === 0x27
}
/**
 * 方括号的处理，返回找到匹配的方括号结束位置
 * @param {*} chr 
 */
function parseBracket$1 (chr) {
  var inBracket = 1;
  expressionPos$1 = index$1;
  while (!eof$1()) {
    chr = next$1();
    if (isStringStart$1(chr)) {
      parseString$1(chr);
      continue
    }
    /** 对于是方括号的处理 */
    if (chr === 0x5B) {
      inBracket++;
    }
    /** 对于是方括号结束的处理 */
    if (chr === 0x5D) {
      inBracket--;
    }
    if (inBracket === 0) {
      expressionEndPos$1 = index$1;
      break
    }
  }
}
/**
 * 字符串分析
 * 在字符串中寻找是否还有此字符
 * @param {*} chr 
 */
function parseString$1 (chr) {
  var stringQuote = chr;
  /** 一直循环到字符串结束 */
  while (!eof$1()) {
    /** 获取下一个字符的值 */
    chr = next$1();
    /** 如果在后续的字符串中找到此字符退出 */
    if (chr === stringQuote) {
      break
    }
  }
}

/*  */

var warn$2;

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
/**
 * 根据el的对应的属性进行相关的模式化处理，返回成功或者是失败
 * @param {*} el 元素对象
 * @param {*} dir 
 * @param {*} _warn 警告处理函数
 */
function model$1 (
  el,
  dir,
  _warn
) 
{
  warn$2 = _warn;
  var value = dir.value;
  var modifiers = dir.modifiers;
  var tag = el.tag;
  var type = el.attrsMap.type;

  {
    // inputs with type="file" are read only and setting the input's
    // value will throw an error.
    if (tag === 'input' && type === 'file') 
    {
      warn$2(
        "<" + (el.tag) + " v-model=\"" + value + "\" type=\"file\">:\n" +
        "File inputs are read only. Use a v-on:change listener instead."
      );
    }
  }
  /**对于是组件的处理 */
  if (el.component) 
  {
    genComponentModel$1(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } 
  /**对于标签是select的处理 */
  else if (tag === 'select') 
  {
    genSelect(el, value, modifiers);
  } 
  /**对于标签是input且类型是复选框的处理 */
  else if (tag === 'input' && type === 'checkbox') 
  {
    genCheckboxModel(el, value, modifiers);
  } 
  /**对于是单选框的处理 */
  else if (tag === 'input' && type === 'radio') 
  {
    genRadioModel(el, value, modifiers);
  } 
  /**对于是input或者是textarea的处理 */
  else if (tag === 'input' || tag === 'textarea') 
  {
    genDefaultModel(el, value, modifiers);
  } 
  /**对于不是预留标签的处理 */
  else if (!config$1.isReservedTag(tag)) 
  {
    genComponentModel$1(el, value, modifiers);
    // component v-model doesn't need extra runtime
    return false
  } 
  /**其他的错误处理 */
  else {
    warn$2(
      "<" + (el.tag) + " v-model=\"" + value + "\">: " +
      "v-model is not supported on this element type. " +
      'If you are working with contenteditable, it\'s recommended to ' +
      'wrap a library dedicated for that purpose inside a custom component.'
    );
  }

  // ensure runtime directive metadata
  return true
}
/**
 * 
 * @param {*} el 
 * @param {*} value 
 * @param {*} modifiers 
 */
function genCheckboxModel (
  el,
  value,
  modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  var trueValueBinding = getBindingAttr(el, 'true-value') || 'true';
  var falseValueBinding = getBindingAttr(el, 'false-value') || 'false';
  addProp(el, 'checked',
    "Array.isArray(" + value + ")" +
      "?_i(" + value + "," + valueBinding + ")>-1" + (
        trueValueBinding === 'true'
          ? (":(" + value + ")")
          : (":_q(" + value + "," + trueValueBinding + ")")
      )
  );
  addHandler(el, 'change',
    "var $$a=" + value + "," +
        '$$el=$event.target,' +
        "$$c=$$el.checked?(" + trueValueBinding + "):(" + falseValueBinding + ");" +
    'if(Array.isArray($$a)){' +
      "var $$v=" + (number ? '_n(' + valueBinding + ')' : valueBinding) + "," +
          '$$i=_i($$a,$$v);' +
      "if($$el.checked){$$i<0&&(" + value + "=$$a.concat([$$v]))}" +
      "else{$$i>-1&&(" + value + "=$$a.slice(0,$$i).concat($$a.slice($$i+1)))}" +
    "}else{" + (genAssignmentCode$1(value, '$$c')) + "}",
    null, true
  );
}
/**
 * 产生单选框模式
 * @param {*} el 元素对象
 * @param {*} value 
 * @param {*} modifiers 
 */
function genRadioModel (
    el,
    value,
    modifiers
) {
  var number = modifiers && modifiers.number;
  var valueBinding = getBindingAttr(el, 'value') || 'null';
  valueBinding = number ? ("_n(" + valueBinding + ")") : valueBinding;
  addProp(el, 'checked', ("_q(" + value + "," + valueBinding + ")"));
  addHandler(el, 'change', genAssignmentCode$1(value, valueBinding), null, true);
}
/**
 * 产生选择模式
 * @param {*} el 
 * @param {*} value 
 * @param {*} modifiers 
 */
function genSelect (
    el,
    value,
    modifiers
) {
  var number = modifiers && modifiers.number;
  var selectedVal = "Array.prototype.filter" +
    ".call($event.target.options,function(o){return o.selected})" +
    ".map(function(o){var val = \"_value\" in o ? o._value : o.value;" +
    "return " + (number ? '_n(val)' : 'val') + "})";

  var assignment = '$event.target.multiple ? $$selectedVal : $$selectedVal[0]';
  var code = "var $$selectedVal = " + selectedVal + ";";
  code = code + " " + (genAssignmentCode$1(value, assignment));
  addHandler(el, 'change', code, null, true);
}
/**
 * 产生默认模式
 * @param {*} el 
 * @param {*} value 
 * @param {*} modifiers 
 */
function genDefaultModel (
  el,
  value,
  modifiers
) 
{
  /** */
  var type = el.attrsMap.type;
  /** */
  var ref = modifiers || {};
  var lazy = ref.lazy;
  var number = ref.number;
  var trim = ref.trim;
  var needCompositionGuard = !lazy && type !== 'range';
  /** */
  var event = lazy
    ? 'change'
    : type === 'range'
      ? RANGE_TOKEN
      : 'input';
  /**设置数值的表达式 */
  var valueExpression = '$event.target.value';
  if (trim) 
  {
    valueExpression = "$event.target.value.trim()";
  }
  if (number) 
  {
    valueExpression = "_n(" + valueExpression + ")";
  }

  var code = genAssignmentCode$1(value, valueExpression);
  if (needCompositionGuard) 
  {
    code = "if($event.target.composing)return;" + code;
  }

  addProp(el, 'value', ("(" + value + ")"));
  addHandler(el, event, code, null, true);
  if (trim || number) 
  {
    addHandler(el, 'blur', '$forceUpdate()');
  }
}

/*  */

/**
 * 向元素的props属性中添加textContent数据
 * @param {*} el 抽象元素
 * @param {*} dir 
 */
function text (el, dir) 
{
  if (dir.value) 
  {
    addProp(el, 'textContent', ("_s(" + (dir.value) + ")"));
  }
}

/*  */

/**
 * 向属性中添加innerHTML属性
 * @param {*} el 元素对象
 * @param {*} dir 
 */
function html (el, dir) 
{
  if (dir.value) 
  {
    addProp(el, 'innerHTML', ("_s(" + (dir.value) + ")"));
  }
}

var directives = {
  model: model$1,
  text: text,
  html: html
};

/*  */

var isUnaryTag$1 = makeMap(
  'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
  'link,meta,param,source,track,wbr'
);

// Elements that you can, intentionally, leave open
// (and which close themselves)
var canBeLeftOpenTag$1 = makeMap(
  'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source'
);

// HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
// Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
var isNonPhrasingTag$1 = makeMap(
  'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
  'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
  'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
  'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
  'title,tr,track'
);

/*  */

/**
 * 定义基本的指令
 */
var baseOptions = {
  expectHTML: true,
  modules: modules,
  directives: directives,
  isPreTag: isPreTag,
  isUnaryTag: isUnaryTag$1,
  mustUseProp: mustUseProp,
  canBeLeftOpenTag: canBeLeftOpenTag$1,
  isReservedTag: isReservedTag,
  getTagNamespace: getTagNamespace,
  staticKeys: genStaticKeys(modules)
};

/*  */

var onRE$1 = /^@|^v-on:/;
var dirRE$1 = /^v-|^@|^:/;
var forAliasRE$1 = /(.*?)\s+(?:in|of)\s+(.*)/;
var forIteratorRE$1 = /\((\{[^}]*\}|[^,]*),([^,]*)(?:,([^,]*))?\)/;

var argRE$1 = /:(.*)$/;
var bindRE$1 = /^:|^v-bind:/;
var modifierRE$1 = /\.[^.]+/g;

var decodeHTMLCached$1 = cached(he.decode);

// configurable state
var warn$3;
var delimiters$1;
var transforms$1;
var preTransforms$1;
var postTransforms$1;
var platformIsPreTag$1;
var platformMustUseProp$1;
var platformGetTagNamespace$1;
/** 定义属性的格式 */


/**
 * 产生抽象元素
 * 根据对标签的解析产生对应的抽象结构
 * @param {*} tag 元素标签
 * @param {*} attrs 元素属性
 * @param {*} parent 元素的父节点
 */
function createASTElement$1 (
  tag,
  attrs,
  parent
) 
{
  return {
    type: 1,
    tag: tag,
    attrsList: attrs,
    attrsMap: makeAttrsMap$1(attrs),
    parent: parent,
    children: []
  }
}

/**
 * 将HTML文本转换为抽象结构
 * @param {*} template HTML字符串，即模板字符串
 * @param {*} options 抽象结构体
 * 获取对象的
 * 实现只是警告一次的函数
 * 实现结束预处理的函数
 * 调用分析HTML
 */
function parse$1 (
  template,
  options
) 
{
  warn$3 = options.warn || baseWarn$1;

  platformIsPreTag$1 = options.isPreTag || no;
  platformMustUseProp$1 = options.mustUseProp || no;
  platformGetTagNamespace$1 = options.getTagNamespace || no;

  transforms$1 = pluckModuleFunction$1(options.modules, 'transformNode');
  preTransforms$1 = pluckModuleFunction$1(options.modules, 'preTransformNode');
  postTransforms$1 = pluckModuleFunction$1(options.modules, 'postTransformNode');

  delimiters$1 = options.delimiters;

  var stack = [];
  var preserveWhitespace = options.preserveWhitespace !== false;
  var root;
  var currentParent;
  var inVPre = false;
  var inPre = false;
  var warned = false;
  /**
   * 警告一次的处理，
   * 如果没有警告过进行警告，如果已经警告过不在进行警告
   * @param {*} msg 
   */
  function warnOnce (msg) {
    if (!warned) 
    {
      warned = true;
      warn$3(msg);
    }
  }
  /**
   * 
   * @param {*} element 
   */
  function endPre (element) 
  {
    // check pre state
    if (element.pre) 
    {
      inVPre = false;
    }
    if (platformIsPreTag$1(element.tag)) 
    {
      inPre = false;
    }
  }
  /**
   * 调用分析HTML文件
   */
  parseHTML$1(template, {
    warn: warn$3,
    expectHTML: options.expectHTML,
    isUnaryTag: options.isUnaryTag,
    canBeLeftOpenTag: options.canBeLeftOpenTag,
    shouldDecodeNewlines: options.shouldDecodeNewlines,
    shouldKeepComment: options.comments,
    /**
     * 
     * @param {*} tag 
     * @param {*} attrs 
     * @param {*} unary 
     */
    start: function start (tag, attrs, unary) 
    {
      // check namespace.
      // inherit parent ns if there is one
      var ns = (currentParent && currentParent.ns) || platformGetTagNamespace$1(tag);

      // handle IE svg bug
      /* istanbul ignore if */
      if (isIE$1 && ns === 'svg') 
      {
        attrs = guardIESVGBug$1(attrs);
      }

      var element = createASTElement$1(tag, attrs, currentParent);
      if (ns) 
      {
        element.ns = ns;
      }

      if (isForbiddenTag$1(element) && !isServerRendering$1()) 
      {
        element.forbidden = true;
        "development" !== 'production' && warn$3(
          'Templates should only be responsible for mapping the state to the ' +
          'UI. Avoid placing tags with side-effects in your templates, such as ' +
          "<" + tag + ">" + ', as they will not be parsed.'
        );
      }

      // apply pre-transforms
      for (var i = 0; i < preTransforms$1.length; i++) 
      {
        element = preTransforms$1[i](element, options) || element;
      }

      if (!inVPre) 
      {
        processPre$1(element);
        if (element.pre) 
        {
          inVPre = true;
        }
      }
      if (platformIsPreTag$1(element.tag)) 
      {
        inPre = true;
      }
      if (inVPre) 
      {
        processRawAttrs$1(element);
      } 
      else if (!element.processed) 
      {
        // structural directives
        processFor$1(element);
        processIf$1(element);
        processOnce$1(element);
        // element-scope stuff
        processElement$1(element, options);
      }
      /**
       * 检测根的约束条件
       * @param {*} el 
       */
      function checkRootConstraints (el) 
      {
        {
          /**
           * 获取el 对象的标签
           */
          if (el.tag === 'slot' || el.tag === 'template') 
          {
            warnOnce(
              "Cannot use <" + (el.tag) + "> as component root element because it may " +
              'contain multiple nodes.'
            );
          }
          if (el.attrsMap.hasOwnProperty('v-for')) 
          {
            warnOnce(
              'Cannot use v-for on stateful component root element because ' +
              'it renders multiple elements.'
            );
          }
        }
      }

      // tree management
      if (!root) 
      {
        root = element;
        checkRootConstraints(root);
      } 
      else if (!stack.length) 
      {
        // allow root elements with v-if, v-else-if and v-else
        if (root.if && (element.elseif || element.else)) 
        {
          checkRootConstraints(element);
          addIfCondition$1(root, {
            exp: element.elseif,
            block: element
          });
        } 
        else {
          warnOnce(
            "Component template should contain exactly one root element. " +
            "If you are using v-if on multiple elements, " +
            "use v-else-if to chain them instead."
          );
        }
      }
      if (currentParent && !element.forbidden) 
      {
        if (element.elseif || element.else) 
        {
          processIfConditions$1(element, currentParent);
        } 
        else if (element.slotScope) 
        { // scoped slot
          currentParent.plain = false;
          var name = element.slotTarget || '"default"';(currentParent.scopedSlots || (currentParent.scopedSlots = {}))[name] = element;
        } 
        else 
        {
          currentParent.children.push(element);
          element.parent = currentParent;
        }
      }
      if (!unary) 
      {
        currentParent = element;
        stack.push(element);
      } 
      else 
      {
        endPre(element);
      }
      // apply post-transforms
      for (var i$1 = 0; i$1 < postTransforms$1.length; i$1++) 
      {
        postTransforms$1[i$1](element, options);
      }
    },
    /**
     * 
     */
    end: function end () 
    {
      // remove trailing whitespace
      var element = stack[stack.length - 1];
      var lastNode = element.children[element.children.length - 1];
      if (lastNode && lastNode.type === 3 && lastNode.text === ' ' && !inPre) {
        element.children.pop();
      }
      // pop stack
      stack.length -= 1;
      currentParent = stack[stack.length - 1];
      endPre(element);
    },
    /**
     * 
     * @param {*} text 
     */
    chars: function chars (text) 
    {
      if (!currentParent) 
      {
        {
          if (text === template) 
          {
            warnOnce(
              'Component template requires a root element, rather than just text.'
            );
          } 
          else if ((text = text.trim())) 
          {
            warnOnce(
              ("text \"" + text + "\" outside root element will be ignored.")
            );
          }
        }
        return
      }
      // IE textarea placeholder bug
      /* istanbul ignore if */
      if (isIE$1 &&
        currentParent.tag === 'textarea' &&
        currentParent.attrsMap.placeholder === text
      ) 
      {
        return
      }
      var children = currentParent.children;
      text = inPre || text.trim()
        ? isTextTag$1(currentParent) ? text : decodeHTMLCached$1(text)
        // only preserve whitespace if its not right after a starting tag
        : preserveWhitespace && children.length ? ' ' : '';
      if (text) 
      {
        var expression;
        if (!inVPre && text !== ' ' && (expression = parseText$1(text, delimiters$1))) 
        {
          children.push({
            type: 2,
            expression: expression,
            text: text
          });
        } 
        else if (text !== ' ' || !children.length || children[children.length - 1].text !== ' ') 
        {
          children.push({
            type: 3,
            text: text
          });
        }
      }
    },
    /**
     * 
     * @param {*} text 
     */
    comment: function comment (text) 
    {
      currentParent.children.push({
        type: 3,
        text: text,
        isComment: true
      });
    }
  });
  return root
}
/**
 * 预指令的处理
 * 获取元素对象中的预处理的属性值，
 * 如果值不为NULL设置值的pre属性的值为真
 * @param {*} el 
 */
function processPre$1 (el) {
  if (getAndRemoveAttr$1(el, 'v-pre') != null) {
    el.pre = true;
  }
}
/**
 * 原始属性的处理
 * @param {*} el 
 */
function processRawAttrs$1 (el) {
  /** 获取对象的属性数组 */
  var l = el.attrsList.length;
  /** 对于数组长度大于0的处理
   * 将属性名和属性值组成的数组存储在el的attrs数组中
   */
  if (l) {
    var attrs = el.attrs = new Array(l);
    for (var i = 0; i < l; i++) {
      attrs[i] = {
        name: el.attrsList[i].name,
        value: JSON.stringify(el.attrsList[i].value)
      };
    }
  } else if (!el.pre) {
    /** 对于el的预处理属性为假的处理，设置元素的plain属性为真 */
    // non root node in pre blocks with no attributes
    el.plain = true;
  }
}
/**
 * 处理元素
 * @param {*} element 
 * @param {*} options 
 */
function processElement$1 (element, options) {
  processKey$1(element);

  // determine whether this is a plain element after
  // removing structural attributes
  element.plain = !element.key && !element.attrsList.length;

  processRef$1(element);
  processSlot$1(element);
  processComponent$1(element);
  for (var i = 0; i < transforms$1.length; i++) {
    element = transforms$1[i](element, options) || element;
  }
  processAttrs$1(element);
}
/**
 * 处理key属性
 * 如果此属性存在设置此元素的key属性的值为返回的表达式
 * @param {*} el 
 */
function processKey$1 (el) {
  var exp = getBindingAttr$1(el, 'key');
  if (exp) {
    if ("development" !== 'production' && el.tag === 'template') {
      warn$3("<template> cannot be keyed. Place the key on real elements instead.");
    }
    el.key = exp;
  }
}
/**
 * 处理ref属性
 * @param {*} el 
 */
function processRef$1 (el) {
  /** 获取此对象ref属性的值 */
  var ref = getBindingAttr$1(el, 'ref');
  /** 对于值不为假的处理
   * 设置el的ref属性为ref属性的值
   * 设置refInFor，即是否有for属性
   */
  if (ref) {
    el.ref = ref;
    el.refInFor = checkInFor$1(el);
  }
}
/**
 * for指令的处理
 * @param {*} el 
 */
function processFor$1 (el) {
  var exp;
  if ((exp = getAndRemoveAttr$1(el, 'v-for'))) {
    var inMatch = exp.match(forAliasRE$1);
    if (!inMatch) {
      "development" !== 'production' && warn$3(
        ("Invalid v-for expression: " + exp)
      );
      return
    }
    el.for = inMatch[2].trim();
    var alias = inMatch[1].trim();
    var iteratorMatch = alias.match(forIteratorRE$1);
    if (iteratorMatch) {
      el.alias = iteratorMatch[1].trim();
      el.iterator1 = iteratorMatch[2].trim();
      if (iteratorMatch[3]) {
        el.iterator2 = iteratorMatch[3].trim();
      }
    } else {
      el.alias = alias;
    }
  }
}
/**
 * 处理v-if指令
 * @param {*} el 
 */
function processIf$1 (el) {
  var exp = getAndRemoveAttr$1(el, 'v-if');
  if (exp) {
    el.if = exp;
    addIfCondition$1(el, {
      exp: exp,
      block: el
    });
  } else {
    if (getAndRemoveAttr$1(el, 'v-else') != null) {
      el.else = true;
    }
    var elseif = getAndRemoveAttr$1(el, 'v-else-if');
    if (elseif) {
      el.elseif = elseif;
    }
  }
}
/**
 * 
 * @param {*} el 
 * @param {*} parent 
 */
function processIfConditions$1 (el, parent) {
  var prev = findPrevElement$1(parent.children);
  if (prev && prev.if) {
    addIfCondition$1(prev, 
      {
      exp: el.elseif,
      block: el
    });
  } else {
    warn$3(
      "v-" + (el.elseif ? ('else-if="' + el.elseif + '"') : 'else') + " " +
      "used on element <" + (el.tag) + "> without corresponding v-if."
    );
  }
}
/**
 * 查找前面的元素
 * @param {*} children 
 */
function findPrevElement$1 (children) {
  var i = children.length;
  while (i--) {
    if (children[i].type === 1) {
      return children[i]
    } else {
      if ("development" !== 'production' && children[i].text !== ' ') {
        warn$3(
          "text \"" + (children[i].text.trim()) + "\" between v-if and v-else(-if) " +
          "will be ignored."
        );
      }
      children.pop();
    }
  }
}
/**
 * 
 * @param {*} el 
 * @param {*} condition 
 */
function addIfCondition$1 (el, condition) {
  if (!el.ifConditions) {
    el.ifConditions = [];
  }
  el.ifConditions.push(condition);
}
/**
 * 处理一次
 * @param {*} el 
 */
function processOnce$1 (el) {
  /**
   * 获取v-once属性，并设置对象的once属性为此属性中是否存在v-once
   */
  var once$$1 = getAndRemoveAttr$1(el, 'v-once');
  if (once$$1 != null) {
    el.once = true;
  }
}
/**
 * 处理槽
 * @param {*} el 
 */
function processSlot$1 (el) {
  if (el.tag === 'slot') {
    el.slotName = getBindingAttr$1(el, 'name');
    if ("development" !== 'production' && el.key) {
      warn$3(
        "`key` does not work on <slot> because slots are abstract outlets " +
        "and can possibly expand into multiple elements. " +
        "Use the key on a wrapping element instead."
      );
    }
  } else {
    var slotScope;
    if (el.tag === 'template') {
      slotScope = getAndRemoveAttr$1(el, 'scope');
      /* istanbul ignore if */
      if ("development" !== 'production' && slotScope) {
        warn$3(
          "the \"scope\" attribute for scoped slots have been deprecated and " +
          "replaced by \"slot-scope\" since 2.5. The new \"slot-scope\" attribute " +
          "can also be used on plain elements in addition to <template> to " +
          "denote scoped slots.",
          true
        );
      }
      el.slotScope = slotScope || getAndRemoveAttr$1(el, 'slot-scope');
    } else if ((slotScope = getAndRemoveAttr$1(el, 'slot-scope'))) {
      el.slotScope = slotScope;
    }
    var slotTarget = getBindingAttr$1(el, 'slot');
    if (slotTarget) {
      el.slotTarget = slotTarget === '""' ? '"default"' : slotTarget;
      // preserve slot as an attribute for native shadow DOM compat
      // only for non-scoped slots.
      if (!el.slotScope) {
        addAttr$1(el, 'slot', slotTarget);
      }
    }
  }
}
/**
 * 组件处理
 * @param {*} el 
 */
function processComponent$1 (el) {
  var binding;
  if ((binding = getBindingAttr$1(el, 'is'))) {
    el.component = binding;
  }
  if (getAndRemoveAttr$1(el, 'inline-template') != null) {
    el.inlineTemplate = true;
  }
}
/**
 * 处理属性
 * @param {*} el 
 */
function processAttrs$1 (el) {
  var list = el.attrsList;
  var i, l, name, rawName, value, modifiers, isProp;
  for (i = 0, l = list.length; i < l; i++) {
    name = rawName = list[i].name;
    value = list[i].value;
    if (dirRE$1.test(name)) {
      // mark element as dynamic
      el.hasBindings = true;
      // modifiers
      modifiers = parseModifiers$1(name);
      if (modifiers) {
        name = name.replace(modifierRE$1, '');
      }
      if (bindRE$1.test(name)) { // v-bind
        name = name.replace(bindRE$1, '');
        value = parseFilters(value);
        isProp = false;
        if (modifiers) {
          if (modifiers.prop) {
            isProp = true;
            name = camelize(name);
            if (name === 'innerHtml') { name = 'innerHTML'; }
          }
          if (modifiers.camel) {
            name = camelize(name);
          }
          if (modifiers.sync) {
            addHandler$1(
              el,
              ("update:" + (camelize(name))),
              genAssignmentCode(value, "$event")
            );
          }
        }
        if (isProp || (
          !el.component && platformMustUseProp$1(el.tag, el.attrsMap.type, name)
        )) {
          addProp$1(el, name, value);
        } else {
          addAttr$1(el, name, value);
        }
      } else if (onRE$1.test(name)) { // v-on
        name = name.replace(onRE$1, '');
        addHandler$1(el, name, value, modifiers, false, warn$3);
      } else { // normal directives
        name = name.replace(dirRE$1, '');
        // parse arg
        var argMatch = name.match(argRE$1);
        var arg = argMatch && argMatch[1];
        if (arg) {
          name = name.slice(0, -(arg.length + 1));
        }
        addDirective$1(el, name, rawName, value, arg, modifiers);
        if ("development" !== 'production' && name === 'model') {
          checkForAliasModel$1(el, value);
        }
      }
    } else {
      // literal attribute
      {
        var expression = parseText$1(value, delimiters$1);
        if (expression) {
          warn$3(
            name + "=\"" + value + "\": " +
            'Interpolation inside attributes has been removed. ' +
            'Use v-bind or the colon shorthand instead. For example, ' +
            'instead of <div id="{{ val }}">, use <div :id="val">.'
          );
        }
      }
      addAttr$1(el, name, JSON.stringify(value));
    }
  }
}
/**
 * 判断此属性向上是否有for属性
 * @param {*} el 
 */
function checkInFor$1 (el) {
  var parent = el;
  while (parent) {
    if (parent.for !== undefined) {
      return true
    }
    parent = parent.parent;
  }
  return false
}
/**
 * 
 * @param {*} name 
 */
function parseModifiers$1 (name) {
  var match = name.match(modifierRE$1);
  if (match) {
    var ret = {};
    match.forEach(function (m) { ret[m.slice(1)] = true; });
    return ret
  }
}
/**
 * 将属性数组中的name属性值为键value属性值为值的映射表
 * @param {*} attrs 属性数组
 */
function makeAttrsMap$1 (attrs) {
  var map = {};
  for (var i = 0, l = attrs.length; i < l; i++) {
    if (
      "development" !== 'production' &&
      map[attrs[i].name] && !isIE$1 && !isEdge$1
    ) {
      warn$3('duplicate attribute: ' + attrs[i].name);
    }
    map[attrs[i].name] = attrs[i].value;
  }
  return map
}

// for script (e.g. type="x/template") or style, do not decode content
/**
 * 判断是否是文本标签即是否是script和style标签
 * @param {*} el 
 */
function isTextTag$1 (el) {
  return el.tag === 'script' || el.tag === 'style'
}
/**
 * 
 * @param {*} el DOM对象的抽象形式
 */
function isForbiddenTag$1 (el) {
  return (
    el.tag === 'style' ||
    (el.tag === 'script' && (
      !el.attrsMap.type ||
      el.attrsMap.type === 'text/javascript'
    ))
  )
}

var ieNSBug$1 = /^xmlns:NS\d+/;
var ieNSPrefix$1 = /^NS\d+:/;

/**
 * 
 * @param {*} attrs 
 */
function guardIESVGBug$1 (attrs) {
  var res = [];
  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    if (!ieNSBug$1.test(attr.name)) {
      attr.name = attr.name.replace(ieNSPrefix$1, '');
      res.push(attr);
    }
  }
  return res
}
/**
 * 
 * @param {*} el 
 * @param {*} value 
 */
function checkForAliasModel$1 (el, value) {
  var _el = el;
  while (_el) {
    if (_el.for && _el.alias === value) {
      warn$3(
        "<" + (el.tag) + " v-model=\"" + value + "\">: " +
        "You are binding v-model directly to a v-for iteration alias. " +
        "This will not be able to modify the v-for source array because " +
        "writing to the alias is like modifying a function local variable. " +
        "Consider using an array of objects and use v-model on an object property instead."
      );
    }
    _el = _el.parent;
  }
}

/*  */

var isStaticKey;
var isPlatformReservedTag;

var genStaticKeysCached = cached(genStaticKeys$1);

/**
 * Goal of the optimizer: walk the generated template AST tree
 * and detect sub-trees that are purely static, i.e. parts of
 * the DOM that never needs to change.
 *
 * Once we detect these sub-trees, we can:
 *
 * 1. Hoist them into constants, so that we no longer need to
 *    create fresh nodes for them on each re-render;
 * 2. Completely skip them in the patching process.
 */
function optimize (root, options) {
  if (!root) { return }
  isStaticKey = genStaticKeysCached(options.staticKeys || '');
  isPlatformReservedTag = options.isReservedTag || no;
  // first pass: mark all non-static nodes.
  markStatic(root);
  // second pass: mark static roots.
  markStaticRoots(root, false);
}
/**
 * 创建静态的键
 * @param {*} keys 
 */
function genStaticKeys$1 (keys) {
  return makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
    (keys ? ',' + keys : '')
  )
}
/**
 * 
 * @param {*} node 
 */
function markStatic (node) 
{
  node.static = isStatic(node);
  if (node.type === 1) 
  {
    // do not make component slot content static. this avoids
    // 1. components not able to mutate slot nodes
    // 2. static slot content fails for hot-reloading
    if (
      !isPlatformReservedTag(node.tag) &&
      node.tag !== 'slot' &&
      node.attrsMap['inline-template'] == null
    ) 
    {
      return
    }
    for (var i = 0, l = node.children.length; i < l; i++) 
    {
      var child = node.children[i];
      markStatic(child);
      if (!child.static) 
      {
        node.static = false;
      }
    }
    if (node.ifConditions) 
    {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) 
      {
        var block = node.ifConditions[i$1].block;
        markStatic(block);
        if (!block.static) 
        {
          node.static = false;
        }
      }
    }
  }
}
/**
 * 
 * @param {*} node 
 * @param {*} isInFor 
 */
function markStaticRoots (node, isInFor)
{
  if (node.type === 1) 
  {
    if (node.static || node.once) 
    {
      node.staticInFor = isInFor;
    }
    // For a node to qualify as a static root, it should have children that
    // are not just static text. Otherwise the cost of hoisting out will
    // outweigh the benefits and it's better off to just always render it fresh.
    if (node.static && node.children.length && !(
      node.children.length === 1 &&
      node.children[0].type === 3
    )) 
    {
      node.staticRoot = true;
      return
    } 
    else 
    {
      node.staticRoot = false;
    }
    if (node.children) 
    {
      for (var i = 0, l = node.children.length; i < l; i++) 
      {
        markStaticRoots(node.children[i], isInFor || !!node.for);
      }
    }
    if (node.ifConditions) 
    {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) 
      {
        markStaticRoots(node.ifConditions[i$1].block, isInFor);
      }
    }
  }
}
/**
 * 标记节点是否是静态的
 * @param {*} node 
 */
function isStatic (node) 
{
  if (node.type === 2) 
  { // expression
    return false
  }
  if (node.type === 3) 
  { // text
    return true
  }
  return !!(node.pre || (
    !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) &&
    Object.keys(node).every(isStaticKey)
  ))
}
/**
 * 遍历节点的父节点
 * @param {*} node 
 */
function isDirectChildOfTemplateFor (node) {
  while (node.parent) 
  {
    node = node.parent;
    if (node.tag !== 'template') 
    {
      return false
    }
    if (node.for) 
    {
      return true
    }
  }
  return false
}

/*  */

var fnExpRE = /^\s*([\w$_]+|\([^)]*?\))\s*=>|^function\s*\(/;
var simplePathRE = /^\s*[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?']|\[".*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*\s*$/;

// keyCode aliases
var keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  up: 38,
  left: 37,
  right: 39,
  down: 40,
  'delete': [8, 46]
};

// #4868: modifiers that prevent the execution of the listener
// need to explicitly return null so that we can determine whether to remove
// the listener for .once
/** */
var genGuard = function (condition) { return ("if(" + condition + ")return null;"); };

var modifierCode = 
{
  stop: '$event.stopPropagation();',
  prevent: '$event.preventDefault();',
  self: genGuard("$event.target !== $event.currentTarget"),
  ctrl: genGuard("!$event.ctrlKey"),
  shift: genGuard("!$event.shiftKey"),
  alt: genGuard("!$event.altKey"),
  meta: genGuard("!$event.metaKey"),
  left: genGuard("'button' in $event && $event.button !== 0"),
  middle: genGuard("'button' in $event && $event.button !== 1"),
  right: genGuard("'button' in $event && $event.button !== 2")
};
/**
 * 参数处理代码
 * @param {*} events 
 * @param {*} isNative 
 * @param {*} warn 
 */
function genHandlers (
  events,
  isNative,
  warn
) {
  /** 根据传入的isNative进行处理 设置res的值 */
  var res = isNative ? 'nativeOn:{' : 'on:{';
  /** 变量事件属性 */
  for (var name in events) {
    /** 获取事件值 */
    var handler = events[name];
    // #5330: warn click.right, since right clicks do not actually fire click events.
    if ("development" !== 'production' &&
      name === 'click' &&
      handler && handler.modifiers && handler.modifiers.right
    ) {
      warn(
        "Use \"contextmenu\" instead of \"click.right\" since right clicks " +
        "do not actually fire \"click\" events."
      );
    }
    /** 字符串转换 */
    res += "\"" + name + "\":" + (genHandler(name, handler)) + ",";
  }
  /** 生成最终的字符串 */
  return res.slice(0, -1) + '}'
}
/**
 * 产生处理代码
 * @param {*} name 事件名称
 * @param {*} handler 事件处理函数
 */
function genHandler (
  name,
  handler
) {
  /** 如果事件处理函数的值为假返回空函数 */
  if (!handler) {
    return 'function(){}'
  }
  /** 如果事件处理函数是数组的处理 */
  if (Array.isArray(handler)) {
    /** 返回数组处理的形式 */
    return ("[" + (handler.map(function (handler) { return genHandler(name, handler); }).join(',')) + "]")
  }

  var isMethodPath = simplePathRE.test(handler.value);
  var isFunctionExpression = fnExpRE.test(handler.value);

  if (!handler.modifiers) {
    return isMethodPath || isFunctionExpression
      ? handler.value
      : ("function($event){" + (handler.value) + "}") // inline statement
  } else {
    var code = '';
    var genModifierCode = '';
    var keys = [];
    for (var key in handler.modifiers) {
      if (modifierCode[key]) {
        genModifierCode += modifierCode[key];
        // left/right
        if (keyCodes[key]) {
          keys.push(key);
        }
      } else if (key === 'exact') {
        var modifiers = (handler.modifiers);
        genModifierCode += genGuard(
          ['ctrl', 'shift', 'alt', 'meta']
            .filter(function (keyModifier) { return !modifiers[keyModifier]; })
            .map(function (keyModifier) { return ("$event." + keyModifier + "Key"); })
            .join('||')
        );
      } else {
        keys.push(key);
      }
    }
    if (keys.length) {
      code += genKeyFilter(keys);
    }
    // Make sure modifiers like prevent and stop get executed after key filtering
    if (genModifierCode) {
      code += genModifierCode;
    }
    var handlerCode = isMethodPath
      ? handler.value + '($event)'
      : isFunctionExpression
        ? ("(" + (handler.value) + ")($event)")
        : handler.value;
    return ("function($event){" + code + handlerCode + "}")
  }
}
/**
 * 产生键值过滤器代码
 * @param {*} keys 
 */
function genKeyFilter (keys) {
  return ("if(!('button' in $event)&&" + (keys.map(genFilterCode).join('&&')) + ")return null;")
}
/**
 * 产生过滤代码
 * @param {*} key 
 */
function genFilterCode (key) {
  /** 将key转换为10进制的整数 */
  var keyVal = parseInt(key, 10);
  /** 如果转换的值为真的处理
   * 返回
   */
  if (keyVal) {
    return ("$event.keyCode!==" + keyVal)
  }
  /** 设置code的值在 */
  var code = keyCodes[key];
  return (
    "_k($event.keyCode," +
    (JSON.stringify(key)) + "," +
    (JSON.stringify(code)) + "," +
    "$event.key)"
  )
}

/*  */

/**
 * 定义对于on事件的处理
 * @param {*} el DOM元素
 * @param {*} dir 指令
 */
function on (el, dir) {
  if ("development" !== 'production' && dir.modifiers) {
    warn("v-on without argument does not support modifiers.");
  }
  // 元素对象封装监视器
  el.wrapListeners = function (code) { return ("_g(" + code + "," + (dir.value) + ")"); };
}

/*  */
/**
 * 数据封装
 * @param {*} el 
 * @param {*} dir 
 */
function bind$1 (el, dir) 
{
  el.wrapData = function (code) {
    return ("_b(" + code + ",'" + (el.tag) + "'," + (dir.value) + "," + (dir.modifiers && dir.modifiers.prop ? 'true' : 'false') + (dir.modifiers && dir.modifiers.sync ? ',true' : '') + ")")
  };
}

/*  */

var baseDirectives = {
  on: on,
  bind: bind$1,
  cloak: noop
};

/*  */

/**
 * 代码产生的实现
 */
var CodegenState = function CodegenState (options) 
{
  this.options = options;
  this.warn = options.warn || baseWarn$1;
  this.transforms = pluckModuleFunction$1(options.modules, 'transformCode');
  this.dataGenFns = pluckModuleFunction$1(options.modules, 'genData');
  this.directives = extend(extend({}, baseDirectives), options.directives);
  var isReservedTag = options.isReservedTag || no;
  this.maybeComponent = function (el) { return !isReservedTag(el.tag); };
  this.onceId = 0;
  this.staticRenderFns = [];
};
/**
 * 上升代码的结果的结构
 */

/**
 * 代码产生的主体函数
 * @param {*} ast 元素抽象结构
 * @param {*} options 编译参数
 */
function generate (
  ast,
  options
) 
{
  /**创建新的编译器状态对象 */
  var state = new CodegenState(options);
  /** */
  var code = ast ? genElement(ast, state) : '_c("div")';
  return {
    render: ("with(this){return " + code + "}"),
    staticRenderFns: state.staticRenderFns
  }
}
/**
 * 
 * @param {*} el 
 * @param {*} state 
 */
function genElement (el, state) 
{
  if (el.staticRoot && !el.staticProcessed) 
  {
    return genStatic(el, state)
  } 
  else if (el.once && !el.onceProcessed) 
  {
    return genOnce(el, state)
  } 
  else if (el.for && !el.forProcessed) 
  {
    return genFor(el, state)
  } 
  else if (el.if && !el.ifProcessed) 
  {
    return genIf(el, state)
  } 
  else if (el.tag === 'template' && !el.slotTarget) 
  {
    return genChildren(el, state) || 'void 0'
  } 
  else if (el.tag === 'slot') 
  {
    return genSlot(el, state)
  } 
  else 
  {
    // component or element
    var code;
    if (el.component) 
    {
      code = genComponent(el.component, el, state);
    } 
    else 
    {
      var data = el.plain ? undefined : genData$2(el, state);

      var children = el.inlineTemplate ? null : genChildren(el, state, true);
      code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
    }
    // module transforms
    for (var i = 0; i < state.transforms.length; i++) 
    {
      code = state.transforms[i](el, code);
    }
    return code
  }
}

/**
 * 
 * @param {*} el 
 * @param {*} state 
 */
function genStatic (el, state) 
{
  el.staticProcessed = true;
  state.staticRenderFns.push(("with(this){return " + (genElement(el, state)) + "}"));
  return ("_m(" + (state.staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
}

/**
 * 
 * @param {*} el 
 * @param {*} state 
 */
function genOnce (el, state) 
{
  el.onceProcessed = true;
  if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.staticInFor) {
    var key = '';
    var parent = el.parent;
    while (parent) {
      if (parent.for) {
        key = parent.key;
        break
      }
      parent = parent.parent;
    }
    if (!key) {
      "development" !== 'production' && state.warn(
        "v-once can only be used inside v-for that is keyed. "
      );
      return genElement(el, state)
    }
    return ("_o(" + (genElement(el, state)) + "," + (state.onceId++) + "," + key + ")")
  } else {
    return genStatic(el, state)
  }
}
/**
 * v-if指令的实现
 * @param {*} el 
 * @param {*} state 
 * @param {*} altGen 
 * @param {*} altEmpty 
 */
function genIf (
  el,
  state,
  altGen,
  altEmpty
) 
{
  el.ifProcessed = true; // avoid recursion
  return genIfConditions(el.ifConditions.slice(), state, altGen, altEmpty)
}
/**
 * v-if的具体的实现
 * @param {*} conditions 抽象的数据的对象
 * @param {*} state  CodegenState对象实例
 * @param {*} altGen 
 * @param {*} altEmpty 
 */
function genIfConditions (
  conditions,
  state,
  altGen,
  altEmpty
) 
{
  if (!conditions.length) 
  {
    return altEmpty || '_e()'
  }
  /**获取一个参数 */
  var condition = conditions.shift();
  /**获取关联的参数，对于有关联的参数的处理 */
  if (condition.exp) 
  {
    return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions(conditions, state, altGen, altEmpty)))
  } 
  /**对于没有关联的参数的处理 */
  else 
  {
    return ("" + (genTernaryExp(condition.block)))
  }

  // v-if with v-once should generate code like (a)?_m(0):_m(1)
  /**
   * 
   * @param {*} el 
   */
  function genTernaryExp (el) 
  {
    return altGen
      ? altGen(el, state)
      : el.once
        ? genOnce(el, state)
        : genElement(el, state)
  }
}
/**
 * 
 * @param {*} el 
 * @param {*} state 
 * @param {*} altGen 
 * @param {*} altHelper 
 */
function genFor (
  el,
  state,
  altGen,
  altHelper
) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';

  if ("development" !== 'production' &&
    state.maybeComponent(el) &&
    el.tag !== 'slot' &&
    el.tag !== 'template' &&
    !el.key
  ) {
    state.warn(
      "<" + (el.tag) + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " +
      "v-for should have explicit keys. " +
      "See https://vuejs.org/guide/list.html#key for more info.",
      true /* tip */
    );
  }

  el.forProcessed = true; // avoid recursion
  return (altHelper || '_l') + "((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + ((altGen || genElement)(el, state)) +
    '})'
}
/**
 * 产生数据
 * @param {*} el 
 * @param {*} state 
 */
function genData$2 (el, state) 
{
  var data = '{';

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  var dirs = genDirectives(el, state);
  if (dirs) { data += dirs + ','; }

  // key
  if (el.key) {
    data += "key:" + (el.key) + ",";
  }
  // ref
  if (el.ref) {
    data += "ref:" + (el.ref) + ",";
  }
  if (el.refInFor) {
    data += "refInFor:true,";
  }
  // pre
  if (el.pre) {
    data += "pre:true,";
  }
  // record original tag name for components using "is" attribute
  if (el.component) {
    data += "tag:\"" + (el.tag) + "\",";
  }
  // module data generation functions
  for (var i = 0; i < state.dataGenFns.length; i++) {
    data += state.dataGenFns[i](el);
  }
  // attributes
  if (el.attrs) {
    data += "attrs:{" + (genProps(el.attrs)) + "},";
  }
  // DOM props
  if (el.props) {
    data += "domProps:{" + (genProps(el.props)) + "},";
  }
  // event handlers
  if (el.events) {
    data += (genHandlers(el.events, false, state.warn)) + ",";
  }
  if (el.nativeEvents) {
    data += (genHandlers(el.nativeEvents, true, state.warn)) + ",";
  }
  // slot target
  // only for non-scoped slots
  if (el.slotTarget && !el.slotScope) {
    data += "slot:" + (el.slotTarget) + ",";
  }
  // scoped slots
  if (el.scopedSlots) {
    data += (genScopedSlots(el.scopedSlots, state)) + ",";
  }
  // component v-model
  if (el.model) {
    data += "model:{value:" + (el.model.value) + ",callback:" + (el.model.callback) + ",expression:" + (el.model.expression) + "},";
  }
  // inline-template
  if (el.inlineTemplate) {
    var inlineTemplate = genInlineTemplate(el, state);
    if (inlineTemplate) {
      data += inlineTemplate + ",";
    }
  }
  data = data.replace(/,$/, '') + '}';
  // v-bind data wrap
  if (el.wrapData) {
    data = el.wrapData(data);
  }
  // v-on data wrap
  if (el.wrapListeners) {
    data = el.wrapListeners(data);
  }
  return data
}

function genDirectives (el, state) {
  var dirs = el.directives;
  if (!dirs) { return }
  var res = 'directives:[';
  var hasRuntime = false;
  var i, l, dir, needRuntime;
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i];
    needRuntime = true;
    var gen = state.directives[dir.name];
    if (gen) {
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      needRuntime = !!gen(el, dir, state.warn);
    }
    if (needRuntime) {
      hasRuntime = true;
      res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:\"" + (dir.arg) + "\"") : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
    }
  }
  if (hasRuntime) {
    return res.slice(0, -1) + ']'
  }
}

function genInlineTemplate (el, state) {
  var ast = el.children[0];
  if ("development" !== 'production' && (
    el.children.length !== 1 || ast.type !== 1
  )) {
    state.warn('Inline-template components must have exactly one child element.');
  }
  if (ast.type === 1) {
    var inlineRenderFns = generate(ast, state.options);
    return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function (code) { return ("function(){" + code + "}"); }).join(',')) + "]}")
  }
}

function genScopedSlots (
  slots,
  state
) {
  return ("scopedSlots:_u([" + (Object.keys(slots).map(function (key) {
      return genScopedSlot(key, slots[key], state)
    }).join(',')) + "])")
}

function genScopedSlot (
  key,
  el,
  state
) {
  if (el.for && !el.forProcessed) {
    return genForScopedSlot(key, el, state)
  }
  var fn = "function(" + (String(el.slotScope)) + "){" +
    "return " + (el.tag === 'template'
      ? el.if
        ? ((el.if) + "?" + (genChildren(el, state) || 'undefined') + ":undefined")
        : genChildren(el, state) || 'undefined'
      : genElement(el, state)) + "}";
  return ("{key:" + key + ",fn:" + fn + "}")
}

function genForScopedSlot (
  key,
  el,
  state
) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';
  el.forProcessed = true; // avoid recursion
  return "_l((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + (genScopedSlot(key, el, state)) +
    '})'
}

function genChildren (
  el,
  state,
  checkSkip,
  altGenElement,
  altGenNode
) {
  var children = el.children;
  if (children.length) {
    var el$1 = children[0];
    // optimize single v-for
    if (children.length === 1 &&
      el$1.for &&
      el$1.tag !== 'template' &&
      el$1.tag !== 'slot'
    ) {
      return (altGenElement || genElement)(el$1, state)
    }
    var normalizationType = checkSkip
      ? getNormalizationType(children, state.maybeComponent)
      : 0;
    var gen = altGenNode || genNode;
    return ("[" + (children.map(function (c) { return gen(c, state); }).join(',')) + "]" + (normalizationType ? ("," + normalizationType) : ''))
  }
}

// determine the normalization needed for the children array.
// 0: no normalization needed
// 1: simple normalization needed (possible 1-level deep nested array)
// 2: full normalization needed
function getNormalizationType (
  children,
  maybeComponent
) {
  var res = 0;
  for (var i = 0; i < children.length; i++) {
    var el = children[i];
    if (el.type !== 1) {
      continue
    }
    if (needsNormalization(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return needsNormalization(c.block); }))) {
      res = 2;
      break
    }
    if (maybeComponent(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return maybeComponent(c.block); }))) {
      res = 1;
    }
  }
  return res
}

function needsNormalization (el) {
  return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
}

function genNode (node, state) {
  if (node.type === 1) {
    return genElement(node, state)
  } if (node.type === 3 && node.isComment) {
    return genComment(node)
  } else {
    return genText(node)
  }
}

function genText (text) {
  return ("_v(" + (text.type === 2
    ? text.expression // no need for () because already wrapped in _s()
    : transformSpecialNewlines(JSON.stringify(text.text))) + ")")
}

function genComment (comment) {
  return ("_e(" + (JSON.stringify(comment.text)) + ")")
}
/**
 * 产生槽
 * @param {*} el 
 * @param {*} state 
 */
function genSlot (el, state) {
  var slotName = el.slotName || '"default"';
  var children = genChildren(el, state);
  var res = "_t(" + slotName + (children ? ("," + children) : '');
  var attrs = el.attrs && ("{" + (el.attrs.map(function (a) { return ((camelize(a.name)) + ":" + (a.value)); }).join(',')) + "}");
  var bind$$1 = el.attrsMap['v-bind'];
  if ((attrs || bind$$1) && !children) {
    res += ",null";
  }
  if (attrs) {
    res += "," + attrs;
  }
  if (bind$$1) {
    res += (attrs ? '' : ',null') + "," + bind$$1;
  }
  return res + ')'
}

// componentName is el.component, take it as argument to shun flow's pessimistic refinement
/**
 * 产生组件
 * @param {*} componentName  组件名称
 * @param {*} el  dom属性
 * @param {*} state 状态值
 */
function genComponent (
  componentName,
  el,
  state
) 
{
  var children = el.inlineTemplate ? null : genChildren(el, state, true);
  return ("_c(" + componentName + "," + (genData$2(el, state)) + (children ? ("," + children) : '') + ")")
}
/**
 * 
 * @param {*} props 属性
 */
function genProps (props) 
{
  var res = '';
  for (var i = 0; i < props.length; i++) 
  {
    var prop = props[i];
    res += "\"" + (prop.name) + "\":" + (transformSpecialNewlines(prop.value)) + ",";
  }
  return res.slice(0, -1)
}

// #3895, #4268
/**
 * 
 * @param {*} text 文本字符串 
 */
function transformSpecialNewlines (text) 
{
  return text
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

/*  */

// these keywords should not appear inside expressions, but operators like
// typeof, instanceof and in are allowed
var prohibitedKeywordRE = new RegExp('\\b' + (
  'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
  'super,throw,while,yield,delete,export,import,return,switch,default,' +
  'extends,finally,continue,debugger,function,arguments'
).split(',').join('\\b|\\b') + '\\b');

// these unary operators should not be used as property/method names
var unaryOperatorsRE = new RegExp('\\b' + (
  'delete,typeof,void'
).split(',').join('\\s*\\([^\\)]*\\)|\\b') + '\\s*\\([^\\)]*\\)');

// check valid identifier for v-for
var identRE = /[A-Za-z_$][\w$]*/;

// strip strings in expressions
var stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

// detect problematic expressions in a template
function detectErrors (ast) {
  var errors = [];
  if (ast) {
    checkNode(ast, errors);
  }
  return errors
}

function checkNode (node, errors) {
  if (node.type === 1) {
    for (var name in node.attrsMap) {
      if (dirRE$1.test(name)) {
        var value = node.attrsMap[name];
        if (value) {
          if (name === 'v-for') {
            checkFor(node, ("v-for=\"" + value + "\""), errors);
          } else if (onRE$1.test(name)) {
            checkEvent(value, (name + "=\"" + value + "\""), errors);
          } else {
            checkExpression(value, (name + "=\"" + value + "\""), errors);
          }
        }
      }
    }
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        checkNode(node.children[i], errors);
      }
    }
  } else if (node.type === 2) {
    checkExpression(node.expression, node.text, errors);
  }
}

function checkEvent (exp, text, errors) {
  var stipped = exp.replace(stripStringRE, '');
  var keywordMatch = stipped.match(unaryOperatorsRE);
  if (keywordMatch && stipped.charAt(keywordMatch.index - 1) !== '$') {
    errors.push(
      "avoid using JavaScript unary operator as property name: " +
      "\"" + (keywordMatch[0]) + "\" in expression " + (text.trim())
    );
  }
  checkExpression(exp, text, errors);
}

function checkFor (node, text, errors) {
  checkExpression(node.for || '', text, errors);
  checkIdentifier(node.alias, 'v-for alias', text, errors);
  checkIdentifier(node.iterator1, 'v-for iterator', text, errors);
  checkIdentifier(node.iterator2, 'v-for iterator', text, errors);
}

function checkIdentifier (ident, type, text, errors) {
  if (typeof ident === 'string' && !identRE.test(ident)) {
    errors.push(("invalid " + type + " \"" + ident + "\" in expression: " + (text.trim())));
  }
}

function checkExpression (exp, text, errors) {
  try {
    new Function(("return " + exp));
  } catch (e) {
    var keywordMatch = exp.replace(stripStringRE, '').match(prohibitedKeywordRE);
    if (keywordMatch) {
      errors.push(
        "avoid using JavaScript keyword as property name: " +
        "\"" + (keywordMatch[0]) + "\"\n  Raw expression: " + (text.trim())
      );
    } else {
      errors.push(
        "invalid expression: " + (e.message) + " in\n\n" +
        "    " + exp + "\n\n" +
        "  Raw expression: " + (text.trim()) + "\n"
      );
    }
  }
}

/*  */

var warn$4 = noop;
var tip$1 = noop;
var generateComponentTrace$1 = (noop); // work around flow check
var formatComponentName$1 = (noop);
/**如果开发环境不是生产模式的处理 */
{
  /**判断是否有定义console */
  var hasConsole$1 = typeof console !== 'undefined';
  /** */
  var classifyRE$1 = /(?:^|[-_])(\w)/g;
  var classify$1 = function (str) { return str
    .replace(classifyRE$1, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };
  /**警告函数 */
  warn$4 = function (msg, vm) {
    var trace = vm ? generateComponentTrace$1(vm) : '';
    /**对于有警告处理函数的处理，使用警告处理函数 */
    if (config.warnHandler) 
    {
      config.warnHandler.call(null, msg, vm, trace);
    } 
    /**对于没有警告处理函数的处理使用控制台输出 */
    else if (hasConsole$1 && (!config.silent)) 
    {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };
  /**提示函数的实现 */
  tip$1 = function (msg, vm) {
    if (hasConsole$1 && (!config.silent)) 
    {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace$1(vm) : ''
      ));
    }
  };
  /**格式化组件名称函数 */
  formatComponentName$1 = function (vm, includeFile) {
    /**对于是根组件的处理 */
    if (vm.$root === vm) 
    {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm || {};
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) 
    {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify$1(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };
  /**重复函数的实现，将字符串重复多次 */
  var repeat$1 = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };
  /**产生组件追踪 */
  generateComponentTrace$1 = function (vm) {
    /**对于组件是 */
    if (vm._isVue && vm.$parent) 
    {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) 
      {
        /**对于树的长度大于0的处理 */
        if (tree.length > 0) 
        {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) 
          {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } 
          else if (currentRecursiveSequence > 0) 
          {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        /**向树中添加对象并设置vm为当前vm的父对象 */
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat$1(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName$1(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName$1(vm))); })
        .join('\n')
    } 
    else 
    {
      return ("\n\n(found in " + (formatComponentName$1(vm)) + ")")
    }
  };
}

/*  */

/**定义编译函数的结果 */

/**
 * 创建函数
 * @param {*} code 函数的代码
 * @param {*} errors 错误信息
 */
function createFunction (code, errors) 
{
  try 
  {
    return new Function(code)
  } 
  catch (err) 
  {
    errors.push({ err: err, code: code });
    return noop
  }
}
/**
 * 
 * @param {*} compile 
 */
function createCompileToFunctionFn (compile) 
{
  var cache = Object.create(null);
  /**
   * template：模板字符串
   * option：编译指令
   * vm:Vue对象
   */
  return function compileToFunctions (
    template,
    options,
    vm
  ) 
  {
    options = extend({}, options);
    var warn$$1 = options.warn || warn$4;
    delete options.warn;

    /* istanbul ignore if */
    {
      // detect possible CSP restriction
      try 
      {
        new Function('return 1');
      } 
      catch (e) 
      {
        if (e.toString().match(/unsafe-eval|CSP/)) 
        {
          warn$$1(
            'It seems you are using the standalone build of Vue.js in an ' +
            'environment with Content Security Policy that prohibits unsafe-eval. ' +
            'The template compiler cannot work in this environment. Consider ' +
            'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
            'templates into render functions.'
          );
        }
      }
    }

    // check cache
    var key = options.delimiters
      ? String(options.delimiters) + template
      : template;
    if (cache[key]) 
    {
      return cache[key]
    }

    // compile
    var compiled = compile(template, options);

    // check compilation errors/tips
    {
      if (compiled.errors && compiled.errors.length) 
      {
        warn$$1(
          "Error compiling template:\n\n" + template + "\n\n" +
          compiled.errors.map(function (e) { return ("- " + e); }).join('\n') + '\n',
          vm
        );
      }
      if (compiled.tips && compiled.tips.length) 
      {
        compiled.tips.forEach(function (msg) { return tip$1(msg, vm); });
      }
    }

    // turn code into functions
    var res = {};
    var fnGenErrors = [];
    res.render = createFunction(compiled.render, fnGenErrors);
    res.staticRenderFns = compiled.staticRenderFns.map(function (code) {
      return createFunction(code, fnGenErrors)
    });

    // check function generation errors.
    // this should only happen if there is a bug in the compiler itself.
    // mostly for codegen development use
    /* istanbul ignore if */
    {
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) 
      {
        warn$$1(
          "Failed to generate render function:\n\n" +
          fnGenErrors.map(function (ref) {
            var err = ref.err;
            var code = ref.code;

            return ((err.toString()) + " in\n\n" + code + "\n");
        }).join('\n'),
          vm
        );
      }
    }

    return (cache[key] = res)
  }
}

/*  */

function createCompilerCreator (baseCompile) 
{
  return function createCompiler (baseOptions)
  {
    function compile (
      template,
      options
    ) 
    {
      var finalOptions = Object.create(baseOptions);
      var errors = [];
      var tips = [];
      finalOptions.warn = function (msg, tip) {
        (tip ? tips : errors).push(msg);
      };
      /**对于options的值不为空的处理 */
      if (options) 
      {
        // merge custom modules
        if (options.modules) 
        {
          finalOptions.modules =
            (baseOptions.modules || []).concat(options.modules);
        }
        // merge custom directives
        if (options.directives) 
        {
          finalOptions.directives = extend(
            Object.create(baseOptions.directives),
            options.directives
          );
        }
        // copy other options
        for (var key in options) 
        {
          if (key !== 'modules' && key !== 'directives') 
          {
            finalOptions[key] = options[key];
          }
        }
      }

      var compiled = baseCompile(template, finalOptions);
      {
        errors.push.apply(errors, detectErrors(compiled.ast));
      }
      compiled.errors = errors;
      compiled.tips = tips;
      return compiled
    }

    return {
      compile: compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}

/*  */

/**
 * 创造编译器产生器
 */
var createCompiler = createCompilerCreator(function baseCompile (
  template,
  options
) 
{
  /**将模板转换为DOM对象的抽象结构 */
  var ast = parse$1(template.trim(), options);
  optimize(ast, options);
  var code = generate(ast, options);
  return {
    ast: ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
});

/*  */

var ref = createCompiler(baseOptions);
var compile = ref.compile;
var compileToFunctions = ref.compileToFunctions;

/*  */

/**
 * 代码产生的实现
 */
var CodegenState$1 = function CodegenState (options) 
{
  this.options = options;
  this.warn = options.warn || baseWarn$1;
  this.transforms = pluckModuleFunction$1(options.modules, 'transformCode');
  this.dataGenFns = pluckModuleFunction$1(options.modules, 'genData');
  this.directives = extend(extend({}, baseDirectives), options.directives);
  var isReservedTag = options.isReservedTag || no;
  this.maybeComponent = function (el) { return !isReservedTag(el.tag); };
  this.onceId = 0;
  this.staticRenderFns = [];
};
/**
 * 上升代码的结果的结构
 */

/**
 * 代码产生的主体函数
 * @param {*} ast 元素抽象结构
 * @param {*} options 编译参数
 */
function generate$2 (
  ast,
  options
) 
{
  /**创建新的编译器状态对象 */
  var state = new CodegenState$1(options);
  /** */
  var code = ast ? genElement$1(ast, state) : '_c("div")';
  return {
    render: ("with(this){return " + code + "}"),
    staticRenderFns: state.staticRenderFns
  }
}
/**
 * 
 * @param {*} el 
 * @param {*} state 
 */
function genElement$1 (el, state) 
{
  if (el.staticRoot && !el.staticProcessed) 
  {
    return genStatic$1(el, state)
  } 
  else if (el.once && !el.onceProcessed) 
  {
    return genOnce$1(el, state)
  } 
  else if (el.for && !el.forProcessed) 
  {
    return genFor$1(el, state)
  } 
  else if (el.if && !el.ifProcessed) 
  {
    return genIf$1(el, state)
  } 
  else if (el.tag === 'template' && !el.slotTarget) 
  {
    return genChildren$1(el, state) || 'void 0'
  } 
  else if (el.tag === 'slot') 
  {
    return genSlot$1(el, state)
  } 
  else 
  {
    // component or element
    var code;
    if (el.component) 
    {
      code = genComponent$1(el.component, el, state);
    } 
    else 
    {
      var data = el.plain ? undefined : genData$3(el, state);

      var children = el.inlineTemplate ? null : genChildren$1(el, state, true);
      code = "_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")";
    }
    // module transforms
    for (var i = 0; i < state.transforms.length; i++) 
    {
      code = state.transforms[i](el, code);
    }
    return code
  }
}

/**
 * 
 * @param {*} el 
 * @param {*} state 
 */
function genStatic$1 (el, state) 
{
  el.staticProcessed = true;
  state.staticRenderFns.push(("with(this){return " + (genElement$1(el, state)) + "}"));
  return ("_m(" + (state.staticRenderFns.length - 1) + (el.staticInFor ? ',true' : '') + ")")
}

/**
 * 
 * @param {*} el 
 * @param {*} state 
 */
function genOnce$1 (el, state) 
{
  el.onceProcessed = true;
  if (el.if && !el.ifProcessed) {
    return genIf$1(el, state)
  } else if (el.staticInFor) {
    var key = '';
    var parent = el.parent;
    while (parent) {
      if (parent.for) {
        key = parent.key;
        break
      }
      parent = parent.parent;
    }
    if (!key) {
      "development" !== 'production' && state.warn(
        "v-once can only be used inside v-for that is keyed. "
      );
      return genElement$1(el, state)
    }
    return ("_o(" + (genElement$1(el, state)) + "," + (state.onceId++) + "," + key + ")")
  } else {
    return genStatic$1(el, state)
  }
}
/**
 * v-if指令的实现
 * @param {*} el 
 * @param {*} state 
 * @param {*} altGen 
 * @param {*} altEmpty 
 */
function genIf$1 (
  el,
  state,
  altGen,
  altEmpty
) 
{
  el.ifProcessed = true; // avoid recursion
  return genIfConditions$1(el.ifConditions.slice(), state, altGen, altEmpty)
}
/**
 * v-if的具体的实现
 * @param {*} conditions 抽象的数据的对象
 * @param {*} state  CodegenState对象实例
 * @param {*} altGen 
 * @param {*} altEmpty 
 */
function genIfConditions$1 (
  conditions,
  state,
  altGen,
  altEmpty
) 
{
  if (!conditions.length) 
  {
    return altEmpty || '_e()'
  }
  /**获取一个参数 */
  var condition = conditions.shift();
  /**获取关联的参数，对于有关联的参数的处理 */
  if (condition.exp) 
  {
    return ("(" + (condition.exp) + ")?" + (genTernaryExp(condition.block)) + ":" + (genIfConditions$1(conditions, state, altGen, altEmpty)))
  } 
  /**对于没有关联的参数的处理 */
  else 
  {
    return ("" + (genTernaryExp(condition.block)))
  }

  // v-if with v-once should generate code like (a)?_m(0):_m(1)
  /**
   * 
   * @param {*} el 
   */
  function genTernaryExp (el) 
  {
    return altGen
      ? altGen(el, state)
      : el.once
        ? genOnce$1(el, state)
        : genElement$1(el, state)
  }
}
/**
 * 
 * @param {*} el 
 * @param {*} state 
 * @param {*} altGen 
 * @param {*} altHelper 
 */
function genFor$1 (
  el,
  state,
  altGen,
  altHelper
) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';

  if ("development" !== 'production' &&
    state.maybeComponent(el) &&
    el.tag !== 'slot' &&
    el.tag !== 'template' &&
    !el.key
  ) {
    state.warn(
      "<" + (el.tag) + " v-for=\"" + alias + " in " + exp + "\">: component lists rendered with " +
      "v-for should have explicit keys. " +
      "See https://vuejs.org/guide/list.html#key for more info.",
      true /* tip */
    );
  }

  el.forProcessed = true; // avoid recursion
  return (altHelper || '_l') + "((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + ((altGen || genElement$1)(el, state)) +
    '})'
}
/**
 * 产生数据
 * @param {*} el 
 * @param {*} state 
 */
function genData$3 (el, state) 
{
  var data = '{';

  // directives first.
  // directives may mutate the el's other properties before they are generated.
  var dirs = genDirectives$1(el, state);
  if (dirs) { data += dirs + ','; }

  // key
  if (el.key) {
    data += "key:" + (el.key) + ",";
  }
  // ref
  if (el.ref) {
    data += "ref:" + (el.ref) + ",";
  }
  if (el.refInFor) {
    data += "refInFor:true,";
  }
  // pre
  if (el.pre) {
    data += "pre:true,";
  }
  // record original tag name for components using "is" attribute
  if (el.component) {
    data += "tag:\"" + (el.tag) + "\",";
  }
  // module data generation functions
  for (var i = 0; i < state.dataGenFns.length; i++) {
    data += state.dataGenFns[i](el);
  }
  // attributes
  if (el.attrs) {
    data += "attrs:{" + (genProps$1(el.attrs)) + "},";
  }
  // DOM props
  if (el.props) {
    data += "domProps:{" + (genProps$1(el.props)) + "},";
  }
  // event handlers
  if (el.events) {
    data += (genHandlers(el.events, false, state.warn)) + ",";
  }
  if (el.nativeEvents) {
    data += (genHandlers(el.nativeEvents, true, state.warn)) + ",";
  }
  // slot target
  // only for non-scoped slots
  if (el.slotTarget && !el.slotScope) {
    data += "slot:" + (el.slotTarget) + ",";
  }
  // scoped slots
  if (el.scopedSlots) {
    data += (genScopedSlots$1(el.scopedSlots, state)) + ",";
  }
  // component v-model
  if (el.model) {
    data += "model:{value:" + (el.model.value) + ",callback:" + (el.model.callback) + ",expression:" + (el.model.expression) + "},";
  }
  // inline-template
  if (el.inlineTemplate) {
    var inlineTemplate = genInlineTemplate$1(el, state);
    if (inlineTemplate) {
      data += inlineTemplate + ",";
    }
  }
  data = data.replace(/,$/, '') + '}';
  // v-bind data wrap
  if (el.wrapData) {
    data = el.wrapData(data);
  }
  // v-on data wrap
  if (el.wrapListeners) {
    data = el.wrapListeners(data);
  }
  return data
}

function genDirectives$1 (el, state) {
  var dirs = el.directives;
  if (!dirs) { return }
  var res = 'directives:[';
  var hasRuntime = false;
  var i, l, dir, needRuntime;
  for (i = 0, l = dirs.length; i < l; i++) {
    dir = dirs[i];
    needRuntime = true;
    var gen = state.directives[dir.name];
    if (gen) {
      // compile-time directive that manipulates AST.
      // returns true if it also needs a runtime counterpart.
      needRuntime = !!gen(el, dir, state.warn);
    }
    if (needRuntime) {
      hasRuntime = true;
      res += "{name:\"" + (dir.name) + "\",rawName:\"" + (dir.rawName) + "\"" + (dir.value ? (",value:(" + (dir.value) + "),expression:" + (JSON.stringify(dir.value))) : '') + (dir.arg ? (",arg:\"" + (dir.arg) + "\"") : '') + (dir.modifiers ? (",modifiers:" + (JSON.stringify(dir.modifiers))) : '') + "},";
    }
  }
  if (hasRuntime) {
    return res.slice(0, -1) + ']'
  }
}

function genInlineTemplate$1 (el, state) {
  var ast = el.children[0];
  if ("development" !== 'production' && (
    el.children.length !== 1 || ast.type !== 1
  )) {
    state.warn('Inline-template components must have exactly one child element.');
  }
  if (ast.type === 1) {
    var inlineRenderFns = generate$2(ast, state.options);
    return ("inlineTemplate:{render:function(){" + (inlineRenderFns.render) + "},staticRenderFns:[" + (inlineRenderFns.staticRenderFns.map(function (code) { return ("function(){" + code + "}"); }).join(',')) + "]}")
  }
}

function genScopedSlots$1 (
  slots,
  state
) {
  return ("scopedSlots:_u([" + (Object.keys(slots).map(function (key) {
      return genScopedSlot$1(key, slots[key], state)
    }).join(',')) + "])")
}

function genScopedSlot$1 (
  key,
  el,
  state
) {
  if (el.for && !el.forProcessed) {
    return genForScopedSlot$1(key, el, state)
  }
  var fn = "function(" + (String(el.slotScope)) + "){" +
    "return " + (el.tag === 'template'
      ? el.if
        ? ((el.if) + "?" + (genChildren$1(el, state) || 'undefined') + ":undefined")
        : genChildren$1(el, state) || 'undefined'
      : genElement$1(el, state)) + "}";
  return ("{key:" + key + ",fn:" + fn + "}")
}

function genForScopedSlot$1 (
  key,
  el,
  state
) {
  var exp = el.for;
  var alias = el.alias;
  var iterator1 = el.iterator1 ? ("," + (el.iterator1)) : '';
  var iterator2 = el.iterator2 ? ("," + (el.iterator2)) : '';
  el.forProcessed = true; // avoid recursion
  return "_l((" + exp + ")," +
    "function(" + alias + iterator1 + iterator2 + "){" +
      "return " + (genScopedSlot$1(key, el, state)) +
    '})'
}

function genChildren$1 (
  el,
  state,
  checkSkip,
  altGenElement,
  altGenNode
) {
  var children = el.children;
  if (children.length) {
    var el$1 = children[0];
    // optimize single v-for
    if (children.length === 1 &&
      el$1.for &&
      el$1.tag !== 'template' &&
      el$1.tag !== 'slot'
    ) {
      return (altGenElement || genElement$1)(el$1, state)
    }
    var normalizationType = checkSkip
      ? getNormalizationType$1(children, state.maybeComponent)
      : 0;
    var gen = altGenNode || genNode$1;
    return ("[" + (children.map(function (c) { return gen(c, state); }).join(',')) + "]" + (normalizationType ? ("," + normalizationType) : ''))
  }
}

// determine the normalization needed for the children array.
// 0: no normalization needed
// 1: simple normalization needed (possible 1-level deep nested array)
// 2: full normalization needed
function getNormalizationType$1 (
  children,
  maybeComponent
) {
  var res = 0;
  for (var i = 0; i < children.length; i++) {
    var el = children[i];
    if (el.type !== 1) {
      continue
    }
    if (needsNormalization$1(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return needsNormalization$1(c.block); }))) {
      res = 2;
      break
    }
    if (maybeComponent(el) ||
        (el.ifConditions && el.ifConditions.some(function (c) { return maybeComponent(c.block); }))) {
      res = 1;
    }
  }
  return res
}

function needsNormalization$1 (el) {
  return el.for !== undefined || el.tag === 'template' || el.tag === 'slot'
}

function genNode$1 (node, state) {
  if (node.type === 1) {
    return genElement$1(node, state)
  } if (node.type === 3 && node.isComment) {
    return genComment$1(node)
  } else {
    return genText$1(node)
  }
}

function genText$1 (text) {
  return ("_v(" + (text.type === 2
    ? text.expression // no need for () because already wrapped in _s()
    : transformSpecialNewlines$1(JSON.stringify(text.text))) + ")")
}

function genComment$1 (comment) {
  return ("_e(" + (JSON.stringify(comment.text)) + ")")
}
/**
 * 产生槽
 * @param {*} el 
 * @param {*} state 
 */
function genSlot$1 (el, state) {
  var slotName = el.slotName || '"default"';
  var children = genChildren$1(el, state);
  var res = "_t(" + slotName + (children ? ("," + children) : '');
  var attrs = el.attrs && ("{" + (el.attrs.map(function (a) { return ((camelize(a.name)) + ":" + (a.value)); }).join(',')) + "}");
  var bind$$1 = el.attrsMap['v-bind'];
  if ((attrs || bind$$1) && !children) {
    res += ",null";
  }
  if (attrs) {
    res += "," + attrs;
  }
  if (bind$$1) {
    res += (attrs ? '' : ',null') + "," + bind$$1;
  }
  return res + ')'
}

// componentName is el.component, take it as argument to shun flow's pessimistic refinement
/**
 * 产生组件
 * @param {*} componentName  组件名称
 * @param {*} el  dom属性
 * @param {*} state 状态值
 */
function genComponent$1 (
  componentName,
  el,
  state
) 
{
  var children = el.inlineTemplate ? null : genChildren$1(el, state, true);
  return ("_c(" + componentName + "," + (genData$3(el, state)) + (children ? ("," + children) : '') + ")")
}
/**
 * 
 * @param {*} props 属性
 */
function genProps$1 (props) 
{
  var res = '';
  for (var i = 0; i < props.length; i++) 
  {
    var prop = props[i];
    res += "\"" + (prop.name) + "\":" + (transformSpecialNewlines$1(prop.value)) + ",";
  }
  return res.slice(0, -1)
}

// #3895, #4268
/**
 * 
 * @param {*} text 文本字符串 
 */
function transformSpecialNewlines$1 (text) 
{
  return text
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

/*  */

var isAttr = makeMap(
  'accept,accept-charset,accesskey,action,align,alt,async,autocomplete,' +
  'autofocus,autoplay,autosave,bgcolor,border,buffered,challenge,charset,' +
  'checked,cite,class,code,codebase,color,cols,colspan,content,http-equiv,' +
  'name,contenteditable,contextmenu,controls,coords,data,datetime,default,' +
  'defer,dir,dirname,disabled,download,draggable,dropzone,enctype,method,for,' +
  'form,formaction,headers,height,hidden,high,href,hreflang,http-equiv,' +
  'icon,id,ismap,itemprop,keytype,kind,label,lang,language,list,loop,low,' +
  'manifest,max,maxlength,media,method,GET,POST,min,multiple,email,file,' +
  'muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,' +
  'preload,radiogroup,readonly,rel,required,reversed,rows,rowspan,sandbox,' +
  'scope,scoped,seamless,selected,shape,size,type,text,password,sizes,span,' +
  'spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,' +
  'target,title,type,usemap,value,width,wrap'
);

/* istanbul ignore next */
var isRenderableAttr = function (name) {
  return (
    isAttr(name) ||
    name.indexOf('data-') === 0 ||
    name.indexOf('aria-') === 0
  )
};
var propsToAttrMap = {
  acceptCharset: 'accept-charset',
  className: 'class',
  htmlFor: 'for',
  httpEquiv: 'http-equiv'
};

var ESC = {
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '&': '&amp;'
};

function escape (s) {
  return s.replace(/[<>"&]/g, escapeChar)
}

function escapeChar (a) {
  return ESC[a] || a
}

/*  */

/** 预留属性 */
var isReservedAttr$1 = makeMap('style,class');

// attributes that should be using props for binding
/** 接收值的属性 */
var acceptValue$1 = makeMap('input,textarea,option,select,progress');
/**
 * 必须使用的属性
 * @param {*} tag
 * @param {*} type
 * @param {*} attr 属性名称
 */

/** 枚举属性 */
var isEnumeratedAttr$1 = makeMap('contenteditable,draggable,spellcheck');
/** bool属性 */
var isBooleanAttr$1 = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);


/**
 * 判断是否是xlink
 * @param {*} name
 */

/**
 * 获取xlink属性的值
 * @param {*} name
 */

/**
 * 
 * @param {*} val
 */

/*  */

var plainStringRE = /^"(?:[^"\\]|\\.)*"$|^'(?:[^'\\]|\\.)*'$/;

// let the model AST transform translate v-model into appropriate
// props bindings
function applyModelTransform (el, state) {
  if (el.directives) {
    for (var i = 0; i < el.directives.length; i++) {
      var dir = el.directives[i];
      if (dir.name === 'model') {
        state.directives.model(el, dir, state.warn);
        break
      }
    }
  }
}

function genAttrSegments (
  attrs
) {
  return attrs.map(function (ref) {
    var name = ref.name;
    var value = ref.value;

    return genAttrSegment(name, value);
  })
}

function genDOMPropSegments (
  props,
  attrs
) {
  var segments = [];
  props.forEach(function (ref) {
    var name = ref.name;
    var value = ref.value;

    name = propsToAttrMap[name] || name.toLowerCase();
    if (isRenderableAttr(name) &&
      !(attrs && attrs.some(function (a) { return a.name === name; }))
    ) {
      segments.push(genAttrSegment(name, value));
    }
  });
  return segments
}

function genAttrSegment (name, value) {
  if (plainStringRE.test(value)) {
    // force double quote
    value = value.replace(/^'|'$/g, '"');
    // force enumerated attr to "true"
    if (isEnumeratedAttr$1(name) && value !== "\"false\"") {
      value = "\"true\"";
    }
    return {
      type: RAW,
      value: isBooleanAttr$1(name)
        ? (" " + name + "=\"" + name + "\"")
        : value === '""'
          ? (" " + name)
          : (" " + name + "=" + value)
    }
  } else {
    return {
      type: EXPRESSION,
      value: ("_ssrAttr(" + (JSON.stringify(name)) + "," + value + ")")
    }
  }
}

function genClassSegments (
  staticClass,
  classBinding
) {
  if (staticClass && !classBinding) {
    return [{ type: RAW, value: (" class=" + staticClass) }]
  } else {
    return [{
      type: EXPRESSION,
      value: ("_ssrClass(" + (staticClass || 'null') + "," + (classBinding || 'null') + ")")
    }]
  }
}

function genStyleSegments (
  staticStyle,
  parsedStaticStyle,
  styleBinding,
  vShowExpression
) {
  if (staticStyle && !styleBinding && !vShowExpression) {
    return [{ type: RAW, value: (" style=" + (JSON.stringify(staticStyle))) }]
  } else {
    return [{
      type: EXPRESSION,
      value: ("_ssrStyle(" + (parsedStaticStyle || 'null') + "," + (styleBinding || 'null') + ", " + (vShowExpression
          ? ("{ display: (" + vShowExpression + ") ? '' : 'none' }")
          : 'null') + ")")
    }]
  }
}

/*  */

/**
 * In SSR, the vdom tree is generated only once and never patched, so
 * we can optimize most element / trees into plain string render functions.
 * The SSR optimizer walks the AST tree to detect optimizable elements and trees.
 *
 * The criteria for SSR optimizability is quite a bit looser than static tree
 * detection (which is designed for client re-render). In SSR we bail only for
 * components/slots/custom directives.
 */

// optimizability constants
var optimizability = {
  FALSE: 0,    // whole sub tree un-optimizable
  FULL: 1,     // whole sub tree optimizable
  SELF: 2,     // self optimizable but has some un-optimizable children
  CHILDREN: 3, // self un-optimizable but have fully optimizable children
  PARTIAL: 4   // self un-optimizable with some un-optimizable children
};

var isPlatformReservedTag$1;

function optimize$1 (root, options) {
  if (!root) { return }
  isPlatformReservedTag$1 = options.isReservedTag || no;
  walk(root, true);
}

function walk (node, isRoot) {
  if (isUnOptimizableTree(node)) {
    node.ssrOptimizability = optimizability.FALSE;
    return
  }
  // root node or nodes with custom directives should always be a VNode
  var selfUnoptimizable = isRoot || hasCustomDirective(node);
  var check = function (child) {
    if (child.ssrOptimizability !== optimizability.FULL) {
      node.ssrOptimizability = selfUnoptimizable
        ? optimizability.PARTIAL
        : optimizability.SELF;
    }
  };
  if (selfUnoptimizable) {
    node.ssrOptimizability = optimizability.CHILDREN;
  }
  if (node.type === 1) {
    for (var i = 0, l = node.children.length; i < l; i++) {
      var child = node.children[i];
      walk(child);
      check(child);
    }
    if (node.ifConditions) {
      for (var i$1 = 1, l$1 = node.ifConditions.length; i$1 < l$1; i$1++) {
        var block = node.ifConditions[i$1].block;
        walk(block);
        check(block);
      }
    }
    if (node.ssrOptimizability == null ||
      (!isRoot && (node.attrsMap['v-html'] || node.attrsMap['v-text']))
    ) {
      node.ssrOptimizability = optimizability.FULL;
    } else {
      node.children = optimizeSiblings(node);
    }
  } else {
    node.ssrOptimizability = optimizability.FULL;
  }
}

function optimizeSiblings (el) {
  var children = el.children;
  var optimizedChildren = [];

  var currentOptimizableGroup = [];
  var pushGroup = function () {
    if (currentOptimizableGroup.length) {
      optimizedChildren.push({
        type: 1,
        parent: el,
        tag: 'template',
        attrsList: [],
        attrsMap: {},
        children: currentOptimizableGroup,
        ssrOptimizability: optimizability.FULL
      });
    }
    currentOptimizableGroup = [];
  };

  for (var i = 0; i < children.length; i++) {
    var c = children[i];
    if (c.ssrOptimizability === optimizability.FULL) {
      currentOptimizableGroup.push(c);
    } else {
      // wrap fully-optimizable adjacent siblings inside a template tag
      // so that they can be optimized into a single ssrNode by codegen
      pushGroup();
      optimizedChildren.push(c);
    }
  }
  pushGroup();
  return optimizedChildren
}

function isUnOptimizableTree (node) {
  if (node.type === 2 || node.type === 3) { // text or expression
    return false
  }
  return (
    isBuiltInTag(node.tag) || // built-in (slot, component)
    !isPlatformReservedTag$1(node.tag) || // custom component
    !!node.component // "is" component
  )
}

var isBuiltInDir = makeMap('text,html,show,on,bind,model,pre,cloak,once');

function hasCustomDirective (node) {
  return (
    node.type === 1 &&
    node.directives &&
    node.directives.some(function (d) { return !isBuiltInDir(d.name); })
  )
}

/*  */

// The SSR codegen is essentially extending the default codegen to handle
// SSR-optimizable nodes and turn them into string render fns. In cases where
// a node is not optimizable it simply falls back to the default codegen.

// segment types
var RAW = 0;
var INTERPOLATION = 1;
var EXPRESSION = 2;

function generate$1 (
  ast,
  options
) {
  var state = new CodegenState$1(options);
  var code = ast ? genSSRElement(ast, state) : '_c("div")';
  return {
    render: ("with(this){return " + code + "}"),
    staticRenderFns: state.staticRenderFns
  }
}

function genSSRElement (el, state) {
  if (el.for && !el.forProcessed) {
    return genFor$1(el, state, genSSRElement)
  } else if (el.if && !el.ifProcessed) {
    return genIf$1(el, state, genSSRElement)
  } else if (el.tag === 'template' && !el.slotTarget) {
    return el.ssrOptimizability === optimizability.FULL
      ? genChildrenAsStringNode(el, state)
      : genSSRChildren(el, state) || 'void 0'
  }

  switch (el.ssrOptimizability) {
    case optimizability.FULL:
      // stringify whole tree
      return genStringElement(el, state)
    case optimizability.SELF:
      // stringify self and check children
      return genStringElementWithChildren(el, state)
    case optimizability.CHILDREN:
      // generate self as VNode and stringify children
      return genNormalElement(el, state, true)
    case optimizability.PARTIAL:
      // generate self as VNode and check children
      return genNormalElement(el, state, false)
    default:
      // bail whole tree
      return genElement$1(el, state)
  }
}

function genNormalElement (el, state, stringifyChildren) {
  var data = el.plain ? undefined : genData$3(el, state);
  var children = stringifyChildren
    ? ("[" + (genChildrenAsStringNode(el, state)) + "]")
    : genSSRChildren(el, state, true);
  return ("_c('" + (el.tag) + "'" + (data ? ("," + data) : '') + (children ? ("," + children) : '') + ")")
}

function genSSRChildren (el, state, checkSkip) {
  return genChildren$1(el, state, checkSkip, genSSRElement, genSSRNode)
}

function genSSRNode (el, state) {
  return el.type === 1
    ? genSSRElement(el, state)
    : genText$1(el)
}

function genChildrenAsStringNode (el, state) {
  return el.children.length
    ? ("_ssrNode(" + (flattenSegments(childrenToSegments(el, state))) + ")")
    : ''
}

function genStringElement (el, state) {
  return ("_ssrNode(" + (elementToString(el, state)) + ")")
}

function genStringElementWithChildren (el, state) {
  var children = genSSRChildren(el, state, true);
  return ("_ssrNode(" + (flattenSegments(elementToOpenTagSegments(el, state))) + ",\"</" + (el.tag) + ">\"" + (children ? ("," + children) : '') + ")")
}

function elementToString (el, state) {
  return ("(" + (flattenSegments(elementToSegments(el, state))) + ")")
}

function elementToSegments (el, state) {
  // v-for / v-if
  if (el.for && !el.forProcessed) {
    el.forProcessed = true;
    return [{
      type: EXPRESSION,
      value: genFor$1(el, state, elementToString, '_ssrList')
    }]
  } else if (el.if && !el.ifProcessed) {
    el.ifProcessed = true;
    return [{
      type: EXPRESSION,
      value: genIf$1(el, state, elementToString, '"<!---->"')
    }]
  } else if (el.tag === 'template') {
    return childrenToSegments(el, state)
  }

  var openSegments = elementToOpenTagSegments(el, state);
  var childrenSegments = childrenToSegments(el, state);
  var ref = state.options;
  var isUnaryTag = ref.isUnaryTag;
  var close = (isUnaryTag && isUnaryTag(el.tag))
    ? []
    : [{ type: RAW, value: ("</" + (el.tag) + ">") }];
  return openSegments.concat(childrenSegments, close)
}

function elementToOpenTagSegments (el, state) {
  applyModelTransform(el, state);
  var binding;
  var segments = [{ type: RAW, value: ("<" + (el.tag)) }];
  // attrs
  if (el.attrs) {
    segments.push.apply(segments, genAttrSegments(el.attrs));
  }
  // domProps
  if (el.props) {
    segments.push.apply(segments, genDOMPropSegments(el.props, el.attrs));
  }
  // v-bind="object"
  if ((binding = el.attrsMap['v-bind'])) {
    segments.push({ type: EXPRESSION, value: ("_ssrAttrs(" + binding + ")") });
  }
  // v-bind.prop="object"
  if ((binding = el.attrsMap['v-bind.prop'])) {
    segments.push({ type: EXPRESSION, value: ("_ssrDOMProps(" + binding + ")") });
  }
  // class
  if (el.staticClass || el.classBinding) {
    segments.push.apply(
      segments,
      genClassSegments(el.staticClass, el.classBinding)
    );
  }
  // style & v-show
  if (el.staticStyle || el.styleBinding || el.attrsMap['v-show']) {
    segments.push.apply(
      segments,
      genStyleSegments(
        el.attrsMap.style,
        el.staticStyle,
        el.styleBinding,
        el.attrsMap['v-show']
      )
    );
  }
  // _scopedId
  if (state.options.scopeId) {
    segments.push({ type: RAW, value: (" " + (state.options.scopeId)) });
  }
  segments.push({ type: RAW, value: ">" });
  return segments
}

function childrenToSegments (el, state) {
  var binding;
  if ((binding = el.attrsMap['v-html'])) {
    return [{ type: EXPRESSION, value: ("_s(" + binding + ")") }]
  }
  if ((binding = el.attrsMap['v-text'])) {
    return [{ type: INTERPOLATION, value: ("_s(" + binding + ")") }]
  }
  return el.children
    ? nodesToSegments(el.children, state)
    : []
}

function nodesToSegments (
  children,
  state
) {
  var segments = [];
  for (var i = 0; i < children.length; i++) {
    var c = children[i];
    if (c.type === 1) {
      segments.push.apply(segments, elementToSegments(c, state));
    } else if (c.type === 2) {
      segments.push({ type: INTERPOLATION, value: c.expression });
    } else if (c.type === 3) {
      segments.push({ type: RAW, value: escape(c.text) });
    }
  }
  return segments
}

function flattenSegments (segments) {
  var mergedSegments = [];
  var textBuffer = '';

  var pushBuffer = function () {
    if (textBuffer) {
      mergedSegments.push(JSON.stringify(textBuffer));
      textBuffer = '';
    }
  };

  for (var i = 0; i < segments.length; i++) {
    var s = segments[i];
    if (s.type === RAW) {
      textBuffer += s.value;
    } else if (s.type === INTERPOLATION) {
      pushBuffer();
      mergedSegments.push(("_ssrEscape(" + (s.value) + ")"));
    } else if (s.type === EXPRESSION) {
      pushBuffer();
      mergedSegments.push(("(" + (s.value) + ")"));
    }
  }
  pushBuffer();

  return mergedSegments.join('+')
}

/*  */

function createCompilerCreator$1 (baseCompile) 
{
  return function createCompiler (baseOptions)
  {
    function compile (
      template,
      options
    ) 
    {
      var finalOptions = Object.create(baseOptions);
      var errors = [];
      var tips = [];
      finalOptions.warn = function (msg, tip) {
        (tip ? tips : errors).push(msg);
      };
      /**对于options的值不为空的处理 */
      if (options) 
      {
        // merge custom modules
        if (options.modules) 
        {
          finalOptions.modules =
            (baseOptions.modules || []).concat(options.modules);
        }
        // merge custom directives
        if (options.directives) 
        {
          finalOptions.directives = extend(
            Object.create(baseOptions.directives),
            options.directives
          );
        }
        // copy other options
        for (var key in options) 
        {
          if (key !== 'modules' && key !== 'directives') 
          {
            finalOptions[key] = options[key];
          }
        }
      }

      var compiled = baseCompile(template, finalOptions);
      {
        errors.push.apply(errors, detectErrors(compiled.ast));
      }
      compiled.errors = errors;
      compiled.tips = tips;
      return compiled
    }

    return {
      compile: compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    }
  }
}

/*  */

var createCompiler$1 = createCompilerCreator$1(function baseCompile (
  template,
  options
) {
  var ast = parse(template.trim(), options);
  optimize$1(ast, options);
  var code = generate$1(ast, options);
  return {
    ast: ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
});

/*  */

var ref$1 = createCompiler$1(baseOptions);
var compile$1 = ref$1.compile;
var compileToFunctions$1 = ref$1.compileToFunctions;

/*  */

exports.parseComponent = parseComponent;
exports.compile = compile;
exports.compileToFunctions = compileToFunctions;
exports.ssrCompile = compile$1;
exports.ssrCompileToFunctions = compileToFunctions$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));
