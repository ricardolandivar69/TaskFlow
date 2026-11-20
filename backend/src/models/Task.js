import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User', index: true },
  title: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
  description: { type: String, default: '', maxlength: 500 },
  status: { type: String, enum: ['pending', 'in_progress', 'done'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: { type: Date, default: null }
}, { timestamps: true, versionKey: false });

taskSchema.index({ owner: 1, createdAt: -1 });

export const Task = mongoose.model('Task', taskSchema);
