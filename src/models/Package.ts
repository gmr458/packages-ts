import { Document, model, Schema } from 'mongoose';

export interface IPackage extends Document {
  name: string;
  packageManager: string;
  message?: string | string[];
}

const PackageSchema = new Schema({
  name: { type: String, required: true, unique: true },
  packageManager: { type: String, required: true }
});

export default model<IPackage>('Package', PackageSchema, 'packages');
