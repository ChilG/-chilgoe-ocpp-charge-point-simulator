import cors from 'cors';
import express, { Application } from 'express';

export const createServer = (): Application => {
  const app: Application = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  return app;
};
