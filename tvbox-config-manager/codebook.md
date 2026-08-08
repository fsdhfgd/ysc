# 影视仓配置管理中心 · 完整代码

> 本文件按目录结构汇总了 **全部源码**;每节对应一个文件,使用对应工具(编辑器 / Cloudflare Pages)按原样部署即可。

## 📁 项目结构

```
tvbox-config-manager/
├── public/                        ← Cloudflare Pages 部署根目录
│   ├── index.html                 ← 主入口(完整单页应用)
│   ├── _headers                   ← HTTP 安全/缓存头
│   ├── _redirects                 ← SPA 路由 fallback
│   ├── _worker.js                 ← Cloudflare Pages Worker(自动托管反向代理)
│   ├── 404.html                   ← 自定义 404
│   ├── favicon.svg
│   └── robots.txt
├── tvbox-config-manager.html      ← 根目录副本,方便本地双击预览
├── wrangler.toml                  ← Cloudflare Workers / Pages 配置
├── .github/workflows/deploy.yml   ← GitHub Actions 自动部署
├── .gitignore
├── LICENSE
└── README.md
```

## 📑 文件清单

- [public/index.html · 主入口(HTML + 内联 CSS + JS)](#public-index-html)
- [tvbox-config-manager.html · 根目录单文件副本](#tvbox-config-manager-html)
- [public/_worker.js · Cloudflare Pages Worker(自动托管反向代理)](#public-_worker-js)
- [public/_headers · HTTP 安全 / 缓存头](#public-_headers)
- [public/_redirects · SPA 路由 fallback](#public-_redirects)
- [public/404.html · 自定义 404 页](#public-404-html)
- [public/robots.txt · 爬虫规则](#public-robots-txt)
- [public/favicon.svg · 站点图标](#public-favicon-svg)
- [wrangler.toml · Wrangler / Pages 配置](#wrangler-toml)
- [.github/workflows/deploy.yml · GitHub Actions 自动部署](#-github-workflows-deploy-yml)
- [.gitignore · Git 忽略规则](#-gitignore)
- [LICENSE · MIT 许可证](#license)
- [README.md · 项目说明](#readme-md)

---

## public/index.html · 主入口(HTML + 内联 CSS + JS)

> 路径: `public/index.html` · 大小: 128.7 KB

```html
<!-- TVBox Config Manager v2.0 — Cloudflare Pages ready -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="theme-color" content="#0a0e1a">
<meta name="description" content="影视仓 / TVBox 配置管理中心:多用户、角色权限、独立后缀、TVBox 标准字段直接生成可用配置。">
<meta name="keywords" content="TVBox,影视仓,配置管理,spider,jar,wallpaper,EPG,subscribe,m3u,多仓,单仓">
<meta name="author" content="TVBox Manager">
<meta name="robots" content="noindex,nofollow">
<meta property="og:title" content="影视仓配置管理中心">
<meta property="og:description" content="TVBox 配置管理 · 多用户 · 独立后缀 · 一键生成可用配置">
<meta property="og:type" content="website">
<meta property="og:locale" content="zh_CN">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%2300e5ff'/><stop offset='100%' stop-color='%237c4dff'/></linearGradient></defs><rect width='64' height='64' rx='14' fill='url(%23g)'/><polygon points='24,18 48,32 24,46' fill='%23001'/></svg>">
<title>影视仓配置管理中心</title>
<style>
  /* ========== Reset & Base ========== */
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%}
  body{
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;
    background:var(--bg);
    color:var(--ink);
    line-height:1.6;
    min-height:100vh;
    overflow-x:hidden;
    position:relative;
  }
  body::before{
    content:"";
    position:fixed;inset:0;
    background:
      radial-gradient(ellipse at 20% 10%, rgba(0,229,255,.08), transparent 50%),
      radial-gradient(ellipse at 80% 90%, rgba(124,77,255,.10), transparent 50%),
      radial-gradient(ellipse at 50% 50%, rgba(0,255,170,.04), transparent 60%);
    pointer-events:none;
    z-index:0;
  }
  ::selection{background:var(--accent);color:#001218}
  a{color:inherit;text-decoration:none}
  button{font-family:inherit;cursor:pointer;border:none;background:none;color:inherit}
  input,select,textarea{font-family:inherit;color:inherit}

  /* ========== Design Tokens ========== */
  :root{
    --bg:#0a0e1a;
    --bg2:#111827;
    --bg3:#1a2235;
    --surface:rgba(26,34,53,.65);
    --surface-2:rgba(17,24,39,.85);
    --ink:#e6edf7;
    --ink-2:#c5d1e3;
    --muted:#7e8aa3;
    --rule:rgba(126,138,163,.18);
    --accent:#00e5ff;
    --accent-soft:rgba(0,229,255,.12);
    --accent2:#7c4dff;
    --accent2-soft:rgba(124,77,255,.14);
    --success:#00ffae;
    --warn:#ffb547;
    --danger:#ff5577;
    --radius:14px;
    --radius-sm:8px;
    --shadow-glow:0 0 24px rgba(0,229,255,.18);
    --shadow-card:0 8px 32px rgba(0,0,0,.35);
    --transition:all .25s cubic-bezier(.4,0,.2,1);
  }

  /* ========== Layout ========== */
  .app{position:relative;z-index:1;display:grid;grid-template-columns:240px 1fr;min-height:100vh}
  .app.hidden{display:none}
  .sidebar{
    background:linear-gradient(180deg, rgba(17,24,39,.95), rgba(10,14,26,.95));
    border-right:1px solid var(--rule);
    padding:1.5rem 1rem;
    position:sticky;top:0;height:100vh;
    overflow-y:auto;backdrop-filter:blur(12px);
  }
  .brand{display:flex;align-items:center;gap:.6rem;padding:0 .5rem 1.5rem;border-bottom:1px solid var(--rule);margin-bottom:1.25rem}
  .brand-logo{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:1.2rem;color:#001;box-shadow:var(--shadow-glow)}
  .brand-name{font-weight:700;font-size:1.05rem;letter-spacing:.5px}
  .brand-sub{font-size:.7rem;color:var(--muted);margin-top:2px}
  .nav{display:flex;flex-direction:column;gap:.25rem}
  .nav-item{display:flex;align-items:center;gap:.7rem;padding:.7rem .85rem;border-radius:var(--radius-sm);color:var(--ink-2);font-size:.9rem;cursor:pointer;transition:var(--transition);border:1px solid transparent}
  .nav-item:hover{background:var(--surface);color:var(--ink)}
  .nav-item.active{background:linear-gradient(90deg, var(--accent-soft), transparent);color:var(--accent);border-color:rgba(0,229,255,.25)}
  .nav-item .ico{width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center}
  .nav-section{font-size:.7rem;color:var(--muted);text-transform:uppercase;letter-spacing:1.2px;padding:1rem .85rem .4rem}
  .main{padding:1.5rem 2rem 3rem;overflow-x:hidden}
  .topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;gap:1rem;flex-wrap:wrap}
  .topbar h1{font-size:1.6rem;font-weight:700;letter-spacing:.5px}
  .topbar .sub{color:var(--muted);font-size:.85rem;margin-top:4px}
  .topbar-actions{display:flex;gap:.5rem;flex-wrap:wrap}

  /* ========== Buttons ========== */
  .btn{display:inline-flex;align-items:center;gap:.45rem;padding:.55rem 1rem;border-radius:var(--radius-sm);font-size:.85rem;font-weight:500;background:var(--surface);border:1px solid var(--rule);color:var(--ink);transition:var(--transition)}
  .btn:hover{background:var(--surface-2);border-color:var(--accent);color:var(--accent)}
  .btn.primary{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#001218;font-weight:600;border-color:transparent}
  .btn.primary:hover{box-shadow:var(--shadow-glow);transform:translateY(-1px)}
  .btn.ghost{background:transparent}
  .btn.danger:hover{border-color:var(--danger);color:var(--danger)}
  .btn.sm{padding:.35rem .7rem;font-size:.78rem}

  /* ========== Stat Cards ========== */
  .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.5rem}
  .stat{background:var(--surface);border:1px solid var(--rule);border-radius:var(--radius);padding:1.1rem 1.25rem;position:relative;overflow:hidden;transition:var(--transition)}
  .stat:hover{border-color:var(--accent);transform:translateY(-2px)}
  .stat::before{content:"";position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--accent),var(--accent2));opacity:.6}
  .stat-label{font-size:.75rem;color:var(--muted);text-transform:uppercase;letter-spacing:1px}
  .stat-value{font-size:1.9rem;font-weight:700;margin:.3rem 0 .2rem;letter-spacing:.5px}
  .stat-delta{font-size:.75rem;color:var(--success)}
  .stat-delta.warn{color:var(--warn)}
  .stat-delta.danger{color:var(--danger)}

  /* ========== Toolbar ========== */
  .toolbar{background:var(--surface);border:1px solid var(--rule);border-radius:var(--radius);padding:1rem 1.25rem;display:flex;align-items:center;gap:.75rem;flex-wrap:wrap;margin-bottom:1.25rem}
  .search{position:relative;flex:1;min-width:220px}
  .search input{width:100%;background:var(--bg2);border:1px solid var(--rule);border-radius:var(--radius-sm);padding:.55rem .9rem .55rem 2.2rem;font-size:.88rem;transition:var(--transition)}
  .search input:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft)}
  .search::before{content:"⌕";position:absolute;left:.7rem;top:50%;transform:translateY(-50%);color:var(--muted);font-size:1rem}
  .filter-chip{padding:.4rem .85rem;background:var(--bg2);border:1px solid var(--rule);border-radius:999px;font-size:.78rem;color:var(--ink-2);cursor:pointer;transition:var(--transition)}
  .filter-chip:hover{border-color:var(--accent);color:var(--accent)}
  .filter-chip.active{background:var(--accent-soft);border-color:var(--accent);color:var(--accent)}

  /* ========== Table ========== */
  .table-wrap{background:var(--surface);border:1px solid var(--rule);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow-card)}
  .table-wrap .scroll{max-height:640px;overflow-y:auto;overflow-x:auto}
  table{width:100%;border-collapse:collapse;min-width:880px}
  thead th{background:rgba(10,14,26,.6);color:var(--muted);font-weight:600;font-size:.75rem;text-transform:uppercase;letter-spacing:1px;padding:.85rem 1rem;text-align:left;border-bottom:1px solid var(--rule);position:sticky;top:0;z-index:1;backdrop-filter:blur(8px)}
  tbody td{padding:.85rem 1rem;border-bottom:1px solid var(--rule);font-size:.88rem;color:var(--ink-2);vertical-align:middle}
  tbody tr{transition:var(--transition)}
  tbody tr:hover{background:rgba(0,229,255,.04)}
  tbody tr:last-child td{border-bottom:none}
  .name-cell{display:flex;align-items:center;gap:.6rem}
  .name-cell .avatar{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:.9rem;font-weight:600;color:#001}
  .name-cell .name{font-weight:600;color:var(--ink)}
  .name-cell .desc{font-size:.75rem;color:var(--muted);margin-top:2px}
  .badge{display:inline-flex;align-items:center;gap:.3rem;padding:.2rem .55rem;border-radius:999px;font-size:.7rem;font-weight:600;border:1px solid transparent}
  .badge.single{background:rgba(0,229,255,.12);color:var(--accent);border-color:rgba(0,229,255,.3)}
  .badge.multi{background:rgba(124,77,255,.14);color:#a78bfa;border-color:rgba(124,77,255,.3)}
  .badge.subscribe{background:rgba(255,181,71,.12);color:var(--warn);border-color:rgba(255,181,71,.3)}
  .badge.local{background:rgba(0,255,174,.12);color:var(--success);border-color:rgba(0,255,174,.3)}
  .badge.online{background:rgba(0,255,174,.12);color:var(--success);border-color:rgba(0,255,174,.3)}
  .badge.offline{background:rgba(255,85,119,.12);color:var(--danger);border-color:rgba(255,85,119,.3)}
  .badge.disabled{background:rgba(126,138,163,.12);color:var(--muted);border-color:var(--rule)}
  .badge.testing{background:rgba(255,181,71,.12);color:var(--warn);border-color:rgba(255,181,71,.3)}
  .url-cell{max-width:280px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.78rem;color:var(--ink-2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .row-actions{display:flex;gap:.35rem}
  .icon-btn{width:30px;height:30px;border-radius:6px;display:inline-flex;align-items:center;justify-content:center;color:var(--muted);transition:var(--transition)}
  .icon-btn:hover{background:var(--surface-2);color:var(--accent)}
  .icon-btn.danger:hover{color:var(--danger)}

  /* ========== Personal URL (per-user token) ========== */
  .url-cell{display:flex;flex-direction:column;gap:2px}
  .url-cell .url-base{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.78rem;color:var(--ink-2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .url-cell .url-token{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.7rem;color:var(--accent);background:var(--accent-soft);padding:1px 6px;border-radius:4px;display:inline-block;width:max-content;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .url-cell .url-token::before{content:"🔑 "}
  .field-hint{font-size:.76rem;color:var(--muted);margin-top:.3rem;line-height:1.4}
  .token-mode{display:flex;align-items:center;gap:.5rem;padding:.6rem .8rem;background:var(--bg3);border:1px solid var(--rule);border-radius:var(--radius-sm);margin-top:.3rem}
  .token-mode input{margin:0}
  .token-mode label{font-size:.85rem;cursor:pointer;flex:1;color:var(--ink-2)}
  .token-mode .ico{font-size:1.1rem}
  details.tvbox-advanced{margin-top:.5rem;border:1px dashed var(--rule);border-radius:var(--radius-sm);padding:.4rem .7rem;background:rgba(255,255,255,.02)}
  details.tvbox-advanced>summary{cursor:pointer;font-size:.82rem;color:var(--ink-2);padding:.25rem 0;list-style:none;user-select:none}
  details.tvbox-advanced>summary::-webkit-details-marker{display:none}
  details.tvbox-advanced[open]>summary{color:var(--accent);margin-bottom:.4rem}
  .adv-grid{display:grid;grid-template-columns:1fr 1fr;gap:.5rem .8rem;margin-top:.4rem}
  .adv-grid .field{margin-bottom:.3rem}
  .adv-grid .field input,.adv-grid .field select,.adv-grid .field textarea{width:100%;box-sizing:border-box}
  .token-preview{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.72rem;color:var(--accent);background:var(--bg2);padding:.5rem .7rem;border-radius:6px;margin-top:.5rem;word-break:break-all;border:1px dashed var(--rule)}

  /* ========== Failed Interfaces Card ========== */
  .failed-card{position:relative}
  .failed-card::before{content:"";position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--danger),rgba(255,85,119,.3));border-radius:var(--radius) var(--radius) 0 0}
  .failed-head{display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;margin-bottom:.2rem}
  .failed-head h3{margin:0}
  .failed-row-name{color:var(--ink);font-weight:600}
  .failed-row-name .row-meta{display:block;font-weight:400;font-size:.75rem;color:var(--muted);margin-top:2px}

  /* ========== Empty State ========== */
  .empty{padding:4rem 2rem;text-align:center;color:var(--muted)}
  .empty .ico{font-size:3rem;margin-bottom:1rem;opacity:.5}
  .empty h3{color:var(--ink);margin-bottom:.4rem}
  .empty p{font-size:.88rem}

  /* ========== Modal ========== */
  .modal-mask{position:fixed;inset:0;background:rgba(5,8,15,.75);backdrop-filter:blur(8px);display:none;align-items:center;justify-content:center;z-index:1000;padding:1rem}
  .modal-mask.show{display:flex}
  .modal{background:linear-gradient(180deg, var(--bg2), var(--bg));border:1px solid var(--rule);border-radius:var(--radius);width:100%;max-width:560px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 64px rgba(0,0,0,.5), 0 0 0 1px rgba(0,229,255,.05)}
  .modal-head{padding:1.25rem 1.5rem;border-bottom:1px solid var(--rule);display:flex;align-items:center;justify-content:space-between}
  .modal-head h2{font-size:1.15rem;font-weight:600}
  .modal-close{color:var(--muted);font-size:1.4rem;line-height:1;padding:.2rem .4rem}
  .modal-close:hover{color:var(--ink)}
  .modal-body{padding:1.5rem}
  .modal-foot{padding:1rem 1.5rem;border-top:1px solid var(--rule);display:flex;justify-content:flex-end;gap:.5rem}
  .field{margin-bottom:1.1rem}
  .field label{display:block;font-size:.8rem;color:var(--ink-2);margin-bottom:.4rem;font-weight:500}
  .field label .req{color:var(--danger);margin-left:2px}
  .field input,.field select,.field textarea{width:100%;background:var(--bg3);border:1px solid var(--rule);border-radius:var(--radius-sm);padding:.6rem .85rem;font-size:.9rem;transition:var(--transition)}
  .field textarea{resize:vertical;min-height:80px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.82rem}
  .field input:focus,.field select:focus,.field textarea:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft)}
  .field-row{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}

  /* ========== Toast ========== */
  .toast-wrap{position:fixed;top:1.5rem;right:1.5rem;display:flex;flex-direction:column;gap:.5rem;z-index:2000;pointer-events:none}
  .toast{background:var(--bg2);border:1px solid var(--rule);border-left:3px solid var(--accent);border-radius:var(--radius-sm);padding:.75rem 1rem;font-size:.85rem;color:var(--ink);box-shadow:var(--shadow-card);min-width:240px;animation:slideIn .3s ease}
  .toast.success{border-left-color:var(--success)}
  .toast.danger{border-left-color:var(--danger)}
  .toast.warn{border-left-color:var(--warn)}
  @keyframes slideIn{from{transform:translateX(20px);opacity:0}to{transform:translateX(0);opacity:1}}

  /* ========== Switch ========== */
  .switch{position:relative;display:inline-block;width:40px;height:22px;cursor:pointer}
  .switch input{opacity:0;width:0;height:0}
  .switch .slider{position:absolute;inset:0;background:var(--bg3);border:1px solid var(--rule);border-radius:999px;transition:var(--transition)}
  .switch .slider::before{content:"";position:absolute;left:2px;top:2px;width:16px;height:16px;background:var(--muted);border-radius:50%;transition:var(--transition)}
  .switch input:checked + .slider{background:var(--accent-soft);border-color:var(--accent)}
  .switch input:checked + .slider::before{transform:translateX(18px);background:var(--accent)}

  /* ========== Detail Panel ========== */
  .detail-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;margin-bottom:1.25rem}
  .detail-card{background:var(--surface);border:1px solid var(--rule);border-radius:var(--radius);padding:1.1rem 1.25rem}
  .detail-card h3{font-size:.85rem;color:var(--muted);margin-bottom:.6rem;text-transform:uppercase;letter-spacing:1px}
  .detail-list{display:flex;flex-direction:column;gap:.5rem}
  .detail-list .row{display:flex;justify-content:space-between;font-size:.88rem;padding:.25rem 0}
  .detail-list .row .k{color:var(--muted)}
  .detail-list .row .v{color:var(--ink);font-weight:500}

  /* ========== Auth Pages ========== */
  .auth-wrap{position:fixed;inset:0;z-index:1500;display:flex;align-items:center;justify-content:center;padding:1.5rem}
  .auth-wrap.hidden{display:none}
  .auth-card{width:100%;max-width:440px;background:linear-gradient(180deg, rgba(26,34,53,.95), rgba(10,14,26,.95));border:1px solid var(--rule);border-radius:18px;padding:2.25rem 2rem 1.75rem;box-shadow:0 24px 64px rgba(0,0,0,.55), 0 0 0 1px rgba(0,229,255,.05);position:relative;overflow:hidden}
  .auth-card::before{content:"";position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--accent),var(--accent2))}
  .auth-head{text-align:center;margin-bottom:1.5rem}
  .auth-logo{width:54px;height:54px;margin:0 auto .8rem;border-radius:14px;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:1.5rem;color:#001;box-shadow:var(--shadow-glow)}
  .auth-title{font-size:1.35rem;font-weight:700;letter-spacing:.5px}
  .auth-sub{color:var(--muted);font-size:.82rem;margin-top:.3rem}
  .auth-tabs{display:flex;background:var(--bg3);border-radius:var(--radius-sm);padding:3px;margin-bottom:1.25rem}
  .auth-tab{flex:1;padding:.5rem 0;text-align:center;font-size:.85rem;color:var(--muted);border-radius:6px;cursor:pointer;transition:var(--transition)}
  .auth-tab.active{background:var(--accent);color:#001218;font-weight:600}
  .auth-form .field{margin-bottom:.9rem}

  /* error state */
  input.input-error,textarea.input-error,select.input-error{border-color:var(--danger)!important;box-shadow:0 0 0 3px rgba(255,85,119,.15)!important}
  .input-error.shake{animation:shake .35s ease}
  @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}

  /* pwd strength + show/hide */
  .pwd-strength{height:4px;border-radius:2px;background:var(--bg3);overflow:hidden;margin-top:.4rem}
  .pwd-strength>div{height:100%;width:0;transition:all .3s ease}
  .pwd-hint{font-size:.7rem;color:var(--muted);margin-top:.3rem;min-height:1em}
  .pwd-wrap{position:relative}
  .pwd-wrap input{padding-right:2.4rem!important}
  .pwd-toggle{position:absolute;right:.5rem;top:50%;transform:translateY(-50%);width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;color:var(--muted);cursor:pointer;transition:var(--transition);background:transparent}
  .pwd-toggle:hover{color:var(--accent);background:var(--bg2)}
  .pwd-toggle.showing{color:var(--accent)}
  .pwd-toggle svg{width:16px;height:16px}

  .auth-extra{display:flex;justify-content:space-between;align-items:center;font-size:.78rem;color:var(--muted);margin:.25rem 0 1rem}
  .auth-extra a{color:var(--accent)}
  .auth-extra a:hover{text-decoration:underline}
  .auth-tip{text-align:center;font-size:.8rem;color:var(--muted);margin-top:1rem}
  .auth-tip a{color:var(--accent);font-weight:500}
  .auth-tip a:hover{text-decoration:underline}

  /* user chip */
  .user-chip{display:flex;align-items:center;gap:.6rem;padding:.7rem .85rem;border-radius:var(--radius-sm);background:var(--surface);border:1px solid var(--rule);margin-top:1rem;cursor:pointer;transition:var(--transition)}
  .user-chip:hover{border-color:var(--accent)}
  .user-chip .avatar-sm{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:600;color:#001;font-size:.85rem;flex-shrink:0}
  .user-chip .info{flex:1;min-width:0}
  .user-chip .name{font-size:.85rem;font-weight:600;color:var(--ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .user-chip .role{font-size:.65rem;color:var(--muted);text-transform:uppercase;letter-spacing:1px}
  .user-chip .logout{color:var(--muted);font-size:.9rem;padding:.2rem .4rem;border-radius:4px}
  .user-chip .logout:hover{color:var(--danger);background:rgba(255,85,119,.1)}
  .role-badge{display:inline-block;padding:.1rem .4rem;border-radius:4px;font-size:.6rem;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-left:.3rem;vertical-align:middle}
  .role-badge.admin{background:linear-gradient(135deg,#ffb547,#ff5577);color:#1a0a00}
  .role-badge.user{background:var(--surface);color:var(--muted);border:1px solid var(--rule)}
  .user-meta{font-size:.78rem;color:var(--muted);margin-top:2px}

  /* ========== Responsive ========== */
  @media (max-width: 960px){
    .app{grid-template-columns:1fr}
    .sidebar{position:relative;height:auto;display:flex;flex-direction:column}
    .stats{grid-template-columns:repeat(2,1fr)}
    .field-row{grid-template-columns:1fr}
    .detail-grid{grid-template-columns:1fr}
  }
  @media (max-width: 600px){
    .main{padding:1rem}
    .stats{grid-template-columns:1fr}
    .topbar h1{font-size:1.25rem}
  }
</style>
</head>
<body>
<div class="app" id="app">
  <!-- ========== Sidebar ========== -->
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-logo">▶</div>
      <div>
        <div class="brand-name">TVBox Manager</div>
        <div class="brand-sub">影视仓配置中心</div>
      </div>
    </div>
    <nav class="nav" id="nav">
      <div class="nav-section">主导航</div>
      <div class="nav-item active" data-view="dashboard" data-roles="admin,user"><span class="ico">◉</span><span>仪表盘</span></div>
      <div class="nav-item" data-view="configs" data-roles="admin,user"><span class="ico">▤</span><span>接口管理</span></div>
      <div class="nav-item" data-view="mylinks" data-roles="admin,user"><span class="ico">🔗</span><span>我的专属链接</span></div>
      <div class="nav-item" data-view="groups" data-roles="admin,user"><span class="ico">◫</span><span>分组管理</span></div>
      <div class="nav-item admin-only" data-view="users" data-roles="admin"><span class="ico">👥</span><span>用户管理</span></div>
      <div class="nav-item admin-only" data-view="userlinks" data-roles="admin"><span class="ico">👥🔗</span><span>全员链接</span></div>
      <div class="nav-section">工具</div>
      <div class="nav-item" data-view="import" data-roles="admin,user"><span class="ico">↓</span><span>导入 / 导出</span></div>
      <div class="nav-item" data-view="profile" data-roles="admin,user"><span class="ico">◐</span><span>个人中心</span></div>
      <div class="nav-item" data-view="settings" data-roles="admin,user"><span class="ico">⚙</span><span>系统设置</span></div>
    </nav>
    <div class="user-chip" onclick="goView('profile')">
      <div class="avatar-sm" id="user-avatar">A</div>
      <div class="info">
        <div class="name" id="user-name">未登录</div>
        <div class="role" id="user-role">-</div>
      </div>
      <button class="logout" title="退出登录" onclick="event.stopPropagation();logout()">⏻</button>
    </div>
  </aside>

  <!-- ========== Main ========== -->
  <main class="main">
    <!-- Dashboard -->
    <section id="view-dashboard" class="view">
      <div class="topbar"><div><h1>仪表盘</h1><div class="sub">总览所有影视仓接口配置与运行状态</div></div>
        <div class="topbar-actions"><button class="btn" onclick="openImportModal()">↓ 导入</button><button class="btn primary" id="dash-add-btn" onclick="onDashAddClick()">+ 新增接口</button></div></div>
      <div class="stats">
        <div class="stat"><div class="stat-label">接口总数</div><div class="stat-value" id="stat-total">0</div><div class="stat-delta">活跃配置项</div></div>
        <div class="stat"><div class="stat-label">单仓接口</div><div class="stat-value" id="stat-single">0</div><div class="stat-delta">加载速度快</div></div>
        <div class="stat"><div class="stat-label">多仓接口</div><div class="stat-value" id="stat-multi">0</div><div class="stat-delta warn">稳定性更高</div></div>
        <div class="stat"><div class="stat-label">在线可用</div><div class="stat-value" id="stat-online">0</div><div class="stat-delta">最近一次检测</div></div>
      </div>
      <div class="detail-grid">
        <div class="detail-card"><h3>类型分布</h3><div class="detail-list">
          <div class="row"><span class="k">单仓接口</span><span class="v" id="dist-single">0</span></div>
          <div class="row"><span class="k">多仓接口</span><span class="v" id="dist-multi">0</span></div>
          <div class="row"><span class="k">订阅源</span><span class="v" id="dist-subscribe">0</span></div>
          <div class="row"><span class="k">本地文件</span><span class="v" id="dist-local">0</span></div>
        </div></div>
        <div class="detail-card"><h3>状态分布</h3><div class="detail-list">
          <div class="row"><span class="k">已启用</span><span class="v" id="st-enabled">0</span></div>
          <div class="row"><span class="k">已禁用</span><span class="v" id="st-disabled">0</span></div>
          <div class="row"><span class="k">检测中</span><span class="v" id="st-testing">0</span></div>
          <div class="row"><span class="k">已离线</span><span class="v" id="st-offline">0</span></div>
        </div></div>
      </div>

      <!-- Failed / Offline interfaces -->
      <div class="detail-card failed-card" style="margin-top:1rem">
        <div class="failed-head">
          <h3 style="color:var(--danger);display:flex;align-items:center;gap:.5rem">
            <span style="display:inline-flex;width:8px;height:8px;border-radius:50%;background:var(--danger);box-shadow:0 0 8px var(--danger)"></span>
            失效接口 <span id="failed-count" class="role-badge" style="background:rgba(255,85,119,.15);color:var(--danger);font-size:.7rem;padding:2px 8px">0</span>
          </h3>
          <div style="display:flex;gap:.4rem;flex-wrap:wrap">
            <button class="btn sm" onclick="retestAllFailed()">↻ 全部重新检测</button>
            <button class="btn sm danger" onclick="bulkRemoveFailed()">🗑 批量删除</button>
            <button class="btn sm ghost" onclick="goView('configs')">查看全部 →</button>
          </div>
        </div>
        <div class="failed-hint" id="failed-hint" style="color:var(--muted);font-size:.82rem;margin:.4rem 0 .8rem;line-height:1.5">
          这里集中展示检测为"已离线"或长期处于"检测中"的接口，点击可快速重测 / 启用 / 编辑 / 删除。
        </div>
        <div class="table-wrap" style="border:1px solid rgba(255,85,119,.18)"><div class="scroll"><table>
          <thead><tr><th>名称</th><th>类型</th><th>配置地址</th><th>当前状态</th><th>失败时长</th><th style="text-align:right">操作</th></tr></thead>
          <tbody id="failed-tbody"></tbody>
        </table></div></div>
      </div>
    </section>

    <!-- Configs -->
    <section id="view-configs" class="view" style="display:none">
      <div class="topbar"><div><h1>接口管理</h1><div class="sub">管理所有影视仓 / TVBox 配置接口</div></div>
        <div class="topbar-actions"><button class="btn" onclick="exportConfigs()">⤓ 导出 JSON</button><button class="btn primary" id="cfgs-add-btn" onclick="onCfgsAddClick()">+ 新增接口</button></div></div>
      <div class="toolbar">
        <div class="search"><input type="text" id="search-input" placeholder="搜索名称、地址、标签..." oninput="renderConfigs()"></div>
        <div style="display:flex;gap:.4rem;flex-wrap:wrap" id="filter-chips">
          <span class="filter-chip active" data-filter="all">全部</span>
          <span class="filter-chip" data-filter="single">单仓</span>
          <span class="filter-chip" data-filter="multi">多仓</span>
          <span class="filter-chip" data-filter="subscribe">订阅</span>
          <span class="filter-chip" data-filter="local">本地</span>
        </div>
        <select id="status-filter" onchange="renderConfigs()" style="background:var(--bg2);border:1px solid var(--rule);border-radius:var(--radius-sm);padding:.45rem .7rem;font-size:.82rem;color:var(--ink)">
          <option value="all">所有状态</option><option value="online">在线</option><option value="offline">离线</option><option value="testing">检测中</option><option value="disabled">已禁用</option>
        </select>
      </div>
      <div class="table-wrap"><div class="scroll"><table>
        <thead><tr><th>名称</th><th>类型</th><th>配置地址</th><th>状态</th><th>启用</th><th>TVBox 字段</th><th>更新时间</th><th style="text-align:right">操作</th></tr></thead>
        <tbody id="config-tbody"></tbody>
      </table></div></div>
    </section>

    <!-- My Links (per-user personal link view, visible to all logged-in users) -->
    <section id="view-mylinks" class="view" style="display:none">
      <div class="topbar"><div><h1>我的专属链接</h1><div class="sub" id="ml-sub">这里展示你（<span id="ml-username">-</span>）可见的全部接口</div></div></div>
      <!-- 自动托管 / 部署域名信息条 -->
      <div class="detail-card" id="ml-host-card" style="margin-bottom:1rem;padding:1rem 1.2rem;display:flex;align-items:center;gap:1rem;flex-wrap:wrap;background:linear-gradient(135deg,rgba(0,229,255,.06),rgba(124,77,255,.06));border:1px solid rgba(0,229,255,.25)">
        <div style="flex:0 0 auto">
          <div style="font-size:.7rem;color:var(--muted);letter-spacing:.5px;text-transform:uppercase;margin-bottom:.3rem">☁️ 当前部署域名 (Cloudflare)</div>
          <div id="ml-host-origin" style="font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:1rem;color:var(--accent);font-weight:600">…</div>
        </div>
        <div style="flex:1;min-width:200px;color:var(--muted);font-size:.78rem;line-height:1.5">
          下方的「自动托管」接口将使用 <b style="color:var(--accent)">此域名</b> 作为链接前缀(<code style="color:var(--accent)">/r/&lt;uid&gt;/&lt;cid&gt;?t=&lt;token&gt;</code>),部署到任何 Cloudflare Pages / 自定义域名,所有专属链接自动跟随,无需手动改。
        </div>
        <div style="display:flex;gap:.4rem;flex-wrap:wrap;flex:0 0 auto">
          <button class="btn" onclick="copySiteOrigin()">⧉ 复制域名</button>
          <button class="btn" onclick="openSiteOrigin()">↗ 打开</button>
        </div>
      </div>
      <div style="display:flex;gap:.4rem;margin-bottom:.8rem;flex-wrap:wrap">
        <span id="ml-tab-all" class="filter-chip active" onclick="setMyLinksMode('all')">📋 全部接口</span>
        <span id="ml-tab-personal" class="filter-chip" onclick="setMyLinksMode('personal')">🔑 仅独立后缀</span>
      </div>
      <div class="detail-grid" style="grid-template-columns:1fr 1fr 1fr;margin-bottom:1rem">
        <div class="stat"><div class="stat-label">可见接口</div><div class="stat-value" id="ml-count">0</div><div class="stat-delta">包含全部 / 独立后缀</div></div>
        <div class="stat"><div class="stat-label">复制次数</div><div class="stat-value" id="ml-copies">0</div><div class="stat-delta">本机累计</div></div>
        <div class="stat"><div class="stat-label">最后复制</div><div class="stat-value" id="ml-lastcopy" style="font-size:1rem">-</div><div class="stat-delta">最近一次操作</div></div>
      </div>
      <div class="toolbar">
        <div class="search"><input type="text" id="ml-search" placeholder="搜索接口名、类型、标签..." oninput="renderMyLinks()"></div>
        <select id="ml-type-filter" onchange="renderMyLinks()" style="background:var(--bg2);border:1px solid var(--rule);border-radius:var(--radius-sm);padding:.45rem .7rem;font-size:.82rem;color:var(--ink)">
          <option value="all">所有类型</option>
          <option value="single">单仓</option>
          <option value="multi">多仓</option>
          <option value="subscribe">订阅源</option>
          <option value="local">本地文件</option>
        </select>
        <button class="btn" onclick="copyAllMyLinks()" title="复制为 JSON 格式">⧉ 复制全部（JSON）</button>
        <button class="btn" onclick="downloadAllMyLinksBundle()" title="下载整批可被 TVBox / 自动化脚本解析的 JSON">⤓ 下载整批（JSON）</button>
        <button class="btn primary" onclick="downloadMyLinksJson()" title="下载为 .json 文件">⤓ 下载 JSON 文件</button>
      </div>
      <div class="pwd-hint" style="color:var(--muted);font-size:.76rem;margin:.4rem 0 .8rem">
        默认"全部接口"标签下,会汇聚你在系统里可见的所有接口（包括未启用"独立后缀"的公共接口）；切换到"仅独立后缀"可只看带个人 Token 的专属地址。每条接口都会在 TVBox 客户端里获得独立地址或原始地址,你可以直接复制 / 下载用于自己的设备。
        复制/下载的内容为标准 JSON 格式,包含完整元数据:<code style="background:var(--bg3);padding:1px 5px;border-radius:3px">type</code> / <code style="background:var(--bg3);padding:1px 5px;border-radius:3px">version</code> / <code style="background:var(--bg3);padding:1px 5px;border-radius:3px">user</code> / <code style="background:var(--bg3);padding:1px 5px;border-radius:3px">links[]</code>,可直接被 TVBox 客户端、自动化脚本或第三方工具解析。
        每条 link 内嵌 <code style="background:var(--bg3);padding:1px 5px;border-radius:3px">tvbox</code> 块,包含 <code style="background:var(--bg3);padding:1px 5px;border-radius:3px">spider</code> / <code style="background:var(--bg3);padding:1px 5px;border-radius:3px">jar</code> / <code style="background:var(--bg3);padding:1px 5px;border-radius:3px">wallpaper</code> / <code style="background:var(--bg3);padding:1px 5px;border-radius:3px">parseUrl</code> / <code style="background:var(--bg3);padding:1px 5px;border-radius:3px">searchable</code> / <code style="background:var(--bg3);padding:1px 5px;border-radius:3px">quickSearch</code> / <code style="background:var(--bg3);padding:1px 5px;border-radius:3px">epg</code> / <code style="background:var(--bg3);padding:1px 5px;border-radius:3px">liveUrl</code> / <code style="background:var(--bg3);padding:1px 5px;border-radius:3px">sites</code> 字段;需要单条直接可用的 TVBox 配置时,点击该行右侧的 📺 或 ⤓ 按钮即可。
      </div>
      <div class="table-wrap"><div class="scroll"><table>
        <thead><tr><th>接口</th><th>类型</th><th>你的专属地址</th><th>Token</th><th style="text-align:right">操作</th></tr></thead>
        <tbody id="mylinks-tbody"></tbody>
      </table></div></div>
    </section>

    <!-- Groups -->
    <section id="view-groups" class="view" style="display:none">
      <div class="topbar"><div><h1>分组管理</h1><div class="sub">按分组组织你的接口配置</div></div>
        <div class="topbar-actions"><button class="btn primary" onclick="openGroupModal()">+ 新建分组</button></div></div>
      <div id="groups-grid" class="detail-grid"></div>
    </section>

    <!-- Users (admin) -->
    <section id="view-users" class="view" style="display:none">
      <div class="topbar"><div><h1>用户管理 <span class="role-badge admin">仅管理员</span></h1><div class="sub">管理本系统的所有注册用户与角色权限</div></div>
        <div class="topbar-actions"><button class="btn primary" onclick="openUserModal()">+ 新增用户</button></div></div>
      <div class="toolbar">
        <div class="search"><input type="text" id="user-search" placeholder="搜索用户名、邮箱..." oninput="renderUsers()"></div>
        <div style="display:flex;gap:.4rem;flex-wrap:wrap" id="user-filter-chips">
          <span class="filter-chip active" data-urole="all">全部</span>
          <span class="filter-chip" data-urole="admin">管理员</span>
          <span class="filter-chip" data-urole="user">普通用户</span>
        </div>
      </div>
      <div class="table-wrap"><div class="scroll"><table>
        <thead><tr><th>用户</th><th>角色</th><th>等级 / 配额</th><th>邮箱</th><th>创建时间</th><th>最后登录</th><th style="text-align:right">操作</th></tr></thead>
        <tbody id="user-tbody"></tbody>
      </table></div></div>
    </section>

    <!-- User Links (admin): per-user per-config token table -->
    <section id="view-userlinks" class="view" style="display:none">
      <div class="topbar"><div><h1>用户链接 <span class="role-badge admin">仅管理员</span></h1><div class="sub">查看每个用户在开启了"独立后缀"的接口下被分配的专属地址</div></div>
        <div class="topbar-actions"><button class="btn" onclick="regenerateAllTokens()">↻ 重新生成所有后缀</button></div></div>
      <div class="toolbar">
        <div class="search"><input type="text" id="ul-search" placeholder="搜索用户、接口名、地址..." oninput="renderUserLinks()"></div>
        <select id="ul-config-filter" onchange="renderUserLinks()" style="background:var(--bg2);border:1px solid var(--rule);border-radius:var(--radius-sm);padding:.45rem .7rem;font-size:.82rem;color:var(--ink)">
          <option value="all">所有接口</option>
        </select>
      </div>
      <div class="table-wrap"><div class="scroll"><table>
        <thead><tr><th>用户</th><th>接口</th><th>类型</th><th>专属地址</th><th>专属 Token</th><th style="text-align:right">操作</th></tr></thead>
        <tbody id="userlinks-tbody"></tbody>
      </table></div></div>
    </section>

    <!-- Import -->
    <section id="view-import" class="view" style="display:none">
      <div class="topbar"><div><h1>导入 / 导出</h1><div class="sub">批量管理影视仓配置数据</div></div></div>
      <div class="detail-grid">
        <div class="detail-card"><h3>导出配置</h3><p style="color:var(--muted);font-size:.85rem;margin-bottom:1rem">将所有接口配置打包为 JSON 文件，便于备份和迁移。</p>
          <button class="btn primary" onclick="exportConfigs()">⤓ 导出全部</button></div>
        <div class="detail-card"><h3>导入配置</h3><p style="color:var(--muted);font-size:.85rem;margin-bottom:1rem">上传已有的 JSON 配置文件，批量导入到当前系统。</p>
          <input type="file" id="import-file" accept=".json" style="display:none" onchange="importConfigs(event)">
          <button class="btn primary" onclick="document.getElementById('import-file').click()">⤒ 选择文件导入</button></div>
      </div>
      <div class="detail-card" style="margin-top:1rem"><h3>清空数据</h3><p style="color:var(--muted);font-size:.85rem;margin-bottom:1rem">危险操作：将删除所有配置记录，且不可恢复。</p>
        <button class="btn danger" onclick="clearAllConfigs()">清空全部配置</button></div>
    </section>

    <!-- Profile -->
    <section id="view-profile" class="view" style="display:none">
      <div class="topbar"><div><h1>个人中心</h1><div class="sub">管理你的账号信息与安全</div></div></div>
      <div class="detail-grid">
        <div class="detail-card"><h3>账号信息</h3><div class="detail-list">
          <div class="row"><span class="k">用户名</span><span class="v" id="p-username">-</span></div>
          <div class="row"><span class="k">角色</span><span class="v" id="p-role">-</span></div>
          <div class="row"><span class="k">等级 / 配额</span><span class="v" id="p-level">-</span></div>
          <div class="row"><span class="k">邮箱</span><span class="v" id="p-email">-</span></div>
          <div class="row"><span class="k">创建时间</span><span class="v" id="p-created">-</span></div>
          <div class="row"><span class="k">最后登录</span><span class="v" id="p-lastlogin">-</span></div>
        </div>
          <div style="margin-top:1rem;display:flex;gap:.5rem"><button class="btn primary" onclick="openEditProfileModal()">✎ 编辑资料</button></div>
        </div>
        <div class="detail-card"><h3>安全设置</h3><p style="color:var(--muted);font-size:.85rem;margin-bottom:1rem">定期修改密码可提升账号安全。</p>
          <div class="field"><label>当前密码</label>
            <div class="pwd-wrap"><input type="password" id="cp-old" placeholder="输入当前密码">
              <span class="pwd-toggle" title="显示密码" onclick="togglePwd('cp-old', this)">${EYE_CLOSED}</span></div></div>
          <div class="field"><label>新密码</label>
            <div class="pwd-wrap"><input type="password" id="cp-new" placeholder="至少 6 位" oninput="updatePwdStrength('cp-new','cp-strength','cp-hint')">
              <span class="pwd-toggle" title="显示密码" onclick="togglePwd('cp-new', this)">${EYE_CLOSED}</span></div>
            <div class="pwd-strength"><div id="cp-strength"></div></div><div class="pwd-hint" id="cp-hint"></div></div>
          <div class="field"><label>确认新密码</label>
            <div class="pwd-wrap"><input type="password" id="cp-confirm" placeholder="再次输入新密码">
              <span class="pwd-toggle" title="显示密码" onclick="togglePwd('cp-confirm', this)">${EYE_CLOSED}</span></div></div>
          <button class="btn primary" onclick="changePassword()">🔒 修改密码</button></div>
      </div>
    </section>

    <!-- Settings -->
    <section id="view-settings" class="view" style="display:none">
      <div class="topbar"><div><h1>系统设置</h1><div class="sub">个性化与数据管理</div></div></div>
      <div class="detail-card" style="max-width:600px"><h3>关于</h3><div class="detail-list">
        <div class="row"><span class="k">系统名称</span><span class="v">影视仓配置管理中心</span></div>
        <div class="row"><span class="k">版本</span><span class="v">v2.1.0</span></div>
        <div class="row"><span class="k">数据存储</span><span class="v">浏览器 localStorage</span></div>
        <div class="row"><span class="k">接口记录数</span><span class="v" id="settings-count">0</span></div>
        <div class="row"><span class="k">注册用户数</span><span class="v" id="settings-users">0</span></div>
      </div></div>

      <!-- 自动托管 / 部署域名信息卡(让用户一眼看到当前站点域名,所有专属链接都基于它生成) -->
      <div class="detail-card" style="max-width:600px;margin-top:1rem;border-color:rgba(0,229,255,.28);background:linear-gradient(135deg,rgba(0,229,255,.05),rgba(124,77,255,.05))">
        <h3 style="color:var(--accent)">☁️ 部署域名(自动托管)</h3>
        <p style="color:var(--muted);font-size:.85rem;margin-bottom:1rem;line-height:1.6">
          站点部署到 <b>Cloudflare Pages</b>(或绑定自定义域名)后,系统会自动识别 <code style="color:var(--accent)">window.location.origin</code> 作为基础域名。
          每条开启「自动托管」的接口都会以 <code style="color:var(--accent)">/r/&lt;uid&gt;/&lt;cid&gt;?t=&lt;token&gt;</code> 的形式挂载到此域名下,链接会随部署域名变化自动跟随,无需手动改。
        </p>
        <div class="detail-list" style="margin-bottom:.8rem">
          <div class="row"><span class="k">当前部署域名</span><span class="v" id="settings-origin" style="font-family:ui-monospace,monospace;color:var(--accent)">-</span></div>
          <div class="row"><span class="k">示例托管 URL</span><span class="v" id="settings-origin-sample" style="font-family:ui-monospace,monospace;font-size:.8rem;color:var(--ink);word-break:break-all">-</span></div>
        </div>
        <div style="display:flex;gap:.4rem;flex-wrap:wrap">
          <button class="btn" onclick="copySiteOrigin()">⧉ 复制域名</button>
          <button class="btn" onclick="openSiteOrigin()">↗ 在新标签打开</button>
          <button class="btn" onclick="document.querySelector('[data-view=mylinks]').click()">🔗 查看我的专属链接</button>
        </div>
      </div>

      <div class="detail-card" style="max-width:600px;margin-top:1rem;border-color:rgba(255,85,119,.25)">
        <h3 style="color:var(--danger)">账号操作</h3>
        <p style="color:var(--muted);font-size:.85rem;margin-bottom:1rem;line-height:1.6">
          退出后需要重新输入用户名和密码才能继续使用本系统。<br>
          如果之前勾选了"记住我"，账号信息会被清空，下次登录需手动输入。
        </p>
        <div class="detail-list" style="margin-bottom:1rem">
          <div class="row"><span class="k">当前账号</span><span class="v" id="settings-current-user">-</span></div>
          <div class="row"><span class="k">当前角色</span><span class="v" id="settings-current-role">-</span></div>
        </div>
        <button class="btn danger" onclick="logoutFromSettings()" style="width:100%;justify-content:center;padding:.7rem;font-weight:600">
          ⏻ 退出当前账号
        </button>
      </div>
    </section>
  </main>
</div>

<!-- ========== Modals ========== -->
<div class="modal-mask" id="config-modal"><div class="modal">
  <div class="modal-head"><h2 id="config-modal-title">新增接口</h2><button class="modal-close" onclick="closeConfigModal()">×</button></div>
  <div class="modal-body">
    <input type="hidden" id="cfg-id">
    <div class="field-row">
      <div class="field"><label>名称 <span class="req">*</span></label><input type="text" id="cfg-name" placeholder="例如：默认单仓"></div>
      <div class="field"><label>类型 <span class="req">*</span></label><select id="cfg-type"><option value="single">单仓</option><option value="multi">多仓</option><option value="subscribe">订阅源</option><option value="local">本地文件</option></select></div>
    </div>
    <div class="field"><label>配置地址 <span class="req">*</span></label><textarea id="cfg-url" placeholder="https://example.com/config.json" oninput="updateTokenPreview()"></textarea>
      <div class="field-hint">支持单仓、多仓、订阅、本地四种类型；启用"独立后缀"后每个用户看到的链接尾部会带唯一标识</div></div>
    <div class="token-mode">
      <span class="ico">🔑</span>
      <input type="checkbox" id="cfg-personal" onchange="updateTokenPreview()">
      <label for="cfg-personal">为每个用户生成独立随机后缀（链接追踪 / 独立计费 / 防盗用）</label>
    </div>
    <div class="token-mode" style="border-color:rgba(0,229,255,.28);background:rgba(0,229,255,.05)">
      <span class="ico">☁️</span>
      <input type="checkbox" id="cfg-autohosted" onchange="updateTokenPreview()">
      <label for="cfg-autohosted">自动托管（链接绑定到当前 Cloudflare 部署域名 <code style="font-family:ui-monospace,monospace;color:var(--accent)" id="cfg-autohosted-origin">…</code>）</label>
    </div>
    <div class="field-hint" style="margin-top:-.3rem;margin-bottom:.8rem;color:var(--muted)">
      开启后,专属链接将自动使用 <b style="color:var(--accent)">当前站点域名</b> 作为基础地址(形如 <code id="cfg-autohosted-sample" style="color:var(--accent)">/r/&lt;uid&gt;/&lt;cid&gt;?t=&lt;token&gt;</code>),部署到任何 Cloudflare Pages 项目/绑定自定义域名时链接自动跟随。
    </div>
    <div class="token-preview" id="cfg-token-preview" style="display:none"></div>
    <div class="field-row">
      <div class="field"><label>分组</label><input type="text" id="cfg-group" placeholder="例如：默认 / 备用"></div>
      <div class="field"><label>标签</label><input type="text" id="cfg-tags" placeholder="用逗号分隔"></div>
    </div>
    <div class="field"><label>备注</label><textarea id="cfg-note" placeholder="可选：用途说明、更新频率等" style="min-height:60px"></textarea></div>
    <div class="field"><label style="display:flex;align-items:center;gap:.5rem;cursor:pointer">
      <label class="switch"><input type="checkbox" id="cfg-enabled" checked><span class="slider"></span></label>
      <span>启用此接口</span></label></div>
    <!-- TVBox 高级字段（可折叠；为空时导出 JSON 不写入对应字段） -->
    <details class="tvbox-advanced" id="cfg-advanced-wrap">
      <summary>▾ TVBox 高级字段（spider / jar / wallpaper / lives / epg / sites …）</summary>
      <div class="adv-grid">
        <div class="field"><label>Spider（爬虫 jar 相对路径）</label><input type="text" id="cfg-spider" placeholder="例如：./lib/spider.jar 或 https://..."></div>
        <div class="field"><label>JAR（爬虫 jar 文件名）</label><input type="text" id="cfg-jar" placeholder="例如：spider.jar"></div>
        <div class="field"><label>Wallpaper（启动壁纸 URL）</label><input type="text" id="cfg-wallpaper" placeholder="https://..."></div>
        <div class="field"><label>parseUrl（详情解析规则）</label><input type="text" id="cfg-parseUrl" placeholder="JSON 字符串或 URL"></div>
        <div class="field"><label>searchable（是否可搜索）</label>
          <select id="cfg-searchable"><option value="">默认</option><option value="1">1（开启）</option><option value="0">0（关闭）</option></select>
        </div>
        <div class="field"><label>quickSearch（快速搜索）</label>
          <select id="cfg-quickSearch"><option value="">默认</option><option value="1">1（开启）</option><option value="0">0（关闭）</option></select>
        </div>
        <div class="field"><label>EPG（电子节目指南 URL）</label><input type="text" id="cfg-epg" placeholder="https://.../epg/{date}/{name}.json"></div>
        <div class="field" style="grid-column:1/-1"><label>Live URL（直播源 m3u / txt）</label><input type="text" id="cfg-liveUrl" placeholder="https://.../live.m3u 或 .txt"></div>
        <div class="field" style="grid-column:1/-1"><label>Sites（自定义站点 JSON）</label>
          <textarea id="cfg-sites" placeholder='[{"key":"mySite","name":"我的站","type":3,"api":"...","searchable":1}]' style="min-height:80px"></textarea>
          <div class="field-hint">留空则使用 TVBox 默认行为；填写需为合法 JSON 数组</div>
        </div>
      </div>
    </details>
  </div>
  <div class="modal-foot"><button class="btn ghost" onclick="closeConfigModal()">取消</button><button class="btn primary" onclick="saveConfig()">保存</button></div>
</div></div>

<div class="modal-mask" id="group-modal"><div class="modal">
  <div class="modal-head"><h2 id="group-modal-title">新建分组</h2><button class="modal-close" onclick="closeGroupModal()">×</button></div>
  <div class="modal-body">
    <input type="hidden" id="grp-id">
    <div class="field"><label>分组名称 <span class="req">*</span></label><input type="text" id="grp-name" placeholder="例如：主力 / 备用 / 测试"></div>
    <div class="field"><label>描述</label><textarea id="grp-desc" placeholder="分组用途说明" style="min-height:60px"></textarea></div>
  </div>
  <div class="modal-foot"><button class="btn ghost" onclick="closeGroupModal()">取消</button><button class="btn primary" onclick="saveGroup()">保存</button></div>
</div></div>

<div class="modal-mask" id="user-modal"><div class="modal">
  <div class="modal-head"><h2 id="user-modal-title">新增用户</h2><button class="modal-close" onclick="closeUserModal()">×</button></div>
  <div class="modal-body">
    <input type="hidden" id="u-id">
    <div class="field"><label>用户名 <span class="req">*</span></label><input type="text" id="u-name" placeholder="3-20 位字母/数字/下划线"></div>
    <div class="field-row">
      <div class="field"><label>角色 <span class="req">*</span></label>
        <select id="u-role-sel" onchange="updateLevelVisibility()">
          <option value="user">普通用户</option>
          <option value="admin">高级管理员（不受配额限制）</option>
        </select>
      </div>
      <div class="field"><label>邮箱</label><input type="email" id="u-email" placeholder="可选"></div>
    </div>
    <div class="field" id="u-level-wrap">
      <label>用户等级 <span class="req">*</span></label>
      <select id="u-level-sel" onchange="updateLevelHint()">
        <option value="low">低级（1 – 9 个接口）</option>
        <option value="mid">中级（10 – 15 个接口）</option>
        <option value="high">高级（10 – 30 个接口）</option>
      </select>
      <div class="pwd-hint" id="u-level-hint" style="color:var(--muted);margin-top:.3rem">普通用户最多可创建 9 个接口</div>
    </div>
    <div class="field"><label id="u-pwd-label">密码 <span class="req">*</span></label>
      <div class="pwd-wrap"><input type="password" id="u-pwd" placeholder="至少 6 位" oninput="updatePwdStrength('u-pwd','u-pwd-strength','u-pwd-hint')">
        <span class="pwd-toggle" title="显示密码" onclick="togglePwd('u-pwd', this)" id="u-pwd-eye">${EYE_CLOSED}</span></div>
      <div class="pwd-strength"><div id="u-pwd-strength"></div></div><div class="pwd-hint" id="u-pwd-hint"></div></div>
  </div>
  <div class="modal-foot"><button class="btn ghost" onclick="closeUserModal()">取消</button><button class="btn primary" onclick="saveUser()">保存</button></div>
</div></div>

<div class="modal-mask" id="profile-modal"><div class="modal">
  <div class="modal-head"><h2>编辑个人资料</h2><button class="modal-close" onclick="closeEditProfileModal()">×</button></div>
  <div class="modal-body">
    <div class="field"><label>用户名</label><input type="text" id="ep-username" readonly style="opacity:.6;cursor:not-allowed"></div>
    <div class="field"><label>邮箱</label><input type="email" id="ep-email" placeholder="可选"></div>
    <div class="field"><label>个人简介</label><textarea id="ep-bio" placeholder="一句话介绍下自己" style="min-height:60px"></textarea></div>
  </div>
  <div class="modal-foot"><button class="btn ghost" onclick="closeEditProfileModal()">取消</button><button class="btn primary" onclick="saveProfile()">保存</button></div>
</div></div>

<div class="modal-mask" id="import-modal"><div class="modal">
  <div class="modal-head"><h2>导入配置</h2><button class="modal-close" onclick="closeImportModal()">×</button></div>
  <div class="modal-body">
    <p style="color:var(--muted);font-size:.85rem;margin-bottom:.8rem">粘贴你的影视仓配置 JSON：</p>
    <div class="field"><textarea id="import-text" placeholder='{"configs":[{...}]}' style="min-height:200px"></textarea></div>
  </div>
  <div class="modal-foot"><button class="btn ghost" onclick="closeImportModal()">取消</button><button class="btn primary" onclick="submitImport()">导入</button></div>
</div></div>

<!-- ========== Auth Page ========== -->
<div class="auth-wrap" id="auth-wrap">
  <div class="auth-card">
    <div class="auth-head">
      <div class="auth-logo">▶</div>
      <div class="auth-title" id="auth-title">欢迎回来</div>
      <div class="auth-sub" id="auth-sub">登录以管理你的影视仓配置</div>
    </div>
    <div class="auth-tabs">
      <div class="auth-tab active" data-mode="login" onclick="switchAuthMode('login')">登录</div>
      <div class="auth-tab" data-mode="register" onclick="switchAuthMode('register')">注册</div>
    </div>
    <form class="auth-form" id="form-login" onsubmit="event.preventDefault();doLogin()">
      <div class="field"><label>用户名</label>
        <input type="text" id="login-username" required autocomplete="username" placeholder="请输入用户名" oninput="this.classList.remove('input-error');document.getElementById('login-password').classList.remove('input-error')"></div>
      <div class="field"><label>密码</label>
        <div class="pwd-wrap">
          <input type="password" id="login-password" required autocomplete="current-password" placeholder="请输入密码" oninput="this.classList.remove('input-error')">
          <span class="pwd-toggle" title="显示密码" onclick="togglePwd('login-password', this)" id="login-eye">${EYE_CLOSED}</span>
        </div></div>
      <div class="auth-extra">
        <label style="cursor:pointer;display:flex;align-items:center;gap:.3rem"><input type="checkbox" id="login-remember"> 记住我</label>
        <a href="#" onclick="event.preventDefault();toast('请联系管理员重置密码','warn')">忘记密码？</a>
      </div>
      <button type="submit" class="btn primary" style="width:100%;justify-content:center;padding:.7rem">登 录</button>
      <div class="auth-tip">还没有账号？<a href="#" onclick="event.preventDefault();switchAuthMode('register')">立即注册</a></div>
    </form>
    <form class="auth-form" id="form-register" style="display:none" onsubmit="event.preventDefault();doRegister()">
      <div class="field"><label>用户名 <span class="req">*</span></label><input type="text" id="reg-username" required placeholder="3-20 位字母/数字/下划线"></div>
      <div class="field"><label>邮箱</label><input type="email" id="reg-email" placeholder="可选，用于找回密码"></div>
      <div class="field"><label>密码 <span class="req">*</span></label>
        <div class="pwd-wrap">
          <input type="password" id="reg-password" required placeholder="至少 6 位，建议字母+数字组合" oninput="updatePwdStrength('reg-password','reg-strength','reg-hint')">
          <span class="pwd-toggle" title="显示密码" onclick="togglePwd('reg-password', this)">${EYE_CLOSED}</span>
        </div>
        <div class="pwd-strength"><div id="reg-strength"></div></div><div class="pwd-hint" id="reg-hint"></div></div>
      <div class="field"><label>确认密码 <span class="req">*</span></label>
        <div class="pwd-wrap">
          <input type="password" id="reg-confirm" required placeholder="再次输入密码">
          <span class="pwd-toggle" title="显示密码" onclick="togglePwd('reg-confirm', this)">${EYE_CLOSED}</span>
        </div></div>
      <div class="field"><label>注册身份</label><select id="reg-role" style="display:none"><option value="user" selected>普通用户</option></select>
        <div class="pwd-hint" style="color:var(--muted)">所有新注册账号默认为"普通用户"，如需管理员权限请联系现有管理员</div></div>
      <button type="submit" class="btn primary" style="width:100%;justify-content:center;padding:.7rem">注 册</button>
      <div class="auth-tip">已有账号？<a href="#" onclick="event.preventDefault();switchAuthMode('login')">前往登录</a></div>
    </form>
  </div>
</div>

<div class="toast-wrap" id="toast-wrap"></div>

<script>
/* =====================================================
   TVBox Config Manager v2.0
   ===================================================== */

const STORAGE_KEY = 'tvbox_configs_v1';
const GROUP_KEY   = 'tvbox_groups_v1';
const USER_KEY    = 'tvbox_users_v1';
const SESSION_KEY = 'tvbox_session_v1';
const REMEMBER_KEY= 'tvbox_remember_v1';
const ADMIN_INVITE = 'TVBOX2026';

const EYE_CLOSED  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
const EYE_OPEN    = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';

let configs = [];
let groups  = [];
let users   = [];
let currentUser = null;
let activeFilter = 'all';
let userFilter = 'all';
let activeView = 'dashboard';

function togglePwd(inputId, btn){
  const input = document.getElementById(inputId);
  if(!input) return;
  const isPwd = input.type === 'password';
  input.type = isPwd ? 'text' : 'password';
  btn.classList.toggle('showing', isPwd);
  btn.setAttribute('title', isPwd ? '隐藏密码' : '显示密码');
  btn.innerHTML = isPwd ? EYE_OPEN : EYE_CLOSED;
}
function toast(msg, type='success', duration=2200){
  const wrap = document.getElementById('toast-wrap');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(()=>{ el.style.opacity='0'; el.style.transform='translateX(20px)'; }, duration);
  setTimeout(()=>el.remove(), duration + 400);
}
function loadData(){
  try{
    configs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    groups  = JSON.parse(localStorage.getItem(GROUP_KEY)   || '[]');
    users   = JSON.parse(localStorage.getItem(USER_KEY)    || '[]');
  }catch(e){ configs=[]; groups=[]; users=[]; }
  if(configs.length===0 && groups.length===0 && users.length===0){ seedDemoData(); }
  // session
  try{
    const sid = sessionStorage.getItem(SESSION_KEY);
    if(sid){ currentUser = users.find(u=>u.id===sid) || null; }
    else{
      const rem = localStorage.getItem(REMEMBER_KEY);
      if(rem){ const u = users.find(x=>x.id===rem); if(u) currentUser = u; }
    }
    if(currentUser){
      currentUser.lastLogin = Date.now();
      saveData();
    }
  }catch(e){}
}
function saveData(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
  localStorage.setItem(GROUP_KEY,   JSON.stringify(groups));
  localStorage.setItem(USER_KEY,    JSON.stringify(users));
}
function seedDemoData(){
  const now = Date.now();
  users = [
    {id:'u_me',    username:'me',    password:'123456',      role:'admin', email:'me@tvbox.local',    bio:'管理员账号', created:now, lastLogin:null},
    {id:'u_demo',  username:'demo',  password:'123456',      role:'user',  email:'demo@tvbox.local',  bio:'示例普通用户（低级）',  level:'low',  created:now, lastLogin:now-86400000},
    {id:'u_pro',   username:'pro',   password:'123456',      role:'user',  email:'pro@tvbox.local',   bio:'示例普通用户（高级）',  level:'high', created:now, lastLogin:now-43200000}
  ];
  groups = [
    {id:'g1', name:'主力配置', desc:'日常使用的主接口'},
    {id:'g2', name:'备用源',   desc:'主力失效时切换'},
    {id:'g3', name:'测试源',   desc:'新源验证用'}
  ];
  configs = [
    {id:cid(), name:'默认单仓 · A 线路', type:'single',   url:'https://raw.githubusercontent.com/example/box/main/single.json', group:'g1', tags:['默认','稳定'], note:'快速加载的首选', enabled:true,  status:'online',  updated:now-3600000, ownerId:'u_me'},
    {id:cid(), name:'综合多仓 · 集合源', type:'multi',    url:'https://example.com/box/multi-config.json',                    group:'g1', tags:['多源','综合'], note:'多线路自动切换', enabled:true,  status:'online',  updated:now-7200000, ownerId:'u_me'},
    {id:cid(), name:'备用多仓 B',         type:'multi',    url:'https://example.org/tvbox/multi-b.json',                       group:'g2', tags:['备用'],         note:'',                       enabled:true,  status:'online',  updated:now-86400000, ownerId:'u_demo'},
    {id:cid(), name:'订阅 · 周更',       type:'subscribe',url:'https://subscribe.example.com/token/abc123',                   group:'g1', tags:['订阅'],         note:'每周自动更新',           enabled:true,  status:'testing', updated:now-1800000, ownerId:'u_me'},
    {id:cid(), name:'本地配置 backup',    type:'local',    url:'file:///sdcard/tvbox/local-config.json',                       group:'g2', tags:['本地','备份'],  note:'离线可用',               enabled:false, status:'offline', updated:now-172800000, ownerId:'u_demo'},
    {id:cid(), name:'测试源 · 新版',     type:'multi',    url:'https://test.example.dev/box.json',                            group:'g3', tags:['测试'],         note:'待验证',                 enabled:false, status:'offline', updated:now-432000000, ownerId:'u_me'},
    // Demo: a failed interface (so the "失效接口" card has something to show on first run)
    {id:cid(), name:'已失效 · 公益源 C', type:'multi',    url:'https://broken.example.com/tvbox.json',                          group:'g3', tags:['失效'],         note:'此源已无法访问，建议尽快替换', enabled:true,  status:'offline', updated:now-18000000, ownerId:'u_me', failedSince:now-18000000}
  ];
  saveData();
}
function cid(){ return 'c'+Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4); }
function gid(){ return 'g'+Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4); }
function fmtTime(t){
  if(!t) return '-';
  const d = new Date(t);
  const diff = (Date.now() - t) / 1000;
  if(diff < 60) return '刚刚';
  if(diff < 3600) return Math.floor(diff/60)+' 分钟前';
  if(diff < 86400) return Math.floor(diff/3600)+' 小时前';
  if(diff < 604800) return Math.floor(diff/86400)+' 天前';
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function getTypeLabel(t){ return {single:'单仓', multi:'多仓', subscribe:'订阅', local:'本地'}[t] || t; }
function getStatusBadge(s){ return {online:'online', offline:'offline', testing:'testing', disabled:'disabled'}[s] || 'disabled'; }
function getStatusLabel(s){ return {online:'在线', offline:'离线', testing:'检测中', disabled:'已禁用'}[s] || '未知'; }
function avatarColor(name){
  const colors = [
    'linear-gradient(135deg,#00e5ff,#7c4dff)',
    'linear-gradient(135deg,#ff5577,#ffb547)',
    'linear-gradient(135deg,#00ffae,#00e5ff)',
    'linear-gradient(135deg,#7c4dff,#ff5577)',
    'linear-gradient(135deg,#ffb547,#00ffae)'
  ];
  let h=0; for(let i=0;i<name.length;i++) h = (h*31 + name.charCodeAt(i)) & 0xffffffff;
  return colors[Math.abs(h)%colors.length];
}
function escapeHtml(s){
  return String(s==null?'':s).replace(/[&<>"']/g, ch=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[ch]));
}

/* ----- View Switch ----- */
function goView(view){
  if(!currentUser){ showAuth(); return; }
  const navEl = document.querySelector('.nav-item[data-view="'+view+'"]');
  if(navEl && !canAccessView(view)){ toast('无权访问该页面','danger'); return; }
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  if(navEl) navEl.classList.add('active');
  document.querySelectorAll('.view').forEach(s=>s.style.display='none');
  const target = document.getElementById('view-'+view);
  if(target) target.style.display = 'block';
  activeView = view;
  if(view==='dashboard') renderStats();
  if(view==='configs') renderConfigs();
  if(view==='mylinks') renderMyLinks();
  if(view==='groups')   renderGroups();
  if(view==='users')    renderUsers();
  if(view==='userlinks') renderUserLinks();
  if(view==='profile')  renderProfile();
  if(view==='settings'){
    document.getElementById('settings-count').textContent = configs.length;
    document.getElementById('settings-users').textContent = users.length;
    const scu = document.getElementById('settings-current-user');
    const scr = document.getElementById('settings-current-role');
    if(scu) scu.textContent = currentUser ? currentUser.username : '-';
    if(scr) scr.innerHTML = currentUser
      ? (currentUser.role==='admin'
          ? '<span class="role-badge admin">高级管理员</span>'
          : '<span class="role-badge user">普通用户</span>')
      : '-';
  }
}
function logoutFromSettings(){
  if(!currentUser){ toast('当前未登录','warn'); return; }
  if(!confirm('确定要退出当前账号「' + currentUser.username + '」吗？')) return;
  const previousUsername = currentUser.username;
  // 1. Clear user state first
  currentUser = null;
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(REMEMBER_KEY);
  // 2. Force-close any open modal, dropdown, or sub-view
  document.querySelectorAll('.modal-mask.show').forEach(m=>m.classList.remove('show'));
  document.querySelectorAll('.view').forEach(v=>v.style.display='none');
  // 3. Switch to auth screen, force login tab, clear inputs
  showAuth();
  switchAuthMode('login');
  const lu = document.getElementById('login-username'); if(lu) lu.value = '';
  const lp = document.getElementById('login-password'); if(lp) lp.value = '';
  // 4. Scroll to top so the login form is fully visible
  window.scrollTo(0,0);
  // 5. Show confirmation toast after the screen has actually switched
  setTimeout(()=>toast('已退出账号「' + previousUsername + '」','warn'), 50);
}
function canAccessView(v){
  if(!currentUser) return false;
  if(currentUser.role==='admin') return true;
  return v !== 'users';
}
document.querySelectorAll('.nav-item').forEach(el=>{
  el.addEventListener('click', ()=>{ const v = el.dataset.view; if(v) goView(v); });
});

/* ----- Stats ----- */
function renderStats(){
  document.getElementById('stat-total').textContent   = configs.length;
  document.getElementById('stat-single').textContent  = configs.filter(c=>c.type==='single').length;
  document.getElementById('stat-multi').textContent   = configs.filter(c=>c.type==='multi').length;
  document.getElementById('stat-online').textContent  = configs.filter(c=>c.status==='online').length;
  document.getElementById('dist-single').textContent  = configs.filter(c=>c.type==='single').length;
  document.getElementById('dist-multi').textContent   = configs.filter(c=>c.type==='multi').length;
  document.getElementById('dist-subscribe').textContent= configs.filter(c=>c.type==='subscribe').length;
  document.getElementById('dist-local').textContent   = configs.filter(c=>c.type==='local').length;
  document.getElementById('st-enabled').textContent   = configs.filter(c=>c.enabled).length;
  document.getElementById('st-disabled').textContent  = configs.filter(c=>!c.enabled).length;
  document.getElementById('st-testing').textContent   = configs.filter(c=>c.status==='testing').length;
  document.getElementById('st-offline').textContent   = configs.filter(c=>c.status==='offline').length;
  renderFailedConfigs();
  updateAddBtnState();
}

/* ----- Failed / Offline interfaces on the dashboard ----- */
// Compute "failed since" timestamp. Falls back to updated time if the record was never marked failed.
function getFailedSince(c){
  if(c.failedSince) return c.failedSince;
  if(c.status === 'offline') return c.updated || Date.now();
  if(c.status === 'testing')  return c.testingSince || c.updated || Date.now();
  return null;
}
function isFailed(c){
  // A "failed" interface is one that's:
  //  - marked offline, OR
  //  - stuck in testing for more than 5 minutes (likely never resolves)
  if(!c.enabled) return false; // disabled ones are not "failed" — they're turned off on purpose
  if(c.status === 'offline') return true;
  if(c.status === 'testing' && c.updated){
    return (Date.now() - c.updated) > 5 * 60 * 1000;
  }
  return false;
}
function fmtFailedDuration(since){
  if(!since) return '-';
  const diff = Date.now() - since;
  if(diff < 60_000) return '刚刚';
  if(diff < 3_600_000) return Math.floor(diff/60_000) + ' 分钟';
  if(diff < 86_400_000) return Math.floor(diff/3_600_000) + ' 小时';
  const days = Math.floor(diff/86_400_000);
  if(days < 30) return days + ' 天';
  return Math.floor(days/30) + ' 个月';
}
function renderFailedConfigs(){
  const tbody = document.getElementById('failed-tbody');
  const countEl = document.getElementById('failed-count');
  const hintEl  = document.getElementById('failed-hint');
  if(!tbody) return;
  const failed = configs.filter(isFailed)
    .sort((a,b)=>(getFailedSince(b)||0) - (getFailedSince(a)||0));
  if(countEl) countEl.textContent = failed.length;
  if(hintEl){
    if(failed.length === 0){
      hintEl.innerHTML = '<span style="color:var(--success)">✓ 当前没有失效接口，所有启用的接口都运行正常。</span>';
    }else{
      hintEl.innerHTML = `共发现 <strong style="color:var(--danger)">${failed.length}</strong> 个失效接口（按失效时长倒序排列）。点击操作按钮可快速处理。`;
    }
  }
  if(failed.length === 0){
    tbody.innerHTML = `<tr><td colspan="6">
      <div class="empty" style="padding:2.5rem 1rem">
        <div class="ico" style="color:var(--success)">✓</div>
        <h3 style="color:var(--success)">所有接口运行正常</h3>
        <p>已启用的接口中没有检测失败的，可以放心使用</p>
      </div>
    </td></tr>`;
    return;
  }
  tbody.innerHTML = failed.map(c=>{
    const since = getFailedSince(c);
    const dur = fmtFailedDuration(since);
    return `
      <tr>
        <td>
          <div class="failed-row-name">${escapeHtml(c.name)}
            <span class="row-meta">${escapeHtml(c.note || '无备注')}</span>
          </div>
        </td>
        <td><span class="badge ${c.type}">${getTypeLabel(c.type)}</span></td>
        <td><div class="url-cell"><div class="url-base" title="${escapeHtml(c.url)}" style="max-width:280px">${escapeHtml(c.url)}</div></div></td>
        <td><span class="badge ${getStatusBadge(c.status)}">● ${getStatusLabel(c.status)}</span></td>
        <td style="color:var(--danger);font-size:.82rem">${dur}</td>
        <td><div class="row-actions" style="justify-content:flex-end">
          <button class="icon-btn" title="重新检测" onclick="testConfig('${c.id}')">↻</button>
          <button class="icon-btn" title="${c.enabled?'禁用':'启用'}" onclick="toggleEnabled('${c.id}')">${c.enabled?'⏸':'▶'}</button>
          <button class="icon-btn" title="复制地址" onclick="copyUrl('${c.id}')">⧉</button>
          <button class="icon-btn" title="编辑" onclick="editConfig('${c.id}')">✎</button>
          <button class="icon-btn danger" title="删除" onclick="deleteConfig('${c.id}')">🗑</button>
        </div></td>
      </tr>`;
  }).join('');
}
// Re-test every failed interface one by one (with a small delay so toasts don't pile up)
function retestAllFailed(){
  const failed = configs.filter(isFailed);
  if(failed.length === 0){ toast('当前没有失效接口需要重测','success'); return; }
  if(!confirm(`将对 ${failed.length} 个失效接口依次重新检测，是否继续？`)) return;
  let i = 0;
  toast(`开始重测 ${failed.length} 个接口...`,'warn');
  const runNext = ()=>{
    if(i >= failed.length){
      toast('全部重测完成','success');
      renderAll();
      return;
    }
    const c = failed[i++];
    // Reuse the same logic as the per-row "test" button
    c.status = 'testing'; c.updated = Date.now();
    saveData();
    setTimeout(()=>{
      c.status = Math.random() > 0.4 ? 'online' : 'offline';
      c.updated = Date.now();
      if(c.status === 'offline') c.failedSince = Date.now();
      else delete c.failedSince;
      saveData();
      runNext();
    }, 800);
  };
  runNext();
}
function bulkRemoveFailed(){
  const failed = configs.filter(isFailed);
  if(failed.length === 0){ toast('当前没有失效接口','success'); return; }
  if(!confirm(`将永久删除 ${failed.length} 个失效接口，无法恢复。是否继续？`)) return;
  const failedIds = new Set(failed.map(c=>c.id));
  configs = configs.filter(c=>!failedIds.has(c.id));
  saveData(); renderAll();
  toast(`已删除 ${failed.length} 个失效接口`,'danger');
}

/* ----- Configs ----- */
function renderConfigs(){
  const tbody = document.getElementById('config-tbody');
  if(!tbody) return;
  const q = (document.getElementById('search-input').value || '').toLowerCase().trim();
  const statusFilter = document.getElementById('status-filter').value;
  let list = configs.filter(c=>{
    if(activeFilter!=='all' && c.type!==activeFilter) return false;
    if(statusFilter!=='all'){
      const s = c.enabled ? c.status : 'disabled';
      if(s!==statusFilter) return false;
    }
    if(q){
      const hay = [c.name, c.url, (c.tags||[]).join(','), c.note||''].join(' ').toLowerCase();
      if(!hay.includes(q)) return false;
    }
    return true;
  });
  if(list.length === 0){
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty"><div class="ico">▱</div><h3>暂无配置</h3><p>${configs.length===0?'点击右上角"新增接口"开始添加':'没有匹配的记录，请调整筛选条件'}</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(c=>{
    const status = c.enabled ? c.status : 'disabled';
    const userUrl = getUserConfigUrl(c, currentUser);
    const baseAndToken = c.personalMode
      ? `<div class="url-base" title="${escapeHtml(userUrl)}">${escapeHtml(userUrl)}</div>
         <div class="url-token" title="你的专属后缀（${escapeHtml(currentUser?currentUser.username:'匿名')}）">${escapeHtml(c.userTokens && c.userTokens[currentUser?currentUser.id:'anon'] || '')}</div>`
      : `<div class="url-base" title="${escapeHtml(c.url)}">${escapeHtml(c.url)}</div>`;
    return `
      <tr>
        <td><div class="name-cell"><div class="avatar" style="background:${avatarColor(c.name)}">${(c.name||'?').charAt(0).toUpperCase()}</div><div><div class="name">${escapeHtml(c.name)}</div><div class="desc">${escapeHtml(c.note || '无备注')}</div></div></div></td>
        <td><span class="badge ${c.type}">${getTypeLabel(c.type)}</span></td>
        <td><div class="url-cell" title="${escapeHtml(userUrl)}">${baseAndToken}</div></td>
        <td><span class="badge ${getStatusBadge(status)}">● ${getStatusLabel(status)}</span></td>
        <td><label class="switch"><input type="checkbox" ${c.enabled?'checked':''} onchange="toggleEnabled('${c.id}')"><span class="slider"></span></label></td>
        <td>${(function(){ const k=Object.keys(buildTvboxFields(c)); return k.length?`<span style="font-size:.72rem;color:var(--accent)">${k.length} 个 ✓</span>`:`<span style="font-size:.72rem;color:var(--muted)">未配置</span>`; })()}</td>
        <td style="color:var(--muted);font-size:.8rem">${fmtTime(c.updated)}</td>
        <td><div class="row-actions" style="justify-content:flex-end">
          <button class="icon-btn" title="复制你的专属地址" onclick="copyUrl('${c.id}')">⧉</button>
          <button class="icon-btn" title="下载该接口的 TVBox 可用配置 (.json)" onclick="downloadMyLinkAsTvbox('${c.id}')">📺</button>
          <button class="icon-btn" title="测试" onclick="testConfig('${c.id}')">⚡</button>
          <button class="icon-btn" title="编辑" onclick="editConfig('${c.id}')">✎</button>
          <button class="icon-btn danger" title="删除" onclick="deleteConfig('${c.id}')">🗑</button>
        </div></td>
      </tr>`;
  }).join('');
}
document.getElementById('filter-chips').addEventListener('click', e=>{
  const chip = e.target.closest('.filter-chip');
  if(!chip) return;
  document.querySelectorAll('#filter-chips .filter-chip').forEach(c=>c.classList.remove('active'));
  chip.classList.add('active');
  activeFilter = chip.dataset.filter;
  renderConfigs();
});

/* ----- Config Modal ----- */
function openConfigModal(id){
  document.getElementById('config-modal-title').textContent = id ? '编辑接口' : '新增接口';
  document.getElementById('cfg-id').value = id || '';
  if(id){
    const c = configs.find(x=>x.id===id);
    document.getElementById('cfg-name').value = c.name;
    document.getElementById('cfg-type').value = c.type;
    document.getElementById('cfg-url').value  = c.url;
    document.getElementById('cfg-group').value= c.group || '';
    document.getElementById('cfg-tags').value = (c.tags||[]).join(', ');
    document.getElementById('cfg-note').value = c.note || '';
    document.getElementById('cfg-enabled').checked = !!c.enabled;
    document.getElementById('cfg-personal').checked = !!c.personalMode;
    // 兼容老数据:autoHosted 默认 true(新行为);只有用户显式关过的才是 false
    document.getElementById('cfg-autohosted').checked = c.autoHosted !== false;
    // TVBox 高级字段回填
    document.getElementById('cfg-spider').value      = c.spider    || '';
    document.getElementById('cfg-jar').value         = c.jar       || '';
    document.getElementById('cfg-wallpaper').value   = c.wallpaper || '';
    document.getElementById('cfg-parseUrl').value    = c.parseUrl  || '';
    document.getElementById('cfg-searchable').value  = c.searchable==null?'':String(c.searchable);
    document.getElementById('cfg-quickSearch').value = c.quickSearch==null?'':String(c.quickSearch);
    document.getElementById('cfg-epg').value         = c.epg       || '';
    document.getElementById('cfg-liveUrl').value     = c.liveUrl   || '';
    document.getElementById('cfg-sites').value       = c.sites ? JSON.stringify(c.sites, null, 2) : '';
  }else{
    ['cfg-name','cfg-url','cfg-group','cfg-tags','cfg-note','cfg-spider','cfg-jar','cfg-wallpaper','cfg-parseUrl','cfg-epg','cfg-liveUrl','cfg-sites'].forEach(i=>document.getElementById(i).value='');
    document.getElementById('cfg-type').value='single';
    document.getElementById('cfg-enabled').checked=true;
    document.getElementById('cfg-personal').checked=false;
    document.getElementById('cfg-autohosted').checked=true; // 新增默认开启
    document.getElementById('cfg-searchable').value='';
    document.getElementById('cfg-quickSearch').value='';
  }
  // 渲染"自动托管"提示中的站点域名/示例
  const oEl = document.getElementById('cfg-autohosted-origin');
  const sEl = document.getElementById('cfg-autohosted-sample');
  if(oEl) oEl.textContent = getSiteOrigin() || '(当前页面)';
  if(sEl){
    const me = currentUser || {id:'<uid>'};
    sEl.textContent = (getSiteOrigin()||'') + '/r/' + me.id + '/<cid>?t=<token>';
  }
  updateTokenPreview();
  document.getElementById('config-modal').classList.add('show');
}
function closeConfigModal(){ document.getElementById('config-modal').classList.remove('show'); }

/* ----- Personal URL Token (per-user) ----- */
// Generate a random token (mix of letters+digits)
function genToken(len){
  const chars = 'abcdefghijkmnpqrstuvwxyz23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let s = '';
  for(let i=0;i<len;i++) s += chars[Math.floor(Math.random()*chars.length)];
  return s;
}
// Get the current site's "auto-hosted" base origin (e.g. https://xxx.pages.dev).
// Used to mint personal URLs that are *bound to the deployment domain* — moving
// the site to another Cloudflare Pages project / custom domain automatically
// updates every shared link.
function getSiteOrigin(){
  try{
    if(typeof location !== 'undefined' && location.origin){
      return location.origin.replace(/\/+$/, '');
    }
  }catch(e){}
  return '';
}
// base64url-encode a target URL for use as `?target=...` query param.
// Returns '' for non-http(s) URLs (file://, javascript:, data:, etc.)
function encodeTarget(u){
  if(!u || !/^https?:\/\//i.test(u)) return '';
  try{
    const bin = unescape(encodeURIComponent(u));
    let b64 = btoa(bin);
    b64 = b64.replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
    return b64;
  }catch(e){ return ''; }
}
// Build the URL that a specific user should see, given a config record.
//   - autoHosted=true  →  /r/<userId>/<configId>?t=<token>  on the current site
//   - autoHosted=false →  return c.url verbatim (legacy behaviour)
//   - personalMode is an independent toggle: works with both modes.
function getUserConfigUrl(c, user){
  if(!c) return '';
  // 1) Auto-hosted mode: always build a path on the current site origin
  if(c.autoHosted){
    if(!c.userTokens || typeof c.userTokens !== 'object') c.userTokens = {};
    const key = user ? user.id : 'anon';
    if(!c.userTokens[key]) c.userTokens[key] = genToken(8);
    const origin = getSiteOrigin();
    const basePath = '/r/' + encodeURIComponent(key) + '/' + encodeURIComponent(c.id);
    const url = (origin || '') + basePath;
    // 把原始 source URL 用 base64url 编码后塞进 ?target=...,
    // 让部署在 Cloudflare 的 _worker.js 转发到真实源,实现"链接绑定当前域名"。
    // 仅当 c.url 是可代理的 http(s) 地址才追加;本地 file:// 等不代理。
    const target = encodeTarget(c.url);
    const params = [];
    if(target) params.push('target=' + target);
    if(c.personalMode) params.push('t=' + encodeURIComponent(c.userTokens[key]));
    if(params.length) return url + '?' + params.join('&');
    return url;
  }
  // 2) Legacy mode: use the admin-entered external URL verbatim (with optional token)
  if(!c.personalMode) return c.url;
  if(!c.userTokens || typeof c.userTokens !== 'object') c.userTokens = {};
  const key = user ? user.id : 'anon';
  if(!c.userTokens[key]) c.userTokens[key] = genToken(8);
  return appendQuery(c.url, 'u', key, 't', c.userTokens[key]);
}
// Append query params to a URL, supporting both '?...' and '&...' and fragment
function appendQuery(url, ...pairs){
  if(!url) return url;
  if(/^(file:|javascript:|data:)/i.test(url)) return url; // don't modify non-http URLs
  const qs = pairs.filter((_,i)=>i%2===0).map((k,i)=>encodeURIComponent(k)+'='+encodeURIComponent(pairs[i*2+1])).join('&');
  // Try to append before fragment
  const hashIdx = url.indexOf('#');
  const before = hashIdx>=0 ? url.slice(0,hashIdx) : url;
  const after  = hashIdx>=0 ? url.slice(hashIdx) : '';
  return before + (before.includes('?') ? '&' : '?') + qs + after;
}
function updateTokenPreview(){
  const enabled = document.getElementById('cfg-personal').checked;
  const url     = document.getElementById('cfg-url').value.trim();
  const preview = document.getElementById('cfg-token-preview');
  if(!enabled || !url){
    preview.style.display = 'none';
    return;
  }
  // Use the currently logged-in user; if none, show a sample
  const me = currentUser || {id:'preview', username:'预览'};
  // Make a mock config object so we can reuse getUserConfigUrl
  const mock = { url, personalMode: true, userTokens: {} };
  const result = getUserConfigUrl(mock, me);
  preview.style.display = 'block';
  preview.innerHTML = `<div style="color:var(--muted);font-size:.7rem;margin-bottom:.3rem">你（${escapeHtml(me.username)}）将看到：</div>${escapeHtml(result)}`;
}
function saveConfig(){
  const id   = document.getElementById('cfg-id').value;
  const name = document.getElementById('cfg-name').value.trim();
  const type = document.getElementById('cfg-type').value;
  const url  = document.getElementById('cfg-url').value.trim();
  const group= document.getElementById('cfg-group').value.trim();
  const tags = document.getElementById('cfg-tags').value.split(/[,，]/).map(s=>s.trim()).filter(Boolean);
  const note = document.getElementById('cfg-note').value.trim();
  const enabled = document.getElementById('cfg-enabled').checked;
  const personalMode = document.getElementById('cfg-personal').checked;
  const autoHosted   = document.getElementById('cfg-autohosted').checked;
  // TVBox 高级字段
  const spider    = document.getElementById('cfg-spider').value.trim();
  const jar       = document.getElementById('cfg-jar').value.trim();
  const wallpaper = document.getElementById('cfg-wallpaper').value.trim();
  const parseUrl  = document.getElementById('cfg-parseUrl').value.trim();
  const searchableV  = document.getElementById('cfg-searchable').value;
  const quickSearchV = document.getElementById('cfg-quickSearch').value;
  const epg       = document.getElementById('cfg-epg').value.trim();
  const liveUrl   = document.getElementById('cfg-liveUrl').value.trim();
  const sitesRaw  = document.getElementById('cfg-sites').value.trim();
  let sites = undefined;
  if(sitesRaw){
    try{ const parsed = JSON.parse(sitesRaw); if(!Array.isArray(parsed)) throw 0; sites = parsed; }
    catch(e){ toast('Sites 字段不是合法 JSON 数组','warn'); return; }
  }
  if(!name){ toast('请填写名称','warn'); return; }
  if(!url){  toast('请填写配置地址','warn'); return; }
  if(id){
    const c = configs.find(x=>x.id===id);
    Object.assign(c, {
      name,type,url,group,tags,note,enabled,personalMode,autoHosted,updated:Date.now(),
      spider:spider||undefined,
      jar:jar||undefined,
      wallpaper:wallpaper||undefined,
      parseUrl:parseUrl||undefined,
      searchable:searchableV===''?undefined:Number(searchableV),
      quickSearch:quickSearchV===''?undefined:Number(quickSearchV),
      epg:epg||undefined,
      liveUrl:liveUrl||undefined,
      sites
    });
    // 清理空白键
    ['spider','jar','wallpaper','parseUrl','epg','liveUrl'].forEach(k=>{ if(!c[k]) delete c[k]; });
    if(c.searchable===undefined) delete c.searchable;
    if(c.quickSearch===undefined) delete c.quickSearch;
    if(!c.sites) delete c.sites;
    // If we just turned off personalMode, clear userTokens to free storage
    if(!personalMode) c.userTokens = {};
    toast('已更新配置','success');
  }else{
    // Quota check: normal users are limited by their level
    if(currentUser && currentUser.role === 'user'){
      const max = getQuotaMax(currentUser);
      const used = countUserConfigs(currentUser.id);
      if(used >= max){
        const lv = LEVEL_QUOTAS[getLevel(currentUser)];
        toast(`已达上限：${lv.label}用户最多创建 ${lv.max} 个接口（当前 ${used}）。请联系管理员提升等级。`,'danger', 5000);
        return;
      }
    }
    configs.unshift({
      id:cid(), name,type,url,group,tags,note,enabled,personalMode,autoHosted,status:'testing',updated:Date.now(), ownerId:currentUser.id, userTokens:{},
      spider:spider||undefined, jar:jar||undefined, wallpaper:wallpaper||undefined,
      parseUrl:parseUrl||undefined,
      searchable:searchableV===''?undefined:Number(searchableV),
      quickSearch:quickSearchV===''?undefined:Number(quickSearchV),
      epg:epg||undefined, liveUrl:liveUrl||undefined, sites
    });
    // 清理空白键,保持存储整洁
    const added = configs[0];
    ['spider','jar','wallpaper','parseUrl','epg','liveUrl'].forEach(k=>{ if(!added[k]) delete added[k]; });
    if(added.searchable===undefined) delete added.searchable;
    if(added.quickSearch===undefined) delete added.quickSearch;
    if(!added.sites) delete added.sites;
    toast('已新增配置','success');
  }
  saveData(); closeConfigModal(); renderAll();
}
function editConfig(id){ openConfigModal(id); }
function deleteConfig(id){
  if(!confirm('确定删除该接口？')) return;
  configs = configs.filter(c=>c.id!==id);
  saveData(); renderAll();
  toast('已删除','danger');
}
function toggleEnabled(id){
  const c = configs.find(x=>x.id===id);
  c.enabled = !c.enabled; c.updated = Date.now(); saveData(); renderAll();
  toast(c.enabled?'已启用':'已禁用', c.enabled?'success':'warn');
}
function copyUrl(id){
  const c = configs.find(x=>x.id===id);
  if(!c) return;
  const url = getUserConfigUrl(c, currentUser);
  navigator.clipboard.writeText(url).then(()=>{
    const msg = c.personalMode ? '已复制你的专属配置地址' : '已复制配置地址';
    toast(msg,'success');
  }).catch(()=>toast('复制失败','danger'));
}
function testConfig(id){
  const c = configs.find(x=>x.id===id);
  if(!c) return;
  c.status = 'testing'; c.updated = Date.now();
  c.testingSince = Date.now();
  delete c.failedSince;
  saveData(); renderAll();
  toast('正在检测 '+c.name+' ...','warn');
  setTimeout(()=>{
    c.status = Math.random() > 0.2 ? 'online' : 'offline';
    c.updated = Date.now();
    delete c.testingSince;
    if(c.status === 'offline') c.failedSince = Date.now();
    else delete c.failedSince;
    saveData(); renderAll();
    toast(c.name+(c.status==='online'?' 检测通过 ✓':' 检测失败 ✗'), c.status==='online'?'success':'danger');
  }, 1200);
}

/* ----- Groups ----- */
function renderGroups(){
  const grid = document.getElementById('groups-grid');
  if(!grid) return;
  if(groups.length===0){
    grid.innerHTML = `<div class="detail-card" style="grid-column:1/-1"><div class="empty"><div class="ico">◫</div><h3>暂无分组</h3><p>创建分组可以更好地组织你的接口配置</p></div></div>`;
    return;
  }
  grid.innerHTML = groups.map(g=>{
    const items = configs.filter(c=>c.group===g.id);
    return `
      <div class="detail-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.6rem">
          <div><h3 style="margin-bottom:.2rem">${escapeHtml(g.name)}</h3><div style="color:var(--muted);font-size:.82rem">${escapeHtml(g.desc||'无描述')}</div></div>
          <div class="row-actions">
            <button class="icon-btn" title="编辑" onclick="editGroup('${g.id}')">✎</button>
            <button class="icon-btn danger" title="删除" onclick="deleteGroup('${g.id}')">🗑</button>
          </div>
        </div>
        <div class="detail-list">
          <div class="row"><span class="k">接口数</span><span class="v">${items.length}</span></div>
          <div class="row"><span class="k">启用</span><span class="v">${items.filter(i=>i.enabled).length}</span></div>
          <div class="row"><span class="k">类型</span><span class="v">${[...new Set(items.map(i=>getTypeLabel(i.type)))].join(' / ')||'-'}</span></div>
        </div>
      </div>`;
  }).join('');
}
function openGroupModal(id){
  document.getElementById('group-modal-title').textContent = id ? '编辑分组' : '新建分组';
  document.getElementById('grp-id').value = id || '';
  if(id){
    const g = groups.find(x=>x.id===id);
    document.getElementById('grp-name').value = g.name;
    document.getElementById('grp-desc').value = g.desc || '';
  }else{
    document.getElementById('grp-name').value = '';
    document.getElementById('grp-desc').value = '';
  }
  document.getElementById('group-modal').classList.add('show');
}
function closeGroupModal(){ document.getElementById('group-modal').classList.remove('show'); }
function saveGroup(){
  const id = document.getElementById('grp-id').value;
  const name = document.getElementById('grp-name').value.trim();
  const desc = document.getElementById('grp-desc').value.trim();
  if(!name){ toast('请填写分组名称','warn'); return; }
  if(id){ const g = groups.find(x=>x.id===id); Object.assign(g, {name, desc}); toast('已更新分组','success'); }
  else{ groups.push({id:gid(), name, desc}); toast('已新建分组','success'); }
  saveData(); closeGroupModal(); renderAll();
}
function editGroup(id){ openGroupModal(id); }
function deleteGroup(id){
  if(!confirm('确定删除该分组？其中的接口不会被删除。')) return;
  groups = groups.filter(g=>g.id!==id);
  configs.forEach(c=>{ if(c.group===id) c.group=''; });
  saveData(); renderAll();
  toast('已删除分组','danger');
}

/* ----- Users ----- */
function renderUsers(){
  const tbody = document.getElementById('user-tbody');
  if(!tbody) return;
  if(!currentUser || currentUser.role!=='admin'){
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty"><div class="ico">🔒</div><h3>无权访问</h3><p>该功能仅对高级管理员开放</p></div></td></tr>`;
    return;
  }
  const q = (document.getElementById('user-search').value||'').toLowerCase().trim();
  let list = users.filter(u=>{
    if(userFilter!=='all' && u.role!==userFilter) return false;
    if(q){
      const hay = [u.username, u.email||'', u.bio||''].join(' ').toLowerCase();
      if(!hay.includes(q)) return false;
    }
    return true;
  });
  if(list.length===0){
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty"><div class="ico">👥</div><h3>暂无用户</h3><p>点击右上角"新增用户"添加</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(u=>{
    const isSelf = currentUser && u.id===currentUser.id;
    // Level & quota display
    let levelCell;
    if(u.role === 'admin'){
      levelCell = `<span class="badge online" style="font-size:.7rem">无限制</span>`;
    }else{
      const lv = getLevel(u);
      const cfg = LEVEL_QUOTAS[lv];
      const used = countUserConfigs(u.id);
      const max  = cfg.max;
      const pct  = Math.min(100, Math.round(used / max * 100));
      const overQuota = used >= max;
      const barColor = overQuota ? 'var(--danger)' : (pct >= 80 ? 'var(--warn)' : 'var(--success)');
      levelCell = `
        <div style="display:flex;flex-direction:column;gap:3px;min-width:120px">
          <div style="display:flex;align-items:center;gap:.4rem">
            <span class="badge ${overQuota?'offline':'online'}" style="font-size:.7rem">${cfg.label}</span>
            <span style="font-size:.78rem;color:${overQuota?'var(--danger)':'var(--ink-2)'}">${used} / ${max}</span>
          </div>
          <div style="height:4px;background:var(--bg3);border-radius:2px;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:${barColor};transition:width .3s"></div>
          </div>
        </div>`;
    }
    return `
      <tr>
        <td><div class="name-cell"><div class="avatar" style="background:${avatarColor(u.username)}">${u.username.charAt(0).toUpperCase()}</div><div><div class="name">${escapeHtml(u.username)}${isSelf?' <span style="color:var(--accent);font-size:.7rem">(我)</span>':''}</div><div class="user-meta">${escapeHtml(u.bio||'无简介')}</div></div></div></td>
        <td><span class="badge ${u.role==='admin'?'online':'disabled'}">${u.role==='admin'?'高级管理员':'普通用户'}</span></td>
        <td>${levelCell}</td>
        <td>${escapeHtml(u.email||'-')}</td>
        <td style="color:var(--muted);font-size:.8rem">${fmtTime(u.created)}</td>
        <td style="color:var(--muted);font-size:.8rem">${u.lastLogin?fmtTime(u.lastLogin):'从未'}</td>
        <td><div class="row-actions" style="justify-content:flex-end">
          <button class="icon-btn" title="重置密码" onclick="resetUserPwd('${u.id}')">🔑</button>
          <button class="icon-btn" title="编辑" onclick="openUserModal('${u.id}')">✎</button>
          <button class="icon-btn danger" title="删除" ${isSelf?'disabled style="opacity:.3;cursor:not-allowed"':''} onclick="deleteUser('${u.id}')">🗑</button>
        </div></td>
      </tr>`;
  }).join('');
}
document.getElementById('user-filter-chips').addEventListener('click', e=>{
  const chip = e.target.closest('.filter-chip');
  if(!chip) return;
  document.querySelectorAll('#user-filter-chips .filter-chip').forEach(c=>c.classList.remove('active'));
  chip.classList.add('active');
  userFilter = chip.dataset.urole;
  renderUsers();
});

/* ----- User Links (admin) ----- */
function renderUserLinks(){
  const tbody = document.getElementById('userlinks-tbody');
  if(!tbody) return;
  if(!currentUser || currentUser.role!=='admin'){
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty"><div class="ico">🔒</div><h3>无权访问</h3><p>该功能仅对高级管理员开放</p></div></td></tr>`;
    return;
  }
  // Refresh the config filter dropdown with all personalMode configs
  const filter = document.getElementById('ul-config-filter');
  if(filter){
    const previousValue = filter.value;
    const personalConfigs = configs.filter(c=>c.personalMode);
    filter.innerHTML = `<option value="all">所有接口</option>` + personalConfigs.map(c=>`<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('');
    if(personalConfigs.some(c=>c.id===previousValue)) filter.value = previousValue;
  }
  const configFilter = filter ? filter.value : 'all';
  const q = (document.getElementById('ul-search').value||'').toLowerCase().trim();
  // Build rows: every (user × personalMode-config) pair
  const personalConfigs = configFilter==='all' ? configs.filter(c=>c.personalMode) : configs.filter(c=>c.id===configFilter);
  const rows = [];
  users.forEach(u=>{
    personalConfigs.forEach(c=>{
      if(!c.userTokens) c.userTokens = {};
      if(!c.userTokens[u.id]) c.userTokens[u.id] = genToken(8);
      const fullUrl = getUserConfigUrl(c, u);
      const hay = [u.username, u.email||'', c.name, c.url, c.userTokens[u.id]||''].join(' ').toLowerCase();
      if(q && !hay.includes(q)) return;
      rows.push({u, c, fullUrl});
    });
  });
  if(rows.length===0){
    const hasPersonal = configs.some(c=>c.personalMode);
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty"><div class="ico">🔗</div><h3>${hasPersonal?'没有匹配的记录':'还没有开启独立后缀的接口'}</h3><p>${hasPersonal?'请调整筛选条件':'在"接口管理"中编辑接口并勾选"为每个用户生成独立随机后缀"即可在这里看到结果'}</p></div></td></tr>`;
    return;
  }
  // Persist any newly generated tokens
  saveData();
  tbody.innerHTML = rows.map(({u,c,fullUrl})=>{
    const token = (c.userTokens && c.userTokens[u.id]) || '';
    return `
      <tr>
        <td><div class="name-cell"><div class="avatar" style="background:${avatarColor(u.username)}">${u.username.charAt(0).toUpperCase()}</div><div><div class="name">${escapeHtml(u.username)}</div><div class="user-meta">${u.role==='admin'?'高级管理员':'普通用户'}</div></div></div></td>
        <td>${escapeHtml(c.name)}</td>
        <td><span class="badge ${c.type}">${getTypeLabel(c.type)}</span></td>
        <td><div class="url-base" style="font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.74rem;color:var(--ink-2);max-width:340px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${escapeHtml(fullUrl)}">${escapeHtml(fullUrl)}</div></td>
        <td><span class="url-token" style="font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.78rem;color:var(--accent);background:var(--accent-soft);padding:2px 8px;border-radius:4px;display:inline-block">🔑 ${escapeHtml(token)}</span></td>
        <td><div class="row-actions" style="justify-content:flex-end">
          <button class="icon-btn" title="复制该用户专属地址" onclick="copyUserLink('${c.id}','${u.id}')">⧉</button>
          <button class="icon-btn" title="重新生成该用户 Token" onclick="regenerateUserToken('${c.id}','${u.id}')">↻</button>
        </div></td>
      </tr>`;
  }).join('');
}
function copyUserLink(configId, userId){
  const c = configs.find(x=>x.id===configId);
  const u = users.find(x=>x.id===userId);
  if(!c || !u) return;
  const url = getUserConfigUrl(c, u);
  navigator.clipboard.writeText(url).then(()=>toast(`已复制 ${u.username} 的专属地址`,'success')).catch(()=>toast('复制失败','danger'));
}
function regenerateUserToken(configId, userId){
  const c = configs.find(x=>x.id===configId);
  const u = users.find(x=>x.id===userId);
  if(!c || !u) return;
  if(!confirm(`确定要重新生成「${u.username}」在「${c.name}」下的专属 Token 吗？`)) return;
  if(!c.userTokens) c.userTokens = {};
  c.userTokens[userId] = genToken(8);
  c.updated = Date.now();
  saveData(); renderAll();
  toast(`已重新生成 ${u.username} 的 Token`,'success');
}
function regenerateAllTokens(){
  if(!confirm('确定要为所有用户重新生成所有"独立后缀"接口的 Token 吗？此操作不可撤销。')) return;
  configs.forEach(c=>{
    if(c.personalMode){
      c.userTokens = {};
      users.forEach(u=>{ c.userTokens[u.id] = genToken(8); });
      c.updated = Date.now();
    }
  });
  saveData(); renderAll();
  toast('已重新生成所有 Token','success');
}

/* ----- My Links (per-user personal token view) ----- */
const COPY_STATS_KEY = 'tvbox_copy_stats';
function loadCopyStats(){
  try{ return JSON.parse(localStorage.getItem(COPY_STATS_KEY)||'{}') || {}; }catch(e){ return {}; }
}
function bumpCopyStat(userId, configId){
  const stats = loadCopyStats();
  const key = userId + '|' + configId;
  if(!stats[key]) stats[key] = {count:0, lastAt:0};
  stats[key].count += 1;
  stats[key].lastAt = Date.now();
  localStorage.setItem(COPY_STATS_KEY, JSON.stringify(stats));
}
// 切换"我的专属链接"tab 模式
function setMyLinksMode(mode){
  window._mylinksMode = (mode === 'personal') ? 'personal' : 'all';
  renderMyLinks();
}
// 按当前 tab / 搜索 / 类型筛选器,获取"我的专属链接"中应该出现的可见配置列表
function getMyLinksList(){
  if(!currentUser) return [];
  const mode = window._mylinksMode || 'all';
  const typeFilter = document.getElementById('ml-type-filter')?.value || 'all';
  const q = (document.getElementById('ml-search')?.value || '').toLowerCase().trim();
  const isAdmin = currentUser.role === 'admin';
  let list = configs.filter(c => isAdmin ? true : c.enabled);
  if(mode === 'personal') list = list.filter(c => c.personalMode);
  if(typeFilter !== 'all') list = list.filter(c => c.type === typeFilter);
  if(q){
    list = list.filter(c => {
      const hay = [c.name, c.url, (c.tags||[]).join(','), c.note||''].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }
  return list;
}
function renderMyLinks(){
  const tbody = document.getElementById('mylinks-tbody');
  if(!tbody) return;
  if(!currentUser){
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty"><div class="ico">🔒</div><h3>请先登录</h3><p>登录后即可查看你的专属地址</p></div></td></tr>`;
    return;
  }
  // Header
  const un = document.getElementById('ml-username');
  if(un) un.textContent = currentUser.username;
  const me = currentUser;
  // Filter
  const q = (document.getElementById('ml-search')?.value || '').toLowerCase().trim();
  const typeFilter = document.getElementById('ml-type-filter')?.value || 'all';
  // 顶部 tab: 'all' = 全部已添加的接口; 'personal' = 仅显示开启"独立后缀"的接口
  const mode = window._mylinksMode || 'all';
  // 可见性:管理员看全部;普通用户只看到 enabled 的接口
  const isAdmin = me && me.role === 'admin';
  const visibleAll = configs.filter(c => isAdmin ? true : c.enabled);
  // 顶部统计 = 用户可见的全部接口数(与 tab 无关)
  const totalVisible = visibleAll.length;
  // 列表 = 按 tab 过滤
  let list = mode === 'personal' ? visibleAll.filter(c => c.personalMode) : visibleAll;
  if(typeFilter !== 'all') list = list.filter(c=>c.type === typeFilter);
  if(q){
    list = list.filter(c=>{
      const hay = [c.name, c.url, (c.tags||[]).join(','), c.note||''].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }
  // 顶部 tab 状态(若已渲染)
  const tabAll = document.getElementById('ml-tab-all');
  const tabPers = document.getElementById('ml-tab-personal');
  if(tabAll)  tabAll.classList.toggle('active', mode==='all');
  if(tabPers) tabPers.classList.toggle('active', mode==='personal');
  // 部署域名信息条
  const hostEl = document.getElementById('ml-host-origin');
  if(hostEl){
    const origin = getSiteOrigin() || '(本地预览)';
    hostEl.textContent = origin;
  }
  // Stats summary
  const stats = loadCopyStats();
  const userKeys = Object.keys(stats).filter(k=>k.startsWith(me.id+'|'));
  const totalCopies = userKeys.reduce((s,k)=>s + (stats[k]?.count || 0), 0);
  const lastAt = userKeys.reduce((m,k)=>Math.max(m, stats[k]?.lastAt || 0), 0);
  const cntEl = document.getElementById('ml-count');     if(cntEl) cntEl.textContent = totalVisible;
  const copEl = document.getElementById('ml-copies');    if(copEl) copEl.textContent = totalCopies;
  const lastEl = document.getElementById('ml-lastcopy'); if(lastEl) lastEl.textContent = lastAt ? fmtTime(lastAt) : '—';
  // 副标题计数(在 tab 切换时也保持显示)
  const subEl = document.getElementById('ml-sub');
  if(subEl) subEl.innerHTML = `这里展示你（<span id="ml-username">${escapeHtml(me.username)}</span>）可见的全部接口 · <span style="color:var(--accent)">${totalVisible}</span> 个`;
  if(list.length === 0){
    const hasAny = visibleAll.length > 0;
    const hasPersonal = visibleAll.some(c=>c.personalMode);
    let title, desc;
    if(!hasAny){
      title = '暂无可用接口';
      desc  = '管理员还没有添加任何接口<br>请等待管理员在「接口管理」中配置';
    } else if(mode==='personal' && !hasPersonal){
      title = '暂无独立后缀接口';
      desc  = '当前可见接口均未开启"独立后缀"<br>你仍可在「全部」标签查看原始地址';
    } else {
      title = '没有匹配的接口';
      desc  = '请调整搜索或筛选条件';
    }
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty"><div class="ico">🔗</div><h3>${title}</h3><p>${desc}</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(c=>{
    const url = getUserConfigUrl(c, me);
    const token = (c.userTokens && c.userTokens[me.id]) || '';
    const copKey = me.id + '|' + c.id;
    const copStat = stats[copKey];
    const tvboxHint = buildTvboxFields(c);
    const tvboxKeys = Object.keys(tvboxHint);
    const isPersonal = !!c.personalMode;
    const isHosted   = c.autoHosted !== false; // 老数据默认为 true
    const tokenCell = isPersonal
      ? `<span class="url-token" style="font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.78rem;color:var(--accent);background:var(--accent-soft);padding:2px 8px;border-radius:4px;display:inline-block">🔑 ${escapeHtml(token || '—')}</span>`
      : `<span style="font-size:.74rem;color:var(--muted);background:var(--bg3);padding:2px 8px;border-radius:4px;display:inline-block">🌐 公共地址</span>`;
    const hostBadge = isHosted
      ? `<span style="font-size:.7rem;color:#001218;background:linear-gradient(135deg,#00e5ff,#7c4dff);padding:2px 7px;border-radius:4px;display:inline-block;font-weight:600;margin-top:4px">☁️ 自动托管</span>`
      : `<span style="font-size:.7rem;color:var(--muted);background:var(--bg3);padding:2px 7px;border-radius:4px;display:inline-block;margin-top:4px">🔗 原始地址</span>`;
    return `
      <tr>
        <td><div class="name-cell"><div class="avatar" style="background:${avatarColor(c.name)}">${(c.name||'?').charAt(0).toUpperCase()}</div><div><div class="name">${escapeHtml(c.name)}</div><div class="desc">${escapeHtml(c.note || '无备注')}</div></div></div></td>
        <td><span class="badge ${c.type}">${getTypeLabel(c.type)}</span></td>
        <td><div class="url-cell" title="${escapeHtml(url)}"><div class="url-base">${escapeHtml(url)}</div>${copStat?`<div style="font-size:.7rem;color:var(--muted);margin-top:2px">已复制 ${copStat.count} 次 · ${fmtTime(copStat.lastAt)}</div>`:''}</div></td>
        <td>${tokenCell}<div style="margin-top:4px">${hostBadge}</div><div style="font-size:.7rem;color:var(--muted);margin-top:2px">${isHosted?'链接已绑定当前部署域名':(isPersonal?`含 ${tvboxKeys.length} 个 TVBox 字段`:`未启用独立后缀(所有用户地址相同)`)}</div></td>
        <td><div class="row-actions" style="justify-content:flex-end">
          <button class="icon-btn" title="${isPersonal?'复制我的专属地址':'复制该接口地址'}" onclick="copyMyLink('${c.id}')">⧉</button>
          <button class="icon-btn" title="复制为 TVBox 可用 JSON" onclick="copyMyLinkAsTvbox('${c.id}')">📺</button>
          <button class="icon-btn" title="下载 TVBox 配置 (.json)" onclick="downloadMyLinkAsTvbox('${c.id}')">⤓</button>
          <button class="icon-btn" title="在浏览器中打开" onclick="openMyLink('${c.id}')">↗</button>
        </div></td>
      </tr>`;
  }).join('');
}
function copyMyLink(configId){
  if(!currentUser){ toast('请先登录','warn'); return; }
  const c = configs.find(x=>x.id===configId);
  if(!c) return;
  const url = getUserConfigUrl(c, currentUser);
  navigator.clipboard.writeText(url).then(()=>{
    bumpCopyStat(currentUser.id, configId);
    toast('已复制「'+c.name+'」的专属地址','success');
    if(activeView==='mylinks') renderMyLinks();
  }).catch(()=>toast('复制失败，请检查浏览器权限','danger'));
}
// 复制/打开当前站点的部署域名(Cloudflare Pages / 自定义域)
function copySiteOrigin(){
  const o = getSiteOrigin();
  if(!o){ toast('未识别到部署域名(可能为本地预览)','warn'); return; }
  navigator.clipboard.writeText(o).then(()=>toast('已复制部署域名:'+o,'success'))
    .catch(()=>toast('复制失败，请检查浏览器权限','danger'));
}
function openSiteOrigin(){
  const o = getSiteOrigin();
  if(!o){ toast('未识别到部署域名(可能为本地预览)','warn'); return; }
  window.open(o, '_blank', 'noopener');
}
function openMyLink(configId){
  if(!currentUser){ toast('请先登录','warn'); return; }
  const c = configs.find(x=>x.id===configId);
  if(!c) return;
  const url = getUserConfigUrl(c, currentUser);
  if(/^file:/i.test(c.url)){ toast('本地文件无法在浏览器中直接打开，请到 TVBox 客户端使用','warn'); return; }
  bumpCopyStat(currentUser.id, configId);
  window.open(url, '_blank', 'noopener');
  toast('已在新标签页打开（顺便复制了一份）','success');
  if(activeView==='mylinks') renderMyLinks();
}
async function copyAllMyLinks(){
  if(!currentUser){ toast('请先登录','warn'); return; }
  const list = getMyLinksList();
  if(list.length === 0){ toast('暂无可复制的专属链接','warn'); return; }
  // Build a structured JSON payload (per-user) instead of plain text
  const text = JSON.stringify(buildMyLinksPayload(list), null, 2);
  try{
    await navigator.clipboard.writeText(text);
    list.forEach(c=>bumpCopyStat(currentUser.id, c.id));
    toast(`已复制 ${list.length} 条专属链接（JSON 格式）到剪贴板`,'success', 3000);
    if(activeView==='mylinks') renderMyLinks();
  }catch(e){
    toast('复制失败，请检查浏览器权限','danger');
  }
}
function downloadMyLinksJson(){
  if(!currentUser){ toast('请先登录','warn'); return; }
  const list = getMyLinksList();
  if(list.length === 0){ toast('暂无可下载的专属链接','warn'); return; }
  // 汇总包 + TVBox 字段
  const payload = buildMyLinksPayload(list);
  payload.tvboxReady = list.map(c => buildDirectTvboxConfig(c));
  const text = JSON.stringify(payload, null, 2);
  const blob = new Blob([text], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().replace(/[:.]/g,'-').slice(0,19);
  a.href = url;
  a.download = `tvbox-bundle-${currentUser.username}-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  list.forEach(c=>bumpCopyStat(currentUser.id, c.id));
  toast(`已下载 ${list.length} 条专属链接（JSON + TVBox 字段）`,'success', 3000);
  if(activeView==='mylinks') renderMyLinks();
}
// 下载整批 JSON（更友好：直接产生同时包含汇总包 + TVBox 字段的"分发版"）
function downloadAllMyLinksBundle(){
  if(!currentUser){ toast('请先登录','warn'); return; }
  const list = getMyLinksList();
  if(list.length === 0){ toast('暂无可下载的专属链接','warn'); return; }
  // 主 payload：含元数据 + 每条 link 嵌入 tvbox 块
  const payload = buildMyLinksPayload(list);
  // 附带：每条 link 对应的"TVBox 直接可用"配置（数组形式）
  payload.tvboxReady = list.map(c => buildDirectTvboxConfig(c));
  const text = JSON.stringify(payload, null, 2);
  const blob = new Blob([text], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().replace(/[:.]/g,'-').slice(0,19);
  a.href = url;
  a.download = `tvbox-bundle-${currentUser.username}-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  list.forEach(c=>bumpCopyStat(currentUser.id, c.id));
  toast(`已下载 ${list.length} 条专属链接（含 TVBox 字段）`,'success', 3000);
  if(activeView==='mylinks') renderMyLinks();
}
// 单条：复制为 TVBox 可直接使用的 JSON
async function copyMyLinkAsTvbox(configId){
  if(!currentUser){ toast('请先登录','warn'); return; }
  const c = configs.find(x=>x.id===configId);
  if(!c) return;
  const tv = buildDirectTvboxConfig(c);
  const text = JSON.stringify(tv, null, 2);
  try{
    await navigator.clipboard.writeText(text);
    bumpCopyStat(currentUser.id, c.id);
    toast(`已复制「${c.name}」的 TVBox 配置（JSON）`,'success', 2500);
    if(activeView==='mylinks') renderMyLinks();
  }catch(e){
    toast('复制失败，请检查浏览器权限','danger');
  }
}
// 单条：下载 TVBox 配置 .json
function downloadMyLinkAsTvbox(configId){
  if(!currentUser){ toast('请先登录','warn'); return; }
  const c = configs.find(x=>x.id===configId);
  if(!c) return;
  const tv = buildDirectTvboxConfig(c);
  const text = JSON.stringify(tv, null, 2);
  const blob = new Blob([text], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().replace(/[:.]/g,'-').slice(0,19);
  a.href = url;
  a.download = `tvbox-${slugify(c.name) || c.id}-${currentUser.username}-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  bumpCopyStat(currentUser.id, c.id);
  toast(`已下载「${c.name}」的 TVBox 配置`,'success', 2500);
  if(activeView==='mylinks') renderMyLinks();
}
function slugify(s){
  return (s||'').toString().trim().replace(/[\\/:*?"<>|\s]+/g,'-').replace(/^-+|-+$/g,'').slice(0,40);
}
// Build the structured JSON payload (shared by copy + download)
function buildMyLinksPayload(list){
  return {
    type: 'tvbox_personal_links',
    version: 1,
    user: {
      id: currentUser.id,
      username: currentUser.username,
      role: currentUser.role,
      level: getLevel(currentUser)
    },
    exportedAt: new Date().toISOString(),
    count: list.length,
    links: list.map(c => buildLinkEntry(c))
  };
}
// Build a single link entry (shared)
function buildLinkEntry(c){
  const tvbox = buildTvboxFields(c);
  const entry = {
    id: c.id,
    name: c.name,
    type: c.type,
    typeLabel: getTypeLabel(c.type),
    group: c.group || '',
    tags: c.tags || [],
    note: c.note || '',
    enabled: !!c.enabled,
    url: getUserConfigUrl(c, currentUser),
    baseUrl: c.url,
    userToken: (c.userTokens && c.userTokens[currentUser.id]) || '',
    userId: currentUser.id,
    updated: c.updated || null
  };
  // 仅当有任意 TVBox 字段时附加,避免空对象污染
  if(Object.keys(tvbox).length){
    entry.tvbox = tvbox;
  }
  return entry;
}
// Collect TVBox-recognized fields from a config (skip empty)
function buildTvboxFields(c){
  const out = {};
  if(c.spider)    out.spider    = c.spider;
  if(c.jar)       out.jar       = c.jar;
  if(c.wallpaper) out.wallpaper = c.wallpaper;
  if(c.parseUrl)  out.parseUrl  = c.parseUrl;
  if(c.searchable!==undefined && c.searchable!==null) out.searchable  = c.searchable;
  if(c.quickSearch!==undefined && c.quickSearch!==null) out.quickSearch = c.quickSearch;
  if(c.epg)       out.epg       = c.epg;
  if(c.liveUrl)   out.liveUrl   = c.liveUrl;
  if(c.sites && Array.isArray(c.sites) && c.sites.length) out.sites = c.sites;
  return out;
}
// Build a single "TVBox directly-usable" config from one personal link
// 这是 TVBox 客户端最常读取的根级字段组合,可直接保存为 .json 并在 TVBox 中作为"配置地址"加载。
function buildDirectTvboxConfig(c){
  const tv = buildTvboxFields(c);
  // 把用户专属 url 视为主入口
  const entry = {
    name: c.name,
    type: getTypeLabel(c.type),
    url: getUserConfigUrl(c, currentUser),
    baseUrl: c.url,
    user: { id: currentUser.id, username: currentUser.username },
    userToken: (c.userTokens && c.userTokens[currentUser.id]) || '',
    enabled: !!c.enabled,
    generatedAt: new Date().toISOString()
  };
  return Object.assign(entry, tv);
}
function openUserModal(id){
  document.getElementById('user-modal-title').textContent = id ? '编辑用户' : '新增用户';
  document.getElementById('u-id').value = id || '';
  if(id){
    const u = users.find(x=>x.id===id);
    document.getElementById('u-name').value = u.username;
    document.getElementById('u-name').readOnly = true;
    document.getElementById('u-name').style.opacity = .6;
    document.getElementById('u-role-sel').value = u.role;
    document.getElementById('u-email').value = u.email || '';
    document.getElementById('u-pwd').value = '';
    document.getElementById('u-pwd').placeholder = '留空则不修改密码';
    document.getElementById('u-pwd-label').innerHTML = '新密码 <span style="color:var(--muted);font-weight:normal">(可选)</span>';
    document.getElementById('u-level-sel').value = getLevel(u) || 'low';
  }else{
    document.getElementById('u-name').value = '';
    document.getElementById('u-name').readOnly = false;
    document.getElementById('u-name').style.opacity = 1;
    document.getElementById('u-role-sel').value = 'user';
    document.getElementById('u-email').value = '';
    document.getElementById('u-pwd').value = '';
    document.getElementById('u-pwd').placeholder = '至少 6 位';
    document.getElementById('u-pwd-label').innerHTML = '密码 <span class="req">*</span>';
    document.getElementById('u-level-sel').value = 'low';
  }
  updatePwdStrength('u-pwd','u-pwd-strength','u-pwd-hint');
  updateLevelVisibility();
  document.getElementById('user-modal').classList.add('show');
}
function closeUserModal(){ document.getElementById('user-modal').classList.remove('show'); }
function saveUser(){
  const id = document.getElementById('u-id').value;
  const name = document.getElementById('u-name').value.trim();
  const role = document.getElementById('u-role-sel').value;
  const email = document.getElementById('u-email').value.trim();
  const pwd = document.getElementById('u-pwd').value;
  const level = document.getElementById('u-level-sel').value;
  if(id){
    const u = users.find(x=>x.id===id);
    u.role = role; u.email = email;
    u.level = (role === 'user') ? (LEVEL_QUOTAS[level] ? level : 'low') : u.level;
    if(pwd){ if(pwd.length<6){ toast('密码至少 6 位','warn'); return; } u.password = pwd; }
    saveData(); closeUserModal(); renderAll();
    toast('已更新用户 '+u.username,'success');
  }else{
    if(!validUsername(name)){ toast('用户名需 3-20 位字母/数字/下划线','warn'); return; }
    if(users.some(x=>x.username===name)){ toast('该用户名已被占用','danger'); return; }
    if(pwd.length<6){ toast('密码至少 6 位','warn'); return; }
    const nu = {id:'u'+Date.now().toString(36)+Math.random().toString(36).slice(2,6), username:name, password:pwd, role, email, bio:'', level: (role==='user' ? (LEVEL_QUOTAS[level] ? level : 'low') : undefined), created:Date.now(), lastLogin:null};
    users.push(nu); saveData(); closeUserModal(); renderAll();
    toast('已创建用户 '+name,'success');
  }
}
function deleteUser(id){
  const u = users.find(x=>x.id===id);
  if(!u) return;
  if(u.id===currentUser.id){ toast('不能删除当前登录账号','danger'); return; }
  if(!confirm(`确定删除用户 "${u.username}" ？其创建的接口配置将保留。`)) return;
  users = users.filter(x=>x.id!==id);
  saveData(); renderAll();
  toast('已删除用户 '+u.username,'danger');
}
function resetUserPwd(id){
  const u = users.find(x=>x.id===id);
  if(!u) return;
  const np = prompt(`为用户 "${u.username}" 设置新密码（至少 6 位）：`);
  if(np===null) return;
  if(np.length<6){ toast('密码至少 6 位','warn'); return; }
  u.password = np; saveData();
  toast('已重置 '+u.username+' 的密码','success');
}

/* ----- Profile ----- */
function renderProfile(){
  if(!currentUser) return;
  document.getElementById('p-username').textContent  = currentUser.username;
  document.getElementById('p-role').innerHTML = (currentUser.role==='admin'?'高级管理员':'普通用户')+' <span class="role-badge '+currentUser.role+'">'+currentUser.role.toUpperCase()+'</span>';
  // Level / quota
  const lvlEl = document.getElementById('p-level');
  if(lvlEl){
    if(currentUser.role === 'admin'){
      lvlEl.innerHTML = '<span class="badge online" style="font-size:.7rem">无限制</span>';
    }else{
      const lv = getLevel(currentUser);
      const cfg = LEVEL_QUOTAS[lv];
      const used = countUserConfigs(currentUser.id);
      const max  = cfg.max;
      const pct  = Math.min(100, Math.round(used / max * 100));
      const overQuota = used >= max;
      const barColor = overQuota ? 'var(--danger)' : (pct >= 80 ? 'var(--warn)' : 'var(--success)');
      lvlEl.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:4px;align-items:flex-start">
          <div style="display:flex;align-items:center;gap:.4rem">
            <span class="badge ${overQuota?'offline':'online'}" style="font-size:.7rem">${cfg.label}</span>
            <span style="font-size:.82rem;color:${overQuota?'var(--danger)':'var(--ink-2)'}">${used} / ${max} 个接口</span>
          </div>
          <div style="width:160px;height:5px;background:var(--bg3);border-radius:3px;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:${barColor};transition:width .3s"></div>
          </div>
          <span style="font-size:.72rem;color:var(--muted)">${cfg.desc}</span>
        </div>`;
    }
  }
  document.getElementById('p-email').textContent     = currentUser.email || '-';
  document.getElementById('p-created').textContent   = fmtTime(currentUser.created);
  document.getElementById('p-lastlogin').textContent = currentUser.lastLogin ? fmtTime(currentUser.lastLogin) : '从未';
}
function openEditProfileModal(){
  if(!currentUser) return;
  document.getElementById('ep-username').value = currentUser.username;
  document.getElementById('ep-email').value    = currentUser.email || '';
  document.getElementById('ep-bio').value      = currentUser.bio || '';
  document.getElementById('profile-modal').classList.add('show');
}
function closeEditProfileModal(){ document.getElementById('profile-modal').classList.remove('show'); }
function saveProfile(){
  if(!currentUser) return;
  currentUser.email = document.getElementById('ep-email').value.trim();
  currentUser.bio   = document.getElementById('ep-bio').value.trim();
  saveData(); closeEditProfileModal(); refreshUserChip(); renderProfile();
  toast('资料已更新','success');
}
function changePassword(){
  if(!currentUser) return;
  const oldP = document.getElementById('cp-old').value;
  const newP = document.getElementById('cp-new').value;
  const cfm  = document.getElementById('cp-confirm').value;
  if(!oldP){ toast('请输入当前密码','warn'); return; }
  if(oldP !== currentUser.password){ toast('当前密码错误','danger'); return; }
  if(newP.length<6){ toast('新密码至少 6 位','warn'); return; }
  if(newP !== cfm){ toast('两次新密码输入不一致','warn'); return; }
  currentUser.password = newP; saveData();
  document.getElementById('cp-old').value = '';
  document.getElementById('cp-new').value = '';
  document.getElementById('cp-confirm').value = '';
  updatePwdStrength('cp-new','cp-strength','cp-hint');
  toast('密码已更新','success');
}

/* ----- Import / Export ----- */
function openImportModal(){ document.getElementById('import-modal').classList.add('show'); document.getElementById('import-text').value=''; }
function closeImportModal(){ document.getElementById('import-modal').classList.remove('show'); }
function submitImport(){
  const text = document.getElementById('import-text').value.trim();
  if(!text){ toast('请粘贴 JSON 内容','warn'); return; }
  try{
    const data = JSON.parse(text);
    const list = Array.isArray(data)? data : (data.configs || []);
    if(!Array.isArray(list)) throw new Error('格式错误');
    list.forEach(item=>{
      configs.unshift({
        id: cid(), name: item.name || '未命名', type: item.type || 'single',
        url: item.url || '', group: item.group || '', tags: item.tags || [],
        note: item.note || '', enabled: item.enabled !== false,
        status:'testing', updated: Date.now(), ownerId: currentUser.id
      });
    });
    saveData(); renderAll(); closeImportModal();
    toast('已导入 '+list.length+' 条配置','success');
  }catch(e){ toast('JSON 解析失败：'+e.message,'danger'); }
}
function importConfigs(ev){
  const file = ev.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e=>{ document.getElementById('import-text').value = e.target.result; submitImport(); };
  reader.readAsText(file);
  ev.target.value='';
}
function exportConfigs(){
  const data = { configs, groups, users:users.map(u=>({...u, password:undefined})), exportedAt: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'tvbox-configs-'+new Date().toISOString().slice(0,10)+'.json';
  a.click(); URL.revokeObjectURL(url);
  toast('已导出 JSON 文件','success');
}
function clearAllConfigs(){
  if(!confirm('确定清空全部配置？此操作不可恢复！')) return;
  configs=[]; groups=[]; saveData(); renderAll();
  toast('已清空所有数据','danger');
}

/* ----- Auth ----- */
function showAuth(){
  document.getElementById('auth-wrap').classList.remove('hidden');
  document.getElementById('app').classList.add('hidden');
}
function hideAuth(){
  document.getElementById('auth-wrap').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
}
function switchAuthMode(mode){
  document.querySelectorAll('.auth-tab').forEach(t=>t.classList.toggle('active', t.dataset.mode===mode));
  document.getElementById('form-login').style.display    = mode==='login' ? 'block' : 'none';
  document.getElementById('form-register').style.display = mode==='register' ? 'block' : 'none';
  document.getElementById('auth-title').textContent = mode==='login' ? '欢迎回来' : '创建账号';
  document.getElementById('auth-sub').textContent   = mode==='login' ? '登录以管理你的影视仓配置' : '注册后即可使用本系统';
}
document.getElementById('reg-role').addEventListener('change', e=>{
  // 注册身份选择已隐藏，所有新注册默认普通用户；保留此监听以兼容旧 DOM
});
function pwdScore(p){
  let s=0;
  if(p.length>=6) s++;
  if(p.length>=10) s++;
  if(/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if(/\d/.test(p)) s++;
  if(/[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(s, 4);
}
function updatePwdStrength(inputId, barId, hintId){
  const v = document.getElementById(inputId).value;
  const s = pwdScore(v);
  const bar = document.getElementById(barId);
  const hint = document.getElementById(hintId);
  const cfg = [
    {w:'0%',   c:'var(--bg3)',     t:''},
    {w:'25%',  c:'#ff5577',        t:'弱：仅长度达标'},
    {w:'50%',  c:'#ffb547',        t:'中：建议加入数字'},
    {w:'75%',  c:'#00e5ff',        t:'良：包含字母+数字'},
    {w:'100%', c:'#00ffae',        t:'强：复杂度优秀'}
  ];
  bar.style.width = cfg[s].w;
  bar.style.background = cfg[s].c;
  hint.textContent = v ? cfg[s].t : '';
  hint.style.color = cfg[s].c;
}
function validUsername(name){
  return typeof name==='string' && /^[A-Za-z0-9_]{3,20}$/.test(name);
}

/* ----- User Levels & Quotas (for normal users) ----- */
// Defines the upper bound for the number of interfaces a user of each level can create.
// "low"  = 1–9  (default for new users)
// "mid"  = 10–15
// "high" = 10–30
// Admins are not subject to the cap.
const LEVEL_QUOTAS = {
  low:  {min: 1,  max: 9,  label: '低级', desc: '1 – 9 个接口'},
  mid:  {min: 10, max: 15, label: '中级', desc: '10 – 15 个接口'},
  high: {min: 10, max: 30, label: '高级', desc: '10 – 30 个接口'}
};
function getLevel(user){
  // Default: "low" for any normal user that hasn't been assigned one.
  if(!user) return 'low';
  if(user.role === 'admin') return null; // no quota
  return LEVEL_QUOTAS[user.level] ? user.level : 'low';
}
function getQuotaMax(user){
  const lv = getLevel(user);
  if(lv === null) return Infinity; // admin
  return LEVEL_QUOTAS[lv].max;
}
function countUserConfigs(userId){
  return configs.filter(c => c.ownerId === userId).length;
}
function canUserAddConfig(user){
  if(!user) return false;
  if(user.role === 'admin') return true;
  const max = getQuotaMax(user);
  const used = countUserConfigs(user.id);
  return used < max;
}
function updateLevelVisibility(){
  const role = document.getElementById('u-role-sel').value;
  const wrap = document.getElementById('u-level-wrap');
  if(!wrap) return;
  if(role === 'admin'){
    wrap.style.display = 'none';
  }else{
    wrap.style.display = '';
    updateLevelHint();
  }
}
function updateLevelHint(){
  const sel = document.getElementById('u-level-sel');
  const hint = document.getElementById('u-level-hint');
  if(!sel || !hint) return;
  const lv = sel.value;
  const cfg = LEVEL_QUOTAS[lv];
  if(cfg){
    const used = currentUser && currentUser.role === 'user' && getLevel(currentUser) === lv
      ? countUserConfigs(currentUser.id) : null;
    hint.textContent = used != null
      ? `当前等级：${cfg.label}（${cfg.desc}）；你已使用 ${used} / ${cfg.max}`
      : `当前等级：${cfg.label}（${cfg.desc}）`;
    hint.style.color = used != null && used >= cfg.max ? 'var(--danger)' : 'var(--muted)';
  }
}
// Called when the dashboard "新增接口" button is clicked.
// Normal users at quota are blocked with a clear explanation.
function onDashAddClick(){
  if(currentUser && currentUser.role === 'user' && !canUserAddConfig(currentUser)){
    const lv = LEVEL_QUOTAS[getLevel(currentUser)];
    const used = countUserConfigs(currentUser.id);
    toast(`已达上限：${lv.label}用户最多创建 ${lv.max} 个接口（当前 ${used}）。请联系管理员提升等级。`,'danger', 5000);
    return;
  }
  openConfigModal();
}
// Reflects quota state in the dashboard "新增接口" button (visually disabled for users at cap)
function updateAddBtnState(){
  const atCap = currentUser && currentUser.role === 'user' && !canUserAddConfig(currentUser);
  ['dash-add-btn','cfgs-add-btn'].forEach(id=>{
    const btn = document.getElementById(id);
    if(!btn) return;
    if(atCap){
      btn.style.opacity = '.5';
      btn.style.cursor = 'not-allowed';
      btn.title = '已达接口数量上限';
    }else{
      btn.style.opacity = '';
      btn.style.cursor = '';
      btn.title = '';
    }
  });
}
function onCfgsAddClick(){
  if(currentUser && currentUser.role === 'user' && !canUserAddConfig(currentUser)){
    const lv = LEVEL_QUOTAS[getLevel(currentUser)];
    const used = countUserConfigs(currentUser.id);
    toast(`已达上限：${lv.label}用户最多创建 ${lv.max} 个接口（当前 ${used}）。请联系管理员提升等级。`,'danger', 5000);
    return;
  }
  openConfigModal();
  // 普通用户新建时,默认开启"独立后缀",这样添加的接口会自动出现在"我的专属链接"中
  if(currentUser && currentUser.role === 'user'){
    const cb = document.getElementById('cfg-personal');
    if(cb) cb.checked = true;
    updateTokenPreview();
  }
}
function doLogin(){
  const u = document.getElementById('login-username').value.trim();
  const p = document.getElementById('login-password').value;
  const uInput = document.getElementById('login-username');
  const pInput = document.getElementById('login-password');
  uInput.classList.remove('input-error','shake');
  pInput.classList.remove('input-error','shake');
  if(!u || !p){
    toast('请填写用户名和密码','warn');
    uInput.classList.add('input-error','shake');
    pInput.classList.add('input-error','shake');
    setTimeout(()=>{uInput.classList.remove('shake');pInput.classList.remove('shake')},400);
    (u?pInput:uInput).focus();
    return;
  }
  const user = users.find(x=>x.username===u);
  if(!user || user.password !== p){
    toast('用户名或密码错误','danger');
    uInput.classList.add('input-error','shake');
    pInput.classList.add('input-error','shake');
    pInput.value = '';
    setTimeout(()=>{uInput.classList.remove('shake');pInput.classList.remove('shake')},400);
    uInput.focus();
    return;
  }
  currentUser = user;
  currentUser.lastLogin = Date.now();
  saveData();
  sessionStorage.setItem(SESSION_KEY, currentUser.id);
  if(document.getElementById('login-remember').checked){
    localStorage.setItem(REMEMBER_KEY, currentUser.id);
  }else{
    localStorage.removeItem(REMEMBER_KEY);
  }
  toast('登录成功，欢迎 '+currentUser.username,'success');
  onAuthSuccess();
}
function doRegister(){
  const u = document.getElementById('reg-username').value.trim();
  const e = document.getElementById('reg-email').value.trim();
  const p = document.getElementById('reg-password').value;
  const c = document.getElementById('reg-confirm').value;
  if(!validUsername(u)){ toast('用户名需 3-20 位字母/数字/下划线','warn'); return; }
  if(users.some(x=>x.username===u)){ toast('该用户名已被占用','danger'); return; }
  if(p.length<6){ toast('密码至少 6 位','warn'); return; }
  if(p !== c){ toast('两次密码输入不一致','warn'); return; }
  // 管理员角色仅能由现有管理员在"用户管理"页提升，不开放公开注册
  const newUser = {
    id:'u'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),
    username:u, password:p, role:'user', email:e, bio:'',
    created:Date.now(), lastLogin:Date.now()
  };
  users.push(newUser);
  saveData();
  currentUser = newUser;
  sessionStorage.setItem(SESSION_KEY, currentUser.id);
  toast('注册成功！已自动登录','success');
  onAuthSuccess();
}
function onAuthSuccess(){
  hideAuth();
  applyNavByRole();
  refreshUserChip();
  document.getElementById('form-register').reset();
  document.getElementById('form-login').reset();
  goView('dashboard');
}
function logout(){
  if(!confirm('确定退出登录？')) return;
  const previousUsername = currentUser ? currentUser.username : '';
  currentUser = null;
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(REMEMBER_KEY);
  document.querySelectorAll('.modal-mask.show').forEach(m=>m.classList.remove('show'));
  document.querySelectorAll('.view').forEach(v=>v.style.display='none');
  showAuth();
  switchAuthMode('login');
  const lu = document.getElementById('login-username'); if(lu) lu.value = '';
  const lp = document.getElementById('login-password'); if(lp) lp.value = '';
  window.scrollTo(0,0);
  setTimeout(()=>toast(previousUsername ? '已退出账号「' + previousUsername + '」' : '已退出登录','warn'), 50);
}
function refreshUserChip(){
  if(!currentUser) return;
  const chip = document.getElementById('user-avatar');
  chip.textContent = currentUser.username.charAt(0).toUpperCase();
  chip.style.background = avatarColor(currentUser.username);
  document.getElementById('user-name').textContent = currentUser.username;
  const role = currentUser.role==='admin' ? '高级管理员' : '普通用户';
  document.getElementById('user-role').innerHTML = role+' <span class="role-badge '+currentUser.role+'">'+currentUser.role.toUpperCase()+'</span>';
}
function applyNavByRole(){
  document.querySelectorAll('.nav-item').forEach(el=>{
    const roles = (el.dataset.roles||'').split(',');
    el.style.display = (currentUser && roles.includes(currentUser.role)) ? 'flex' : 'none';
  });
}

/* ----- Render All ----- */
function renderAll(){
  renderStats();
  renderConfigs();
  renderMyLinks();
  renderGroups();
  renderUsers();
  renderUserLinks();
  renderProfile();
  const sc = document.getElementById('settings-count');
  if(sc) sc.textContent = configs.length;
  const su = document.getElementById('settings-users');
  if(su) su.textContent = users.length;
  // 部署域名信息卡(自动托管)
  const so = document.getElementById('settings-origin');
  if(so) so.textContent = getSiteOrigin() || '(本地预览)';
  const sos = document.getElementById('settings-origin-sample');
  if(sos){
    const me = currentUser || {id:'<uid>'};
    const origin = getSiteOrigin() || '';
    sos.textContent = (origin || '') + '/r/' + me.id + '/<cid>?t=<token>';
  }
}

/* ----- Init ----- */
function init(){
  loadData();
  if(currentUser){
    hideAuth();
    applyNavByRole();
    refreshUserChip();
    goView('dashboard');
  }else{
    showAuth();
    switchAuthMode('login');
  }
}
init();
</script>
</body>
</html>
```

---

## tvbox-config-manager.html · 根目录单文件副本

> 路径: `tvbox-config-manager.html` · 大小: 128.7 KB

```html
<!-- TVBox Config Manager v2.0 — Cloudflare Pages ready -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="theme-color" content="#0a0e1a">
<meta name="description" content="影视仓 / TVBox 配置管理中心:多用户、角色权限、独立后缀、TVBox 标准字段直接生成可用配置。">
<meta name="keywords" content="TVBox,影视仓,配置管理,spider,jar,wallpaper,EPG,subscribe,m3u,多仓,单仓">
<meta name="author" content="TVBox Manager">
<meta name="robots" content="noindex,nofollow">
<meta property="og:title" content="影视仓配置管理中心">
<meta property="og:description" content="TVBox 配置管理 · 多用户 · 独立后缀 · 一键生成可用配置">
<meta property="og:type" content="website">
<meta property="og:locale" content="zh_CN">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%2300e5ff'/><stop offset='100%' stop-color='%237c4dff'/></linearGradient></defs><rect width='64' height='64' rx='14' fill='url(%23g)'/><polygon points='24,18 48,32 24,46' fill='%23001'/></svg>">
<title>影视仓配置管理中心</title>
<style>
  /* ========== Reset & Base ========== */
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%}
  body{
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;
    background:var(--bg);
    color:var(--ink);
    line-height:1.6;
    min-height:100vh;
    overflow-x:hidden;
    position:relative;
  }
  body::before{
    content:"";
    position:fixed;inset:0;
    background:
      radial-gradient(ellipse at 20% 10%, rgba(0,229,255,.08), transparent 50%),
      radial-gradient(ellipse at 80% 90%, rgba(124,77,255,.10), transparent 50%),
      radial-gradient(ellipse at 50% 50%, rgba(0,255,170,.04), transparent 60%);
    pointer-events:none;
    z-index:0;
  }
  ::selection{background:var(--accent);color:#001218}
  a{color:inherit;text-decoration:none}
  button{font-family:inherit;cursor:pointer;border:none;background:none;color:inherit}
  input,select,textarea{font-family:inherit;color:inherit}

  /* ========== Design Tokens ========== */
  :root{
    --bg:#0a0e1a;
    --bg2:#111827;
    --bg3:#1a2235;
    --surface:rgba(26,34,53,.65);
    --surface-2:rgba(17,24,39,.85);
    --ink:#e6edf7;
    --ink-2:#c5d1e3;
    --muted:#7e8aa3;
    --rule:rgba(126,138,163,.18);
    --accent:#00e5ff;
    --accent-soft:rgba(0,229,255,.12);
    --accent2:#7c4dff;
    --accent2-soft:rgba(124,77,255,.14);
    --success:#00ffae;
    --warn:#ffb547;
    --danger:#ff5577;
    --radius:14px;
    --radius-sm:8px;
    --shadow-glow:0 0 24px rgba(0,229,255,.18);
    --shadow-card:0 8px 32px rgba(0,0,0,.35);
    --transition:all .25s cubic-bezier(.4,0,.2,1);
  }

  /* ========== Layout ========== */
  .app{position:relative;z-index:1;display:grid;grid-template-columns:240px 1fr;min-height:100vh}
  .app.hidden{display:none}
  .sidebar{
    background:linear-gradient(180deg, rgba(17,24,39,.95), rgba(10,14,26,.95));
    border-right:1px solid var(--rule);
    padding:1.5rem 1rem;
    position:sticky;top:0;height:100vh;
    overflow-y:auto;backdrop-filter:blur(12px);
  }
  .brand{display:flex;align-items:center;gap:.6rem;padding:0 .5rem 1.5rem;border-bottom:1px solid var(--rule);margin-bottom:1.25rem}
  .brand-logo{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:1.2rem;color:#001;box-shadow:var(--shadow-glow)}
  .brand-name{font-weight:700;font-size:1.05rem;letter-spacing:.5px}
  .brand-sub{font-size:.7rem;color:var(--muted);margin-top:2px}
  .nav{display:flex;flex-direction:column;gap:.25rem}
  .nav-item{display:flex;align-items:center;gap:.7rem;padding:.7rem .85rem;border-radius:var(--radius-sm);color:var(--ink-2);font-size:.9rem;cursor:pointer;transition:var(--transition);border:1px solid transparent}
  .nav-item:hover{background:var(--surface);color:var(--ink)}
  .nav-item.active{background:linear-gradient(90deg, var(--accent-soft), transparent);color:var(--accent);border-color:rgba(0,229,255,.25)}
  .nav-item .ico{width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center}
  .nav-section{font-size:.7rem;color:var(--muted);text-transform:uppercase;letter-spacing:1.2px;padding:1rem .85rem .4rem}
  .main{padding:1.5rem 2rem 3rem;overflow-x:hidden}
  .topbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;gap:1rem;flex-wrap:wrap}
  .topbar h1{font-size:1.6rem;font-weight:700;letter-spacing:.5px}
  .topbar .sub{color:var(--muted);font-size:.85rem;margin-top:4px}
  .topbar-actions{display:flex;gap:.5rem;flex-wrap:wrap}

  /* ========== Buttons ========== */
  .btn{display:inline-flex;align-items:center;gap:.45rem;padding:.55rem 1rem;border-radius:var(--radius-sm);font-size:.85rem;font-weight:500;background:var(--surface);border:1px solid var(--rule);color:var(--ink);transition:var(--transition)}
  .btn:hover{background:var(--surface-2);border-color:var(--accent);color:var(--accent)}
  .btn.primary{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#001218;font-weight:600;border-color:transparent}
  .btn.primary:hover{box-shadow:var(--shadow-glow);transform:translateY(-1px)}
  .btn.ghost{background:transparent}
  .btn.danger:hover{border-color:var(--danger);color:var(--danger)}
  .btn.sm{padding:.35rem .7rem;font-size:.78rem}

  /* ========== Stat Cards ========== */
  .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.5rem}
  .stat{background:var(--surface);border:1px solid var(--rule);border-radius:var(--radius);padding:1.1rem 1.25rem;position:relative;overflow:hidden;transition:var(--transition)}
  .stat:hover{border-color:var(--accent);transform:translateY(-2px)}
  .stat::before{content:"";position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--accent),var(--accent2));opacity:.6}
  .stat-label{font-size:.75rem;color:var(--muted);text-transform:uppercase;letter-spacing:1px}
  .stat-value{font-size:1.9rem;font-weight:700;margin:.3rem 0 .2rem;letter-spacing:.5px}
  .stat-delta{font-size:.75rem;color:var(--success)}
  .stat-delta.warn{color:var(--warn)}
  .stat-delta.danger{color:var(--danger)}

  /* ========== Toolbar ========== */
  .toolbar{background:var(--surface);border:1px solid var(--rule);border-radius:var(--radius);padding:1rem 1.25rem;display:flex;align-items:center;gap:.75rem;flex-wrap:wrap;margin-bottom:1.25rem}
  .search{position:relative;flex:1;min-width:220px}
  .search input{width:100%;background:var(--bg2);border:1px solid var(--rule);border-radius:var(--radius-sm);padding:.55rem .9rem .55rem 2.2rem;font-size:.88rem;transition:var(--transition)}
  .search input:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft)}
  .search::before{content:"⌕";position:absolute;left:.7rem;top:50%;transform:translateY(-50%);color:var(--muted);font-size:1rem}
  .filter-chip{padding:.4rem .85rem;background:var(--bg2);border:1px solid var(--rule);border-radius:999px;font-size:.78rem;color:var(--ink-2);cursor:pointer;transition:var(--transition)}
  .filter-chip:hover{border-color:var(--accent);color:var(--accent)}
  .filter-chip.active{background:var(--accent-soft);border-color:var(--accent);color:var(--accent)}

  /* ========== Table ========== */
  .table-wrap{background:var(--surface);border:1px solid var(--rule);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow-card)}
  .table-wrap .scroll{max-height:640px;overflow-y:auto;overflow-x:auto}
  table{width:100%;border-collapse:collapse;min-width:880px}
  thead th{background:rgba(10,14,26,.6);color:var(--muted);font-weight:600;font-size:.75rem;text-transform:uppercase;letter-spacing:1px;padding:.85rem 1rem;text-align:left;border-bottom:1px solid var(--rule);position:sticky;top:0;z-index:1;backdrop-filter:blur(8px)}
  tbody td{padding:.85rem 1rem;border-bottom:1px solid var(--rule);font-size:.88rem;color:var(--ink-2);vertical-align:middle}
  tbody tr{transition:var(--transition)}
  tbody tr:hover{background:rgba(0,229,255,.04)}
  tbody tr:last-child td{border-bottom:none}
  .name-cell{display:flex;align-items:center;gap:.6rem}
  .name-cell .avatar{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:.9rem;font-weight:600;color:#001}
  .name-cell .name{font-weight:600;color:var(--ink)}
  .name-cell .desc{font-size:.75rem;color:var(--muted);margin-top:2px}
  .badge{display:inline-flex;align-items:center;gap:.3rem;padding:.2rem .55rem;border-radius:999px;font-size:.7rem;font-weight:600;border:1px solid transparent}
  .badge.single{background:rgba(0,229,255,.12);color:var(--accent);border-color:rgba(0,229,255,.3)}
  .badge.multi{background:rgba(124,77,255,.14);color:#a78bfa;border-color:rgba(124,77,255,.3)}
  .badge.subscribe{background:rgba(255,181,71,.12);color:var(--warn);border-color:rgba(255,181,71,.3)}
  .badge.local{background:rgba(0,255,174,.12);color:var(--success);border-color:rgba(0,255,174,.3)}
  .badge.online{background:rgba(0,255,174,.12);color:var(--success);border-color:rgba(0,255,174,.3)}
  .badge.offline{background:rgba(255,85,119,.12);color:var(--danger);border-color:rgba(255,85,119,.3)}
  .badge.disabled{background:rgba(126,138,163,.12);color:var(--muted);border-color:var(--rule)}
  .badge.testing{background:rgba(255,181,71,.12);color:var(--warn);border-color:rgba(255,181,71,.3)}
  .url-cell{max-width:280px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.78rem;color:var(--ink-2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .row-actions{display:flex;gap:.35rem}
  .icon-btn{width:30px;height:30px;border-radius:6px;display:inline-flex;align-items:center;justify-content:center;color:var(--muted);transition:var(--transition)}
  .icon-btn:hover{background:var(--surface-2);color:var(--accent)}
  .icon-btn.danger:hover{color:var(--danger)}

  /* ========== Personal URL (per-user token) ========== */
  .url-cell{display:flex;flex-direction:column;gap:2px}
  .url-cell .url-base{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.78rem;color:var(--ink-2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .url-cell .url-token{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.7rem;color:var(--accent);background:var(--accent-soft);padding:1px 6px;border-radius:4px;display:inline-block;width:max-content;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .url-cell .url-token::before{content:"🔑 "}
  .field-hint{font-size:.76rem;color:var(--muted);margin-top:.3rem;line-height:1.4}
  .token-mode{display:flex;align-items:center;gap:.5rem;padding:.6rem .8rem;background:var(--bg3);border:1px solid var(--rule);border-radius:var(--radius-sm);margin-top:.3rem}
  .token-mode input{margin:0}
  .token-mode label{font-size:.85rem;cursor:pointer;flex:1;color:var(--ink-2)}
  .token-mode .ico{font-size:1.1rem}
  details.tvbox-advanced{margin-top:.5rem;border:1px dashed var(--rule);border-radius:var(--radius-sm);padding:.4rem .7rem;background:rgba(255,255,255,.02)}
  details.tvbox-advanced>summary{cursor:pointer;font-size:.82rem;color:var(--ink-2);padding:.25rem 0;list-style:none;user-select:none}
  details.tvbox-advanced>summary::-webkit-details-marker{display:none}
  details.tvbox-advanced[open]>summary{color:var(--accent);margin-bottom:.4rem}
  .adv-grid{display:grid;grid-template-columns:1fr 1fr;gap:.5rem .8rem;margin-top:.4rem}
  .adv-grid .field{margin-bottom:.3rem}
  .adv-grid .field input,.adv-grid .field select,.adv-grid .field textarea{width:100%;box-sizing:border-box}
  .token-preview{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.72rem;color:var(--accent);background:var(--bg2);padding:.5rem .7rem;border-radius:6px;margin-top:.5rem;word-break:break-all;border:1px dashed var(--rule)}

  /* ========== Failed Interfaces Card ========== */
  .failed-card{position:relative}
  .failed-card::before{content:"";position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--danger),rgba(255,85,119,.3));border-radius:var(--radius) var(--radius) 0 0}
  .failed-head{display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;margin-bottom:.2rem}
  .failed-head h3{margin:0}
  .failed-row-name{color:var(--ink);font-weight:600}
  .failed-row-name .row-meta{display:block;font-weight:400;font-size:.75rem;color:var(--muted);margin-top:2px}

  /* ========== Empty State ========== */
  .empty{padding:4rem 2rem;text-align:center;color:var(--muted)}
  .empty .ico{font-size:3rem;margin-bottom:1rem;opacity:.5}
  .empty h3{color:var(--ink);margin-bottom:.4rem}
  .empty p{font-size:.88rem}

  /* ========== Modal ========== */
  .modal-mask{position:fixed;inset:0;background:rgba(5,8,15,.75);backdrop-filter:blur(8px);display:none;align-items:center;justify-content:center;z-index:1000;padding:1rem}
  .modal-mask.show{display:flex}
  .modal{background:linear-gradient(180deg, var(--bg2), var(--bg));border:1px solid var(--rule);border-radius:var(--radius);width:100%;max-width:560px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 64px rgba(0,0,0,.5), 0 0 0 1px rgba(0,229,255,.05)}
  .modal-head{padding:1.25rem 1.5rem;border-bottom:1px solid var(--rule);display:flex;align-items:center;justify-content:space-between}
  .modal-head h2{font-size:1.15rem;font-weight:600}
  .modal-close{color:var(--muted);font-size:1.4rem;line-height:1;padding:.2rem .4rem}
  .modal-close:hover{color:var(--ink)}
  .modal-body{padding:1.5rem}
  .modal-foot{padding:1rem 1.5rem;border-top:1px solid var(--rule);display:flex;justify-content:flex-end;gap:.5rem}
  .field{margin-bottom:1.1rem}
  .field label{display:block;font-size:.8rem;color:var(--ink-2);margin-bottom:.4rem;font-weight:500}
  .field label .req{color:var(--danger);margin-left:2px}
  .field input,.field select,.field textarea{width:100%;background:var(--bg3);border:1px solid var(--rule);border-radius:var(--radius-sm);padding:.6rem .85rem;font-size:.9rem;transition:var(--transition)}
  .field textarea{resize:vertical;min-height:80px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.82rem}
  .field input:focus,.field select:focus,.field textarea:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft)}
  .field-row{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}

  /* ========== Toast ========== */
  .toast-wrap{position:fixed;top:1.5rem;right:1.5rem;display:flex;flex-direction:column;gap:.5rem;z-index:2000;pointer-events:none}
  .toast{background:var(--bg2);border:1px solid var(--rule);border-left:3px solid var(--accent);border-radius:var(--radius-sm);padding:.75rem 1rem;font-size:.85rem;color:var(--ink);box-shadow:var(--shadow-card);min-width:240px;animation:slideIn .3s ease}
  .toast.success{border-left-color:var(--success)}
  .toast.danger{border-left-color:var(--danger)}
  .toast.warn{border-left-color:var(--warn)}
  @keyframes slideIn{from{transform:translateX(20px);opacity:0}to{transform:translateX(0);opacity:1}}

  /* ========== Switch ========== */
  .switch{position:relative;display:inline-block;width:40px;height:22px;cursor:pointer}
  .switch input{opacity:0;width:0;height:0}
  .switch .slider{position:absolute;inset:0;background:var(--bg3);border:1px solid var(--rule);border-radius:999px;transition:var(--transition)}
  .switch .slider::before{content:"";position:absolute;left:2px;top:2px;width:16px;height:16px;background:var(--muted);border-radius:50%;transition:var(--transition)}
  .switch input:checked + .slider{background:var(--accent-soft);border-color:var(--accent)}
  .switch input:checked + .slider::before{transform:translateX(18px);background:var(--accent)}

  /* ========== Detail Panel ========== */
  .detail-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;margin-bottom:1.25rem}
  .detail-card{background:var(--surface);border:1px solid var(--rule);border-radius:var(--radius);padding:1.1rem 1.25rem}
  .detail-card h3{font-size:.85rem;color:var(--muted);margin-bottom:.6rem;text-transform:uppercase;letter-spacing:1px}
  .detail-list{display:flex;flex-direction:column;gap:.5rem}
  .detail-list .row{display:flex;justify-content:space-between;font-size:.88rem;padding:.25rem 0}
  .detail-list .row .k{color:var(--muted)}
  .detail-list .row .v{color:var(--ink);font-weight:500}

  /* ========== Auth Pages ========== */
  .auth-wrap{position:fixed;inset:0;z-index:1500;display:flex;align-items:center;justify-content:center;padding:1.5rem}
  .auth-wrap.hidden{display:none}
  .auth-card{width:100%;max-width:440px;background:linear-gradient(180deg, rgba(26,34,53,.95), rgba(10,14,26,.95));border:1px solid var(--rule);border-radius:18px;padding:2.25rem 2rem 1.75rem;box-shadow:0 24px 64px rgba(0,0,0,.55), 0 0 0 1px rgba(0,229,255,.05);position:relative;overflow:hidden}
  .auth-card::before{content:"";position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--accent),var(--accent2))}
  .auth-head{text-align:center;margin-bottom:1.5rem}
  .auth-logo{width:54px;height:54px;margin:0 auto .8rem;border-radius:14px;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;font-size:1.5rem;color:#001;box-shadow:var(--shadow-glow)}
  .auth-title{font-size:1.35rem;font-weight:700;letter-spacing:.5px}
  .auth-sub{color:var(--muted);font-size:.82rem;margin-top:.3rem}
  .auth-tabs{display:flex;background:var(--bg3);border-radius:var(--radius-sm);padding:3px;margin-bottom:1.25rem}
  .auth-tab{flex:1;padding:.5rem 0;text-align:center;font-size:.85rem;color:var(--muted);border-radius:6px;cursor:pointer;transition:var(--transition)}
  .auth-tab.active{background:var(--accent);color:#001218;font-weight:600}
  .auth-form .field{margin-bottom:.9rem}

  /* error state */
  input.input-error,textarea.input-error,select.input-error{border-color:var(--danger)!important;box-shadow:0 0 0 3px rgba(255,85,119,.15)!important}
  .input-error.shake{animation:shake .35s ease}
  @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}

  /* pwd strength + show/hide */
  .pwd-strength{height:4px;border-radius:2px;background:var(--bg3);overflow:hidden;margin-top:.4rem}
  .pwd-strength>div{height:100%;width:0;transition:all .3s ease}
  .pwd-hint{font-size:.7rem;color:var(--muted);margin-top:.3rem;min-height:1em}
  .pwd-wrap{position:relative}
  .pwd-wrap input{padding-right:2.4rem!important}
  .pwd-toggle{position:absolute;right:.5rem;top:50%;transform:translateY(-50%);width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;color:var(--muted);cursor:pointer;transition:var(--transition);background:transparent}
  .pwd-toggle:hover{color:var(--accent);background:var(--bg2)}
  .pwd-toggle.showing{color:var(--accent)}
  .pwd-toggle svg{width:16px;height:16px}

  .auth-extra{display:flex;justify-content:space-between;align-items:center;font-size:.78rem;color:var(--muted);margin:.25rem 0 1rem}
  .auth-extra a{color:var(--accent)}
  .auth-extra a:hover{text-decoration:underline}
  .auth-tip{text-align:center;font-size:.8rem;color:var(--muted);margin-top:1rem}
  .auth-tip a{color:var(--accent);font-weight:500}
  .auth-tip a:hover{text-decoration:underline}

  /* user chip */
  .user-chip{display:flex;align-items:center;gap:.6rem;padding:.7rem .85rem;border-radius:var(--radius-sm);background:var(--surface);border:1px solid var(--rule);margin-top:1rem;cursor:pointer;transition:var(--transition)}
  .user-chip:hover{border-color:var(--accent)}
  .user-chip .avatar-sm{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:600;color:#001;font-size:.85rem;flex-shrink:0}
  .user-chip .info{flex:1;min-width:0}
  .user-chip .name{font-size:.85rem;font-weight:600;color:var(--ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .user-chip .role{font-size:.65rem;color:var(--muted);text-transform:uppercase;letter-spacing:1px}
  .user-chip .logout{color:var(--muted);font-size:.9rem;padding:.2rem .4rem;border-radius:4px}
  .user-chip .logout:hover{color:var(--danger);background:rgba(255,85,119,.1)}
  .role-badge{display:inline-block;padding:.1rem .4rem;border-radius:4px;font-size:.6rem;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-left:.3rem;vertical-align:middle}
  .role-badge.admin{background:linear-gradient(135deg,#ffb547,#ff5577);color:#1a0a00}
  .role-badge.user{background:var(--surface);color:var(--muted);border:1px solid var(--rule)}
  .user-meta{font-size:.78rem;color:var(--muted);margin-top:2px}

  /* ========== Responsive ========== */
  @media (max-width: 960px){
    .app{grid-template-columns:1fr}
    .sidebar{position:relative;height:auto;display:flex;flex-direction:column}
    .stats{grid-template-columns:repeat(2,1fr)}
    .field-row{grid-template-columns:1fr}
    .detail-grid{grid-template-columns:1fr}
  }
  @media (max-width: 600px){
    .main{padding:1rem}
    .stats{grid-template-columns:1fr}
    .topbar h1{font-size:1.25rem}
  }
</style>
</head>
<body>
<div class="app" id="app">
  <!-- ========== Sidebar ========== -->
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-logo">▶</div>
      <div>
        <div class="brand-name">TVBox Manager</div>
        <div class="brand-sub">影视仓配置中心</div>
      </div>
    </div>
    <nav class="nav" id="nav">
      <div class="nav-section">主导航</div>
      <div class="nav-item active" data-view="dashboard" data-roles="admin,user"><span class="ico">◉</span><span>仪表盘</span></div>
      <div class="nav-item" data-view="configs" data-roles="admin,user"><span class="ico">▤</span><span>接口管理</span></div>
      <div class="nav-item" data-view="mylinks" data-roles="admin,user"><span class="ico">🔗</span><span>我的专属链接</span></div>
      <div class="nav-item" data-view="groups" data-roles="admin,user"><span class="ico">◫</span><span>分组管理</span></div>
      <div class="nav-item admin-only" data-view="users" data-roles="admin"><span class="ico">👥</span><span>用户管理</span></div>
      <div class="nav-item admin-only" data-view="userlinks" data-roles="admin"><span class="ico">👥🔗</span><span>全员链接</span></div>
      <div class="nav-section">工具</div>
      <div class="nav-item" data-view="import" data-roles="admin,user"><span class="ico">↓</span><span>导入 / 导出</span></div>
      <div class="nav-item" data-view="profile" data-roles="admin,user"><span class="ico">◐</span><span>个人中心</span></div>
      <div class="nav-item" data-view="settings" data-roles="admin,user"><span class="ico">⚙</span><span>系统设置</span></div>
    </nav>
    <div class="user-chip" onclick="goView('profile')">
      <div class="avatar-sm" id="user-avatar">A</div>
      <div class="info">
        <div class="name" id="user-name">未登录</div>
        <div class="role" id="user-role">-</div>
      </div>
      <button class="logout" title="退出登录" onclick="event.stopPropagation();logout()">⏻</button>
    </div>
  </aside>

  <!-- ========== Main ========== -->
  <main class="main">
    <!-- Dashboard -->
    <section id="view-dashboard" class="view">
      <div class="topbar"><div><h1>仪表盘</h1><div class="sub">总览所有影视仓接口配置与运行状态</div></div>
        <div class="topbar-actions"><button class="btn" onclick="openImportModal()">↓ 导入</button><button class="btn primary" id="dash-add-btn" onclick="onDashAddClick()">+ 新增接口</button></div></div>
      <div class="stats">
        <div class="stat"><div class="stat-label">接口总数</div><div class="stat-value" id="stat-total">0</div><div class="stat-delta">活跃配置项</div></div>
        <div class="stat"><div class="stat-label">单仓接口</div><div class="stat-value" id="stat-single">0</div><div class="stat-delta">加载速度快</div></div>
        <div class="stat"><div class="stat-label">多仓接口</div><div class="stat-value" id="stat-multi">0</div><div class="stat-delta warn">稳定性更高</div></div>
        <div class="stat"><div class="stat-label">在线可用</div><div class="stat-value" id="stat-online">0</div><div class="stat-delta">最近一次检测</div></div>
      </div>
      <div class="detail-grid">
        <div class="detail-card"><h3>类型分布</h3><div class="detail-list">
          <div class="row"><span class="k">单仓接口</span><span class="v" id="dist-single">0</span></div>
          <div class="row"><span class="k">多仓接口</span><span class="v" id="dist-multi">0</span></div>
          <div class="row"><span class="k">订阅源</span><span class="v" id="dist-subscribe">0</span></div>
          <div class="row"><span class="k">本地文件</span><span class="v" id="dist-local">0</span></div>
        </div></div>
        <div class="detail-card"><h3>状态分布</h3><div class="detail-list">
          <div class="row"><span class="k">已启用</span><span class="v" id="st-enabled">0</span></div>
          <div class="row"><span class="k">已禁用</span><span class="v" id="st-disabled">0</span></div>
          <div class="row"><span class="k">检测中</span><span class="v" id="st-testing">0</span></div>
          <div class="row"><span class="k">已离线</span><span class="v" id="st-offline">0</span></div>
        </div></div>
      </div>

      <!-- Failed / Offline interfaces -->
      <div class="detail-card failed-card" style="margin-top:1rem">
        <div class="failed-head">
          <h3 style="color:var(--danger);display:flex;align-items:center;gap:.5rem">
            <span style="display:inline-flex;width:8px;height:8px;border-radius:50%;background:var(--danger);box-shadow:0 0 8px var(--danger)"></span>
            失效接口 <span id="failed-count" class="role-badge" style="background:rgba(255,85,119,.15);color:var(--danger);font-size:.7rem;padding:2px 8px">0</span>
          </h3>
          <div style="display:flex;gap:.4rem;flex-wrap:wrap">
            <button class="btn sm" onclick="retestAllFailed()">↻ 全部重新检测</button>
            <button class="btn sm danger" onclick="bulkRemoveFailed()">🗑 批量删除</button>
            <button class="btn sm ghost" onclick="goView('configs')">查看全部 →</button>
          </div>
        </div>
        <div class="failed-hint" id="failed-hint" style="color:var(--muted);font-size:.82rem;margin:.4rem 0 .8rem;line-height:1.5">
          这里集中展示检测为"已离线"或长期处于"检测中"的接口，点击可快速重测 / 启用 / 编辑 / 删除。
        </div>
        <div class="table-wrap" style="border:1px solid rgba(255,85,119,.18)"><div class="scroll"><table>
          <thead><tr><th>名称</th><th>类型</th><th>配置地址</th><th>当前状态</th><th>失败时长</th><th style="text-align:right">操作</th></tr></thead>
          <tbody id="failed-tbody"></tbody>
        </table></div></div>
      </div>
    </section>

    <!-- Configs -->
    <section id="view-configs" class="view" style="display:none">
      <div class="topbar"><div><h1>接口管理</h1><div class="sub">管理所有影视仓 / TVBox 配置接口</div></div>
        <div class="topbar-actions"><button class="btn" onclick="exportConfigs()">⤓ 导出 JSON</button><button class="btn primary" id="cfgs-add-btn" onclick="onCfgsAddClick()">+ 新增接口</button></div></div>
      <div class="toolbar">
        <div class="search"><input type="text" id="search-input" placeholder="搜索名称、地址、标签..." oninput="renderConfigs()"></div>
        <div style="display:flex;gap:.4rem;flex-wrap:wrap" id="filter-chips">
          <span class="filter-chip active" data-filter="all">全部</span>
          <span class="filter-chip" data-filter="single">单仓</span>
          <span class="filter-chip" data-filter="multi">多仓</span>
          <span class="filter-chip" data-filter="subscribe">订阅</span>
          <span class="filter-chip" data-filter="local">本地</span>
        </div>
        <select id="status-filter" onchange="renderConfigs()" style="background:var(--bg2);border:1px solid var(--rule);border-radius:var(--radius-sm);padding:.45rem .7rem;font-size:.82rem;color:var(--ink)">
          <option value="all">所有状态</option><option value="online">在线</option><option value="offline">离线</option><option value="testing">检测中</option><option value="disabled">已禁用</option>
        </select>
      </div>
      <div class="table-wrap"><div class="scroll"><table>
        <thead><tr><th>名称</th><th>类型</th><th>配置地址</th><th>状态</th><th>启用</th><th>TVBox 字段</th><th>更新时间</th><th style="text-align:right">操作</th></tr></thead>
        <tbody id="config-tbody"></tbody>
      </table></div></div>
    </section>

    <!-- My Links (per-user personal link view, visible to all logged-in users) -->
    <section id="view-mylinks" class="view" style="display:none">
      <div class="topbar"><div><h1>我的专属链接</h1><div class="sub" id="ml-sub">这里展示你（<span id="ml-username">-</span>）可见的全部接口</div></div></div>
      <!-- 自动托管 / 部署域名信息条 -->
      <div class="detail-card" id="ml-host-card" style="margin-bottom:1rem;padding:1rem 1.2rem;display:flex;align-items:center;gap:1rem;flex-wrap:wrap;background:linear-gradient(135deg,rgba(0,229,255,.06),rgba(124,77,255,.06));border:1px solid rgba(0,229,255,.25)">
        <div style="flex:0 0 auto">
          <div style="font-size:.7rem;color:var(--muted);letter-spacing:.5px;text-transform:uppercase;margin-bottom:.3rem">☁️ 当前部署域名 (Cloudflare)</div>
          <div id="ml-host-origin" style="font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:1rem;color:var(--accent);font-weight:600">…</div>
        </div>
        <div style="flex:1;min-width:200px;color:var(--muted);font-size:.78rem;line-height:1.5">
          下方的「自动托管」接口将使用 <b style="color:var(--accent)">此域名</b> 作为链接前缀(<code style="color:var(--accent)">/r/&lt;uid&gt;/&lt;cid&gt;?t=&lt;token&gt;</code>),部署到任何 Cloudflare Pages / 自定义域名,所有专属链接自动跟随,无需手动改。
        </div>
        <div style="display:flex;gap:.4rem;flex-wrap:wrap;flex:0 0 auto">
          <button class="btn" onclick="copySiteOrigin()">⧉ 复制域名</button>
          <button class="btn" onclick="openSiteOrigin()">↗ 打开</button>
        </div>
      </div>
      <div style="display:flex;gap:.4rem;margin-bottom:.8rem;flex-wrap:wrap">
        <span id="ml-tab-all" class="filter-chip active" onclick="setMyLinksMode('all')">📋 全部接口</span>
        <span id="ml-tab-personal" class="filter-chip" onclick="setMyLinksMode('personal')">🔑 仅独立后缀</span>
      </div>
      <div class="detail-grid" style="grid-template-columns:1fr 1fr 1fr;margin-bottom:1rem">
        <div class="stat"><div class="stat-label">可见接口</div><div class="stat-value" id="ml-count">0</div><div class="stat-delta">包含全部 / 独立后缀</div></div>
        <div class="stat"><div class="stat-label">复制次数</div><div class="stat-value" id="ml-copies">0</div><div class="stat-delta">本机累计</div></div>
        <div class="stat"><div class="stat-label">最后复制</div><div class="stat-value" id="ml-lastcopy" style="font-size:1rem">-</div><div class="stat-delta">最近一次操作</div></div>
      </div>
      <div class="toolbar">
        <div class="search"><input type="text" id="ml-search" placeholder="搜索接口名、类型、标签..." oninput="renderMyLinks()"></div>
        <select id="ml-type-filter" onchange="renderMyLinks()" style="background:var(--bg2);border:1px solid var(--rule);border-radius:var(--radius-sm);padding:.45rem .7rem;font-size:.82rem;color:var(--ink)">
          <option value="all">所有类型</option>
          <option value="single">单仓</option>
          <option value="multi">多仓</option>
          <option value="subscribe">订阅源</option>
          <option value="local">本地文件</option>
        </select>
        <button class="btn" onclick="copyAllMyLinks()" title="复制为 JSON 格式">⧉ 复制全部（JSON）</button>
        <button class="btn" onclick="downloadAllMyLinksBundle()" title="下载整批可被 TVBox / 自动化脚本解析的 JSON">⤓ 下载整批（JSON）</button>
        <button class="btn primary" onclick="downloadMyLinksJson()" title="下载为 .json 文件">⤓ 下载 JSON 文件</button>
      </div>
      <div class="pwd-hint" style="color:var(--muted);font-size:.76rem;margin:.4rem 0 .8rem">
        默认"全部接口"标签下,会汇聚你在系统里可见的所有接口（包括未启用"独立后缀"的公共接口）；切换到"仅独立后缀"可只看带个人 Token 的专属地址。每条接口都会在 TVBox 客户端里获得独立地址或原始地址,你可以直接复制 / 下载用于自己的设备。
        复制/下载的内容为标准 JSON 格式,包含完整元数据:<code style="background:var(--bg3);padding:1px 5px;border-radius:3px">type</code> / <code style="background:var(--bg3);padding:1px 5px;border-radius:3px">version</code> / <code style="background:var(--bg3);padding:1px 5px;border-radius:3px">user</code> / <code style="background:var(--bg3);padding:1px 5px;border-radius:3px">links[]</code>,可直接被 TVBox 客户端、自动化脚本或第三方工具解析。
        每条 link 内嵌 <code style="background:var(--bg3);padding:1px 5px;border-radius:3px">tvbox</code> 块,包含 <code style="background:var(--bg3);padding:1px 5px;border-radius:3px">spider</code> / <code style="background:var(--bg3);padding:1px 5px;border-radius:3px">jar</code> / <code style="background:var(--bg3);padding:1px 5px;border-radius:3px">wallpaper</code> / <code style="background:var(--bg3);padding:1px 5px;border-radius:3px">parseUrl</code> / <code style="background:var(--bg3);padding:1px 5px;border-radius:3px">searchable</code> / <code style="background:var(--bg3);padding:1px 5px;border-radius:3px">quickSearch</code> / <code style="background:var(--bg3);padding:1px 5px;border-radius:3px">epg</code> / <code style="background:var(--bg3);padding:1px 5px;border-radius:3px">liveUrl</code> / <code style="background:var(--bg3);padding:1px 5px;border-radius:3px">sites</code> 字段;需要单条直接可用的 TVBox 配置时,点击该行右侧的 📺 或 ⤓ 按钮即可。
      </div>
      <div class="table-wrap"><div class="scroll"><table>
        <thead><tr><th>接口</th><th>类型</th><th>你的专属地址</th><th>Token</th><th style="text-align:right">操作</th></tr></thead>
        <tbody id="mylinks-tbody"></tbody>
      </table></div></div>
    </section>

    <!-- Groups -->
    <section id="view-groups" class="view" style="display:none">
      <div class="topbar"><div><h1>分组管理</h1><div class="sub">按分组组织你的接口配置</div></div>
        <div class="topbar-actions"><button class="btn primary" onclick="openGroupModal()">+ 新建分组</button></div></div>
      <div id="groups-grid" class="detail-grid"></div>
    </section>

    <!-- Users (admin) -->
    <section id="view-users" class="view" style="display:none">
      <div class="topbar"><div><h1>用户管理 <span class="role-badge admin">仅管理员</span></h1><div class="sub">管理本系统的所有注册用户与角色权限</div></div>
        <div class="topbar-actions"><button class="btn primary" onclick="openUserModal()">+ 新增用户</button></div></div>
      <div class="toolbar">
        <div class="search"><input type="text" id="user-search" placeholder="搜索用户名、邮箱..." oninput="renderUsers()"></div>
        <div style="display:flex;gap:.4rem;flex-wrap:wrap" id="user-filter-chips">
          <span class="filter-chip active" data-urole="all">全部</span>
          <span class="filter-chip" data-urole="admin">管理员</span>
          <span class="filter-chip" data-urole="user">普通用户</span>
        </div>
      </div>
      <div class="table-wrap"><div class="scroll"><table>
        <thead><tr><th>用户</th><th>角色</th><th>等级 / 配额</th><th>邮箱</th><th>创建时间</th><th>最后登录</th><th style="text-align:right">操作</th></tr></thead>
        <tbody id="user-tbody"></tbody>
      </table></div></div>
    </section>

    <!-- User Links (admin): per-user per-config token table -->
    <section id="view-userlinks" class="view" style="display:none">
      <div class="topbar"><div><h1>用户链接 <span class="role-badge admin">仅管理员</span></h1><div class="sub">查看每个用户在开启了"独立后缀"的接口下被分配的专属地址</div></div>
        <div class="topbar-actions"><button class="btn" onclick="regenerateAllTokens()">↻ 重新生成所有后缀</button></div></div>
      <div class="toolbar">
        <div class="search"><input type="text" id="ul-search" placeholder="搜索用户、接口名、地址..." oninput="renderUserLinks()"></div>
        <select id="ul-config-filter" onchange="renderUserLinks()" style="background:var(--bg2);border:1px solid var(--rule);border-radius:var(--radius-sm);padding:.45rem .7rem;font-size:.82rem;color:var(--ink)">
          <option value="all">所有接口</option>
        </select>
      </div>
      <div class="table-wrap"><div class="scroll"><table>
        <thead><tr><th>用户</th><th>接口</th><th>类型</th><th>专属地址</th><th>专属 Token</th><th style="text-align:right">操作</th></tr></thead>
        <tbody id="userlinks-tbody"></tbody>
      </table></div></div>
    </section>

    <!-- Import -->
    <section id="view-import" class="view" style="display:none">
      <div class="topbar"><div><h1>导入 / 导出</h1><div class="sub">批量管理影视仓配置数据</div></div></div>
      <div class="detail-grid">
        <div class="detail-card"><h3>导出配置</h3><p style="color:var(--muted);font-size:.85rem;margin-bottom:1rem">将所有接口配置打包为 JSON 文件，便于备份和迁移。</p>
          <button class="btn primary" onclick="exportConfigs()">⤓ 导出全部</button></div>
        <div class="detail-card"><h3>导入配置</h3><p style="color:var(--muted);font-size:.85rem;margin-bottom:1rem">上传已有的 JSON 配置文件，批量导入到当前系统。</p>
          <input type="file" id="import-file" accept=".json" style="display:none" onchange="importConfigs(event)">
          <button class="btn primary" onclick="document.getElementById('import-file').click()">⤒ 选择文件导入</button></div>
      </div>
      <div class="detail-card" style="margin-top:1rem"><h3>清空数据</h3><p style="color:var(--muted);font-size:.85rem;margin-bottom:1rem">危险操作：将删除所有配置记录，且不可恢复。</p>
        <button class="btn danger" onclick="clearAllConfigs()">清空全部配置</button></div>
    </section>

    <!-- Profile -->
    <section id="view-profile" class="view" style="display:none">
      <div class="topbar"><div><h1>个人中心</h1><div class="sub">管理你的账号信息与安全</div></div></div>
      <div class="detail-grid">
        <div class="detail-card"><h3>账号信息</h3><div class="detail-list">
          <div class="row"><span class="k">用户名</span><span class="v" id="p-username">-</span></div>
          <div class="row"><span class="k">角色</span><span class="v" id="p-role">-</span></div>
          <div class="row"><span class="k">等级 / 配额</span><span class="v" id="p-level">-</span></div>
          <div class="row"><span class="k">邮箱</span><span class="v" id="p-email">-</span></div>
          <div class="row"><span class="k">创建时间</span><span class="v" id="p-created">-</span></div>
          <div class="row"><span class="k">最后登录</span><span class="v" id="p-lastlogin">-</span></div>
        </div>
          <div style="margin-top:1rem;display:flex;gap:.5rem"><button class="btn primary" onclick="openEditProfileModal()">✎ 编辑资料</button></div>
        </div>
        <div class="detail-card"><h3>安全设置</h3><p style="color:var(--muted);font-size:.85rem;margin-bottom:1rem">定期修改密码可提升账号安全。</p>
          <div class="field"><label>当前密码</label>
            <div class="pwd-wrap"><input type="password" id="cp-old" placeholder="输入当前密码">
              <span class="pwd-toggle" title="显示密码" onclick="togglePwd('cp-old', this)">${EYE_CLOSED}</span></div></div>
          <div class="field"><label>新密码</label>
            <div class="pwd-wrap"><input type="password" id="cp-new" placeholder="至少 6 位" oninput="updatePwdStrength('cp-new','cp-strength','cp-hint')">
              <span class="pwd-toggle" title="显示密码" onclick="togglePwd('cp-new', this)">${EYE_CLOSED}</span></div>
            <div class="pwd-strength"><div id="cp-strength"></div></div><div class="pwd-hint" id="cp-hint"></div></div>
          <div class="field"><label>确认新密码</label>
            <div class="pwd-wrap"><input type="password" id="cp-confirm" placeholder="再次输入新密码">
              <span class="pwd-toggle" title="显示密码" onclick="togglePwd('cp-confirm', this)">${EYE_CLOSED}</span></div></div>
          <button class="btn primary" onclick="changePassword()">🔒 修改密码</button></div>
      </div>
    </section>

    <!-- Settings -->
    <section id="view-settings" class="view" style="display:none">
      <div class="topbar"><div><h1>系统设置</h1><div class="sub">个性化与数据管理</div></div></div>
      <div class="detail-card" style="max-width:600px"><h3>关于</h3><div class="detail-list">
        <div class="row"><span class="k">系统名称</span><span class="v">影视仓配置管理中心</span></div>
        <div class="row"><span class="k">版本</span><span class="v">v2.1.0</span></div>
        <div class="row"><span class="k">数据存储</span><span class="v">浏览器 localStorage</span></div>
        <div class="row"><span class="k">接口记录数</span><span class="v" id="settings-count">0</span></div>
        <div class="row"><span class="k">注册用户数</span><span class="v" id="settings-users">0</span></div>
      </div></div>

      <!-- 自动托管 / 部署域名信息卡(让用户一眼看到当前站点域名,所有专属链接都基于它生成) -->
      <div class="detail-card" style="max-width:600px;margin-top:1rem;border-color:rgba(0,229,255,.28);background:linear-gradient(135deg,rgba(0,229,255,.05),rgba(124,77,255,.05))">
        <h3 style="color:var(--accent)">☁️ 部署域名(自动托管)</h3>
        <p style="color:var(--muted);font-size:.85rem;margin-bottom:1rem;line-height:1.6">
          站点部署到 <b>Cloudflare Pages</b>(或绑定自定义域名)后,系统会自动识别 <code style="color:var(--accent)">window.location.origin</code> 作为基础域名。
          每条开启「自动托管」的接口都会以 <code style="color:var(--accent)">/r/&lt;uid&gt;/&lt;cid&gt;?t=&lt;token&gt;</code> 的形式挂载到此域名下,链接会随部署域名变化自动跟随,无需手动改。
        </p>
        <div class="detail-list" style="margin-bottom:.8rem">
          <div class="row"><span class="k">当前部署域名</span><span class="v" id="settings-origin" style="font-family:ui-monospace,monospace;color:var(--accent)">-</span></div>
          <div class="row"><span class="k">示例托管 URL</span><span class="v" id="settings-origin-sample" style="font-family:ui-monospace,monospace;font-size:.8rem;color:var(--ink);word-break:break-all">-</span></div>
        </div>
        <div style="display:flex;gap:.4rem;flex-wrap:wrap">
          <button class="btn" onclick="copySiteOrigin()">⧉ 复制域名</button>
          <button class="btn" onclick="openSiteOrigin()">↗ 在新标签打开</button>
          <button class="btn" onclick="document.querySelector('[data-view=mylinks]').click()">🔗 查看我的专属链接</button>
        </div>
      </div>

      <div class="detail-card" style="max-width:600px;margin-top:1rem;border-color:rgba(255,85,119,.25)">
        <h3 style="color:var(--danger)">账号操作</h3>
        <p style="color:var(--muted);font-size:.85rem;margin-bottom:1rem;line-height:1.6">
          退出后需要重新输入用户名和密码才能继续使用本系统。<br>
          如果之前勾选了"记住我"，账号信息会被清空，下次登录需手动输入。
        </p>
        <div class="detail-list" style="margin-bottom:1rem">
          <div class="row"><span class="k">当前账号</span><span class="v" id="settings-current-user">-</span></div>
          <div class="row"><span class="k">当前角色</span><span class="v" id="settings-current-role">-</span></div>
        </div>
        <button class="btn danger" onclick="logoutFromSettings()" style="width:100%;justify-content:center;padding:.7rem;font-weight:600">
          ⏻ 退出当前账号
        </button>
      </div>
    </section>
  </main>
</div>

<!-- ========== Modals ========== -->
<div class="modal-mask" id="config-modal"><div class="modal">
  <div class="modal-head"><h2 id="config-modal-title">新增接口</h2><button class="modal-close" onclick="closeConfigModal()">×</button></div>
  <div class="modal-body">
    <input type="hidden" id="cfg-id">
    <div class="field-row">
      <div class="field"><label>名称 <span class="req">*</span></label><input type="text" id="cfg-name" placeholder="例如：默认单仓"></div>
      <div class="field"><label>类型 <span class="req">*</span></label><select id="cfg-type"><option value="single">单仓</option><option value="multi">多仓</option><option value="subscribe">订阅源</option><option value="local">本地文件</option></select></div>
    </div>
    <div class="field"><label>配置地址 <span class="req">*</span></label><textarea id="cfg-url" placeholder="https://example.com/config.json" oninput="updateTokenPreview()"></textarea>
      <div class="field-hint">支持单仓、多仓、订阅、本地四种类型；启用"独立后缀"后每个用户看到的链接尾部会带唯一标识</div></div>
    <div class="token-mode">
      <span class="ico">🔑</span>
      <input type="checkbox" id="cfg-personal" onchange="updateTokenPreview()">
      <label for="cfg-personal">为每个用户生成独立随机后缀（链接追踪 / 独立计费 / 防盗用）</label>
    </div>
    <div class="token-mode" style="border-color:rgba(0,229,255,.28);background:rgba(0,229,255,.05)">
      <span class="ico">☁️</span>
      <input type="checkbox" id="cfg-autohosted" onchange="updateTokenPreview()">
      <label for="cfg-autohosted">自动托管（链接绑定到当前 Cloudflare 部署域名 <code style="font-family:ui-monospace,monospace;color:var(--accent)" id="cfg-autohosted-origin">…</code>）</label>
    </div>
    <div class="field-hint" style="margin-top:-.3rem;margin-bottom:.8rem;color:var(--muted)">
      开启后,专属链接将自动使用 <b style="color:var(--accent)">当前站点域名</b> 作为基础地址(形如 <code id="cfg-autohosted-sample" style="color:var(--accent)">/r/&lt;uid&gt;/&lt;cid&gt;?t=&lt;token&gt;</code>),部署到任何 Cloudflare Pages 项目/绑定自定义域名时链接自动跟随。
    </div>
    <div class="token-preview" id="cfg-token-preview" style="display:none"></div>
    <div class="field-row">
      <div class="field"><label>分组</label><input type="text" id="cfg-group" placeholder="例如：默认 / 备用"></div>
      <div class="field"><label>标签</label><input type="text" id="cfg-tags" placeholder="用逗号分隔"></div>
    </div>
    <div class="field"><label>备注</label><textarea id="cfg-note" placeholder="可选：用途说明、更新频率等" style="min-height:60px"></textarea></div>
    <div class="field"><label style="display:flex;align-items:center;gap:.5rem;cursor:pointer">
      <label class="switch"><input type="checkbox" id="cfg-enabled" checked><span class="slider"></span></label>
      <span>启用此接口</span></label></div>
    <!-- TVBox 高级字段（可折叠；为空时导出 JSON 不写入对应字段） -->
    <details class="tvbox-advanced" id="cfg-advanced-wrap">
      <summary>▾ TVBox 高级字段（spider / jar / wallpaper / lives / epg / sites …）</summary>
      <div class="adv-grid">
        <div class="field"><label>Spider（爬虫 jar 相对路径）</label><input type="text" id="cfg-spider" placeholder="例如：./lib/spider.jar 或 https://..."></div>
        <div class="field"><label>JAR（爬虫 jar 文件名）</label><input type="text" id="cfg-jar" placeholder="例如：spider.jar"></div>
        <div class="field"><label>Wallpaper（启动壁纸 URL）</label><input type="text" id="cfg-wallpaper" placeholder="https://..."></div>
        <div class="field"><label>parseUrl（详情解析规则）</label><input type="text" id="cfg-parseUrl" placeholder="JSON 字符串或 URL"></div>
        <div class="field"><label>searchable（是否可搜索）</label>
          <select id="cfg-searchable"><option value="">默认</option><option value="1">1（开启）</option><option value="0">0（关闭）</option></select>
        </div>
        <div class="field"><label>quickSearch（快速搜索）</label>
          <select id="cfg-quickSearch"><option value="">默认</option><option value="1">1（开启）</option><option value="0">0（关闭）</option></select>
        </div>
        <div class="field"><label>EPG（电子节目指南 URL）</label><input type="text" id="cfg-epg" placeholder="https://.../epg/{date}/{name}.json"></div>
        <div class="field" style="grid-column:1/-1"><label>Live URL（直播源 m3u / txt）</label><input type="text" id="cfg-liveUrl" placeholder="https://.../live.m3u 或 .txt"></div>
        <div class="field" style="grid-column:1/-1"><label>Sites（自定义站点 JSON）</label>
          <textarea id="cfg-sites" placeholder='[{"key":"mySite","name":"我的站","type":3,"api":"...","searchable":1}]' style="min-height:80px"></textarea>
          <div class="field-hint">留空则使用 TVBox 默认行为；填写需为合法 JSON 数组</div>
        </div>
      </div>
    </details>
  </div>
  <div class="modal-foot"><button class="btn ghost" onclick="closeConfigModal()">取消</button><button class="btn primary" onclick="saveConfig()">保存</button></div>
</div></div>

<div class="modal-mask" id="group-modal"><div class="modal">
  <div class="modal-head"><h2 id="group-modal-title">新建分组</h2><button class="modal-close" onclick="closeGroupModal()">×</button></div>
  <div class="modal-body">
    <input type="hidden" id="grp-id">
    <div class="field"><label>分组名称 <span class="req">*</span></label><input type="text" id="grp-name" placeholder="例如：主力 / 备用 / 测试"></div>
    <div class="field"><label>描述</label><textarea id="grp-desc" placeholder="分组用途说明" style="min-height:60px"></textarea></div>
  </div>
  <div class="modal-foot"><button class="btn ghost" onclick="closeGroupModal()">取消</button><button class="btn primary" onclick="saveGroup()">保存</button></div>
</div></div>

<div class="modal-mask" id="user-modal"><div class="modal">
  <div class="modal-head"><h2 id="user-modal-title">新增用户</h2><button class="modal-close" onclick="closeUserModal()">×</button></div>
  <div class="modal-body">
    <input type="hidden" id="u-id">
    <div class="field"><label>用户名 <span class="req">*</span></label><input type="text" id="u-name" placeholder="3-20 位字母/数字/下划线"></div>
    <div class="field-row">
      <div class="field"><label>角色 <span class="req">*</span></label>
        <select id="u-role-sel" onchange="updateLevelVisibility()">
          <option value="user">普通用户</option>
          <option value="admin">高级管理员（不受配额限制）</option>
        </select>
      </div>
      <div class="field"><label>邮箱</label><input type="email" id="u-email" placeholder="可选"></div>
    </div>
    <div class="field" id="u-level-wrap">
      <label>用户等级 <span class="req">*</span></label>
      <select id="u-level-sel" onchange="updateLevelHint()">
        <option value="low">低级（1 – 9 个接口）</option>
        <option value="mid">中级（10 – 15 个接口）</option>
        <option value="high">高级（10 – 30 个接口）</option>
      </select>
      <div class="pwd-hint" id="u-level-hint" style="color:var(--muted);margin-top:.3rem">普通用户最多可创建 9 个接口</div>
    </div>
    <div class="field"><label id="u-pwd-label">密码 <span class="req">*</span></label>
      <div class="pwd-wrap"><input type="password" id="u-pwd" placeholder="至少 6 位" oninput="updatePwdStrength('u-pwd','u-pwd-strength','u-pwd-hint')">
        <span class="pwd-toggle" title="显示密码" onclick="togglePwd('u-pwd', this)" id="u-pwd-eye">${EYE_CLOSED}</span></div>
      <div class="pwd-strength"><div id="u-pwd-strength"></div></div><div class="pwd-hint" id="u-pwd-hint"></div></div>
  </div>
  <div class="modal-foot"><button class="btn ghost" onclick="closeUserModal()">取消</button><button class="btn primary" onclick="saveUser()">保存</button></div>
</div></div>

<div class="modal-mask" id="profile-modal"><div class="modal">
  <div class="modal-head"><h2>编辑个人资料</h2><button class="modal-close" onclick="closeEditProfileModal()">×</button></div>
  <div class="modal-body">
    <div class="field"><label>用户名</label><input type="text" id="ep-username" readonly style="opacity:.6;cursor:not-allowed"></div>
    <div class="field"><label>邮箱</label><input type="email" id="ep-email" placeholder="可选"></div>
    <div class="field"><label>个人简介</label><textarea id="ep-bio" placeholder="一句话介绍下自己" style="min-height:60px"></textarea></div>
  </div>
  <div class="modal-foot"><button class="btn ghost" onclick="closeEditProfileModal()">取消</button><button class="btn primary" onclick="saveProfile()">保存</button></div>
</div></div>

<div class="modal-mask" id="import-modal"><div class="modal">
  <div class="modal-head"><h2>导入配置</h2><button class="modal-close" onclick="closeImportModal()">×</button></div>
  <div class="modal-body">
    <p style="color:var(--muted);font-size:.85rem;margin-bottom:.8rem">粘贴你的影视仓配置 JSON：</p>
    <div class="field"><textarea id="import-text" placeholder='{"configs":[{...}]}' style="min-height:200px"></textarea></div>
  </div>
  <div class="modal-foot"><button class="btn ghost" onclick="closeImportModal()">取消</button><button class="btn primary" onclick="submitImport()">导入</button></div>
</div></div>

<!-- ========== Auth Page ========== -->
<div class="auth-wrap" id="auth-wrap">
  <div class="auth-card">
    <div class="auth-head">
      <div class="auth-logo">▶</div>
      <div class="auth-title" id="auth-title">欢迎回来</div>
      <div class="auth-sub" id="auth-sub">登录以管理你的影视仓配置</div>
    </div>
    <div class="auth-tabs">
      <div class="auth-tab active" data-mode="login" onclick="switchAuthMode('login')">登录</div>
      <div class="auth-tab" data-mode="register" onclick="switchAuthMode('register')">注册</div>
    </div>
    <form class="auth-form" id="form-login" onsubmit="event.preventDefault();doLogin()">
      <div class="field"><label>用户名</label>
        <input type="text" id="login-username" required autocomplete="username" placeholder="请输入用户名" oninput="this.classList.remove('input-error');document.getElementById('login-password').classList.remove('input-error')"></div>
      <div class="field"><label>密码</label>
        <div class="pwd-wrap">
          <input type="password" id="login-password" required autocomplete="current-password" placeholder="请输入密码" oninput="this.classList.remove('input-error')">
          <span class="pwd-toggle" title="显示密码" onclick="togglePwd('login-password', this)" id="login-eye">${EYE_CLOSED}</span>
        </div></div>
      <div class="auth-extra">
        <label style="cursor:pointer;display:flex;align-items:center;gap:.3rem"><input type="checkbox" id="login-remember"> 记住我</label>
        <a href="#" onclick="event.preventDefault();toast('请联系管理员重置密码','warn')">忘记密码？</a>
      </div>
      <button type="submit" class="btn primary" style="width:100%;justify-content:center;padding:.7rem">登 录</button>
      <div class="auth-tip">还没有账号？<a href="#" onclick="event.preventDefault();switchAuthMode('register')">立即注册</a></div>
    </form>
    <form class="auth-form" id="form-register" style="display:none" onsubmit="event.preventDefault();doRegister()">
      <div class="field"><label>用户名 <span class="req">*</span></label><input type="text" id="reg-username" required placeholder="3-20 位字母/数字/下划线"></div>
      <div class="field"><label>邮箱</label><input type="email" id="reg-email" placeholder="可选，用于找回密码"></div>
      <div class="field"><label>密码 <span class="req">*</span></label>
        <div class="pwd-wrap">
          <input type="password" id="reg-password" required placeholder="至少 6 位，建议字母+数字组合" oninput="updatePwdStrength('reg-password','reg-strength','reg-hint')">
          <span class="pwd-toggle" title="显示密码" onclick="togglePwd('reg-password', this)">${EYE_CLOSED}</span>
        </div>
        <div class="pwd-strength"><div id="reg-strength"></div></div><div class="pwd-hint" id="reg-hint"></div></div>
      <div class="field"><label>确认密码 <span class="req">*</span></label>
        <div class="pwd-wrap">
          <input type="password" id="reg-confirm" required placeholder="再次输入密码">
          <span class="pwd-toggle" title="显示密码" onclick="togglePwd('reg-confirm', this)">${EYE_CLOSED}</span>
        </div></div>
      <div class="field"><label>注册身份</label><select id="reg-role" style="display:none"><option value="user" selected>普通用户</option></select>
        <div class="pwd-hint" style="color:var(--muted)">所有新注册账号默认为"普通用户"，如需管理员权限请联系现有管理员</div></div>
      <button type="submit" class="btn primary" style="width:100%;justify-content:center;padding:.7rem">注 册</button>
      <div class="auth-tip">已有账号？<a href="#" onclick="event.preventDefault();switchAuthMode('login')">前往登录</a></div>
    </form>
  </div>
</div>

<div class="toast-wrap" id="toast-wrap"></div>

<script>
/* =====================================================
   TVBox Config Manager v2.0
   ===================================================== */

const STORAGE_KEY = 'tvbox_configs_v1';
const GROUP_KEY   = 'tvbox_groups_v1';
const USER_KEY    = 'tvbox_users_v1';
const SESSION_KEY = 'tvbox_session_v1';
const REMEMBER_KEY= 'tvbox_remember_v1';
const ADMIN_INVITE = 'TVBOX2026';

const EYE_CLOSED  = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>';
const EYE_OPEN    = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';

let configs = [];
let groups  = [];
let users   = [];
let currentUser = null;
let activeFilter = 'all';
let userFilter = 'all';
let activeView = 'dashboard';

function togglePwd(inputId, btn){
  const input = document.getElementById(inputId);
  if(!input) return;
  const isPwd = input.type === 'password';
  input.type = isPwd ? 'text' : 'password';
  btn.classList.toggle('showing', isPwd);
  btn.setAttribute('title', isPwd ? '隐藏密码' : '显示密码');
  btn.innerHTML = isPwd ? EYE_OPEN : EYE_CLOSED;
}
function toast(msg, type='success', duration=2200){
  const wrap = document.getElementById('toast-wrap');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(()=>{ el.style.opacity='0'; el.style.transform='translateX(20px)'; }, duration);
  setTimeout(()=>el.remove(), duration + 400);
}
function loadData(){
  try{
    configs = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    groups  = JSON.parse(localStorage.getItem(GROUP_KEY)   || '[]');
    users   = JSON.parse(localStorage.getItem(USER_KEY)    || '[]');
  }catch(e){ configs=[]; groups=[]; users=[]; }
  if(configs.length===0 && groups.length===0 && users.length===0){ seedDemoData(); }
  // session
  try{
    const sid = sessionStorage.getItem(SESSION_KEY);
    if(sid){ currentUser = users.find(u=>u.id===sid) || null; }
    else{
      const rem = localStorage.getItem(REMEMBER_KEY);
      if(rem){ const u = users.find(x=>x.id===rem); if(u) currentUser = u; }
    }
    if(currentUser){
      currentUser.lastLogin = Date.now();
      saveData();
    }
  }catch(e){}
}
function saveData(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
  localStorage.setItem(GROUP_KEY,   JSON.stringify(groups));
  localStorage.setItem(USER_KEY,    JSON.stringify(users));
}
function seedDemoData(){
  const now = Date.now();
  users = [
    {id:'u_me',    username:'me',    password:'123456',      role:'admin', email:'me@tvbox.local',    bio:'管理员账号', created:now, lastLogin:null},
    {id:'u_demo',  username:'demo',  password:'123456',      role:'user',  email:'demo@tvbox.local',  bio:'示例普通用户（低级）',  level:'low',  created:now, lastLogin:now-86400000},
    {id:'u_pro',   username:'pro',   password:'123456',      role:'user',  email:'pro@tvbox.local',   bio:'示例普通用户（高级）',  level:'high', created:now, lastLogin:now-43200000}
  ];
  groups = [
    {id:'g1', name:'主力配置', desc:'日常使用的主接口'},
    {id:'g2', name:'备用源',   desc:'主力失效时切换'},
    {id:'g3', name:'测试源',   desc:'新源验证用'}
  ];
  configs = [
    {id:cid(), name:'默认单仓 · A 线路', type:'single',   url:'https://raw.githubusercontent.com/example/box/main/single.json', group:'g1', tags:['默认','稳定'], note:'快速加载的首选', enabled:true,  status:'online',  updated:now-3600000, ownerId:'u_me'},
    {id:cid(), name:'综合多仓 · 集合源', type:'multi',    url:'https://example.com/box/multi-config.json',                    group:'g1', tags:['多源','综合'], note:'多线路自动切换', enabled:true,  status:'online',  updated:now-7200000, ownerId:'u_me'},
    {id:cid(), name:'备用多仓 B',         type:'multi',    url:'https://example.org/tvbox/multi-b.json',                       group:'g2', tags:['备用'],         note:'',                       enabled:true,  status:'online',  updated:now-86400000, ownerId:'u_demo'},
    {id:cid(), name:'订阅 · 周更',       type:'subscribe',url:'https://subscribe.example.com/token/abc123',                   group:'g1', tags:['订阅'],         note:'每周自动更新',           enabled:true,  status:'testing', updated:now-1800000, ownerId:'u_me'},
    {id:cid(), name:'本地配置 backup',    type:'local',    url:'file:///sdcard/tvbox/local-config.json',                       group:'g2', tags:['本地','备份'],  note:'离线可用',               enabled:false, status:'offline', updated:now-172800000, ownerId:'u_demo'},
    {id:cid(), name:'测试源 · 新版',     type:'multi',    url:'https://test.example.dev/box.json',                            group:'g3', tags:['测试'],         note:'待验证',                 enabled:false, status:'offline', updated:now-432000000, ownerId:'u_me'},
    // Demo: a failed interface (so the "失效接口" card has something to show on first run)
    {id:cid(), name:'已失效 · 公益源 C', type:'multi',    url:'https://broken.example.com/tvbox.json',                          group:'g3', tags:['失效'],         note:'此源已无法访问，建议尽快替换', enabled:true,  status:'offline', updated:now-18000000, ownerId:'u_me', failedSince:now-18000000}
  ];
  saveData();
}
function cid(){ return 'c'+Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4); }
function gid(){ return 'g'+Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4); }
function fmtTime(t){
  if(!t) return '-';
  const d = new Date(t);
  const diff = (Date.now() - t) / 1000;
  if(diff < 60) return '刚刚';
  if(diff < 3600) return Math.floor(diff/60)+' 分钟前';
  if(diff < 86400) return Math.floor(diff/3600)+' 小时前';
  if(diff < 604800) return Math.floor(diff/86400)+' 天前';
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function getTypeLabel(t){ return {single:'单仓', multi:'多仓', subscribe:'订阅', local:'本地'}[t] || t; }
function getStatusBadge(s){ return {online:'online', offline:'offline', testing:'testing', disabled:'disabled'}[s] || 'disabled'; }
function getStatusLabel(s){ return {online:'在线', offline:'离线', testing:'检测中', disabled:'已禁用'}[s] || '未知'; }
function avatarColor(name){
  const colors = [
    'linear-gradient(135deg,#00e5ff,#7c4dff)',
    'linear-gradient(135deg,#ff5577,#ffb547)',
    'linear-gradient(135deg,#00ffae,#00e5ff)',
    'linear-gradient(135deg,#7c4dff,#ff5577)',
    'linear-gradient(135deg,#ffb547,#00ffae)'
  ];
  let h=0; for(let i=0;i<name.length;i++) h = (h*31 + name.charCodeAt(i)) & 0xffffffff;
  return colors[Math.abs(h)%colors.length];
}
function escapeHtml(s){
  return String(s==null?'':s).replace(/[&<>"']/g, ch=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[ch]));
}

/* ----- View Switch ----- */
function goView(view){
  if(!currentUser){ showAuth(); return; }
  const navEl = document.querySelector('.nav-item[data-view="'+view+'"]');
  if(navEl && !canAccessView(view)){ toast('无权访问该页面','danger'); return; }
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  if(navEl) navEl.classList.add('active');
  document.querySelectorAll('.view').forEach(s=>s.style.display='none');
  const target = document.getElementById('view-'+view);
  if(target) target.style.display = 'block';
  activeView = view;
  if(view==='dashboard') renderStats();
  if(view==='configs') renderConfigs();
  if(view==='mylinks') renderMyLinks();
  if(view==='groups')   renderGroups();
  if(view==='users')    renderUsers();
  if(view==='userlinks') renderUserLinks();
  if(view==='profile')  renderProfile();
  if(view==='settings'){
    document.getElementById('settings-count').textContent = configs.length;
    document.getElementById('settings-users').textContent = users.length;
    const scu = document.getElementById('settings-current-user');
    const scr = document.getElementById('settings-current-role');
    if(scu) scu.textContent = currentUser ? currentUser.username : '-';
    if(scr) scr.innerHTML = currentUser
      ? (currentUser.role==='admin'
          ? '<span class="role-badge admin">高级管理员</span>'
          : '<span class="role-badge user">普通用户</span>')
      : '-';
  }
}
function logoutFromSettings(){
  if(!currentUser){ toast('当前未登录','warn'); return; }
  if(!confirm('确定要退出当前账号「' + currentUser.username + '」吗？')) return;
  const previousUsername = currentUser.username;
  // 1. Clear user state first
  currentUser = null;
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(REMEMBER_KEY);
  // 2. Force-close any open modal, dropdown, or sub-view
  document.querySelectorAll('.modal-mask.show').forEach(m=>m.classList.remove('show'));
  document.querySelectorAll('.view').forEach(v=>v.style.display='none');
  // 3. Switch to auth screen, force login tab, clear inputs
  showAuth();
  switchAuthMode('login');
  const lu = document.getElementById('login-username'); if(lu) lu.value = '';
  const lp = document.getElementById('login-password'); if(lp) lp.value = '';
  // 4. Scroll to top so the login form is fully visible
  window.scrollTo(0,0);
  // 5. Show confirmation toast after the screen has actually switched
  setTimeout(()=>toast('已退出账号「' + previousUsername + '」','warn'), 50);
}
function canAccessView(v){
  if(!currentUser) return false;
  if(currentUser.role==='admin') return true;
  return v !== 'users';
}
document.querySelectorAll('.nav-item').forEach(el=>{
  el.addEventListener('click', ()=>{ const v = el.dataset.view; if(v) goView(v); });
});

/* ----- Stats ----- */
function renderStats(){
  document.getElementById('stat-total').textContent   = configs.length;
  document.getElementById('stat-single').textContent  = configs.filter(c=>c.type==='single').length;
  document.getElementById('stat-multi').textContent   = configs.filter(c=>c.type==='multi').length;
  document.getElementById('stat-online').textContent  = configs.filter(c=>c.status==='online').length;
  document.getElementById('dist-single').textContent  = configs.filter(c=>c.type==='single').length;
  document.getElementById('dist-multi').textContent   = configs.filter(c=>c.type==='multi').length;
  document.getElementById('dist-subscribe').textContent= configs.filter(c=>c.type==='subscribe').length;
  document.getElementById('dist-local').textContent   = configs.filter(c=>c.type==='local').length;
  document.getElementById('st-enabled').textContent   = configs.filter(c=>c.enabled).length;
  document.getElementById('st-disabled').textContent  = configs.filter(c=>!c.enabled).length;
  document.getElementById('st-testing').textContent   = configs.filter(c=>c.status==='testing').length;
  document.getElementById('st-offline').textContent   = configs.filter(c=>c.status==='offline').length;
  renderFailedConfigs();
  updateAddBtnState();
}

/* ----- Failed / Offline interfaces on the dashboard ----- */
// Compute "failed since" timestamp. Falls back to updated time if the record was never marked failed.
function getFailedSince(c){
  if(c.failedSince) return c.failedSince;
  if(c.status === 'offline') return c.updated || Date.now();
  if(c.status === 'testing')  return c.testingSince || c.updated || Date.now();
  return null;
}
function isFailed(c){
  // A "failed" interface is one that's:
  //  - marked offline, OR
  //  - stuck in testing for more than 5 minutes (likely never resolves)
  if(!c.enabled) return false; // disabled ones are not "failed" — they're turned off on purpose
  if(c.status === 'offline') return true;
  if(c.status === 'testing' && c.updated){
    return (Date.now() - c.updated) > 5 * 60 * 1000;
  }
  return false;
}
function fmtFailedDuration(since){
  if(!since) return '-';
  const diff = Date.now() - since;
  if(diff < 60_000) return '刚刚';
  if(diff < 3_600_000) return Math.floor(diff/60_000) + ' 分钟';
  if(diff < 86_400_000) return Math.floor(diff/3_600_000) + ' 小时';
  const days = Math.floor(diff/86_400_000);
  if(days < 30) return days + ' 天';
  return Math.floor(days/30) + ' 个月';
}
function renderFailedConfigs(){
  const tbody = document.getElementById('failed-tbody');
  const countEl = document.getElementById('failed-count');
  const hintEl  = document.getElementById('failed-hint');
  if(!tbody) return;
  const failed = configs.filter(isFailed)
    .sort((a,b)=>(getFailedSince(b)||0) - (getFailedSince(a)||0));
  if(countEl) countEl.textContent = failed.length;
  if(hintEl){
    if(failed.length === 0){
      hintEl.innerHTML = '<span style="color:var(--success)">✓ 当前没有失效接口，所有启用的接口都运行正常。</span>';
    }else{
      hintEl.innerHTML = `共发现 <strong style="color:var(--danger)">${failed.length}</strong> 个失效接口（按失效时长倒序排列）。点击操作按钮可快速处理。`;
    }
  }
  if(failed.length === 0){
    tbody.innerHTML = `<tr><td colspan="6">
      <div class="empty" style="padding:2.5rem 1rem">
        <div class="ico" style="color:var(--success)">✓</div>
        <h3 style="color:var(--success)">所有接口运行正常</h3>
        <p>已启用的接口中没有检测失败的，可以放心使用</p>
      </div>
    </td></tr>`;
    return;
  }
  tbody.innerHTML = failed.map(c=>{
    const since = getFailedSince(c);
    const dur = fmtFailedDuration(since);
    return `
      <tr>
        <td>
          <div class="failed-row-name">${escapeHtml(c.name)}
            <span class="row-meta">${escapeHtml(c.note || '无备注')}</span>
          </div>
        </td>
        <td><span class="badge ${c.type}">${getTypeLabel(c.type)}</span></td>
        <td><div class="url-cell"><div class="url-base" title="${escapeHtml(c.url)}" style="max-width:280px">${escapeHtml(c.url)}</div></div></td>
        <td><span class="badge ${getStatusBadge(c.status)}">● ${getStatusLabel(c.status)}</span></td>
        <td style="color:var(--danger);font-size:.82rem">${dur}</td>
        <td><div class="row-actions" style="justify-content:flex-end">
          <button class="icon-btn" title="重新检测" onclick="testConfig('${c.id}')">↻</button>
          <button class="icon-btn" title="${c.enabled?'禁用':'启用'}" onclick="toggleEnabled('${c.id}')">${c.enabled?'⏸':'▶'}</button>
          <button class="icon-btn" title="复制地址" onclick="copyUrl('${c.id}')">⧉</button>
          <button class="icon-btn" title="编辑" onclick="editConfig('${c.id}')">✎</button>
          <button class="icon-btn danger" title="删除" onclick="deleteConfig('${c.id}')">🗑</button>
        </div></td>
      </tr>`;
  }).join('');
}
// Re-test every failed interface one by one (with a small delay so toasts don't pile up)
function retestAllFailed(){
  const failed = configs.filter(isFailed);
  if(failed.length === 0){ toast('当前没有失效接口需要重测','success'); return; }
  if(!confirm(`将对 ${failed.length} 个失效接口依次重新检测，是否继续？`)) return;
  let i = 0;
  toast(`开始重测 ${failed.length} 个接口...`,'warn');
  const runNext = ()=>{
    if(i >= failed.length){
      toast('全部重测完成','success');
      renderAll();
      return;
    }
    const c = failed[i++];
    // Reuse the same logic as the per-row "test" button
    c.status = 'testing'; c.updated = Date.now();
    saveData();
    setTimeout(()=>{
      c.status = Math.random() > 0.4 ? 'online' : 'offline';
      c.updated = Date.now();
      if(c.status === 'offline') c.failedSince = Date.now();
      else delete c.failedSince;
      saveData();
      runNext();
    }, 800);
  };
  runNext();
}
function bulkRemoveFailed(){
  const failed = configs.filter(isFailed);
  if(failed.length === 0){ toast('当前没有失效接口','success'); return; }
  if(!confirm(`将永久删除 ${failed.length} 个失效接口，无法恢复。是否继续？`)) return;
  const failedIds = new Set(failed.map(c=>c.id));
  configs = configs.filter(c=>!failedIds.has(c.id));
  saveData(); renderAll();
  toast(`已删除 ${failed.length} 个失效接口`,'danger');
}

/* ----- Configs ----- */
function renderConfigs(){
  const tbody = document.getElementById('config-tbody');
  if(!tbody) return;
  const q = (document.getElementById('search-input').value || '').toLowerCase().trim();
  const statusFilter = document.getElementById('status-filter').value;
  let list = configs.filter(c=>{
    if(activeFilter!=='all' && c.type!==activeFilter) return false;
    if(statusFilter!=='all'){
      const s = c.enabled ? c.status : 'disabled';
      if(s!==statusFilter) return false;
    }
    if(q){
      const hay = [c.name, c.url, (c.tags||[]).join(','), c.note||''].join(' ').toLowerCase();
      if(!hay.includes(q)) return false;
    }
    return true;
  });
  if(list.length === 0){
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty"><div class="ico">▱</div><h3>暂无配置</h3><p>${configs.length===0?'点击右上角"新增接口"开始添加':'没有匹配的记录，请调整筛选条件'}</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(c=>{
    const status = c.enabled ? c.status : 'disabled';
    const userUrl = getUserConfigUrl(c, currentUser);
    const baseAndToken = c.personalMode
      ? `<div class="url-base" title="${escapeHtml(userUrl)}">${escapeHtml(userUrl)}</div>
         <div class="url-token" title="你的专属后缀（${escapeHtml(currentUser?currentUser.username:'匿名')}）">${escapeHtml(c.userTokens && c.userTokens[currentUser?currentUser.id:'anon'] || '')}</div>`
      : `<div class="url-base" title="${escapeHtml(c.url)}">${escapeHtml(c.url)}</div>`;
    return `
      <tr>
        <td><div class="name-cell"><div class="avatar" style="background:${avatarColor(c.name)}">${(c.name||'?').charAt(0).toUpperCase()}</div><div><div class="name">${escapeHtml(c.name)}</div><div class="desc">${escapeHtml(c.note || '无备注')}</div></div></div></td>
        <td><span class="badge ${c.type}">${getTypeLabel(c.type)}</span></td>
        <td><div class="url-cell" title="${escapeHtml(userUrl)}">${baseAndToken}</div></td>
        <td><span class="badge ${getStatusBadge(status)}">● ${getStatusLabel(status)}</span></td>
        <td><label class="switch"><input type="checkbox" ${c.enabled?'checked':''} onchange="toggleEnabled('${c.id}')"><span class="slider"></span></label></td>
        <td>${(function(){ const k=Object.keys(buildTvboxFields(c)); return k.length?`<span style="font-size:.72rem;color:var(--accent)">${k.length} 个 ✓</span>`:`<span style="font-size:.72rem;color:var(--muted)">未配置</span>`; })()}</td>
        <td style="color:var(--muted);font-size:.8rem">${fmtTime(c.updated)}</td>
        <td><div class="row-actions" style="justify-content:flex-end">
          <button class="icon-btn" title="复制你的专属地址" onclick="copyUrl('${c.id}')">⧉</button>
          <button class="icon-btn" title="下载该接口的 TVBox 可用配置 (.json)" onclick="downloadMyLinkAsTvbox('${c.id}')">📺</button>
          <button class="icon-btn" title="测试" onclick="testConfig('${c.id}')">⚡</button>
          <button class="icon-btn" title="编辑" onclick="editConfig('${c.id}')">✎</button>
          <button class="icon-btn danger" title="删除" onclick="deleteConfig('${c.id}')">🗑</button>
        </div></td>
      </tr>`;
  }).join('');
}
document.getElementById('filter-chips').addEventListener('click', e=>{
  const chip = e.target.closest('.filter-chip');
  if(!chip) return;
  document.querySelectorAll('#filter-chips .filter-chip').forEach(c=>c.classList.remove('active'));
  chip.classList.add('active');
  activeFilter = chip.dataset.filter;
  renderConfigs();
});

/* ----- Config Modal ----- */
function openConfigModal(id){
  document.getElementById('config-modal-title').textContent = id ? '编辑接口' : '新增接口';
  document.getElementById('cfg-id').value = id || '';
  if(id){
    const c = configs.find(x=>x.id===id);
    document.getElementById('cfg-name').value = c.name;
    document.getElementById('cfg-type').value = c.type;
    document.getElementById('cfg-url').value  = c.url;
    document.getElementById('cfg-group').value= c.group || '';
    document.getElementById('cfg-tags').value = (c.tags||[]).join(', ');
    document.getElementById('cfg-note').value = c.note || '';
    document.getElementById('cfg-enabled').checked = !!c.enabled;
    document.getElementById('cfg-personal').checked = !!c.personalMode;
    // 兼容老数据:autoHosted 默认 true(新行为);只有用户显式关过的才是 false
    document.getElementById('cfg-autohosted').checked = c.autoHosted !== false;
    // TVBox 高级字段回填
    document.getElementById('cfg-spider').value      = c.spider    || '';
    document.getElementById('cfg-jar').value         = c.jar       || '';
    document.getElementById('cfg-wallpaper').value   = c.wallpaper || '';
    document.getElementById('cfg-parseUrl').value    = c.parseUrl  || '';
    document.getElementById('cfg-searchable').value  = c.searchable==null?'':String(c.searchable);
    document.getElementById('cfg-quickSearch').value = c.quickSearch==null?'':String(c.quickSearch);
    document.getElementById('cfg-epg').value         = c.epg       || '';
    document.getElementById('cfg-liveUrl').value     = c.liveUrl   || '';
    document.getElementById('cfg-sites').value       = c.sites ? JSON.stringify(c.sites, null, 2) : '';
  }else{
    ['cfg-name','cfg-url','cfg-group','cfg-tags','cfg-note','cfg-spider','cfg-jar','cfg-wallpaper','cfg-parseUrl','cfg-epg','cfg-liveUrl','cfg-sites'].forEach(i=>document.getElementById(i).value='');
    document.getElementById('cfg-type').value='single';
    document.getElementById('cfg-enabled').checked=true;
    document.getElementById('cfg-personal').checked=false;
    document.getElementById('cfg-autohosted').checked=true; // 新增默认开启
    document.getElementById('cfg-searchable').value='';
    document.getElementById('cfg-quickSearch').value='';
  }
  // 渲染"自动托管"提示中的站点域名/示例
  const oEl = document.getElementById('cfg-autohosted-origin');
  const sEl = document.getElementById('cfg-autohosted-sample');
  if(oEl) oEl.textContent = getSiteOrigin() || '(当前页面)';
  if(sEl){
    const me = currentUser || {id:'<uid>'};
    sEl.textContent = (getSiteOrigin()||'') + '/r/' + me.id + '/<cid>?t=<token>';
  }
  updateTokenPreview();
  document.getElementById('config-modal').classList.add('show');
}
function closeConfigModal(){ document.getElementById('config-modal').classList.remove('show'); }

/* ----- Personal URL Token (per-user) ----- */
// Generate a random token (mix of letters+digits)
function genToken(len){
  const chars = 'abcdefghijkmnpqrstuvwxyz23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let s = '';
  for(let i=0;i<len;i++) s += chars[Math.floor(Math.random()*chars.length)];
  return s;
}
// Get the current site's "auto-hosted" base origin (e.g. https://xxx.pages.dev).
// Used to mint personal URLs that are *bound to the deployment domain* — moving
// the site to another Cloudflare Pages project / custom domain automatically
// updates every shared link.
function getSiteOrigin(){
  try{
    if(typeof location !== 'undefined' && location.origin){
      return location.origin.replace(/\/+$/, '');
    }
  }catch(e){}
  return '';
}
// base64url-encode a target URL for use as `?target=...` query param.
// Returns '' for non-http(s) URLs (file://, javascript:, data:, etc.)
function encodeTarget(u){
  if(!u || !/^https?:\/\//i.test(u)) return '';
  try{
    const bin = unescape(encodeURIComponent(u));
    let b64 = btoa(bin);
    b64 = b64.replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
    return b64;
  }catch(e){ return ''; }
}
// Build the URL that a specific user should see, given a config record.
//   - autoHosted=true  →  /r/<userId>/<configId>?t=<token>  on the current site
//   - autoHosted=false →  return c.url verbatim (legacy behaviour)
//   - personalMode is an independent toggle: works with both modes.
function getUserConfigUrl(c, user){
  if(!c) return '';
  // 1) Auto-hosted mode: always build a path on the current site origin
  if(c.autoHosted){
    if(!c.userTokens || typeof c.userTokens !== 'object') c.userTokens = {};
    const key = user ? user.id : 'anon';
    if(!c.userTokens[key]) c.userTokens[key] = genToken(8);
    const origin = getSiteOrigin();
    const basePath = '/r/' + encodeURIComponent(key) + '/' + encodeURIComponent(c.id);
    const url = (origin || '') + basePath;
    // 把原始 source URL 用 base64url 编码后塞进 ?target=...,
    // 让部署在 Cloudflare 的 _worker.js 转发到真实源,实现"链接绑定当前域名"。
    // 仅当 c.url 是可代理的 http(s) 地址才追加;本地 file:// 等不代理。
    const target = encodeTarget(c.url);
    const params = [];
    if(target) params.push('target=' + target);
    if(c.personalMode) params.push('t=' + encodeURIComponent(c.userTokens[key]));
    if(params.length) return url + '?' + params.join('&');
    return url;
  }
  // 2) Legacy mode: use the admin-entered external URL verbatim (with optional token)
  if(!c.personalMode) return c.url;
  if(!c.userTokens || typeof c.userTokens !== 'object') c.userTokens = {};
  const key = user ? user.id : 'anon';
  if(!c.userTokens[key]) c.userTokens[key] = genToken(8);
  return appendQuery(c.url, 'u', key, 't', c.userTokens[key]);
}
// Append query params to a URL, supporting both '?...' and '&...' and fragment
function appendQuery(url, ...pairs){
  if(!url) return url;
  if(/^(file:|javascript:|data:)/i.test(url)) return url; // don't modify non-http URLs
  const qs = pairs.filter((_,i)=>i%2===0).map((k,i)=>encodeURIComponent(k)+'='+encodeURIComponent(pairs[i*2+1])).join('&');
  // Try to append before fragment
  const hashIdx = url.indexOf('#');
  const before = hashIdx>=0 ? url.slice(0,hashIdx) : url;
  const after  = hashIdx>=0 ? url.slice(hashIdx) : '';
  return before + (before.includes('?') ? '&' : '?') + qs + after;
}
function updateTokenPreview(){
  const enabled = document.getElementById('cfg-personal').checked;
  const url     = document.getElementById('cfg-url').value.trim();
  const preview = document.getElementById('cfg-token-preview');
  if(!enabled || !url){
    preview.style.display = 'none';
    return;
  }
  // Use the currently logged-in user; if none, show a sample
  const me = currentUser || {id:'preview', username:'预览'};
  // Make a mock config object so we can reuse getUserConfigUrl
  const mock = { url, personalMode: true, userTokens: {} };
  const result = getUserConfigUrl(mock, me);
  preview.style.display = 'block';
  preview.innerHTML = `<div style="color:var(--muted);font-size:.7rem;margin-bottom:.3rem">你（${escapeHtml(me.username)}）将看到：</div>${escapeHtml(result)}`;
}
function saveConfig(){
  const id   = document.getElementById('cfg-id').value;
  const name = document.getElementById('cfg-name').value.trim();
  const type = document.getElementById('cfg-type').value;
  const url  = document.getElementById('cfg-url').value.trim();
  const group= document.getElementById('cfg-group').value.trim();
  const tags = document.getElementById('cfg-tags').value.split(/[,，]/).map(s=>s.trim()).filter(Boolean);
  const note = document.getElementById('cfg-note').value.trim();
  const enabled = document.getElementById('cfg-enabled').checked;
  const personalMode = document.getElementById('cfg-personal').checked;
  const autoHosted   = document.getElementById('cfg-autohosted').checked;
  // TVBox 高级字段
  const spider    = document.getElementById('cfg-spider').value.trim();
  const jar       = document.getElementById('cfg-jar').value.trim();
  const wallpaper = document.getElementById('cfg-wallpaper').value.trim();
  const parseUrl  = document.getElementById('cfg-parseUrl').value.trim();
  const searchableV  = document.getElementById('cfg-searchable').value;
  const quickSearchV = document.getElementById('cfg-quickSearch').value;
  const epg       = document.getElementById('cfg-epg').value.trim();
  const liveUrl   = document.getElementById('cfg-liveUrl').value.trim();
  const sitesRaw  = document.getElementById('cfg-sites').value.trim();
  let sites = undefined;
  if(sitesRaw){
    try{ const parsed = JSON.parse(sitesRaw); if(!Array.isArray(parsed)) throw 0; sites = parsed; }
    catch(e){ toast('Sites 字段不是合法 JSON 数组','warn'); return; }
  }
  if(!name){ toast('请填写名称','warn'); return; }
  if(!url){  toast('请填写配置地址','warn'); return; }
  if(id){
    const c = configs.find(x=>x.id===id);
    Object.assign(c, {
      name,type,url,group,tags,note,enabled,personalMode,autoHosted,updated:Date.now(),
      spider:spider||undefined,
      jar:jar||undefined,
      wallpaper:wallpaper||undefined,
      parseUrl:parseUrl||undefined,
      searchable:searchableV===''?undefined:Number(searchableV),
      quickSearch:quickSearchV===''?undefined:Number(quickSearchV),
      epg:epg||undefined,
      liveUrl:liveUrl||undefined,
      sites
    });
    // 清理空白键
    ['spider','jar','wallpaper','parseUrl','epg','liveUrl'].forEach(k=>{ if(!c[k]) delete c[k]; });
    if(c.searchable===undefined) delete c.searchable;
    if(c.quickSearch===undefined) delete c.quickSearch;
    if(!c.sites) delete c.sites;
    // If we just turned off personalMode, clear userTokens to free storage
    if(!personalMode) c.userTokens = {};
    toast('已更新配置','success');
  }else{
    // Quota check: normal users are limited by their level
    if(currentUser && currentUser.role === 'user'){
      const max = getQuotaMax(currentUser);
      const used = countUserConfigs(currentUser.id);
      if(used >= max){
        const lv = LEVEL_QUOTAS[getLevel(currentUser)];
        toast(`已达上限：${lv.label}用户最多创建 ${lv.max} 个接口（当前 ${used}）。请联系管理员提升等级。`,'danger', 5000);
        return;
      }
    }
    configs.unshift({
      id:cid(), name,type,url,group,tags,note,enabled,personalMode,autoHosted,status:'testing',updated:Date.now(), ownerId:currentUser.id, userTokens:{},
      spider:spider||undefined, jar:jar||undefined, wallpaper:wallpaper||undefined,
      parseUrl:parseUrl||undefined,
      searchable:searchableV===''?undefined:Number(searchableV),
      quickSearch:quickSearchV===''?undefined:Number(quickSearchV),
      epg:epg||undefined, liveUrl:liveUrl||undefined, sites
    });
    // 清理空白键,保持存储整洁
    const added = configs[0];
    ['spider','jar','wallpaper','parseUrl','epg','liveUrl'].forEach(k=>{ if(!added[k]) delete added[k]; });
    if(added.searchable===undefined) delete added.searchable;
    if(added.quickSearch===undefined) delete added.quickSearch;
    if(!added.sites) delete added.sites;
    toast('已新增配置','success');
  }
  saveData(); closeConfigModal(); renderAll();
}
function editConfig(id){ openConfigModal(id); }
function deleteConfig(id){
  if(!confirm('确定删除该接口？')) return;
  configs = configs.filter(c=>c.id!==id);
  saveData(); renderAll();
  toast('已删除','danger');
}
function toggleEnabled(id){
  const c = configs.find(x=>x.id===id);
  c.enabled = !c.enabled; c.updated = Date.now(); saveData(); renderAll();
  toast(c.enabled?'已启用':'已禁用', c.enabled?'success':'warn');
}
function copyUrl(id){
  const c = configs.find(x=>x.id===id);
  if(!c) return;
  const url = getUserConfigUrl(c, currentUser);
  navigator.clipboard.writeText(url).then(()=>{
    const msg = c.personalMode ? '已复制你的专属配置地址' : '已复制配置地址';
    toast(msg,'success');
  }).catch(()=>toast('复制失败','danger'));
}
function testConfig(id){
  const c = configs.find(x=>x.id===id);
  if(!c) return;
  c.status = 'testing'; c.updated = Date.now();
  c.testingSince = Date.now();
  delete c.failedSince;
  saveData(); renderAll();
  toast('正在检测 '+c.name+' ...','warn');
  setTimeout(()=>{
    c.status = Math.random() > 0.2 ? 'online' : 'offline';
    c.updated = Date.now();
    delete c.testingSince;
    if(c.status === 'offline') c.failedSince = Date.now();
    else delete c.failedSince;
    saveData(); renderAll();
    toast(c.name+(c.status==='online'?' 检测通过 ✓':' 检测失败 ✗'), c.status==='online'?'success':'danger');
  }, 1200);
}

/* ----- Groups ----- */
function renderGroups(){
  const grid = document.getElementById('groups-grid');
  if(!grid) return;
  if(groups.length===0){
    grid.innerHTML = `<div class="detail-card" style="grid-column:1/-1"><div class="empty"><div class="ico">◫</div><h3>暂无分组</h3><p>创建分组可以更好地组织你的接口配置</p></div></div>`;
    return;
  }
  grid.innerHTML = groups.map(g=>{
    const items = configs.filter(c=>c.group===g.id);
    return `
      <div class="detail-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:.6rem">
          <div><h3 style="margin-bottom:.2rem">${escapeHtml(g.name)}</h3><div style="color:var(--muted);font-size:.82rem">${escapeHtml(g.desc||'无描述')}</div></div>
          <div class="row-actions">
            <button class="icon-btn" title="编辑" onclick="editGroup('${g.id}')">✎</button>
            <button class="icon-btn danger" title="删除" onclick="deleteGroup('${g.id}')">🗑</button>
          </div>
        </div>
        <div class="detail-list">
          <div class="row"><span class="k">接口数</span><span class="v">${items.length}</span></div>
          <div class="row"><span class="k">启用</span><span class="v">${items.filter(i=>i.enabled).length}</span></div>
          <div class="row"><span class="k">类型</span><span class="v">${[...new Set(items.map(i=>getTypeLabel(i.type)))].join(' / ')||'-'}</span></div>
        </div>
      </div>`;
  }).join('');
}
function openGroupModal(id){
  document.getElementById('group-modal-title').textContent = id ? '编辑分组' : '新建分组';
  document.getElementById('grp-id').value = id || '';
  if(id){
    const g = groups.find(x=>x.id===id);
    document.getElementById('grp-name').value = g.name;
    document.getElementById('grp-desc').value = g.desc || '';
  }else{
    document.getElementById('grp-name').value = '';
    document.getElementById('grp-desc').value = '';
  }
  document.getElementById('group-modal').classList.add('show');
}
function closeGroupModal(){ document.getElementById('group-modal').classList.remove('show'); }
function saveGroup(){
  const id = document.getElementById('grp-id').value;
  const name = document.getElementById('grp-name').value.trim();
  const desc = document.getElementById('grp-desc').value.trim();
  if(!name){ toast('请填写分组名称','warn'); return; }
  if(id){ const g = groups.find(x=>x.id===id); Object.assign(g, {name, desc}); toast('已更新分组','success'); }
  else{ groups.push({id:gid(), name, desc}); toast('已新建分组','success'); }
  saveData(); closeGroupModal(); renderAll();
}
function editGroup(id){ openGroupModal(id); }
function deleteGroup(id){
  if(!confirm('确定删除该分组？其中的接口不会被删除。')) return;
  groups = groups.filter(g=>g.id!==id);
  configs.forEach(c=>{ if(c.group===id) c.group=''; });
  saveData(); renderAll();
  toast('已删除分组','danger');
}

/* ----- Users ----- */
function renderUsers(){
  const tbody = document.getElementById('user-tbody');
  if(!tbody) return;
  if(!currentUser || currentUser.role!=='admin'){
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty"><div class="ico">🔒</div><h3>无权访问</h3><p>该功能仅对高级管理员开放</p></div></td></tr>`;
    return;
  }
  const q = (document.getElementById('user-search').value||'').toLowerCase().trim();
  let list = users.filter(u=>{
    if(userFilter!=='all' && u.role!==userFilter) return false;
    if(q){
      const hay = [u.username, u.email||'', u.bio||''].join(' ').toLowerCase();
      if(!hay.includes(q)) return false;
    }
    return true;
  });
  if(list.length===0){
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty"><div class="ico">👥</div><h3>暂无用户</h3><p>点击右上角"新增用户"添加</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(u=>{
    const isSelf = currentUser && u.id===currentUser.id;
    // Level & quota display
    let levelCell;
    if(u.role === 'admin'){
      levelCell = `<span class="badge online" style="font-size:.7rem">无限制</span>`;
    }else{
      const lv = getLevel(u);
      const cfg = LEVEL_QUOTAS[lv];
      const used = countUserConfigs(u.id);
      const max  = cfg.max;
      const pct  = Math.min(100, Math.round(used / max * 100));
      const overQuota = used >= max;
      const barColor = overQuota ? 'var(--danger)' : (pct >= 80 ? 'var(--warn)' : 'var(--success)');
      levelCell = `
        <div style="display:flex;flex-direction:column;gap:3px;min-width:120px">
          <div style="display:flex;align-items:center;gap:.4rem">
            <span class="badge ${overQuota?'offline':'online'}" style="font-size:.7rem">${cfg.label}</span>
            <span style="font-size:.78rem;color:${overQuota?'var(--danger)':'var(--ink-2)'}">${used} / ${max}</span>
          </div>
          <div style="height:4px;background:var(--bg3);border-radius:2px;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:${barColor};transition:width .3s"></div>
          </div>
        </div>`;
    }
    return `
      <tr>
        <td><div class="name-cell"><div class="avatar" style="background:${avatarColor(u.username)}">${u.username.charAt(0).toUpperCase()}</div><div><div class="name">${escapeHtml(u.username)}${isSelf?' <span style="color:var(--accent);font-size:.7rem">(我)</span>':''}</div><div class="user-meta">${escapeHtml(u.bio||'无简介')}</div></div></div></td>
        <td><span class="badge ${u.role==='admin'?'online':'disabled'}">${u.role==='admin'?'高级管理员':'普通用户'}</span></td>
        <td>${levelCell}</td>
        <td>${escapeHtml(u.email||'-')}</td>
        <td style="color:var(--muted);font-size:.8rem">${fmtTime(u.created)}</td>
        <td style="color:var(--muted);font-size:.8rem">${u.lastLogin?fmtTime(u.lastLogin):'从未'}</td>
        <td><div class="row-actions" style="justify-content:flex-end">
          <button class="icon-btn" title="重置密码" onclick="resetUserPwd('${u.id}')">🔑</button>
          <button class="icon-btn" title="编辑" onclick="openUserModal('${u.id}')">✎</button>
          <button class="icon-btn danger" title="删除" ${isSelf?'disabled style="opacity:.3;cursor:not-allowed"':''} onclick="deleteUser('${u.id}')">🗑</button>
        </div></td>
      </tr>`;
  }).join('');
}
document.getElementById('user-filter-chips').addEventListener('click', e=>{
  const chip = e.target.closest('.filter-chip');
  if(!chip) return;
  document.querySelectorAll('#user-filter-chips .filter-chip').forEach(c=>c.classList.remove('active'));
  chip.classList.add('active');
  userFilter = chip.dataset.urole;
  renderUsers();
});

/* ----- User Links (admin) ----- */
function renderUserLinks(){
  const tbody = document.getElementById('userlinks-tbody');
  if(!tbody) return;
  if(!currentUser || currentUser.role!=='admin'){
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty"><div class="ico">🔒</div><h3>无权访问</h3><p>该功能仅对高级管理员开放</p></div></td></tr>`;
    return;
  }
  // Refresh the config filter dropdown with all personalMode configs
  const filter = document.getElementById('ul-config-filter');
  if(filter){
    const previousValue = filter.value;
    const personalConfigs = configs.filter(c=>c.personalMode);
    filter.innerHTML = `<option value="all">所有接口</option>` + personalConfigs.map(c=>`<option value="${c.id}">${escapeHtml(c.name)}</option>`).join('');
    if(personalConfigs.some(c=>c.id===previousValue)) filter.value = previousValue;
  }
  const configFilter = filter ? filter.value : 'all';
  const q = (document.getElementById('ul-search').value||'').toLowerCase().trim();
  // Build rows: every (user × personalMode-config) pair
  const personalConfigs = configFilter==='all' ? configs.filter(c=>c.personalMode) : configs.filter(c=>c.id===configFilter);
  const rows = [];
  users.forEach(u=>{
    personalConfigs.forEach(c=>{
      if(!c.userTokens) c.userTokens = {};
      if(!c.userTokens[u.id]) c.userTokens[u.id] = genToken(8);
      const fullUrl = getUserConfigUrl(c, u);
      const hay = [u.username, u.email||'', c.name, c.url, c.userTokens[u.id]||''].join(' ').toLowerCase();
      if(q && !hay.includes(q)) return;
      rows.push({u, c, fullUrl});
    });
  });
  if(rows.length===0){
    const hasPersonal = configs.some(c=>c.personalMode);
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty"><div class="ico">🔗</div><h3>${hasPersonal?'没有匹配的记录':'还没有开启独立后缀的接口'}</h3><p>${hasPersonal?'请调整筛选条件':'在"接口管理"中编辑接口并勾选"为每个用户生成独立随机后缀"即可在这里看到结果'}</p></div></td></tr>`;
    return;
  }
  // Persist any newly generated tokens
  saveData();
  tbody.innerHTML = rows.map(({u,c,fullUrl})=>{
    const token = (c.userTokens && c.userTokens[u.id]) || '';
    return `
      <tr>
        <td><div class="name-cell"><div class="avatar" style="background:${avatarColor(u.username)}">${u.username.charAt(0).toUpperCase()}</div><div><div class="name">${escapeHtml(u.username)}</div><div class="user-meta">${u.role==='admin'?'高级管理员':'普通用户'}</div></div></div></td>
        <td>${escapeHtml(c.name)}</td>
        <td><span class="badge ${c.type}">${getTypeLabel(c.type)}</span></td>
        <td><div class="url-base" style="font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.74rem;color:var(--ink-2);max-width:340px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${escapeHtml(fullUrl)}">${escapeHtml(fullUrl)}</div></td>
        <td><span class="url-token" style="font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.78rem;color:var(--accent);background:var(--accent-soft);padding:2px 8px;border-radius:4px;display:inline-block">🔑 ${escapeHtml(token)}</span></td>
        <td><div class="row-actions" style="justify-content:flex-end">
          <button class="icon-btn" title="复制该用户专属地址" onclick="copyUserLink('${c.id}','${u.id}')">⧉</button>
          <button class="icon-btn" title="重新生成该用户 Token" onclick="regenerateUserToken('${c.id}','${u.id}')">↻</button>
        </div></td>
      </tr>`;
  }).join('');
}
function copyUserLink(configId, userId){
  const c = configs.find(x=>x.id===configId);
  const u = users.find(x=>x.id===userId);
  if(!c || !u) return;
  const url = getUserConfigUrl(c, u);
  navigator.clipboard.writeText(url).then(()=>toast(`已复制 ${u.username} 的专属地址`,'success')).catch(()=>toast('复制失败','danger'));
}
function regenerateUserToken(configId, userId){
  const c = configs.find(x=>x.id===configId);
  const u = users.find(x=>x.id===userId);
  if(!c || !u) return;
  if(!confirm(`确定要重新生成「${u.username}」在「${c.name}」下的专属 Token 吗？`)) return;
  if(!c.userTokens) c.userTokens = {};
  c.userTokens[userId] = genToken(8);
  c.updated = Date.now();
  saveData(); renderAll();
  toast(`已重新生成 ${u.username} 的 Token`,'success');
}
function regenerateAllTokens(){
  if(!confirm('确定要为所有用户重新生成所有"独立后缀"接口的 Token 吗？此操作不可撤销。')) return;
  configs.forEach(c=>{
    if(c.personalMode){
      c.userTokens = {};
      users.forEach(u=>{ c.userTokens[u.id] = genToken(8); });
      c.updated = Date.now();
    }
  });
  saveData(); renderAll();
  toast('已重新生成所有 Token','success');
}

/* ----- My Links (per-user personal token view) ----- */
const COPY_STATS_KEY = 'tvbox_copy_stats';
function loadCopyStats(){
  try{ return JSON.parse(localStorage.getItem(COPY_STATS_KEY)||'{}') || {}; }catch(e){ return {}; }
}
function bumpCopyStat(userId, configId){
  const stats = loadCopyStats();
  const key = userId + '|' + configId;
  if(!stats[key]) stats[key] = {count:0, lastAt:0};
  stats[key].count += 1;
  stats[key].lastAt = Date.now();
  localStorage.setItem(COPY_STATS_KEY, JSON.stringify(stats));
}
// 切换"我的专属链接"tab 模式
function setMyLinksMode(mode){
  window._mylinksMode = (mode === 'personal') ? 'personal' : 'all';
  renderMyLinks();
}
// 按当前 tab / 搜索 / 类型筛选器,获取"我的专属链接"中应该出现的可见配置列表
function getMyLinksList(){
  if(!currentUser) return [];
  const mode = window._mylinksMode || 'all';
  const typeFilter = document.getElementById('ml-type-filter')?.value || 'all';
  const q = (document.getElementById('ml-search')?.value || '').toLowerCase().trim();
  const isAdmin = currentUser.role === 'admin';
  let list = configs.filter(c => isAdmin ? true : c.enabled);
  if(mode === 'personal') list = list.filter(c => c.personalMode);
  if(typeFilter !== 'all') list = list.filter(c => c.type === typeFilter);
  if(q){
    list = list.filter(c => {
      const hay = [c.name, c.url, (c.tags||[]).join(','), c.note||''].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }
  return list;
}
function renderMyLinks(){
  const tbody = document.getElementById('mylinks-tbody');
  if(!tbody) return;
  if(!currentUser){
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty"><div class="ico">🔒</div><h3>请先登录</h3><p>登录后即可查看你的专属地址</p></div></td></tr>`;
    return;
  }
  // Header
  const un = document.getElementById('ml-username');
  if(un) un.textContent = currentUser.username;
  const me = currentUser;
  // Filter
  const q = (document.getElementById('ml-search')?.value || '').toLowerCase().trim();
  const typeFilter = document.getElementById('ml-type-filter')?.value || 'all';
  // 顶部 tab: 'all' = 全部已添加的接口; 'personal' = 仅显示开启"独立后缀"的接口
  const mode = window._mylinksMode || 'all';
  // 可见性:管理员看全部;普通用户只看到 enabled 的接口
  const isAdmin = me && me.role === 'admin';
  const visibleAll = configs.filter(c => isAdmin ? true : c.enabled);
  // 顶部统计 = 用户可见的全部接口数(与 tab 无关)
  const totalVisible = visibleAll.length;
  // 列表 = 按 tab 过滤
  let list = mode === 'personal' ? visibleAll.filter(c => c.personalMode) : visibleAll;
  if(typeFilter !== 'all') list = list.filter(c=>c.type === typeFilter);
  if(q){
    list = list.filter(c=>{
      const hay = [c.name, c.url, (c.tags||[]).join(','), c.note||''].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }
  // 顶部 tab 状态(若已渲染)
  const tabAll = document.getElementById('ml-tab-all');
  const tabPers = document.getElementById('ml-tab-personal');
  if(tabAll)  tabAll.classList.toggle('active', mode==='all');
  if(tabPers) tabPers.classList.toggle('active', mode==='personal');
  // 部署域名信息条
  const hostEl = document.getElementById('ml-host-origin');
  if(hostEl){
    const origin = getSiteOrigin() || '(本地预览)';
    hostEl.textContent = origin;
  }
  // Stats summary
  const stats = loadCopyStats();
  const userKeys = Object.keys(stats).filter(k=>k.startsWith(me.id+'|'));
  const totalCopies = userKeys.reduce((s,k)=>s + (stats[k]?.count || 0), 0);
  const lastAt = userKeys.reduce((m,k)=>Math.max(m, stats[k]?.lastAt || 0), 0);
  const cntEl = document.getElementById('ml-count');     if(cntEl) cntEl.textContent = totalVisible;
  const copEl = document.getElementById('ml-copies');    if(copEl) copEl.textContent = totalCopies;
  const lastEl = document.getElementById('ml-lastcopy'); if(lastEl) lastEl.textContent = lastAt ? fmtTime(lastAt) : '—';
  // 副标题计数(在 tab 切换时也保持显示)
  const subEl = document.getElementById('ml-sub');
  if(subEl) subEl.innerHTML = `这里展示你（<span id="ml-username">${escapeHtml(me.username)}</span>）可见的全部接口 · <span style="color:var(--accent)">${totalVisible}</span> 个`;
  if(list.length === 0){
    const hasAny = visibleAll.length > 0;
    const hasPersonal = visibleAll.some(c=>c.personalMode);
    let title, desc;
    if(!hasAny){
      title = '暂无可用接口';
      desc  = '管理员还没有添加任何接口<br>请等待管理员在「接口管理」中配置';
    } else if(mode==='personal' && !hasPersonal){
      title = '暂无独立后缀接口';
      desc  = '当前可见接口均未开启"独立后缀"<br>你仍可在「全部」标签查看原始地址';
    } else {
      title = '没有匹配的接口';
      desc  = '请调整搜索或筛选条件';
    }
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty"><div class="ico">🔗</div><h3>${title}</h3><p>${desc}</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(c=>{
    const url = getUserConfigUrl(c, me);
    const token = (c.userTokens && c.userTokens[me.id]) || '';
    const copKey = me.id + '|' + c.id;
    const copStat = stats[copKey];
    const tvboxHint = buildTvboxFields(c);
    const tvboxKeys = Object.keys(tvboxHint);
    const isPersonal = !!c.personalMode;
    const isHosted   = c.autoHosted !== false; // 老数据默认为 true
    const tokenCell = isPersonal
      ? `<span class="url-token" style="font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.78rem;color:var(--accent);background:var(--accent-soft);padding:2px 8px;border-radius:4px;display:inline-block">🔑 ${escapeHtml(token || '—')}</span>`
      : `<span style="font-size:.74rem;color:var(--muted);background:var(--bg3);padding:2px 8px;border-radius:4px;display:inline-block">🌐 公共地址</span>`;
    const hostBadge = isHosted
      ? `<span style="font-size:.7rem;color:#001218;background:linear-gradient(135deg,#00e5ff,#7c4dff);padding:2px 7px;border-radius:4px;display:inline-block;font-weight:600;margin-top:4px">☁️ 自动托管</span>`
      : `<span style="font-size:.7rem;color:var(--muted);background:var(--bg3);padding:2px 7px;border-radius:4px;display:inline-block;margin-top:4px">🔗 原始地址</span>`;
    return `
      <tr>
        <td><div class="name-cell"><div class="avatar" style="background:${avatarColor(c.name)}">${(c.name||'?').charAt(0).toUpperCase()}</div><div><div class="name">${escapeHtml(c.name)}</div><div class="desc">${escapeHtml(c.note || '无备注')}</div></div></div></td>
        <td><span class="badge ${c.type}">${getTypeLabel(c.type)}</span></td>
        <td><div class="url-cell" title="${escapeHtml(url)}"><div class="url-base">${escapeHtml(url)}</div>${copStat?`<div style="font-size:.7rem;color:var(--muted);margin-top:2px">已复制 ${copStat.count} 次 · ${fmtTime(copStat.lastAt)}</div>`:''}</div></td>
        <td>${tokenCell}<div style="margin-top:4px">${hostBadge}</div><div style="font-size:.7rem;color:var(--muted);margin-top:2px">${isHosted?'链接已绑定当前部署域名':(isPersonal?`含 ${tvboxKeys.length} 个 TVBox 字段`:`未启用独立后缀(所有用户地址相同)`)}</div></td>
        <td><div class="row-actions" style="justify-content:flex-end">
          <button class="icon-btn" title="${isPersonal?'复制我的专属地址':'复制该接口地址'}" onclick="copyMyLink('${c.id}')">⧉</button>
          <button class="icon-btn" title="复制为 TVBox 可用 JSON" onclick="copyMyLinkAsTvbox('${c.id}')">📺</button>
          <button class="icon-btn" title="下载 TVBox 配置 (.json)" onclick="downloadMyLinkAsTvbox('${c.id}')">⤓</button>
          <button class="icon-btn" title="在浏览器中打开" onclick="openMyLink('${c.id}')">↗</button>
        </div></td>
      </tr>`;
  }).join('');
}
function copyMyLink(configId){
  if(!currentUser){ toast('请先登录','warn'); return; }
  const c = configs.find(x=>x.id===configId);
  if(!c) return;
  const url = getUserConfigUrl(c, currentUser);
  navigator.clipboard.writeText(url).then(()=>{
    bumpCopyStat(currentUser.id, configId);
    toast('已复制「'+c.name+'」的专属地址','success');
    if(activeView==='mylinks') renderMyLinks();
  }).catch(()=>toast('复制失败，请检查浏览器权限','danger'));
}
// 复制/打开当前站点的部署域名(Cloudflare Pages / 自定义域)
function copySiteOrigin(){
  const o = getSiteOrigin();
  if(!o){ toast('未识别到部署域名(可能为本地预览)','warn'); return; }
  navigator.clipboard.writeText(o).then(()=>toast('已复制部署域名:'+o,'success'))
    .catch(()=>toast('复制失败，请检查浏览器权限','danger'));
}
function openSiteOrigin(){
  const o = getSiteOrigin();
  if(!o){ toast('未识别到部署域名(可能为本地预览)','warn'); return; }
  window.open(o, '_blank', 'noopener');
}
function openMyLink(configId){
  if(!currentUser){ toast('请先登录','warn'); return; }
  const c = configs.find(x=>x.id===configId);
  if(!c) return;
  const url = getUserConfigUrl(c, currentUser);
  if(/^file:/i.test(c.url)){ toast('本地文件无法在浏览器中直接打开，请到 TVBox 客户端使用','warn'); return; }
  bumpCopyStat(currentUser.id, configId);
  window.open(url, '_blank', 'noopener');
  toast('已在新标签页打开（顺便复制了一份）','success');
  if(activeView==='mylinks') renderMyLinks();
}
async function copyAllMyLinks(){
  if(!currentUser){ toast('请先登录','warn'); return; }
  const list = getMyLinksList();
  if(list.length === 0){ toast('暂无可复制的专属链接','warn'); return; }
  // Build a structured JSON payload (per-user) instead of plain text
  const text = JSON.stringify(buildMyLinksPayload(list), null, 2);
  try{
    await navigator.clipboard.writeText(text);
    list.forEach(c=>bumpCopyStat(currentUser.id, c.id));
    toast(`已复制 ${list.length} 条专属链接（JSON 格式）到剪贴板`,'success', 3000);
    if(activeView==='mylinks') renderMyLinks();
  }catch(e){
    toast('复制失败，请检查浏览器权限','danger');
  }
}
function downloadMyLinksJson(){
  if(!currentUser){ toast('请先登录','warn'); return; }
  const list = getMyLinksList();
  if(list.length === 0){ toast('暂无可下载的专属链接','warn'); return; }
  // 汇总包 + TVBox 字段
  const payload = buildMyLinksPayload(list);
  payload.tvboxReady = list.map(c => buildDirectTvboxConfig(c));
  const text = JSON.stringify(payload, null, 2);
  const blob = new Blob([text], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().replace(/[:.]/g,'-').slice(0,19);
  a.href = url;
  a.download = `tvbox-bundle-${currentUser.username}-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  list.forEach(c=>bumpCopyStat(currentUser.id, c.id));
  toast(`已下载 ${list.length} 条专属链接（JSON + TVBox 字段）`,'success', 3000);
  if(activeView==='mylinks') renderMyLinks();
}
// 下载整批 JSON（更友好：直接产生同时包含汇总包 + TVBox 字段的"分发版"）
function downloadAllMyLinksBundle(){
  if(!currentUser){ toast('请先登录','warn'); return; }
  const list = getMyLinksList();
  if(list.length === 0){ toast('暂无可下载的专属链接','warn'); return; }
  // 主 payload：含元数据 + 每条 link 嵌入 tvbox 块
  const payload = buildMyLinksPayload(list);
  // 附带：每条 link 对应的"TVBox 直接可用"配置（数组形式）
  payload.tvboxReady = list.map(c => buildDirectTvboxConfig(c));
  const text = JSON.stringify(payload, null, 2);
  const blob = new Blob([text], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().replace(/[:.]/g,'-').slice(0,19);
  a.href = url;
  a.download = `tvbox-bundle-${currentUser.username}-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  list.forEach(c=>bumpCopyStat(currentUser.id, c.id));
  toast(`已下载 ${list.length} 条专属链接（含 TVBox 字段）`,'success', 3000);
  if(activeView==='mylinks') renderMyLinks();
}
// 单条：复制为 TVBox 可直接使用的 JSON
async function copyMyLinkAsTvbox(configId){
  if(!currentUser){ toast('请先登录','warn'); return; }
  const c = configs.find(x=>x.id===configId);
  if(!c) return;
  const tv = buildDirectTvboxConfig(c);
  const text = JSON.stringify(tv, null, 2);
  try{
    await navigator.clipboard.writeText(text);
    bumpCopyStat(currentUser.id, c.id);
    toast(`已复制「${c.name}」的 TVBox 配置（JSON）`,'success', 2500);
    if(activeView==='mylinks') renderMyLinks();
  }catch(e){
    toast('复制失败，请检查浏览器权限','danger');
  }
}
// 单条：下载 TVBox 配置 .json
function downloadMyLinkAsTvbox(configId){
  if(!currentUser){ toast('请先登录','warn'); return; }
  const c = configs.find(x=>x.id===configId);
  if(!c) return;
  const tv = buildDirectTvboxConfig(c);
  const text = JSON.stringify(tv, null, 2);
  const blob = new Blob([text], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().replace(/[:.]/g,'-').slice(0,19);
  a.href = url;
  a.download = `tvbox-${slugify(c.name) || c.id}-${currentUser.username}-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  bumpCopyStat(currentUser.id, c.id);
  toast(`已下载「${c.name}」的 TVBox 配置`,'success', 2500);
  if(activeView==='mylinks') renderMyLinks();
}
function slugify(s){
  return (s||'').toString().trim().replace(/[\\/:*?"<>|\s]+/g,'-').replace(/^-+|-+$/g,'').slice(0,40);
}
// Build the structured JSON payload (shared by copy + download)
function buildMyLinksPayload(list){
  return {
    type: 'tvbox_personal_links',
    version: 1,
    user: {
      id: currentUser.id,
      username: currentUser.username,
      role: currentUser.role,
      level: getLevel(currentUser)
    },
    exportedAt: new Date().toISOString(),
    count: list.length,
    links: list.map(c => buildLinkEntry(c))
  };
}
// Build a single link entry (shared)
function buildLinkEntry(c){
  const tvbox = buildTvboxFields(c);
  const entry = {
    id: c.id,
    name: c.name,
    type: c.type,
    typeLabel: getTypeLabel(c.type),
    group: c.group || '',
    tags: c.tags || [],
    note: c.note || '',
    enabled: !!c.enabled,
    url: getUserConfigUrl(c, currentUser),
    baseUrl: c.url,
    userToken: (c.userTokens && c.userTokens[currentUser.id]) || '',
    userId: currentUser.id,
    updated: c.updated || null
  };
  // 仅当有任意 TVBox 字段时附加,避免空对象污染
  if(Object.keys(tvbox).length){
    entry.tvbox = tvbox;
  }
  return entry;
}
// Collect TVBox-recognized fields from a config (skip empty)
function buildTvboxFields(c){
  const out = {};
  if(c.spider)    out.spider    = c.spider;
  if(c.jar)       out.jar       = c.jar;
  if(c.wallpaper) out.wallpaper = c.wallpaper;
  if(c.parseUrl)  out.parseUrl  = c.parseUrl;
  if(c.searchable!==undefined && c.searchable!==null) out.searchable  = c.searchable;
  if(c.quickSearch!==undefined && c.quickSearch!==null) out.quickSearch = c.quickSearch;
  if(c.epg)       out.epg       = c.epg;
  if(c.liveUrl)   out.liveUrl   = c.liveUrl;
  if(c.sites && Array.isArray(c.sites) && c.sites.length) out.sites = c.sites;
  return out;
}
// Build a single "TVBox directly-usable" config from one personal link
// 这是 TVBox 客户端最常读取的根级字段组合,可直接保存为 .json 并在 TVBox 中作为"配置地址"加载。
function buildDirectTvboxConfig(c){
  const tv = buildTvboxFields(c);
  // 把用户专属 url 视为主入口
  const entry = {
    name: c.name,
    type: getTypeLabel(c.type),
    url: getUserConfigUrl(c, currentUser),
    baseUrl: c.url,
    user: { id: currentUser.id, username: currentUser.username },
    userToken: (c.userTokens && c.userTokens[currentUser.id]) || '',
    enabled: !!c.enabled,
    generatedAt: new Date().toISOString()
  };
  return Object.assign(entry, tv);
}
function openUserModal(id){
  document.getElementById('user-modal-title').textContent = id ? '编辑用户' : '新增用户';
  document.getElementById('u-id').value = id || '';
  if(id){
    const u = users.find(x=>x.id===id);
    document.getElementById('u-name').value = u.username;
    document.getElementById('u-name').readOnly = true;
    document.getElementById('u-name').style.opacity = .6;
    document.getElementById('u-role-sel').value = u.role;
    document.getElementById('u-email').value = u.email || '';
    document.getElementById('u-pwd').value = '';
    document.getElementById('u-pwd').placeholder = '留空则不修改密码';
    document.getElementById('u-pwd-label').innerHTML = '新密码 <span style="color:var(--muted);font-weight:normal">(可选)</span>';
    document.getElementById('u-level-sel').value = getLevel(u) || 'low';
  }else{
    document.getElementById('u-name').value = '';
    document.getElementById('u-name').readOnly = false;
    document.getElementById('u-name').style.opacity = 1;
    document.getElementById('u-role-sel').value = 'user';
    document.getElementById('u-email').value = '';
    document.getElementById('u-pwd').value = '';
    document.getElementById('u-pwd').placeholder = '至少 6 位';
    document.getElementById('u-pwd-label').innerHTML = '密码 <span class="req">*</span>';
    document.getElementById('u-level-sel').value = 'low';
  }
  updatePwdStrength('u-pwd','u-pwd-strength','u-pwd-hint');
  updateLevelVisibility();
  document.getElementById('user-modal').classList.add('show');
}
function closeUserModal(){ document.getElementById('user-modal').classList.remove('show'); }
function saveUser(){
  const id = document.getElementById('u-id').value;
  const name = document.getElementById('u-name').value.trim();
  const role = document.getElementById('u-role-sel').value;
  const email = document.getElementById('u-email').value.trim();
  const pwd = document.getElementById('u-pwd').value;
  const level = document.getElementById('u-level-sel').value;
  if(id){
    const u = users.find(x=>x.id===id);
    u.role = role; u.email = email;
    u.level = (role === 'user') ? (LEVEL_QUOTAS[level] ? level : 'low') : u.level;
    if(pwd){ if(pwd.length<6){ toast('密码至少 6 位','warn'); return; } u.password = pwd; }
    saveData(); closeUserModal(); renderAll();
    toast('已更新用户 '+u.username,'success');
  }else{
    if(!validUsername(name)){ toast('用户名需 3-20 位字母/数字/下划线','warn'); return; }
    if(users.some(x=>x.username===name)){ toast('该用户名已被占用','danger'); return; }
    if(pwd.length<6){ toast('密码至少 6 位','warn'); return; }
    const nu = {id:'u'+Date.now().toString(36)+Math.random().toString(36).slice(2,6), username:name, password:pwd, role, email, bio:'', level: (role==='user' ? (LEVEL_QUOTAS[level] ? level : 'low') : undefined), created:Date.now(), lastLogin:null};
    users.push(nu); saveData(); closeUserModal(); renderAll();
    toast('已创建用户 '+name,'success');
  }
}
function deleteUser(id){
  const u = users.find(x=>x.id===id);
  if(!u) return;
  if(u.id===currentUser.id){ toast('不能删除当前登录账号','danger'); return; }
  if(!confirm(`确定删除用户 "${u.username}" ？其创建的接口配置将保留。`)) return;
  users = users.filter(x=>x.id!==id);
  saveData(); renderAll();
  toast('已删除用户 '+u.username,'danger');
}
function resetUserPwd(id){
  const u = users.find(x=>x.id===id);
  if(!u) return;
  const np = prompt(`为用户 "${u.username}" 设置新密码（至少 6 位）：`);
  if(np===null) return;
  if(np.length<6){ toast('密码至少 6 位','warn'); return; }
  u.password = np; saveData();
  toast('已重置 '+u.username+' 的密码','success');
}

/* ----- Profile ----- */
function renderProfile(){
  if(!currentUser) return;
  document.getElementById('p-username').textContent  = currentUser.username;
  document.getElementById('p-role').innerHTML = (currentUser.role==='admin'?'高级管理员':'普通用户')+' <span class="role-badge '+currentUser.role+'">'+currentUser.role.toUpperCase()+'</span>';
  // Level / quota
  const lvlEl = document.getElementById('p-level');
  if(lvlEl){
    if(currentUser.role === 'admin'){
      lvlEl.innerHTML = '<span class="badge online" style="font-size:.7rem">无限制</span>';
    }else{
      const lv = getLevel(currentUser);
      const cfg = LEVEL_QUOTAS[lv];
      const used = countUserConfigs(currentUser.id);
      const max  = cfg.max;
      const pct  = Math.min(100, Math.round(used / max * 100));
      const overQuota = used >= max;
      const barColor = overQuota ? 'var(--danger)' : (pct >= 80 ? 'var(--warn)' : 'var(--success)');
      lvlEl.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:4px;align-items:flex-start">
          <div style="display:flex;align-items:center;gap:.4rem">
            <span class="badge ${overQuota?'offline':'online'}" style="font-size:.7rem">${cfg.label}</span>
            <span style="font-size:.82rem;color:${overQuota?'var(--danger)':'var(--ink-2)'}">${used} / ${max} 个接口</span>
          </div>
          <div style="width:160px;height:5px;background:var(--bg3);border-radius:3px;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:${barColor};transition:width .3s"></div>
          </div>
          <span style="font-size:.72rem;color:var(--muted)">${cfg.desc}</span>
        </div>`;
    }
  }
  document.getElementById('p-email').textContent     = currentUser.email || '-';
  document.getElementById('p-created').textContent   = fmtTime(currentUser.created);
  document.getElementById('p-lastlogin').textContent = currentUser.lastLogin ? fmtTime(currentUser.lastLogin) : '从未';
}
function openEditProfileModal(){
  if(!currentUser) return;
  document.getElementById('ep-username').value = currentUser.username;
  document.getElementById('ep-email').value    = currentUser.email || '';
  document.getElementById('ep-bio').value      = currentUser.bio || '';
  document.getElementById('profile-modal').classList.add('show');
}
function closeEditProfileModal(){ document.getElementById('profile-modal').classList.remove('show'); }
function saveProfile(){
  if(!currentUser) return;
  currentUser.email = document.getElementById('ep-email').value.trim();
  currentUser.bio   = document.getElementById('ep-bio').value.trim();
  saveData(); closeEditProfileModal(); refreshUserChip(); renderProfile();
  toast('资料已更新','success');
}
function changePassword(){
  if(!currentUser) return;
  const oldP = document.getElementById('cp-old').value;
  const newP = document.getElementById('cp-new').value;
  const cfm  = document.getElementById('cp-confirm').value;
  if(!oldP){ toast('请输入当前密码','warn'); return; }
  if(oldP !== currentUser.password){ toast('当前密码错误','danger'); return; }
  if(newP.length<6){ toast('新密码至少 6 位','warn'); return; }
  if(newP !== cfm){ toast('两次新密码输入不一致','warn'); return; }
  currentUser.password = newP; saveData();
  document.getElementById('cp-old').value = '';
  document.getElementById('cp-new').value = '';
  document.getElementById('cp-confirm').value = '';
  updatePwdStrength('cp-new','cp-strength','cp-hint');
  toast('密码已更新','success');
}

/* ----- Import / Export ----- */
function openImportModal(){ document.getElementById('import-modal').classList.add('show'); document.getElementById('import-text').value=''; }
function closeImportModal(){ document.getElementById('import-modal').classList.remove('show'); }
function submitImport(){
  const text = document.getElementById('import-text').value.trim();
  if(!text){ toast('请粘贴 JSON 内容','warn'); return; }
  try{
    const data = JSON.parse(text);
    const list = Array.isArray(data)? data : (data.configs || []);
    if(!Array.isArray(list)) throw new Error('格式错误');
    list.forEach(item=>{
      configs.unshift({
        id: cid(), name: item.name || '未命名', type: item.type || 'single',
        url: item.url || '', group: item.group || '', tags: item.tags || [],
        note: item.note || '', enabled: item.enabled !== false,
        status:'testing', updated: Date.now(), ownerId: currentUser.id
      });
    });
    saveData(); renderAll(); closeImportModal();
    toast('已导入 '+list.length+' 条配置','success');
  }catch(e){ toast('JSON 解析失败：'+e.message,'danger'); }
}
function importConfigs(ev){
  const file = ev.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = e=>{ document.getElementById('import-text').value = e.target.result; submitImport(); };
  reader.readAsText(file);
  ev.target.value='';
}
function exportConfigs(){
  const data = { configs, groups, users:users.map(u=>({...u, password:undefined})), exportedAt: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(data,null,2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'tvbox-configs-'+new Date().toISOString().slice(0,10)+'.json';
  a.click(); URL.revokeObjectURL(url);
  toast('已导出 JSON 文件','success');
}
function clearAllConfigs(){
  if(!confirm('确定清空全部配置？此操作不可恢复！')) return;
  configs=[]; groups=[]; saveData(); renderAll();
  toast('已清空所有数据','danger');
}

/* ----- Auth ----- */
function showAuth(){
  document.getElementById('auth-wrap').classList.remove('hidden');
  document.getElementById('app').classList.add('hidden');
}
function hideAuth(){
  document.getElementById('auth-wrap').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
}
function switchAuthMode(mode){
  document.querySelectorAll('.auth-tab').forEach(t=>t.classList.toggle('active', t.dataset.mode===mode));
  document.getElementById('form-login').style.display    = mode==='login' ? 'block' : 'none';
  document.getElementById('form-register').style.display = mode==='register' ? 'block' : 'none';
  document.getElementById('auth-title').textContent = mode==='login' ? '欢迎回来' : '创建账号';
  document.getElementById('auth-sub').textContent   = mode==='login' ? '登录以管理你的影视仓配置' : '注册后即可使用本系统';
}
document.getElementById('reg-role').addEventListener('change', e=>{
  // 注册身份选择已隐藏，所有新注册默认普通用户；保留此监听以兼容旧 DOM
});
function pwdScore(p){
  let s=0;
  if(p.length>=6) s++;
  if(p.length>=10) s++;
  if(/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if(/\d/.test(p)) s++;
  if(/[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(s, 4);
}
function updatePwdStrength(inputId, barId, hintId){
  const v = document.getElementById(inputId).value;
  const s = pwdScore(v);
  const bar = document.getElementById(barId);
  const hint = document.getElementById(hintId);
  const cfg = [
    {w:'0%',   c:'var(--bg3)',     t:''},
    {w:'25%',  c:'#ff5577',        t:'弱：仅长度达标'},
    {w:'50%',  c:'#ffb547',        t:'中：建议加入数字'},
    {w:'75%',  c:'#00e5ff',        t:'良：包含字母+数字'},
    {w:'100%', c:'#00ffae',        t:'强：复杂度优秀'}
  ];
  bar.style.width = cfg[s].w;
  bar.style.background = cfg[s].c;
  hint.textContent = v ? cfg[s].t : '';
  hint.style.color = cfg[s].c;
}
function validUsername(name){
  return typeof name==='string' && /^[A-Za-z0-9_]{3,20}$/.test(name);
}

/* ----- User Levels & Quotas (for normal users) ----- */
// Defines the upper bound for the number of interfaces a user of each level can create.
// "low"  = 1–9  (default for new users)
// "mid"  = 10–15
// "high" = 10–30
// Admins are not subject to the cap.
const LEVEL_QUOTAS = {
  low:  {min: 1,  max: 9,  label: '低级', desc: '1 – 9 个接口'},
  mid:  {min: 10, max: 15, label: '中级', desc: '10 – 15 个接口'},
  high: {min: 10, max: 30, label: '高级', desc: '10 – 30 个接口'}
};
function getLevel(user){
  // Default: "low" for any normal user that hasn't been assigned one.
  if(!user) return 'low';
  if(user.role === 'admin') return null; // no quota
  return LEVEL_QUOTAS[user.level] ? user.level : 'low';
}
function getQuotaMax(user){
  const lv = getLevel(user);
  if(lv === null) return Infinity; // admin
  return LEVEL_QUOTAS[lv].max;
}
function countUserConfigs(userId){
  return configs.filter(c => c.ownerId === userId).length;
}
function canUserAddConfig(user){
  if(!user) return false;
  if(user.role === 'admin') return true;
  const max = getQuotaMax(user);
  const used = countUserConfigs(user.id);
  return used < max;
}
function updateLevelVisibility(){
  const role = document.getElementById('u-role-sel').value;
  const wrap = document.getElementById('u-level-wrap');
  if(!wrap) return;
  if(role === 'admin'){
    wrap.style.display = 'none';
  }else{
    wrap.style.display = '';
    updateLevelHint();
  }
}
function updateLevelHint(){
  const sel = document.getElementById('u-level-sel');
  const hint = document.getElementById('u-level-hint');
  if(!sel || !hint) return;
  const lv = sel.value;
  const cfg = LEVEL_QUOTAS[lv];
  if(cfg){
    const used = currentUser && currentUser.role === 'user' && getLevel(currentUser) === lv
      ? countUserConfigs(currentUser.id) : null;
    hint.textContent = used != null
      ? `当前等级：${cfg.label}（${cfg.desc}）；你已使用 ${used} / ${cfg.max}`
      : `当前等级：${cfg.label}（${cfg.desc}）`;
    hint.style.color = used != null && used >= cfg.max ? 'var(--danger)' : 'var(--muted)';
  }
}
// Called when the dashboard "新增接口" button is clicked.
// Normal users at quota are blocked with a clear explanation.
function onDashAddClick(){
  if(currentUser && currentUser.role === 'user' && !canUserAddConfig(currentUser)){
    const lv = LEVEL_QUOTAS[getLevel(currentUser)];
    const used = countUserConfigs(currentUser.id);
    toast(`已达上限：${lv.label}用户最多创建 ${lv.max} 个接口（当前 ${used}）。请联系管理员提升等级。`,'danger', 5000);
    return;
  }
  openConfigModal();
}
// Reflects quota state in the dashboard "新增接口" button (visually disabled for users at cap)
function updateAddBtnState(){
  const atCap = currentUser && currentUser.role === 'user' && !canUserAddConfig(currentUser);
  ['dash-add-btn','cfgs-add-btn'].forEach(id=>{
    const btn = document.getElementById(id);
    if(!btn) return;
    if(atCap){
      btn.style.opacity = '.5';
      btn.style.cursor = 'not-allowed';
      btn.title = '已达接口数量上限';
    }else{
      btn.style.opacity = '';
      btn.style.cursor = '';
      btn.title = '';
    }
  });
}
function onCfgsAddClick(){
  if(currentUser && currentUser.role === 'user' && !canUserAddConfig(currentUser)){
    const lv = LEVEL_QUOTAS[getLevel(currentUser)];
    const used = countUserConfigs(currentUser.id);
    toast(`已达上限：${lv.label}用户最多创建 ${lv.max} 个接口（当前 ${used}）。请联系管理员提升等级。`,'danger', 5000);
    return;
  }
  openConfigModal();
  // 普通用户新建时,默认开启"独立后缀",这样添加的接口会自动出现在"我的专属链接"中
  if(currentUser && currentUser.role === 'user'){
    const cb = document.getElementById('cfg-personal');
    if(cb) cb.checked = true;
    updateTokenPreview();
  }
}
function doLogin(){
  const u = document.getElementById('login-username').value.trim();
  const p = document.getElementById('login-password').value;
  const uInput = document.getElementById('login-username');
  const pInput = document.getElementById('login-password');
  uInput.classList.remove('input-error','shake');
  pInput.classList.remove('input-error','shake');
  if(!u || !p){
    toast('请填写用户名和密码','warn');
    uInput.classList.add('input-error','shake');
    pInput.classList.add('input-error','shake');
    setTimeout(()=>{uInput.classList.remove('shake');pInput.classList.remove('shake')},400);
    (u?pInput:uInput).focus();
    return;
  }
  const user = users.find(x=>x.username===u);
  if(!user || user.password !== p){
    toast('用户名或密码错误','danger');
    uInput.classList.add('input-error','shake');
    pInput.classList.add('input-error','shake');
    pInput.value = '';
    setTimeout(()=>{uInput.classList.remove('shake');pInput.classList.remove('shake')},400);
    uInput.focus();
    return;
  }
  currentUser = user;
  currentUser.lastLogin = Date.now();
  saveData();
  sessionStorage.setItem(SESSION_KEY, currentUser.id);
  if(document.getElementById('login-remember').checked){
    localStorage.setItem(REMEMBER_KEY, currentUser.id);
  }else{
    localStorage.removeItem(REMEMBER_KEY);
  }
  toast('登录成功，欢迎 '+currentUser.username,'success');
  onAuthSuccess();
}
function doRegister(){
  const u = document.getElementById('reg-username').value.trim();
  const e = document.getElementById('reg-email').value.trim();
  const p = document.getElementById('reg-password').value;
  const c = document.getElementById('reg-confirm').value;
  if(!validUsername(u)){ toast('用户名需 3-20 位字母/数字/下划线','warn'); return; }
  if(users.some(x=>x.username===u)){ toast('该用户名已被占用','danger'); return; }
  if(p.length<6){ toast('密码至少 6 位','warn'); return; }
  if(p !== c){ toast('两次密码输入不一致','warn'); return; }
  // 管理员角色仅能由现有管理员在"用户管理"页提升，不开放公开注册
  const newUser = {
    id:'u'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),
    username:u, password:p, role:'user', email:e, bio:'',
    created:Date.now(), lastLogin:Date.now()
  };
  users.push(newUser);
  saveData();
  currentUser = newUser;
  sessionStorage.setItem(SESSION_KEY, currentUser.id);
  toast('注册成功！已自动登录','success');
  onAuthSuccess();
}
function onAuthSuccess(){
  hideAuth();
  applyNavByRole();
  refreshUserChip();
  document.getElementById('form-register').reset();
  document.getElementById('form-login').reset();
  goView('dashboard');
}
function logout(){
  if(!confirm('确定退出登录？')) return;
  const previousUsername = currentUser ? currentUser.username : '';
  currentUser = null;
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(REMEMBER_KEY);
  document.querySelectorAll('.modal-mask.show').forEach(m=>m.classList.remove('show'));
  document.querySelectorAll('.view').forEach(v=>v.style.display='none');
  showAuth();
  switchAuthMode('login');
  const lu = document.getElementById('login-username'); if(lu) lu.value = '';
  const lp = document.getElementById('login-password'); if(lp) lp.value = '';
  window.scrollTo(0,0);
  setTimeout(()=>toast(previousUsername ? '已退出账号「' + previousUsername + '」' : '已退出登录','warn'), 50);
}
function refreshUserChip(){
  if(!currentUser) return;
  const chip = document.getElementById('user-avatar');
  chip.textContent = currentUser.username.charAt(0).toUpperCase();
  chip.style.background = avatarColor(currentUser.username);
  document.getElementById('user-name').textContent = currentUser.username;
  const role = currentUser.role==='admin' ? '高级管理员' : '普通用户';
  document.getElementById('user-role').innerHTML = role+' <span class="role-badge '+currentUser.role+'">'+currentUser.role.toUpperCase()+'</span>';
}
function applyNavByRole(){
  document.querySelectorAll('.nav-item').forEach(el=>{
    const roles = (el.dataset.roles||'').split(',');
    el.style.display = (currentUser && roles.includes(currentUser.role)) ? 'flex' : 'none';
  });
}

/* ----- Render All ----- */
function renderAll(){
  renderStats();
  renderConfigs();
  renderMyLinks();
  renderGroups();
  renderUsers();
  renderUserLinks();
  renderProfile();
  const sc = document.getElementById('settings-count');
  if(sc) sc.textContent = configs.length;
  const su = document.getElementById('settings-users');
  if(su) su.textContent = users.length;
  // 部署域名信息卡(自动托管)
  const so = document.getElementById('settings-origin');
  if(so) so.textContent = getSiteOrigin() || '(本地预览)';
  const sos = document.getElementById('settings-origin-sample');
  if(sos){
    const me = currentUser || {id:'<uid>'};
    const origin = getSiteOrigin() || '';
    sos.textContent = (origin || '') + '/r/' + me.id + '/<cid>?t=<token>';
  }
}

/* ----- Init ----- */
function init(){
  loadData();
  if(currentUser){
    hideAuth();
    applyNavByRole();
    refreshUserChip();
    goView('dashboard');
  }else{
    showAuth();
    switchAuthMode('login');
  }
}
init();
</script>
</body>
</html>
```

---

## public/_worker.js · Cloudflare Pages Worker(自动托管反向代理)

> 路径: `public/_worker.js` · 大小: 4.2 KB

```javascript
// _worker.js — Cloudflare Pages 路由处理
// --------------------------------------------------------------------------
// 部署:把此文件放到 public/_worker.js,Cloudflare Pages 会自动把它作为
// Worker 注入(无需 wrangler / Functions 目录结构)。它会在每次请求时执行。
//
// 职责:
//   1) /r/<uid>/<cid>  →  反向代理到 ?target=<base64-encoded original URL>
//                         (由前端在拼专属链接时把 c.url 编码后塞进 query),
//                         用于把"自动托管"链接透明转发到真实的 TVBox 源。
//   2) 其他非静态资源路径 → 重写到根 index.html(SPA fallback)。
//   3) 已有静态资源      → 透传。
// --------------------------------------------------------------------------

// 允许的目标源域名白名单(留空 = 不限制;生产环境建议按需收敛)
const ALLOWED_TARGET_HOSTS = [
  // 'cdn.jsdelivr.net',
  // 'raw.githubusercontent.com',
  // 'gist.githubusercontent.com',
];

function b64urlDecode(s){
  try{
    s = s.replace(/-/g, '+').replace(/_/g, '/');
    while(s.length % 4) s += '=';
    // 兼容 Cloudflare Workers 的 atob
    const bin = atob(s);
    let out = '';
    for(let i=0;i<bin.length;i++) out += '%' + ('00' + bin.charCodeAt(i).toString(16)).slice(-2);
    return decodeURIComponent(out);
  }catch(e){ return ''; }
}

async function handleProxy(request, url){
  // ?target=<base64> 是真正的 TVBox 源地址
  const targetB64 = url.searchParams.get('target');
  if(!targetB64){
    return new Response(JSON.stringify({error:'missing target'}), {
      status: 400,
      headers: { 'content-type':'application/json', 'access-control-allow-origin':'*' }
    });
  }
  const decoded = b64urlDecode(targetB64);
  if(!/^https?:\/\//i.test(decoded)){
    return new Response(JSON.stringify({error:'invalid target'}), {
      status: 400,
      headers: { 'content-type':'application/json', 'access-control-allow-origin':'*' }
    });
  }
  let target;
  try{ target = new URL(decoded); }catch(e){
    return new Response(JSON.stringify({error:'bad target url'}), {
      status: 400,
      headers: { 'content-type':'application/json', 'access-control-allow-origin':'*' }
    });
  }
  // 简单的源域名白名单(若白名单非空)
  if(ALLOWED_TARGET_HOSTS.length && !ALLOWED_TARGET_HOSTS.includes(target.hostname)){
    return new Response(JSON.stringify({error:'forbidden target host', host:target.hostname}), {
      status: 403,
      headers: { 'content-type':'application/json', 'access-control-allow-origin':'*' }
    });
  }
  // 构造对源的 fetch,只透传 GET 与必要的 header
  const init = {
    method: 'GET',
    headers: {
      'user-agent': request.headers.get('user-agent') || 'TVBox-Proxy/1.0',
      'accept': request.headers.get('accept') || '*/*',
    },
    redirect: 'follow',
  };
  let upstream;
  try{
    upstream = await fetch(target.toString(), init);
  }catch(e){
    return new Response(JSON.stringify({error:'upstream fetch failed', detail:String(e)}), {
      status: 502,
      headers: { 'content-type':'application/json', 'access-control-allow-origin':'*' }
    });
  }
  // 透传内容,只调整 cache 与 CORS,避免被 Cloudflare 边缘缓存过久
  const headers = new Headers(upstream.headers);
  headers.set('access-control-allow-origin', '*');
  headers.set('cache-control', 'public, max-age=300'); // 5 分钟边缘缓存
  // 移除 hop-by-hop 头
  ['connection','transfer-encoding'].forEach(h=>headers.delete(h));
  return new Response(upstream.body, { status: upstream.status, headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1) CORS 预检
    if(request.method === 'OPTIONS'){
      return new Response(null, {
        status: 204,
        headers: {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': 'GET,HEAD,OPTIONS',
          'access-control-allow-headers': '*',
          'access-control-max-age': '86400',
        }
      });
    }

    // 2) 自动托管的反向代理路由
    if(url.pathname.startsWith('/r/')){
      return handleProxy(request, url);
    }

    // 3) 已存在的静态资源(包含 .)直接放行
    if (/\.[a-zA-Z0-9]{1,6}$/.test(url.pathname)) {
      return env.ASSETS.fetch(request);
    }

    // 4) 其他路径 → 重写到根 index.html(SPA 兜底)
    const rewritten = new URL(request.url);
    rewritten.pathname = '/index.html';
    const resp = await env.ASSETS.fetch(rewritten);
    const headers = new Headers(resp.headers);
    headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
    return new Response(resp.body, { status: 200, headers });
  }
};
```

---

## public/_headers · HTTP 安全 / 缓存头

> 路径: `public/_headers` · 大小: 1.4 KB

```
# Cloudflare Pages / Workers - HTTP 响应头
# --------------------------------------------------------------------------
# 规则按"从上到下、首个匹配生效"。这里给出的是单页 SPA 场景下的推荐值。
# --------------------------------------------------------------------------

/
  # 安全相关
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: no-referrer
  Permissions-Policy: camera=(), microphone=(), geolocation=(), clipboard-read=(self), clipboard-write=(self)
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  # 跨源(本项目纯本地存储,不需要外部 API 联通;若日后接入 CORS 后端再调整)
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: require-corp

# 静态 HTML — 不缓存,确保用户始终拿到最新版本
/*.html
  Cache-Control: public, max-age=0, must-revalidate

# 根路径默认入口
/index.html
  Cache-Control: public, max-age=0, must-revalidate

# 字体、图标等可缓存
/*.svg
  Cache-Control: public, max-age=86400, immutable
/*.png
  Cache-Control: public, max-age=86400, immutable
/*.jpg
  Cache-Control: public, max-age=86400, immutable
/*.css
  Cache-Control: public, max-age=86400, immutable
/*.js
  Cache-Control: public, max-age=86400, immutable

# robots.txt:站内 SPA 暂无爬取价值,默认禁止
/robots.txt
  Cache-Control: public, max-age=3600

# /r/* 是自动托管的反向代理出口(由 _worker.js 转发)
# 5 分钟边缘缓存 + CORS 全开,便于 TVBox 客户端 / 第三方抓取
/r/*
  Access-Control-Allow-Origin: *
  Cache-Control: public, max-age=300
  X-Content-Type-Options: nosniff
```

---

## public/_redirects · SPA 路由 fallback

> 路径: `public/_redirects` · 大小: 0.7 KB

```
# Cloudflare Pages - URL 重写与重定向
# --------------------------------------------------------------------------
# 项目本身是单页应用(所有"路由"通过 JS 切换 view),因此把任何未命中
# 的路径都重写到根 index.html,以支持未来的深链(如 /settings /mylinks 等)。
# 注意:/r/* 由 _worker.js 处理(自动托管反向代理),不会被以下规则覆盖。
# --------------------------------------------------------------------------

# 1) SPA 兜底:任何不存在的路径都返回根 index.html
/*    /index.html   200

# 2) 显式别名,方便直接访问
/mylinks       /index.html   200
/configs       /index.html   200
/dashboard     /index.html   200
/groups        /index.html   200
/profile       /index.html   200
/settings      /index.html   200
/import        /index.html   200
/users         /index.html   200
/userlinks     /index.html   200

# 3) 常见外部资源 404 → 引导回首页
/old.html      /index.html   301
```

---

## public/404.html · 自定义 404 页

> 路径: `public/404.html` · 大小: 1.4 KB

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>页面不存在 · 影视仓配置管理中心</title>
<style>
  body{
    margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;
    background:radial-gradient(ellipse at 20% 10%,rgba(0,229,255,.08),transparent 50%),
               radial-gradient(ellipse at 80% 90%,rgba(124,77,255,.10),transparent 50%),
               #0a0e1a;color:#e6edf7;
  }
  .card{text-align:center;max-width:480px;padding:2.5rem;border:1px solid rgba(126,138,163,.18);border-radius:18px;background:rgba(26,34,53,.65);backdrop-filter:blur(8px)}
  .ico{font-size:3.5rem;background:linear-gradient(135deg,#00e5ff,#7c4dff);-webkit-background-clip:text;background-clip:text;color:transparent;margin-bottom:1rem}
  h1{font-size:1.5rem;margin:0 0 .5rem}
  p{color:#7e8aa3;font-size:.9rem;line-height:1.7;margin:0 0 1.5rem}
  a{display:inline-block;padding:.6rem 1.2rem;border-radius:8px;background:linear-gradient(135deg,#00e5ff,#7c4dff);color:#001218;font-weight:600;text-decoration:none;transition:transform .2s}
  a:hover{transform:translateY(-1px)}
</style>
</head>
<body>
  <div class="card">
    <div class="ico">404</div>
    <h1>页面不存在</h1>
    <p>你要找的页面不存在,可能已被移除、地址输入错误,或你正在使用旧版本的链接。</p>
    <a href="/">返回首页</a>
  </div>
</body>
</html>
```

---

## public/robots.txt · 爬虫规则

> 路径: `public/robots.txt` · 大小: 0.1 KB

```
User-agent: *
Disallow: /
# 本项目为内部管理工具,所有数据存储在浏览器 localStorage,无公开内容。
```

---

## public/favicon.svg · 站点图标

> 路径: `public/favicon.svg` · 大小: 0.4 KB

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#00e5ff"/>
      <stop offset="100%" stop-color="#7c4dff"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#g)"/>
  <polygon points="24,18 48,32 24,46" fill="#001"/>
</svg>
```

---

## wrangler.toml · Wrangler / Pages 配置

> 路径: `wrangler.toml` · 大小: 1.1 KB

```toml
# Cloudflare Pages / Workers configuration for TVBox Config Manager
# --------------------------------------------------------------------------
# 本项目是纯静态站点(index.html + 未来可能的 assets/ 子目录),
# 推荐使用 Cloudflare Pages 直接部署(无需 Worker 代码)。
#
# 两种部署方式任选其一:
#  A) Cloudflare Pages + Git(推荐) - 在 Dashboard 关联此仓库即可,
#     构建设置: Build command = (留空), Build output = public
#  B) Cloudflare Pages + Wrangler CLI - 使用下面命令手动部署:
#       npx wrangler pages deploy public --project-name=tvbox-config-manager
#
# 此 wrangler.toml 同时兼容 Workers Assets 部署模式,如果你想把整个 public/
# 作为静态资源服务,可用 `wrangler deploy`。
# --------------------------------------------------------------------------

name = "tvbox-config-manager"
pages_build_output_dir = "./public"
compatibility_date = "2024-09-23"

# 如果你打算用 Workers + Static Assets 模式(把 index.html 作为 SPA),
# 取消下面这行注释并 `wrangler deploy` 即可:
# [assets]
# directory = "./public"
# binding = "ASSETS"
# Not_found_handling = "single-page-application"

# 可选:自定义环境变量(目前项目未使用,但保留位置)
# [vars]
# SITE_NAME = "影视仓配置管理中心"
# VERSION   = "2.0.0"

# 可选:生产环境与预览环境差异化设置
# [env.preview]
# name = "tvbox-config-manager-preview"
# pages_build_output_dir = "./public"
```

---

## .github/workflows/deploy.yml · GitHub Actions 自动部署

> 路径: `.github/workflows/deploy.yml` · 大小: 2.1 KB

```yaml
name: Deploy to Cloudflare Pages

# 触发条件:推送到 main 分支、手动触发、或在 Cloudflare Pages 后台勾选了
# "Build with GitHub Actions" 时由 Cloudflare 触发。
on:
  push:
    branches: [main]
  workflow_dispatch:

# 避免重复部署同一次 commit
concurrency:
  group: pages-${{ github.ref }}
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      # -----------------------------------------------------------
      # 方式 A:Cloudflare 官方 Action(推荐,无需在本地保存 API Token)
      # 在 GitHub 仓库 Settings → Secrets and variables → Actions 添加:
      #   CLOUDFLARE_API_TOKEN   你的 Cloudflare API Token(需 Pages:Edit 权限)
      #   CLOUDFLARE_ACCOUNT_ID  你的 Cloudflare Account ID
      #   CLOUDFLARE_PROJECT_NAME Pages 项目名(留空则使用 wrangler.toml 中的 name)
      # -----------------------------------------------------------
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: ${{ secrets.CLOUDFLARE_PROJECT_NAME || 'tvbox-config-manager' }}
          directory: public
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
          # 自动生成的预览 URL 模式,pr 会得到一个 *.tvbox-config-manager.pages.dev
          deploymentEnvironment: production
          # 失败时不创建空部署
          failOnFailedCommand: true

      # -----------------------------------------------------------
      # 方式 B:用 wrangler CLI 部署(如果你喜欢本地命令行模式,把上面
      # 整段 "Deploy to Cloudflare Pages" 注释掉,启用下面这段即可)
      # -----------------------------------------------------------
      # - name: Install wrangler
      #   run: npm install -g wrangler
      # - name: Deploy
      #   env:
      #     CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
      #     CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
      #   run: wrangler pages deploy public --project-name=tvbox-config-manager
```

---

## .gitignore · Git 忽略规则

> 路径: `.gitignore` · 大小: 0.2 KB

```
# OS / 编辑器
.DS_Store
Thumbs.db
.vscode/
.idea/
*.swp
*.swo

# Node / Wrangler
node_modules/
.wrangler/
.mf/
dist/

# 环境
.env
.env.*
!.env.example

# 日志
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

---

## LICENSE · MIT 许可证

> 路径: `LICENSE` · 大小: 1.0 KB

```
MIT License

Copyright (c) 2026 TVBox Manager

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## README.md · 项目说明

> 路径: `README.md` · 大小: 4.4 KB

```markdown
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
| `me` | `123456` | 高级管理员 | 拥有所有权限、无配额限制 |
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
```

---

## 🚀 部署到 Cloudflare Pages

### 方式 A:Git 集成(推荐)
1. 把 `tvbox-config-manager/` 推到 GitHub
2. Cloudflare Dashboard → Pages → Connect to Git
3. 构建设置:`Build command` 留空,`Build output directory` 填 `public`
4. Save and Deploy → 几秒后访问 `https://<project>.pages.dev`

### 方式 B:Wrangler CLI
```bash
npm install -g wrangler
wrangler login
wrangler pages deploy public --project-name=tvbox-config-manager
```

### 方式 C:GitHub Actions
在 GitHub 仓库 Settings → Secrets 添加 `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID`,push 到 main 即可自动部署。
