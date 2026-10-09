import 'dotenv/config';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const port = Number(process.env.PORT || 4000);
const jwtSecret = process.env.JWT_SECRET;

if (!process.env.DATABASE_URL || !jwtSecret) {
  throw new Error('DATABASE_URL and JWT_SECRET must be configured in backend/.env');
}

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

const publicUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

const signToken = (userId) => jwt.sign({ userId }, jwtSecret, { expiresIn: '7d' });

function requireAuth(req, res, next) {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice('Bearer '.length)
    : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication is required.' });
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    req.userId = payload.userId;
    return next();
  } catch {
    return res.status(401).json({ error: 'Your session is invalid or has expired.' });
  }
}

function zoneCountFrom(value) {
  const zoneCount = Number(value ?? 0);
  if (!Number.isInteger(zoneCount) || zoneCount < 0 || zoneCount > 100) {
    return null;
  }
  return zoneCount;
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/signup', async (req, res, next) => {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    const zoneCount = zoneCountFrom(req.body.zoneCount);

    if (!name || !email || password.length < 8 || zoneCount === null) {
      return res.status(400).json({
        error: 'Name, a valid email, a password of at least 8 characters, and 0-100 zones are required.',
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.$transaction(async (transaction) => {
      const createdUser = await transaction.user.create({
        data: { name, email, passwordHash },
      });

      if (zoneCount > 0) {
        await transaction.zone.createMany({
          data: Array.from({ length: zoneCount }, (_, index) => ({
            userId: createdUser.id,
            zoneNumber: index + 1,
            name: `Zone ${index + 1}`,
          })),
        });
      }
      return createdUser;
    });

    return res.status(201).json({
      user: publicUser(user),
      token: signToken(user.id),
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'An account with that email already exists.' });
    }
    return next(error);
  }
});

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Email or password is incorrect.' });
    }

    return res.json({ user: publicUser(user), token: signToken(user.id) });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/zones', requireAuth, async (req, res, next) => {
  try {
    const zones = await prisma.zone.findMany({
      where: { userId: req.userId },
      orderBy: { zoneNumber: 'asc' },
    });
    return res.json({ zones });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/zones', requireAuth, async (req, res, next) => {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const zoneNumber = Number(req.body.zoneNumber);
    if (!name || !Number.isInteger(zoneNumber) || zoneNumber < 1) {
      return res.status(400).json({ error: 'A zone name and positive zone number are required.' });
    }

    const zone = await prisma.zone.create({
      data: { userId: req.userId, zoneNumber, name },
    });
    return res.status(201).json({ zone });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'That zone number already exists for this user.' });
    }
    return next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'An unexpected server error occurred.' });
});

const server = app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});

async function shutdown() {
  await prisma.$disconnect();
  server.close();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
