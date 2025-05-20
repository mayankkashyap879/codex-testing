declare module 'express';
declare module 'multer';
declare module '@prisma/client' {
  export class PrismaClient {
    biomarker: any;
    labReport: any;
    biomarkerResult: any;
  }
}
declare module 'fs/promises';
declare var process: any;
