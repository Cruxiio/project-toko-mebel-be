import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SupplierDocument = Supplier & Document;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'supplier',
})
export class Supplier {
  @Prop({ index: true, unique: true, type: Number, auto: true })
  id: number;

  @Prop({ required: true, type: String })
  nama: string;

  @Prop({ required: true, type: String, minlength: 10 })
  no_rekening: string;

  @Prop({ required: true, type: String })
  nama_bank: string;

  @Prop({
    type: String,
    default: null,
  })
  no_telepon: string;

  @Prop({
    type: String,
    default: null,
  })
  alamat: string;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;

  created_at?: Date;
  updated_at?: Date;
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);

// Membuat composite unique index untuk no_rekening dan nama_bank
SupplierSchema.index({ no_rekening: 1, nama_bank: 1 }, { unique: true });
