# MCP-Server-Inbox

MCP服务对接inBox笔记API，实现在任意 MCP 客户端以对话形式创建笔记的功能。

## 功能介绍

- 接入 inBox 笔记 API
- 提供 MCP 服务发现接口
- 支持通过 MCP 客户端创建笔记
- 支持设置笔记标题（可选）
- 支持两种 API 配置方式：Token 和完整 URL
- 支持 Inspector 调试工具

## 前置条件

- Node.js 18+
- inBox 笔记 API Token (PRO 功能)
- 支持 MCP 协议的客户端（如 Cursor AI）

## 安装与使用

### 方法一：本地构建

1. 克隆代码仓库

```bash
git clone https://github.com/username/mcp-server-inbox.git
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
# 方式1：使用 Token 方式
node build/index.js --inbox_user_token=your_user_token_here

# 方式2：使用完整 URL 方式（推荐）
node build/index.js --inbox_user_token=@https://inbox.gudong.site/api/inbox/your_token_here

# 方式3：使用环境变量（支持以上两种格式）
INBOX_USER_TOKEN=your_user_token_here node build/index.js
```

### 方法二：使用 npx 运行

```bash
# 使用 Token 方式
npx mcp-server-inbox --inbox_user_token=your_user_token_here

# 使用完整 URL 方式（推荐）
npx mcp-server-inbox --inbox_user_token=@https://inbox.gudong.site/api/inbox/your_token_here

# 使用环境变量
INBOX_USER_TOKEN=your_user_token_here npx mcp-server-inbox
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
        "INBOX_USER_TOKEN": "your_user_token_here"
        // 或者使用完整 URL 格式
        // "INBOX_USER_TOKEN": "@https://inbox.gudong.site/api/inbox/your_token_here"
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

## 获取 inBox API Token

1. 打开 inBox 应用
2. 进入【设置】->【账户】->【Api】
3. 复制您的专属 API Token

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

## 许可证

MIT

## 作者

gudong - [个人主页](https://gudong.site)

## 相关项目

- [inBox](https://inbox.gudong.site) - 简单好用的笔记服务
- [MCP Protocol](https://github.com/ModelContextProtocol/specification) - Model Context Protocol 规范
