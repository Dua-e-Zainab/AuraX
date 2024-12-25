const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/iframe-content',
    createProxyMiddleware({
      target: 'http://127.0.0.1:5500', // Target iframe server
      changeOrigin: true,
      pathRewrite: { '^/iframe-content': '' },
    })
  );
};
