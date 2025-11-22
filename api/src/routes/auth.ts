import { Elysia } from 'elysia';
import { AppDataSource } from '@/database';
import { User } from '@/entities/User';
import { loginSchema, refreshSchema } from '@/schemas/auth.schema';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '@/utils/jwt';
import * as bcrypt from '@node-rs/bcrypt';

export function createAuthRoutes(app: Elysia) {
  const userRepo = AppDataSource.getRepository(User);

  return app.group('/api/auth', (app) =>
    app
      .post('/login', async ({ body, set }) => {
        try {
          const { username, password } = loginSchema.parse(body);

          const user = await userRepo.findOne({ where: { username } });
          if (!user) {
            set.status = 401;
            return { success: false, error: 'Credenciales inválidas' };
          }

          const match = await bcrypt.compare(password, user.passwordHash);
          if (!match) {
            set.status = 401;
            return { success: false, error: 'Credenciales inválidas' };
          }

          const payload = { sub: user.id, username: user.username };
          const accessToken = signAccessToken(payload);
          const refreshToken = signRefreshToken(payload);

          user.refreshToken = refreshToken;
          await userRepo.save(user);

          return { success: true, data: { accessToken, refreshToken } };
        } catch (error) {
          if (error && typeof error === 'object' && 'issues' in (error as any)) {
            set.status = 400;
            return { success: false, error: 'Entrada inválida', details: error };
          }
          set.status = 500;
          return { success: false, error: 'Error en inicio de sesión' };
        }
      })

      .post('/refresh', async ({ body, set }) => {
        try {
          const { refreshToken } = refreshSchema.parse(body);
          const payload = verifyRefreshToken(refreshToken);

          const user = await userRepo.findOne({ where: { id: payload.sub } });
          if (!user || user.refreshToken !== refreshToken) {
            set.status = 401;
            return { success: false, error: 'Refresh token inválido' };
          }

          const newPayload = { sub: user.id, username: user.username };
          const accessToken = signAccessToken(newPayload);
          const newRefreshToken = signRefreshToken(newPayload);

          user.refreshToken = newRefreshToken;
          await userRepo.save(user);

          return { success: true, data: { accessToken, refreshToken: newRefreshToken } };
        } catch (error) {
          if (error && typeof error === 'object' && 'issues' in (error as any)) {
            set.status = 400;
            return { success: false, error: 'Entrada inválida', details: error };
          }
          set.status = 401;
          return { success: false, error: 'No autorizado' };
        }
      })

      .post('/logout', async ({ body, set }) => {
        try {
          const { refreshToken } = refreshSchema.parse(body);
          const payload = verifyRefreshToken(refreshToken);
          const user = await userRepo.findOne({ where: { id: payload.sub } });
          if (user) {
            user.refreshToken = null;
            await userRepo.save(user);
          }
          return { success: true, data: true };
        } catch {
          set.status = 200;
          return { success: true, data: true };
        }
      })
  );
}
