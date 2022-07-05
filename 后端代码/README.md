# 这是大数据大作业项目的后端部分

## 1 用到的主要框架或库

- koa2

- koa-body

- koa-generic-session

- knex

- dotenv

其他的看package.json

不用ORM的原因是需要生成的SQL语句完全符合预期，以便使用索引等。

## 2 用到的软件和配置位置

- mysql(.env文件中配置)

- redis(配置好像写死在代码里了，需要找一找)

## 3 快捷开发

装依赖 ：npm i
编译ts： npm run ts

自动加载代码变更(用了nodemon)：
安装nodemon ：npm i nodemon -g
启动： npm run nodemon
