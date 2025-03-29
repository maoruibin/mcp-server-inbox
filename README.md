# MCP-Server-Inbox

MCP服务对接inBox笔记API，实现在任意 MCP 客户端以对话形式创建笔记的功能。

## 功能介绍

- 接入 inBox 笔记 API
- 提供 MCP 服务发现接口
- 支持通过 MCP 客户端创建笔记
- 支持设置笔记标题（可选）
- 支持 Inspector 调试工具

## 前置条件

- Node.js 18+
- inBox 笔记 API (PRO 功能)
- 支持 MCP 协议的客户端（如 Cursor AI）

## 安装与使用

### 方法一：本地构建

1. 克隆代码仓库

```bash
git clone https://github.com/maoruibin/mcp-server-inbox.git
cd mcp-server-inbox
```

2. 安装依赖

```bash
npm install
```

3. 构建项目

```bash
npm run build
```

4. 运行服务

```bash
# 运行服务
node build/index.js --inbox_user_token=https://inbox.gudong.site/api/inbox/your_token_here

# 使用环境变量
INBOX_USER_TOKEN=https://inbox.gudong.site/api/inbox/your_token_here node build/index.js
```

### 方法二：使用 npx 运行

```bash
# 运行服务
npx mcp-server-inbox --inbox_user_token=https://inbox.gudong.site/api/inbox/your_token_here

# 使用环境变量
INBOX_USER_TOKEN=https://inbox.gudong.site/api/inbox/your_token_here npx mcp-server-inbox
```

## 调试与开发

### 使用 Inspector

项目内置了 MCP Inspector 工具，可以帮助调试和监控服务运行状态：

```bash
npm run inspector
```

运行后可以在浏览器中访问 `http://localhost:5173` 查看服务运行状态和调试信息。

## 在 MCP 客户端中配置

### Cursor AI

1. 打开 Cursor 的 MCP 服务配置文件（通常位于 `~/.cursor/mcp.json`）
2. 添加 mcp-server-inbox 的配置：

```json
{
  "mcpServers": {
    "mcp-server-inbox": {
      "command": "node",
      "args": [
        "/path/to/mcp-server-inbox/build/index.js"
      ],
      "env": {
        "INBOX_USER_TOKEN": "https://inbox.gudong.site/api/inbox/your_token_here"
      }
    }
  }
}
```

### 其他 MCP 客户端

请参考对应 MCP 客户端的配置文档，添加类似的配置信息。

## 使用示例

在支持 MCP 的客户端中，您可以使用自然语言与 AI 对话，来创建笔记：

- "记录一下：今天学习了 MCP 开发"
- "帮我记笔记，标题是「TypeScript学习」：TypeScript 的高级类型包括 Partial、Required、Pick 等"
- "写到 inBox：明天需要完成项目文档编写"

## API 说明

### write_note

- 描述：将笔记内容写入到 inBox
- 参数：
  - title：笔记标题（可选）
  - content：笔记内容（Markdown 格式），最多 3000 字符
- 返回：
  - 成功：返回包含成功信息的对象
  - 失败：抛出相应的错误信息

### inBox API 说明

本项目依赖 inBox 的 API 服务，具体说明如下：

#### 接口信息
- **接口地址**：`https://app.gudong.site/api/inbox/${userToken}`
- **请求方式**：`POST`
- **Content-Type**：`application/json`
- **请求频率**：每天最多 50 条

#### 请求参数

| 参数      | 类型   | 是否必填 | 说明                |
|---------|------|------|-------------------|
| title   | 字符串  | 否    | 笔记标题             |
| content | 字符串  | 是    | 笔记内容，最多 3000 字符  |

#### 使用示例

1. 创建普通笔记：
```bash
npx mcp-server-inbox --inbox_user_token=https://inbox.gudong.site/api/inbox/your_token_here
```

2. 创建带标题的笔记：
```bash
# 在对话中指定标题
"帮我记笔记，标题是「TypeScript学习」：TypeScript 的高级类型包括 Partial、Required、Pick 等"
```

#### 响应格式
```json
{
  "code": 0,
  "msg": "已提交，请打开inBox查看笔记"
}
```
> 说明：code 为 0 表示请求成功，非零状态均为失败

#### 图片支持
inBox API 支持解析 Markdown 格式的图片标签。您可以在笔记内容中添加 markdown 格式的图片链接，例如：

```markdown
今天天气很好，![](https://example.com/image.jpg)
```

> 注意：API 不支持直接上传图片，需要先将图片上传到图床后使用图片链接

更多 API 详细信息请参考：[inBox API 文档](https://doc.gudong.site/inbox/api.html)

## 处理逻辑

当用户通过 MCP 客户端发送创建笔记的请求时，服务会根据以下逻辑处理：

1. 解析用户输入，识别标题（如有）和内容
2. 调用 inBox API，直接传递 `title` 和 `content` 两个参数
3. 返回处理结果和笔记内容摘要

用户可以在对话中明确指定标题，例如："帮我记笔记，标题是「TypeScript学习」：这是内容..."，服务会自动提取标题部分。

## 限制说明

- inBox API 请求频率限制为每天最多 50 条
- 笔记内容最多支持 3000 字符
- 需要 inBox PRO 用户才能使用 API 功能

## 获取 inBox API 配置

1. 打开 inBox 应用
2. 进入【设置】->【账户】->【Api】
3. 获取您的专属 API 配置信息

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目。在提交 PR 之前，请确保：

1. 代码通过 TypeScript 编译
2. 所有功能都经过测试
3. 更新相关文档

## 更新日志

### v0.1.0
- 初始版本发布
- 支持基本的笔记创建功能
- 支持 Token 和完整 URL 两种配置方式
- 添加 Inspector 调试工具支持

## 作者

gudong - [个人主页](https://gudong.site)

## 相关项目

- [inBox](https://inbox.gudong.site) - 简单好用的笔记服务
- [MCP Protocol](https://github.com/ModelContextProtocol/specification) - Model Context Protocol 规范

## 许可证

MIT