import {getStore} from '@netlify/blobs';
export default async (req)=>{
 const s=getStore('athen'),u=new URL(req.url),k=u.searchParams.get('img'),J={'content-type':'application/json','cache-control':'no-store'};
 if(req.method==='GET'&&k){const b=await s.get('img-'+k,{type:'arrayBuffer'});return b?new Response(b,{headers:{'content-type':'image/jpeg','cache-control':'public,max-age=31536000,immutable'}}):new Response('',{status:404})}
 if(req.method==='GET'&&!u.searchParams.get('check'))return new Response(await s.get('products')||'null',{headers:J});
 const pw=(Netlify.env.get('ADMIN_PASSWORD')||'').trim();
 if(!pw)return new Response('{"error":"no_pw"}',{status:500,headers:J});
 let h='';try{h=decodeURIComponent(req.headers.get('x-admin')||'')}catch(e){}
 if(h.trim()!==pw)return new Response('{"error":"bad_pw"}',{status:401,headers:J});
 if(req.method==='GET')return new Response('{"ok":true}',{headers:J});
 if(req.method==='PUT'){const t=await req.text();if(!Array.isArray(JSON.parse(t)))return new Response('{}',{status:400});await s.set('products',t);return new Response('{}',{headers:J})}
 if(req.method==='POST'){const id=crypto.randomUUID(),d=(await req.text()).split(',')[1];await s.set('img-'+id,Uint8Array.from(atob(d),c=>c.charCodeAt(0)).buffer);return new Response(JSON.stringify({url:'/api/data?img='+id}),{headers:J})}
 return new Response('',{status:405})};
export const config={path:'/api/data'};
