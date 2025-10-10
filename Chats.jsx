
import React, { useEffect, useState, useRef } from 'react';

const BC = new BroadcastChannel('drevo_demo_channel');

export default function Chats({ user }){
  const [peers, setPeers] = useState(() => {
    const stored = localStorage.getItem('demo_users');
    if (stored) return JSON.parse(stored);
    const u = [
      { id:'alice', name:'Alice', username:'alice', avatarInitial:'A', online:true },
      { id:'bob', name:'Bob', username:'bob', avatarInitial:'B', online:false },
      { id:'clanffys', name:'Owner', username:'clanffys', avatarInitial:'C', online:true }
    ];
    localStorage.setItem('demo_users', JSON.stringify(u));
    return u;
  });
  const [search, setSearch] = useState('');
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState(() => {
    const s = localStorage.getItem('demo_messages');
    return s ? JSON.parse(s) : {};
  });
  const inputRef = useRef();

  useEffect(()=>{
    BC.postMessage({ type:'presence', user:{ id:user.id, username:user.username, name:user.name } });
    const onMsg = (ev)=>{
      const d = ev.data;
      if(d.type==='message'){
        setMessages(prev=>{
          const copy = {...prev};
          if(!copy[d.room]) copy[d.room]=[];
          copy[d.room].push(d.msg);
          localStorage.setItem('demo_messages', JSON.stringify(copy));
          return copy;
        });
      } else if(d.type==='presence'){
        setPeers(prev=> prev.map(p => p.username===d.user.username ? {...p, online:true} : p));
      }
    };
    BC.addEventListener('message', onMsg);
    return ()=> BC.removeEventListener('message', onMsg);
  },[user]);

  useEffect(()=>{
    const onUnload = ()=> { BC.postMessage({type:'leave', user:{username:user.username}}); };
    window.addEventListener('beforeunload', onUnload);
    return ()=> window.removeEventListener('beforeunload', onUnload);
  },[user]);

  function openChatWith(u){
    setActive(u.username);
  }

  function sendMessage(){
    const text = inputRef.current.value.trim();
    if(!text) return;
    const msg = { from: user.username, text, ts: Date.now() };
    const room = [user.username, active].sort().join('__');
    BC.postMessage({ type:'message', room, msg });
    inputRef.current.value='';
  }

  function searchUsers(){
    const q = search.trim().toLowerCase();
    if(!q) return;
    const found = peers.find(p => p.username.toLowerCase()===q.replace('@',''));
    if(found) openChatWith(found);
  }

  return (
    <div style={{flex:1,display:'flex',minHeight:0}}>
      <div style={{width:320,borderRight:'1px solid #f1f5f9',display:'flex',flexDirection:'column'}}>
        <div style={{padding:12}}>
          <input className="input" placeholder="Search @username" value={search} onChange={e=>setSearch(e.target.value)} />
          <div style={{display:'flex',gap:8,marginTop:8}}>
            <button className="button small" onClick={searchUsers}>Go</button>
            <button className="button small" onClick={()=>{ setSearch(''); }}>Clear</button>
          </div>
        </div>
        <div className="chats-list">
          {peers.map(p=> (
            <div key={p.username} className="chat-item" onClick={()=>openChatWith(p)}>
              <div className="avatar">{p.avatarInitial}</div>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <div style={{fontWeight:700}}>{p.name} {p.username==='clanffys' && <span style={{color:'#1da1f2'}}>✔︎</span>}</div>
                  <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:6}}>
                    <div className={`status-dot ${p.online? 'status-online':'status-off'}`}></div>
                    <div style={{fontSize:12,color:'#6b7280'}}>{p.online? 'online':'offline'}</div>
                  </div>
                </div>
                <div style={{fontSize:13,color:'#6b7280'}}>@{p.username}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="chat-window">
        {active ? (
          <>
            <div style={{padding:12,borderBottom:'1px solid #f1f5f9',display:'flex',alignItems:'center',gap:8}}>
              <div className="avatar">{active[0].toUpperCase()}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:800}}>{active}</div>
                <div style={{fontSize:12,color:'#6b7280'}}>@{active}</div>
              </div>
            </div>
            <div className="messages" id="messages">
              { (messages[[user.username, active].sort().join('__')] || []).map((m,i)=> (
                <div key={i} className={`message ${m.from===user.username ? 'me':''}`}>
                  <div style={{fontSize:12,color:'#6b7280'}}>{m.from} • {new Date(m.ts).toLocaleTimeString()}</div>
                  <div style={{marginTop:6}}>{m.text}</div>
                </div>
              )) }
            </div>
            <div className="input-row">
              <input ref={inputRef} placeholder="Message..." className="input" onKeyDown={(e)=>{ if(e.key==='Enter') sendMessage(); }} />
              <button className="button small" onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',color:'#6b7280'}}>Select a user to start chat</div>
        )}
      </div>
    </div>
  )
}
