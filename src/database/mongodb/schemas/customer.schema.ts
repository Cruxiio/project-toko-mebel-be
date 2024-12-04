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

  @Prop({ type: String, minlength: 10, default: null })
  no_rekening: string;

  @Prop({ type: String, default: null })
  nama_bank: string;

  @Prop({
    type: String,
    unique: true,
    default: null,
  })
  no_telepon: string;

  @Prop({ type: String, default: null })
  alamat: string;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;

  created_at?: Date;
  updated_at?: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

// Membuat composite unique index untuk no_rekening dan nama_bank
CustomerSchema.index({ no_rekening: 1, nama_bank: 1 }, { unique: true });
