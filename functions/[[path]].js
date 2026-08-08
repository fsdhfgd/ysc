// functions/[[path]].js — Cloudflare Pages Functions 路由处理
// --------------------------------------------------------------------------
// 部署说明:
//   Cloudflare Pages 不会读取 public/_worker.js,只识别 functions/ 目录。
//   任意一个文件路径形如 functions/<route>.js(或 functions/[[path]].js 兜底),
//   Cloudflare 就会把它当作 Functions Worker 自动部署。
//
// 职责:
//   1) /r/<uid>/<cid>  →  反向代理到 ?target=<base64-encoded original URL>
//                         (由前端在拼专属链接时把 c.url 编码后塞进 query),
//                         用于把"自动托管"链接透明转发到真实的 TVBox 源。
//   2) 其他路径         → 放行静态资源 / SPA 兜底。
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
    for(let i = 0; i < bin.length; i++){
      out += '%' + ('00' + bin.charCodeAt(i).toString(16)).slice(-2);
    }
    return decodeURIComponent(out);
  }catch(e){ return ''; }
}

function corsHeaders(extra){
  const h = new Headers(extra || {});
  h.set('access-control-allow-origin', '*');
  h.set('access-control-allow-methods', 'GET,HEAD,OPTIONS');
  h.set('access-control-allow-headers', '*');
  h.set('access-control-max-age', '86400');
  return h;
}

async function handleProxy(request, url){
  // ?target=<base64> 是真正的 TVBox 源地址
  const targetB64 = url.searchParams.get('target');
  if(!targetB64){
    return new Response(JSON.stringify({error:'missing target'}), {
      status: 400,
      headers: corsHeaders({ 'content-type':'application/json' }),
    });
  }
  const decoded = b64urlDecode(targetB64);
  if(!/^https?:\/\//i.test(decoded)){
    return new Response(JSON.stringify({error:'invalid target'}), {
      status: 400,
      headers: corsHeaders({ 'content-type':'application/json' }),
    });
  }
  let target;
  try{ target = new URL(decoded); }catch(e){
    return new Response(JSON.stringify({error:'bad target url'}), {
      status: 400,
      headers: corsHeaders({ 'content-type':'application/json' }),
    });
  }
  // 简单的源域名白名单(若白名单非空)
  if(ALLOWED_TARGET_HOSTS.length && !ALLOWED_TARGET_HOSTS.includes(target.hostname)){
    return new Response(JSON.stringify({error:'forbidden target host', host:target.hostname}), {
      status: 403,
      headers: corsHeaders({ 'content-type':'application/json' }),
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
      headers: corsHeaders({ 'content-type':'application/json' }),
    });
  }
  // 透传内容,只调整 cache 与 CORS,避免被 Cloudflare 边缘缓存过久
  const headers = new Headers(upstream.headers);
  headers.set('access-control-allow-origin', '*');
  headers.set('cache-control', 'public, max-age=300'); // 5 分钟边缘缓存
  // 移除 hop-by-hop 头
  ['connection','transfer-encoding'].forEach(h => headers.delete(h));
  return new Response(upstream.body, { status: upstream.status, headers });
}

// Cloudflare Pages Functions 标准导出
// 捕获所有路径(包括 SPA 兜底),由内部判断是代理 / 静态 / 重写
export async function onRequest(context){
  const { request, env, next } = context;
  const url = new URL(request.url);

  // 1) CORS 预检
  if(request.method === 'OPTIONS'){
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  // 2) 自动托管的反向代理路由
  if(url.pathname.startsWith('/r/')){
    return handleProxy(request, url);
  }

  // 3) 其他路径 — 交给 Pages 自己的静态资源 + SPA 兜底
  //    (Cloudflare 会在最后匹配 _redirects 规则;这里 next() 即交还控制权)
  return next();
}
