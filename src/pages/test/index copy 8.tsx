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
  const [devices, setmockDevices] = useState<Device[]>([]);
  const history = useHistory();
  const [loading, setLoading] = useState(false); 
  const [alerts, setAlerts] = useState([
    { type: 'critical', messages: ['严重告警1', '严重告警2', '严重告警3','严重告警4', '严重告警5', '严重告警6'] },
    { type: 'warning', messages: ['警告告警1', '警告告警2', '警告告警3','警告告警4', '警告告警5', '警告告警6'] },
    { type: 'info', messages: ['提示告警1', '提示告警2', '提示告警3'] }
  ]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getdevstatus();
      setmockDevices(data);
    } catch (error) {
      console.error('Failed to fetch device status:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  const handleDeviceClick = (name: string) => {
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
      color='light'
      mouseLeaveDelay={0.1}
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
    const rackDevices = devices
    .filter(device => device.rack === rackId)
    .sort((a, b) => parseInt(a.id) - parseInt(b.id));
    let currentGroup: Device[] = [];

    return (
      <div key={rackId} style={{ margin: '0 10px', width: '48%' }}>
        <h3 style={{ textAlign: 'center', fontSize: 18, marginBottom: 10 }}>
          机柜 {rackId}
        </h3>
        {rackDevices.map((device, index) => {
          if (device.name.startsWith('cn')) {
            currentGroup.push(device);
            if (currentGroup.length === 2 || index === rackDevices.length - 1) {
              const group = currentGroup;
              currentGroup = [];
              return renderDeviceGroup(group);
            }
          } else {
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
          return null;
        })}
      </div>
    );
  };

  const renderAlertSection = (type: string, messages: string[]) => {
    const halfLength = Math.ceil(messages.length / 2);
    const firstRow = messages.slice(0, halfLength);
    const secondRow = messages.slice(halfLength);

    return (
      <div className={`alert-section ${type}`}>
        <div className="alert-messages">
          <div className="alert-row">
            {firstRow.map((message, index) => (
              <div key={index} className="alert-message">
                {message}
              </div>
            ))}
          </div>
          <div className="alert-row">
            {secondRow.map((message, index) => (
              <div key={`second-${index}`} className="alert-message">
                {message}
              </div>
            ))}
          </div>
          {/* 复制一份消息以实现无缝滚动 */}
          <div className="alert-row">
            {firstRow.map((message, index) => (
              <div key={`copy-${index}`} className="alert-message">
                {message}
              </div>
            ))}
          </div>
          <div className="alert-row">
            {secondRow.map((message, index) => (
              <div key={`copy-second-${index}`} className="alert-message">
                {message}
              </div>
            ))}
          </div>
        </div>
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
      {/* 顶部告警消息提示模块 */}
      <div className="alert-container">
        {alerts.map((alert, index) => renderAlertSection(alert.type, alert.messages))}
      </div>
      <div className="left-device-container">
        <div className="device-status-container">
          <h2 className='common-h2' style={{ marginBottom: 24, fontSize: 24, fontWeight: 600, position: 'relative', paddingLeft: 16 }}>
            设备状态
          </h2>
          <div className='left-device-container-rack'>
            {renderRack('C01')}
            {renderRack('C02')}
          </div>
        </div>
        <div className="cluster-description">
          <h2 className='common-h2' style={{ marginBottom: 24, fontSize: 24, fontWeight: 600, position: 'relative', paddingLeft: 16 }}>
            国产自主可控软件研发平台
          </h2>
          <p className='cluster-description-p'>
            {clusterInfo.description}
          </p>
          <div className='cluster-description-connect'>
            <h3 style={{ marginBottom: 16, fontSize: 18, fontWeight: 500 }}>
              连接登录节点
            </h3>
            <Link to="/embedded-dashboards?id=ebb3571f-0ca5-4529-9dae-8418dddeaf8f">
              <button style={{ padding: '8px 24px', backgroundColor: '#2f54eb', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 16, fontWeight: 500, transition: 'background-color 0.3s' }}>
                立即连接
              </button>
            </Link>
          </div>
        </div>
        <div className="device-status-container">
          <h2 className='common-h2' style={{ marginBottom: 24, fontSize: 24, fontWeight: 600, position: 'relative', paddingLeft: 16 }}>
            系统指标
          </h2>
          {clusterInfo.deviceCounts.map((item, index) => (
            <div key={item.type} className={`right-device-container-item ${index === clusterInfo.deviceCounts.length - 1 ? 'last-item' : ''}`}>
              <div className="right-device-container-item-div" style={{ backgroundColor: item.color }} />
              <div style={{ flex: 1 }}>
                <div className='right-device-container-item-type'>
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
