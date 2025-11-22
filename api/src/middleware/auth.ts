import { Elysia } from 'elysia';
import { verifyAccessToken } from '@/utils/jwt';

export const authMiddleware = new Elysia({ name: 'auth-middleware' }).derive(({ request, set }) => {
  const auth = request.headers.get('authorization') || '';
  const prefix = 'Bearer ';

  if (!auth.startsWith(prefix)) {
    set.status = 401;
    throw new Error('No autorizado');
  }

  const token = auth.slice(prefix.length);

  try {
    const user = verifyAccessToken(token);
    return { user };
  } catch {
    set.status = 401;
    throw new Error('Token inválido o expirado');
  }
});
