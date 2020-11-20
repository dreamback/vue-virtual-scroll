const Mock = require('mockjs')
const Random = Mock.Random
Mock.mock('/api/data', (req, res) => {
  let list = []
  for (let i = 0; i < 2000; i++) {
    let listObject = {
      id: i,
      index: i,
      title: Random.csentence(20, 50), // 随机生成一段中文文本。
      company: Random.csentence(5, 10),
      attention_degree: Random.integer(100, 9999), // 返回一个随机的整数。
      photo: Random.image('114x83', '#00405d', '#FFF', 'Mock.js')
    }
    list.push(listObject)
  }
  return {
    data: list
  }
})
