
import React, { useEffect, useState, useRef } from 'react';
import Feed from './views/Feed';
import Profile from './views/Profile';
import Chats from './views/Chats';
import Shop from './views/Shop';

const TABS = ['Feed','Profile','Chats','Shop'];

// Simple fake Telegram Mini App auth
function useAuth() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('demo_user');
    if (stored) return JSON.parse(stored);
    const u = { id: 'u_' + Math.random().toString(36).slice(2,9), name: 'TelegramUser', username: 'tguser' + Math.floor(Math.random()*900), avatarInitial: 'T' };
    localStorage.setItem('demo_user', JSON.stringify(u));
    return u;
  });
  const update = (patch) => {
    const n = {...user,...patch};
    setUser(n);
    localStorage.setItem('demo_user', JSON.stringify(n));
  }
  return { user, update };
}

export default function App(){
  const { user, update } = useAuth();
  const [tab,setTab] = useState('Feed');

  return (
    <div className="app">
      <div style={{marginBottom:10, display:'flex', justifyContent:'center'}}>
        <strong style={{fontSize:20}}>DREVO Messenger — Demo</strong>
      </div>
      <div className="shell" role="application" aria-label="DREVO demo">
        <div className="sidebar">
          <div className="topbar">
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <div className="avatar">{user.avatarInitial}</div>
              <div>
                <div style={{fontWeight:700}}>{user.name}</div>
                <div style={{fontSize:12,color:'#6b7280'}}>@{user.username}</div>
              </div>
            </div>
          </div>

          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {TABS.map(t => (
              <div key={t} className={`tab ${tab===t ? 'active' : ''}`} onClick={()=>setTab(t)} role="button">{t}</div>
            ))}
          </div>

          <div style={{marginTop:'auto'}} className="footer-note">Demo: auth via Telegram Mini App simulated. No real network.</div>
        </div>
        <div className="content">
          <div className="topbar">
            <div style={{fontWeight:700}}>{tab}</div>
            <div style={{display:'flex',gap:8}}>
              <div style={{fontSize:13,color:'#6b7280'}}>Signed as <strong>@{user.username}</strong></div>
            </div>
          </div>

          <div style={{flex:1,display:'flex',minHeight:0}}>
            {tab==='Feed' && <Feed user={user} />}
            {tab==='Profile' && <Profile user={user} updateUser={update} />}
            {tab==='Chats' && <Chats user={user} />}
            {tab==='Shop' && <Shop />}
          </div>
        </div>
      </div>
    </div>
  )
}
