<h1 align="center">MiMoCode</h1>

<p align="center">
  <img src="assets/readme/mimocode-banner.png" alt="MiMoCode" width="700">
</p>

<p align="center"><strong>MiMo Code: Where Models and Agents Co-Evolve</strong></p>

<p align="center">
  中文 | <a href="README.md">English</a>
</p>

<p align="center">
  <a href="https://mimo.xiaomi.com/zh/mimocode">官网</a> | <a href="https://mimo.xiaomi.com/zh/blog/mimo-code-long-horizon">博客</a>
</p>

---

MiMoCode 是一个终端原生的 AI 编程助手。它能读写代码、执行命令、管理 Git，通过持久化记忆系统，在多次会话间保持对你项目的深度理解，并自我进化。

内置 MiMo Auto 限时免费通道——零配置即可开始使用。也支持接入各家主流 LLM 厂商 API。

### 为什么选择 MiMoCode

现有的 AI 编程工具大致分两类：IDE 集成（Cursor、Windsurf）和终端 Agent（Claude Code、Aider）。MiMoCode 的核心差异在于：

| 维度 | IDE 集成 | 终端 Agent（通用） | MiMoCode |
|------|----------|-------------------|----------|
| 界面 | 嵌入编辑器 | 终端对话 | 终端 TUI + 多面板 |
| 记忆 | 无或有限 | 无跨会话记忆 | SQLite FTS5 持久记忆，跨会话自动恢复 |
| 上下文 | 手动管理 | 单次会话 | 自动检查点 + 上下文重建 + 预算化注入 |
| 自主性 | 辅助补全 | 单步执行 | 目标驱动循环 + 停止条件裁判 + 自我进化 |
| 编排 | 无 | 无 | Compose 工作流 + 子智能体并行 + Orchestrator 模式 |
| 成本 | 付费 | 付费 | MiMo Auto 限时免费通道 |

**终端原生不等于更好** — 如果你主要在大型 IDE 中工作、依赖图形化调试器、或不熟悉命令行，IDE 集成可能是更自然的选择。MiMoCode 更适合：习惯终端工作流的开发者、需要长时间自主执行复杂任务的场景、以及希望 AI 在多次会话间积累项目理解的团队。

---

## 快速开始

```bash
# 一键安装（macOS / Linux）
curl -fsSL https://mimo.xiaomi.com/install | bash

# 一键安装（Windows PowerShell）
powershell -ep Bypass -c "irm https://mimo.xiaomi.com/install.ps1 | iex"

# 或通过 npm 安装（全平台）
npm install -g @mimo-ai/cli

# 运行
mimo
```

首次启动自动引导配置。支持：
- **MiMo Auto（限时免费）** — 匿名通道，零配置
- **小米 MiMo 平台** — OAuth 登录
- **从 Claude Code 导入** — 一键迁移已有认证
- **自定义 Provider** — TUI 内添加任意 OpenAI 兼容 API

### 验证安装

安装完成后，运行以下命令确认一切正常：

```bash
# 1. 确认版本
mimo --version

# 2. 启动 TUI（应看到模式选择界面）
mimo

# 3. 在 TUI 中输入一条简单指令，例如：
# "列出当前目录的文件"
# 如果 agent 能读取文件并返回结果，说明基本功能正常

# 4. 测试记忆功能（可选）
# 关闭 TUI 后重新启动，输入："上次我让你做了什么？"
# 如果 agent 能回忆起之前的对话，说明记忆系统工作正常
```

<details>
<summary><strong>WSL：剪贴板问题</strong></summary>

如果在 WSL 上复制出现乱码，安装 `xsel`：
```bash
sudo apt install xsel
```
</details>

<details>
<summary><strong>Windows：shell 输出中文（CJK）乱码</strong></summary>

在系统区域为非 UTF-8 的 Windows 上（如简体中文，活动代码页为 936/GBK），命令输出里的
中日韩字符可能显示为乱码。MiMoCode 已为 PowerShell/cmd 子进程强制开启 UTF-8 输出。
如果在尚未覆盖的场景下仍遇到乱码，可以开启 Windows 的系统级 UTF-8 支持：

