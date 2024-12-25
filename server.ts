import express, { Application, Request, Response } from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import jupiterSwapRouter from './routes/api/jupiterswap';
dotenv.config();

const app: Application = express();
app.use(
    cors({
      origin: "*",
    })
  );
app.use(express.json());

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Jupiter API running');
});

app.use('/api/jupiterswap', jupiterSwapRouter);

app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
});

app.use((err: any, req: Request, res: Response, next: Function) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT: number | string = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));