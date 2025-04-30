import { Link } from 'react-router-dom';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@ant-design/icons';
import PageLayout from '@/components/pageLayout';
 import SystemInfoSvg from '../../../public/image/system-info.svg';
 import bannerImg from './image.jpg'; // 假设图片放在同目录
import './locale';
import './styles.css';
import { useHistory } from 'react-router-dom';
import { Tooltip } from 'antd'; // 新增Antd Tooltip组件导入

import {getdevstatus} from '@/services/slurm'

import { clusterInfo,Device} from './clusterInfo';

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
  //const [devices, setDevices] = useState<Device[]>(mockDevices); // 移动初始化到useState

  const handleDeviceClick = (name: string) => {
   // history.push(`/device/${name}`);
   // history.push(`/built-in-components/dashboard/detail?__uuid__=1717556327744505000&ident=${name}`);
   window.open(`/built-in-components/dashboard/detail?__uuid__=1717556327744505000&ident=${name}`,'_blank');
  };
  const renderDeviceTooltip = (device: Device) => (
    <div className='tooltip-inner'>
      <p style={{ margin: 0, color: '#595959' }}>设备名称: {device.name}</p>
      <p style={{ margin: 0, color: device.status === 'normal' ? '#52c41a' : '#f5222d' }}>
        状态: {device.status}
      </p>
    </div>
  );

  const renderDeviceGroup = (group: Device[]) => (
      <Tooltip
        key={group[0].id}
        title={<>{group.map(renderDeviceTooltip)}</>}
        // color="#ffffff" // 使用明确的颜色值
        color='light'
        mouseLeaveDelay={0.1} // 设置鼠标移出后 Tooltip 消失的延迟时间为 0.1 秒
      >
        <div className={`device-group ${group.every(d => d.status === 'normal') ? '' : 'error'}`}>
          <div style={{ display: 'flex', width: '100%' }}>
            {group.map((d, idx) => (
              <div
                key={d.id}
                className={`device-item ${idx === 0 ? 'first-item' : idx === group.length - 1 ? 'last-item' : ''}`}
                onClick={() => handleDeviceClick(d.name)}
              >
                {d.name}
              </div>
            ))}
          </div>
        </div>
      </Tooltip>
    );
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
              return renderDeviceGroup(group);
            }
          } else {
            // 如果是非 cn 设备，直接渲染
            return (
               <Tooltip key={device.id} title={renderDeviceTooltip(device)} color="light" mouseLeaveDelay={0.1}>
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
        <div className="device-status-container">
  <h2 
  className='common-h2' 
  style={{ 
    marginBottom: 24,
    fontSize: 24,
    fontWeight: 600,
    // color: '#1f1f1f',
    position: 'relative',
    paddingLeft: 16
  }}
  >
    设备状态
  </h2>
  <div  className='left-device-container-rack'>
  {renderRack('C01')}
  {renderRack('C02')}
</div>
</div>

        {/* 左侧集群描述 - 美化版 */}
        <div className="cluster-description"  >
          <h2 className='common-h2'
           style={{ 
            marginBottom: 24,
            fontSize: 24,
            fontWeight: 600,
            // color: '#1f1f1f',
            position: 'relative',
            paddingLeft: 16
          }}>

            国产自主可控软件研发平台
          </h2>
          <p  className='cluster-description-p'>
            {clusterInfo.description}
          </p>

          {/* 添加连接服务器块 */}
          <div className='cluster-description-connect'>
            <h3 
            style={{ 
              marginBottom: 16,
              fontSize: 18,
              fontWeight: 500,
              // color: '#1f1f1f'
            }}
            >
              连接登录节点
            </h3>
            <Link to="/embedded-dashboards?id=ebb3571f-0ca5-4529-9dae-8418dddeaf8f">
              <button 
              style={{
                padding: '8px 24px',
                backgroundColor: '#2f54eb',
                 color: '#fff',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 16,
                fontWeight: 500,
                transition: 'background-color 0.3s'
              }}
              >
                立即连接
              </button>
            </Link>
          </div>
        </div>

        {/* 右侧设备统计 - 美化版 */}
        <div className="device-status-container">
          <h2 className='common-h2'
          style={{ 
            marginBottom: 24,
            fontSize: 24,
            fontWeight: 600,
            // color: '#1f1f1f',
            position: 'relative',
            paddingLeft: 16
          }}>

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
              <div style={{ flex: 1 }}>
                <div className='right-device-container-item-type'
                >
                  {item.type}
                </div>
                <div className='right-device-container-item-count'>
                  {item.count} 
                  <span className='right-device-container-item-unit'>
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
