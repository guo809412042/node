/*
 * @Author: highsea.高海
 * @Date: 2019-02-12 18:01:06
 * @Copyright(c) QuVideo F2E Team
 * @Email: hai.gao@quvideo.com
 */
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();
const Log = console;

const str = '/api';
const arr = [ '/home/:id', '/index/aaa', '/api', ];

suite
  .add('RegExp#arr', () => {
    return new RegExp(str, 'ig').test(arr.toString());
  })
  .add('include#arr', () => {
    return arr.includes(str);
  })
  .add('indexof#arr', () => {
    return arr.indexOf(str);
  })
  .add('for#arr', () => {
    for (let i = 0, len = arr.length; i < len; i++) {
      if (arr[i] === str) break;
    }
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

// 上传并发数 1+ chunk => 1.87G -> 1.7 min -> 100s
// 上传并发数 6+ chunk => 1.87G -> 55.42s (浏览器限制)
