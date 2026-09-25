#!/bin/bash
cd "$(dirname "$0")"
PORT=3210
URL="http://localhost:$PORT"
( sleep 1; open "$URL" ) &
if command -v python3 >/dev/null 2>&1; then
  python3 -m http.server "$PORT"
elif command -v node >/dev/null 2>&1; then
  node -e "const http=require('http'),fs=require('fs'),path=require('path');http.createServer((q,r)=>{let p=path.join(process.cwd(),decodeURIComponent(q.url.split('?')[0]));if(q.url==='/'||q.url==='')p=path.join(process.cwd(),'index.html');fs.stat(p,(e,s)=>{if(e||!s.isFile()){r.statusCode=404;return r.end('Not found')}const ext=path.extname(p);const m={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.webmanifest':'application/manifest+json'};r.setHeader('Content-Type',m[ext]||'application/octet-stream');fs.createReadStream(p).pipe(r)})}).listen($PORT)"
else
  echo "Python 3 or Node.js is required to run the local server."
  read -n 1
fi
