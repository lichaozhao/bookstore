for AI Coding - 最好 L0 到 L4 的100%覆盖，至少也要 L0 到 L3的全覆盖，适度的 L4 覆盖

# 测试定义：

## L0 静态质量检查
格式化检查：Prettier、gofmt、black
Lint：ESLint、ruff、checkstyle
类型检查：TypeScript、mypy、tsc
依赖检查：重复依赖、废弃依赖、漏洞依赖
构建检查：代码至少能编译、打包
基础安全扫描：secret scan、依赖 CVE scan

## L1 单元测试
纯函数测试
service 方法测试
reducer/store 测试
React/Vue 组件的局部渲染测试
边界条件测试
异常路径测试

## L2 集成测试
API route + service + repository 的组合测试
前端组件 + store + api mock 的测试
数据访问层和测试数据库的集成
后端中间件、鉴权、路由组合测试
业务流程的局部集成，例如“登录后生成 token”

## L3 系统/API测试
REST API 测试 / GraphQL API 测试 / CLI 行为测试
认证、权限、错误码测试
API contract 测试
兼容性测试
数据迁移测试

## L4 端到端测试
浏览器 E2E 测试工具：Cypress、Playwright、Selenium
业务流程：用户注册、登录、下单、支付、收藏等完整流程，涉及 多页面导航、表单校验、权限跳转等真实 UI 交互

## L5 生产级测试
Smoke test：部署后冒烟测试
Canary test：灰度发布验证
回滚验证
性能测试
压力测试
稳定性测试
可观测性验证：日志、指标、链路追踪、告警
安全测试：渗透测试、权限绕过、XSS、SQL 注入
容灾测试：服务宕机、网络抖动、数据库故障
生产合成监控：定时模拟用户访问关键路径