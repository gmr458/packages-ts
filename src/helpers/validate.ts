import PackageManager, { IPackageManager } from '../models/PackageManager';

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

class RespValidateOne {
  constructor(valid: boolean, message: string) {
    this.valid = valid;
    this.message = message;
  }
  valid: boolean;
  message: string;
}

// -----------------------------------------------------------------------------

export class RespValidateOneId extends RespValidateOne {}

export class RespValidateOneName extends RespValidateOne {}

export class RespValidateOnePckgManager extends RespValidateOne {}

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

export class RespValidateManyIds {
  constructor(idsValid: string[], idsInvalid: IdInvalid[]) {
    this.idsInvalid = idsInvalid;
    this.idsValid = idsValid;
  }
  idsValid: string[];
  idsInvalid: IdInvalid[];
}

export class RespValidateManyNames {
  constructor(namesValid: string[], namesInvalid: NameInvalid[]) {
    this.namesValid = namesValid;
    this.namesInvalid = namesInvalid;
  }
  namesValid: string[];
  namesInvalid: NameInvalid[];
}

export class RespValidateManyPckgsManager {
  constructor(
    validNamesPckgManager: string[],
    InvalidNamesPckgManager: PckgManagerInvalid[]
  ) {
    this.validNamesPckgManager = validNamesPckgManager;
    this.InvalidNamesPckgManager = InvalidNamesPckgManager;
  }
  validNamesPckgManager: string[];
  InvalidNamesPckgManager: PckgManagerInvalid[];
}

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

class Invalid {
  constructor(message: string) {
    this.message = message;
  }
  message: string;
}

// -----------------------------------------------------------------------------

export class IdInvalid extends Invalid {
  constructor(id: string, message: string) {
    super(message);
    this.id = id;
  }
  id: string;
}

// -----------------------------------------------------------------------------

export class NameInvalid extends Invalid {
  constructor(name: string, message: string) {
    super(message);
    this.name = name;
  }
  name: string;
}

// -----------------------------------------------------------------------------

export class PckgManagerInvalid extends Invalid {
  constructor(pckgManager: string, message: string) {
    super(message);
    this.pckgManager = pckgManager;
  }
  pckgManager: string;
}

// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------

export const Validate = {
  Id: {
    One: (id: string): RespValidateOneId => {
      const hexCharacters: string = '0123456789abcdef';
      let invalidCharacters: string[] = [];
      let res: RespValidateOneId;
      for (const characterId of id) {
        if (hexCharacters.indexOf(characterId) === -1) {
          invalidCharacters.push(characterId);
        }
      }
      if (
        (typeof id === 'string' && id.length === 12) ||
        (invalidCharacters.length === 0 && id.length === 24)
      ) {
        res = new RespValidateOneId(true, 'Id Valid');
        return res;
      } else {
        res = new RespValidateOneId(
          false,
          'The ID must be a String of 12 bytes or a string of 24 hex characters'
        );
        return res;
      }
    },

    Many: (ids: string[]): RespValidateManyIds => {
      let idsValid: string[] = [];
      let idsInvalid: IdInvalid[] = [];
      for (const id of ids) {
        let resValidateId: RespValidateOneId = Validate.Id.One(id);
        if (resValidateId.valid) {
          idsValid.push(id);
        } else {
          let idInvalid: IdInvalid = new IdInvalid(id, resValidateId.message);
          idsInvalid.push(idInvalid);
        }
      }
      const res: RespValidateManyIds = new RespValidateManyIds(
        idsValid,
        idsInvalid
      );
      return res;
    }
  },

  Name: {
    One: (name: string, isPckgManager: boolean): RespValidateOneName => {
      let errors: string[] = [];
      const invalidCharacters: string = '|°¬!"#$%&()=?\'\\¡¿´¨*+]}[{^;,:<>';
      for (const invalidCharacter of invalidCharacters) {
        if (name.indexOf(invalidCharacter) > -1) {
          errors.push(invalidCharacter);
        }
      }
      let res: RespValidateOneName;
      if (errors.length === 0) {
        if (isPckgManager) {
          res = new RespValidateOneName(true, 'Name of Package Manager valid');
        } else {
          res = new RespValidateOneName(true, 'Name valid');
        }
        return res;
      } else {
        let message: string;
        if (isPckgManager) {
          message = `The Package Maneger's name cannot contain these characters: ${errors}`;
        } else {
          message = `The Package's name cannot contain these characters: ${errors}`;
        }
        res = new RespValidateOneName(false, message);
        return res;
      }
    },

    Many: (names: string[]): RespValidateManyNames => {
      let namesValid: string[] = [];
      let namesInvalid: NameInvalid[] = [];
      for (const name of names) {
        let resValidateName: RespValidateOneName = Validate.Name.One(
          name,
          false
        );
        if (resValidateName.valid) {
          namesValid.push(name);
        } else {
          let nameInvalid: NameInvalid = new NameInvalid(
            name,
            resValidateName.message
          );
          namesInvalid.push(nameInvalid);
        }
      }
      const res: RespValidateManyNames = new RespValidateManyNames(
        namesValid,
        namesInvalid
      );
      return res;
    }
  },

  PckgManager: {
    One: async (
      namePckgManager: string
    ): Promise<RespValidateOnePckgManager> => {
      let validNamesPckgsManager: string[] = [];
      const pckgsManager: IPackageManager[] = await PackageManager.find().sort({
        name: 'asc'
      });
      for (const pckgManager of pckgsManager) {
        validNamesPckgsManager.push(pckgManager.name);
      }
      let res: RespValidateOnePckgManager;
      if (validNamesPckgsManager.indexOf(namePckgManager) === -1) {
        res = new RespValidateOnePckgManager(
          false,
          `The ${namePckgManager} package manager does not exist in the database`
        );
        return res;
      } else {
        res = new RespValidateOnePckgManager(
          true,
          'Name Package Manager Valid'
        );
        return res;
      }
    },
    Many: async (
      namesPckgManager: string[]
    ): Promise<RespValidateManyPckgsManager> => {
      let validNamesPckgManager: string[] = [];
      let InvalidNamesPckgManager: PckgManagerInvalid[] = [];
      for (const namePckgManager of namesPckgManager) {
        let resValidatePckgManager: RespValidateOnePckgManager = await Validate.PckgManager.One(
          namePckgManager
        );
        if (resValidatePckgManager.valid) {
          validNamesPckgManager.push(namePckgManager);
        } else {
          let pckgManagerInvalid: PckgManagerInvalid = new PckgManagerInvalid(
            namePckgManager,
            resValidatePckgManager.message
          );
          InvalidNamesPckgManager.push(pckgManagerInvalid);
        }
      }
      const res: RespValidateManyPckgsManager = new RespValidateManyPckgsManager(
        validNamesPckgManager,
        InvalidNamesPckgManager
      );
      return res;
    }
  }
};
