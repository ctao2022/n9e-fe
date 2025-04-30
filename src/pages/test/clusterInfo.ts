import { group } from "console";

// clusterInfo.ts
export const clusterInfo = {
    description: ` 
      项目目的：针对自主研发的大规模并行数值模拟程序，建设相应的国产超算硬件平台和配套的系统环境，保障相关项目的按计划实施。
      系统组成：登录节点服务器、计算节点服务器、交换机、存储系统、机柜、制冷系统、作业调度和监控系统、基础运行环境和相关软件库。
      软件系统包括作业调度和监控系统、基础运行环境和相关软件库等。
      登录节点服务器包括2台基于申威多核CPU构建的登录节点，每台登录节点服务器包含2颗国产申威多核处理器；
      计算节点服务器包括8台基于基于新一代国产众核CPU构建的众核计算节点，每台众核计算节点包含2颗新一代国产众核处理器；
      存储系统采用NAS/SAN 统一存储，用于存放用户数据；
      网络系统包括1台基于国产申威交换芯片交换机，1台带外管理千兆交换机，1台带内管理千兆交换机，一台数据交换万兆交换机；
      机柜、制冷系统包含2个IT机柜及2个列间空调，机柜系统热通道封闭。
       `,
    deviceCounts: [
      { type: '计算节点',group:'node', count: 8 },
      { type: '登录节点', group:'node',count: 2 },
      { type: '交换机', group:'node',count: 4 },
      { type: '存储容量', group:'node',count: 68, unit: 'TB' },
      { type: '总内存', group:'node',count: 3072, unit: 'GB' },
      { type: '双精度峰值性能',group:'node', count: 224, unit: 'TFlops' }
    ]
  };

  // 定义 Device 接口
  export interface Device {
    id: string;
    name: string;
    type: string;
    rack: string;
    status: string;
  }

  export const mockDevices = [
    {
      "id": "1",
      "name": "esw",
      "rack": "C01",
      "status": "normal",
      "type": "switch"
    },
    {
      "id": "2",
      "name": "gisw",
      "rack": "C01",
      "status": "normal",
      "type": "switch"
    },
    {
      "id": "3",
      "name": "cn07",
      "rack": "C01",
      "status": "normal",
      "type": "server"
    },
    {
      "id": "4",
      "name": "cn08",
      "rack": "C01",
      "status": "normal",
      "type": "server"
    },
    {
      "id": "5",
      "name": "cn05",
      "rack": "C01",
      "status": "normal",
      "type": "server"
    },
    {
      "id": "6",
      "name": "cn06",
      "rack": "C01",
      "status": "normal",
      "type": "server"
    },
    {
      "id": "7",
      "name": "cn03",
      "rack": "C01",
      "status": "normal",
      "type": "server"
    },
    {
      "id": "8",
      "name": "cn04",
      "rack": "C01",
      "status": "normal",
      "type": "server"
    },
    {
      "id": "9",
      "name": "cn01",
      "rack": "C01",
      "status": "normal",
      "type": "server"
    },
    {
      "id": "10",
      "name": "cn02",
      "rack": "C01",
      "status": "normal",
      "type": "server"
    },
    {
      "id": "11",
      "name": "mn01",
      "rack": "C01",
      "status": "normal",
      "type": "server"
    },
    {
      "id": "12",
      "name": "matlab",
      "rack": "C01",
      "status": "normal",
      "type": "server"
    },
    {
      "id": "13",
      "name": "dtsw",
      "rack": "C02",
      "status": "normal",
      "type": "switch"
    },
    {
      "id": "14",
      "name": "gosw",
      "rack": "C02",
      "status": "normal",
      "type": "switch"
    },
    {
      "id": "15",
      "name": "cn15",
      "rack": "C02",
      "status": "normal",
      "type": "server"
    },
    {
      "id": "16",
      "name": "cn16",
      "rack": "C02",
      "status": "normal",
      "type": "server"
    },
    {
      "id": "17",
      "name": "cn13",
      "rack": "C02",
      "status": "normal",
      "type": "server"
    },
    {
      "id": "18",
      "name": "cn14",
      "rack": "C02",
      "status": "normal",
      "type": "server"
    },
    {
      "id": "19",
      "name": "cn11",
      "rack": "C02",
      "status": "normal",
      "type": "server"
    },
    {
      "id": "20",
      "name": "cn12",
      "rack": "C02",
      "status": "normal",
      "type": "server"
    },
    {
      "id": "21",
      "name": "cn09",
      "rack": "C02",
      "status": "normal",
      "type": "server"
    },
    {
      "id": "22",
      "name": "cn10",
      "rack": "C02",
      "status": "normal",
      "type": "server"
    },
    {
      "id": "23",
      "name": "mn02",
      "rack": "C02",
      "status": "normal",
      "type": "server"
    },
    {
      "id": "24",
      "name": "io",
      "rack": "C02",
      "status": "normal",
      "type": "server"
    }
  ];
  
  export interface Message {
    id: string;
    rule_name: string;
    target_ident: string;
    severity: string;
    trigger_time:  string;
    link: string;
  }