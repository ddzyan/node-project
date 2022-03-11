# Node Module 源码解析

# 前言

## 资料

- [node/loader.js at master · nodejs/node (github.com)](https://github.com/nodejs/node/blob/master/lib/internal/modules/cjs/loader.js)
- [Node 模块加载机制 | 黯羽轻扬 (ayqy.net)](http://www.ayqy.net/blog/node%E6%A8%A1%E5%9D%97%E5%8A%A0%E8%BD%BD%E6%9C%BA%E5%88%B6/)
- [模块：通用 JS 模块|节点.js v17.7.0 文档 (nodejs.org)](https://nodejs.org/api/modules.html#modules_cycles)

通过本文你可以了解到的内容：

- node 中循环引用会出现什么结果，原因是什么？
- 在进行模块包加载的时候，部分全局对象是如何实现的：require，modele，dirname？
- node module 和 require 源码实现？
- 做代码热更新的思路。

## 循环引用

针对循环引用的问题，我们可以先跑下下面代码，看看输出结果

a.js

```jsx
console.log("a starting");
exports.done = false;
const b = require("./b.js");
console.log("in a, b.done = %j", b.done);
exports.done = true;
console.log("a done");
```

b.js

```jsx
console.log("b starting");
exports.done = false;
const a = require("./a.js");
console.log("in b, a.done = %j", a.done);
exports.done = true;
console.log("b done");
```

main.js

```jsx
console.log("main starting");
const a = require("./a.js");
const b = require("./b.js");
console.log("in main, a.done = %j, b.done = %j", a.done, b.done);
```

输出的结果为

```bash
$ node main.js
main starting
a starting
b starting
in b, a.done = false
b done
in a, b.done = true
a done
in main, a.done = true, b.done = true

```

这里针对 b 模块未加载完成的时候再次引用 a 模块的情况，node 官方文档的解释为

当  `main.js`加载  `a.js`时，`a.js`依次加载  `b.js`。 此时，`b.js`尝试加载  `a.js`。 为了防止无限循环，将  `a.js`导出对象的未完成副本返回给  `b.js`模块。 然后  `b.js`完成加载，并将其  `exports`对象提供给  `a.js`模块。

到  `main.js`  加载这两个模块时，它们都已完成。

# 解析

## 重点

- Module.\_cache
- Module.loaded

## 源码解析

代码做过适量的简化，去除对源码理解不太相关的内容

```jsx
Module.prototype.require = function(id) {
  validateString(id, "id");
  if (id === "") {
    throw new ERR_INVALID_ARG_VALUE("id", id, "must be a non-empty string");
  }
  requireDepth++;
  try {
    return Module._load(id, this, /* isMain */ false);
  } finally {
    requireDepth--;
  }
};
```

```jsx
Module._load = function(request, parent, isMain) {
  // 以文件的绝对地址当成缓存 key
  const filename = Module._resolveFilename(request, parent, isMain);
  // 先通过 key 从缓存中获取模块
  const cachedModule = Module._cache[filename];
  if (cachedModule !== undefined) {
    updateChildren(parent, cachedModule, true);
    // 如果要加载的模块缓存已经存在，但是并没有完全加载好（循环加载关键）
    if (!cachedModule.loaded) {
      const parseCachedModule = cjsParseCache.get(cachedModule);
      if (!parseCachedModule || parseCachedModule.loaded)
        // 则将现在已经加载的内容直接返回
        return getExportsForCircularRequire(cachedModule);
      parseCachedModule.loaded = true;
    } else {
      // 已经加载好的模块，直接从缓存中读取返回
      return cachedModule.exports;
    }
  }

  // 首先按照原生模块进行加载
  const mod = loadNativeModule(filename, request);
  // 匹配则返回模块内容，不进行缓存
  if (mod?.canBeRequiredByUsers) return mod.exports;

  // 未命中缓存，也没匹配到原生模块，就创建一个新的 Module 实例
  const module = cachedModule || new Module(filename, parent);

  // 将新实例进行缓存，key为文件的绝对地址
  Module._cache[filename] = module;

  let threw = true;
  try {
    // 加载模块
    module.load(filename);
    threw = false;
  } finally {
    // 异常则从缓存中删除模块
    delete Module._cache[filename];
  }
  // 完成返回
  return module.exports;
};
```

```jsx
function Module(id = "", parent) {
  this.id = id;
  this.path = path.dirname(id);
  // 在模块中使用的 modules.export = Module 本身，而 exports 是Module的一个属性
  this.exports = {};
  moduleParentCache.set(this, parent);
  updateChildren(parent, this, false);
  this.filename = null;
  this.loaded = false;
  this.children = [];
}
```

```jsx
Module.prototype.load = function(filename) {
  this.filename = filename;
  this.paths = Module._nodeModulePaths(path.dirname(filename));
  // 获取文件类型
  const extension = findLongestRegisteredExtension(filename);
  // allow .mjs to be overridden
  if (StringPrototypeEndsWith(filename, ".mjs") && !Module._extensions[".mjs"])
    throw new ERR_REQUIRE_ESM(filename, true);

  // 按类型加载文件,支持 js json node
  Module._extensions[extension](this, filename);
  this.loaded = true;
};
```

```jsx
Module._extensions[".js"] = function(module, filename) {
  // 从缓存中获取文件内容
  const cached = cjsParseCache.get(module);
  let content;
  if (cached?.source) {
    // 读取后重置
    content = cached.source;
    cached.source = undefined;
  } else {
    // 缓存中不存在则直接读取文件内容
    content = fs.readFileSync(filename, "utf8");
  }
  // 包装执行
  module._compile(content, filename);
};

// Native extension for .json
Module._extensions[".json"] = function(module, filename) {
  const content = fs.readFileSync(filename, "utf8");
  try {
    // 直接使用JSON.parse 解析
    module.exports = JSONParse(stripBOM(content));
  } catch (err) {
    err.message = filename + ": " + err.message;
    throw err;
  }
};

// Native extension for .node
Module._extensions[".node"] = function(module, filename) {
  // 动态加载共享库，不读取文件内容
  return process.dlopen(module, path.toNamespacedPath(filename));
};
```

```jsx
Module.prototype._compile = function(content, filename) {
  // 包一层函数，使用 vm 虚拟机执行，不影响主进程
  const compiledWrapper = wrapSafe(filename, content, this);

  let inspectorWrapper = null;

  const dirname = path.dirname(filename);
  // 对 module.require 对二次封装
  const require = makeRequireFunction(this, redirects);
  let result;
  // 模块包内部使用的 exports 为 module.exports属性
  const exports = this.exports;
  const thisValue = exports;
  // 模块包内部的this 为module
  const module = this;
  if (requireDepth === 0) statCache = new SafeMap();
  if (inspectorWrapper) {
    result = inspectorWrapper(
      compiledWrapper,
      thisValue,
      exports,
      require,
      module,
      filename,
      dirname
    );
  } else {
    result = ReflectApply(compiledWrapper, thisValue, [
      exports,
      require,
      module,
      filename,
      dirname
    ]);
  }
  hasLoadedAnyUserCJSModule = true;
  if (requireDepth === 0) statCache = null;
  return result;
};
```

```jsx
function wrapSafe(filename, content, cjsModuleInstance) {
  try {
    // 将给定代码编译到提供的上下文中（如果没有提供上下文，则使用当前上下文），并将其返回包装在具有给定参数的函数中
    return vm.compileFunction(
      content,
      ["exports", "require", "module", "__filename", "__dirname"],
      {
        filename,
        importModuleDynamically(specifier, _, importAssertions) {
          const loader = asyncESM.esmLoader;
          return loader.import(
            specifier,
            loader.getBaseURL(normalizeReferrerURL(filename)),
            importAssertions
          );
        }
      }
    );
  } catch (err) {
    if (process.mainModule === cjsModuleInstance) enrichCJSError(err, content);
    throw err;
  }
}
```

```jsx
// 在缓存中模块包存在，但是模块包加载还未完全完成，则返回当前已经加载的内容
function getExportsForCircularRequire(module) {
  if (
    module.exports &&
    !isProxy(module.exports) &&
    ObjectGetPrototypeOf(module.exports) === ObjectPrototype &&
    // Exclude transpiled ES6 modules / TypeScript code because those may
    // employ unusual patterns for accessing 'module.exports'. That should
    // be okay because ES6 modules have a different approach to circular
    // dependencies anyway.
    !module.exports.__esModule
  ) {
    // This is later unset once the module is done loading.
    ObjectSetPrototypeOf(module.exports, CircularRequirePrototypeWarningProxy);
  }

  return module.exports;
}
```

---

`makeRequireFunction(this, redirects);`

```jsx
function makeRequireFunction(mod, redirects) {
  const Module = mod.constructor;

  let require;
  if (redirects) {
    const id = mod.filename || mod.id;
    const conditions = cjsConditions;
    const { resolve, reaction } = redirects;
    require = function require(specifier) {
      let missing = true;
      const destination = resolve(specifier, conditions);
      if (destination === true) {
        missing = false;
      } else if (destination) {
        const href = destination.href;
        if (destination.protocol === "node:") {
          const specifier = destination.pathname;
          const mod = loadNativeModule(specifier, href);
          if (mod && mod.canBeRequiredByUsers) {
            return mod.exports;
          }
          throw new ERR_UNKNOWN_BUILTIN_MODULE(specifier);
        } else if (destination.protocol === "file:") {
          let filepath;
          if (urlToFileCache.has(href)) {
            filepath = urlToFileCache.get(href);
          } else {
            filepath = fileURLToPath(destination);
            urlToFileCache.set(href, filepath);
          }
          // 使用 modelue.require 加载
          return mod.require(filepath);
        }
      }
      if (missing) {
        reaction(
          new ERR_MANIFEST_DEPENDENCY_MISSING(
            id,
            specifier,
            ArrayPrototypeJoin([...conditions], ", ")
          )
        );
      }
      return mod.require(specifier);
    };
  } else {
    require = function require(path) {
      return mod.require(path);
    };
  }

  function resolve(request, options) {
    validateString(request, "request");
    return Module._resolveFilename(request, mod, false, options);
  }

  require.resolve = resolve;

  function paths(request) {
    validateString(request, "request");
    return Module._resolveLookupPaths(request, mod);
  }

  resolve.paths = paths;

  require.main = process.mainModule;

  // Enable support to add extra extension types.
  require.extensions = Module._extensions;

  // 和 module._cache 缓存建立关系
  require.cache = Module._cache;

  return require;
}
```

## 热更新如何实现

要删除 require.cache 和 module.cache 中此模块的缓存，然后当代码再次执行的时候，会再次读取文件内容加入到缓存中
