import { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

// const cardColors = [
//   '#ebd4d0', '#efe4fd', '#efe4fd', // rose, lavender
//   '#cbe4e9', '#fef6de', '#e2f7d9', // sky, cream, mint
//   '#cbe4e9', '#ebd4d0'
// ];
export default [
  {
    url: '/api/message/list', // 修改为与API调用匹配的路径
    method: 'get',
    response: () => {
      return Mock.mock({
        code: 0,
        message: 'success',
        data: {
          'list|10-20': [ // 生成5-10条数据
            {
              id: '@increment',
              tag: '@pick(["留言", "日记", "随想", "感悟", "生活"])', // 随机标签
              content: '@cparagraph(1,3)',
              time: '@datetime("yyyy-MM-dd HH:mm:ss")', // 格式化时间
              likedCount: '@integer(0, 50)', // 随机点赞数
              commentCount: '@integer(0, 20)', // 随机评论数
              username: '@cname', // 随机中文姓名
              backgroundColor: '@pick(["#ebd4d0", "#efe4fd", "#cbe4e9", "#fef6de", "#e2f7d9"])' // 随机十六进制颜色
            },
          ],
        },
      })
    },
  },
] as MockMethod[]
