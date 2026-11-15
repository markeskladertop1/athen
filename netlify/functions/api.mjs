import {getStore} from '@netlify/blobs';
export default async (req)=>{
 const s=getStore('athen'),k=new URL(req.url).searchParams.get('img'),J={'content-type':'application/json','cache-control':'no-store'};
 if(req.method==='GET'&&k){const b=await s.get('img-'+k,{type:'arrayBuffer'});return b?new Response(b,{headers:{'content-type':'image/jpeg','cache-control':'public,max-age=31536000,immutable'}}):new Response('',{status:404})}
 if(req.method==='GET')return new Response(await s.get('products')||'null',{headers:J});
 const pw=Netlify.env.get('ADMIN_PASSWORD');
 if(!pw||req.headers.get('x-admin')!==pw)return new Response('{}',{status:401,headers:J});
 if(req.method==='PUT'){const t=await req.text();if(!Array.isArray(JSON.parse(t)))return new Response('{}',{status:400});await s.set('products',t);return new Response('{}',{headers:J})}
 if(req.method==='POST'){const id=crypto.randomUUID(),d=(await req.text()).split(',')[1];await s.set('img-'+id,Uint8Array.from(atob(d),c=>c.charCodeAt(0)).buffer);return new Response(JSON.stringify({url:'/api/data?img='+id}),{headers:J})}
 return new Response('',{status:405})};
export const config={path:'/api/data'};
