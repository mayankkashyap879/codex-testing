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
  // TODO: integrate Gemini API. Returns [{ name: biomarkerName, value: number }]
  return [];
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

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
