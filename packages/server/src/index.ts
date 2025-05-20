import express from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';

const prisma = new PrismaClient();
const app = express();
const upload = multer({ dest: 'uploads/' });
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/api/hello', (_: any, res: any) => {
  res.json({ message: 'Hello from Express' });
});

async function mockGeminiExtract(text: string): Promise<Array<{name: string; value: number}>> {
  // TODO: integrate Gemini API. Returns [{ name: biomarkerName, value: number }]
  return [];
}

app.post('/api/upload', upload.single('file'), async (req: any, res: any) => {
  const file = (req as any).file as { path: string } | undefined;
  if (!file) {
    return res.status(400).json({ error: 'File required' });
  }
  const content = await fs.readFile(file.path, 'utf-8');
  const values = await mockGeminiExtract(content);
  const report = await prisma.labReport.create({ data: { filePath: file.path } });
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
