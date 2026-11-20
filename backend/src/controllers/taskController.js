import mongoose from 'mongoose';
import { Task } from '../models/Task.js';
import { validateTask, validStatuses } from '../utils/validation.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const validId = (id) => mongoose.isObjectIdOrHexString(id);

export const listTasks = asyncHandler(async (req, res) => {
  const { status } = req.query;
  if (status && !validStatuses.includes(status)) return res.status(400).json({ message: 'Filtro de estado no valido.' });
  const filter = { owner: req.user._id };
  if (status) filter.status = status;
  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  res.json({ total: tasks.length, tasks });
});

export const getTask = asyncHandler(async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ message: 'Identificador no valido.' });
  const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
  if (!task) return res.status(404).json({ message: 'Tarea no encontrada.' });
  res.json({ task });
});

export const createTask = asyncHandler(async (req, res) => {
  const result = validateTask(req.body);
  if (result.error) return res.status(400).json({ message: result.error });
  const task = await Task.create({ ...result.value, owner: req.user._id });
  res.status(201).json({ message: 'Tarea creada.', task });
});

export const updateTask = asyncHandler(async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ message: 'Identificador no valido.' });
  const result = validateTask(req.body, { partial: true });
  if (result.error) return res.status(400).json({ message: result.error });
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    { $set: result.value },
    { new: true, runValidators: true }
  );
  if (!task) return res.status(404).json({ message: 'Tarea no encontrada.' });
  res.json({ message: 'Tarea actualizada.', task });
});

export const deleteTask = asyncHandler(async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ message: 'Identificador no valido.' });
  const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  if (!task) return res.status(404).json({ message: 'Tarea no encontrada.' });
  res.json({ message: 'Tarea eliminada.', id: task._id.toString() });
});
