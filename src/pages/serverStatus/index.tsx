import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Icon from '@ant-design/icons';
import PageLayout from '@/components/pageLayout';
import SystemInfoSvg from '../../../public/image/system-info.svg';
import './locale';

interface Device {
  id: string;
  name: string;
  rack: string;
  status: string;
}

const ServerStatus = () => {
  const history = useHistory();
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    // 模拟设备数据
    const mockDevices = [
      { id: '1', name: 'Device 1', rack: 'C01', status: 'normal' },
      { id: '2', name: 'Device 2', rack: 'C01', status: 'error' },
      { id: '3', name: 'Device 3', rack: 'C02', status: 'normal' },
      { id: '4', name: 'Device 4', rack: 'C02', status: 'error' },
    ];
    setDevices(mockDevices);

  }, []);

  const handleDeviceClick = (id: string) => {
    history.push(`/device/${id}`);
  };

  const renderRack = (rackId: string) => {
    const rackDevices = devices.filter(device => device.rack === rackId);
    return (
      <div key={rackId} style={{ margin: '0 10px', width: '48%' }}>
        <h3 style={{ textAlign: 'center', fontSize: 16, marginBottom: 8 }}>
          机柜 {rackId}
        </h3>
        {rackDevices.map(device => (
          <div
            key={device.id}
            style={{
              backgroundColor: device.status === 'normal' ? 'green' : 'red',
              color: 'white',
              padding: '10px 14px',
              margin: '4px',
              cursor: 'pointer',
              borderRadius: 6,
              fontSize: 13,
              textAlign: 'center',
              whiteSpace: 'nowrap' // 防止长名称换行
            }}
            onClick={() => handleDeviceClick(device.id)}
            title={`设备名称: ${device.name}, 状态: ${device.status}`}
          >
            {device.name}
          </div>
        ))}
      </div>
    );
  };

  return (
    <PageLayout
      title={
        <>
          <Icon component={SystemInfoSvg as any} /> {('机仓图')}
        </>
      }
    >
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        flexWrap: 'nowrap',
        gap: '20px',
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {renderRack('C01')}
        {renderRack('C02')}
      </div>
    </PageLayout>
  );
};

export default ServerStatus;