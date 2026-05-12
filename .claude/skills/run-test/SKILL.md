---
name: run-test
description: '执行测试的手册'
user-invocable: true
---

启动 Subagent 做测试

测试方法约定：
1. L0/L1 每次代码修改完都需要做测试:
  - lint: `npm run lint`
  - type-check: `npm run type-check`
  - build: `npm run build`
2. L2/L3 在修改了大量代码时执行
  - Backend tests: `npm run test:backend`
3. L4/L5 在提交PR之前执行：
  - 调用 Skill provision-test-env 构建测试环境
  - E2E tests: `bash ./run-e2e.sh` (脚本中定义了测试日志会记录到 `logs/e2e-test.log` 文件中)
  - 执行结束后，调用 Skill teardown-test-env 销毁测试环境
4. 在测试过程中，如果发现了问题，调用 Skill bug-fix
5. 简单总结测试结果