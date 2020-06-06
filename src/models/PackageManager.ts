import { Document, model, Schema } from 'mongoose';

export interface IPackageManager extends Document {
  name: string;
  message?: string | string[];
}

const PackageManagerSchema = new Schema({
  name: { type: String, required: true, unique: true }
});

export default model<IPackageManager>(
  'PackageManager',
  PackageManagerSchema,
  'packagesManager'
);
