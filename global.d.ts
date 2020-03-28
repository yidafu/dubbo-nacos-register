/* --------------------------------------------------------------------------*
 * Description:                                                              *
 *                                                                           *
 * File Created: Saturday, 28th March 2020 10:26 am                          *
 * Author: yidafu(dov-yih) (me@yidafu.dev)                                   *
 *                                                                           *
 * Last Modified: Saturday, 28th March 2020 10:26 am                         *
 * Modified By: yidafu(dov-yih) (me@yidafu.dev>)                             *
 *                                                                           *
 * Copyright 2019 - 2020 Mozilla Public License 2.0                          *
 *-------------------------------------------------------------------------- */


declare module 'nacos-naming' {

    
  export interface INacosMetaData {
    side: string;
    methods: string;
    release: string;
    deprecated: string;
    dubbo: string;
    pid: string;
    interface: string;
    generic: string;
    path: string;
    protocol: string;
    application: string;
    dynamic: string;
    category: string;
    anyhost: string;
    'bean.name': string;
    timestamp: string;
  }

  export interface INacosServicegData {
    valid: boolean;
    marked: boolean;
    metadata: INacosMetaData;
    instanceId: string;
    port: number;
    healthy: boolean;
    ip: string;
    clusterName: string;
    weight: number;
    ephemeral: boolean;
    serviceName: string;
    enabled: boolean;
  }


  export interface INacosNamingClientConstructor{
    logger: any;
    serverList: string;
    namespace: string;
  }

  export class NacosNamingClient {

    constructor(props: INacosNamingClientConstructor);

    ready(): Promise<void>;

    /**
     *  Query instance list of service.
     *
     * @param {string} serviceName  Service name
     * @param {string} [groupName]  group name, default is DEFAULT_GROUP
     * @param {string} [clusters]  Cluster names
     * @param {boolean} [subscribe] whether subscribe the service, default is true
     * @returns {Promise<INacosServicegData[]>}
     * @memberof NacosNamingClient
     */
    getAllInstances(serviceName: string, groupName?: string, clusters?: string, subscribe?: boolean): Promise<INacosServicegData[]>;
  }
}
