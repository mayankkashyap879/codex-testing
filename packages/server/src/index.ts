import express from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';

const prisma = new PrismaClient();
const app = express();
const upload = multer({ dest: 'uploads/' });
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/api/hello', (_, res) => {
  res.json({ message: 'Hello from Express' });
});

async function mockGeminiExtract(text: string): Promise<{ name: string; value: number }[]> {
  // Simple text parsing implementation used as a placeholder for the
  // real Gemini integration. It searches the uploaded text for biomarker
  // names and captures the first number that follows the name.
  const biomarkers = await prisma.biomarker.findMany({ select: { name: true } });
  const results: { name: string; value: number }[] = [];

  for (const { name } of biomarkers) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`${escaped}\\s*[:=-]?\\s*([0-9]*\\.?[0-9]+)`, 'i');
    const match = text.match(regex);
    if (match) {
      const value = parseFloat(match[1]);
      if (!isNaN(value)) {
        results.push({ name, value });
      }
    }
  }

  return results;
}

app.post('/api/upload', upload.single('file'), async (req, res): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: 'File required' });
    return;
  }
  const content = await fs.readFile(req.file.path, 'utf-8');
  const values = await mockGeminiExtract(content);
  const report = await prisma.labReport.create({ data: { filePath: req.file.path } });
  for (const v of values) {
    const biomarker = await prisma.biomarker.findUnique({ where: { name: v.name } });
    if (!biomarker) continue;
    await prisma.biomarkerResult.create({
      data: {
        value: v.value,
        biomarkerId: biomarker.id,
        reportId: report.id,
      },
    });
  }
  res.json({ success: true, reportId: report.id });
});

app.get('/api/report/:id', async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  const report = await prisma.labReport.findUnique({
    where: { id },
    include: { results: { include: { biomarker: true } } },
  });
  if (!report) {
    res.status(404).json({ error: 'Report not found' });
    return;
  }
  res.json(report);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
