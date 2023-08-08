export default [
  { path: '/user', layout: false, routes: [{ path: '/user/login', component: './User/Login' }, { path: '/user/register', component: './User/Register' }] },
  { path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome' },
  { path: '/add_chart', name: '智能分析', icon: 'BarChart', component: './AddChart' },
  { path: '/add_chart_async', name: '智能分析（异步）', icon: 'BarChart', component: './AddChartAsync' },
  { path: '/my_chart', name: '我的图表', icon: 'PieChart', component: './MyChart' },
  {
    path: '/admin',
    icon: 'crown',
    access: 'canAdmin',
    name: '管理页',
    routes: [
      { path: '/admin', name: '管理页面', redirect: '/admin/sub-page' },
      { path: '/admin/sub-page', name: '管理页面2', component: './Admin' },
    ],
  },
  { path: '/', redirect: '/welcome' },
  { path: '*', layout: false, component: './404' },
];
