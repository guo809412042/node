wrk.method = "POST"
wrk.headers["Content-Type"] = "application/json; charset=utf-8"
wrk.body = '{"videoUrl":"http://test.com/a/ttt.mp4", "posterImg":"http://quvideo.io/test.png"}'

-- 日志 不输出 控制台形式 测试

-- wrk -t10 -c1000 -d20s -T5s --script=wrk.post.lua --latency http://localhost:5000/api/video
-- Running 20s test @ http://localhost:5000/api/video
--   10 threads and 1000 connections
--   Thread Stats   Avg      Stdev     Max   +/- Stdev
--     Latency   356.74ms   51.04ms 639.65ms   76.69%
--     Req/Sec   274.17    226.82     0.99k    67.87%
--   Latency Distribution
--      50%  344.33ms
--      75%  381.17ms
--      90%  421.83ms
--      99%  602.47ms
--   51283 requests in 20.09s, 19.66MB read
--   Socket errors: connect 0, read 663, write 1, timeout 0
-- Requests/sec:   2552.42
-- Transfer/sec:      0.98MB


-- wrk -t10 -c1000 -d20s "http://localhost:5000/api/video/1245d6bd-56d9-4553-b37c-ac9b060f36e4" 
-- Running 20s test @ http://localhost:5000/api/video/1245d6bd-56d9-4553-b37c-ac9b060f36e4
--   10 threads and 1000 connections
--   Thread Stats   Avg      Stdev     Max   +/- Stdev
--     Latency   277.95ms   38.91ms 482.19ms   84.80%
--     Req/Sec   354.91    239.35     0.99k    63.35%
--   68688 requests in 20.10s, 33.60MB read
--   Socket errors: connect 0, read 607, write 6, timeout 0
-- Requests/sec:   3416.90
-- Transfer/sec:      1.67MB