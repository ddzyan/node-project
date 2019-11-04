/**
 * 封装 request 对象
 * 方便获取和设置报文属性
 */
const parse = require("parseurl");
const qs = require("querystring");

module.exports = {
  // 设置报文头部信息
  set header(val) {
    this.req.headers = val;
  },

  // 获取头部信息
  get header() {
    return this.req.headers;
  },

  set url(val) {
    this.req.url = val;
  },

  get url() {
    return this.req.url;
  },

  // 源路径
  get origin() {
    return `${this.protocol}://${this.host}`;
  },

  // 获取完整路径
  get href() {},

  // 获取请求方法
  get method() {
    return this.req.method;
  },

  set method(val) {
    this.req.method = val;
  },

  /**
   * 将 query 字符串转换为对象
   */
  get query() {
    const str = this.querystring;
    const c = (this._querycache = this._querycache || {});
    return c[str] || (c[str] = qs.parse(str));
  },

  /**
   * 将 this.req 转换为对象
   * 获取 query 属性
   */
  get querystring() {
    if (!this.req) return "";
    return parse(this.req).query || "";
  }
};
