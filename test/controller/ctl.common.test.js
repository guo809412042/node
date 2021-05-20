const supertest = require('supertest');
const {app} = require('../../app');
const assert = require('assert');
const should = require('should');
const request = supertest(app.listen());

describe('公共', () => {

  it('1. 翻译成功', (done) => {
    request
      .post('/api/common/translate')
      .set('x-gateway-product', 2)
      .send({
        target: 'zh',
        text: 'one'
      })
      .expect(200)
      .end((err, res) => {
        const { code } = res.body;
        code.should.equal(20000);
        done();
      });
  });
});
