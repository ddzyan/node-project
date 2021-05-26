/**
 * 重写的方法有：
 * 1. 响应体设置获取
 * 2. 响应状态码设置获取
 * 3. 头部信息设置获取
 */

const getType = require("cache-content-type");

module.exports = {
  set body(val) {
    this._body = val;
    const setType = !this.has("Content-Type");

    // string
    if (typeof val === "string") {
      if (setType) this.type = "text";
      this.length = Buffer.byteLength(val);
      //this.length = val.length;
      return;
    }

    // buffer
    if (Buffer.isBuffer(val)) {
      if (setType) this.type = "bin";
      this.length = val.length;
      return;
    }

    /**
     * 由于 object 类型需要转换为 json
     * 所以不在这里设定Content-length
     */
    this.remove("Content-Length");
    this.type = "json";
  },

  get body() {
    return this._body;
  },

  set status(code) {
    this.res.statusCode = code;
  },

  get status() {
    return this.req.statusCode;
  },

  get headers() {
    return this.req.header;
  },

  set length(n) {
    this.set("Content-Length", n);
  },

  get length() {
    if (this.has("Content-Length")) {
      return Number.parseInt(this.get("Content-length"), 10);
    }
  },

  set type(type) {
    type = getType(type);
    if (type) {
      this.set("Content-Type", type);
    } else {
      this.remove("Content-Type");
    }
  },

  get type() {
    const type = this.get("Content-Type");
    if (!type) return "";
    return type.split(";", 1)[0];
  },

  remove(field) {
    this.res.removeHeader(field);
  },

  set(field, val) {
    this.res.setHeader(field, val);
  },
  has(field) {
    return this.res.getHeader(field);
  }
};
