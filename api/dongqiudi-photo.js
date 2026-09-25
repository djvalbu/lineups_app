const UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
function allowedHost(host){
  return host==='qunliao.info'||host.endsWith('.qunliao.info')||host==='dongqiudi.com'||host.endsWith('.dongqiudi.com');
}
module.exports=async function handler(req,res){
  if(req.method!=='GET') return res.status(405).end('Method not allowed');
  try{
    const raw=String(req.query?.url||'');
    const u=new URL(raw);
    if(u.protocol!=='https:'||!allowedHost(u.hostname)) return res.status(400).end('Image host not allowed');
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),15000);
    let r;
    try{r=await fetch(u.toString(),{headers:{'User-Agent':UA,'Accept':'image/*,*/*'},signal:controller.signal});}
    finally{clearTimeout(timer);}
    if(!r.ok) return res.status(r.status).end('Image fetch failed');
    const ct=r.headers.get('content-type')||'image/png';
    if(!ct.startsWith('image/')) return res.status(415).end('Not an image');
    const buf=Buffer.from(await r.arrayBuffer());
    res.setHeader('Content-Type',ct);
    res.setHeader('Cache-Control','public, max-age=604800, s-maxage=604800');
    return res.status(200).send(buf);
  }catch(e){
    console.error('photo proxy error',e);
    return res.status(500).end('Image proxy error');
  }
};
