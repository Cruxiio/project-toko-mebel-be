import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BahanDocument = Bahan & Document;

@Schema({ timestamps: true, collection: 'bahan' })
export class Bahan {
  @Prop({ index: true, unique: true, type: Number, auto: true })
  id: number;

  @Prop({ required: true, type: String })
  nama: string;

  @Prop({ required: true, type: Number, min: 0 })
  qty_total: number;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;
}

export const BahanSchema = SchemaFactory.createForClass(Bahan);
