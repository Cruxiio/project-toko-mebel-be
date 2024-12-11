import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { HistoryBahanMasuk } from './history_bahan_masuk.schema';
import { NotaDetail, NotaDetailSchema } from './nota_detail.schema';

export type NotaDocument = Nota & Document;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'nota',
})
export class Nota {
  @Prop({ index: true, unique: true, type: Number, auto: true })
  id: number;

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: HistoryBahanMasuk.name,
  })
  id_history_bahan_masuk: HistoryBahanMasuk;

  @Prop({ type: Number, default: 0 })
  total_pajak: number;

  @Prop({ type: Number, default: 0 })
  diskon_akhir: number;

  @Prop({ required: true, type: Number })
  total_harga: number;

  @Prop({ type: [NotaDetailSchema], required: true })
  detail: NotaDetail[];

  @Prop({ type: Date, default: null })
  deleted_at?: Date;

  created_at?: Date;
  updated_at?: Date;
}

export const NotaSchema = SchemaFactory.createForClass(Nota);
