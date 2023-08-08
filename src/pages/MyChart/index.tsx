import {
  listMyChartByPageUsingPOST,
  retryGenChartByAiAsyncUsingPOST,
} from '@/services/bi/chartController';
import ReactECharts from 'echarts-for-react';
import { Typography } from 'antd';

const { Paragraph } = Typography;

import { useModel } from '@@/exports';
import { Button, Card, Col, ConfigProvider, List, message, Result, Row, theme } from 'antd';
import Search from 'antd/es/input/Search';
import React, { useEffect, useState } from 'react';

/**
 * 我的图表页面
 * @constructor
 */
const MyChart: React.FC = () => {
  const { useToken } = theme;
  const { token } = useToken();
  const initSearchParams = {
    pageSize: 4,
    current: 1,
    sortField: 'createTime',
    sortOrder: 'desc',
  };
  // 获取登录用户
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};
  // 获取浏览器宽度
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({ ...initSearchParams });
  const [chartList, setChartList] = useState<API.Chart[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await listMyChartByPageUsingPOST(searchParams);
      if (res.data) {
        // 隐藏图表的title
        if (res.data.records) {
          res.data.records.forEach((data) => {
            if (data.status === 'succeed') {
              const chartOption = JSON.parse(data.genChart ?? '{}');
              chartOption.title = undefined;
              data.genChart = JSON.stringify(chartOption);
            }
          });
        }
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);
      } else {
        message.error('获取图表失败');
      }
    } catch (e: any) {
      message.error('获取图表失败，' + e.message);
    }
    setLoading(false);
  };

  const retryOrRefresh = async (item: API.Chart) => {
    if (item.status === 'failed') {
      // 重试
      const id: API.retryGenChartByAiAsyncUsingPOSTParams = { chartId: item.id };
      try {
        const res = await retryGenChartByAiAsyncUsingPOST(id);
        if (!res?.data) {
          message.error('提交任务失败，请稍后重试');
        } else {
          message.success('重试成功');
        }
      } catch (e: any) {
        message.error('提交任务失败，请稍后重试');
      }
      loadData();
    } else {
      // 刷新
      loadData();
    }
  };
  // 组件初始化和searchParams修改时(分页)查询图表
  useEffect(() => {
    loadData();
  }, [searchParams]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    // 清除事件监听器，防止内存泄漏
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // 空数组确保只在组件挂载时添加事件监听器

  return (
    <div>
      <div
        style={{
          fontSize: '20px',
          color: token.colorTextHeading,
          marginTop: 8,
          marginBottom: 20,
        }}
      >
        我的图表
      </div>
      <div style={{ width: windowWidth < 400 ? windowWidth - 100 : 400 }}>
        <Search
          placeholder="请输入图表名称"
          loading={loading}
          enterButton
          onSearch={(value) => {
            // 设置搜索条件
            setSearchParams({
              ...initSearchParams, // 搜索需要重新从第1页开始
              name: value,
            });
          }}
        />
        <Button style={{marginTop: 10}} type={'primary'} onClick={() => loadData()}>
          刷新
        </Button>
      </div>
      <List
        grid={{ gutter: 16, xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 2 }}
        itemLayout="vertical"
        pagination={{
          onChange: (page, pageSize) => {
            setSearchParams({
              ...searchParams,
              current: page,
              pageSize,
            });
          },
          pageSize: searchParams.pageSize,
          current: searchParams.current,
          total: total,
        }}
        loading={loading}
        dataSource={chartList}
        renderItem={(item) => (
          <Card
            style={{ marginTop: 12, borderRadius: 8, marginRight: 12 }}
            type="inner"
            bordered={false}
          >
            <List.Item key={item.id}>
              <div>
                <List.Item.Meta
                  title={<a href={''}>{item.name ?? '未命名图表'}</a>}
                  description={'分析目标：' + item.goal}
                />
                <>
                  <ConfigProvider
                    theme={{
                      components: {
                        Result: {
                          titleFontSize: 16,
                          subtitleFontSize: 14,
                          iconFontSize: 46,
                          algorithm: true, // 启用算法
                        },
                      },
                    }}
                  >
                    {item.status === 'wait' && (
                      <>
                        <Result
                          extra={[
                            <Button key="refresh"  onClick={() => loadData()}>
                              刷新
                            </Button>,
                          ]}
                          status="info"
                          title="任务排队中"
                          subTitle={item.execMessage ?? '请耐心等候'}
                        />
                      </>
                    )}
                    {item.status === 'running' && (
                      <>
                        <Result
                          extra={[
                            <Button key="refresh"  onClick={() => loadData()}>
                              刷新
                            </Button>,
                          ]}
                          status="info"
                          title="分析生成中"
                          subTitle={item.execMessage}
                        />
                      </>
                    )}
                    {item.status === 'succeed' && (
                      <>
                      <Paragraph
                        ellipsis={{
                          rows: 4,
                          expandable: true,
                          suffix: '',
                        }}
                        title={`${'AI 分析结论：' + item.genResult}`}
                      >
                        {'AI 分析结论：' + item.genResult}
                      </Paragraph>
                        <div style={{ width: windowWidth < 528 ? windowWidth - 128 : 400 }}>
                          <ReactECharts option={JSON.parse(item.genChart ?? '{}')} />
                        </div>
                      </>
                    )}
                    {item.status === 'failed' && (
                      <>
                        <Result
                          extra={[
                            <Button
                              key="retry"
                              onClick={() => retryOrRefresh(item)}
                            >
                              重试
                            </Button>,
                          ]}
                          status="error"
                          title="生成失败"
                          subTitle={item.execMessage}
                        />
                      </>
                    )}
                  </ConfigProvider>
                </>
              </div>
            </List.Item>
          </Card>
        )}
      />
    </div>
  );
};

export default MyChart;
