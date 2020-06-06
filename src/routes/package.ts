import { Router } from 'express';
import { ctrlPckg } from '../controllers/index';

const router: Router = Router();

router.route('/add').post(ctrlPckg.addPckg);

router.route('/add-many').post(ctrlPckg.addManyPckgs);

router.route('/one/:id').get(ctrlPckg.onePckg);

router.route('/some').get(ctrlPckg.somePckgs);

router.route('/list').get(ctrlPckg.listPckgs);

router.route('/update/:id').put(ctrlPckg.updatePckg);

router.route('/update').put(ctrlPckg.updateManyPckgs);

router.route('/delete/:id').delete(ctrlPckg.deletePckg);

router.route('/delete').delete(ctrlPckg.deleteManyPckgs);

router.route('/install-all').get(ctrlPckg.installEverythingAtOnce);

router.route('/install-one-by-one').get(ctrlPckg.installOneByOne);

export default router;
