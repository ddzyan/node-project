module.exports = {
  set body(val) {
    this._body = val;
  },

  get body() {
    return this._body;
  },

  set status(code) {
    this.req.statusCode = code;
  },

  get status() {
    return this.req.statusCode;
  },

  get headers() {
    return this.req.header;
  }
};
