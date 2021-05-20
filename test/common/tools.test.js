/*
 * @Author: highsea.高海
 * @Date: 2019-01-14 17:31:45
 * @Copyright(c) QuVideo F2E Team
 * @Email: hai.gao@quvideo.com
 */

'use strict';

const { join } = require('path');
const { isUrl, isEmpty, ckObjValue, myType, unique, objPropSort, autoCrypto, XError, execPromise, pageSizeSQL} = require('../../app/common/utils.js');
const assert = require('assert').strict;
const should = require('should');
const proPackage = require('../../package.json')

describe('utils.js ', () => {
  
  before(() => {});

  it('utils #isUrl()', () => {
    const arr = [
      'https://f.g',
      'f.g.aaa.com',
      'ftp://s.cn:20/fff',
      'http://s.cn:8080/?c=1&d=2#333',
      'http://f.g.aaa.com?c=1&d=2#333',
      'http://user:pwd@f.g.aaa.com?c=1&d=2#333',
    ];
    let num = 0
    arr.map((cval, index, arr)=> {
      if (isUrl(cval)) num++;
    });
    assert.deepEqual(num, 4);
  });


  it('utils #isEmpty', () => {
    const arr = [{}, [], null, undefined, ''];
    const res = arr.some((cval, index, a) => {
      return !isEmpty(cval)
    });
    res.should.equal(false)
    isEmpty(true).should.equal(false)
    isEmpty(false).should.equal(false)
    isEmpty(Infinity).should.equal(false)
  })

  it('utils #myType', () => {
    const arr = [null, NaN, Infinity, 0, 1, '2', '', function () { }, {}, [], undefined, new Date()];// Document window
    const temp = []

    for (let i = 0, l = arr.length; i < l; i++) {
      temp.push(myType(arr[i]))
    }

    // arr.forEach(element => {
    //   temp.push(myType(arr[element]))
    // });

    assert.deepStrictEqual(temp, ['null', 'nan', 'infinity', 'number', 'number', 'string', 'string', 'function', 'object', 'array', 'undefined', 'date'])
  })

  it('utils #ckObjValue', () => {
    const obj = { a: undefined, b: null, c: '', d: 0, e: '2', f: 3, g: {aa: 1, bb: NaN, cc: null}};
    const res = ckObjValue(obj)
    const res2 = ckObjValue({}) 
    assert.deepStrictEqual(res, { d: 0, e: '2', f: 3, g: { aa: 1 } })
    assert.deepStrictEqual(res2, {})
  })


  it('utils #objPropSort', () => {
    const arr = [{ a: '3' }, { a: '2' }, { a: '1' }, { a: '4' }, ];
    let _temp = JSON.stringify(arr)
    const res = JSON.parse(_temp).sort(objPropSort('a', false))
    const res2 = JSON.parse(_temp).sort(objPropSort('a'))
    assert.deepStrictEqual(res, [{ a: '4' }, { a: '3' }, { a: '2' }, { a: '1' }])
    assert.deepStrictEqual(res2, [{ a: '1' }, { a: '2' }, { a: '3' }, { a: '4' }])
  })

  it('utils #unique', () => {
    const array = ['a1', 'b2', 1, 'c4', 'b1', 'c3', 'a1', 1, 'a1', 'b2',];
    const res = unique(array)
    assert.deepStrictEqual(res, ['a1', 'b2', 1, 'c4', 'b1', 'c3'])
  })
  
  it('utils #autoCrypto', () => {
    const res = autoCrypto('123', 'sha1')
    const res2 = autoCrypto();
    res2.should.be.String();
    assert.deepStrictEqual(res, '40bd001563085fc35165329ea1ff5c5ecbdbbeef')

  })

  it('utils #XError', () => {
    const res = new XError(20003, '数据不存在')
    assert.deepStrictEqual(res.message, '数据不存在')
    assert.deepStrictEqual(res.bcode, 20003)
  })

  // it('utils #execPromise', async() => {
  //   let res = await execPromise("cat package.json | grep version | awk '{print $2}'");
  //   await execPromise("aaa").catch(e => {
  //     assert.deepStrictEqual(e.bcode, 40041)
  //   });
  //   await execPromise("cat aaa.js").catch(e => {
  //     assert.deepStrictEqual(e.bcode, 40041)
  //   });
  //   assert.deepStrictEqual(res.match(/\d+/g).join('.'), proPackage.version)
  // })

  it('utils #pageSizeSQL# 1', () => {
    let res = pageSizeSQL({
      where: {
        wherefield: 'age',
        condition: '>',
        value: 25,
      },
      order: ['favorite', 'followers'],
      limit: {
        offset: 1000,
        psize: 20,
      },
      sort: 'asc'
    });
    assert.deepStrictEqual(res, "WHERE `age` > 25 ORDER BY `favorite`,`followers` asc limit 1000,20")
  })

  it('utils #pageSizeSQL# 2', () => {
    let res = pageSizeSQL({
      where: [{
        wherefield: 'age',
        condition: '>',
        value: 25,
      }, {
        wherefield: 'name',
        condition: '=',
        value: 'highsea',
      }],
      order: 'favorite',
      sort: 'desc'
    });
    assert.deepStrictEqual(res, "WHERE `age` > 25 and `name` = 'highsea' ORDER BY `favorite` desc limit 0,10")
  })

  it('utils #pageSizeSQL# 3', () => {
    let res = pageSizeSQL({
      where: 'age > 25 ',
      sort: 'desc'
    });
    let res2 = pageSizeSQL({
      where: {
        wherefield: 'name',
        condition: '=',
        value: 'highsea',
      },
      order: {},
    });

    assert.deepStrictEqual(res.bcode, 25033);
    assert.deepStrictEqual(res2.bcode, 25034);
  })

});
