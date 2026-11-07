import { Router, Request, Response } from 'express';
import { getPool } from '../db';

const router: Router = Router();

interface Query { name: string }

router.get('/typed', async (req: Request<{}, {}, {}, Query>, res: Response): Promise<void> => {
  const pool = await getPool();
  const r = await pool.request().query(`SELECT * FROM Users WHERE Username = '${req.query.name}'`);
  res.json(r.recordset as unknown[]);
});

export default router;
