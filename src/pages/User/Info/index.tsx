import {Avatar, Button, Col, Form, Input, message, Row, Tooltip, Typography} from 'antd';

const { Paragraph } = Typography;

import { useModel } from '@@/exports';
import { Card, theme } from 'antd';
import React, { useEffect } from 'react';
import {updateMyUserUsingPOST} from "@/services/bi/userController";

/**
 * 我的图表页面
 * @constructor
 */
const Info: React.FC = () => {
  const { useToken } = theme;
  const { token } = useToken();

  // 获取登录用户
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState ?? {};



  // 组件初始化和searchParams修改时(分页)查询图表
  useEffect(() => {});

  const onFinish = async (values: API.UserUpdateMyRequest) => {
    const res = await updateMyUserUsingPOST(values);
    console.log(res)
    if (res?.code === 0) {
      message.success('修改成功');
    } else {
      message.error('修改失败');
    }
  };

  const handleGainCount = () => {
    message.info('该功能暂未实现，敬请期待')
  }

  type LoginUser = {
    userName?: string;
    userAvatar?: string;
  };

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
        个人信息
      </div>
      <Row>
        <Col span={10}>
          <Card
            style={{
              borderRadius: 8,
            }}
            title={'个人设置'}
          >
            <Form
              name="basic"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              style={{ maxWidth: 600 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              autoComplete="off"
            >
              <Form.Item<LoginUser> label="用户名" name="userName" rules={[{ required: true, message: '用户名不能为空' }]}>
                <Input defaultValue={currentUser?.userName ?? ''}/>
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  修改
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={14}>
          <Card
            style={{
              borderRadius: 8,
              marginLeft: 10,
            }}
            title={'我的特权'}
          >
            <p>角色：{currentUser?.userRole === 'admin' ? '管理员' : '普通用户'}</p>
            <p>剩余 AI 调用次数：{currentUser?.leftCount}</p>
            <Tooltip placement="top" title={'普通用户每日可领取10次，上限30次\n会员每日可领取100次，上限500次'}>
            <Button onClick={handleGainCount}>每日签到</Button>
            </Tooltip>
            <Button type={"primary"} style={{marginLeft: 10}} onClick={() => message.info('该功能暂未实现，敬请期待')}>充值</Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Info;
