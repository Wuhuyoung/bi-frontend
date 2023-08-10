import {genChartByAiAsyncUsingPOST} from '@/services/bi/chartController';
import { UploadOutlined } from '@ant-design/icons';

import { Button, Card, Form, Input, message, Select, Space, theme, Upload } from 'antd';
import React, { useState } from 'react';
import {useForm} from "antd/es/form/Form";

/**
 * 添加图表页面（异步）线程池异步处理
 * @constructor
 */
const AddChartAsyncPool: React.FC = () => {
  const { useToken } = theme;
  const { token } = useToken();

  const [form] = useForm();
  const [submitting, setSubmitting] = useState<boolean>(false);

  /**
   * 提交，调用后端接口，异步生成图表分析信息
   * @param values
   */
  const onFinish = async (values: any) => {
    // 避免重复提交
    if (submitting) {
      return;
    }
    setSubmitting(true);
    // 对接后端，上传数据
    const params = {
      ...values,
      file: undefined,
    };
    try {
      // const res = await genChartByAiAsyncUsingPOST(params, {}, values.file.file.originFileObj);
      const res = await genChartByAiAsyncUsingPOST(params, {}, values.file.file.originFileObj);
      if (!res?.data) {
        message.error(res.message ?? '分析失败');
        setSubmitting(false);
      } else {
        message.success('分析任务提交成功，稍后请在我的图表页面查看');
        setSubmitting(false);
        form.resetFields();
      }
    } catch (e: any) {
      message.error('提交任务失败，请稍后重试');
      setSubmitting(false);
    }
  };

  return (
    <div>
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
          <Form
            form={form}
            name="addChart"
            labelAlign="left"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 18 }}
            onFinish={onFinish}
            initialValues={{}}
          >
            <Form.Item
              name="goal"
              label="分析目标"
              rules={[{ required: true, message: '请输入分析目标' }]}
            >
              <Input.TextArea
                showCount
                maxLength={200}
                placeholder="请输入分析目标，比如：分析网站用户的增长情况"
              />
            </Form.Item>

            <Form.Item name="name" label="图表名称">
              <Input placeholder="请输入图表名称" />
            </Form.Item>

            <Form.Item name="chartType" label="图表类型">
              <Select
                placeholder="请选择要生成的图表类型"
                options={[
                  { value: '折线图', label: '折线图' },
                  { value: '平滑折线图', label: '平滑折线图' },
                  { value: '柱状图', label: '柱状图' },
                  { value: '饼图', label: '饼图' },
                  { value: '散点图', label: '散点图' },
                  { value: '堆叠图', label: '堆叠图' },
                  { value: '雷达图', label: '雷达图' },
                ]}
              ></Select>
            </Form.Item>

            <Form.Item
              name="file"
              label="原始数据"
              rules={[{ required: true, message: '请选择要分析的excel文件' }]}
            >
              <Upload name="file" action="/upload.do" listType="picture" maxCount={1}>
                <Button icon={<UploadOutlined />}>上传 CSV/XLSX/XLS 文件</Button>
              </Upload>
            </Form.Item>

            <Form.Item wrapperCol={{ span: 18, offset: 4 }}>
              <Space size={'middle'}>
                <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                  提交
                </Button>
                <Button htmlType="reset" disabled={submitting}>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default AddChartAsyncPool;
