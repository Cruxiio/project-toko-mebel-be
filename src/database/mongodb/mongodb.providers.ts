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
import { Bahan, BahanSchema } from './schemas/bahan.schema';
import {
  HistoryBahanMasukDetail,
  HistoryBahanMasukDetailSchema,
} from './schemas/history_bahan_masuk_detail.schema';
import { Nota, NotaSchema } from './schemas/nota.schema';
import { Proyek, ProyekSchema } from './schemas/proyek.schema';
import { Karyawan, KaryawanSchema } from './schemas/karyawan.schema';
import { Produk, ProdukSchema } from './schemas/produk.schema';
import { Team, TeamSchema } from './schemas/team.schema';
import {
  ProyekProduk,
  ProyekProdukSchema,
} from './schemas/proyek_produk.schema';
import {
  HistoryBahanKeluar,
  HistoryBahanKeluarSchema,
} from './schemas/history_bahan_keluar.schema';
import {
  HistoryBahanKeluarDetail,
  HistoryBahanKeluarDetailSchema,
} from './schemas/history_bahan_keluar_detail.schema';
import { BahanSisa, BahanSisaSchema } from './schemas/bahan_sisa.schema';
import { ProdukJasa, ProdukJasaSchema } from './schemas/produk_jasa.schema';

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
        id: 'satuan_id_counter', //ini nama unik untuk counter id satuan yang disimpan di collection counters
      });
      return schema;
    },
    inject: [getConnectionToken()],
  },
  {
    name: Bahan.name,
    useFactory: async (connection: Connection) => {
      const schema = BahanSchema;

      const AutoIncrement = require('mongoose-sequence')(connection);

      schema.plugin(AutoIncrement, {
        inc_field: 'id',
        id: 'bahan_id_counter', //ini nama unik untuk counter id bahan yang disimpan di collection counters
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
        id: 'history_bahan_masuk_id_counter', //ini nama unik untuk counter id history_bahan_masuk yang disimpan di collection counters
      });
      return schema;
    },
    inject: [getConnectionToken()],
  },
  {
    name: HistoryBahanMasukDetail.name,
    useFactory: async (connection: Connection) => {
      const schema = HistoryBahanMasukDetailSchema;

      const AutoIncrement = require('mongoose-sequence')(connection);

      schema.plugin(AutoIncrement, {
        inc_field: 'id',
        id: 'history_bahan_masuk_detail_id_counter', //ini nama unik untuk counter id history_bahan_masuk yang disimpan di collection counters
      });
      return schema;
    },
    inject: [getConnectionToken()],
  },
  {
    name: Nota.name,
    useFactory: async (connection: Connection) => {
      const schema = NotaSchema;

      const AutoIncrement = require('mongoose-sequence')(connection);

      schema.plugin(AutoIncrement, {
        inc_field: 'id',
        id: 'nota_id_counter', //ini nama unik untuk counter id nota yang disimpan di collection counters
      });
      return schema;
    },
    inject: [getConnectionToken()],
  },
  {
    name: Proyek.name,
    useFactory: async (connection: Connection) => {
      const schema = ProyekSchema;

      const AutoIncrement = require('mongoose-sequence')(connection);

      schema.plugin(AutoIncrement, {
        inc_field: 'id',
        id: 'proyek_id_counter', //ini nama unik untuk counter id proyek yang disimpan di collection counters
      });
      return schema;
    },
    inject: [getConnectionToken()],
  },
  {
    name: Karyawan.name,
    useFactory: async (connection: Connection) => {
      const schema = KaryawanSchema;

      const AutoIncrement = require('mongoose-sequence')(connection);

      schema.plugin(AutoIncrement, {
        inc_field: 'id',
        id: 'karyawan_id_counter', //ini nama unik untuk counter id karyawan yang disimpan di collection counters
      });
      return schema;
    },
    inject: [getConnectionToken()],
  },
  {
    name: Produk.name,
    useFactory: async (connection: Connection) => {
      const schema = ProdukSchema;

      const AutoIncrement = require('mongoose-sequence')(connection);

      schema.plugin(AutoIncrement, {
        inc_field: 'id',
        id: 'produk_id_counter', //ini nama unik untuk counter id produk yang disimpan di collection counters
      });
      return schema;
    },
    inject: [getConnectionToken()],
  },
  {
    name: Team.name,
    useFactory: async (connection: Connection) => {
      const schema = TeamSchema;

      const AutoIncrement = require('mongoose-sequence')(connection);

      schema.plugin(AutoIncrement, {
        inc_field: 'id',
        id: 'team_id_counter', //ini nama unik untuk counter id team yang disimpan di collection counters
      });
      return schema;
    },
    inject: [getConnectionToken()],
  },
  {
    name: ProyekProduk.name,
    useFactory: async (connection: Connection) => {
      const schema = ProyekProdukSchema;

      const AutoIncrement = require('mongoose-sequence')(connection);

      schema.plugin(AutoIncrement, {
        inc_field: 'id',
        id: 'proyek_produk_id_counter', //ini nama unik untuk counter id proyek_produk yang disimpan di collection counters
      });
      return schema;
    },
    inject: [getConnectionToken()],
  },
  {
    name: HistoryBahanKeluar.name,
    useFactory: async (connection: Connection) => {
      const schema = HistoryBahanKeluarSchema;

      const AutoIncrement = require('mongoose-sequence')(connection);

      schema.plugin(AutoIncrement, {
        inc_field: 'id',
        id: 'history_bahan_keluar_id_counter', //ini nama unik untuk counter id history_bahan_keluar yang disimpan di collection counters
      });
      return schema;
    },
    inject: [getConnectionToken()],
  },
  {
    name: HistoryBahanKeluarDetail.name,
    useFactory: async (connection: Connection) => {
      const schema = HistoryBahanKeluarDetailSchema;

      const AutoIncrement = require('mongoose-sequence')(connection);

      schema.plugin(AutoIncrement, {
        inc_field: 'id',
        id: 'history_bahan_keluar_detail_id_counter', //ini nama unik untuk counter id history_bahan_keluar_detail yang disimpan di collection counters
      });
      return schema;
    },
    inject: [getConnectionToken()],
  },
  {
    name: BahanSisa.name,
    useFactory: async (connection: Connection) => {
      const schema = BahanSisaSchema;

      const AutoIncrement = require('mongoose-sequence')(connection);

      schema.plugin(AutoIncrement, {
        inc_field: 'id',
        id: 'bahan_sisa_id_counter', //ini nama unik untuk counter id history_bahan_keluar_detail yang disimpan di collection counters
      });
      return schema;
    },
    inject: [getConnectionToken()],
  },
  {
    name: ProdukJasa.name,
    useFactory: async (connection: Connection) => {
      const schema = ProdukJasaSchema;

      const AutoIncrement = require('mongoose-sequence')(connection);

      schema.plugin(AutoIncrement, {
        inc_field: 'id',
        id: 'produk_jasa_id_counter', //ini nama unik untuk counter id produk_jasa yang disimpan di collection counters
      });
      return schema;
    },
    inject: [getConnectionToken()],
  },
]);