**设置 → 时间和语言 → 语言和区域 → 管理语言设置 → 更改系统区域设置 →
勾选「Beta 版: 使用 Unicode UTF-8 提供全球语言支持」→ 重启。**

这会把活动代码页（ACP）切换为 UTF-8（65001），所有程序都生效，子进程不再继承旧代码页。
注意这是系统级 Beta 开关，可能导致部分老的非 Unicode 程序显示异常，建议作为临时方案。
</details>

---

## MiMo 生态

除了 MiMoCode，小米 MiMo 模型也能在 Cursor、Cline、Zed 等各种 Agent 和编程工具里使用。

**[awesome-mimo-agent](https://github.com/XiaomiMiMo/awesome-mimo-agent)** 收集了这些工具接入 MiMo 模型的配置教程，想换个工具试试 MiMo 的话可以去看看。也欢迎把你自己的接入方式提 PR 分享出来。

---

## 它能为你做什么

在深入功能细节之前，先看几个实际场景：

| 场景 | 传统方式 | MiMoCode 方式 |
|------|----------|---------------|
| 重构一个跨 10 个文件的模块 | 手动逐文件修改，容易遗漏依赖 | 自动扫描依赖 → 生成计划 → 并行修改 → 类型检查 → 汇报偏差 |
| 调研一个新技术方案 | 手动搜索、阅读、对比、写报告 | `/deep-research` 自动多源调研 → 并行子代理搜集 → 生成带引用的 Markdown 报告 |
| 给项目写测试 | 手动分析代码 → 写测试 → 调试 | TDD 技能：先写失败测试 → 实现 → 通过 → 提交 |
| 跨多个仓库并行开发 | 开多个终端窗口，手动切换 | Orchestrator 模式：单窗口管理多个子会话，自动隔离 worktree |
| 新人熟悉代码库 | 阅读文档、问同事、逐文件摸索 | 让 agent 扫描代码库，回答架构问题，生成文档 |

**关键原则：构建变容易了，但创造价值依然困难。** MiMoCode 能加速执行，但什么值得做、是否解决了真实问题、用户是否采纳——这些判断仍需要人来完成。

---

## 核心特性

### 多智能体

| 智能体 | 说明 |
|--------|------|
| **build** | 默认。完整工具权限，用于开发 |
| **plan** | 只读分析模式，适合代码探索和方案设计 |
| **compose** | 编排模式，适合 specs-driven 开发和 Skill 驱动流程 |

按 `Tab` 在主智能体间切换。子智能体由系统按需生成。

### 持久化记忆

基于 SQLite FTS5 全文搜索的跨会话记忆：

- **项目记忆** (`MEMORY.md`) — 跨会话持久的项目知识、规则、架构决策
- **会话检查点** (`checkpoint.md`) — 结构化状态快照，由 checkpoint-writer 子智能体自动维护
- **笔记暂存** (`notes.md`) — Agent 临时记录区
- **任务进展** (`tasks/<id>/progress.md`) — 逐任务日志

记忆自动在会话恢复时注入上下文，agent 无需重新理解项目背景。

### 智能上下文管理

- **自动检查点** — 根据模型上下文窗口自动决定什么时候保存会话状态
- **上下文重建** — 当上下文接近上限时，从最新 checkpoint、项目记忆、任务进展和保留的近期消息重建上下文，让 agent 继续当前任务
- **预算化注入** — 用 token budget 控制 checkpoint / memory / notes 注入上下文的大小，按重要性排序

### 任务追踪

树状任务系统（T1, T1.1, T1.2…），自动与检查点系统联动，恢复会话时任务进度不丢失。

### 子智能体系统

主智能体可按需生成子智能体，共享当前会话上下文并行工作，支持生命周期追踪、取消机制和后台执行。

### Goal / 停止条件

`/goal` 命令为会话设置停止条件。当 agent 想停下来时，由独立裁判模型评估对话内容，判断条件是否真正满足——防止自主工作中的"乐观停止"。

### Compose 编排模式

Compose 模式提供结构化的 specs-driven 开发流程，内置规划、执行、代码审查、TDD、调试、验证、合并等技能——编排从 spec 到交付的完整开发生命周期。

### Workflows

Workflow 是在沙箱运行时中执行的确定性 JavaScript 脚本，可编排多个 Agent 协作。与 Agent 对话不同，Workflow 编码了固定的阶段序列、有界重试和自动并行化——全程非交互，丢出去跑完即可。

MiMoCode 内置三个 Workflow：

| Workflow | 阶段 | 说明 |
|----------|------|------|
| `compose` | Brainstorm → Design → Implement → Verify → Review → Report → Merge | 完整开发流水线。自动将独立任务并行分发到隔离的 git worktree，每个任务应用 TDD，阶段之间传递结构化输出。适合需求明确且可拆分为独立子任务的场景。 |
| `deep-research` | Brief → Plan → Research → Reflect → Write → Review | 多源深度调研报告生成器。规划独立研究角度，并行派发子代理搜集带引用的 findings，反思补缺，单点写完整 Markdown 报告，最后冷审引用。支持断点续跑。 |
| `fact-check` | Plan → Search → Extract → Group → Crosscheck → Report | 对抗式事实验证。并行搜索网络、提取可验证事实、分组去重、用 3 人陪审投票交叉验证，只保留通过的结论。适合精确求证（"X 是否属实？"）。 |

compose workflow 与 compose agent 互补：**workflow** 适合需求清晰、任务可独立拆解的场景（确定性、并行、非交互）；**agent** 适合需要中途改方向或在步骤间注入人工判断的场景（对话式、交互式）。

**自定义 Workflow：** 在 `.mimocode/workflows/` 或 `.claude/workflows/` 下放置 `.js` 文件即可定义自己的 Workflow，也可用同名文件覆盖内置 Workflow（如 `.mimocode/workflows/compose.js`）。

### 内置技能（Builtin Skills）

技能（Skill）是可复用的指令集，教会 Agent 如何处理特定任务（如生成 PDF、写学术论文、搜索 arXiv）。MiMoCode 内置以下技能：

| 技能 | 说明 |
|------|------|
| `arxiv` | 搜索、阅读、引用和分析 arXiv 论文 |
| `docx-official` | 生成、读取和转换 Word (.docx) 文件 |
| `pdf-official` | 生成、读取、填充和转换 PDF 文件 |
| `pptx-official` | 制作和操作 PowerPoint (.pptx) 幻灯片 |
| `xlsx-official` | 构建、清洗和转换电子表格 (.xlsx/.csv) |
| `design-blueprint` | 动手做视觉前先出设计蓝图（DESIGN.md + 决策轨迹）|
| `frontend-design` | UI 开发的视觉设计指导 |
| `html-to-video-pipeline` | 通过无头浏览器 + ffmpeg 将 HTML 渲染为 MP4 |
| `research-paper-writing` | 撰写和打磨学术论文（ML/CV/NLP 风格）|
| `skill-creator` | 创建和改进 Agent 技能的交互式指南 |
| `evolve` | 全面自我修改——改写 Agent 的任意层面：工具、行为钩子、知识、工作流，乃至界面本身 |
| `loop` | 按固定周期调度循环提示 |
| `mimocode` | MiMoCode 功能和配置的自文档参考 |

**覆盖内置技能：** 在项目（`.mimocode/skills/<name>/SKILL.md`）或个人技能目录（`~/.claude/skills/`、`~/.opencode/skills/` 等）中创建同名技能即可。扫描顺序中后发现的用户技能会覆盖同名的内置技能。

<details>
<summary><strong>通过环境变量禁用内置技能</strong></summary>

| 变量 | 效果 |
|------|------|
| `MIMOCODE_DISABLE_BUILTIN_SKILLS=true` | 禁用所有内置技能 |
| `MIMOCODE_DISABLE_OFFICIAL_SKILLS=true` | 仅禁用办公/媒体类技能：`docx-official`、`pdf-official`、`pptx-official`、`xlsx-official`、`html-to-video-pipeline` |

禁用后，对应技能将从 Agent 可用技能列表中完全移除——不会出现在上下文中，也无法被调用。

</details>

### 语音输入

基于 TenVAD 和 MiMo ASR 的实时流式语音输入。通过 `/voice` 激活，按停顿分片转写，文本逐段追加到输入框。仅对 MiMo 登录用户可用。需要安装 `sox`（macOS 上 `brew install sox`，其他平台类似）。

<details>
<summary><strong>WSLg 音频配置</strong></summary>

```bash
sudo apt install -y sox pulseaudio libasound2-plugins
export PULSE_SERVER=unix:/mnt/wslg/PulseServer
```
</details>

<details>
<summary><strong>SSH 远程音频（Mac → 远程主机）</strong></summary>

```bash
# Mac（本地）
brew install pulseaudio
pulseaudio --load="module-native-protocol-tcp auth-ip-acl=127.0.0.1" --exit-idle-time=-1 --daemonize
# 在 ~/.ssh/config 中添加: RemoteForward 4713 127.0.0.1:4713

# 远程主机
apt install -y pulseaudio pulseaudio-utils sox
export PULSE_SERVER=tcp:127.0.0.1:4713
# 验证: pactl info
```
</details>

<details>
<summary><strong>非 MiMo 渠道语音输入（OpenRouter、内部 API 等）</strong></summary>

语音输入可通过 `voice` 配置字段路由到其他 OpenAI 兼容 provider。ASR 模型（`mimo-v2.5-asr`）仅在 MiMo 平台可用；语音控制模式（`mimo-v2.5`）可通过 OpenRouter 等中转平台使用。

**OpenRouter（仅语音控制）：**

使用 `/connect` 连接 OpenRouter 后，只需在配置中添加：
```jsonc
{
  "voice": {
    "control_model": "openrouter/xiaomi/mimo-v2.5"
  }
}
```

**内部 / 自建中转平台（ASR + 语音控制）：**
```jsonc
{
  "provider": {
    "internal": {
      "options": {
        "baseURL": "https://your-api-gateway.example.com/v1",
        "apiKey": "sk-..."
      },
      "models": {
        "xiaomi/mimo-v2.5-asr": { "name": "MiMo-V2.5-ASR" },
        "xiaomi/mimo-v2.5": { "name": "MiMo-V2.5" }
      }
    }
  },
  "voice": {
    "asr_model": "internal/xiaomi/mimo-v2.5-asr",
    "control_model": "internal/xiaomi/mimo-v2.5"
  }
}
```

自定义 provider 必须在 `models` 中注册至少一个模型才能被系统识别。`voice.*_model` 中的模型名直接传给 API，不必与注册的 key 完全一致。OpenRouter 等内置 provider 无需手动配置 models。

> **注意**：自定义 provider 注册的模型会出现在主模型选择列表中。请勿将 ASR 专用模型（如 `mimo-v2.5-asr`）用作编程主模型。

</details>

### Dream & Distill

- **`/dream`** — 扫描近期会话轨迹，提取持久知识到项目记忆，清理过时条目
- **`/distill`** — 发现近期工作中重复的手动工作流，将高置信度候选打包成可复用的 skill、subagent 或 command

---

## 配置

MiMoCode 使用 JSON/JSONC 配置文件，并提供 JSON Schema 以获得编辑器自动补全和校验。

### 文件位置

| 文件 | 项目级 | 全局 |
|------|--------|------|
| 主配置 | `.mimocode/mimocode.jsonc` | `~/.config/mimocode/mimocode.json` |
| TUI 配置 | `.mimocode/tui.json` | `~/.config/mimocode/tui.json` |
| 认证凭据 | — | `~/.local/share/mimocode/auth.json` |

> Windows 下 XDG 路径位于 `%LOCALAPPDATA%\mimocode\`。可通过 `MIMOCODE_HOME` 环境变量覆盖所有路径。

### JSON Schema

MiMoCode 在首次加载配置时会自动注入 `$schema` 字段，使编辑器开箱即获得补全和校验：

| 配置文件 | Schema URL |
|----------|-----------|
| `mimocode.jsonc` / `mimocode.json` | `https://mimo.xiaomi.com/mimocode/config.json` |
| `tui.json` | `https://mimo.xiaomi.com/mimocode/tui.json` |

<details>
<summary><strong>VS Code / Cursor：信任 Schema 域名</strong></summary>

在 `settings.json` 中添加，使编辑器可以下载 Schema 以获得自动补全：

```json
{
  "json.schemaDownload.trustedDomains": {
    "https://mimo.xiaomi.com/": true
  }
}
```

</details>

<details>
<summary><strong>数据目录</strong></summary>

除配置文件外，MiMoCode 在 XDG 路径（或 `$MIMOCODE_HOME`）下存储运行时数据：

| 目录 | 默认路径（Linux） | 内容 |
|------|------------------|------|
| data | `~/.local/share/mimocode/` | SQLite 数据库、认证凭据（`auth.json`）、记忆、日志 |
| state | `~/.local/state/mimocode/` | TUI 偏好设置（`kv.json`）、最近使用模型（`model.json`） |
| cache | `~/.cache/mimocode/` | 语言服务器、缓存的模型目录、技能 |

如需删除已存储的凭据，删除 data 目录下的 `auth.json` 即可。macOS 下 XDG data 默认为 `~/Library/Application Support/mimocode/`。

</details>

### 主要选项

- Provider 和模型选择
- Agent 权限和自定义 Agent
- 检查点和记忆行为
- MCP 服务器连接
- 快捷键和主题

Max Mode（并行 best-of-N 推理 + 裁判选优）可通过配置中的 `experimental.maxMode` 开启。

<details>
<summary><strong>允许访问系统临时目录（<code>/tmp</code>）</strong></summary>

默认情况下，读写项目工作目录之外的文件会触发 `external_directory` 权限询问——系统临时目录也不例外。
这是有意为之：MiMoCode 不会静默放宽权限，你始终掌控模型在项目之外能触碰什么。

临时目录之所以经常被用到，是因为多数模型习惯把它当作临时工作空间（比如临时脚本、一次性数据文件）。
如果你信任所处环境、不想每次都被询问，可以在配置中主动放行：

```json title=".mimocode/mimocode.json"
{
  "$schema": "https://mimo.xiaomi.com/mimocode/config.json",
  "permission": {
    "external_directory": {
      "/tmp/**": "allow"
    }
  }
}
```

**此设置存在已知风险——使用风险由你自行承担。** 临时目录对所有用户和进程可写，与机器上的其他进程
共享。自动放行意味着模型无需确认即可在其中读写，这会扩大你对“可预测临时路径 / 软链替换”一类攻击的
暴露面（例如其他进程提前把 `/tmp/foo` 创建为指向敏感文件的软链）。因此仅建议在单人、可控的环境或
容器内使用。请尽量缩小放行范围。

</details>

<details>
<summary><strong>跳过权限确认（<code>--dangerously-skip-permissions</code>）</strong></summary>

在可信、可丢弃的环境（容器、沙箱、CI）中，你可以让智能体自动放行所有操作，而不必逐个确认：

```bash
# TUI —— 启动时会弹出一次红色警告，需你明确接受风险
mimo --dangerously-skip-permissions

# 无头模式
mimo run --dangerously-skip-permissions "你的提示词"

# 或通过环境变量（任意入口）
MIMOCODE_DANGEROUSLY_SKIP_PERMISSIONS=1 mimo
```

它会在你的配置**下方**注入一条“全部放行”的基础规则，因此没有任何规则的工具会自动放行——但你写下的
任何显式规则仍然优先（最后匹配的规则生效，你的规则排在注入的 `*` 之后）。`deny` 依然拦截；注意残留的
`ask` 规则同样仍会弹出询问，而顶层 `"*": "ask"` 会让该参数失效。在 TUI 中会显示红色警告并要求你确认后
才生效（无 TTY 时会跳过该提示，因此在 CI 中会在无确认的情况下启用）。

**这非常危险。** 一旦跳过权限确认，恶意的提示词、文件或插件就能在无任何确认的情况下执行任意 Shell
命令，并读取、修改或窃取你的数据。请仅在你完全信任的工作区中使用。

</details>

---

## 开发

```bash
bun install              # 安装依赖
bun run dev              # 开发模式运行
bun turbo typecheck      # 类型检查
```

---

## 与 OpenCode 的关系

MiMoCode 基于 [OpenCode](https://github.com/anomalyco/opencode) fork 构建。

**从 OpenCode 继承的核心能力：**
- 多 Provider 支持（OpenAI、Anthropic、Google 等）
- 终端 TUI 界面框架
- LSP 语言服务器集成
- MCP 工具协议支持
- 插件系统基础架构

**MiMoCode 在此基础上构建的增量：**

| 新增能力 | 解决的问题 |
|----------|-----------|
| 持久化记忆（SQLite FTS5） | 每次会话都要重新理解项目背景 |
| 智能上下文管理 | 长会话中上下文丢失或溢出 |
| 子智能体系统 | 复杂任务无法并行分解 |
| 目标驱动循环 + 停止条件裁判 | agent 自行判断"做完了"导致过早停止 |
| Compose 工作流 | 从 spec 到交付缺乏结构化流程 |
| Dream & Distill | 重复工作流无法自动沉淀为可复用技能 |
| Orchestrator 模式 | 多任务需要多个窗口手动管理 |
| Token 高效模式 | bash 输出噪音浪费上下文窗口 |

---

## 已知限制

使用前了解这些边界，避免踩坑：

| 限制 | 说明 | 影响 |
|------|------|------|
| **终端依赖** | 需要命令行环境，无 Web 或桌面 GUI | 不适合纯图形化工作流的用户 |
| **上下文窗口** | 受模型上下文长度限制，超大代码库可能丢失细节 | 建议配合记忆系统使用，而非单次塞入全部代码 |
| **自主执行风险** | 长时间自主运行可能偏离目标 | 建议使用 `/goal` 设置停止条件，并定期检查任务进展 |
| **记忆非实时** | 项目记忆通过定期扫描更新，不是实时同步 | 代码剧烈变动后建议手动 `/dream` 刷新记忆 |
| **实验功能** | Orchestrator、Max Mode 等标记为 experimental | 生产环境慎用，功能可能变更或回退 |
| **网络依赖** | 需要连接 LLM API 或 MiMo 服务 | 离线环境下无法使用核心功能 |

---

## 版本演进

MiMoCode 仍在快速迭代，以下是关键里程碑：

| 时间 | 里程碑 | 说明 |
|------|--------|------|
| 2025 Q1 | 基于 OpenCode fork 启动 | 继承多 Provider、TUI、LSP、MCP 核心架构 |
| 2025 Q2 | 持久化记忆 + 上下文管理 | 解决"每次会话都要重新理解项目"的痛点 |
| 2025 Q2 | 子智能体 + Compose 工作流 | 支持并行任务分解和 specs-driven 开发 |
| 2025 Q3 | Dream & Distill | agent 自我进化：从会话中提取知识、沉淀技能 |
| 2025 Q3 | Orchestrator 模式（实验） | 单窗口管理多任务，后台子会话并行执行 |
| 2025 Q3 | Token 高效模式（实验） | 清理 bash 输出噪音，节省上下文窗口 |

---

## 社区

扫描二维码加入社区群聊：

<p align="center">
  <img src="assets/readme/community-qrcode-1.jpg" alt="社区群聊二维码 1" width="240">
  &nbsp;&nbsp;
  <img src="assets/readme/community-qrcode-2.jpg" alt="社区群聊二维码 2" width="240">
</p>

---

## 许可证

源代码基于 [MIT 许可证](./LICENSE) 开源。

使用 MiMoCode 还需遵守[使用限制](./USE_RESTRICTIONS.md)。
使用小米 MiMo 托管服务须遵守 [MiMo 服务条款](https://platform.xiaomimimo.com/docs/terms/user-agreement)。
使用 MiMo 名称、标志和商标须遵守 MiMo 商标政策。
