# 基于阿里云小影镜像
# 若要基于 docker 官网的源制作请查看 ./doc/base-docker-img/Dockerfile_official
FROM registry.cn-hangzhou.aliyuncs.com/vivavideo/nodepm2:0.0.3

# 修改1---改成实际项目owner
LABEL MAINTAINER="hai.gao@quvideo.com"

# 设置项目名称 没有特殊需求不用修改项目名称 因为 一个 Pod 运行一个 容器
ARG PRONAME=vcm-video-info
# 入口 js 根据自身项目修改
# ARG STARTJS=index.js

# 设置相关目录 RUN、CMD与ENTRYPOINT命令的工作目录
ARG PRODIR=/f2e/download/$PRONAME
# ARG LOGDIR=/f2e/logdata/$PRONAME/logs

# 设置环境变量与端口 没有特殊需求不用修改暴露的端口 因为 一个 Pod 运行一个 容器
ARG PORT=80

# 默认缺省值 可以不用修改，docker run 的时候 -e 传入
ENV NODE_ENV=test
ENV APOLLO_URL=http://apollo-dev.xiaoying.co:8080
ENV APOLLO_CLUSTER=local
ENV APOLLO_APP_ID=vcm-common

# 指定RUN、CMD与ENTRYPOINT命令的工作目录
WORKDIR $PRODIR

# 复制所有文件到工作目录
COPY . $PRODIR

# RUN cd $PRODIR \ 
#   && cnpm i --production

# 如果设置为true，则禁止UID/GID互相切换，当运行package scripts时
# RUN npm config set unsafe-perm true

# 暴露端口 也可以暴露多个 EXPOSE 8080/tcp 8081/tcp
EXPOSE $PORT

# 修改2---根据项目修改存储目录
# VOLUME ["/f2e/yours-data"]

# 运行命令
ENTRYPOINT [ "pm2-runtime", "docker.pm2.yml"]  

#pm2 start $STARTJS --name $PRONAME 
#--log $LOGDIR/$PRONAME.log --pid $LOGDIR/$PRONAME.pid --max-memory-restart 20M -i 2
