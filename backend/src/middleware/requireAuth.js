import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.get('Authorization') || '';
  const match = /^Bearer\s+(\S+)$/i.exec(header);
  if (!match) return res.status(401).json({ message: 'Debes iniciar sesion para continuar.' });

  let decoded;
  try {
    decoded = jwt.verify(match[1], process.env.JWT_SECRET, { algorithms: ['HS256'] });
  } catch {
    return res.status(401).json({ message: 'Token invalido o vencido.' });
  }

  if (!decoded?.sub || !/^[a-f0-9]{24}$/i.test(decoded.sub)) {
    return res.status(401).json({ message: 'Token invalido.' });
  }

  const user = await User.findById(decoded.sub).select('name email createdAt');
  if (!user) return res.status(401).json({ message: 'La cuenta ya no esta disponible.' });

  req.user = user;
  next();
});
