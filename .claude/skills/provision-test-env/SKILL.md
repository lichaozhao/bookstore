---
name: provision-test-env
description: '为L4/L5级测试准备测试环境'
user-invocable: true
---

测试环境包括三个角色：前端容器、后端容器、运行测试脚本的容器

# 准备环境
1. 检查脚本是否符合当前项目的需求：
  - 根据最新的代码变更，检查 `docker-compose.yml` 文件是否需要更新，比如端口是否更改等
  - 检查 `dockerfile-frontend`、`dockerfile-backend`、`dockerfile-test` 是否需要增加依赖或者修改环境变量等配置

2. **拉起测试环境**：、
  - 执行 `docker compose -f docker-compose.yml up --build -d` 来启动测试环境

3. **验证环境是否搭建成功**：
  - 执行 `docker compose ps` 根据输出验证测试环境是否成功，如果不成功记录错误信息并停止，标记测试为失败

# 测试环境的构建日志
  - 构建过程的终端输出信息都附加记录到文件 `logs/provision-test-env.log`