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

import { clusterInfo,Device,mockDevices,Message} from './clusterInfo';

import { getEvents } from '../event/services';

export default function ClusterInfo() {
  const { t } = useTranslation('clusterInfo');
  //const [backendVersion, setBackendVersion] = useState('');
  //const [devices, setmockDevices] = useState<Device[]>([]);
  const [devices, setmockDevices] = useState<Device[]>(mockDevices);
  const history = useHistory();

  const [loading, setLoading] = useState(false); 

  //初始化消息数组
   const [messages, setMessages] = useState<Message[]>([]);
  const fetchData = async () => {
    setLoading(true); // 开始加载
    try {
      const devicedata = await getdevstatus(); // 使用 async/await
      setmockDevices(devicedata);
      const eventDtata = await getEvents('');
      console.log('eventDtata:', eventDtata);
      // 确保 eventDtata.dat.list 的数据结构符合 Message 接口的定义
      const formattedMessages = eventDtata.dat.list.map((msg: any) => ({
        id : msg.id,
        rule_name: msg.rule_name,
        severity: msg.severity === 1 ? 'critical' : msg.severity === 2 ? 'warning' : 'info',
        target_ident: msg.target_ident,
        trigger_time: msg.trigger_time,
        link: "/alert-cur-events/"+msg.id
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error('Failed to fetch status:', error);
    } finally {
      setLoading(false); // 结束加载
    }
}

useEffect(() => {
  fetchData(); // 首次加载时调用
  const interval = setInterval(fetchData, 300000); // 每隔5分钟刷新一次
  return () => clearInterval(interval); // 组件卸载时清除定时器
}, []);

// 监听 messages 的变化
useEffect(() => {
  console.log('Messages updated:', messages);
}, [messages]);

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
        <h3 style={{ textAlign: 'center', fontSize: 16, marginBottom: 10 }}>
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
// 对 deviceCounts 进行分组
  const groupedDeviceCounts = clusterInfo.deviceCounts.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = [];
    }
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, typeof clusterInfo.deviceCounts>);

  // const [messages, setMessages] = useState([
  //   { type: 'critical', content: 'Critical message 1', link: '/critical/1' },
  //   { type: 'critical', content: 'Critical message 2', link: '/critical/2' },
  //   { type: 'critical', content: 'Critical message 3', link: '/critical/3' },
  //   { type: 'critical', content: 'Critical message 4', link: '/critical/4' },
  //   { type: 'critical', content: 'Critical message 5', link: '/critical/5' },
  //   { type: 'critical', content: 'Critical message 6', link: '/critical/6' },
  //   { type: 'critical', content: 'Critical message 7', link: '/critical/7' },
  //   { type: 'critical', content: 'Critical message 8', link: '/critical/8' },
  //   { type: 'warning', content: 'Warning message 1', link: '/warning/1' },
  //   { type: 'warning', content: 'Warning message 2', link: '/warning/2' },
  //   { type: 'warning', content: 'Warning message 3', link: '/warning/3' },
  //   { type: 'warning', content: 'Warning message 4', link: '/warning/4' },
  //   { type: 'warning', content: 'Warning message 5', link: '/warning/5' },
  //   { type: 'info', content: 'Info message 1', link: '/info/1' },
  //   { type: 'info', content: 'Info message 2', link: '/info/2' },
  // ]);

  const handleMessageClick = (link: string) => {
    // window.open(link, '_blank');
    history.push(link);
  };

  const renderMessageBox = (type: string) => {
  const filteredMessages = messages.filter(msg => msg.severity === type);
  const messageBoxRef = React.useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = React.useState(false);
  const [lineHeight, setLineHeight] = React.useState(24); // 默认行高

  React.useEffect(() => {
    if (messageBoxRef.current) {
      const containerHeight = messageBoxRef.current.clientHeight;
      const contentHeight = messageBoxRef.current.scrollHeight;
      // 获取第一个消息项的实际高度作为行高
      const firstMessageItem = messageBoxRef.current.querySelector('.message-item');
      if (firstMessageItem) {
        const itemHeight = firstMessageItem.clientHeight;
        setLineHeight(itemHeight);
      }
      const lineCount = Math.ceil(contentHeight / lineHeight);
      setShouldScroll(lineCount > 4);
    }
  }, [filteredMessages, type, lineHeight]);

  // 根据 type 设置标题
  const titleMap = {
    critical: '一级告警',
    warning: '二级告警',
    info: '三级告警'
  };

  return (
    <div className={`message-box ${type}`}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: '600',
        // color: type === 'critical' ? '#ff4d4f' : type === 'warning' ? '#faad14' : '#52c41a',
        marginBottom: '12px',
        paddingBottom: '8px',
        borderBottom: '2px solid',
        // borderColor: type === 'critical' ? '#ff4d4f' : type === 'warning' ? '#faad14' : '#52c41a'
      }}>
        {titleMap[type]}
      </h3>
      <div 
        className="message-scroll-container" 
        ref={messageBoxRef}
        style={{ overflow: shouldScroll ? 'hidden' : 'visible', height: shouldScroll ? '200px' : 'auto' }}
      >
        <div className="message-scroll-content" style={{ animation: shouldScroll ? 'scroll-up 20s linear infinite' : 'none' }}>
          {filteredMessages.map((msg, index) => (
            <div
              key={index}
              className="message-item"
              onClick={() => handleMessageClick(msg.link)}
            >
              {msg.target_ident+':'+msg.rule_name}
            </div>
          ))}
          {shouldScroll && filteredMessages.map((msg, index) => (
            <div
              key={`${index}-copy`}
              className="message-item"
              onClick={() => handleMessageClick(msg.link)}
            >
              {msg.target_ident+msg.rule_name}
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
      {/* 顶部横幅图片 (样式微调) */}
      <div className='top-img'> </div>
      <div 
      className="left-device-container">
        {/* 左侧设备状态模块 */}
        <div className="device-status-container">
  <h2 
  className='common-h2' 
  style={{ 
    marginBottom: 12,
    fontSize: 16,
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

<h2 className='common-h2'
          style={{ 
            marginBottom: 24,
            fontSize: 16,
            fontWeight: 600,
            // color: '#1f1f1f',
            position: 'relative',

            top:24
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
                // style={{ backgroundColor: item.color }}   
              />
              {/* <div style={{ flex: 1 }}> */}
                <div className='right-device-container-item-type'
                >
                  {item.type} {item.count} {item.unit || '台'}
                </div>
                {/* <div className='right-device-container-item-count'>
                  {item.count} {item.unit || '台'} */}
                  {/* <span className='right-device-container-item-unit'> */}
                    {/* {item.unit || '台'} */}
                  {/* </span> */}
                {/* </div> */}
              {/* </div> */}
            </div>
          ))}

 {/* 渲染分组后的数据 */}
{/* {Object.entries(groupedDeviceCounts).map(([group, items], groupIndex) => (
  <div 
    key={group}
    className={`right-device-container-item ${groupIndex === Object.keys(groupedDeviceCounts).length - 1 ? 'last-item' : ''}`}
  >
    <div style={{ display: 'flex', width: '100%' }}>
      {items.map((item, index) => (
        <div key={item.type} style={{ flex: 1 }}>
          <div 
            className="right-device-container-item-div" 
            style={{ backgroundColor: item.color }}   
          />
          <div>
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
))} */}

</div>

        {/* 中间集群描述 - 美化版 */}
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
          {renderMessageBox('critical')}
          {/* {renderMessageBox('1')} */}
          {renderMessageBox('warning')}
          {/* {renderMessageBox('2')} */}
          {renderMessageBox('info')}
          {/* {renderMessageBox('3')} */}
        </div>
      </div>
    </PageLayout>
  );
}
