import PackageManager, { IPackageManager } from '../models/PackageManager';
import {
  Validate,
  RespValidateOneId,
  RespValidateOneName,
  IdInvalid,
  NameInvalid
} from './validate';

export class RespExistPckgManagerByIdOrName {
  constructor(exist: boolean, message: string, pckgManager?: IPackageManager) {
    this.exist = exist;
    this.message = message;
    this.pckgManager = pckgManager;
  }
  exist: boolean;
  message: string;
  pckgManager: IPackageManager | undefined;
}

export const PckgMangerExist = {
  ById: async (
    id: string,
    returnPckgManager: boolean
  ): Promise<RespExistPckgManagerByIdOrName> => {
    let resValidateId: RespValidateOneId = Validate.Id.One(id);
    let res: RespExistPckgManagerByIdOrName;
    if (resValidateId.valid) {
      const pckgManager: IPackageManager | null = await PackageManager.findOne({
        _id: id
      });
      if (pckgManager) {
        if (returnPckgManager) {
          res = new RespExistPckgManagerByIdOrName(
            true,
            'Package Manager exists',
            pckgManager
          );
          return res;
        } else {
          res = new RespExistPckgManagerByIdOrName(
            true,
            'Package Manager exists',
            undefined
          );
          return res;
        }
      } else {
        res = new RespExistPckgManagerByIdOrName(
          false,
          `Package Manager with ID: ${id} not found`,
          undefined
        );
        return res;
      }
    } else {
      res = new RespExistPckgManagerByIdOrName(
        false,
        resValidateId.message,
        undefined
      );
      return res;
    }
  },

  ByName: async (
    name: string,
    returnPckgManager: boolean
  ): Promise<RespExistPckgManagerByIdOrName> => {
    let resValidateName: RespValidateOneName = Validate.Name.One(name, false);
    let res: RespExistPckgManagerByIdOrName;
    if (resValidateName.valid) {
      const pkgManager: IPackageManager | null = await PackageManager.findOne({
        name: name
      });
      if (pkgManager) {
        if (returnPckgManager) {
          res = new RespExistPckgManagerByIdOrName(
            true,
            `The ${name} Package Manager already exists`,
            pkgManager
          );
          return res;
        } else {
          res = new RespExistPckgManagerByIdOrName(
            true,
            `The ${name} Package Manager already exists`,
            undefined
          );
          return res;
        }
      } else {
        res = new RespExistPckgManagerByIdOrName(
          false,
          `Package Manager with name: ${name} not found`,
          undefined
        );
        return res;
      }
    } else {
      res = new RespExistPckgManagerByIdOrName(
        false,
        resValidateName.message,
        undefined
      );
      return res;
    }
  }
};

export class RespExistManyPckgManagerById {
  constructor(
    pckgManagerExist: any[],
    pckgManagerNoExist: string[],
    pckgsInvalid: IdInvalid[] | NameInvalid[]
  ) {
    this.pckgManagerExist = pckgManagerExist;
    this.pckgManagerNoExist = pckgManagerNoExist;
    this.pckgsInvalid = pckgsInvalid;
  }
  pckgManagerExist: any[];
  pckgManagerNoExist: string[];
  pckgsInvalid: IdInvalid[] | NameInvalid[];
}

export const ManyPckgsManagerExist = {
  ById: async (
    ids: string[],
    returnPckgManager: boolean
  ): Promise<RespExistManyPckgManagerById> => {
    const { idsValid, idsInvalid } = Validate.Id.Many(ids);
    let pckgsManagerExist: any[] = [];
    let pckgsManagerNoExist: string[] = [];
    for (const id of idsValid) {
      let resById: RespExistPckgManagerByIdOrName = await PckgMangerExist.ById(
        id,
        returnPckgManager
      );
      if (resById.exist) {
        if (returnPckgManager) {
          pckgsManagerExist.push(resById.pckgManager);
        } else {
          pckgsManagerExist.push(id);
        }
      } else {
        pckgsManagerNoExist.push(id);
      }
    }
    const res: RespExistManyPckgManagerById = new RespExistManyPckgManagerById(
      pckgsManagerExist,
      pckgsManagerNoExist,
      idsInvalid
    );
    return res;
  },

  ByName: async (
    names: string[],
    returnPckgManager: boolean
  ): Promise<RespExistManyPckgManagerById> => {
    let { namesValid, namesInvalid } = Validate.Name.Many(names);
    let pckgsManagerExist: any[] = [];
    let pckgsManagerNoExist: string[] = [];
    for (const name of namesValid) {
      let resByName: RespExistPckgManagerByIdOrName = await PckgMangerExist.ByName(
        name,
        returnPckgManager
      );
      if (resByName.exist) {
        if (returnPckgManager) {
          pckgsManagerExist.push(resByName.pckgManager);
        } else {
          pckgsManagerExist.push(name);
        }
      } else {
        pckgsManagerNoExist.push(name);
      }
    }
    const res: RespExistManyPckgManagerById = new RespExistManyPckgManagerById(
      pckgsManagerExist,
      pckgsManagerNoExist,
      namesInvalid
    );
    return res;
  }
};
