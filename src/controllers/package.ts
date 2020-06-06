import {
  PckgExist,
  RespExistPckgByIdOrName,
  Validate,
  RespValidateOneName,
  RespValidateOnePckgManager,
  ManyPckgsExist
} from '../helpers/index';
import Package, { IPackage } from '../models/Package';
import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import app from '../server/app';
import path from 'path';

const ctrlPckg = {
  index: (req: Request, res: Response, next: NextFunction): void => {
    res.json({ message: 'Index' });
  },

  addPckg: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (!req.body.name && !req.body.packageManager) {
      res.json({
        message: 'The data is wrong, send the name and packageManager'
      });
    } else if (!req.body.name && req.body.packageManager) {
      res.json({
        message: 'The data is wrong, send the name'
      });
    } else if (req.body.name && !req.body.packageManager) {
      res.json({
        message: 'The data is wrong, send the packageManager'
      });
    } else {
      let resValidateName: RespValidateOneName = Validate.Name.One(
        req.body.name,
        false
      );
      let resValidateNamePckgManager: RespValidateOneName = Validate.Name.One(
        req.body.packageManager,
        true
      );
      if (!resValidateName.valid && !resValidateNamePckgManager.valid) {
        res.json({
          message: [resValidateName.message, resValidateNamePckgManager.message]
        });
      } else if (resValidateName.valid && !resValidateNamePckgManager.valid) {
        res.json({
          message: resValidateNamePckgManager.message
        });
      } else if (!resValidateName.valid && resValidateNamePckgManager.valid) {
        res.json({
          message: resValidateName.message
        });
      } else {
        let resExistPckgByName: RespExistPckgByIdOrName = await PckgExist.ByName(
          req.body.name,
          false
        );
        let resValidatePckgManager: RespValidateOnePckgManager = await Validate.PckgManager.One(
          req.body.packageManager
        );
        if (resExistPckgByName.exist && !resValidatePckgManager.valid) {
          res.json({
            message: [
              resExistPckgByName.message,
              resValidatePckgManager.message
            ]
          });
        } else if (!resExistPckgByName.exist && !resValidatePckgManager.valid) {
          res.json({ message: resValidatePckgManager.message });
        } else if (resExistPckgByName.exist && resValidatePckgManager.valid) {
          res.json({
            message: resExistPckgByName.message
          });
        } else {
          const newPckg: IPackage = new Package(req.body);
          const newPckgSaved: IPackage = await newPckg.save();
          res.json(newPckgSaved);
        }
      }
    }
  },

  addManyPckgs: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    let pckgs: IPackage[] = req.body;
    let pckgsWithWrongData: IPackage[] = [];
    let pckgsWithInvalidName: IPackage[] = [];
    let pckgsWithInvalidNameOfPckgManager: IPackage[] = [];
    let pckgsAlreadyExists: IPackage[] = [];
    let pckgsWithInvalidPckgManager: IPackage[] = [];
    let pckgsSaved: IPackage[] = [];

    for (const pckg of pckgs) {
      if (!pckg.name && !pckg.packageManager) {
        pckg.message = 'The data is wrong, send the name and packageManager';
        pckgsWithWrongData.push(pckg);
      } else if (!pckg.name && pckg.packageManager) {
        pckg.message = 'The data is wrong, send the name';
        pckgsWithWrongData.push(pckg);
      } else if (pckg.name && !pckg.packageManager) {
        pckg.message = 'The data is wrong, send the packageManager';
        pckgsWithWrongData.push(pckg);
      } else {
        let resValidateName: RespValidateOneName = Validate.Name.One(
          pckg.name,
          false
        );
        let resValidateNamePckgManager: RespValidateOneName = Validate.Name.One(
          pckg.packageManager,
          true
        );
        if (!resValidateName.valid && !resValidateNamePckgManager.valid) {
          pckg.message = resValidateName.message;
          pckgsWithInvalidName.push(pckg);
          pckg.message = resValidateNamePckgManager.message;
          pckgsWithInvalidNameOfPckgManager.push(pckg);
        } else if (resValidateName.valid && !resValidateNamePckgManager.valid) {
          pckg.message = resValidateNamePckgManager.message;
          pckgsWithInvalidNameOfPckgManager.push(pckg);
        } else if (!resValidateName.valid && resValidateNamePckgManager.valid) {
          pckg.message = resValidateName.message;
          pckgsWithInvalidName.push(pckg);
        } else {
          let resExistPckgByName: RespExistPckgByIdOrName = await PckgExist.ByName(
            pckg.name,
            false
          );
          let resValidatePckgManager: RespValidateOnePckgManager = await Validate.PckgManager.One(
            pckg.packageManager
          );
          if (resExistPckgByName.exist && !resValidatePckgManager.valid) {
            pckg.message = resExistPckgByName.message;
            pckgsAlreadyExists.push(pckg);
            pckg.message = resValidatePckgManager.message;
            pckgsWithInvalidPckgManager.push(pckg);
          } else if (
            !resExistPckgByName.exist &&
            !resValidatePckgManager.valid
          ) {
            pckg.message = resValidatePckgManager.message;
            pckgsWithInvalidPckgManager.push(pckg);
          } else if (resExistPckgByName.exist && resValidatePckgManager.valid) {
            pckg.message = resExistPckgByName.message;
            pckgsAlreadyExists.push(pckg);
          } else {
            const newPckg: IPackage = new Package(pckg);
            const newPckgSaved: IPackage = await newPckg.save();
            pckgsSaved.push(newPckgSaved);
          }
        }
      }
    }
    res.json({
      pckgsWithWrongData,
      pckgsWithInvalidName,
      pckgsWithInvalidNameOfPckgManager,
      pckgsAlreadyExists,
      pckgsWithInvalidPckgManager,
      pckgsSaved
    });
  },

  listPckgs: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const pckgs: IPackage[] = await Package.find().sort({ name: 'asc' });
    res.json(pckgs);
  },

  onePckg: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const id: string = req.params.id;
    let resExistPckgById: RespExistPckgByIdOrName = await PckgExist.ById(
      id,
      true
    );
    if (resExistPckgById.exist) {
      res.json(resExistPckgById.pckg);
    } else {
      res.json({ message: resExistPckgById.message });
    }
  },

  somePckgs: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const ids: string[] = req.body;
    const {
      pckgsExist,
      pckgsNoExist,
      pckgsInvalid
    } = await ManyPckgsExist.ById(ids, true);
    res.json({
      packages: pckgsExist,
      packagesNoExist: pckgsNoExist,
      packagesInvalid: pckgsInvalid
    });
  },

  updatePckg: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (!req.body.name && !req.body.packageManager) {
      res.json({
        message: 'The data is wrong, send the name and packageManager'
      });
    } else if (!req.body.name && req.body.packageManager) {
      res.json({
        message: 'The data is wrong, send the name'
      });
    } else if (!req.body.name && req.body.packageManager) {
      res.json({
        message: 'The data is wrong, send the packageManager'
      });
    } else {
      let resValidateName: RespValidateOneName = Validate.Name.One(
        req.body.name,
        false
      );
      let resValidateNamePckgManager: RespValidateOneName = Validate.Name.One(
        req.body.packageManager,
        true
      );
      if (!resValidateName.valid && !resValidateNamePckgManager.valid) {
        res.json({
          message: [resValidateName.message, resValidateNamePckgManager.message]
        });
      } else if (resValidateName.valid && !resValidateNamePckgManager.valid) {
        res.json({
          message: resValidateNamePckgManager.message
        });
      } else if (!resValidateName.valid && resValidateNamePckgManager.valid) {
        res.json({
          message: resValidateName.message
        });
      } else {
        let resExistPckgByName: RespExistPckgByIdOrName = await PckgExist.ByName(
          req.body.name,
          false
        );
        let resValidatePckgManager: RespValidateOnePckgManager = await Validate.PckgManager.One(
          req.body.packageManager
        );
        if (resExistPckgByName.exist && !resValidatePckgManager.valid) {
          res.json({
            message: [
              resExistPckgByName.message,
              resValidatePckgManager.message
            ]
          });
        } else if (!resExistPckgByName.exist && !resValidatePckgManager.valid) {
          res.json({ message: resValidatePckgManager.message });
        } else if (resExistPckgByName.exist && resValidatePckgManager.valid) {
          res.json({
            message: resExistPckgByName.message
          });
        } else {
          const id: string = req.params.id;
          let resExistPckgById: RespExistPckgByIdOrName = await PckgExist.ById(
            id,
            true
          );
          if (resExistPckgById.exist) {
            const pckgWithNewData: IPackage | null = await Package.findOneAndUpdate(
              { _id: id },
              req.body,
              { new: true }
            );
            res.json({
              pckgWithOldData: resExistPckgById.pckg,
              pckgWithNewData
            });
          } else {
            res.json({ message: resExistPckgById.message });
          }
        }
      }
    }
  },

  updateManyPckgs: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    let pckgs: IPackage[] = req.body;
    let pckgsWithWrongData: IPackage[] = [];
    let pckgsWithInvalidId: IPackage[] = [];
    let pckgsWithInvalidName: IPackage[] = [];
    let pckgsWithInvalidNameOfPckgManager: IPackage[] = [];
    let pckgsAlreadyExists: IPackage[] = [];
    let pckgsWithInvalidPckgManager: IPackage[] = [];
    let pckgsUpdated: any[] = [];

    for (const pckg of pckgs) {
      if (!pckg._id && !pckg.name && !pckg.packageManager) {
        pckg.message =
          'The data is wrong, send the id, name and packageManager';
        pckgsWithWrongData.push(pckg);
      } else if (!pckg._id && pckg.name && pckg.packageManager) {
        pckg.message = 'The data is wrong, send the id';
        pckgsWithWrongData.push(pckg);
      } else if (pckg._id && !pckg.name && pckg.packageManager) {
        pckg.message = 'The data is wrong, send de name';
        pckgsWithWrongData.push(pckg);
      } else if (pckg._id && pckg.name && !pckg.packageManager) {
        pckg.message = 'The data is wrong, send the packageManager';
        pckgsWithWrongData.push(pckg);
      } else if (!pckg._id && !pckg.name && pckg.packageManager) {
        pckg.message = 'The data is wrong, send the id and name';
        pckgsWithWrongData.push(pckg);
      } else if (pckg._id && !pckg.name && !pckg.packageManager) {
        pckg.message = 'The data is wrong, send the name and packageManager';
        pckgsWithWrongData.push(pckg);
      } else if (!pckg._id && pckg.name && !pckg.packageManager) {
        pckg.message = 'The data is wrong, send the id and packageManager';
        pckgsWithWrongData.push(pckg);
      } else {
        let resValidateName: RespValidateOneName = Validate.Name.One(
          pckg.name,
          false
        );
        let resValidateNamePckgManager: RespValidateOneName = Validate.Name.One(
          pckg.packageManager,
          true
        );
        if (!resValidateName.valid && !resValidateNamePckgManager.valid) {
          pckg.message = resValidateName.message;
          pckgsWithInvalidName.push(pckg);
          pckg.message = resValidateNamePckgManager.message;
          pckgsWithInvalidNameOfPckgManager.push(pckg);
        } else if (resValidateName.valid && !resValidateNamePckgManager.valid) {
          pckg.message = resValidateNamePckgManager.message;
          pckgsWithInvalidNameOfPckgManager.push(pckg);
        } else if (!resValidateName.valid && resValidateNamePckgManager.valid) {
          pckg.message = resValidateName.message;
          pckgsWithInvalidName.push(pckg);
        } else {
          let resExistPckgByName: RespExistPckgByIdOrName = await PckgExist.ByName(
            pckg.name,
            false
          );
          let resValidatePckgManager: RespValidateOnePckgManager = await Validate.PckgManager.One(
            pckg.packageManager
          );
          if (resExistPckgByName.exist && !resValidatePckgManager.valid) {
            pckg.message = resExistPckgByName.message;
            pckgsAlreadyExists.push(pckg);
            pckg.message = resValidatePckgManager.message;
            pckgsWithInvalidPckgManager.push(pckg);
          } else if (
            !resExistPckgByName.exist &&
            !resValidatePckgManager.valid
          ) {
            pckg.message = resValidatePckgManager.message;
            pckgsWithInvalidPckgManager.push(pckg);
          } else if (resExistPckgByName.exist && resValidatePckgManager.valid) {
            pckg.message = resExistPckgByName.message;
            pckgsAlreadyExists.push(pckg);
          } else {
            let resValidatePckgManager: RespValidateOnePckgManager = await Validate.PckgManager.One(
              pckg.packageManager
            );
            if (!resValidatePckgManager.valid) {
              pckg.message = resValidatePckgManager.message;
              pckgsWithInvalidPckgManager.push(pckg);
            } else {
              let resExistPckgByName: RespExistPckgByIdOrName = await PckgExist.ById(
                pckg._id,
                true
              );
              if (resExistPckgByName.exist) {
                let pckgWithNewData: IPackage | null = await Package.findOneAndUpdate(
                  { _id: pckg._id },
                  { name: pckg.name, packageManager: pckg.packageManager },
                  { new: true }
                );
                const pckgUpdated = {
                  pckgWithNewData,
                  pckgWithOldData: resExistPckgByName.pckg
                };
                pckgsUpdated.push(pckgUpdated);
              } else {
                pckg.message = resExistPckgByName.message;
                pckgsWithInvalidId.push(pckg);
              }
            }
          }
        }
      }
    }
    res.json({
      pckgsWithWrongData,
      pckgsWithInvalidName,
      pckgsWithInvalidNameOfPckgManager,
      pckgsAlreadyExists,
      pckgsWithInvalidPckgManager,
      pckgsUpdated
    });
  },

  deletePckg: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const id: string = req.params.id;
    let resExistPckgById: RespExistPckgByIdOrName = await PckgExist.ById(
      id,
      false
    );
    if (resExistPckgById.exist) {
      const pckgDataDeleted: IPackage | null = await Package.findOneAndDelete({
        _id: id
      });
      res.json({ pckgDataDeleted });
    } else {
      res.json({
        message: resExistPckgById.message
      });
    }
  },

  deleteManyPckgs: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const ids: string[] = req.body;
    const {
      pckgsExist,
      pckgsNoExist,
      pckgsInvalid
    } = await ManyPckgsExist.ById(ids, false);
    let pckgsDeleted: any[] = [];
    for (const pckgId of pckgsExist) {
      let pckgDataDeleted: IPackage | null = await Package.findOneAndDelete({
        _id: pckgId
      });
      pckgsDeleted.push(pckgDataDeleted);
    }
    res.json({
      pckgsDeleted,
      pckgsNoExist,
      pckgsInvalid
    });
  },

  installEverythingAtOnce: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const pckgs: IPackage[] = await Package.find().sort({ name: 'asc' });
    let fileNames: string[] = [
      'installEverythingAtOnce.bat',
      'installEverythingAtOnce.sh',
      'installEverythingAtOnce.txt'
    ];
    let pathFile: string = app.get('public');
    let installEverythingAtOnce: string = 'npm install -g ';
    for (const pckg of pckgs) {
      installEverythingAtOnce += `${pckg.name} `;
    }
    fs.writeFileSync(
      path.join(pathFile, fileNames[0]),
      installEverythingAtOnce
    );
    fs.writeFileSync(
      path.join(pathFile, fileNames[1]),
      installEverythingAtOnce
    );
    fs.writeFileSync(
      path.join(pathFile, fileNames[2]),
      installEverythingAtOnce
    );
    // res.sendFile(path.join(pathFile, fileName));
    res.json({ script: installEverythingAtOnce });
  },

  installOneByOne: async (req: Request, res: Response, next: NextFunction) => {
    const pckgs: IPackage[] = await Package.find().sort({ name: 'asc' });
    let fileNames: string[] = [
      'installOneByOne.bat',
      'installOneByOne.sh',
      'installOneByOne.txt'
    ];
    let pathFile: string = app.get('public');
    let installOneByOne: string = '';
    let installOneByOneTxt: string = '';
    for (const pckg of pckgs) {
      installOneByOne += `npm install -g ${pckg.name} & `;
      installOneByOneTxt += `npm install -g ${pckg.name}\n`;
    }
    installOneByOne = installOneByOne.slice(0, installOneByOne.length - 3);
    fs.writeFileSync(path.join(pathFile, fileNames[0]), installOneByOne);
    fs.writeFileSync(path.join(pathFile, fileNames[1]), installOneByOne);
    fs.writeFileSync(path.join(pathFile, fileNames[2]), installOneByOneTxt);
    // res.sendFile(path.join(pathFile, fileName));
    res.json({ script: installOneByOne, txt: installOneByOneTxt });
  }
};

export default ctrlPckg;
