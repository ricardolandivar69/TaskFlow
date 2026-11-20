import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { validateRegister, validateLogin } from '../utils/validation.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const publicUser = (user) => ({ id: user._id.toString(), name: user.name, email: user.email });
const createToken = (user) => jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, {
  algorithm: 'HS256', expiresIn: process.env.JWT_EXPIRES_IN || '2h'
});

export const register = asyncHandler(async (req, res) => {
  const result = validateRegister(req.body);
  if (result.error) return res.status(400).json({ message: result.error });
  const { name, email, password } = result.value;
  if (await User.exists({ email })) return res.status(409).json({ message: 'Ese correo ya esta registrado.' });
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash });
  return res.status(201).json({ message: 'Cuenta creada. Ya puedes iniciar sesion.', user: publicUser(user) });
});

export const login = asyncHandler(async (req, res) => {
  const result = validateLogin(req.body);
  if (result.error) return res.status(400).json({ message: result.error });
  const { email, password } = result.value;
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: 'Correo o contrasena incorrectos.' });
  }
  return res.json({ message: 'Inicio de sesion exitoso.', token: createToken(user), user: publicUser(user) });
});

export const me = asyncHandler(async (req, res) => res.json({ user: publicUser(req.user) }));
