import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Connection } from 'mongoose';
import { Supplier, SupplierSchema } from './schemas/supplier.schema';
import { Customer, CustomerSchema } from './schemas/customer.schema';
import {
  HistoryBahanMasuk,
  HistoryBahanMasukSchema,
} from './schemas/history_bahan_masuk.schema';
import { Satuan, SatuanSchema } from './schemas/satuan.schema';

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
  {
    name: Supplier.name,
    useFactory: async (connection: Connection) => {
      const schema = SupplierSchema;

      const AutoIncrement = require('mongoose-sequence')(connection);

      schema.plugin(AutoIncrement, {
        inc_field: 'id',
        id: 'supplier_id_counter', //ini nama unik untuk counter id supplier yang disimpan di collection counters
      });
      return schema;
    },
    inject: [getConnectionToken()],
  },
  {
    name: Customer.name,
    useFactory: async (connection: Connection) => {
      const schema = CustomerSchema;

      const AutoIncrement = require('mongoose-sequence')(connection);

      schema.plugin(AutoIncrement, {
        inc_field: 'id',
        id: 'customer_id_counter', //ini nama unik untuk counter id customer yang disimpan di collection counters
      });
      return schema;
    },
    inject: [getConnectionToken()],
  },
  {
    name: Satuan.name,
    useFactory: async (connection: Connection) => {
      const schema = SatuanSchema;

      const AutoIncrement = require('mongoose-sequence')(connection);

      schema.plugin(AutoIncrement, {
        inc_field: 'id',
        id: 'satuan_id_counter', //ini nama unik untuk counter id customer yang disimpan di collection counters
      });
      return schema;
    },
    inject: [getConnectionToken()],
  },
  {
    name: HistoryBahanMasuk.name,
    useFactory: async (connection: Connection) => {
      const schema = HistoryBahanMasukSchema;

      const AutoIncrement = require('mongoose-sequence')(connection);

      schema.plugin(AutoIncrement, {
        inc_field: 'id',
        id: 'history_bahan_masuk_id_counter', //ini nama unik untuk counter id customer yang disimpan di collection counters
      });
      return schema;
    },
    inject: [getConnectionToken()],
  },
]);
