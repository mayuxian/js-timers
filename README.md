## 本地开发和调试

1. 本地打包

- 命令：npm pack
- 通过.npmignore 来配置包内包含的问题

2. 本地联调

- 本地发布 npm 命令：npm link
- 本地项目安装 npm 包 命令： npm link 包名
- 移除本地发布 命令：npm unlink

3. 发布 (每次发布版本，要升级 package.json 中的 version)

- 命令： npm login //账号密码登录
- 命令： npm publish
- 命令： npm unpublish 包名 --force //删除已发布包,谨慎使用。防止别人已使用，删除导致引用者无法使用

version 版本的含义：v1.1.1
大版本：不兼容，重构等级别的构建
小版本：新增功能等
修订版本：修复 bug 等
