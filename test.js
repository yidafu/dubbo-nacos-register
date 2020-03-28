const { Dubbo, java, setting } = require('@dovyih/dubbo-js');
const nacos = require('./dist/nacos').default;

console.log(nacos);

setting
  .match('dev.yidafu.auncel.user.center.api.EchoService', {
    version: '0.0.0',
  });

const echoProvider = dubbo =>
  dubbo.proxyService({
    dubboInterface: 'dev.yidafu.auncel.user.center.api.EchoService',
    version: '0.0.0',
    // group: 'DEFAULT_GROUP',
    methods: {
      echo(name) {
        return [java.String(name)];
      },
    },
  });

const service = {
  echoProvider,
};
// ;create dubbo object
const dubbo = new Dubbo({
  application: { name: 'node-dubbo' },
  // register: 'localhost:2181',
  register: nacos({
    logger: console,
    serverList: '101.37.29.47:6399',
    namespace: 'public',
  }),
  dubboSetting: setting,
  service,
});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

(async () => {
  await sleep(3000);
  const { res, err } = await dubbo.service.echoProvider.echo('node');
  console.log('======================================');
  console.log(res, err);
  console.log('======================================');
  // print {err: null, res:'hello node from dubbo service'}
})();
