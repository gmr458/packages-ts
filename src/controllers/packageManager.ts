// import {

// } from '../helpers/index';
import PackageManager, { IPackageManager } from '../models/PackageManager';
import { Request, Response, NextFunction } from 'express';

const ctrlPkgManager = {
  index: (req: Request, res: Response, next: NextFunction): void => {
    res.json({ message: 'Index' });
  },

  // addPkgManager: async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> => {
  //   if (!req.body.name) {
  //     res.json({ message: 'The data is wrong' });
  //   } else {
  //     const pkgManagerWithName: MsgResPkgManagerExist = await pkgManagerExistByName(
  //       req.body.name,
  //       false,
  //       false
  //     );
  //     if (pkgManagerWithName.exist) {
  //       res.json(pkgManagerWithName.message);
  //     } else {
  //       const newPkgManager: IPackageManager = new PackageManager(req.body);
  //       const newPkgManagerSaved: IPackageManager = await newPkgManager.save();
  //       res.json(newPkgManagerSaved);
  //     }
  //   }
  // },

  // addMultiplePkgManagers: async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> => {
  //   const pkgManagers: IPackageManager[] = req.body;
  //   const pkgManagersSaved: IPackageManager[] = [];
  //   const pkgManagersAlreadyExists: string[] = [];
  //   const pkgManagersWithWrongData: IPackageManager[] = [];

  //   for (const pkgManager of pkgManagers) {
  //     if (!pkgManager.name) {
  //       pkgManagersWithWrongData.push(pkgManager);
  //     } else {
  //       const pkgManagerWithName: MsgResPkgManagerExist = await pkgManagerExistByName(
  //         req.body.name,
  //         false,
  //         false
  //       );
  //       if (pkgManagerWithName.exist) {
  //         pkgManagersAlreadyExists.push(pkgManager.name);
  //       } else {
  //         const newPkgManager: IPackageManager = new PackageManager(pkgManager);
  //         const newPkgManagerSaved: IPackageManager = await newPkgManager.save();
  //         pkgManagersSaved.push(newPkgManagerSaved);
  //       }
  //     }
  //   }
  //   res.json({
  //     pkgManagersSaved,
  //     pkgManagersAlreadyExists,
  //     pkgManagersWithWrongData
  //   });
  // },

  // listPkgManagers: async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> => {
  //   const pkgManagers: IPackageManager[] = await PackageManager.find().sort({
  //     name: 'asc'
  //   });
  //   res.json(pkgManagers);
  // },

  // onePkgManager: async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> => {
  //   const id: string = req.params.id;
  //   const idValidated: MsgValidateId = validateId(id);
  //   if (idValidated.valid) {
  //     const resExist: MsgResPkgManagerExist = await pkgManagerExistById(
  //       id,
  //       true
  //     );
  //     if (resExist.exist) {
  //       res.json(resExist.pkgManager);
  //     } else {
  //       res.json(resExist.message);
  //     }
  //   } else {
  //     res.json(idValidated.message);
  //   }
  // },

  // somePkgsManager: async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> => {
  //   const ids: string[] = req.body;
  //   const { idsValid, idsInvalid } = validateMultipleId(ids);
  //   const { idsExist, idsNoExist } = await pkgsManagerExistById(idsValid, true);
  //   res.json({
  //     packagesMsnager: idsExist,
  //     packagesNoExist: idsNoExist,
  //     idsInvalid
  //   });
  // },

  // updatePkgManager: async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> => {
  //   const id: string = req.params.id;
  //   const idValidated: MsgValidateId = validateId(id);
  //   if (idValidated.valid) {
  //     const resExist: MsgResPkgManagerExist = await pkgManagerExistById(
  //       id,
  //       true
  //     );
  //     if (resExist.exist) {
  //       const pkgManagerExistWithName: MsgResPkgManagerExist = await pkgManagerExistByName(
  //         req.body.name,
  //         false,
  //         true
  //       );
  //       if (pkgManagerExistWithName.exist) {
  //         res.json(pkgManagerExistWithName.message);
  //       } else {
  //         const pkgManagerWithNewData: IPackageManager | null = await PackageManager.findOneAndUpdate(
  //           { _id: id },
  //           req.body,
  //           { new: true }
  //         );
  //         res.json({
  //           pkgManagerWithOldData: resExist.pkgManager,
  //           pkgManagerWithNewData
  //         });
  //       }
  //     } else {
  //       res.json(resExist.message);
  //     }
  //   } else {
  //     res.json(idValidated.message);
  //   }
  // },

  // updateMultiplePkgManager: async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> => {
  //   const pkgsManagerFromClient: IPackageManager[] = req.body;
  //   let pkgsUpdated = [];
  //   let pkgsNoUpdated: IPackageManager[] = [];

  //   for (const pkgManager of pkgsManagerFromClient) {
  //     pkgManager.message = [];
  //     const isValidId: MsgValidateId = validateId(pkgManager._id);
  //     if (!isValidId.valid) {
  //       pkgManager.message.push(isValidId.message);
  //     } else {
  //       const msgResPkgExist: MsgResPkgManagerExist = await pkgManagerExistById(
  //         pkgManager._id,
  //         false
  //       );
  //       if (!msgResPkgExist.exist) {
  //         pkgManager.message.push(msgResPkgExist.message);
  //       }
  //     }
  //     const ResValidateName: ResValidateName = validateName(pkgManager.name);
  //     if (!ResValidateName.valid) {
  //       pkgManager.message.push(ResValidateName.message);
  //     }
  //     if (pkgManager.message.length === 0) {
  //       const newData: IPackageManager = pkgManager;
  //       const pkgManagerUpdated: IPackageManager | null = await PackageManager.findOneAndUpdate(
  //         { _id: pkgManager._id },
  //         { name: pkgManager.name }
  //       );
  //       const pkgManagerData = {
  //         newData,
  //         oldData: pkgManagerUpdated
  //       };
  //       pkgsUpdated.push(pkgManagerData);
  //     } else {
  //       pkgsNoUpdated.push(pkgManager);
  //     }
  //   }
  //   res.json({ pkgsUpdated, pkgsNoUpdated });
  // },

  // deletePkgManager: async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> => {
  //   const id: string = req.params.id;
  //   const idValidated: MsgValidateId = validateId(id);
  //   if (idValidated.valid) {
  //     const resExist: MsgResPkgManagerExist = await pkgManagerExistById(
  //       id,
  //       false
  //     );
  //     if (resExist.exist) {
  //       const PkgManagerDataDeleted: IPackageManager | null = await PackageManager.findOneAndDelete(
  //         {
  //           _id: id
  //         }
  //       );
  //       res.json({ PkgManagerDataDeleted });
  //     } else {
  //       res.json(resExist.message);
  //     }
  //   } else {
  //     res.json(idValidated.message);
  //   }
  // },

  // deleteMultiplePkgManager: async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> => {
  //   const ids: string[] = req.body;
  //   const { idsValid, idsInvalid } = validateMultipleId(ids);
  //   const { idsExist, idsNoExist } = await pkgsManagerExistById(idsValid, true);
  //   let packagesDeleted: any = [];

  //   for (const id of idsExist) {
  //     let pkgManagerDataDeleted: IPackageManager | null = await PackageManager.findOneAndDelete(
  //       {
  //         _id: id
  //       }
  //     );
  //     packagesDeleted.push(pkgManagerDataDeleted);
  //   }
  //   res.json({
  //     idsValid,
  //     idsInvalid,
  //     idsExist,
  //     idsNoExist,
  //     packagesDeleted
  //   });
  // }
};

export default ctrlPkgManager;
