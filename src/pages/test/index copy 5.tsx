import { Link } from 'react-router-dom';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@ant-design/icons';
import PageLayout from '@/components/pageLayout';
 import SystemInfoSvg from '../../../public/image/system-info.svg';
import './locale';
import './styles.css';
import { useHistory } from 'react-router-dom';
import { Tooltip } from 'antd'; // 新增Antd Tooltip组件导入

import {getdevstatus} from '@/services/slurm'

// 定义 Device 接口
interface Device {
  id: string;
  name: string;
  type: string;
  rack: string;
  status: string;
}

export default function ClusterInfo() {
  const { t } = useTranslation('clusterInfo');
  //const [backendVersion, setBackendVersion] = useState('');
  const [devices, setmockDevices] = useState<Device[]>([]);
  const history = useHistory();

  const [loading, setLoading] = useState(false); 
  const fetchData = async () => {
    // getdevstatus().then(data => {
    //   setmockDevices(data);
    // });
    setLoading(true); // 开始加载
    try {
      const data = await getdevstatus(); // 使用 async/await
      setmockDevices(data);
    } catch (error) {
      console.error('Failed to fetch device status:', error);
    } finally {
      setLoading(false); // 结束加载
    }

  }
    useEffect(() => {
        fetchData(); // 首次加载时调用
        const interval = setInterval(fetchData, 300000); // 每隔5分钟刷新一次
        return () => clearInterval(interval); // 组件卸载时清除定时器
    }, []);

  const handleDeviceClick = (name: string) => {
   // history.push(`/device/${name}`);
   // history.push(`/built-in-components/dashboard/detail?__uuid__=1717556327744505000&ident=${name}`);
   window.open(`/built-in-components/dashboard/detail?__uuid__=1717556327744505000&ident=${name}`,'_blank');
  };
  const renderRack = (rackId: string) => {
    // 新增：分离cn服务器和其他设备
    const rackDevices = devices
    .filter(device => device.rack === rackId)
    .sort((a, b) => parseInt(a.id) - parseInt(b.id));
    // 用于存储当前分组的设备
    let currentGroup: Device[] = [];

    return (
      <div key={rackId} style={{ margin: '0 10px', width: '48%' }}>
        <h3 style={{ textAlign: 'center', fontSize: 18, marginBottom: 10 }}>
          机柜 {rackId}
        </h3>
        {/* 渲染设备 */}
        {rackDevices.map((device, index) => {
          if (device.name.startsWith('cn')) {
            // 如果是 cn 设备，加入当前分组
            currentGroup.push(device);
  
            // 如果当前分组有 2 个设备，或者已经是最后一个设备，则渲染分组
            if (currentGroup.length === 2 || index === rackDevices.length - 1) {
              const group = currentGroup;
              currentGroup = []; // 清空当前分组
  
              return (
                <Tooltip
                  key={group[0].id}
                  title={
                    <div className='tooltip-inner'>
                      {group.map(d => (
                        <React.Fragment key={d.id}>
                          <p style={{ margin: 0, color: '#595959' }}>设备名称: {d.name}</p>
                          <p style={{
                            margin: 0,
                            color: d.status === 'normal' ? '#52c41a' : '#f5222d'
                          }}>
                            状态: {d.status}
                          </p>
                        </React.Fragment>
                      ))}
                    </div>
                  }
                  color="light"
                >
                  <div
                    className={`device-group ${group.every(d => d.status === 'normal') ? '' : 'error'}`}
                  >
                    <div style={{ display: 'flex', width: '100%' }}>
                      {group.map((d, idx) => (
                        <div key={d.id} 
                          style={{
                            flex: 1,
                            borderRight: idx === 0 ? '1px solid white' : 'none',
                            padding: '0 3px',
                            backgroundColor: d.status === 'normal' ? 'green' : 'red', // 独立设置背景色
                            borderRadius: idx === 0 ? '8px 0 0 8px' : idx === group.length - 1 ? '0 8px 8px 0' : '0' // 圆角处理
                          }}
                          onClick={() => handleDeviceClick(d.name)} // 为每个设备单独绑定点击事件
                        >
                          {d.name}
                        </div>
                      ))}
                    </div>
                  </div>
                </Tooltip>
              );
            }
          } else {
            // 如果是非 cn 设备，直接渲染
            return (
              <Tooltip
                key={device.id}
                title={
                  <div className='tooltip-inner'>
                    <p style={{ margin: 0, color: '#595959' }}>设备名称: {device.name}</p>
                    <p style={{
                      margin: 0,
                      color: device.status === 'normal' ? '#52c41a' : '#f5222d'
                    }}>
                      状态: {device.status}
                    </p>
                  </div>
                }
                color="light"
              >
                <div
                className={`device-group ${device.status === 'normal' ? '' : 'error'} ${device.type === 'switch' ? 'switch' : ''}`}
                  onClick={() => handleDeviceClick(device.name)}
                >
                  {device.name}
                </div>
              </Tooltip>
            );
          }
          return null; // 确保所有路径都有返回值
        })}
      </div>
    );
  };

  // 集群信息数据
  const clusterInfo = {
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
      { type: '计算节点', count: 8, color: '#2f54eb' },
      { type: '登录节点', count: 2, color: '#722ed1' },
      { type: '交换机', count: 4, color: '#13c2c2' },
      { type: '存储容量', count: 68, unit: 'TB', color: '#fa8c16' },
      { type: '总内存', count: 3072, unit: 'GB', color: '#f5222d' },
      { type: '计算系统双精度峰值性能', count: 224, unit: 'TFlops', color: '#52c41a' }
    ]
  };

  return (
    <PageLayout
      title={
        <>
          <Icon component={SystemInfoSvg as any} /> {t('平台介绍')}
        </>
      }
    >
      {/* 顶部横幅图片 (样式微调) */}
      
      <div className='top-img'> </div>
      <div 
       className="left-device-container">
        {/* 新增设备状态模块 */}
        <div className="device-status-container" >
  <h2 className='common-h2'>
    <div className='common-h2-div' />
    设备状态
  </h2>
  <div className='left-device-container-rack'>
  {renderRack('C01')}
  {renderRack('C02')}
</div>
</div>

        {/* 中间集群描述 - 美化版 */}
        <div className="cluster-description" >
          <h2  className='common-h2' >
            <div  className='common-h2-div' />
            国产自主可控软件研发平台
          </h2>
          <p className='cluster-description-p'>
            {clusterInfo.description}
          </p>

          {/* 添加连接服务器块 */}
          <div  className='cluster-description-connect'>
            <h3 className='cluster-description-connect-h3'>
              连接登录节点
            </h3>
            <Link to="/embedded-dashboards?id=ebb3571f-0ca5-4529-9dae-8418dddeaf8f">
              <button className='cluster-description-connect-button'>
                立即连接
              </button>
            </Link>
          </div>
        </div>

        {/* 右侧设备统计 - 美化版 */}
        <div className="device-status-container" >
          <h2 className='common-h2'>
            <div className='common-h2-div'/>
            系统指标
          </h2>
          
          {clusterInfo.deviceCounts.map((item, index) => (
            <div 
              key={item.type}
              className={`right-device-container-item ${index === clusterInfo.deviceCounts.length - 1 ? 'last-item' : ''}`}
            >
              <div 
              className="right-device-container-item-div" 
              style={{ backgroundColor: item.color }}  
              />
              <div 
              style={{ flex: 1 }}>
                <div className='right-device-container-item-type'>
                  {item.type}
                </div>
                <div  className='right-device-container-item-count'>
                  {item.count} 
                  <span  className='right-device-container-item-unit'>
                    {item.unit || '台'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
