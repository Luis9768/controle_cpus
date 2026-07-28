import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// =======================
// CPUs
// =======================
app.get('/api/cpus', async (req, res) => {
  const cpus = await prisma.cpu.findMany();
  res.json(cpus);
});

app.post('/api/cpus', async (req, res) => {
  try {
    const { id, name, location, date } = req.body;
    const cpu = await prisma.cpu.create({
      data: { id, name, location, date }
    });
    res.json(cpu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/cpus/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, date } = req.body;
    const cpu = await prisma.cpu.update({
      where: { id },
      data: { name, location, date }
    });
    res.json(cpu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/cpus/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.cpu.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// =======================
// ROOMS
// =======================
app.get('/api/rooms', async (req, res) => {
  const rooms = await prisma.room.findMany();
  res.json(rooms);
});

app.post('/api/rooms', async (req, res) => {
  try {
    const { name, pas } = req.body;
    const room = await prisma.room.create({
      data: { name, pas }
    });
    res.json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/rooms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, pas } = req.body;
    const room = await prisma.room.update({
      where: { id: parseInt(id) },
      data: { name, pas }
    });
    res.json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/rooms/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.room.delete({ where: { id: parseInt(id) } });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// =======================
// HEADSETS STOCK
// =======================
app.get('/api/headsets/stock', async (req, res) => {
  const stock = await prisma.headsetStock.findMany();
  res.json(stock);
});

app.post('/api/headsets/stock', async (req, res) => {
  try {
    const { brand, quantity } = req.body;
    const item = await prisma.headsetStock.create({
      data: { brand, quantity }
    });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/headsets/stock/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { brand, quantity } = req.body;
    const item = await prisma.headsetStock.update({
      where: { id: parseInt(id) },
      data: { brand, quantity }
    });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// =======================
// HEADSETS DEFECTS
// =======================
app.get('/api/headsets/defects', async (req, res) => {
  const defects = await prisma.headsetDefect.findMany();
  res.json(defects);
});

app.post('/api/headsets/defects', async (req, res) => {
  try {
    const { date, returnDate, brand, defect, status, box } = req.body;
    const item = await prisma.headsetDefect.create({
      data: { date, returnDate, brand, defect, status, box }
    });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/headsets/defects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { returnDate, status, box, brand, defect, date } = req.body; // Full update support
    const item = await prisma.headsetDefect.update({
      where: { id: parseInt(id) },
      data: { returnDate, status, box, brand, defect, date }
    });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/headsets/defects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.headsetDefect.delete({ where: { id: parseInt(id) } });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// =======================
// HISTORY
// =======================
app.get('/api/history', async (req, res) => {
  const history = await prisma.history.findMany({
    orderBy: { id: 'desc' },
    take: 100
  });
  res.json(history);
});

app.post('/api/history', async (req, res) => {
  try {
    const { date, action, cpu, from, to, brand, qty, details } = req.body;
    const item = await prisma.history.create({
      data: { date, action, cpu, from, to, brand, qty, details }
    });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// =======================
// USERS
// =======================
app.get('/api/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post('/api/users', async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const user = await prisma.user.create({
      data: { name, email, role }
    });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// =======================
// SERVER INIT
// =======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 API rodando na porta ${PORT}`);
});
