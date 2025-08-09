import express from 'express';
import authRouter from './routes/auth';
import jobsRouter from './routes/jobs';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const corsOptions = {
  origin: process.env.WEB_APP_URL || 'http://localhost:3000',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.get('/', (req, res) => {
  res.send('Hello from the API!');
});

app.use('/api/auth', authRouter);
app.use('/api/jobs', jobsRouter);

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
