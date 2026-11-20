import { useEffect, useState } from 'react';
import Icon from './Icon.jsx';

const defaultForm = { title: '', description: '', priority: 'medium', status: 'pending', dueDate: '' };

export default function TaskModal({ task, onClose, onSave, saving }) {
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(task ? {
      title: task.title,
      description: task.description || '',
      priority: task.priority || 'medium',
      status: task.status || 'pending',
      dueDate: task.dueDate?.slice(0, 10) || ''
    } : defaultForm);
    setError('');
  }, [task]);

  function update(event) { setForm((prev) => ({ ...prev, [event.target.name]: event.target.value })); }
  function submit(event) {
    event.preventDefault();
    if (form.title.trim().length < 3) { setError('Escribe un titulo de al menos 3 caracteres.'); return; }
    setError('');
    onSave({ ...form, title: form.title.trim(), dueDate: form.dueDate || null });
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget && !saving) onClose(); }}>
      <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-heading">
          <div><span className="eyebrow">TU ESPACIO DE TRABAJO</span><h2 id="modal-title">{task ? 'Editar tarea' : 'Crear nueva tarea'}</h2></div>
          <button type="button" className="icon-button" aria-label="Cerrar" onClick={onClose} disabled={saving}><Icon name="x" size={19}/></button>
        </div>
        <form onSubmit={submit} className="task-form">
          <label htmlFor="task-title">Titulo <span className="required">*</span></label>
          <input id="task-title" name="title" value={form.title} onChange={update} maxLength={100} placeholder="Ej. Preparar presentacion final" autoFocus required />
          <label htmlFor="task-description">Descripcion</label>
          <textarea id="task-description" name="description" value={form.description} onChange={update} maxLength={500} rows={3} placeholder="Agrega detalles de la actividad..." />
          <div className="form-two-cols">
            <div><label htmlFor="task-priority">Prioridad</label><select id="task-priority" name="priority" value={form.priority} onChange={update}><option value="low">Baja</option><option value="medium">Media</option><option value="high">Alta</option></select></div>
            <div><label htmlFor="task-status">Estado</label><select id="task-status" name="status" value={form.status} onChange={update}><option value="pending">Pendiente</option><option value="in_progress">En progreso</option><option value="done">Completada</option></select></div>
          </div>
          <label htmlFor="task-date">Fecha limite (opcional)</label>
          <input id="task-date" type="date" name="dueDate" value={form.dueDate} onChange={update} />
          {error && <p className="inline-error" role="alert">{error}</p>}
          <div className="modal-actions"><button className="button button-ghost" type="button" onClick={onClose} disabled={saving}>Cancelar</button><button className="button button-primary" disabled={saving} type="submit"><Icon name="check" size={16}/>{saving ? 'Guardando...' : task ? 'Guardar cambios' : 'Crear tarea'}</button></div>
        </form>
      </div>
    </div>
  );
}
