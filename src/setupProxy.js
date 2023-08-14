// setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/post', // The path that triggers the proxy
        createProxyMiddleware({
            target: 'https://app.kotapermaionline.com.my', // The target URL of the API
            changeOrigin: true,
        })
    );
};
