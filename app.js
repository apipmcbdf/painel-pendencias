(() => {
  'use strict';

  const firebaseConfig = {
    apiKey: 'AIzaSyAMT1wEM5zgWgazsKv8XnO0zzHp7UB4ov4',
    authDomain: 'painel-pendencias.firebaseapp.com',
    projectId: 'painel-pendencias',
    storageBucket: 'painel-pendencias.firebasestorage.app',
    messagingSenderId: '969369108934',
    appId: '1:969369108934:web:88c5ac5a8acd987509f2c7'
  };

  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  const functionsClient = firebase.functions();

  const legacyDriveLinks = {
    '0067268-32.2016.4.01.3400': 'https://drive.google.com/drive/folders/1vs4bEyw8QdxZP7HeSHDiWWlUJB-paYsq?usp=drive_link',
    '0067270-02.2016.4.01.3400': 'https://drive.google.com/drive/folders/1OY-83t2ueP4AZvAylFOWlV9dWDxAXFJ8?usp=drive_link',
    '0067273-54.2016.4.01.3400': 'https://drive.google.com/drive/folders/1hGOIsKXMMRCAWnQ1SARiKm6QvyXgPkBY?usp=drive_link',
    '1000969-41.2025.4.01.3400': 'https://drive.google.com/drive/folders/1HL8z1eQPweR9u8BbVk5L7xO7xFLRIPb9?usp=drive_link',
    '1001396-38.2025.4.01.3400': 'https://drive.google.com/drive/folders/1SPRY2tVXxs7EZeTXW22DYnqQO5Ts1JvY?usp=drive_link',
    '1002480-74.2025.4.01.3400': 'https://drive.google.com/drive/folders/1m8q_ETKJi8SWfX-lucDjeliQLpXDxeLj?usp=drive_link',
    '1002491-06.2025.4.01.3400': 'https://drive.google.com/drive/folders/1XiRirK-C_jrZ4wON3Q0zd2_vfeqAX3yS?usp=drive_link',
    '1010003-50.2019.4.01.3400': 'https://drive.google.com/drive/folders/1_yuHSF_QOErTWJxKANKzkZ5qWRyvguPH?usp=drive_link',
    '1010029-48.2019.4.01.3400': 'https://drive.google.com/drive/folders/1vWvtoj1V0Wf27YljGJWNU33WiCaa94pR?usp=drive_link',
    '1010657-37.2019.4.01.3400': 'https://drive.google.com/drive/folders/1z3Zoxh6d1-x2lWxkHgDbBTCofoThOAy6?usp=drive_link',
    '1010666-96.2019.4.01.3400': 'https://drive.google.com/drive/folders/1NjVGQmMtHi3EP0laPNpokMMYJCEvKDwa?usp=drive_link',
    '1012049-12.2019.4.01.3400': 'https://drive.google.com/drive/folders/1B3J6_8dfCCqd3JmXoBai98XVq4BA4s0X?usp=drive_link',
    '1013014-87.2019.4.01.3400': 'https://drive.google.com/drive/folders/1KRoS7eVNPhk2KtpbB9HtxnaIqAoyaChS?usp=drive_link',
    '1013785-31.2020.4.01.3400': 'https://drive.google.com/drive/folders/1hHkKmbSrGRwS_JiHpZ0LEcUfsjPq2Teh?usp=drive_link',
    '1018112-53.2019.4.01.3400': 'https://drive.google.com/drive/folders/1-uJMfGuzrtXXD-vQFOIUksQ2VRs4d6-7?usp=drive_link',
    '1019563-16.2019.4.01.3400': 'https://drive.google.com/drive/folders/1P-JfEI-yvmvllrlMJtPVKkuh4h-OgeVs?usp=drive_link',
    '1020095-14.2024.4.01.3400': 'https://drive.google.com/drive/folders/1Bwe2TvPDl9esYlAhPKjGpGEp2LfsxsIN?usp=drive_link',
    '1021670-57.2024.4.01.3400': 'https://drive.google.com/drive/folders/1H0zXs3DFet_1EQqYuVFjvNu9dCfJDFyq?usp=drive_link',
    '1021826-45.2024.4.01.3400': 'https://drive.google.com/drive/folders/1hGh9QLUoVj7x5fZrFcZyxruzozy1r3Ng?usp=drive_link',
    '1046951-20.2021.4.01.3400': 'https://drive.google.com/drive/folders/1T9k7ZWJihlR9-_kwMRbGvDbpsYaNkwal?usp=drive_link',
    '1049367-58.2021.4.01.3400': 'https://drive.google.com/drive/folders/1UeTdVUOCQ2GDuycPM_SXkWzVFJ4XM5eC?usp=drive_link',
    '1062973-90.2020.4.01.3400': 'https://drive.google.com/drive/folders/1fG1V5qrYaojZYKpiq-fjEMp0DNO42bRR?usp=drive_link',
    '1064118-84.2020.4.01.3400': 'https://drive.google.com/drive/folders/1RLIMgd47_xa29H-pIXu10xkZk_21jzrP?usp=drive_link',
    '1064306-43.2021.4.01.3400': 'https://drive.google.com/drive/folders/1F_I6V0AyqwsObbbV3BaEw7krcaqcVHGJ?usp=drive_link',
    '1066615-71.2020.4.01.3400': 'https://drive.google.com/drive/folders/1I8-EtZFSdwzGsOKvOg638fRW2qOVMISZ?usp=sharing',
    '1080504-58.2021.4.01.3400': 'https://drive.google.com/drive/folders/1LS_ao5pTAnbBuArL0Pnp63DY510pFAI9?usp=sharing',
    '1097769-68.2024.4.01.3400': 'https://drive.google.com/drive/folders/1FOjT0CPcSLTqEE7aUenabuoK4V0kuF1u?usp=sharing',
    '1098748-30.2024.4.01.3400': 'https://drive.google.com/drive/folders/1iOoqfJ-GjHdGJ_3B8KdcGAuJVr1ZfLmi?usp=drive_link',
    '1098948-37.2024.4.01.3400': 'https://drive.google.com/drive/folders/197x7geTAyK3sE2cHTjrfXsWkmxU6ByiI?usp=drive_link',
    '1099184-86.2024.4.01.3400': 'https://drive.google.com/drive/folders/1R9_WptHcJ9cfS2XOVzPlnYKEz77vwvLF?usp=drive_link',
    '1099253-21.2024.4.01.3400': 'https://drive.google.com/drive/folders/1cXKEB453z8mDf3goaYrbhoTf2iTB6iRQ?usp=drive_link',
    '1111756-11.2023.4.01.3400': 'https://drive.google.com/drive/folders/1hHVZGiY7Y9VCpmiGOJoFxA5XZYWZGgH1?usp=drive_link'
  };

  const legacyNames = {
    'advogada1@teste.com': 'ADVOGADA TESTE',
    'yasmim.ribeiro@apipmcbdf.com.br': 'YASMIM',
    'marcelledias.adv@gmail.com': 'DRA MARCELLE',
    'grazielasuelimenini2@gmail.com': 'DRA GRAZIELA',
    'cavictor.franco@gmail.com': 'VICTOR',
    'patricia.franco@apipmcbdf.com.br': 'DRA PATRICIA',
    'savina.laila@apipmcbdf.com.br': 'Savina',
    'lorena@apipmcbdf.com.br': 'Lorena'
  };

  const legacyAdmins = new Set(['cavictor.franco@gmail.com']);
  const defaultTypes = [{ id: 'acordo', nome: 'Acordo', categorizar_prazo: true, mostrar_assinatura: true, mostrar_lp: true, mostrar_herdeiros: true }];

  const state = {
    cases: [],
    filteredCases: [],
    types: [],
    users: [],
    authUsers: [],
    usersBackendReady: true,
    currentCaseId: null,
    currentCase: null,
    currentProfile: null,
    listView: 'ativos'
  };

  const $ = (id) => document.getElementById(id);
  const els = {
    loginScreen: $('login-screen'), loginForm: $('login-form'), email: $('email'), password: $('password'), loginError: $('login-error'), dashboard: $('dashboard'),
    userLabel: $('current-user-label'), adminNav: $('admin-nav-btn'), logout: $('logout-btn'), novoCaso: $('novo-caso-btn'), busca: $('busca-global'),
    filtroStatus: $('filtro-status'), filtroTipo: $('filtro-tipo'), filtroResponsavel: $('filtro-responsavel'), filtroPrazo: $('filtro-prazo'), list: $('pendencias-list'), listCount: $('lista-contagem'),
    home: $('home-section'), details: $('detalhes-section'), admin: $('admin-section'), stats: $('stats-grid'), proximos: $('proximos-prazos'), updates: $('ultimas-atualizacoes'), refresh: $('refresh-btn'),
    detTipo: $('det-tipo'), detProcesso: $('det-processo-text'), detPrazoBadge: $('det-prazo-badge'), detDrive: $('det-drive-link'), editarCaso: $('editar-caso-btn'), arquivarCaso: $('arquivar-caso-btn'),
    detData: $('det-data-inicial-text'), detPrazo: $('det-prazo-text'), detResponsavel: $('det-responsavel-text'), detAtualizado: $('det-atualizado-text'), detStatus: $('det-status'), salvarStatus: $('salvar-status-btn'),
    detComentarios: $('det-comentarios-text'), editarComentarios: $('editar-comentarios-btn'), partes: $('det-partes-list'), addParte: $('adicionar-parte-btn'), novoAndamento: $('novo-andamento'), enviarAndamento: $('enviar-andamento'), historico: $('andamentos-list')
  };

  function normalizeText(v) { return String(v || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim(); }
  function safeDate(value) {
    if (!value) return null;
    if (value && typeof value.toDate === 'function') return value.toDate();
    const raw = String(value);
    const d = /^\d{4}-\d{2}-\d{2}$/.test(raw) ? new Date(`${raw}T12:00:00`) : new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  function formatDate(value) { const d = safeDate(value); return d ? d.toLocaleDateString('pt-BR') : '—'; }
  function formatDateTime(value) { const d = safeDate(value); return d ? d.toLocaleString('pt-BR') : '—'; }
  function todayStart() { const d = new Date(); d.setHours(0,0,0,0); return d; }
  function daysRemaining(value) { const d = safeDate(value); if (!d) return null; d.setHours(0,0,0,0); return Math.ceil((d - todayStart()) / 86400000); }
  function slugify(v) { return normalizeText(v).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `tipo-${Date.now()}`; }
  function emailKey(v) { return normalizeText(v).replace(/[^a-z0-9]+/g, '_'); }
  function userDisplay(email) { if (!email) return ''; const u = state.users.find(x => normalizeText(x.email) === normalizeText(email)); return u?.nome || legacyNames[normalizeText(email)] || email; }
  function currentUserInfo() {
    const email = auth.currentUser?.email || '';
    return { uid: auth.currentUser?.uid || '', email, nome: state.currentProfile?.nome || userDisplay(email) };
  }
  function canEdit() { return ['administrador', 'editor'].includes(state.currentProfile?.perfil) && state.currentProfile?.ativo !== false; }
  function isAdmin() { return state.currentProfile?.perfil === 'administrador' && state.currentProfile?.ativo !== false; }
  function statusLabel(v) { return ({ pendente:'Pendente', em_andamento:'Em andamento', resolvido:'Resolvido', enviado:'Enviado', atrasado:'Atrasado' })[v] || v || 'Pendente'; }
  function typeName(caseData) { return caseData.descricao || caseData.tipo_nome || caseData.tipo || 'Sem tipo'; }
  function getDriveUrl(caseData) { return caseData.drive_url || legacyDriveLinks[caseData.processo] || ''; }
  function updatedAt(caseData) { return caseData.updated_at || caseData.data_atualizacao || caseData.created_at || null; }

  function prazoInfo(caseData) {
    if (caseData.status === 'resolvido') return { text:'Resolvido', cls:'success', dot:'success' };
    if (caseData.status === 'enviado') return { text:'Enviado', cls:'info', dot:'info' };
    const dias = daysRemaining(caseData.prazo);
    if (dias === null) return { text:'Sem prazo', cls:'', dot:'' };
    if (dias < 0) return { text:`Vencido há ${Math.abs(dias)} dia${Math.abs(dias) === 1 ? '' : 's'}`, cls:'danger', dot:'danger' };
    if (dias === 0) return { text:'Vence hoje', cls:'danger', dot:'danger' };
    if (dias <= 7) return { text:`Urgente · ${dias} dia${dias === 1 ? '' : 's'}`, cls:'warning', dot:'warning' };
    if (dias <= 15) return { text:`Atenção · ${dias} dias`, cls:'warning', dot:'warning' };
    return { text:`No prazo · ${dias} dias`, cls:'success', dot:'success' };
  }

  function toast(message, type='success') {
    const div = document.createElement('div'); div.className = `toast ${type}`; div.textContent = message; $('toast-container').appendChild(div);
    setTimeout(() => div.remove(), 3500);
  }
  function openModal(id) { $(id).classList.remove('hidden'); }
  function closeModal(modal) { (typeof modal === 'string' ? $(modal) : modal).classList.add('hidden'); }
  function clearSelect(select, firstText, firstValue='') { select.innerHTML=''; const opt=document.createElement('option'); opt.value=firstValue; opt.textContent=firstText; select.appendChild(opt); }
  function addOption(select, value, text) { const o=document.createElement('option'); o.value=value; o.textContent=text; select.appendChild(o); }
  function setText(el, value, fallback='—') { el.textContent = value || fallback; }

  async function loadProfile(user) {
    let profile = null;
    try {
      const uidDoc = await db.collection('usuarios').doc(user.uid).get();
      if (uidDoc.exists) profile = { id: uidDoc.id, ...uidDoc.data() };
      if (!profile) {
        const emailDoc = await db.collection('usuarios').doc(user.email.toLowerCase()).get();
        if (emailDoc.exists) profile = { id: emailDoc.id, ...emailDoc.data() };
      }
      if (!profile) {
        const snap = await db.collection('usuarios').where('email','==',user.email).limit(1).get();
        if (!snap.empty) profile = { id:snap.docs[0].id, ...snap.docs[0].data() };
      }
    } catch (e) { console.warn('Perfil não carregado:', e); }
    if (!profile) profile = { nome: legacyNames[normalizeText(user.email)] || user.email, email:user.email, perfil: legacyAdmins.has(normalizeText(user.email)) ? 'administrador' : (legacyNames[normalizeText(user.email)] ? 'editor' : 'leitor') };
    if (profile.ativo === false) { await auth.signOut(); throw new Error('Conta desativada. Contate o administrador.'); }
    state.currentProfile = profile;
  }

  async function loadUsers() {
    const users = [];
    try {
      const snap = await db.collection('usuarios').get();
      snap.forEach(doc => users.push({ id:doc.id, ...doc.data() }));
    } catch (e) { console.warn(e); }
    Object.entries(legacyNames).forEach(([email,nome]) => {
      if (!users.some(u => normalizeText(u.email) === normalizeText(email))) users.push({ id:`legacy_${emailKey(email)}`, email, nome, perfil: legacyAdmins.has(email) ? 'administrador' : 'editor', legacy:true });
    });
    state.users = users.sort((a,b)=>(a.nome||a.email||'').localeCompare(b.nome||b.email||'', 'pt-BR'));
  }

  async function loadTypes() {
    const types = [];
    try {
      const snap = await db.collection('tipos_caso').orderBy('nome').get();
      snap.forEach(doc => types.push({ id:doc.id, ...doc.data() }));
    } catch (e) { console.warn(e); }
    state.types = types.length ? types : [...defaultTypes];
  }

  async function loadCases() {
    els.list.innerHTML = '<div class="empty-state">Carregando casos...</div>';
    const snap = await db.collection('pendencias').get();
    state.cases = snap.docs.map(doc => ({ id:doc.id, ...doc.data() }));
    state.cases.sort((a,b) => {
      const da = safeDate(a.prazo)?.getTime() ?? Number.MAX_SAFE_INTEGER;
      const dbb = safeDate(b.prazo)?.getTime() ?? Number.MAX_SAFE_INTEGER;
      return da - dbb || String(a.processo||'').localeCompare(String(b.processo||''));
    });
    populateFilters();
    applyFilters();
    renderDashboard();
    renderReport();
  }

  function populateFilters() {
    clearSelect(els.filtroTipo, 'Todos os tipos');
    const typeSet = new Set([...state.types.map(t=>t.nome), ...state.cases.map(typeName)].filter(Boolean));
    [...typeSet].sort((a,b)=>a.localeCompare(b,'pt-BR')).forEach(t=>addOption(els.filtroTipo,t,t));
    clearSelect(els.filtroResponsavel, 'Todos os responsáveis');
    const resp = new Map();
    state.users.forEach(u=>resp.set(u.email||u.id,u.nome||u.email));
    state.cases.forEach(c=>{ if(c.responsavel_email || c.responsavel_nome) resp.set(c.responsavel_email || c.responsavel_nome, c.responsavel_nome || userDisplay(c.responsavel_email)); });
    [...resp.entries()].sort((a,b)=>a[1].localeCompare(b[1],'pt-BR')).forEach(([v,t])=>addOption(els.filtroResponsavel,v,t));
    populateReportOptions();
  }

  function caseSearchText(c) {
    const parts = (c.partes || []).flatMap(p => [p?.nome,p?.cpf,p?.telefone,p?.email,...((p?.herdeiros||[]).flatMap(h=>typeof h==='object'?[h.nome,h.cpf,h.telefone,h.email]:[h]))]);
    return normalizeText([c.processo,typeName(c),c.comentarios,c.responsavel_nome,c.responsavel_email,...parts].join(' '));
  }

  function applyFilters() {
    const q = normalizeText(els.busca.value);
    const status = els.filtroStatus.value, tipo = els.filtroTipo.value, resp = els.filtroResponsavel.value, prazo = els.filtroPrazo.value;
    state.filteredCases = state.cases.filter(c => {
      const archived = !!c.arquivado;
      if (state.listView === 'ativos' && archived) return false;
      if (state.listView === 'arquivados' && !archived) return false;
      if (q && !caseSearchText(c).includes(q)) return false;
      if (tipo && typeName(c) !== tipo) return false;
      if (resp && ![c.responsavel_email,c.responsavel_nome].includes(resp)) return false;
      const days = daysRemaining(c.prazo);
      if (status === 'urgente' && !(c.status !== 'resolvido' && c.status !== 'enviado' && days !== null && days >= 0 && days <= 7)) return false;
      if (status === 'vencido' && !(c.status !== 'resolvido' && days !== null && days < 0)) return false;
      if (status && !['urgente','vencido'].includes(status) && c.status !== status) return false;
      if (prazo === 'hoje' && days !== 0) return false;
      if (['7','15','30'].includes(prazo) && !(days !== null && days >= 0 && days <= Number(prazo))) return false;
      return true;
    });
    renderCaseList();
  }

  function renderCaseList() {
    els.list.innerHTML = '';
    els.listCount.textContent = `${state.filteredCases.length} caso${state.filteredCases.length === 1 ? '' : 's'}`;
    if (!state.filteredCases.length) { els.list.innerHTML = '<div class="empty-state">Nenhum caso encontrado com esses filtros.</div>'; return; }
    state.filteredCases.forEach(c => {
      const info = prazoInfo(c), signed = (c.partes||[]).filter(p=>normalizeText(p.assinou)==='sim').length;
      const card=document.createElement('div'); card.className=`case-card${c.id===state.currentCaseId?' active':''}`; card.dataset.id=c.id;
      const title=document.createElement('div'); title.className='case-title';
      const dot=document.createElement('span'); dot.className=`dot ${info.dot}`; dot.style.marginRight='7px'; title.append(dot, document.createTextNode(c.processo || 'Sem número'));
      const meta=document.createElement('div'); meta.className='case-meta';
      [typeName(c), info.text].forEach(v=>{const s=document.createElement('span');s.textContent=v;meta.appendChild(s)});
      const sub=document.createElement('div'); sub.className='case-sub'; const pc=(c.partes||[]).length; sub.textContent=`${pc} parte${pc===1?'':'s'}${signed?` · ${signed} assinou/assinaram`:''}${c.responsavel_nome?` · ${c.responsavel_nome}`:''}`;
      card.append(title,meta,sub); card.addEventListener('click',()=>openCase(c.id)); els.list.appendChild(card);
    });
  }

  function renderDashboard() {
    const active=state.cases.filter(c=>!c.arquivado); const metrics={pendentes:0,urgentes:0,vencidos:0,enviados:0,resolvidos:0};
    active.forEach(c=>{ const d=daysRemaining(c.prazo); if(c.status==='pendente'||c.status==='em_andamento') metrics.pendentes++; if(c.status==='enviado')metrics.enviados++; if(c.status==='resolvido')metrics.resolvidos++; if(c.status!=='resolvido'&&c.status!=='enviado'&&d!==null&&d>=0&&d<=7)metrics.urgentes++; if(c.status!=='resolvido'&&d!==null&&d<0)metrics.vencidos++; });
    const items=[['Pendentes',metrics.pendentes],['Urgentes',metrics.urgentes],['Vencidos',metrics.vencidos],['Enviados',metrics.enviados],['Resolvidos',metrics.resolvidos]];
    els.stats.innerHTML=''; items.forEach(([label,value])=>{const d=document.createElement('div');d.className='stat-card';const v=document.createElement('div');v.className='stat-value';v.textContent=value;const l=document.createElement('div');l.className='stat-label';l.textContent=label;d.append(v,l);els.stats.appendChild(d)});

    const prioritiesEl=$('prioridades-list'); prioritiesEl.innerHTML=''; const priorityCases=active.filter(c=>c.status!=='resolvido'&&c.status!=='enviado'&&daysRemaining(c.prazo)!==null&&daysRemaining(c.prazo)<=7).sort((a,b)=>daysRemaining(a.prazo)-daysRemaining(b.prazo)).slice(0,6); if(!priorityCases.length) prioritiesEl.innerHTML='<div class="empty-state">Nenhuma pendência urgente no momento.</div>';priorityCases.forEach(c=>prioritiesEl.appendChild(compactCaseItem(c,prazoInfo(c).text, true)));
    els.proximos.innerHTML=''; const upcoming=active.filter(c=>c.status!=='resolvido'&&c.status!=='enviado'&&daysRemaining(c.prazo)!==null&&daysRemaining(c.prazo)>=0).sort((a,b)=>daysRemaining(a.prazo)-daysRemaining(b.prazo)).slice(0,8);
    if(!upcoming.length) els.proximos.innerHTML='<div class="empty-state">Nenhum prazo próximo.</div>';
    upcoming.forEach(c=>els.proximos.appendChild(compactCaseItem(c, prazoInfo(c).text, true)));
    renderTypeOverview(active);

    els.updates.innerHTML=''; const updates=[...active].sort((a,b)=>(safeDate(updatedAt(b))?.getTime()||0)-(safeDate(updatedAt(a))?.getTime()||0)).slice(0,8);
    if(!updates.length) els.updates.innerHTML='<div class="empty-state">Sem atualizações registradas.</div>';
    updates.forEach(c=>els.updates.appendChild(compactCaseItem(c, `${formatDateTime(updatedAt(c))}${c.updated_by_name?` · ${c.updated_by_name}`:''}`)));
  }

  function compactCaseItem(c, subtitle, highlightDeadline=false) {
    const row=document.createElement('div');row.className='compact-item';
    row.tabIndex=0;row.setAttribute('role','button');row.setAttribute('aria-label',`Abrir processo ${c.processo||'sem número'}`);
    const left=document.createElement('div');const strong=document.createElement('strong');strong.textContent=c.processo||'Sem número';
    const small=document.createElement('small');small.append(document.createTextNode(`${typeName(c)} · `));
    const deadline=document.createElement('span');deadline.textContent=subtitle;
    if(highlightDeadline && daysRemaining(c.prazo)!==null && daysRemaining(c.prazo)<0 && !['enviado','resolvido'].includes(c.status))deadline.className='overdue-text';
    small.appendChild(deadline);left.append(strong,small);row.append(left);
    row.addEventListener('click',()=>openCase(c.id));row.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openCase(c.id)}});
    return row;
  }

  function renderTypeOverview(active) {
    const root=$('tipos-visao-list');root.replaceChildren();
    const grouped=new Map();
    active.filter(c=>!['enviado','resolvido'].includes(c.status)).forEach(c=>{
      const name=typeName(c);if(!grouped.has(name))grouped.set(name,[]);grouped.get(name).push(c);
    });
    if(!grouped.size){root.innerHTML='<div class="empty-state">Nenhuma pendência em aberto por tipo de caso.</div>';return;}
    [...grouped.entries()].sort((a,b)=>a[0].localeCompare(b[0],'pt-BR')).forEach(([name,cases])=>{
      const ordered=[...cases].sort((a,b)=>(daysRemaining(a.prazo)??Infinity)-(daysRemaining(b.prazo)??Infinity));
      const overdue=cases.filter(c=>daysRemaining(c.prazo)!==null&&daysRemaining(c.prazo)<0).length;
      const next=cases.filter(c=>daysRemaining(c.prazo)!==null&&daysRemaining(c.prazo)>=0&&daysRemaining(c.prazo)<=7).length;
      const card=document.createElement('article');card.className='panel type-overview-card';
      const header=document.createElement('div');header.className='type-overview-head';
      const title=document.createElement('h4');title.textContent=name;
      const counter=document.createElement('span');counter.className='type-count';counter.textContent=`${cases.length} pendência${cases.length===1?'':'s'}`;
      header.append(title,counter);
      const summary=document.createElement('div');summary.className='type-summary';
      const late=document.createElement('span');late.className=overdue?'overdue-text':'';late.textContent=`${overdue} vencida${overdue===1?'':'s'}`;
      const soon=document.createElement('span');soon.textContent=`${next} nos próximos 7 dias`;
      summary.append(late,soon);
      const list=document.createElement('div');list.className='compact-list type-case-list';
      ordered.slice(0,5).forEach(c=>list.appendChild(compactCaseItem(c,prazoInfo(c).text,true)));
      const more=document.createElement('button');more.type='button';more.className='btn secondary type-view-all';more.textContent=`Ver todos os ${cases.length} casos de ${name}`;
      more.addEventListener('click',()=>openCasesFilteredByType(name));
      card.append(header,summary,list,more);root.appendChild(card);
    });
  }

  function openCasesFilteredByType(name) {
    state.listView='ativos';document.querySelectorAll('.sidebar-tab').forEach(b=>b.classList.toggle('active',b.dataset.view==='ativos'));
    els.busca.value='';els.filtroStatus.value='';els.filtroResponsavel.value='';els.filtroPrazo.value='';
    const hasOption=[...els.filtroTipo.options].some(o=>o.value===name);
    els.filtroTipo.value=hasOption?name:'';
    applyFilters();showPanel('cases');
    document.querySelectorAll('.main-nav-link').forEach(btn=>btn.classList.toggle('active',btn.id==='casos-nav-btn'));
  }

  function selectDetailTab(name) { document.querySelectorAll('[data-tab-panel]').forEach(el=>el.classList.toggle('hidden',el.dataset.tabPanel!==name));document.querySelectorAll('.detail-tab').forEach(btn=>{const active=btn.dataset.tab===name;btn.classList.toggle('active',active);btn.setAttribute('aria-selected',String(active));}); }

  function showPanel(name) { $('casos-section').classList.toggle('hidden',name!=='cases'); els.home.classList.toggle('hidden',name!=='home'); els.details.classList.toggle('hidden',name!=='details'); els.admin.classList.toggle('hidden',name!=='admin'); $('relatorios-section').classList.toggle('hidden',name!=='report'); }

  async function openCase(id) {
    const c=state.cases.find(x=>x.id===id); if(!c)return; state.currentCaseId=id; state.currentCase=c; showPanel('details'); selectDetailTab('resumo'); renderCaseList();
    setText(els.detTipo,typeName(c),'Sem tipo'); setText(els.detProcesso,c.processo,'Sem número'); setText(els.detData,formatDate(c.data_inicial)); setText(els.detPrazo,formatDate(c.prazo));
    setText(els.detResponsavel,c.responsavel_nome || userDisplay(c.responsavel_email) || 'Sem responsável');
    setText(els.detAtualizado,updatedAt(c)?`${formatDateTime(updatedAt(c))}${c.updated_by_name?` · ${c.updated_by_name}`:''}`:'Sem registro'); els.detStatus.value=c.status||'pendente';
    const pi=prazoInfo(c); els.detPrazoBadge.className=`badge ${pi.cls}`; els.detPrazoBadge.textContent=pi.text;
    const drive=getDriveUrl(c); els.detDrive.classList.toggle('hidden',!drive); if(drive) els.detDrive.href=drive;
    els.arquivarCaso.textContent=c.arquivado?'Restaurar':'Arquivar';
    els.detComentarios.textContent=c.comentarios?.trim() || 'Sem comentários.';
    renderParts(c.partes||[]); applyPermissions(); await renderHistory(c);
  }

  function renderParts(parts) {
    els.partes.innerHTML=''; if(!parts.length){els.partes.innerHTML='<div class="empty-state">Nenhuma parte cadastrada.</div>';return;}
    parts.forEach((p,index)=>{
      if(typeof p!=='object') p={nome:String(p)};
      const row=document.createElement('div');row.className='part-card';const left=document.createElement('div');const name=document.createElement('div');name.className='part-name';name.textContent=p.nome||'Sem nome';
      const meta=document.createElement('div');meta.className='part-meta';const tags=[];if(p.cpf)tags.push(`CPF ${p.cpf}`);tags.push(normalizeText(p.status)==='falecido'?'Falecido':'Vivo');if(normalizeText(p.lp)==='sim')tags.push('LP');meta.textContent=tags.join(' · ');left.append(name,meta);
      if(Array.isArray(p.herdeiros)&&p.herdeiros.length){const ul=document.createElement('ul');ul.className='part-heirs';p.herdeiros.forEach(h=>{const li=document.createElement('li');li.textContent=typeof h==='object'?(h.nome||'Herdeiro sem nome'):h;ul.appendChild(li)});left.appendChild(ul)}
      const flags=document.createElement('div');flags.className='flags';if(normalizeText(p.status)!=='falecido'){if(normalizeText(p.assinou)==='sim')flags.textContent+='✍️ ';else if(normalizeText(p.lp)==='sim')flags.textContent+='⚖️🚫 ';else if(normalizeText(p.interesse)==='nao')flags.textContent+='🙅‍♂️ ';else if(normalizeText(p.contato)==='sim')flags.textContent+='🗣️ ';} row.append(left,flags); row.addEventListener('click',()=>openParteModal(index)); els.partes.appendChild(row);
    });
  }

  async function renderHistory(c) {
    const entries=[];
    (c.andamentos||[]).forEach((a,i)=>entries.push({id:`legacy-${i}`,texto:a.texto||'',autor:a.autor||'—',data:a.data||null,tipo:'andamento'}));
    try { const [andSnap,auditSnap]=await Promise.all([db.collection('pendencias').doc(c.id).collection('andamentos').orderBy('data','desc').limit(100).get(),db.collection('pendencias').doc(c.id).collection('historico').orderBy('data','desc').limit(100).get()]); andSnap.forEach(d=>entries.push({id:`a-${d.id}`,...d.data(),tipo:'andamento'})); auditSnap.forEach(d=>entries.push({id:`h-${d.id}`,...d.data(),tipo:'auditoria'})); } catch(e){console.warn('Histórico parcial:',e)}
    entries.sort((a,b)=>(safeDate(b.data)?.getTime()||0)-(safeDate(a.data)?.getTime()||0)); els.historico.innerHTML='';
    if(!entries.length){els.historico.innerHTML='<div class="empty-state">Ainda não há histórico.</div>';return;}
    entries.forEach(e=>{const item=document.createElement('div');item.className='timeline-item';const p=document.createElement('p');p.textContent=e.texto||e.acao||'Atualização';const s=document.createElement('small');s.textContent=`${e.autor||e.usuario_nome||'—'} · ${formatDateTime(e.data)}`;item.append(p,s);els.historico.appendChild(item)});
  }

  async function audit(caseId,texto) { const u=currentUserInfo(); try{await db.collection('pendencias').doc(caseId).collection('historico').add({texto,usuario_uid:u.uid,usuario_email:u.email,usuario_nome:u.nome,autor:u.nome,data:firebase.firestore.FieldValue.serverTimestamp()});}catch(e){console.warn('Auditoria não registrada:',e)} }
  function updateMetadata() { const u=currentUserInfo(); return {updated_at:firebase.firestore.FieldValue.serverTimestamp(),updated_by_uid:u.uid,updated_by_email:u.email,updated_by_name:u.nome}; }

  function fillCaseSelects() {
    const typeSel=$('case-tipo'); clearSelect(typeSel,'Selecione',''); state.types.forEach(t=>addOption(typeSel,t.nome,t.nome));
    const respSel=$('case-responsavel'); clearSelect(respSel,'Sem responsável',''); state.users.forEach(u=>addOption(respSel,u.email||u.id,u.nome||u.email));
  }
  function openCaseModal(c=null) {
    fillCaseSelects(); $('case-form').reset(); $('case-doc-id').value=c?.id||''; $('case-modal-title').textContent=c?'Editar caso':'Novo caso';
    $('case-tipo').value=typeName(c||{})==='Sem tipo'?'':typeName(c||{}); $('case-processo').value=c?.processo||''; $('case-data-inicial').value=toInputDate(c?.data_inicial); $('case-prazo').value=toInputDate(c?.prazo); $('case-status').value=c?.status||'pendente'; $('case-drive-url').value=getDriveUrl(c||{}); $('case-comentarios').value=c?.comentarios||'';
    if(c?.responsavel_email) $('case-responsavel').value=c.responsavel_email;
    openModal('case-modal');
  }
  function toInputDate(value){const d=safeDate(value);if(!d)return'';const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return`${y}-${m}-${day}`;}

  async function saveCase(e) {
    e.preventDefault(); if(!canEdit())return; const id=$('case-doc-id').value; const respEmail=$('case-responsavel').value; const respUser=state.users.find(u=>(u.email||u.id)===respEmail); const u=currentUserInfo();
    const payload={descricao:$('case-tipo').value,processo:$('case-processo').value.trim(),data_inicial:$('case-data-inicial').value||null,prazo:$('case-prazo').value||null,status:$('case-status').value,drive_url:$('case-drive-url').value.trim(),comentarios:$('case-comentarios').value.trim(),responsavel_email:respEmail||'',responsavel_nome:respUser?.nome||'',...updateMetadata()};
    try{
      if(id){await db.collection('pendencias').doc(id).update(payload);await audit(id,'Dados gerais do caso atualizados.');toast('Caso atualizado.');}
      else{payload.partes=[];payload.arquivado=false;payload.created_at=firebase.firestore.FieldValue.serverTimestamp();payload.created_by_uid=u.uid;payload.created_by_email=u.email;payload.created_by_name=u.nome;const ref=await db.collection('pendencias').add(payload);await audit(ref.id,'Caso criado.');state.currentCaseId=ref.id;toast('Caso criado com sucesso.');}
      closeModal('case-modal');await loadCases();if(state.currentCaseId)await openCase(state.currentCaseId);
    }catch(err){console.error(err);toast(`Erro ao salvar: ${err.message}`,'error')}
  }

  function getCurrentPart(index) { const p=(state.currentCase?.partes||[])[index]; return typeof p==='object'?p:{nome:p||''}; }
  function openParteModal(index=null) {
    $('parte-form').reset(); $('parte-index').value=index===null?'':String(index); $('parte-modal-title').textContent=index===null?'Nova parte':'Editar parte'; $('excluir-parte-btn').classList.toggle('hidden',index===null);
    const p=index===null?{}:getCurrentPart(index); $('parte-nome').value=p.nome||''; $('parte-cpf').value=p.cpf||''; $('parte-status').value=normalizeText(p.status)==='falecido'||normalizeText(p.status)==='morto'?'falecido':'vivo'; $('parte-interesse').value=p.interesse||'não'; $('parte-lp').value=p.lp||'não'; $('parte-contato').value=p.contato||'não'; $('parte-telefone').value=p.telefone||''; $('parte-email').value=p.email||''; $('parte-assinou').value=p.assinou||'não'; $('parte-deixou-bens').value=p.deixou_bens||'não'; $('parte-num-herdeiros').value=p.numero_de_herdeiros||''; $('parte-lp-processo').value=p.numero_processo_lp||''; $('parte-lp-advogado').value=p.advogado_lp||''; $('parte-lp-observacoes').value=p.observacoes_lp||''; renderHeirs(p.herdeiros||[]); toggleParteFields(); openModal('parte-modal');
  }
  function toggleParteFields(){const deceased=$('parte-status').value==='falecido';$('parte-vivo-fields').classList.toggle('hidden',deceased);$('parte-falecido-fields').classList.toggle('hidden',!deceased);$('parte-lp-fields').classList.toggle('hidden',$('parte-lp').value!=='sim');$('parte-contato-detalhes').classList.toggle('hidden',deceased||$('parte-contato').value!=='sim');if(!deceased&&$('parte-contato').value!=='sim'){$('parte-assinou').value='não';}}
  function renderHeirs(heirs) { const box=$('herdeiros-editor');box.innerHTML=''; const list=Array.isArray(heirs)?heirs:heirs?[heirs]:[]; list.forEach(h=>addHeirRow(typeof h==='object'?h:{nome:h})); }
  function addHeirRow(h={}) { const box=$('herdeiros-editor');const row=document.createElement('div');row.className='heir-row';const head=document.createElement('div');head.className='heir-head';const title=document.createElement('strong');title.textContent=`Herdeiro ${box.children.length+1}`;const rm=document.createElement('button');rm.type='button';rm.className='icon-btn';rm.textContent='×';rm.title='Remover herdeiro';rm.addEventListener('click',()=>row.remove());head.append(title,rm);const grid=document.createElement('div');grid.className='heir-grid';grid.innerHTML='<label>Nome<input class="h-nome" type="text"></label><label>CPF<input class="h-cpf" type="text"></label><label>Assinou<select class="h-assinou"><option value="não">Não</option><option value="sim">Sim</option></select></label><label>Interesse<select class="h-interesse"><option value="não">Não</option><option value="sim">Sim</option></select></label>';row.append(head,grid);box.appendChild(row);row.querySelector('.h-nome').value=h.nome||'';row.querySelector('.h-cpf').value=h.cpf||'';row.querySelector('.h-assinou').value=h.assinou||'não';row.querySelector('.h-interesse').value=h.interesse||'não'; }
  function collectHeirs(){return [...document.querySelectorAll('#herdeiros-editor .heir-row')].map(r=>({nome:r.querySelector('.h-nome').value.trim(),cpf:r.querySelector('.h-cpf').value.trim(),assinou:r.querySelector('.h-assinou').value,interesse:r.querySelector('.h-interesse').value})).filter(h=>h.nome||h.cpf);}

  async function savePart(e){e.preventDefault();if(!canEdit()||!state.currentCaseId)return;const idxRaw=$('parte-index').value;const idx=idxRaw===''?null:Number(idxRaw);const old=idx===null?{}:getCurrentPart(idx);const status=$('parte-status').value;const p={...old,nome:$('parte-nome').value.trim(),cpf:$('parte-cpf').value.trim(),status,interesse:$('parte-interesse').value,lp:$('parte-lp').value};
    if(status==='vivo'){p.contato=$('parte-contato').value;p.telefone=$('parte-telefone').value.trim();p.email=$('parte-email').value.trim();p.assinou=p.contato==='sim'?$('parte-assinou').value:'não';p.herdeiros=[];delete p.deixou_bens;delete p.numero_de_herdeiros;}else{p.deixou_bens=$('parte-deixou-bens').value;p.numero_de_herdeiros=$('parte-num-herdeiros').value||'';p.herdeiros=collectHeirs();p.contato='não';p.telefone='';p.email='';p.assinou='não';}
    if(p.lp==='sim'){p.numero_processo_lp=$('parte-lp-processo').value.trim();p.advogado_lp=$('parte-lp-advogado').value.trim();p.observacoes_lp=$('parte-lp-observacoes').value.trim();}else{delete p.numero_processo_lp;delete p.advogado_lp;delete p.observacoes_lp;}
    const parts=[...(state.currentCase.partes||[])];if(idx===null)parts.push(p);else parts[idx]=p;try{await db.collection('pendencias').doc(state.currentCaseId).update({partes:parts,...updateMetadata()});await audit(state.currentCaseId,`${idx===null?'Parte adicionada':'Parte atualizada'}: ${p.nome||'sem nome'}.`);closeModal('parte-modal');toast('Parte salva.');await loadCases();await openCase(state.currentCaseId);}catch(err){toast(`Erro ao salvar parte: ${err.message}`,'error')}
  }

  async function deletePart(){if(!canEdit()||!state.currentCaseId)return;const idx=Number($('parte-index').value);const p=getCurrentPart(idx);if(!confirm(`Excluir a parte "${p.nome||'sem nome'}" deste caso?`))return;const parts=[...(state.currentCase.partes||[])];parts.splice(idx,1);try{await db.collection('pendencias').doc(state.currentCaseId).update({partes:parts,...updateMetadata()});await audit(state.currentCaseId,`Parte excluída: ${p.nome||'sem nome'}.`);closeModal('parte-modal');toast('Parte excluída.');await loadCases();await openCase(state.currentCaseId);}catch(err){toast(err.message,'error')}}

  async function saveStatus(){if(!canEdit()||!state.currentCaseId)return;const before=state.currentCase.status||'pendente',after=els.detStatus.value;try{await db.collection('pendencias').doc(state.currentCaseId).update({status:after,...updateMetadata()});if(before!==after)await audit(state.currentCaseId,`Status alterado de ${statusLabel(before)} para ${statusLabel(after)}.`);toast('Status atualizado.');await loadCases();await openCase(state.currentCaseId);}catch(err){toast(err.message,'error')}}
  async function saveComments(){if(!canEdit()||!state.currentCaseId)return;const value=$('comentarios-editor').value.trim();try{await db.collection('pendencias').doc(state.currentCaseId).update({comentarios:value,...updateMetadata()});await audit(state.currentCaseId,'Comentários atualizados.');closeModal('comments-modal');toast('Comentários atualizados.');await loadCases();await openCase(state.currentCaseId);}catch(err){toast(err.message,'error')}}
  async function addAndamento(){if(!canEdit()||!state.currentCaseId)return;const texto=els.novoAndamento.value.trim();if(!texto)return;const u=currentUserInfo();try{await db.collection('pendencias').doc(state.currentCaseId).collection('andamentos').add({texto,autor:u.nome,autor_email:u.email,autor_uid:u.uid,data:firebase.firestore.FieldValue.serverTimestamp()});await db.collection('pendencias').doc(state.currentCaseId).update(updateMetadata());els.novoAndamento.value='';toast('Andamento registrado.');await loadCases();await openCase(state.currentCaseId);}catch(err){toast(`Erro ao registrar andamento: ${err.message}`,'error')}}
  async function toggleArchive(){if(!canEdit()||!state.currentCaseId)return;const next=!state.currentCase.arquivado;const action=next?'arquivar':'restaurar';if(!confirm(`Deseja ${action} este caso?`))return;try{await db.collection('pendencias').doc(state.currentCaseId).update({arquivado:next,...updateMetadata()});await audit(state.currentCaseId,next?'Caso arquivado.':'Caso restaurado.');toast(next?'Caso arquivado.':'Caso restaurado.');state.currentCaseId=null;state.currentCase=null;showPanel('home');await loadCases();}catch(err){toast(err.message,'error')}}

  function applyPermissions(){const editable=canEdit();[els.novoCaso,els.editarCaso,els.arquivarCaso,els.salvarStatus,els.editarComentarios,els.addParte,els.enviarAndamento].forEach(el=>{if(el)el.disabled=!editable});els.detStatus.disabled=!editable;els.adminNav.classList.toggle('hidden',!isAdmin());}

  async function callAdminFunction(name, data={}) {
    try {
      const callable = functionsClient.httpsCallable(name);
      const result = await callable(data);
      state.usersBackendReady = true;
      return result.data || {};
    } catch (err) {
      state.usersBackendReady = false;
      throw err;
    }
  }

  async function loadAuthUsers() {
    if (!isAdmin()) return;
    const aviso = $('usuarios-backend-aviso');
    try {
      const result = await callAdminFunction('adminListUsers');
      state.authUsers = Array.isArray(result.users) ? result.users : [];
      aviso.classList.add('hidden');
    } catch (err) {
      state.authUsers = [];
      aviso.textContent = 'Gestão completa de contas indisponível até as Cloud Functions serem implantadas. Os perfis do Firestore continuam visíveis.';
      aviso.classList.remove('hidden');
      console.warn('Cloud Functions de usuários indisponíveis:', err);
    }
  }

  function mergeAdminUsers() {
    const byEmail = new Map();
    state.users.forEach(u => byEmail.set(normalizeText(u.email), { ...u, sourceProfile:true }));
    state.authUsers.forEach(a => {
      const key = normalizeText(a.email);
      const p = byEmail.get(key) || {};
      byEmail.set(key, { ...p, ...a, id: a.uid || p.id, uid:a.uid, sourceAuth:true, perfil:p.perfil || a.perfil || 'editor', nome:p.nome || a.displayName || a.email });
    });
    return [...byEmail.values()].sort((a,b)=>(a.nome||a.email||'').localeCompare(b.nome||b.email||'', 'pt-BR'));
  }

  async function renderAdmin(){
    if(!isAdmin()){toast('Acesso restrito ao administrador.','error');return;}
    showPanel('admin');
    $('admin-tipos-list').innerHTML='';
    state.types.forEach(t=>{
      const r=document.createElement('div');r.className='admin-row';
      const l=document.createElement('div');const s=document.createElement('strong');s.textContent=t.nome;
      const m=document.createElement('div');m.className='meta';m.textContent=`Prazo: ${t.categorizar_prazo!==false?'sim':'não'} · Assinatura: ${t.mostrar_assinatura!==false?'sim':'não'} · LP: ${t.mostrar_lp!==false?'sim':'não'} · Herdeiros: ${t.mostrar_herdeiros!==false?'sim':'não'}`;
      l.append(s,m);const a=document.createElement('div');a.className='admin-actions';const e=document.createElement('button');e.className='btn secondary';e.textContent='Editar';e.addEventListener('click',()=>openTypeModal(t));a.append(e);r.append(l,a);$('admin-tipos-list').appendChild(r)
    });

    const list=$('admin-usuarios-list');
    list.innerHTML='<div class="empty-state">Carregando usuários...</div>';
    await loadAuthUsers();
    list.innerHTML='';
    const users=mergeAdminUsers();
    if(!users.length){list.innerHTML='<div class="empty-state">Nenhum usuário cadastrado.</div>';return;}

    users.forEach(u=>{
      const r=document.createElement('div');r.className='admin-row user-admin-row';
      const l=document.createElement('div');
      const title=document.createElement('div');title.className='user-admin-title';
      const s=document.createElement('strong');s.textContent=u.nome||u.displayName||u.email;
      const badge=document.createElement('span');badge.className=`mini-badge ${u.disabled?'disabled':'active'}`;badge.textContent=u.disabled?'Bloqueado':'Ativo';
      title.append(s,badge);
      const m=document.createElement('div');m.className='meta';
      const last=u.lastSignInTime?` · Último acesso: ${new Date(u.lastSignInTime).toLocaleString('pt-BR')}`:'';
      m.textContent=`${u.email||'—'} · ${u.perfil||'editor'}${u.sourceAuth?'':' · sem conta Auth'}${last}`;
      l.append(title,m);
      const a=document.createElement('div');a.className='admin-actions wrap';
      const edit=document.createElement('button');edit.className='btn secondary';edit.textContent='Editar';edit.addEventListener('click',()=>openUserModal(u));a.append(edit);
      if(u.sourceAuth){
        const reset=document.createElement('button');reset.className='btn secondary';reset.textContent='Enviar senha';reset.title='Enviar e-mail para definição/redefinição de senha';reset.addEventListener('click',()=>sendPasswordEmail(u));a.append(reset);
        const toggle=document.createElement('button');toggle.className=u.disabled?'btn secondary':'btn warning';toggle.textContent=u.disabled?'Ativar':'Bloquear';toggle.addEventListener('click',()=>toggleUserDisabled(u));a.append(toggle);
        const del=document.createElement('button');del.className='btn danger';del.textContent='Excluir';del.disabled=u.uid===auth.currentUser?.uid;del.title=del.disabled?'Você não pode excluir a própria conta.':'';del.addEventListener('click',()=>deleteUserAccount(u));a.append(del);
      }
      r.append(l,a);list.appendChild(r);
    });
  }

  function openTypeModal(t=null){$('tipo-form').reset();$('tipo-id').value=t?.id||'';$('tipo-nome').value=t?.nome||'';$('tipo-prazo').checked=t?.categorizar_prazo!==false;$('tipo-assinatura').checked=t?.mostrar_assinatura!==false;$('tipo-lp').checked=t?.mostrar_lp!==false;$('tipo-herdeiros').checked=t?.mostrar_herdeiros!==false;openModal('tipo-modal')}
  async function saveType(e){e.preventDefault();if(!isAdmin())return;const id=$('tipo-id').value||slugify($('tipo-nome').value);const payload={nome:$('tipo-nome').value.trim(),categorizar_prazo:$('tipo-prazo').checked,mostrar_assinatura:$('tipo-assinatura').checked,mostrar_lp:$('tipo-lp').checked,mostrar_herdeiros:$('tipo-herdeiros').checked,updated_at:firebase.firestore.FieldValue.serverTimestamp()};try{await db.collection('tipos_caso').doc(id).set(payload,{merge:true});closeModal('tipo-modal');toast('Tipo salvo.');await loadTypes();populateFilters();renderAdmin();}catch(err){toast(err.message,'error')}}

  function openUserModal(u=null){
    $('usuario-form').reset();
    $('usuario-id').value=u?.uid||u?.id||'';
    $('usuario-nome').value=u?.nome||u?.displayName||'';
    $('usuario-email').value=u?.email||'';
    $('usuario-perfil').value=u?.perfil||'editor';
    $('usuario-ativo').checked=u?.disabled!==true;
    $('usuario-modal-title').textContent=u?'Editar usuário':'Novo usuário';
    $('novo-usuario-help').classList.toggle('hidden',!!u);
    $('usuario-email').disabled=!!u?.sourceAuth;
    openModal('usuario-modal');
  }

  async function saveUser(e){
    e.preventDefault();if(!isAdmin())return;
    const uid=$('usuario-id').value.trim();
    const payload={uid:uid||null,nome:$('usuario-nome').value.trim(),email:$('usuario-email').value.trim().toLowerCase(),perfil:$('usuario-perfil').value,disabled:!$('usuario-ativo').checked};
    try{
      if(uid && !uid.startsWith('legacy_') && state.usersBackendReady){
        await callAdminFunction('adminUpdateUser',payload);
        toast('Usuário atualizado.');
      } else if(!uid){
        await callAdminFunction('adminCreateUser',payload);
        toast('Usuário criado. Agora envie o e-mail de senha.');
      } else {
        const id=uid.startsWith('legacy_')?payload.email:uid;
        await db.collection('usuarios').doc(id).set({nome:payload.nome,email:payload.email,perfil:payload.perfil,updated_at:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
        toast('Perfil atualizado.');
      }
      closeModal('usuario-modal');await loadUsers();populateFilters();await renderAdmin();
    }catch(err){toast(`Erro ao salvar usuário: ${err.message}`,'error')}
  }

  async function sendPasswordEmail(u){
    if(!u?.email)return;
    if(!confirm(`Enviar e-mail de definição/redefinição de senha para ${u.email}?`))return;
    try{await auth.sendPasswordResetEmail(u.email);toast('E-mail de senha enviado.');}catch(err){toast(`Não foi possível enviar o e-mail: ${err.message}`,'error')}
  }

  async function toggleUserDisabled(u){
    if(!u?.uid)return;
    if(u.uid===auth.currentUser?.uid){toast('Você não pode bloquear a própria conta.','error');return;}
    const next=!u.disabled;
    if(!confirm(`${next?'Bloquear':'Ativar'} o acesso de ${u.email}?`))return;
    try{await callAdminFunction('adminUpdateUser',{uid:u.uid,nome:u.nome||u.displayName||'',email:u.email,perfil:u.perfil||'editor',disabled:next});toast(next?'Usuário bloqueado.':'Usuário ativado.');await loadUsers();await renderAdmin();}catch(err){toast(err.message,'error')}
  }

  async function deleteUserAccount(u){
    if(!u?.uid)return;
    if(u.uid===auth.currentUser?.uid){toast('Você não pode excluir a própria conta.','error');return;}
    if(!confirm(`Excluir definitivamente a conta ${u.email}?\n\nIsso removerá o login e o perfil do usuário. Os registros históricos feitos por ele serão preservados.`))return;
    try{await callAdminFunction('adminDeleteUser',{uid:u.uid});toast('Usuário excluído.');await loadUsers();populateFilters();await renderAdmin();}catch(err){toast(`Erro ao excluir: ${err.message}`,'error')}
  }


  // Relatório calculado localmente com os casos já autorizados pelo Firebase.
  const reportFields=['busca','status','tipo','responsavel','arquivo','prazo','inicio','fim'];
  let reportRows=[];
  function populateReportOptions(){
    for(const [source,target] of [[els.filtroTipo,$('relatorio-tipo')],[els.filtroResponsavel,$('relatorio-responsavel')]]){
      const prior=target.value;
      target.replaceChildren(...Array.from(source.options,option=>new Option(option.textContent,option.value)));
      target.value=prior;
    }
  }
  function reportDateKey(value){const d=safeDate(value);if(!d)return '';const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`;}
  function getReportRows(){
    const filters=Object.fromEntries(reportFields.map(k=>[k,$('relatorio-'+k).value]));
    return state.cases.filter(c=>{
      if(filters.arquivo==='ativos'&&c.arquivado)return false;
      if(filters.arquivo==='arquivados'&&!c.arquivado)return false;
      if(filters.busca&&!caseSearchText(c).includes(normalizeText(filters.busca)))return false;
      if(filters.status&&c.status!==filters.status)return false;
      if(filters.tipo&&typeName(c)!==filters.tipo)return false;
      if(filters.responsavel&&![c.responsavel_email,c.responsavel_nome].includes(filters.responsavel))return false;
      const remaining=daysRemaining(c.prazo),date=reportDateKey(c.prazo);
      if(filters.prazo==='vencidos'&&!(remaining!==null&&remaining<0&&!['resolvido','enviado'].includes(c.status)))return false;
      if(filters.prazo==='hoje'&&remaining!==0)return false;
      if(['7','15','30'].includes(filters.prazo)&&!(remaining!==null&&remaining>=0&&remaining<=Number(filters.prazo)))return false;
      if(filters.prazo==='sem'&&remaining!==null)return false;
      if(filters.inicio&&(!date||date<filters.inicio))return false;
      if(filters.fim&&(!date||date>filters.fim))return false;
      return true;
    });
  }
  function reportCell(row,text){const cell=document.createElement('td');cell.textContent=String(text??'—');row.appendChild(cell);}
  function renderReport(){
    const body=$('relatorio-linhas');if(!body)return;
    reportRows=getReportRows();body.replaceChildren();
    let expired=0,upcoming=0,completed=0;
    for(const c of reportRows){
      const days=daysRemaining(c.prazo);
      if(['resolvido','enviado'].includes(c.status))completed++;
      else if(days!==null&&days<0)expired++;
      else if(days!==null&&days<=7)upcoming++;
      const row=document.createElement('tr');
      [c.processo||'—',typeName(c),statusLabel(c.status),c.responsavel_nome||userDisplay(c.responsavel_email)||'—',formatDate(c.prazo),prazoInfo(c).text,c.arquivado?'Arquivado':'Ativo'].forEach(t=>reportCell(row,t));
      body.appendChild(row);
    }
    if(!reportRows.length){const row=document.createElement('tr'),cell=document.createElement('td');cell.colSpan=7;cell.className='report-empty';cell.textContent='Nenhuma pendência encontrada com esses filtros.';row.appendChild(cell);body.appendChild(row);}
    $('relatorio-contagem').textContent=`${reportRows.length} registro(s)`;
    $('relatorio-resumo').replaceChildren(...[['Total',reportRows.length],['Vencidos',expired],['Próximos 7 dias',upcoming],['Enviados / resolvidos',completed]].map(([label,n])=>{const div=document.createElement('div');div.className='report-stat';const strong=document.createElement('strong');strong.textContent=n;const span=document.createElement('span');span.textContent=label;div.append(strong,span);return div;}));
  }
  function csvValue(value){const str=String(value??'').replace(/^[\s]*[=+@\-\t\r]/,match=>"'"+match);return '"'+str.replace(/"/g,'""')+'"';}
  function exportReportCsv(){
    renderReport();
    const rows=[['Processo','Tipo','Situação','Responsável','Prazo','Condição','Arquivo'],...reportRows.map(c=>[c.processo||'',typeName(c),statusLabel(c.status),c.responsavel_nome||userDisplay(c.responsavel_email)||'',formatDate(c.prazo),prazoInfo(c).text,c.arquivado?'Arquivado':'Ativo'])];
    const content='\ufeff'+rows.map(row=>row.map(csvValue).join(';')).join('\r\n');
    const url=URL.createObjectURL(new Blob([content],{type:'text/csv;charset=utf-8;'}));
    const a=document.createElement('a');a.href=url;a.download='relatorio-pendencias-'+reportDateKey(new Date())+'.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function wireReport(){
    reportFields.forEach(k=>{const el=$('relatorio-'+k);el.addEventListener(k==='busca'?'input':'change',renderReport);});
    $('relatorio-limpar-btn').addEventListener('click',()=>{reportFields.forEach(k=>$('relatorio-'+k).value=k==='arquivo'?'ativos':'');renderReport()});
    $('relatorio-csv-btn').addEventListener('click',exportReportCsv);
    $('relatorio-print-btn').addEventListener('click',()=>{renderReport();window.print()});
  }

  function wireUiNavigation(){
    const buttons={home:$('inicio-nav-btn'),cases:$('casos-nav-btn'),report:$('relatorios-nav-btn')};
    function activate(k){Object.entries(buttons).forEach(([name,button])=>button.classList.toggle('active',name===k));}
    function setList(view){state.listView=view;document.querySelectorAll('.sidebar-tab').forEach(b=>b.classList.toggle('active',b.dataset.view===view));applyFilters();}
    function openCases({view='ativos',status='',prazo=''}={}){
      setList(view);els.filtroStatus.value=status;els.filtroPrazo.value=prazo;applyFilters();
      showPanel('cases');activate('cases');
    }
    buttons.home.addEventListener('click',()=>{showPanel('home');activate('home')});
    buttons.cases.addEventListener('click',()=>openCases());
    buttons.report.addEventListener('click',()=>{showPanel('report');activate('report');renderReport()});
    $('home-vencidos-btn').addEventListener('click',()=>openCases({status:'vencido'}));
    $('home-prazos-btn').addEventListener('click',()=>openCases({prazo:'7'}));
    $('limpar-filtros-btn').addEventListener('click',()=>{els.busca.value='';[els.filtroStatus,els.filtroTipo,els.filtroResponsavel,els.filtroPrazo].forEach(el=>el.value='');applyFilters()});
    document.querySelectorAll('.detail-tab').forEach(btn=>btn.addEventListener('click',()=>selectDetailTab(btn.dataset.tab)));
  }

  function wireEvents(){
    wireUiNavigation();
    wireReport();
    els.loginForm.addEventListener('submit',async e=>{e.preventDefault();els.loginError.textContent='';try{await auth.signInWithEmailAndPassword(els.email.value.trim(),els.password.value);}catch(err){els.loginError.textContent='Usuário ou senha inválidos.';console.error(err)}});
    els.logout.addEventListener('click',()=>auth.signOut()); els.novoCaso.addEventListener('click',()=>openCaseModal()); els.refresh.addEventListener('click',async()=>{await Promise.all([loadUsers(),loadTypes()]);await loadCases();toast('Dados atualizados.')});
    [els.busca,els.filtroStatus,els.filtroTipo,els.filtroResponsavel,els.filtroPrazo].forEach(el=>el.addEventListener(el===els.busca?'input':'change',applyFilters));
    document.querySelectorAll('.sidebar-tab').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.sidebar-tab').forEach(b=>b.classList.remove('active'));btn.classList.add('active');state.listView=btn.dataset.view;applyFilters()}));
    els.editarCaso.addEventListener('click',()=>state.currentCase&&openCaseModal(state.currentCase));els.arquivarCaso.addEventListener('click',toggleArchive);els.salvarStatus.addEventListener('click',saveStatus);els.addParte.addEventListener('click',()=>openParteModal(null));els.enviarAndamento.addEventListener('click',addAndamento);
    els.editarComentarios.addEventListener('click',()=>{if(!state.currentCase)return;$('comentarios-editor').value=state.currentCase.comentarios||'';openModal('comments-modal')});$('salvar-comentarios-btn').addEventListener('click',saveComments);
    $('case-form').addEventListener('submit',saveCase);$('parte-form').addEventListener('submit',savePart);$('excluir-parte-btn').addEventListener('click',deletePart);$('parte-status').addEventListener('change',toggleParteFields);$('parte-lp').addEventListener('change',toggleParteFields);$('parte-contato').addEventListener('change',toggleParteFields);$('add-herdeiro-btn').addEventListener('click',()=>addHeirRow());
    els.adminNav.addEventListener('click',renderAdmin);$('voltar-painel-btn').addEventListener('click',()=>showPanel('home'));$('novo-tipo-btn').addEventListener('click',()=>openTypeModal());$('novo-usuario-btn').addEventListener('click',()=>openUserModal());$('tipo-form').addEventListener('submit',saveType);$('usuario-form').addEventListener('submit',saveUser);
    document.querySelectorAll('.modal-close,.modal-cancel').forEach(btn=>btn.addEventListener('click',()=>closeModal(btn.closest('.modal'))));document.querySelectorAll('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeModal(m)}));document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.modal:not(.hidden)').forEach(closeModal)});
  }

  auth.onAuthStateChanged(async user=>{
    if(!user){state.currentCaseId=null;state.currentCase=null;state.currentProfile=null;els.dashboard.classList.add('hidden');els.loginScreen.classList.remove('hidden');return;}
    try{await loadUsers();await loadProfile(user);await loadTypes();els.userLabel.textContent=`${state.currentProfile.nome||user.email} · ${state.currentProfile.perfil||'editor'}`;els.loginScreen.classList.add('hidden');els.dashboard.classList.remove('hidden');showPanel('home');applyPermissions();await loadCases();}
    catch(err){console.error(err);toast(`Erro ao carregar o painel: ${err.message}`,'error')}
  });

  wireEvents();
})();
