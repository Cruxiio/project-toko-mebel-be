import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Customer } from './customer.schema';

export type ProyekDocument = Proyek & Document;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'proyek',
})
export class Proyek {
  @Prop({ index: true, unique: true, type: Number, auto: true })
  id: number;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Customer.name })
  id_customer: Customer;

  @Prop({ required: true, type: String })
  nama: string;

  @Prop({ required: true, type: Date })
  start: Date;

  @Prop({ required: true, type: Date })
  deadline: Date;

  @Prop({ required: true, type: String })
  alamat_pengiriman: string;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;

  created_at?: Date;
  updated_at?: Date;
}

export const ProyekSchema = SchemaFactory.createForClass(Proyek);
