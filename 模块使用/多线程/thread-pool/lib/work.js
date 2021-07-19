class Work {
  constructor({ workId, filename, options }) {
    this.workId = workId;
    this.filename = filename;
    this.options = options;
    this.data = null;
    this.error = null;
  }
}

module.exports = Work;
