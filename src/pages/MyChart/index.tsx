import { listMyChartByPageUsingPOST } from '@/services/bi/chartController';
import ReactECharts from 'echarts-for-react';

import { useModel } from '@@/exports';
import { Card, List, message, theme } from 'antd';
import React, { useEffect, useState } from 'react';
import Search from "antd/es/input/Search";

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
          res.data.records.forEach(data => {
            const chartOption = JSON.parse(data.genChart ?? '{}')
            chartOption.title = undefined;
            data.genChart = JSON.stringify(chartOption);
          })
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
      <div style={{width: windowWidth < 400 ? windowWidth - 100 : 400}}>
        <Search placeholder="请输入图表名称" loading={loading} enterButton onSearch={(value) => {
          // 设置搜索条件
          setSearchParams({
            ...initSearchParams,  // 搜索需要重新从第1页开始
            name: value,
          })
        }} />
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
            })
          },
          pageSize: searchParams.pageSize,
          current: searchParams.current,
          total: total,
        }}
        loading={loading}
        dataSource={chartList}
        renderItem={(item) => (
          <Card style={{ marginTop: 12, borderRadius: 8, marginRight: 12 }} type="inner" bordered={false}>
            <List.Item key={item.id}>
              <div>
                <List.Item.Meta
                  title={<a href={''}>{item.name ?? '未命名图表'}</a>}
                  description={'分析目标：' + item.goal}
                />
                <p>{'AI 分析结论：' + item.genResult}</p>
                <div style={{ width: (windowWidth < 528 ? windowWidth - 128 : 400) }}>
                  <ReactECharts option={JSON.parse(item.genChart ?? '{}')} />
                </div>
              </div>
            </List.Item>
          </Card>
        )}
      />
    </div>
  );
};

export default MyChart;
