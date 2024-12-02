import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Karyawan } from './karyawan.schema';
import { Team } from './team.schema';

export type KaryawanTeamDocument = KaryawanTeam & Document;

@Schema({ timestamps: true, collection: 'karyawan_team' })
export class KaryawanTeam {
  @Prop({ index: true, unique: true, type: Number, auto: true })
  id: number;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'karyawan' })
  id_karyawan: Karyawan;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'team' })
  id_team: Team;

  @Prop({
    required: true,
    type: String,
    enum: ['ketua', 'member'],
  })
  role: string;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;
}

export const KaryawanTeamSchema = SchemaFactory.createForClass(KaryawanTeam);
