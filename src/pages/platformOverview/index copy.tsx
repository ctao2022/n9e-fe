import React,{ useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import Icon from '@ant-design/icons';
import PageLayout from '@/components/pageLayout';
import SystemInfoSvg from '../../../public/image/system-info.svg';
import { Pie } from '@ant-design/plots';
// import axios from 'axios';
import {getstatus,getcpustatus,getinfo, getjobstatus} from '@/services/slurm'

const { Title } = Typography;

interface NodeInfo {
    running: number;
    idle: number;
    unavailable: number;
}

interface ResourceInfo {
    allocated_cores: number;
    idle_cores: number;
    down_cores: number;
}

interface JobInfo {
    running: number;
    queued: number;
}

export default function PlatformOverview() {
    const [nodeInfo, setNodeInfo] = useState<NodeInfo>({ running: 0, idle: 0, unavailable: 0 });
    const [resourceInfo, setResourceInfo] = useState<ResourceInfo>({ allocated_cores: 0, idle_cores: 0 ,down_cores:0});
    const [jobInfo, setJobInfo] = useState<JobInfo>({ running: 0, queued: 0 });

    useEffect(() => {
        const fetchData = async () => {
            //获取节点状态
                getstatus().then(data => {
                    debugger;
                    setNodeInfo({
                        running: data.allocated_nodes,
                        idle: data.idle_nodes,
                        unavailable: data.down_nodes,
                    });
                });
                //获取cpu状态
                getcpustatus().then(data => {
                    setResourceInfo({
                        allocated_cores: data.allocated_cores,
                        idle_cores: data.idle_cores,
                        down_cores: data.down_cores,
                    });
                });
                //获取作业运行信息
                getjobstatus().then(data => {
                    setJobInfo({
                        running: data.pending_jobs,
                        queued: data.running_jobs,
                    });
                });
            }
            fetchData(); 
    },[]);

    const renderNodeInfo = (info: NodeInfo) => (
        <div>
            <Row gutter={16}>
                <Col span={8}>
                    <Statistic title="运行中" value={info.running} />
                </Col>
                <Col span={8}>
                    <Statistic title="空闲" value={info.idle} />
                </Col>
                <Col span={8}>
                    <Statistic title="不可用" value={info.unavailable} />
                </Col>
            </Row>
        </div>
    );

    const renderResourceInfo = (info: ResourceInfo) => (
        <div>
            <Row gutter={16}>
                <Col span={8}>
                    <Statistic title="已分配核心数" value={info.allocated_cores} />
                </Col>
                <Col span={8}>
                    <Statistic title="空闲核心数" value={info.idle_cores} />
                </Col>
                <Col span={8}>
                    <Statistic title="不可用核心数" value={info.down_cores} />
                </Col>
            </Row>
        </div>
    );

    const renderJobInfo = (info: JobInfo) => (
        <div>
            <Row gutter={16}>
                <Col span={12}>
                    <Statistic title="运行中" value={info.running} />
                </Col>
                <Col span={12}>
                    <Statistic title="排队中" value={info.queued} />
                </Col>
            </Row>
        </div>
    );

    return (
        <PageLayout
        title={
          <>
            <Icon component={SystemInfoSvg as any} /> {('平台介绍')}
          </>
        }
      >
        <div>
            <Title level={4}>资源信息</Title>
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Card title="节点信息[hpc01-q_sw9a]">
                        {renderNodeInfo(nodeInfo)}
                        <Pie
                            data={[
                                { type: '运行中', value: nodeInfo.running },
                                { type: '空闲', value: nodeInfo.idle },
                                { type: '不可用', value: nodeInfo.unavailable },
                            ]}
                            angleField="value"
                            colorField="type"
                            radius={0.8}
                            label={{
                                // visible: true,
                                type: 'inner',
                                offset: '-50%',
                            }}
                            interactions={[
                                {
                                    type: 'element-selected',
                                },
                                {
                                    type: 'element-active',
                                },
                            ]}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="资源信息[hpc01-q_sw9a]">
                        {renderResourceInfo(resourceInfo)}
                        <Row gutter={16}>
                            <Col span={24}>
                                <Pie
                                    data={[
                                        { type: '运行中', value: resourceInfo.allocated_cores },
                                        { type: '空闲', value: resourceInfo.idle_cores },
                                        { type: '不可用', value: resourceInfo.down_cores },
                                    ]}
                                    angleField="value"
                                    colorField="type"
                                    radius={0.8}
                                    label={{
                                        // visible: true,
                                        type: 'inner',
                                        offset: '-50%',
                                    }}
                                    interactions={[
                                        {
                                            type: 'element-selected',
                                        },
                                        {
                                            type: 'element-active',
                                        },
                                    ]}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="作业[hpc01-q_sw9a]">
                        {renderJobInfo(jobInfo)}
                        <Pie
                            data={[
                                { type: '运行中', value: jobInfo.running },
                                { type: '排队中', value: jobInfo.queued },
                            ]}
                            angleField="value"
                            colorField="type"
                            radius={0.8}
                            label={{
                                // visible: true,
                                type: 'inner',
                                offset: '-50%',
                            }}
                            interactions={[
                                {
                                    type: 'element-selected',
                                },
                                {
                                    type: 'element-active',
                                },
                            ]}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
        </PageLayout>
    );
}