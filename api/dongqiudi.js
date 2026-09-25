const TEAMS=[{"sourceId": "50128920", "name": "广东广州豹", "nameEn": "Guangdong GZ-Power", "logoUrl": "https://sd.qunliao.info/fastdfs7/M00/4D/07/rBUBsmXqb7SAddW6AABMAnotTkI207.png"}, {"sourceId": "50129055", "name": "深圳青年人", "nameEn": "Shenzhen Juniors", "logoUrl": "https://sd.qunliao.info/fastdfs7/M00/0D/08/rBUBsmUxDQiAII9KAACcuApA09c065.png"}, {"sourceId": "50122465", "name": "广西恒宸", "nameEn": "Guangxi Hengchen", "logoUrl": "https://sd.qunliao.info/fastdfs7/M00/52/2E/rBUBsmlDzvGAEyjwAACQTPGsMj0205.png"}, {"sourceId": "50015715", "name": "南通支云", "nameEn": "Nantong Zhiyun", "logoUrl": "https://sd.qunliao.info/fastdfs3/M00/B5/92/ChOxM1xC3GCADDjDAACIYq-FPG87912074"}, {"sourceId": "50095959", "name": "延边龙鼎", "nameEn": "Yanbian Longding", "logoUrl": "https://sd.qunliao.info/fastdfs8/M00/65/0E/rBXRn2mC3FKAcFUrAAGMayMkk4c322.png"}, {"sourceId": "50129036", "name": "陕西联合", "nameEn": "Shaanxi Union", "logoUrl": "https://sd.qunliao.info/fastdfs7/M00/D6/A1/rBUC6GiUZ8KARQniAAA74aJW_7c361.png"}, {"sourceId": "50095962", "name": "无锡吴钩", "nameEn": "Wuxi Wugo", "logoUrl": "https://sd.qunliao.info/fastdfs7/M00/2F/4F/rBUC6GWXsoeAaassAACF4r5d_FI432.png"}, {"sourceId": "50014907", "name": "宁波", "nameEn": "Ningbo Professional Football Club", "logoUrl": "https://sd.qunliao.info/fastdfs7/M00/E6/32/rBUC6Glgl_yAY7hkAAA9scgaOgc424.png"}, {"sourceId": "50000337", "name": "长春亚泰", "nameEn": "Changchun Yatai", "logoUrl": "https://sd.qunliao.info/fastdfs7/M00/05/CC/rBUC6GfJTjCAXnwFAABoJI5zAdM049.png"}, {"sourceId": "50122488", "name": "大连鲲城", "nameEn": "Dalian K'un City", "logoUrl": "https://sd.qunliao.info/fastdfs7/M00/F7/13/rBUBsmetnn6AE35JAACGaTtC8_s793.png"}, {"sourceId": "50095961", "name": "石家庄功夫", "nameEn": "Shijiazhuang Gongfu", "logoUrl": "https://sd.qunliao.info/fastdfs7/M00/E9/F4/rBUC6Gd9ACyAHRFcAACHfMsf5J4004.png"}, {"sourceId": "50015719", "name": "定南赣联", "nameEn": "Dingnan United", "logoUrl": "https://sd.qunliao.info/fastdfs7/M00/F9/80/rBUBsme0BYeAfAQGAABxe6iDvrY387.png"}, {"sourceId": "50093931", "name": "南京城市", "nameEn": "Nanjing City", "logoUrl": "https://sd.qunliao.info/fastdfs6/M00/9E/66/rBUESWJ8d1aAEDFIAABzd7dLaR4572.png"}, {"sourceId": "50016398", "name": "苏州东吴", "nameEn": "Suzhou Dongwu", "logoUrl": "https://sd.qunliao.info/fastdfs3/M00/B5/92/ChOxM1xC3HeAb6SzAACGjQi3xPE579.png"}, {"sourceId": "50014906", "name": "梅州客家", "nameEn": "Meizhou Hakka", "logoUrl": "https://sd.qunliao.info/fastdfs3/M00/C0/B0/ChOxM1xSqXGAAs4sAABZCJvj6Fs375.png"}, {"sourceId": "50095955", "name": "佛山南狮", "nameEn": "Foshan Nanshi", "logoUrl": "https://sd.qunliao.info/fastdfs7/M00/33/E7/rBUC6GWnfBOAFCynAADH_8std-U160.png"}];
const UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

