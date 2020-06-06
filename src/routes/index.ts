import { Router } from 'express';

const router: Router = Router();

router.route('/').get((req, res, next) => {
  res.json({ message: 'Index page' });
});

export default router;
