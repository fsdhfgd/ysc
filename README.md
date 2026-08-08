# TVBox 影视仓配置管理中心

> 一个完全在浏览器中运行的 **TVBox / 影视仓配置管理** 系统:多用户、角色权限、独立后缀、TVBox 标准字段(spider/jar/wallpaper/epg/liveUrl/sites)直接生成可用配置。**部署到 Cloudflare Pages 后,所有专属链接自动绑定到当前站点域名,换域无须改链。**

## ✨ 主要特性

- 👥 **多用户 + 角色权限** — 高级管理员 / 普通用户两级,管理员可重置密码、调整等级
- ☁️ **自动托管链接(Cloudflare 域名自动跟随)** — 部署到任意 Cloudflare Pages 项目 / 自定义域,系统自动识别 `window.location.origin`,所有专属链接以 `/r/<uid>/<cid>?target=…&t=…` 形式生成;换域、换项目链接自动跟随,无需手动改。Worker 透明转发到真实源。
- 🔑 **独立后缀** — 每个用户在被授权接口下拿到独立 Token URL,用于流量统计 / 独立计费 / 防盗用
- 📺 **TVBox 标准字段** — 内置 `spider / jar / wallpaper / parseUrl / searchable / quickSearch / epg / liveUrl / sites`,导出的 JSON 可直接喂给 TVBox 客户端
- 🪪 **用户等级配额** — 低级 1–9 / 中级 10–15 / 高级 10–30,管理员无限制
- 🔄 **失效接口看板** — 仪表盘集中展示离线 / 卡住的接口,支持一键重测与批量删除
- 🌐 **我的专属链接** — 全部已添加接口默认汇聚,带 tab 切换(全部 / 仅独立后缀)、JSON 复制 / 整批下载
- 📦 **导入 / 导出** — 一键 JSON 备份,跨设备迁移无忧
- 💾 **零后端** — 全部数据存放在浏览器 `localStorage`,无需数据库,无需服务器
- 🎨 **深色科技风 UI** — 玻璃拟态 / 渐变 / 动画,响应式适配桌面与移动

## 🏗️ 项目结构

```
tvbox-config-manager/
├── public/                        ← Cloudflare Pages 部署根目录
│   ├── index.html                 ← 主入口(完整单页应用)
│   ├── _headers                   ← HTTP 安全/缓存头
│   ├── _redirects                 ← SPA 路由 fallback
│   ├── _worker.js                 ← Cloudflare Pages Worker(可选高级路由)
│   ├── 404.html                   ← 自定义 404
│   ├── favicon.svg
│   └── robots.txt
├── _shared/                       ← 预留(可放 ECharts / Mermaid 等可选依赖)
├── assets/                        ← 预留(可放静态资源)
├── tvbox-config-manager.html      ← 根目录副本,方便本地双击预览
├── wrangler.toml                  ← Cloudflare Workers / Pages 配置
├── .github/workflows/deploy.yml   ← GitHub Actions 自动部署
└── README.md
```

## 🚀 快速开始(本地预览)

```bash
# 1) 直接用浏览器打开
open public/index.html

# 2) 或起一个静态服务器
npx serve public
# 访问 http://localhost:3000
```

## ☁️ 部署到 Cloudflare Pages(三种方式)

### 方式一:Git 集成(推荐 — 自动部署)

1. 把本仓库推到 GitHub
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Pages** → **Create a project** → **Connect to Git**
3. 选择你的仓库,设置:
   - **Framework preset**: `None`
   - **Build command**: 留空
   - **Build output directory**: `public`
4. 点击 **Save and Deploy** — 几秒后即可访问 `https://<project-name>.pages.dev`

后续每次 push 都会自动部署,PR 会得到一个临时预览 URL。

### 方式二:GitHub Actions 自动部署

