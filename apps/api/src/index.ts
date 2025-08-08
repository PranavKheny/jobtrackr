import express from 'express';
import authRouter from './routes/auth';
import jobsRouter from './routes/jobs';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the API!');
});

app.use('/api/auth', authRouter);
app.use('/api/jobs', jobsRouter);

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
