// Sahte supabase-js — SADECE testler için. Gerçek sunucuya hiç bağlanmaz.
// Veritabanı kurallarının (supabase/*.sql) basitleştirilmiş bir kopyasını taklit eder:
// profil tetikleyicisi, RLS (sadece kendi satırı), complete_chapter XP sınırı, redeem_reward.
// SQL'deki kurallar değişirse burayı da güncelleyin.
(function(){
  const S = window.__FAKE = { users:{}, profiles:{}, session:null, otp:'123456', confirm:true, failProfile:false, calls:[] };
  try { const saved = JSON.parse(localStorage.getItem('__fake_db')||'null'); if (saved) Object.assign(S, saved, {calls:[]}); } catch(e){}
  try { const cfg = JSON.parse(localStorage.getItem('__fake_cfg')||'null'); if (cfg && !localStorage.getItem('__fake_db')) Object.assign(S, cfg); } catch(e){}
  const persist = () => localStorage.setItem('__fake_db', JSON.stringify({users:S.users, profiles:S.profiles, session:S.session, confirm:S.confirm, failProfile:S.failProfile}));
  function qb(table){
    let op='select', payload=null, filt={};
    const api = {
      select(){ return api; }, eq(c,v){ filt[c]=v; return api; },
      upsert(r){ op='upsert'; payload=r; return api; }, update(r){ op='update'; payload=r; return api; }, insert(r){ op='insert'; payload=r; return api; },
      maybeSingle(){ return run(true); }, single(){ return run(true); }, then(res,rej){ return run(false).then(res,rej); }
    };
    async function run(){
      S.calls.push({table, op, payload, filt});
      if (S.failProfile) return { data:null, error:{ message:'network error' } };
      const uid = S.session && S.session.user.id;
      if (op==='select'){ const p=S.profiles[filt.id]; return { data: (p && p.id===uid) ? p : null, error:null }; }
      if (op==='upsert'){ if (payload.id!==uid) return {data:null,error:{message:'RLS'}}; S.profiles[payload.id]=Object.assign({xp:0,streak:0,completed_chapters:[],rewards:[]}, S.profiles[payload.id]||{}, payload); persist(); return {data:S.profiles[payload.id],error:null}; }
      if (op==='update'){ const p=S.profiles[filt.id]; if (p && p.id===uid){ Object.assign(p,payload); persist(); } return {data:null,error:null}; }
      if (op==='insert'){ if (payload.id!==uid) return {data:null,error:{message:'RLS'}}; if(!S.profiles[payload.id]) S.profiles[payload.id]=Object.assign({xp:0,streak:0,completed_chapters:[],rewards:[]},payload); persist(); return {data:S.profiles[payload.id],error:null}; }
      return {data:null,error:null};
    }
    return api;
  }
  async function rpc(name, a){
    S.calls.push({rpc:name, a});
    const uid = S.session && S.session.user.id; if(!uid) return {data:null,error:{message:'Giriş yapılmamış'}};
    const p = S.profiles[uid];
    if (name==='complete_chapter'){
      const pct = a.p_correct+a.p_wrong ? Math.round(100*a.p_correct/(a.p_correct+a.p_wrong)) : 0;
      const gain = Math.max(0, Math.min(a.p_earned_xp, a.p_correct*45+600)) + (pct>=80?50:0);
      p.xp += gain; if (pct>=80 && !p.completed_chapters.includes(a.p_chapter_id)) p.completed_chapters.push(a.p_chapter_id);
      p.streak = (p.streak||0) + 1; persist(); return {data:p,error:null};
    }
    if (name==='redeem_reward'){
      const prices={lang_3:25000,lang_7:50000,lang_14:90000,books_all:90000}; const pr=prices[a.p_reward_id];
      if(!pr) return {data:null,error:{message:'Geçersiz ödül'}};
      if((p.rewards||[]).some(r=>r.id===a.p_reward_id)) return {data:null,error:{message:'Bu ödül zaten alınmış'}};
      if(p.xp<pr) return {data:null,error:{message:'XP yetersiz'}};
      p.xp-=pr; p.rewards.push({id:a.p_reward_id}); persist(); return {data:p,error:null};
    }
    return {data:null,error:{message:'yok'}};
  }
  window.supabase = { createClient(){ return {
    from: qb, rpc,
    auth: {
      async signUp({email,password,options}){
        if (S.users[email]) return { data:{ user:{ id:'x', identities:[] }, session:null }, error:null };
        const u = { id:'uid-'+Object.keys(S.users).length, email, password, confirmed:!S.confirm, user_metadata: options.data, identities:[{}] };
        S.users[email]=u;
        S.profiles[u.id] = { id:u.id, email, name:options.data.full_name, phone:options.data.phone, xp:0, streak:0, completed_chapters:[], rewards:[] }; // tetikleyici
        if (!S.confirm){ S.session={user:u, access_token:'tok-'+u.id}; }
        persist(); return { data:{ user:u, session:S.session }, error:null };
      },
      async signInWithPassword({email,password}){
        const u=S.users[email]; if(!u||u.password!==password) return {data:{},error:{message:'Invalid login credentials'}};
        if(!u.confirmed) return {data:{},error:{message:'Email not confirmed'}};
        S.session={user:u, access_token:'tok-'+u.id}; persist(); return {data:{user:u,session:S.session},error:null};
      },
      async verifyOtp({email,token}){ const u=S.users[email]; if(!u||token!==S.otp) return {data:{},error:{message:'Token has expired or is invalid'}}; u.confirmed=true; S.session={user:u}; persist(); return {data:{user:u,session:S.session},error:null}; },
      async resend(){ return {error:null}; },
      async getSession(){ return {data:{session:S.session}}; },
      async signOut(){ S.session=null; persist(); return {error:null}; }
    }
  }; } };
})();
