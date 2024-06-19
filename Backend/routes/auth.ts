import { Router } from 'express';
import prisma from '../prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';
// dotenv.config();

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  console.log('User:', user)

  const token = jwt.sign({ userId: user.id,email: user.email,username: user.username , role: user.role }, JWT_SECRET, { expiresIn: '10m' });

  console.log("Token Signed!!")

  res.json({ token });
});

router.post('/signup', async (req, res) => {
  const { email,username, password } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      role: 'user'
    }
  });

  res.status(201).json({ message: 'User created successfully' });
});

export default router;
