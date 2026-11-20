import { useCallback, useEffect, useMemo, useState } from 'react';
import Icon from './components/Icon.jsx';
import TaskModal from './components/TaskModal.jsx';
import { api } from './lib/api.js';

const statusLabels = { pending: 'Pendiente', in_progress: 'En progreso', done: 'Completada' };
const priorityLabels = { low: 'Baja', medium: 'Media', high: 'Alta' };
const months = new Intl.DateTimeFormat('es-EC', { day: 'numeric', month: 'long', year: 'numeric' });

function Logo({ inverse = false }) {
  return <div className={`logo-wrap ${inverse ? 'logo-inverse' : ''}`}><span className="logo-symbol"><Icon name="logo" size={23} /></span><span className="logo-text">Task<span>Flow</span></span></div>;
}

function AuthPage({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const update = (event) => setForm((old) => ({ ...old, [event.target.name]: event.target.value }));
  const switchMode = (next) => { setMode(next); setError(''); setSuccess(''); };

  async function submit(event) {
    event.preventDefault(); setBusy(true); setError(''); setSuccess('');
    try {
      if (mode === 'register') {
        await api('/auth/register', { method: 'POST', body: form });
        setMode('login'); setForm((prev) => ({ ...prev, password: '' }));
        setSuccess('Cuenta creada correctamente. Ahora inicia sesion.');
      } else {
        const result = await api('/auth/login', { method: 'POST', body: { email: form.email, password: form.password } });
        onLogin(result);
      }
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }

  return (
    <div className="auth-shell">
      <section className="auth-side">
        <Logo inverse />
        <div className="auth-side-content">
          <div className="auth-pill"><Icon name="sparkles" size={16} /> ORGANIZA, AVANZA, LOGRA</div>
          <h1>Grandes ideas.<br/><em>Pequenos pasos.</em><br/>Resultados reales.</h1>
          <p>Un lugar para convertir tus pendientes en avances. Organiza tus tareas, prioriza lo importante y sigue tu progreso.</p>
          <div className="auth-preview" aria-label="Vista previa de tareas">
            <div className="preview-top"><span>Mi semana</span><span className="preview-dot"/></div>
            <div className="preview-row"><span className="preview-check done">✓</span><span>Planificar proyecto final</span><small>LISTO</small></div>
            <div className="preview-row"><span className="preview-check"/><span>Preparar presentacion</span><small>EN CURSO</small></div>
            <div className="preview-row"><span className="preview-check"/><span>Revisar pendientes</span><small>HOY</small></div>
            <div className="preview-progress"><div/></div>
            <span className="preview-caption">Un paso a la vez. Vas muy bien.</span>
          </div>
        </div>
        <div className="auth-side-foot">PROYECTO ACADEMICO · DESARROLLO WEB · UNEMI</div>
      </section>
      <main className="auth-main">
        <div className="auth-form-box">
          <div className="auth-topmark"><span className="mark-dot"/> TU ESPACIO DE PRODUCTIVIDAD</div>
          <h2>{mode === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}</h2>
          <p className="auth-subtitle">{mode === 'login' ? 'Inicia sesion para continuar organizando tu dia.' : 'Comienza a gestionar tus tareas en unos segundos.'}</p>
          <div className="auth-tabs"><button type="button" onClick={() => switchMode('login')} className={mode === 'login' ? 'active' : ''}>Iniciar sesion</button><button type="button" onClick={() => switchMode('register')} className={mode === 'register' ? 'active' : ''}>Registrarse</button></div>
          <form className="auth-form" onSubmit={submit}>
            {mode === 'register' && <><label htmlFor="name">Nombre completo</label><input id="name" name="name" type="text" required minLength={2} maxLength={70} autoComplete="name" value={form.name} onChange={update} placeholder="Ej. Ana Perez"/></>}
            <label htmlFor="email">Correo electronico</label><input id="email" name="email" type="email" required autoComplete="email" value={form.email} onChange={update} placeholder="tu@correo.com"/>
            <label htmlFor="password">Contrasena</label><input id="password" name="password" type="password" required minLength={mode === 'register' ? 8 : 1} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={form.password} onChange={update} placeholder={mode === 'register' ? 'Minimo 8 caracteres' : 'Ingresa tu contrasena'}/>
            {error && <div className="auth-alert error" role="alert">{error}</div>}
            {success && <div className="auth-alert success" role="status">{success}</div>}
            <button className="button button-primary auth-submit" disabled={busy} type="submit">{busy ? 'Procesando...' : mode === 'login' ? 'Ingresar a TaskFlow' : 'Crear mi cuenta'}<Icon name="arrow" size={18}/></button>
          </form>
          <div className="auth-safe"><Icon name="shield" size={17}/> Tus datos estan protegidos con autenticacion JWT</div>
        </div>
        <footer className="auth-footer">TaskFlow · React + Express + MongoDB</footer>
      </main>
    </div>
  );
}

function SummaryCard({ label, count, icon, styleName, active, onClick }) {
  return <button type="button" onClick={onClick} className={`summary-card ${styleName} ${active ? 'summary-active' : ''}`}>
    <span className="summary-icon"><Icon name={icon} size={19}/></span><span className="summary-count">{count}</span><span className="summary-label">{label}</span>
  </button>;
}

function TaskCard({ task, onEdit, onDelete, onStatus }) {
  const date = task.dueDate ? months.format(new Date(task.dueDate)) : null;
  const status = task.status || 'pending';
  return <article className="task-card">
    <div className="task-top"><span className={`priority-tag priority-${task.priority || 'medium'}`}><span/>Prioridad {priorityLabels[task.priority] || 'Media'}</span><div className="task-action-row"><button className="small-icon" title="Editar tarea" aria-label={`Editar ${task.title}`} onClick={() => onEdit(task)}><Icon name="edit" size={17}/></button><button className="small-icon danger" title="Eliminar tarea" aria-label={`Eliminar ${task.title}`} onClick={() => onDelete(task)}><Icon name="trash" size={17}/></button></div></div>
    <h3>{task.title}</h3><p className="task-description">{task.description || 'Sin descripcion adicional.'}</p>
    <div className="task-bottom">{date && <span className="task-date"><Icon name="calendar" size={15}/>{date}</span>}
      <label className={`task-status status-${status}`}><span className="sr-only">Estado de {task.title}</span><select value={status} onChange={(event) => onStatus(task, event.target.value)}><option value="pending">Pendiente</option><option value="in_progress">En progreso</option><option value="done">Completada</option></select></label>
    </div>
  </article>;
}

function Dashboard({ user, token, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [modalTask, setModalTask] = useState(undefined);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  const refreshTasks = useCallback(async () => {
    try {
      const result = await api('/tasks', { token });
      setTasks(result.tasks || []);
    } catch (err) {
      if (err.status === 401) onLogout();
      else setNotice({ type: 'error', message: err.message });
    } finally { setLoading(false); }
  }, [token, onLogout]);

  useEffect(() => { refreshTasks(); }, [refreshTasks]);
  useEffect(() => {
    if (!notice) return;
    const timeout = setTimeout(() => setNotice(null), 4200);
    return () => clearTimeout(timeout);
  }, [notice]);

  const counts = useMemo(() => ({
    all: tasks.length,
    pending: tasks.filter((task) => task.status === 'pending').length,
    in_progress: tasks.filter((task) => task.status === 'in_progress').length,
    done: tasks.filter((task) => task.status === 'done').length
  }), [tasks]);
  const visibleTasks = useMemo(() => tasks.filter((task) => (filter === 'all' || task.status === filter) &&
    `${task.title} ${task.description || ''}`.toLowerCase().includes(search.toLowerCase().trim())
  ), [tasks, filter, search]);

  async function saveTask(data) {
    setSaving(true);
    try {
      const editing = Boolean(modalTask?._id);
      await api(editing ? `/tasks/${modalTask._id}` : '/tasks', {
        method: editing ? 'PUT' : 'POST', token, body: data
      });
      setModalTask(undefined);
      await refreshTasks();
      setNotice({ type: 'success', message: editing ? 'Tarea actualizada correctamente.' : 'Nueva tarea creada correctamente.' });
    } catch (err) {
      if (err.status === 401) onLogout();
      else setNotice({ type: 'error', message: err.message });
    } finally { setSaving(false); }
  }

  async function deleteTask(task) {
    if (!window.confirm(`Eliminar la tarea "${task.title}"?`)) return;
    try {
      await api(`/tasks/${task._id}`, { method: 'DELETE', token });
      await refreshTasks();
      setNotice({ type: 'success', message: 'Tarea eliminada.' });
    } catch (err) { if (err.status === 401) onLogout(); else setNotice({ type: 'error', message: err.message }); }
  }

  async function changeStatus(task, status) {
    try {
      await api(`/tasks/${task._id}`, { method: 'PUT', token, body: { status } });
      await refreshTasks();
      setNotice({ type: 'success', message: 'Estado actualizado.' });
    } catch (err) { if (err.status === 401) onLogout(); else setNotice({ type: 'error', message: err.message }); }
  }

  const today = months.format(new Date());
  return <div className="app-layout">
    <aside className="sidebar">
      <div className="sidebar-inner"><Logo inverse />
        <div className="side-section">ESPACIO DE TRABAJO</div>
        <button className="side-nav active" onClick={() => { setFilter('all'); setSearch(''); }}><Icon name="grid" size={19}/> Mi panel</button>
        <button className="side-nav" onClick={() => setFilter('pending')}><Icon name="list" size={19}/> Pendientes</button>
        <button className="side-nav" onClick={() => setFilter('done')}><Icon name="check" size={19}/> Completadas</button>
        <div className="side-tip"><span><Icon name="sparkles" size={19}/></span><strong>Un paso a la vez.</strong><p>Los grandes resultados empiezan con pequenas acciones.</p></div>
      </div>
      <div className="sidebar-account"><div className="avatar avatar-dark">{user.name?.charAt(0)?.toUpperCase() || 'U'}</div><div className="account-meta"><strong>{user.name}</strong><small>Cuenta personal</small></div><button className="logout-icon" aria-label="Cerrar sesion" title="Cerrar sesion" onClick={onLogout}><Icon name="logout" size={18}/></button></div>
    </aside>
    <div className="main-column">
      <header className="topbar"><span className="breadcrumb">Espacio personal <span>/</span> <strong>Mi panel</strong></span><span className="topbar-right"><Icon name="calendar" size={17}/> {today}</span></header>
      <main className="dashboard-main">
        <div className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-dot"/> TU PANEL PERSONAL</div><h1>Hola, {user.name?.split(' ')[0]} <span className="wave">✳</span></h1><p>Organiza tu dia, celebra tu progreso y sigue avanzando.</p></div><button className="button button-primary new-task" onClick={() => setModalTask(null)}><Icon name="plus" size={19}/> Nueva tarea</button></div>
        <section className="summary-grid" aria-label="Resumen de tareas">
          <SummaryCard label="Todas las tareas" count={counts.all} icon="layers" styleName="all" active={filter==='all'} onClick={() => setFilter('all')}/>
          <SummaryCard label="Pendientes" count={counts.pending} icon="clock" styleName="pending" active={filter==='pending'} onClick={() => setFilter('pending')}/>
          <SummaryCard label="En progreso" count={counts.in_progress} icon="list" styleName="progress" active={filter==='in_progress'} onClick={() => setFilter('in_progress')}/>
          <SummaryCard label="Completadas" count={counts.done} icon="check" styleName="done" active={filter==='done'} onClick={() => setFilter('done')}/>
        </section>
        <div className="tasks-heading"><div><h2>Mis tareas <span className="task-bubble">{visibleTasks.length}</span></h2><p>Toma el control de todo lo que tienes por hacer.</p></div><div className="tasks-toolbar"><div className="search-input"><Icon name="search" size={17}/><input aria-label="Buscar tareas" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Buscar tarea..."/></div></div></div>
        <div className="filter-row">{[['all','Todas'],['pending','Pendientes'],['in_progress','En progreso'],['done','Completadas']].map(([value,label]) => <button key={value} onClick={() => setFilter(value)} className={`filter-chip ${filter===value?'active':''}`}>{label}</button>)}</div>
        {loading ? <div className="empty-state"><div className="spinner"/><p>Cargando tus tareas...</p></div> : visibleTasks.length ? <section className="task-grid">{visibleTasks.map((task) => <TaskCard key={task._id} task={task} onEdit={setModalTask} onDelete={deleteTask} onStatus={changeStatus} />)}</section> : <div className="empty-state"><div className="empty-symbol"><Icon name="clipboard" size={38}/></div><h3>{search || filter!=='all' ? 'Sin resultados' : 'Todavia no tienes tareas'}</h3><p>{search || filter!=='all' ? 'Prueba otro filtro o crea una nueva tarea.' : 'Empieza creando tu primera tarea y transforma tus planes en avances.'}</p><button className="button button-soft" onClick={() => setModalTask(null)}><Icon name="plus" size={17}/> Crear tarea</button></div>}
        <footer className="dashboard-footer">TaskFlow © 2026 · Desarrollo Web · Practica Experimental 4</footer>
      </main>
    </div>
    {modalTask !== undefined && <TaskModal task={modalTask} onClose={()=>setModalTask(undefined)} onSave={saveTask} saving={saving}/>}
    {notice && <div className={`toast ${notice.type}`} role="status">{notice.type==='success'? <Icon name="check" size={17}/> : <Icon name="x" size={17}/>}<span>{notice.message}</span><button aria-label="Cerrar mensaje" onClick={()=>setNotice(null)}><Icon name="x" size={16}/></button></div>}
  </div>;
}

export default function App() {
  const [token, setToken] = useState(() => sessionStorage.getItem('taskflow_token') || '');
  const [user, setUser] = useState(null);
  const [verifying, setVerifying] = useState(Boolean(token));

  const logout = useCallback(() => {
    sessionStorage.removeItem('taskflow_token');
    setToken(''); setUser(null); setVerifying(false);
  }, []);

  useEffect(() => {
    let alive = true;
    if (!token) { setVerifying(false); return; }
    setVerifying(true);
    api('/auth/me', { token }).then((data) => { if (alive) {setUser(data.user); setVerifying(false);} })
      .catch(() => { if (alive) logout(); });
    return () => { alive = false; };
  }, [token, logout]);

  function login(result) {
    sessionStorage.setItem('taskflow_token', result.token);
    setToken(result.token); setUser(result.user); setVerifying(false);
  }

  if (verifying) return <div className="boot-screen"><Logo/><div className="spinner"/><span>Verificando tu sesion...</span></div>;
  return user && token ? <Dashboard user={user} token={token} onLogout={logout}/> : <AuthPage onLogin={login}/>;
}
