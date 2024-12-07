import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'customer',
})
export class Customer {
  @Prop({ index: true, unique: true, type: Number, auto: true })
  id: number;

  @Prop({ required: true, type: String })
  nama: string;

  @Prop({
    required: true,
    type: String,
    unique: true,
  })
  no_telepon: string;

  @Prop({ required: true, type: String })
  alamat: string;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;

  created_at?: Date;
  updated_at?: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

// Tambahkan partial index
// CustomerSchema.index(
//   { no_telepon: 1 },
//   {
//     unique: true,
//     // ini buat kasi tau kalau constraint unique hanya berlaku ketika data unya nilai dan nilai != null
//     partialFilterExpression: { no_telepon: { $exists: true, $ne: null } },
//   },
// );
