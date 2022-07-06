import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '网络拓扑', icon: 'dashboard' }
    }]
  },

  {
    path: '/congest',
    component: Layout,
    redirect: '/congest/medium',
    name: 'Congest',
    meta: { title: '拥塞信息', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'medium',
        name: 'Medium',
        component: () => import('@/views/congest/medium/index'),
        meta: { title: '中拥塞', icon: 'table' },
        children: [
          {
            path: 'list',
            name: 'List',
            component: () => import('@/views/congest/medium/list'),
            meta: { title: '数据统计', icon: 'link' }
          },
          {
            path: 'analyse',
            name: 'MAnalyse',
            component: () => import('@/views/congest/medium/analyse'),
            meta: { title: '数据分析', icon: 'link' }
          },
          {
            path: 'page',
            name: 'Page',
            hidden: true,
            component: () => import('@/views/congest/medium/page')
          }
        ]
      },
      {
        path: 'high',
        name: 'High',
        alwaysShow: true,
        component: () => import('@/views/congest/high/index'),
        meta: { title: '高拥塞', icon: 'tree' },
        children: [
          {
            path: 'list',
            name: 'List',
            component: () => import('@/views/congest/high/list'),
            meta: { title: '数据统计', icon: 'link' }
          },
          {
            path: 'analyse',
            name: 'HAnalyse',
            component: () => import('@/views/congest/high/analyse'),
            meta: { title: '数据分析', icon: 'link' }
          }
        ]
      }
    ]
  },

  {
    path: '/system',
    component: Layout,
    redirect: '/system/granular',
    name: 'System',
    alwaysShow: true,
    meta: { title: '系统资源开销', icon: 'form' },
    children: [
      {
        path: 'granular',
        name: 'Granular',
        hidden: true,
        component: () => import('@/views/system/granular'),
        meta: { title: '细粒度', icon: 'user' }
      },
      {
        path: 'light',
        name: 'Light',
        component: () => import('@/views/system/light'),
        meta: { title: '轻量级', icon: 'user' }
      }
    ]
  },

  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       name: 'Menu2',
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
