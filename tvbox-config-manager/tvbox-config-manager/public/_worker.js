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
