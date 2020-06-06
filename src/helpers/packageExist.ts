import Package, { IPackage } from '../models/Package';
import {
  Validate,
  RespValidateOneId,
  RespValidateOneName,
  IdInvalid
} from './validate';

export class RespExistPckgByIdOrName {
  constructor(exist: boolean, message: string, pckg?: IPackage) {
    this.exist = exist;
    this.message = message;
    this.pckg = pckg;
  }
  exist: boolean;
  message: string;
  pckg?: IPackage | undefined;
}

export const PckgExist = {
  ById: async (
    id: string,
    returnPckg: boolean
  ): Promise<RespExistPckgByIdOrName> => {
    let resValidateId: RespValidateOneId = Validate.Id.One(id);
    let res: RespExistPckgByIdOrName;
    if (resValidateId.valid) {
      const pckg: IPackage | null = await Package.findOne({ _id: id });
      if (pckg) {
        if (returnPckg) {
          res = new RespExistPckgByIdOrName(true, 'Package exists', pckg);
          return res;
        } else {
          res = new RespExistPckgByIdOrName(true, 'Package exists', undefined);
          return res;
        }
      } else {
        res = new RespExistPckgByIdOrName(
          false,
          `Package with ID: ${id} not found`,
          undefined
        );
        return res;
      }
    } else {
      res = new RespExistPckgByIdOrName(
        false,
        resValidateId.message,
        undefined
      );
      return res;
    }
  },

  ByName: async (
    name: string,
    returnPckg: boolean
  ): Promise<RespExistPckgByIdOrName> => {
    let resValidateName: RespValidateOneName = Validate.Name.One(name, false);
    let res: RespExistPckgByIdOrName;
    if (resValidateName.valid) {
      const pckg: IPackage | null = await Package.findOne({ name: name });
      let res: RespExistPckgByIdOrName;
      if (pckg) {
        if (returnPckg) {
          res = new RespExistPckgByIdOrName(
            true,
            `The ${name} package already exists`,
            pckg
          );
          return res;
        } else {
          res = new RespExistPckgByIdOrName(
            true,
            `The ${name} package already exists`,
            undefined
          );
          return res;
        }
      } else {
        res = new RespExistPckgByIdOrName(false, '', undefined);
        return res;
      }
    } else {
      res = new RespExistPckgByIdOrName(
        false,
        resValidateName.message,
        undefined
      );
      return res;
    }
  }
};

export class RespExistManyPckgById {
  constructor(
    pckgsExist: any[],
    pckgsNoExist: string[],
    pckgsInvalid: IdInvalid[]
  ) {
    this.pckgsExist = pckgsExist;
    this.pckgsNoExist = pckgsNoExist;
    this.pckgsInvalid = pckgsInvalid;
  }
  pckgsExist: any[];
  pckgsNoExist: string[];
  pckgsInvalid: IdInvalid[];
}

export const ManyPckgsExist = {
  ById: async (
    ids: string[],
    returnPckg: boolean
  ): Promise<RespExistManyPckgById> => {
    const { idsValid, idsInvalid } = Validate.Id.Many(ids);
    let pckgsExist: any[] = [];
    let pckgsNoExist: string[] = [];
    let res: RespExistManyPckgById;
    let resById: RespExistPckgByIdOrName;
    if (returnPckg) {
      for (const id of idsValid) {
        resById = await PckgExist.ById(id, returnPckg);
        if (resById.exist) {
          pckgsExist.push(resById.pckg);
        } else {
          pckgsNoExist.push(id);
        }
      }
      res = new RespExistManyPckgById(pckgsExist, pckgsNoExist, idsInvalid);
      return res;
    } else {
      for (const id of ids) {
        resById = await PckgExist.ById(id, returnPckg);
        if (resById.exist) {
          pckgsExist.push(id);
        } else {
          pckgsNoExist.push(id);
        }
      }
      res = new RespExistManyPckgById(pckgsExist, pckgsNoExist, idsInvalid);
      return res;
    }
  }
};
