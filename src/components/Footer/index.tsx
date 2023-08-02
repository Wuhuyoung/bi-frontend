import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import React from 'react';

const Footer: React.FC = () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: 'Wuhuyoung 的 AI 技术体验平台',
  });

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'AIGC',
          title: 'AIGC 智能数据分析平台',
          href: 'https://github.com/Wuhuyoung',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/Wuhuyoung',
          blankTarget: true,
        },
        {
          key: 'Wuhuyoung',
          title: 'Wuhuyoung',
          href: 'https://github.com/Wuhuyoung',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
