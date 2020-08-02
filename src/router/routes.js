import { authGuard } from '../auth/authGuard';

const PlayDetails = () => import(/* webpackChunkName: "play-detail" */'pages/plays/PlayDetail.vue');
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'home', name: 'home', component: () => import('pages/Home.vue') },
      { path: 'add-play', name: 'add-play', component: () => import(/* webpackChunkName: "add-play" */'pages/plays/AddPlay.vue') },
      {
        path: 'play-list',
        name: 'play-list',
        component: () => import(/* webpackChunkName: "play-list" */'pages/plays/PlaysList.vue'),
        children: [
          {
            path: 'play/:playId',
            name: 'play-detail',
            props: true,
            component: PlayDetails
          }
        ]
      },
      {
        path: 'groups',
        name: 'groups',
        component: () => import(/* webpackChunkName: "groups" */'pages/groups/Groups.vue'),
        children: [
          {
            path: ':groupId',
            name: 'group-detail',
            props: true,
            component: () => import(/* webpackChunkName: "groups" */'pages/groups/GroupDetail.vue'),
            children: [
              {
                path: 'play/:playId',
                name: 'group-play-detail',
                props: true,
                component: PlayDetails
              }
            ]
          }
        ]
      }
    ],
    beforeEnter: authGuard
  }
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  });
}

export default routes;
