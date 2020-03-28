# @dovyih/dubbo-nacos-register

apache/dubbo-js nacos registr impl.

## usage

```js
const { Dubbo, java, setting } = require('@dovyih/dubbo-js');
const nacos = require('./dist/nacos').default;

setting
  .match('dev.yidafu.auncel.user.center.api.EchoService', {
    version: '0.0.0',
  });

const echoProvider = dubbo =>
  dubbo.proxyService({
    dubboInterface: 'dev.yidafu.auncel.user.center.api.EchoService',
    version: '0.0.0',
    methods: {
      echo(name) {
        return [java.String(name)];
      },
    },
  });

const service = {
  echoProvider,
};
const dubbo = new Dubbo({
  application: { name: 'node-dubbo' },
  register: nacos({
    logger: console,
    serverList: '101.37.29.47:6399',
    namespace: 'public',
  }),
  dubboSetting: setting,
  service,
});

(async () => {
  const { res, err } = await dubbo.service.echoProvider.echo('node');
  console.log('======================================');
  console.log(res);
  console.log('======================================');
})();
```
