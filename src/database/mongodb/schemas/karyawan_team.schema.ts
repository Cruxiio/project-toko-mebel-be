import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Karyawan } from './karyawan.schema';
import { Team } from './team.schema';

export type KaryawanTeamDocument = KaryawanTeam & Document;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  collection: 'karyawan_team',
})
export class KaryawanTeam {
  @Prop({ index: true, unique: true, type: Number, auto: true })
  id: number;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'karyawan' })
  id_karyawan: Karyawan;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'team' })
  id_team: Team;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;

  created_at?: Date;
  updated_at?: Date;
}

export const KaryawanTeamSchema = SchemaFactory.createForClass(KaryawanTeam);
