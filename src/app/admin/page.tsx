'use client'
import { useState, useEffect, useRef } from 'react'
import { sanityFetch } from '@/lib/sanity'
import './admin.css'

type Panel = 'dashboard' | 'artigos' | 'editor' | 'midia' | 'categorias' | 'utilizadores' | 'settings'

const PANEL_TITLES: Record<Panel, string> = {
  dashboard: 'Dashboard',
  artigos: 'Gestão de Artigos',
  editor: 'Editor de Artigo',
  midia: 'Biblioteca de Média',
  categorias: 'Categorias',
  utilizadores: 'Utilizadores',
  settings: 'Configurações',
}

type Artigo = {
  _id: string
  titulo: string
  slug: { current: string }
  publicadoEm: string | null
  destaqueCapa: boolean
  categoria: { nome: string; cor: string } | null
  autor: { nome: string } | null
}

type Categoria = {
  _id: string
  nome: string
  slug: { current: string }
  cor: string
  emoji: string
  artigoCount: number
}

type Stats = {
  totalArtigos: number
  totalCategorias: number
  totalAutores: number
  destaques: number
}

const STUDIO_URL = 'https://neonpop.sanity.studio'

function studioLink(id: string) {
  return `${STUDIO_URL}/desk/artigo;${id}`
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function AdminPage() {
  const [activePanel, setActivePanel] = useState<Panel>('dashboard')
  const [toastMsg, setToastMsg] = useState('')
  const [toastVisible, setToastVisible] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<Set<number>>(new Set([0]))
  const [filters, setFilters] = useState('todas')
  const [artigos, setArtigos] = useState<Artigo[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    async function load() {
      const [a, c, s] = await Promise.all([
        sanityFetch<Artigo[]>(
          `*[_type == "artigo"] | order(publicadoEm desc) { _id, titulo, slug, publicadoEm, destaqueCapa, categoria->{nome, cor}, autor->{nome} }`
        ),
        sanityFetch<Categoria[]>(
          `*[_type == "categoria"] | order(nome asc) { _id, nome, slug, cor, emoji, "artigoCount": count(*[_type == "artigo" && references(^._id)]) }`
        ),
        sanityFetch<Stats>(
          `{ "totalArtigos": count(*[_type == "artigo"]), "totalCategorias": count(*[_type == "categoria"]), "totalAutores": count(*[_type == "autor"]), "destaques": count(*[_type == "artigo" && destaqueCapa == true]) }`
        ),
      ])
      setArtigos(a || [])
      setCategorias(c || [])
      setStats(s || { totalArtigos: 0, totalCategorias: 0, totalAutores: 0, destaques: 0 })
      setLoading(false)
    }
    load()
  }, [])

  function showToast(msg: string) {
    setToastMsg(msg)
    setToastVisible(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setToastVisible(false), 3000)
  }

  function toggleMedia(i: number) {
    setSelectedMedia(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  useEffect(() => {
    const chart = document.getElementById('mini-chart')
    if (!chart || chart.childElementCount > 0) return
    const vals = [65, 82, 74, 91, 88, 55, 70]
    const max = Math.max(...vals)
    vals.forEach(v => {
      const b = document.createElement('div')
      b.className = 'mini-bar'
      b.style.height = (v / max * 100) + '%'
      b.title = v.toLocaleString() + ' visitas'
      chart.appendChild(b)
    })
  }, [activePanel])

  const navItems: { id: Panel; icon: string; label: string; count?: number; section?: string }[] = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', section: 'Principal' },
    { id: 'artigos', icon: '📰', label: 'Artigos', count: stats?.totalArtigos },
    { id: 'editor', icon: '✏️', label: 'Novo Artigo' },
    { id: 'midia', icon: '🖼️', label: 'Biblioteca de Média' },
    { id: 'categorias', icon: '🏷️', label: 'Categorias', section: 'Configuração' },
    { id: 'utilizadores', icon: '👥', label: 'Utilizadores' },
    { id: 'settings', icon: '⚙️', label: 'Configurações' },
  ]

  const artigosFiltrados = artigos.filter(a => {
    if (filters === 'pub') return !!a.publicadoEm
    if (filters === 'draft') return !a.publicadoEm
    if (filters === 'dest') return a.destaqueCapa
    return true
  })

  return (
    <div className="admin-root">
      <div className="shell">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="name">NEON<span>POP</span></div>
            <span className="badge-admin">Admin</span>
          </div>
          <nav>
            {navItems.map((item, i) => (
              <span key={item.id}>
                {item.section && <div key={`sec-${i}`} className="sidebar-section">{item.section}</div>}
                <a
                  href="#"
                  className={activePanel === item.id ? 'active' : ''}
                  onClick={e => { e.preventDefault(); setActivePanel(item.id) }}
                >
                  <span className="icon">{item.icon}</span>
                  {item.label}
                  {item.count !== undefined && item.count > 0 && <span className="count">{item.count}</span>}
                </a>
              </span>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <div className="avatar-sm">D</div>
            <div>
              <div className="user-name">Douglas Silva</div>
              <div className="user-role">Administrador</div>
            </div>
            <a href={STUDIO_URL} target="_blank" title="Abrir Studio" style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>⎋</a>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main">

          {/* TOPBAR */}
          <div className="topbar">
            <span className="topbar-title">{PANEL_TITLES[activePanel]}</span>
            <div className="topbar-spacer" />
            <div className="search-box">🔍 <span>Pesquisar...</span></div>
            <a href="/" target="_blank"><button className="topbar-btn">🌐 Ver site</button></a>
            <a href={STUDIO_URL} target="_blank"><button className="topbar-btn">✏️ Studio</button></a>
            <div className="avatar-sm" style={{ width: 32, height: 32, fontSize: '0.8rem' }}>D</div>
          </div>

          {loading && (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#888', fontSize: '0.9rem' }}>
              A carregar dados...
            </div>
          )}

          {/* DASHBOARD */}
          {!loading && activePanel === 'dashboard' && (
            <div className="panel">
              <div className="stats-grid">
                {[
                  { cls: 'red', label: 'Artigos publicados', val: String(stats?.totalArtigos ?? 0), sub: <><span className="up">{stats?.destaques ?? 0}</span> em destaque</> },
                  { cls: 'blue', label: 'Categorias', val: String(stats?.totalCategorias ?? 0), sub: <>activas no site</> },
                  { cls: 'green', label: 'Autores', val: String(stats?.totalAutores ?? 0), sub: <>registados</> },
                  { cls: 'orange', label: 'Destaques na capa', val: String(stats?.destaques ?? 0), sub: <>no carousel principal</> },
                ].map(c => (
                  <div key={c.label} className={`stat-card ${c.cls}`}>
                    <div className="stat-label">{c.label}</div>
                    <div className="stat-value">{c.val}</div>
                    <div className="stat-sub">{c.sub}</div>
                  </div>
                ))}
              </div>

              <div className="quick-row">
                {[
                  { icon: '📰', label: 'Total artigos', val: String(stats?.totalArtigos ?? 0) },
                  { icon: '🏷️', label: 'Categorias', val: String(stats?.totalCategorias ?? 0) },
                  { icon: '✍️', label: 'Autores', val: String(stats?.totalAutores ?? 0) },
                  { icon: '⭐', label: 'Destaques', val: String(stats?.destaques ?? 0) },
                  { icon: '🖼️', label: 'Sem imagem', val: String(artigos.filter(a => !a.categoria).length) },
                ].map(q => (
                  <div key={q.label} className="quick-item">
                    <span className="quick-icon">{q.icon}</span>
                    <div><div className="quick-label">{q.label}</div><div className="quick-val">{q.val}</div></div>
                  </div>
                ))}
              </div>

              <div className="grid-3-1">
                <div className="card">
                  <div className="card-head">
                    <h3>📈 Visitas — últimos 7 dias</h3>
                  </div>
                  <div className="card-body">
                    <div className="mini-chart" id="mini-chart" />
                    <div className="chart-labels">
                      {['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'].map(d => <span key={d}>{d}</span>)}
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-head"><h3>⚡ Actividade recente</h3></div>
                  <div className="card-body" style={{ padding: '0.5rem 1rem' }}>
                    <ul className="activity-list">
                      {artigos.slice(0, 4).map(a => (
                        <li key={a._id}>
                          <div className="act-icon pub">✓</div>
                          <div className="act-text"><strong>{a.autor?.nome ?? 'Redacção'}</strong> publicou &quot;{a.titulo}&quot;</div>
                          <span className="act-time">{formatDate(a.publicadoEm)}</span>
                        </li>
                      ))}
                      {artigos.length === 0 && <li style={{ color: '#aaa', fontSize: '0.78rem' }}>Sem artigos ainda.</li>}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-head">
                  <h3>📰 Artigos recentes</h3>
                  <a onClick={() => setActivePanel('artigos')}>Ver todos »</a>
                </div>
                <div className="card-body" style={{ padding: 0 }}>
                  <table>
                    <thead><tr><th>Título</th><th>Categoria</th><th>Autor</th><th>Estado</th><th>Data</th><th>Acções</th></tr></thead>
                    <tbody>
                      {artigos.slice(0, 5).map(a => (
                        <tr key={a._id}>
                          <td style={{ maxWidth: 280, fontWeight: 'bold' }}>{a.titulo}</td>
                          <td>{a.categoria ? <span className="tag">{a.categoria.nome}</span> : '—'}</td>
                          <td>{a.autor?.nome ?? '—'}</td>
                          <td><span className={`status-badge ${a.publicadoEm ? 'pub' : 'draft'}`}>{a.publicadoEm ? 'Publicado' : 'Rascunho'}</span></td>
                          <td>{formatDate(a.publicadoEm)}</td>
                          <td>
                            <div className="action-btns">
                              <a href={studioLink(a._id)} target="_blank"><button className="action-btn">✎ Editar</button></a>
                              <a href={`/artigo/${a.slug.current}`} target="_blank"><button className="action-btn">👁</button></a>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {artigos.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: '#aaa', padding: '2rem' }}>Nenhum artigo encontrado. <a href={STUDIO_URL} target="_blank" style={{ color: '#c0392b' }}>Criar no Studio →</a></td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ARTIGOS */}
          {!loading && activePanel === 'artigos' && (
            <div className="panel">
              <div className="page-header">
                <h2>📰 Gestão de Artigos</h2>
                <a href={`${STUDIO_URL}/desk/artigo`} target="_blank"><button className="btn-primary">+ Novo Artigo</button></a>
              </div>
              <div className="filters">
                {[['todas',`Todos (${artigos.length})`],['pub',`Publicados (${artigos.filter(a=>!!a.publicadoEm).length})`],['draft',`Rascunhos (${artigos.filter(a=>!a.publicadoEm).length})`],['dest',`Destaques (${artigos.filter(a=>a.destaqueCapa).length})`]].map(([k,l]) => (
                  <button key={k} className={`filter-btn${filters === k ? ' active' : ''}`} onClick={() => setFilters(k)}>{l}</button>
                ))}
                <div style={{ flex: 1 }} />
                <select className="select-input">
                  <option value="">Todas as categorias</option>
                  {categorias.map(c => <option key={c._id} value={c._id}>{c.nome}</option>)}
                </select>
              </div>
              <div className="card">
                <div className="card-body" style={{ padding: 0 }}>
                  <table>
                    <thead><tr><th>#</th><th>Título</th><th>Categoria</th><th>Autor</th><th>Estado</th><th>Publicação</th><th>Acções</th></tr></thead>
                    <tbody>
                      {artigosFiltrados.map((a, i) => (
                        <tr key={a._id}>
                          <td style={{ color: '#aaa', width: 30 }}>{i + 1}</td>
                          <td style={{ maxWidth: 260, fontWeight: 'bold' }}>{a.titulo}</td>
                          <td>{a.categoria ? <span className="tag" style={{ background: a.categoria.cor + '22', color: a.categoria.cor }}>{a.categoria.nome}</span> : '—'}</td>
                          <td>{a.autor?.nome ?? '—'}</td>
                          <td><span className={`status-badge ${a.publicadoEm ? 'pub' : 'draft'}`}>{a.publicadoEm ? 'Publicado' : 'Rascunho'}</span></td>
                          <td>{formatDate(a.publicadoEm)}</td>
                          <td>
                            <div className="action-btns">
                              <a href={studioLink(a._id)} target="_blank"><button className="action-btn">✎ Editar</button></a>
                              <a href={`/artigo/${a.slug.current}`} target="_blank"><button className="action-btn">👁</button></a>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {artigosFiltrados.length === 0 && (
                        <tr><td colSpan={7} style={{ textAlign: 'center', color: '#aaa', padding: '2rem' }}>
                          Nenhum artigo. <a href={`${STUDIO_URL}/desk/artigo`} target="_blank" style={{ color: '#c0392b' }}>Criar no Studio →</a>
                        </td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="pagination">
                <button className="page-btn active">1</button>
              </div>
            </div>
          )}

          {/* EDITOR — redireciona para Studio */}
          {!loading && activePanel === 'editor' && (
            <div className="panel">
              <div className="page-header">
                <h2>✏️ Editor de Artigo</h2>
              </div>
              <div className="card" style={{ maxWidth: 600, margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✏️</div>
                <h3 style={{ marginBottom: '0.7rem', fontSize: '1.1rem' }}>Editar artigos no Sanity Studio</h3>
                <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  O editor de conteúdo completo está disponível no Sanity Studio, onde pode criar e editar artigos com texto rico, imagens, categorias e muito mais.
                </p>
                <a href={`${STUDIO_URL}/desk/artigo`} target="_blank">
                  <button className="btn-primary" style={{ margin: '0 auto', fontSize: '1rem', padding: '0.7rem 1.5rem' }}>
                    Abrir Editor no Studio →
                  </button>
                </a>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <div className="card-head" style={{ background: '#fff', borderRadius: 6, marginBottom: '0.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <h3>📰 Artigos recentes — clique para editar</h3>
                </div>
                <div className="card">
                  <div className="card-body" style={{ padding: 0 }}>
                    <table>
                      <thead><tr><th>Título</th><th>Categoria</th><th>Estado</th><th>Acções</th></tr></thead>
                      <tbody>
                        {artigos.slice(0, 8).map(a => (
                          <tr key={a._id}>
                            <td style={{ fontWeight: 'bold' }}>{a.titulo}</td>
                            <td>{a.categoria?.nome ?? '—'}</td>
                            <td><span className={`status-badge ${a.publicadoEm ? 'pub' : 'draft'}`}>{a.publicadoEm ? 'Publicado' : 'Rascunho'}</span></td>
                            <td>
                              <div className="action-btns">
                                <a href={studioLink(a._id)} target="_blank"><button className="action-btn">✎ Editar no Studio</button></a>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MÉDIA */}
          {!loading && activePanel === 'midia' && (
            <div className="panel">
              <div className="page-header">
                <h2>🖼️ Biblioteca de Média</h2>
                <a href={`${STUDIO_URL}/desk`} target="_blank"><button className="btn-primary">Gerir no Studio</button></a>
              </div>
              <div className="media-toolbar">
                <select className="select-input"><option>Todos os tipos</option></select>
              </div>
              <div className="media-grid">
                <div className="upload-zone" onClick={() => window.open(`${STUDIO_URL}/desk`, '_blank')}>
                  <div style={{ fontSize: '1.8rem' }}>📤</div>
                  <div>Enviar imagens</div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 'normal' }}>via Sanity Studio</div>
                </div>
                {[
                  { name: 'capa-neonpop.jpg', meta: '1920×1080', bg: 'linear-gradient(135deg,#1a0a2e,#6c1fb7)' },
                  { name: 'kpop-europa.jpg', meta: '1280×720', bg: 'linear-gradient(135deg,#0e1a3d,#1a6bb5)' },
                  { name: 'eurovisao.jpg', meta: '1920×1080', bg: 'linear-gradient(135deg,#2c0a0a,#c0392b)' },
                  { name: 'musica.jpg', meta: '1600×900', bg: 'linear-gradient(135deg,#0e3d20,#27ae60)' },
                  { name: 'estilo.jpg', meta: '1920×1080', bg: 'linear-gradient(135deg,#3d0e2c,#b52771)' },
                ].map((m, i) => (
                  <div key={i} className={`media-item${selectedMedia.has(i) ? ' selected' : ''}`} onClick={() => toggleMedia(i)}>
                    <div className="media-thumb" style={{ background: m.bg }} />
                    <div className="media-info">
                      <div className="fname">{m.name}</div>
                      <div className="fmeta">{m.meta}</div>
                    </div>
                    {selectedMedia.has(i) && <div className="media-check">✓</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CATEGORIAS */}
          {!loading && activePanel === 'categorias' && (
            <div className="panel">
              <div className="page-header">
                <h2>🏷️ Categorias</h2>
                <a href={`${STUDIO_URL}/desk/categoria`} target="_blank"><button className="btn-primary">+ Nova Categoria</button></a>
              </div>
              <div className="card">
                <div className="card-body" style={{ padding: 0 }}>
                  <table>
                    <thead><tr><th>Nome</th><th>Emoji</th><th>Cor</th><th>Slug</th><th>Artigos</th><th>Acções</th></tr></thead>
                    <tbody>
                      {categorias.map(c => (
                        <tr key={c._id}>
                          <td><strong>{c.nome}</strong></td>
                          <td>{c.emoji ?? '—'}</td>
                          <td><span style={{ display: 'inline-block', width: 16, height: 16, background: c.cor, borderRadius: 3, verticalAlign: 'middle' }} /> <span style={{ fontSize: '0.75rem', color: '#888' }}>{c.cor}</span></td>
                          <td><code style={{ fontSize: '0.75rem', background: '#f5f5f5', padding: '0.1rem 0.3rem', borderRadius: 3 }}>/{c.slug.current}</code></td>
                          <td>{c.artigoCount}</td>
                          <td>
                            <div className="action-btns">
                              <a href={`${STUDIO_URL}/desk/categoria;${c._id}`} target="_blank"><button className="action-btn">✎ Editar</button></a>
                              <a href={`/categoria/${c.slug.current}`} target="_blank"><button className="action-btn">👁</button></a>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {categorias.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', color: '#aaa', padding: '2rem' }}>Nenhuma categoria. <a href={`${STUDIO_URL}/desk/categoria`} target="_blank" style={{ color: '#c0392b' }}>Criar no Studio →</a></td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* UTILIZADORES */}
          {!loading && activePanel === 'utilizadores' && (
            <div className="panel">
              <div className="page-header">
                <h2>👥 Utilizadores</h2>
                <a href={`${STUDIO_URL}/settings/members`} target="_blank"><button className="btn-primary">+ Convidar</button></a>
              </div>
              <div className="users-grid">
                <div className="user-card">
                  <div className="avatar" style={{ background: 'linear-gradient(135deg,#c0392b,#e74c3c)' }}>D</div>
                  <div style={{ flex: 1 }}>
                    <div className="user-name">Douglas Silva</div>
                    <div className="user-email">douglas.silva@niu.pt</div>
                    <span className="role-badge admin">Administrador</span>
                    <div className="user-stats"><span><strong>{stats?.totalArtigos ?? 0}</strong> artigos</span><span><strong>Hoje</strong> activo</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {!loading && activePanel === 'settings' && (
            <div className="panel">
              <div className="page-header"><h2>⚙️ Configurações</h2></div>
              <div className="settings-grid">
                <div className="settings-nav card">
                  {['🏠 Geral','🎨 Aparência','📧 Newsletter','🔒 Segurança'].map((l, i) => (
                    <a key={l} className={i === 0 ? 'active' : ''}>{l}</a>
                  ))}
                </div>
                <div className="settings-section">
                  <h3>Configurações Gerais</h3>
                  <div className="form-row">
                    <div className="form-group"><label className="form-label">Nome do portal</label><input className="form-control" defaultValue="NEONPOP" /></div>
                    <div className="form-group"><label className="form-label">URL do site</label><input className="form-control" defaultValue="neonpop.pages.dev" /></div>
                  </div>
                  <div className="form-group-full"><label className="form-label">Descrição</label><input className="form-control" defaultValue="A cultura pop europeia em português." /></div>
                  <div className="form-row">
                    <div className="form-group"><label className="form-label">Idioma</label><select className="form-select form-control"><option>Português (PT)</option></select></div>
                    <div className="form-group"><label className="form-label">Fuso horário</label><select className="form-select form-control"><option>Europe/Lisbon (UTC+1)</option></select></div>
                  </div>
                  <h3 style={{ marginTop: '1.5rem' }}>Opções do portal</h3>
                  {[
                    { label: 'Ticker de notícias urgentes', desc: 'Barra animada no topo com últimas notícias', on: true },
                    { label: 'Modo de manutenção', desc: 'Exibe página de manutenção para visitantes', on: false },
                  ].map(t => <ToggleRow key={t.label} label={t.label} desc={t.desc} defaultOn={t.on} />)}
                  <div style={{ marginTop: '1.2rem' }}>
                    <button className="btn-primary" onClick={() => showToast('✅ Configurações guardadas!')}>💾 Guardar</button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {toastVisible && (
        <div className="toast">✅ <span>{toastMsg}</span></div>
      )}
    </div>
  )
}

function ToggleRow({ label, desc, defaultOn }: { label: string; desc: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <div className="toggle-row">
      <div><div className="toggle-label">{label}</div><div className="toggle-desc">{desc}</div></div>
      <div className={`toggle${on ? ' on' : ''}`} onClick={() => setOn(v => !v)} />
    </div>
  )
}
