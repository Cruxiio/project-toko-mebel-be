import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Connection } from 'mongoose';

// kasih tau mongoose schema mana yang mau diimport
export const MongoDBProvider = MongooseModule.forFeatureAsync([
  {
    name: User.name,
    useFactory: async (connection: Connection) => {
      const schema = UserSchema;

      const AutoIncrement = require('mongoose-sequence')(connection);

      schema.plugin(AutoIncrement, {
        inc_field: 'id',
        id: 'user_id_counter', //ini nama unik untuk counter id customer yang disimpan di collection counters
      });
      return schema;
    },
    inject: [getConnectionToken()],
  },
]);
