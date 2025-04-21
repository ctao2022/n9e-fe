import React,{ useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import Icon from '@ant-design/icons';
import PageLayout from '@/components/pageLayout';
import SystemInfoSvg from '../../../public/image/system-info.svg';
import { Pie } from '@ant-design/plots';
// import axios from 'axios';
import {getstatus,getcpustatus,getinfo, getjobstatus} from '@/services/slurm'

import { Table } from 'antd'; 

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

interface JobDetail {
    job_id: string;
    job_name: string;
    nodes: string;
    state: string;
    start_time: string;
    submit_time: string;
    user: string;
}

export default function PlatformOverview() {
    const [nodeInfo, setNodeInfo] = useState<NodeInfo>({ running: 0, idle: 0, unavailable: 0 });
    const [resourceInfo, setResourceInfo] = useState<ResourceInfo>({ allocated_cores: 0, idle_cores: 0, down_cores:0});
    const [jobInfo, setJobInfo] = useState<JobInfo>({ running: 0, queued: 0 });
    const [jobDetails, setJobDetails] = useState<JobDetail[]>([]);

    const fetchData = async () => {
        //获取节点状态
        getstatus().then(data => {
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
        //获取最近作业信息
        getinfo().then(data => {
            setJobDetails(data.jobs);
        });
    }

    useEffect(() => {
        fetchData(); // 首次加载时调用
        const interval = setInterval(fetchData, 60000); // 每隔1分钟刷新一次
        return () => clearInterval(interval); // 组件卸载时清除定时器
    }, []);

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

    const renderJobDetails = (details: JobDetail[]) => (
        <Table
            dataSource={details}
            columns={[
                { title: '作业ID', dataIndex: 'job_id', key: 'job_id' },
                { title: '作业名称', dataIndex: 'job_name', key: 'job_name' },
                { title: '节点', dataIndex: 'nodes', key: 'nodes' },
                { title: '状态', dataIndex: 'state', key: 'state' },
                { 
                    title: '开始时间', 
                    dataIndex: 'start_time', 
                    key: 'start_time',
                    sorter: (a: JobDetail, b: JobDetail) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
                    sortOrder: 'descend',
                    render: (text: string) => text.replace('T', ' ')
                },
                { 
                    title: '提交时间', 
                    dataIndex: 'submit_time', 
                    key: 'submit_time',
                    render: (text: string) => text.replace('T', ' ')
                },
                { title: '用户', dataIndex: 'user', key: 'user' },
            ]}
            pagination={false}
            size="small"
            bordered
            style={{ marginTop: 16 }}
            scroll={{ y: 'calc(100vh - 500px)' }}
        />
    );

    const CanvasWrapper = ({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) => (
        <div style={{ ...style }}>
            {children}
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
            <div style={{ height: '100vh', overflow: 'hidden' }}>
                <div style={{ height: '50%' }}>
                    <Title level={4}>资源信息</Title>
                    <Row gutter={[16, 16]}>
                        <Col span={8}>
                            <Card title="节点信息" >
                                {renderNodeInfo(nodeInfo)}
                                <CanvasWrapper style={{ height: '200px' }}>
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
                                </CanvasWrapper>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="CPU资源" >
                                {renderResourceInfo(resourceInfo)}
                                <Row gutter={16}>
                                    <Col span={24}>
                                        <CanvasWrapper style={{ height: '200px' }}>
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
                                        </CanvasWrapper>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card title="作业信息" >
                                {renderJobInfo(jobInfo)}
                                <CanvasWrapper style={{ height: '200px' }}>
                                    <Pie
                                        data={[
                                            { type: '运行中', value: jobInfo.running },
                                            { type: '排队中', value: jobInfo.queued },
                                        ]}
                                        angleField="value"
                                        colorField="type"
                                        radius={0.8}
                                        label={{
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
                                </CanvasWrapper>
                            </Card>
                        </Col>
                    </Row>
                </div>
                <div style={{ height: 'calc(100vh - 400px)', marginTop: 16 }}>
                    <Card title="最近作业信息" style={{ height: '100%', overflow: 'hidden' }}>
                        {renderJobDetails(jobDetails)}
                    </Card>
                </div>
            </div>
        </PageLayout>
    );
}