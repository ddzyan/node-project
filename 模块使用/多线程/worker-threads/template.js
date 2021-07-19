const fs = require('fs');
const lodash = require('lodash');
const { parentPort, workerData } = require('worker_threads');

function firstTask({ reqRecord }) {
  const { nodePath } = reqRecord.module.server;
  const { htmlPath } = reqRecord.module.server;
  const { metaPath } = reqRecord.module.server;

  let html = '';
  let meta = '';
  if (fs.existsSync(htmlPath)) {
    html = fs.readFileSync(htmlPath, { encoding: 'utf8' });
  }
  if (fs.existsSync(metaPath)) {
    meta = fs.readFileSync(metaPath, { encoding: 'utf8' });
    try {
      meta = JSON.parse(meta);
    } catch (e) {
      logger.error('JSON.parse(meta) error: %O', metaPath);
      metrics.info('JSON.parse(meta) error', 0, {
        file: metaPath,
      });
    }
  }
  let compiledHtmlFun = null;
  if (html) {
    try {
      compiledHtmlFun = lodash.template(html, {
        // 默认语法配置 https://lodash.com/docs/4.17.15#template
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g,
        evaluate: /<%([\s\S]+?)%>/g,
      });
    } catch (err) {
      console.error(
        '[message=%s||file=%s||biz_flag=page_module_get_compiledHtmlFun_error||meta=%j] custom page get compiledHtmlFun error: %O',
        err && err.message,
        htmlPath,
        metaPath,
        err,
      );
      if (reqRecord.req.bizEnv == BizEnv.online) {
        // 线上降级成html返回
        compiledHtmlFun = null;
      } else {
        throw err;
      }
    }

    try {
      const script = require(nodePath);
      return {
        startTime: +new Date(),
        script,
        html,
        meta,
        compiledHtmlFun,
      };
    } catch (err) {
      // 异常文件删除 重试获取最新
      if (process.env.DEV_BIZ_CODE !== 'sls-dev-local') {
        try {
          // 删除 meta 文件，保障文件可以重新进行下载
          fs.unlinkSync(require.resolve(metaPath));
          fs.unlinkSync(require.resolve(nodePath));
        } catch (err) {
          console.info('fs unlink sync modulePath %s error %O', nodePath, err);
        }
      }
      throw err;
    }
  }
}

const data = firstTask(workerData);
parentPort.postMessage(data);
