import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// import { initialize } from 'mongoose-sequence';
// const AutoIncrement = require('mongoose-sequence')(mongoose);
// const AutoIncrement = initialize(mongoose);

export type SupplierDocument = Supplier & Document;

@Schema({ timestamps: true })
export class Supplier {
  @Prop({ index: true, unique: true, type: Number, auto: true })
  id: number;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String })
  no_rekening: string;

  @Prop({ required: true, type: String })
  nama_bank: string;

  @Prop({
    required: true,
    type: String,
  })
  alamat: string;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);

SupplierSchema.index({ no_rekening: 1, nama_bank: 1 }, { unique: true });

// Membuat composite unique index untuk no_rekening dan nama_bank
