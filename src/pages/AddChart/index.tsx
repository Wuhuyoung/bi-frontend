import {genChartByAiUsingPOST} from '@/services/bi/chartController';
import {UploadOutlined} from '@ant-design/icons';

import {Button, Card, Col, Form, Input, message, Row, Select, Space, theme, Upload} from 'antd';
import ReactECharts from 'echarts-for-react';
import React, {useState} from 'react';

/**
 * 添加图表页面（同步）
 * @constructor
 */
const AddChart: React.FC = () => {
  const {useToken} = theme;
  const {token} = useToken();

  const [chart, setChart] = useState<API.AiResponse>();
  const [option, setOption] = useState<any>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  /**
   * 提交，调用后端接口，生成图表分析信息
   * @param values
   */
  const onFinish = async (values: any) => {
    // 避免重复提交
    if (submitting) {
      return;
    }
    setSubmitting(true);
    setChart(undefined);
    setOption(null);
    // 对接后端，上传数据
    const params = {
      ...values,
      file: undefined,
    };
    try {
      const res = await genChartByAiUsingPOST(params, {}, values.file.file.originFileObj);
      if (!res?.data) {
        message.error('分析失败');
        setSubmitting(false);
      } else {
        const chartOption = JSON.parse(res.data.genChart ?? '');
        if (!chartOption) {
          throw new Error('图表代码解析错误');
        } else {
          setChart(res.data);
          setOption(chartOption);
          message.success('分析成功');
        }
        setSubmitting(false);
      }
    } catch (e: any) {
      message.error('分析失败，' + e.message);
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Row gutter={24}>
        <Col span={12}>
          <Card
            style={{
              borderRadius: 8,
            }}
            bodyStyle={{
              backgroundImage: 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
            }}
          >
            <div
              style={{
                fontSize: '20px',
                color: token.colorTextHeading,
                marginTop: 12,
                marginBottom: 28,
              }}
            >
              AI 数据分析
            </div>
            <div className="add-chart">
              <Form name="addChart" labelAlign="left" labelCol={{span: 4}} wrapperCol={{span: 18}}
                    onFinish={onFinish} initialValues={{}}>
                <Form.Item
                  name="goal"
                  label="分析目标"
                  rules={[{required: true, message: '请输入分析目标'}]}
                >
                  <Input.TextArea
                    showCount
                    maxLength={200}
                    placeholder="请输入分析目标，比如：分析网站用户的增长情况"
                  />
                </Form.Item>

                <Form.Item name="name" label="图表名称">
                  <Input placeholder="请输入图表名称"/>
                </Form.Item>

                <Form.Item name="chartType" label="图表类型">
                  <Select
                    placeholder="请选择要生成的图表类型"
                    options={[
                      {value: '折线图', label: '折线图'},
                      {value: '平滑折线图', label: '平滑折线图'},
                      {value: '柱状图', label: '柱状图'},
                      {value: '饼图', label: '饼图'},
                      {value: '散点图', label: '散点图'},
                      {value: '堆叠图', label: '堆叠图'},
                      {value: '雷达图', label: '雷达图'},
                    ]}
                  ></Select>
                </Form.Item>

                <Form.Item
                  name="file"
                  label="原始数据"
                  rules={[{required: true, message: '请选择要分析的excel文件'}]}
                >
                  <Upload name="file" action="/upload.do" listType="picture" maxCount={1}>
                    <Button icon={<UploadOutlined/>}>上传 CSV/XLSX/XLS 文件</Button>
                  </Upload>
                </Form.Item>

                <Form.Item wrapperCol={{span: 18, offset: 4}}>
                  <Space size={"middle"}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={submitting}
                      disabled={submitting}
                    >
                      提交
                    </Button>
                    <Button htmlType="reset" disabled={submitting}>重置</Button>
                  </Space>
                </Form.Item>
              </Form>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            style={{
              borderRadius: 8,
            }}
            bodyStyle={{
              backgroundImage: 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
            }}
          >
            <div
              style={{
                fontSize: '20px',
                color: token.colorTextHeading,
                marginTop: 12,
                marginBottom: 28,
              }}
            >
              分析结果
            </div>
            <Card
              style={{marginTop: 16}}
              type="inner"
              loading={submitting}
            >
              <p>分析结论</p>
              <p>{chart?.genAnalysis ?? '请先上传数据'}</p>
            </Card>
            <Card
              style={{marginTop: 16}}
              type="inner"
              loading={submitting}
            >
              <p>生成图表</p>
              <p>{option ? <ReactECharts option={option}/> : '请先上传数据'}</p>
            </Card>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AddChart;
