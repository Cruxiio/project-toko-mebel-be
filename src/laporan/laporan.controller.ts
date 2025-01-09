import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { LaporanService } from './laporan.service';
import { CreateLaporanHPPDto } from './dto/create-laporan.dto';
import { LaporanStokBahanKeluarDto } from 'src/history-bahan-keluar/dto/create-history-bahan-keluar.dto';
import { FindAllNotaDto } from 'src/nota/dto/create-nota.dto';
import { FindAllStokDto } from 'src/history-masuk/dto/create-history-masuk.dto';
import { Response } from 'express';
import * as fs from 'fs';

@Controller('api/laporan')
export class LaporanController {
  constructor(private readonly laporanService: LaporanService) {}

  setupResponse(res: Response, dataFile: GenerateReportResponse) {
    // ambil output_path dan file_name dari dataFile
    const { output_path, file_name } = dataFile;

    // setup header untuk respons
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${file_name}"`,
    });

    // cek apakah file ada di path yang disimpan di output_path
    if (!fs.existsSync(output_path)) {
      return res.status(404).json({ message: 'File not found' });
    }

    // kirim file PDF sebagai respons
    const fileStream = fs.createReadStream(output_path);
    fileStream.pipe(res);
  }

  @Post('hpp')
  async laporanHpp(
    @Body() createLaporanDto: CreateLaporanHPPDto,
    @Res() res: Response,
  ) {
    try {
      const dataFile =
        await this.laporanService.saveHppToFile(createLaporanDto);

      // kirim file PDF sebagai respons
      this.setupResponse(res, dataFile);
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }

  @Post('bahan-keluar')
  async laporanBahanKeluar(
    @Body() createLaporanBahanKeluarDto: LaporanStokBahanKeluarDto,
    @Res() res: Response,
  ) {
    try {
      const dataFile = await this.laporanService.saveLaporanBahanKeluar(
        createLaporanBahanKeluarDto,
      );

      // kirim file PDF sebagai respons
      this.setupResponse(res, dataFile);
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }

  @Post('bahan-masuk')
  async laporanBahanMasuk(
    @Body() createLaporanBahanMasukDto: FindAllStokDto,
    @Res() res: Response,
  ) {
    try {
      const dataFile = await this.laporanService.saveLaporanBahanMasuk(
        createLaporanBahanMasukDto,
      );

      // kirim file PDF sebagai respons
      this.setupResponse(res, dataFile);
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }

  @Post('nota')
  async laporanNota(
    @Body() createLaporanNotaDto: FindAllNotaDto,
    @Res() res: Response,
  ) {
    try {
      const dataFile =
        await this.laporanService.saveLaporanNota(createLaporanNotaDto);

      // kirim file PDF sebagai respons
      this.setupResponse(res, dataFile);
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }
}
