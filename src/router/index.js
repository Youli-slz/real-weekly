import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: require('../views/Login')
    },{
      path: '/main',
      component: require('../components/Main'),
      children:[
        {
          path: '/carousels',
          component: require('../views/BookLib/carousels')
        },
        {
          path: '/addcarousels',
          component: require('../views/BookLib/Addcarousels')
        },
        {
          path: '/updatecarousels/:id',
          component: require('../views/BookLib/Updatecarousels'),
          name: '更新轮播图'
        },
        {
          path: '/weekly',
          component: require('../views/BookLib/Weekly')
        },
        {
          path: '/updateweekly/:id',
          component: require('../views/BookLib/UpdateWeekly'),
          name: '更新周刊'
        },
        {
          path: '/booklist/:id',
          component: require('../views/BookLib/booklist'),
          name: '书籍列表'
        },
        {
          path: '/chapterlist/:id/:weekid',
          component: require('../views/BookLib/Chapterlist'),
          name: '章节列表'
        },
        {
          path: '/addchapter/:bookid',
          component: require('../views/BookLib/AddChapter'),
          name: '添加章节'
        },
        {
          path: '/updatecha/:articleid/:bookid',
          component: require('../views/BookLib/UpdateChapter'),
          name: '更新章节'
        },
        {
          path: 'updatebook/:bookid/:weekid',
          component: require('../views/BookLib/UpdateBooklist'),
          name: '更新书籍'
        }
      ]
    }
  ]
})
