const supertest = require('supertest');
const {app} = require('../../app');
const assert = require('assert');
const should = require('should');
const request = supertest(app.listen());

let id = void 0;

describe('常用搜索配置', () => {
  it('1. 查询列表成功', done => {
    request
      .get('/api/issue-search/list')
      .set('Cookie', ['userid=3160'])
      .send()
      .expect(200)
      .end((err, res) => {
        const { code } = res.body;
        code.should.equal(20000);
        done();
      });
  })

  it('2. 创建成功', done => {
    request
      .post('/api/issue-search/create')
      .set('Cookie', ['userid=3160'])
      .send({
        title: 'test',
        content: '{}',
        sourceType: 0
      })
      .end((err, res) => {
        const { code, data } = res.body;
        console.log('data: ', data);
        id = data[0].id
        code.should.equal(20000);
        done();
      });
  })

  it('3. 修改成功', done => {
    request
      .post('/api/issue-search/edit')
      .set('Cookie', ['userid=3160'])
      .send({
        id,
        title: 'test01',
      })
      .end((err, res) => {
        const { code } = res.body;
        code.should.equal(20000);
        done();
      });
  })

  it('4. 删除成功', done => {
    request
    .post('/api/issue-search/delete')
    .set('Cookie', ['userid=3160'])
    .send({
      id,
    })
    .end((err, res) => {
      const { code } = res.body;
      code.should.equal(20000);
      done();
    });
  })
})