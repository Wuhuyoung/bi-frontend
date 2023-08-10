import { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  "navTheme": "light",
  "layout": "side",
  "contentWidth": "Fluid",
  "fixedHeader": false,
  "fixSiderbar": true,
  "colorPrimary": "#1677FF",
  "splitMenus": false,
  // 拂晓蓝
  colorWeak: false,
  siderMenuType: "sub",
  title: 'DataMaster',
  pwa: true,
  logo: 'https://typora-1314662469.cos.ap-shanghai.myqcloud.com/img/202308061855569.svg',
  iconfontUrl: '',
  token: {
    // 参见ts声明，demo 见文档，通过token 修改样式
    //https://procomponents.ant.design/components/layout#%E9%80%9A%E8%BF%87-token-%E4%BF%AE%E6%94%B9%E6%A0%B7%E5%BC%8F
  },
};

export default Settings;

