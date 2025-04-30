/*
 * Copyright 2022 Nightingale Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
// import React from 'react';

import { Link } from 'react-router-dom';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '@ant-design/icons';
import PageLayout from '@/components/pageLayout';
 import SystemInfoSvg from '../../../public/image/system-info.svg';
 import bannerImg from './image.jpg'; // 假设图片放在同目录
import './locale';
import { units } from '@/components/TimeRangePicker/config';
import './styles.css';

export default function ClusterInfo() {
  const { t } = useTranslation('clusterInfo');
  const [backendVersion, setBackendVersion] = useState('');

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
      { type: '存储容量', count: 68,unit:'TB', color: '#fa8c16' },
      { type: '总内存', count: 3072, unit: 'GB', color: '#f5222d' },
      { type: '计算系统双精度峰值性能', count: 224, unit: 'TFlops',color: '#52c41a' }
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
      <div style={{ 
        height: 320,
        backgroundImage: `url(${bannerImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        marginBottom: 32,
        borderRadius: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '24px 32px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
          color: '#fff'
        }}>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: 32,
        padding: '0 24px',
        maxWidth: '100%', // 修改为100%宽度
        margin: '0' // 取消居中效果
      }}>
        {/* 左侧集群描述 - 美化版 */}
        <div className="cluster-description" style={{
          flex: 1,
          border: '1px solid #e8e8e8',
          borderRadius: 12,
          padding: '32px',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          transition: 'all 0.3s'
        }}>
          <h2 style={{ 
            marginBottom: 24,
            fontSize: 24,
            fontWeight: 600,
            color: '#1f1f1f',
            position: 'relative',
            paddingLeft: 16
          }}>
            <div style={{
              position: 'absolute',
              left: 0,
              top: 4,
              bottom: 4,
              width: 4,
              backgroundColor: '#2f54eb',
              borderRadius: 2
            }} />
            国产自主可控软件研发平台
          </h2>
          <p style={{ 
            lineHeight: 2.8,
            color: '#595959',
            fontSize: 17,
            whiteSpace: 'pre-wrap',
            textAlign: 'justify',
            textIndent: '2em',
            letterSpacing: 0.4,
            marginBottom: 24,
            fontFamily: `-apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial`
          }}>
            {clusterInfo.description}
          </p>

          {/* 添加连接服务器块 */}
          <div style={{
            marginTop: 24,
            padding: '16px',
            border: '1px solid #e8e8e8',
            borderRadius: 8,
            backgroundColor: '#fafafa',
            textAlign: 'center'
          }}>
            <h3 style={{ 
              marginBottom: 16,
              fontSize: 18,
              fontWeight: 500,
              color: '#1f1f1f'
            }}>
              连接登录节点
            </h3>
            <Link to="/embedded-dashboards?id=ebb3571f-0ca5-4529-9dae-8418dddeaf8f">
              <button style={{
                padding: '8px 24px',
                backgroundColor: '#2f54eb',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 16,
                fontWeight: 500,
                transition: 'background-color 0.3s'
              }}>
                立即连接
              </button>
            </Link>
          </div>
        </div>

        {/* 右侧设备统计 - 美化版 */}
        <div className="device-stats" style={{
          width: 480,
          border: '1px solid #e8e8e8',
          borderRadius: 12,
          padding: '32px',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          transition: 'all 0.3s'
        }}>
          <h2 style={{ 
            marginBottom: 24,
            fontSize: 24,
            fontWeight: 600,
            color: '#1f1f1f',
            position: 'relative',
            paddingLeft: 16
          }}>
            <div style={{
              position: 'absolute',
              left: 0,
              top: 4,
              bottom: 4,
              width: 4,
              backgroundColor: '#2f54eb',
              borderRadius: 2
            }} />
            系统指标
          </h2>
          
          {clusterInfo.deviceCounts.map((item, index) => (
            <div 
              key={item.type}
              className="device-item"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px 0',
                borderBottom: index === clusterInfo.deviceCounts.length - 1 
                  ? 'none' 
                  : '1px solid #f0f0f0',
                transition: 'all 0.2s'
              }}
            >
              <div style={{
                width: 8,
                height: 32,
                backgroundColor: item.color,
                marginRight: 16,
                borderRadius: 4
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ 
                  color: '#595959',
                  fontSize: 16,
                  marginBottom: 4
                }}>
                  {item.type}
                </div>
                <div style={{ 
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: '#1f1f1f',
                  letterSpacing: 0.5
                }}>
                  {item.count} 
                  <span style={{
                    fontSize: 16,
                    color: '#8c8c8c',
                    marginLeft: 8
                  }}>
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
