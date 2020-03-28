/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// eslint-disable-next-line
/// <reference path="./global.d.ts" />

/* eslint-disable no-underscore-dangle */
import debug from 'debug';
import { Registry, DubboUrl } from '@dovyih/dubbo-js/';

// eslint-disable-next-line
import { IDubboRegistryProps } from '@dovyih/dubbo-js/es7/typings/types';
import { NacosNamingClient, INacosServicegData } from 'nacos-naming';

const log = debug('dubbo:nacos');

export interface INacosClientProps {
  logger: any;
  serviceNames: string[];
  groupName: string;
  serverList: string;
  namespace: string;
}

function serviceData2Url(serviceDatra: INacosServicegData): string {
  const { metadata } = serviceDatra;
  return `dubbo://${
    serviceDatra.ip
  }:${
    serviceDatra.port
  }/${
    metadata.interface
  }?anyhost=${
    metadata.anyhost
  }&application=${
    metadata.application
  }&default.timeout=3000&dubbo=${
    metadata.dubbo
  }&&environment=product&interface=${
    metadata.interface
  }&methods=${
    metadata.methods
  }&pid=${
    metadata.pid
  }&sid=${
    metadata.side
  }&timestamp=${
    metadata.timestamp
  }`;
}

export class NacosRegistry extends Registry<INacosClientProps & IDubboRegistryProps> {
  private _client: NacosNamingClient;

  /**
   * 获取所有的负载列表，通过agentAddrMap聚合出来
   * 这样有点Reactive的感觉，不需要考虑当中增加删除的动作
   */
  private get _allAgentAddrSet() {
    const agentSet = new Set() as Set<string>;
    // eslint-disable-next-line no-restricted-syntax
    for (const urlList of this._dubboServiceUrlMap.values()) {
      // eslint-disable-next-line no-restricted-syntax
      for (const url of urlList) {
        agentSet.add(`${url.host}:${url.port}`);
      }
    }
    log('agentSet: %O', this._dubboServiceUrlMap.keys());
    log('agentSet: %O', agentSet);
    return agentSet;
  }

  constructor(props: INacosClientProps & IDubboRegistryProps) {
    super(props);
    const { logger, serverList, namespace } = this._props;
    this._client = new NacosNamingClient({
      logger,
      serverList,
      namespace,
    });

    this._client.ready()
      .then(async () => {
        const {
          // application: {name},
          interfaces,
          groupName = 'DEFAULT_GROUP',
        } = this._props;
        // TODO: third param clusters
        // eslint-disable-next-line no-restricted-syntax
        for (const inf of interfaces) {
          const serviceName = `providers:${inf}::`;

          // eslint-disable-next-line no-await-in-loop
          const instArr = await this._client.getAllInstances(serviceName, groupName) as INacosServicegData[];

          const dubboUrlArr = instArr
            .map(serviceData2Url)
            .map(DubboUrl.from);

          this._dubboServiceUrlMap.set(inf, dubboUrlArr);


          this._subscriber.onData(this._allAgentAddrSet);

          // this._client.subscribe(serviceName, hosts => {
          //   console.log(hosts)
          // });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

export default function nacos(props: INacosClientProps) {
  return function (dubboProps: IDubboRegistryProps) {
    return new NacosRegistry({
      ...props,
      ...dubboProps,
    });
  };
}

