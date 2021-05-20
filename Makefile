# 修改1---根据实际项目 修改 REPO
# 该Makefile比较老旧，不再更新，可以参考 OAuth项目 http://gitlab.quvideo.com/WEB/oauth2-server-node/blob/master/Makefile
REPO = http://gitlab.quvideo.com/WEB/vcm-video-info.git

S_OSTYPE := $$OSTYPE | grep -c 'darwin'
S_COPY = cp -r

TEST_FILE = *.test.js

# ------ 默认缺省值 可以不用修改，docker run 的时候 -e 传入
NODE_ENV = production
APL_URL=http://apollo-dev.xiaoying.co:8080
APL_CLUSTER=local
APL_APPID=vcm-common
# ------ 默认缺省值 可以不用修改，docker run 的时候 -e 传入
GIT_BRANCH = $(shell git symbolic-ref --short -q HEAD)
PROJ_TESTS = $(shell find test -type f -name "$(TEST_FILE)")

# 以 docker 形式发布 k8s部署，一个 Pod 对应一个镜像，无需修改 port
PROJ_PORT = 80
PROJ_NGINX_PORT = 5072
PROJ_NANE = $(shell cat package.json | xargs -0 node -p 'JSON.parse(process.argv[1]).dockerName')
PROJ_VER = $(shell cat package.json | xargs -0 node -p 'JSON.parse(process.argv[1]).version')
PROJ_PATH = $(shell pwd)
PROJ_BIN = ./node_modules/.bin/
PROJ_DATE = $(shell date +%Y%m%d-%H%M)

# 修改2---根据实际项目 修改 index.js src
LINT_DIR = app
BUILD_COPY = docker.pm2.yml Dockerfile package.json app doc public
BUILD_OUT = output/

CONF_REGISTRY_URL = http://registry.xnpm.quvideo.com
CONF_REGISTRY = --registry=$(CONF_REGISTRY_URL)

DOCKER_REPO = registry.cn-hangzhou.aliyuncs.com/vivavideo

ifeq ($(S_OSTYPE), 0)
S_COPY += L
endif

# 初始化项目
init: clean
	@echo 'NPM install (dev) ...'
	@npm i $(CONF_REGISTRY)
	@echo 'NPM (dev) Done .'

# 检查js代码规范
eslint:
	@$(PROJ_BIN)eslint $(LINT_DIR)/**/*.js
	@echo 'ESLint Done , Congratulations, you have no mistakes .'

# 格式化代码
pretty:
	@$(PROJ_BIN)prettier --single-quote --trailing-comma es5 --write $(LINT_DIR)/**/*.js
	@$(PROJ_BIN)eslint --fix $(LINT_DIR)/**/*.js

# 启动 ENV
start:
	@NODE_ENV=$(NODE_ENV) $(PROJ_BIN)nodemon -w app -e .js -V

# 发布版本 开发时使用
release build: eslint pretty test-uni glab-build

# publish docker 镜像 (build，push镜像与清除无用镜像)
# 等待公司 docker 镜像仓库私有化
publish:
	@echo 请忽略以下错误，docker 发布开始，结束轻按 ctrl + c:
	@sleep 1
	@echo **请务必确认系统已经安装docker** ，开始登录阿里云私有仓库:
	-docker login --username=junpeng.cheng@1914346484386584 -p a123456123 $(DOCKER_REPO)/
	@cd $(BUILD_OUT) && \
	docker build -t $(DOCKER_REPO)/$(PROJ_NANE):$(PROJ_VER)-$(GIT_BRANCH)-$(PROJ_DATE) . && \
	docker push $(DOCKER_REPO)/$(PROJ_NANE):$(PROJ_VER)-$(GIT_BRANCH)-$(PROJ_DATE)

# -docker images | grep none | awk '{print $3 }' | xargs docker rmi

# 部署
deploy:
	@echo 检查是否有同名容器存在，并结束
	-docker ps -a | grep "$(PROJ_NANE)" | awk '{print $$1 }' | xargs docker stop
	@sleep 0.2
	@echo 检查是否有同名容器存在，并移除
	-docker ps -a | grep "$(PROJ_NANE)" | awk '{print $$1 }' | xargs docker rm
	@sleep 0.2
	docker run -d -e NODE_ENV=$(NODE_ENV) -e APL_CLUSTER=$(APL_CLUSTER) -e APL_APPID=$(APL_APPID) -e APL_URL=$(APL_URL) --name $(PROJ_NANE) -p $(PROJ_NGINX_PORT):$(PROJ_PORT) $(DOCKER_REPO)/$(PROJ_NANE):$(PROJ_VER)
	@echo 启动 $(PROJ_NANE) 镜像成功，请将容器端口: $(PROJ_NGINX_PORT) 代理到 nginx .

# 生产环境
production:
	@npm i --production $(CONF_REGISTRY)

# 生成 changelog -w -r 0
changelog:
	@$(PROJ_BIN)conventional-changelog -p angular -i CHANGELOG.md -s

# 测试  make test-uni TEST_FILE=my-test-fun.js
test-uni:
	NODE_ENV=$(NODE_ENV) $(PROJ_BIN)mocha -R spec -t 60000 --exit -r ./test/index.js $(PROJ_TESTS);

# 代码覆盖情况
test-cov:
	NODE_ENV=$(NODE_ENV) $(PROJ_BIN)nyc --reporter=lcov --reporter=text-summary $(PROJ_BIN)mocha -R list -t 60000 --exit -r ./test/index.js $(PROJ_TESTS);

# 清除项目多余文件
clean:
	@echo '开始清理多余文件，结束请按 ctrl + c ...'
	@sleep 1
	@rm -rf $(BUILD_OUT) node_modules logs coverage
	@echo 'Done .'

clean-r:
	@echo '开始清理多余文件，结束请按 ctrl + c ...'
	@sleep 0.5
	-rm -rf $(BUILD_OUT)

# 用于 gitlab-cli build 不要在开发阶段使用
glab-build: clean-r
	@echo "开始打包项目，停止请按 ctrl + c ..."
	@sleep 0.5
	@mkdir -p $(BUILD_OUT)
	@$(S_COPY) $(BUILD_COPY) $(BUILD_OUT)
	@ cd $(BUILD_OUT)/public && rm -rf assets
	@echo "正在安装生产环境的npm包 ..."
	@cd $(BUILD_OUT) &&npm i --production $(CONF_REGISTRY)
	@echo "完成，请检查打包输出的目录 : \"$(BUILD_OUT)\""

# 初始化 git
gitinit:
	@echo '确保你的项目是第一次初始化 git ...'
	-rm -rf .git/
	@git init
	-git remote rm origin
	@git remote add origin $(REPO)
	@echo 'Done .'

# 查看git提交日志
gitlog:
	@git log --pretty=format:"%h - %an, %ar : %s" --graph

.PHONY: clean start lint publish deploy publish
