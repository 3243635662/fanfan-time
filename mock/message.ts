import { MockMethod } from 'vite-plugin-mock'
import Mock from 'mockjs'

// 标签选项
const tagOptions = [
  { label: '留言', id: 1 },
  { label: '日记', id: 2 },
  { label: '随想', id: 3 },
  { label: '感悟', id: 4 },
  { label: '生活', id: 5 }
]
export default [
  {
    url: '/api/message/list', // 修改为与API调用匹配的路径
    method: 'get',
    response: () => {
      return Mock.mock({
        code: 0,
        message: 'success',
        data: {
          'list|10-20': [ // 生成10-20条数据
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

  {
    url: '/api/message/detail',
    method: 'post',
    response: ({ body }) => {
      const { id } = body; // 修复语法错误：移除多余的逗号
      return Mock.mock({
        code: 0,
        message: 'success',
        data: {
          id: id,
          avatar: '@image("100x100", "@color", "#FFF", "@first")',
          backgroundColor: '@pick(["#ebd4d0", "#efe4fd", "#cbe4e9", "#fef6de", "#e2f7d9"])', // 随机十六进制颜色
          content: '@cparagraph(1, 5)',
          time: '@datetime("yyyy-MM-dd HH:mm:ss")',
          likedCount: '@integer(0, 100)',
          commentCount: '@integer(0, 50)',
          username: '@cname',
          tag: '@pick(["留言", "日记", "随想", "感悟", "生活"])',
          // 添加评论数据
          'comments|5-10': [
            {
              username: '@cname',
              time: '@datetime("yyyy-MM-dd HH:mm:ss")',
              text: '@csentence(10, 50)', // 随机生成10-50个字符的中文句子
              avatar: '@image("40x40", "@color", "#FFF", "@first")' // 生成40x40的头像图片
            }
          ]
        }
      })
    },
  },


  {
    url: '/api/message/create',
    method: 'post',
    response: ({ body }) => {
      const { content, tag, backgroundColor } = body;

      // 根据tag ID查找对应的标签名称
      const tagInfo = tagOptions.find(t => t.id === tag);
      const tagLabel = tagInfo ? tagInfo.label : '留言';

      // 生成随机用户信息
      const mockUser = Mock.mock({
        username: '@cname',
        avatar: '@image("100x100", "@color", "#FFF", "@first")'
      });

      // 模拟创建的新留言
      const newMessage = Mock.mock({
        id: '@increment',
        content: content,
        tag: tagLabel,
        backgroundColor: backgroundColor,
        time: '@datetime("yyyy-MM-dd HH:mm:ss")',
        username: mockUser.username,
        avatar: mockUser.avatar,
        likedCount: 0,
        commentCount: 0
      });

      return {
        code: 0,
        message: 'success',
        data: newMessage
      };
    },
  }
] as MockMethod[]
