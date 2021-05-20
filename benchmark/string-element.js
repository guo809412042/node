/*
 * @Author: highsea.高海
 * @Date: 2019-02-13 14:18:48
 * @Copyright(c) QuVideo F2E Team
 * @Email: hai.gao@quvideo.com
 */
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();
const Log = console;

const str = '/api/';
// 必须是 /api/ 开头
// '/document/home/api/:id'; false
// '/api/home'; true
const string = '/api/user/:id';

suite
  .add('string#substr', () => {
    return str === string.substr(0, 5);
  })
  .add('string#split', () => {
    return (str + '/') === string.split('/')[1];
  })
  .add('string#indexof', () => {
    return string.indexOf(str) === 0;
  })
  .add('string#RegExp', () => {
    let res = new RegExp(str, 'img').exec(string);
    return res.lastIndex === 0;
  })
  // add listeners
  .on('cycle', (event) => {
    Log.log(String(event.target));
  })
  .on('complete', function () {
    Log.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  // run async
  .run({ 'async': true, });
