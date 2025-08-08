import express from 'express';
import authRouter from './routes/auth';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the API!');
});

app.use('/api/auth', authRouter);

app.listen(port, () => {
  console.log(`API server listening at http://localhost:${port}`);
});
