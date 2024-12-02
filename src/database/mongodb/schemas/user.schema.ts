import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: 'user' })
export class User {
  @Prop({ index: true, unique: true, type: Number, auto: true })
  id: number;

  @Prop({ required: true, type: String })
  nama: string;

  @Prop({ required: true, type: String, unique: true })
  username: string;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({
    required: true,
    type: String,
    enum: [
      'superadmin',
      'adminkantor',
      'karyawankantor',
      'adminworkshop',
      'karyawanworkshop',
    ],
  })
  role: string;

  @Prop({ required: true, type: String, unique: true })
  email: string;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
