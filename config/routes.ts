export default [
  { path: '/user', layout: false, routes: [{ path: '/user/login', component: './User/Login' }, { path: '/user/register', component: './User/Register' }] },
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  { path: '/add_chart', name: '智能分析', icon: 'BarChart', component: './AddChart' },
  { path: '/add_chart_async_pool', name: '智能分析（异步）', icon: 'BarChart', component: './AddChartAsyncPool' },
  { path: '/add_chart_async_mq', name: '智能分析（异步）', icon: 'BarChart', component: './AddChartAsync' },
  { path: '/my_chart', name: '我的图表', icon: 'PieChart', component: './MyChart' },
  { path: '/user/info', name: '用户信息', icon: 'crown', component: './User/Info' },
  {
    path: '/admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      { path: '/admin', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', component: './Admin' },
    ],
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
