
import React, { useState, useEffect } from 'react';

export default function Profile({ user, updateUser }){
  const [name,setName] = useState(user.name);
  const [username,setUsername] = useState(user.username);
  const [bio,setBio] = useState(user.bio || '');
  const [avatar,setAvatar] = useState(user.avatarInitial || 'U');
  const [message,setMessage] = useState('');

  useEffect(()=>{
    setName(user.name); setUsername(user.username); setBio(user.bio||''); setAvatar(user.avatarInitial||'U');
  },[user]);

  function save(){
    updateUser({ name, username, bio, avatarInitial: avatar });
    setMessage('Profile saved. Soon usernames will be tradable as collectibles!');
    setTimeout(()=>setMessage(''),4000);
  }

  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',minHeight:0}}>
      <div className="profile">
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <div style={{width:80,height:80,borderRadius:16,display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,background:'linear-gradient(135deg,var(--accent),#45b3ff)',color:'#fff'}}>{avatar}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:800,fontSize:18}}>{name} {username==='clanffys' && <span style={{color:'#1da1f2'}}>✔︎</span>}</div>
            <div style={{color:'#6b7280'}}>@{username}</div>
          </div>
        </div>

        <div style={{marginTop:12}}>
          <label style={{fontSize:13,color:'#6b7280'}}>Display name</label>
          <input className="input" value={name} onChange={e=>setName(e.target.value)} />
          <label style={{fontSize:13,color:'#6b7280',marginTop:8}}>Username</label>
          <input className="input" value={username} onChange={e=>setUsername(e.target.value)} />
          <label style={{fontSize:13,color:'#6b7280',marginTop:8}}>Avatar initial</label>
          <input className="input small" value={avatar} onChange={e=>setAvatar(e.target.value)} />
          <label style={{fontSize:13,color:'#6b7280',marginTop:8}}>Bio / status</label>
          <textarea rows={3} className="input" value={bio} onChange={e=>setBio(e.target.value)} />
          <div style={{display:'flex',gap:8,marginTop:8}}>
            <button className="button small" onClick={save}>Save profile</button>
          </div>
          {message && <div style={{marginTop:8,color:'#047857'}}>{message}</div>}
        </div>
      </div>

      <div style={{padding:12}}>
        <h3>Posts</h3>
        <div style={{display:'grid',gap:8}} id="user-posts">
        </div>
      </div>
    </div>
  )
}
