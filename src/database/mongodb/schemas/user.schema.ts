import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// import { initialize } from 'mongoose-sequence';
// const AutoIncrement = require('mongoose-sequence')(mongoose);
// const AutoIncrement = initialize(mongoose);

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ index: true, unique: true, type: Number, auto: true })
  id: number;

  @Prop({ required: true, type: String })
  name: string;

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
}

export const UserSchema = SchemaFactory.createForClass(User);

// Tambahkan plugin auto-increment
// UserSchema.plugin(AutoIncrement, {
//   inc_field: 'id',
//   id: 'customer_id_counter', //ini nama unik untuk counter id customer yang disimpan di collection counters
// });
