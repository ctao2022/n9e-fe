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
import './locale';

interface ServerItem {
  id: number;
  name: string;
  status: '正常' | '故障';
  link: string;
}

const serverData: ServerItem[] = [
  { id: 1, name: 'Server 1', status: '正常', link: '/server/1' },
  { id: 2, name: 'Server 2', status: '故障', link: '/server/2' },
  { id: 3, name: 'Server 3', status: '正常', link: '/server/1' },
  { id: 4, name: 'Server 4', status: '故障', link: '/server/2' },
  { id: 5, name: 'Server 5', status: '正常', link: '/server/1' },
  { id: 6, name: 'Server 6', status: '故障', link: '/server/2' },
  { id: 7, name: 'Server 7', status: '正常', link: '/server/1' },
  { id: 8, name: 'Server 8', status: '故障', link: '/server/2' },
  { id: 9, name: 'Server 9', status: '正常', link: '/server/1' },
  { id: 10, name: 'Server 10', status: '故障', link: '/server/2' },
  { id: 11, name: 'Server 11', status: '正常', link: '/server/1' },
  { id: 12, name: 'Server 12', status: '故障', link: '/server/2' },
  { id: 13, name: 'Server 13', status: '正常', link: '/server/1' },
  { id: 14, name: 'Server 14', status: '故障', link: '/server/2' },
  { id: 15, name: 'Server 15', status: '正常', link: '/server/1' },
  { id: 16, name: 'Server 16', status: '故障', link: '/server/2' },
  { id: 17, name: 'Server 17', status: '故障', link: '/server/2' },
  { id: 18, name: 'Server 18', status: '故障', link: '/server/2' },
  { id: 19, name: 'Server 19', status: '正常', link: '/server/1' },
  { id: 20, name: 'Server 20', status: '故障', link: '/server/2' },
  { id: 21, name: 'Server 21', status: '故障', link: '/server/2' }
  // 其他服务器信息...
];

export default function Demo1() {

  const { t } = useTranslation('demo1');
  const [backendVersion, setBackendVersion] = useState('');
  
  return (

    <PageLayout
    title={
      <>
        <Icon component={SystemInfoSvg as any} /> {t('机仓图')}
      </>
    }
  >

    <div style={{ padding: 16 }}>
    <h1>服务器机仓</h1>
    <div
      style={{
        display: 'flex',
        gap: 16,
      }}
    >
      {/* 新增左侧序号区域 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '810px', // 修改为与右侧服务器区域相同高度
          border: '1px solid #ccc',
          padding: '16px 8px',
          borderRadius: 8,
          justifyContent: 'space-between', // 调整为均匀分布
        }}
      >
        {serverData.map((_, index) => (
          <React.Fragment key={`fragment-${index}`}>
            <div
              key={`num-${index * 2 + 1}`}
              style={{
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#555',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              {index * 2 + 1}
            </div>
            <div
              key={`num-${index * 2 + 2}`}
              style={{
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#555',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              {index * 2 + 2}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* 修改后的服务器区域 */}
      <div
        key={0}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '810px',
          border: '1px solid #ccc',
          padding: 16,
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        {serverData.map((server, idx) => (
          <div
            key={server.id}
            style={{
              height: '36px',
              backgroundColor: server.status === '正常' ? 'green' : 'red',
              margin: '6px 0',
              padding: '0 8px',
              textAlign: 'center',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative', // 添加相对定位以便子元素绝对定位
            }}
          >
            <Link
              to={server.link}
              style={{
                color: 'black',
                textDecoration: 'none',
                display: 'block',
                lineHeight: 'normal',
              }}
            >
              {server.name}
            </Link>
            {idx < serverData.length - 1 && ( // 确保最后一个元素后面没有横线
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  backgroundColor: '#ccc',
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
  </PageLayout>
  );
}