1. 在 Cloudflare 创建 API Token:`My Profile → API Tokens → Create Token → Edit Cloudflare Pages`
2. 在 GitHub 仓库 **Settings → Secrets and variables → Actions** 添加:
   - `CLOUDFLARE_API_TOKEN` — 上面创建的 token
   - `CLOUDFLARE_ACCOUNT_ID` — Cloudflare 账号 ID(在 Workers & Pages 概览页右下角)
   - `CLOUDFLARE_PROJECT_NAME`(可选)— 留空则使用 `wrangler.toml` 中的 `name`
3. push 到 `main` 分支,Action 会自动部署

### 方式三:Wrangler CLI 一行命令

```bash
npm install -g wrangler
wrangler login                                       # 一次性登录
wrangler pages deploy public --project-name=tvbox-config-manager
```

## 🌐 部署到 Cloudflare Workers(Static Assets 模式)

```bash
# 1) 编辑 wrangler.toml,取消 [assets] 段注释
# 2) 部署
wrangler deploy
```

适合需要把整个项目作为 Workers 函数+静态资源一起管理的场景。

## ☁️ 自动托管链接 — Cloudflare 域名自动跟随

新增的「自动托管」开关(默认开启)让所有专属链接**自动绑定到当前站点的 Cloudflare 域名**。

### 原理
1. 浏览器调用 `window.location.origin` 获取当前站点(例:`https://my-tvbox.pages.dev`)
2. 系统拼出 `/r/<userId>/<configId>?target=<base64(c.url)>&t=<token>` 作为该用户的"专属托管 URL"
3. Cloudflare Pages 的 `_worker.js` 收到 `/r/...` 请求后,从 `?target=` 解码出真实源地址,透明转发,5 分钟边缘缓存
4. 当你把这个 Pages 项目迁到别的项目名 / 绑定自定义域(`tvbox.example.com`)时,**所有已生成的链接不需要改一个字**,新访问者照样能拿到配置

### 关闭自动托管
在「接口管理 → 编辑 → 自动托管」取消勾选即可回退到老行为:用 `c.url` 原始地址 + 随机 token。

### 安全建议
- 生产环境建议编辑 `public/_worker.js` 顶部的 `ALLOWED_TARGET_HOSTS`,只放行可信源域名
- 想加用户级鉴权,可把 `t=<token>` 写入 Cloudflare KV,Worker 中校验;当前版本只做透明转发(适合个人 / 团队内部使用)

## 🧪 默认账号

部署后第一次打开会自动注入演示数据(可在「系统设置 → 清空数据」清除):

| 用户名 | 密码 | 角色 | 用途 |
|---|---|---|---|
| `demo` | `123456` | 普通用户(低级) | 最多 9 个接口 |
| `pro` | `123456` | 普通用户(高级) | 最多 30 个接口 |

> ⚠️ 演示数据仅供首次体验,**请登录后立即在「个人中心 → 修改密码」修改默认密码**。

## 🔧 自定义

- **修改站点名 / Logo**:编辑 `public/index.html` 中 `<title>` 与 sidebar 区域
- **新增 TVBox 字段**:在 `buildTvboxFields()` / `buildDirectTvboxConfig()` 添加字段
- **绑定自定义域名**:Cloudflare Pages → Custom domains → 添加
- **改用 KV / D1 做云端同步**:把 `localStorage` 替换为 `env.KV.get()` / `env.DB.prepare()`

## 🔒 安全

- 默认无任何后端,所有数据保存在用户浏览器 localStorage,**数据完全私有**
- 已加入的 HTTP 安全头:`X-Content-Type-Options` / `X-Frame-Options` / `Referrer-Policy` / `Permissions-Policy` / `HSTS` / `COOP` / `COEP`
- 注册用户角色默认 `user`,管理员需由现有管理员在「用户管理」中分配
- 公共页面建议加 Cloudflare Access 进行身份校验(适合企业内网场景)

## 📜 License

MIT — 自由使用、修改、分发。
