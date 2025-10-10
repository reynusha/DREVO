
import React, { useEffect, useState } from 'react';

const SAMPLE_POSTS = [
  { id: 'p1', author: { name: 'Alice', username: 'alice' , avatarInitial:'A', online:true }, text: 'Hello from Moscow! 馃寙', images: [] },
  { id: 'p2', author: { name: 'Bob', username: 'bob', avatarInitial:'B', online:false }, text: 'Check out this cool picture', images: ['https://i.postimg.cc/x1MzBqft/ezgif-78d2cebd8effbe.gif'] },
  { id: 'p3', author: { name: 'Carol', username: 'carol', avatarInitial:'C', online:true }, text: 'Good morning everyone 鈽�锔�', images: [] }
];

export default function Feed({ user }){
  const [posts, setPosts] = useState(() => {
    const stored = localStorage.getItem('demo_posts');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('demo_posts', JSON.stringify(SAMPLE_POSTS));
    return SAMPLE_POSTS;
  });
  const [text,setText] = useState('');
  const [imgUrl,setImgUrl] = useState('');

  useEffect(()=>{
    const onStorage = (e) => {
      if(e.key === 'demo_posts') setPosts(JSON.parse(e.newValue || '[]'));
    }
    window.addEventListener('storage', onStorage);
    return ()=> window.removeEventListener('storage', onStorage);
  },[]);

  function createPost(){
    if(!text.trim() && !imgUrl.trim()) return;
    const newPost = { id: 'p_' + Date.now(), author: { name: user.name, username: user.username, avatarInitial: user.avatarInitial, online:true }, text: text.trim(), images: imgUrl? [imgUrl.trim()]: [] };
    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem('demo_posts', JSON.stringify(updated));
    setText(''); setImgUrl('');
  }

  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',minHeight:0}}>
      <div style={{padding:12,borderBottom:'1px solid #f1f5f9',display:'flex',gap:8,alignItems:'center'}}>
        <input className="input" placeholder="Write a post..." value={text} onChange={e=>setText(e.target.value)} />
        <input className="input small" placeholder="Image URL (optional)" value={imgUrl} onChange={e=>setImgUrl(e.target.value)} />
        <button className="button small" onClick={createPost}>Post</button>
      </div>
      <div className="feed-list" role="feed">
        {posts.map(p=> (
          <article className="post" key={p.id}>
            <div className="meta">
              <div className="avatar">{p.author.avatarInitial}</div>
              <div>
                <div className="username">{p.author.name} {p.author.username==='clanffys' && <span style={{color:'#1da1f2',fontWeight:800}}>鉁旓笌</span>}</div>
                <div className="handle">@{p.author.username}</div>
              </div>
            </div>
            <div className="post-body">{p.text}</div>
            {p.images && p.images.length>0 && (
              <div style={{marginTop:10}}>
                {p.images.map((src,i)=>(<img key={i} src={src} alt="" style={{maxWidth:240,borderRadius:8}}/>))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}
