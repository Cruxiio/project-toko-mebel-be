import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CustomerDocument = Customer & Document;

@Schema({ timestamps: true, collection: 'customer' })
export class Customer {
  @Prop({ index: true, unique: true, type: Number, auto: true })
  id: number;

  @Prop({ required: true, type: String })
  nama: string;

  @Prop({ required: true, type: String, minlength: 10 })
  no_rekening: string;

  @Prop({ required: true, type: String })
  nama_bank: string;

  @Prop({
    required: true,
    type: String,
    unique: true,
  })
  no_telp: string;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

// Membuat composite unique index untuk no_rekening dan nama_bank
CustomerSchema.index({ no_rekening: 1, nama_bank: 1 }, { unique: true });