async function jsonFetch(url) {
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),15000);
  try {
    const r=await fetch(url,{headers:{'User-Agent':UA,'Accept':'application/json,*/*'},cache:'no-store',signal:controller.signal});
    if(!r.ok) return null;
    return await r.json();
  } catch(e) {
    console.error('Dongqiudi fetch failed',url,e?.message||e);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function mapLimit(items,limit,fn) {
  const out=new Array(items.length);
  let next=0;
  async function worker() {
    while(true) {
      const i=next++;
      if(i>=items.length) return;
      try { out[i]=await fn(items[i],i); } catch(e) { out[i]=null; }
    }
  }
  await Promise.all(Array.from({length:Math.min(limit,items.length)},()=>worker()));
  return out;
}

async function squad(sourceId) {
  const url=`https://sport-data.dongqiudi.com/soccer/biz/dqd/v1/team/member_v2/${sourceId}?app=dqd&lang=zh-cn`;
  const payload=await jsonFetch(url);
  const groups=payload?.data?.list??[];
  const players=[];
  for(const group of groups) for(const item of (group?.data??[])) {
    if(!String(item?.scheme??'').includes('/player/')) continue;
    const num=parseInt(String(item?.shirtnumber??'').replace(/[^0-9]/g,''),10);
    players.push({
      sourceId:String(item?.person_id??''),
      name:String(item?.person_name??'').trim(),
      nameEn:item?.person_en_name??null,
      squadNumber:Number.isFinite(num)?num:0,
      position:String(item?.type??''),
      photoRemoteUrl:item?.person_logo??null
    });
  }
  return players;
}

async function detail(personId) {
  const payload=await jsonFetch(`https://www.dongqiudi.com/api/data/v1/detail/person/${personId}`);
  const base=payload?.base_info??{};
  const h=parseInt(String(base?.height??'').replace(/[^0-9]/g,''),10);
  const ft=String(base?.foot??'').trim();
  return {
    height:Number.isFinite(h)&&h>0?h:null,
    foot:ft.includes('左')?'L':ft.includes('双')?'BOTH':'R',
    nameEn:base?.person_en_name??null
  };
}

module.exports=async function handler(req,res) {
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
  const action=String(req.query?.action||'teams');
  if(action==='teams') return res.status(200).json({league:'China League One 2026',teams:TEAMS});
  if(action!=='import') return res.status(400).json({error:'Unknown action'});
  const sourceId=String(req.query?.sourceId||'');
  const team=TEAMS.find(x=>x.sourceId===sourceId);
  if(!team) return res.status(400).json({error:'Team not found in the China League One 2026 list'});
  const basic=await squad(sourceId);
  if(!basic.length) return res.status(502).json({error:'Dongqiudi did not return a squad. Try again in a moment.'});
  const details=await mapLimit(basic,6,p=>detail(p.sourceId));
  const used=new Set();
  const players=basic.map((p,i)=>{
    const d=details[i]||{};
    let num=p.squadNumber;
    if(!num||num<=0) {
      num=90;
      while(used.has(num)) num++;
    }
    used.add(num);
    return {
      ...p,
      squadNumber:num,
      nameEn:p.nameEn||d.nameEn||null,
      height:d.height??null,
      foot:d.foot||'R',
      isU21:false
    };
  });
  return res.status(200).json({league:'China League One 2026',team,players,total:players.length,fetchedAt:new Date().toISOString()});
};
