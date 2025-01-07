import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLaporanHPPDto } from './dto/create-laporan.dto';
import { LaporanRepository } from 'src/database/mongodb/repositories/laporan.repository';
import { ProyekProdukRepository } from 'src/database/mongodb/repositories/proyek_produk.repository';
import { ProyekRepository } from 'src/database/mongodb/repositories/proyek.repository';
import { HelperService } from 'src/helper/helper.service';
import * as path from 'path';
import * as fs from 'fs';
import puppeteer from 'puppeteer';
import { LaporanStokBahanKeluarResponse } from 'src/history-bahan-keluar/dto/response.interface';
import { HistoryBahanKeluarService } from 'src/history-bahan-keluar/history-bahan-keluar.service';
import { LaporanStokBahanKeluarDto } from 'src/history-bahan-keluar/dto/create-history-bahan-keluar.dto';
import { FindAllNotaDto } from 'src/nota/dto/create-nota.dto';
import { LaporanNotaResponse } from 'src/nota/dto/response.interface';
import { NotaService } from 'src/nota/nota.service';

@Injectable()
export class LaporanService {
  constructor(
    private readonly laporanRepository: LaporanRepository,
    private readonly proyekProdukRepo: ProyekProdukRepository,
    private readonly proyekRepo: ProyekRepository,
    private readonly helperService: HelperService,
    private readonly historyBahanKeluarService: HistoryBahanKeluarService,
    private readonly notaService: NotaService,
  ) {}
  async laporanHPPKayu(createLaporanDto: CreateLaporanHPPDto) {
    // cari data proyek produk by id proyek produk
    const proyekProdukData = await this.proyekProdukRepo.findOne(
      { id: createLaporanDto.id_proyek_produk, deleted_at: null },
      {
        main: {},
        field1: 'id',
        field2: 'id nama',
        field3: '',
        nestedField3: '',
      },
    );

    if (!proyekProdukData) {
      throw new NotFoundException('ID Proyek Produk tidak ditemukan');
    }

    // cari data proyek by id proyek produk
    const proyekData = await this.proyekRepo.findOne(
      { id: proyekProdukData.id_proyek.id, deleted_at: null },
      {
        main: {},
        field1: 'id nama',
      },
    );

    let detailLaporanHpp = [];
    let totalBahan = 0;
    if (proyekProdukData.tipe != 'kayu') {
      // cari detail laporan HPP Resin dan Finishing + validate
      detailLaporanHpp =
        await this.laporanRepository.laporanHPP(proyekProdukData);

      totalBahan = detailLaporanHpp.reduce(
        (acc, curr) => acc + curr.total_harga,
        0,
      );
    } else {
      // cari detail laporan HPP Kayu + validate
      detailLaporanHpp =
        await this.laporanRepository.laporanHPPKayu(proyekProdukData);

      totalBahan = detailLaporanHpp.reduce(
        (acc, curr) => acc + curr.total_harga_realisasi,
        0,
      );
    }

    // buat response
    const res: HPPKayuReportData | HPPAllReportData = {
      jenis_proyek: createLaporanDto.jenis_proyek,
      sj_no: createLaporanDto.sj_no,
      acc: createLaporanDto.acc,
      marketing: createLaporanDto.marketing,
      nama_customer: proyekData.id_customer.nama,
      tipe_proyek: proyekProdukData.tipe,
      alamat_pengiriman: proyekData.alamat_pengiriman,
      produk: proyekProdukData.id_produk.nama,
      start_date: this.helperService.formatDatetoString(proyekData.start),
      deadline_date: this.helperService.formatDatetoString(proyekData.deadline),
      nama_penanggung_jawab: createLaporanDto.nama_penanggung_jawab,
      total_bahan: totalBahan,
      harian: createLaporanDto.total_harian,
      borongan: createLaporanDto.total_borongan,
      grand_total:
        createLaporanDto.total_harian +
        createLaporanDto.total_borongan +
        totalBahan,
      detail: detailLaporanHpp,
    };

    return res;
  }

  async getBase64FromUrl(filePath: string): Promise<string> {
    const fullPath = path.resolve(__dirname, filePath);
    const imageBuffer = fs.readFileSync(fullPath);
    return `data:image/png;base64,${imageBuffer.toString('base64')}`;
  }

  /*
  TODO: refactor function ini karena isinya hampir sama dengan generatePDF
  */
  async generateReportHppBrowserSetup(dataReport: GenerateReportHppDto) {
    let {
      logo_path: logoPath,
      template_path: templatePath,
      kepala_workshop,
      pimpinan,
    } = dataReport;

    const logoBase64 = await this.getBase64FromUrl(logoPath);
    let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
    htmlTemplate = htmlTemplate.replace(
      '</body>',
      `
      <div style="
        width: 100%;
        padding: 40px;
        margin-top: 60px;
        page-break-inside: avoid;
        position: relative;
      ">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="width: 33%; text-align: center; vertical-align: top;">
              <p style="margin-bottom: 80px;">Mengetahui,</p>
              <p></p>
            </td>
            <td style="width: 33%; text-align: center; vertical-align: top;">
              <p style="margin-bottom: 80px;">ACC</p>
              <p>${pimpinan}</p>
            </td>
            <td style="width: 33%; text-align: center; vertical-align: top;">
              <p style="margin-bottom: 80px;">Surabaya,</p>
              <p>${kepala_workshop}</p>
            </td>
          </tr>
        </table>
      </div>
      </body>`,
    );
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
    });
    const page = await browser.newPage();
    await page.setContent(htmlTemplate);
    await page.addStyleTag({
      content: `
        @page {
          margin-bottom: 0;
          size: A4 landscape;
        }
        body {
          min-height: 100vh;
          margin: 0;
          padding: 0;
          position: relative;
        }
        /* Ensure main content has space for signature */
        .main-content {
          margin-bottom: 200px;
        }
      `,
    });

    // Replace logo
    htmlTemplate = (await page.content()).replace(
      './company_logo.png',
      logoBase64,
    );

    await page.setContent(htmlTemplate, {
      waitUntil: ['load', 'networkidle0', 'domcontentloaded'],
    });

    return {
      browser: browser,
      page: page,
    };
  }

  async generatePDF(htmlContent: string, outputPath: string) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    await page.setContent(htmlContent, {
      waitUntil: ['load', 'networkidle0', 'domcontentloaded'],
    });

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      landscape: true,
    });

    console.log(`Report saved at ${outputPath}`);
    await browser.close();
  }

  async getBasePath() {
    // base path (current directory)
    let currPath = path.join('src', 'laporan');
    let basePath = path.resolve(process.cwd(), currPath);
    let logoPath = path.join(basePath, 'logo', 'company_logo.png');

    return {
      currPath: currPath,
      basePath: basePath,
      logoPath: logoPath,
    };
  }

  async generateReportHppKayu(dataReport: GenerateReportHppDto): Promise<void> {
    // setup browser and page
    const { browser, page } =
      await this.generateReportHppBrowserSetup(dataReport);

    // ambil data dan output path dari dataReport
    const { data, output_path: outputPath } = dataReport;

    // Fill in the data using page.evaluate
    await page.evaluate((data: any) => {
      // Customer info
      const customerSpan = document.evaluate(
        "//span[contains(text(), 'CUSTOMER')]/following-sibling::span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (customerSpan) customerSpan.textContent = `: ${data.nama_customer}`;

      // Address
      const alamatSpan = document.evaluate(
        "//span[contains(text(), 'ALAMAT')]/following-sibling::span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (alamatSpan) alamatSpan.textContent = `: ${data.alamat_pengiriman}`;

      // Item/Product
      const itemSpan = document.evaluate(
        "//span[contains(text(), 'ITEM')]/following-sibling::span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (itemSpan) itemSpan.textContent = `: ${data.produk}`;

      // Start Date
      const startSpan = document.evaluate(
        "//span[contains(text(), 'START')]/following-sibling::span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (startSpan) startSpan.textContent = `: ${data.start_date}`;

      // Deadline
      const deadlineSpan = document.evaluate(
        "//span[contains(text(), 'DEADLINE')]/following-sibling::span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (deadlineSpan) deadlineSpan.textContent = `: ${data.deadline_date}`;

      // Penanggung Jawab
      const pjSpan = document.evaluate(
        "//span[contains(text(), 'PENANGGUNG JAWAB')]/following-sibling::span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (pjSpan) pjSpan.textContent = `: ${data.nama_penanggung_jawab}`;

      //marketing
      const mSpan = document.evaluate(
        "//span[contains(text(), 'MARKETING')]/following-sibling::span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (mSpan) mSpan.textContent = `: ${data.marketing}`;

      //acc
      const accSpan = document.evaluate(
        "//span[contains(text(), 'ACC')]/following-sibling::span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (accSpan) accSpan.textContent = `: ${data.acc}`;

      //sjNo
      const sjSpan = document.evaluate(
        "//span[contains(text(), 'SJ No')]/following-sibling::span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (sjSpan) sjSpan.textContent = `: ${data.sj_no}`;

      //jenis proyek
      const jenis_proyekSpan = document.evaluate(
        "//span[contains(text(), 'JENIS PROYEK')]/following-sibling::span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (jenis_proyekSpan)
        jenis_proyekSpan.textContent = `: ${data.jenis_proyek}`;

      // Format currency
      const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })
          .format(amount)
          .replace('IDR', 'Rp');

      const tableBody = document.querySelector('tbody');
      if (!tableBody) return;

      // Find the ONGKOS KERJA row to use as insertion point
      const ongkosKerjaRow = Array.from(tableBody.querySelectorAll('tr')).find(
        (row) => row.textContent?.includes('ONGKOS KERJA'),
      );

      if (ongkosKerjaRow) {
        // Create and insert section header
        const additionalHeader = document.createElement('tr');
        additionalHeader.className = 'section-header';
        additionalHeader.innerHTML = `
      <td colspan="10" class="px-4 py-2 font-bold border">
      </td>
    `;
        ongkosKerjaRow.parentNode?.insertBefore(
          additionalHeader,
          ongkosKerjaRow,
        );

        // Loop through data.detail and create rows
        data.detail.forEach((item, index) => {
          const newRow = document.createElement('tr');
          newRow.className = 'hover:bg-gray-50';
          newRow.innerHTML = `
        <td class="px-4 py-2 border">${index + 1}</td>
        <td class="px-4 py-2 border">${item.nama_bahan}</td>
        <td class="px-4 py-2 border">${item.qty}</td>
        <td class="px-4 py-2 border">${item.nama_satuan}</td>
        <td class="px-4 py-2 border">${formatCurrency(item.harga_satuan)}</td>
        <td class="px-4 py-2 border">${formatCurrency(item.total_harga)}</td>
        <td class="px-4 py-2 border">${item.keterangan == null ? '' : item.keterangan}</td>
        <td class="px-4 py-2 border">${item.qty_realisasi}</td>
        <td class="px-4 py-2 border">${formatCurrency(
          item.harga_satuan_realisasi,
        )}</td>
        <td class="px-4 py-2 border">${formatCurrency(
          item.total_harga_realisasi,
        )}</td>
      `;
          ongkosKerjaRow.parentNode?.insertBefore(newRow, ongkosKerjaRow);
        });
      }

      // Update totals
      const totalBahanCell = document.evaluate(
        "//td[contains(text(), 'TOTAL BAHAN')]/following-sibling::td",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (totalBahanCell)
        totalBahanCell.textContent = formatCurrency(data.total_bahan);

      const harianCell = document.evaluate(
        "//td[contains(text(), 'HARIAN')]/following-sibling::td",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (harianCell) harianCell.textContent = formatCurrency(data.harian);

      const boronganCell = document.evaluate(
        "//td[contains(text(), 'BORONGAN')]/following-sibling::td",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (boronganCell)
        boronganCell.textContent = formatCurrency(data.borongan);

      const grandTotalCell = document.evaluate(
        "//td[contains(text(), 'GRAND TOTAL')]/following-sibling::td",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (grandTotalCell)
        grandTotalCell.textContent = formatCurrency(data.grand_total);
    }, data);

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      landscape: true,
    });

    console.log(`Report saved at ${outputPath}`);
    await browser.close();
  }

  async generateReportHppFinishing(
    dataReport: GenerateReportHppDto,
  ): Promise<void> {
    // setup browser and page
    const { browser, page } =
      await this.generateReportHppBrowserSetup(dataReport);

    // ambil data dan output path dari dataReport
    const { data, output_path: outputPath } = dataReport;

    // Fill in the data using page.evaluate
    await page.evaluate((data) => {
      // Customer info
      const customerSpan = document.evaluate(
        "//span[contains(text(), 'CUSTOMER')]/following-sibling::span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (customerSpan) customerSpan.textContent = `: ${data.nama_customer}`;

      // Address
      const alamatSpan = document.evaluate(
        "//span[contains(text(), 'ALAMAT')]/following-sibling::span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (alamatSpan) alamatSpan.textContent = `: ${data.alamat_pengiriman}`;

      // Item/Product
      const itemSpan = document.evaluate(
        "//span[contains(text(), 'ITEM')]/following-sibling::span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (itemSpan) itemSpan.textContent = `: ${data.produk}`;

      // Start Date
      const startSpan = document.evaluate(
        "//span[contains(text(), 'START')]/following-sibling::span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (startSpan) startSpan.textContent = `: ${data.start_date}`;

      // Deadline
      const deadlineSpan = document.evaluate(
        "//span[contains(text(), 'DEADLINE')]/following-sibling::span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (deadlineSpan) deadlineSpan.textContent = `: ${data.deadline_date}`;

      // Penanggung Jawab
      const pjSpan = document.evaluate(
        "//span[contains(text(), 'PENANGGUNG JAWAB')]/following-sibling::span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (pjSpan) pjSpan.textContent = `: ${data.nama_penanggung_jawab}`;

      //marketing
      const mSpan = document.evaluate(
        "//span[contains(text(), 'MARKETING')]/following-sibling::span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (mSpan) mSpan.textContent = `: ${data.marketing}`;

      //acc
      const accSpan = document.evaluate(
        "//span[contains(text(), 'ACC')]/following-sibling::span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (accSpan) accSpan.textContent = `: ${data.acc}`;

      //sjNo
      const sjSpan = document.evaluate(
        "//span[contains(text(), 'SJ No')]/following-sibling::span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (sjSpan) sjSpan.textContent = `: ${data.sj_no}`;

      //jenis proyek
      const jenis_proyekSpan = document.evaluate(
        "//span[contains(text(), 'JENIS PROYEK')]/following-sibling::span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (jenis_proyekSpan)
        jenis_proyekSpan.textContent = `: ${data.jenis_proyek}`;

      // Format currency
      const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })
          .format(amount)
          .replace('IDR', 'Rp');

      // Find the table body
      const tableBody = document.querySelector('tbody');
      if (!tableBody) return;

      // Process each detail item
      // First, add all the detail items
      data.detail.forEach((item, index) => {
        // Find ONGKOS KERJA row
        const ongkosKerjaRow = Array.from(
          tableBody.querySelectorAll('tr'),
        ).find((row) => row.textContent?.includes('ONGKOS KERJA'));

        if (ongkosKerjaRow) {
          // Add a new section header only once
          if (index === 0) {
            const additionalHeader = document.createElement('tr');
            additionalHeader.className = 'section-header';
            additionalHeader.innerHTML = `
          <td colspan="10" class="px-4 py-2 font-bold border">
          </td>
        `;
            ongkosKerjaRow.parentNode?.insertBefore(
              additionalHeader,
              ongkosKerjaRow,
            );
          }

          // Add each item row
          const newRow = document.createElement('tr');
          newRow.className = 'hover:bg-gray-50';
          newRow.innerHTML = `
        <td class="px-4 py-2 border">${index + 1}</td>
        <td class="px-4 py-2 border">${item.nama_bahan}</td>
        <td class="px-4 py-2 border">${item.qty}</td>
        <td class="px-4 py-2 border">${item.nama_satuan}</td>
        <td class="px-4 py-2 border">${formatCurrency(item.harga_satuan)}</td>
        <td class="px-4 py-2 border">${formatCurrency(item.total_harga)}</td>
        <td class="px-4 py-2 border">${item.keterangan == null ? '' : item.keterangan}</td>
      `;
          ongkosKerjaRow.parentNode?.insertBefore(newRow, ongkosKerjaRow);

          // Add team rows after the last item
          if (index === data.detail.length - 1) {
            // Header row for Team section
            const teamHeaderRow = document.createElement('tr');
            teamHeaderRow.className = 'hover:bg-gray-50';
            teamHeaderRow.innerHTML = `
          <td colspan="6" class="px-4 py-2 border text-lg font-bold">Terdiri dari</td>
          <td class="px-4 py-2 border font-bold text-lg text-center">Team</td>
        `;
            ongkosKerjaRow.parentNode?.insertBefore(
              teamHeaderRow,
              ongkosKerjaRow,
            );

            for (let i = 0; i < 6; i++) {
              let teamRow = document.createElement('tr');
              teamRow.className = 'highlight-row';
              teamRow.innerHTML = `
            <td class="px-4 py-2 border">${i + 1}</td>
            <td colspan="4" class="px-4 py-2 border"></td>
            <td class="px-4 py-2 border text-left">Rp </td>
          `;

              if (i % 3 == 0) {
                teamRow.innerHTML += `<td class="px-4 py-2 border" rowspan="3"></td>`;
              }

              ongkosKerjaRow.parentNode?.insertBefore(teamRow, ongkosKerjaRow);
            }
          }
        }
      });
      // Update totals
      const totalBahanCell = document.evaluate(
        "//td[contains(text(), 'TOTAL BAHAN')]/following-sibling::td",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (totalBahanCell)
        totalBahanCell.textContent = formatCurrency(data.total_bahan);

      const harianCell = document.evaluate(
        "//td[contains(text(), 'HARIAN')]/following-sibling::td",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (harianCell) harianCell.textContent = formatCurrency(data.harian);

      const boronganCell = document.evaluate(
        "//td[contains(text(), 'BORONGAN')]/following-sibling::td",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (boronganCell)
        boronganCell.textContent = formatCurrency(data.borongan);

      const grandTotalCell = document.evaluate(
        "//td[contains(text(), 'GRAND TOTAL')]/following-sibling::td",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (grandTotalCell)
        grandTotalCell.textContent = formatCurrency(data.grand_total);
    }, data);

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      landscape: true,
    });

    console.log(`Report saved at ${outputPath}`);
    await browser.close();
  }

  async generateReportHppResin(
    dataReport: GenerateReportHppDto,
  ): Promise<void> {
    // setup browser and page
    const { browser, page } =
      await this.generateReportHppBrowserSetup(dataReport);

    // ambil data dan output path dari dataReport
    const { data, output_path: outputPath } = dataReport;

    // Fill in the data using page.evaluate
    await page.evaluate((data) => {
      // Customer info
      const customerSpan = document.evaluate(
        "//span[contains(text(), 'CUSTOMER')]/following-sibling::span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (customerSpan) customerSpan.textContent = `: ${data.nama_customer}`;

      // Address
      const alamatSpan = document.evaluate(
        "//span[contains(text(), 'ALAMAT')]/following-sibling::span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (alamatSpan) alamatSpan.textContent = `: ${data.alamat_pengiriman}`;

      // Item/Product
      const itemSpan = document.evaluate(
        "//span[contains(text(), 'ITEM')]/following-sibling::span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (itemSpan) itemSpan.textContent = `: ${data.produk}`;

      // Start Date
      const startSpan = document.evaluate(
        "//span[contains(text(), 'START')]/following-sibling::span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (startSpan) startSpan.textContent = `: ${data.start_date}`;

      // Deadline
      const deadlineSpan = document.evaluate(
        "//span[contains(text(), 'DEADLINE')]/following-sibling::span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (deadlineSpan) deadlineSpan.textContent = `: ${data.deadline_date}`;

      // Penanggung Jawab
      const pjSpan = document.evaluate(
        "//span[contains(text(), 'PENANGGUNG JAWAB')]/following-sibling::span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (pjSpan) pjSpan.textContent = `: ${data.nama_penanggung_jawab}`;

      //marketing
      const mSpan = document.evaluate(
        "//span[contains(text(), 'MARKETING')]/following-sibling::span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (mSpan) mSpan.textContent = `: ${data.marketing}`;

      //acc
      const accSpan = document.evaluate(
        "//span[contains(text(), 'ACC')]/following-sibling::span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (accSpan) accSpan.textContent = `: ${data.acc}`;

      //sjNo
      const sjSpan = document.evaluate(
        "//span[contains(text(), 'SJ No')]/following-sibling::span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (sjSpan) sjSpan.textContent = `: ${data.sj_no}`;

      //jenis proyek
      const jenis_proyekSpan = document.evaluate(
        "//span[contains(text(), 'JENIS PROYEK')]/following-sibling::span",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (jenis_proyekSpan)
        jenis_proyekSpan.textContent = `: ${data.jenis_proyek}`;

      // Format currency
      const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })
          .format(amount)
          .replace('IDR', 'Rp');

      // Find the table body
      const tableBody = document.querySelector('tbody');
      if (!tableBody) return;

      // Find ONGKOS KERJA row as insertion point
      const ongkosKerjaRow = Array.from(tableBody.querySelectorAll('tr')).find(
        (row) => row.textContent?.includes('ONGKOS KERJA'),
      );

      if (ongkosKerjaRow) {
        // Add section header for the items
        const additionalHeader = document.createElement('tr');
        additionalHeader.className = 'section-header';
        additionalHeader.innerHTML = `
      <td colspan="10" class="px-4 py-2 font-bold border">
      </td>
    `;
        ongkosKerjaRow.parentNode?.insertBefore(
          additionalHeader,
          ongkosKerjaRow,
        );

        // Directly add all items from data.detail
        data.detail.forEach((item, index) => {
          const newRow = document.createElement('tr');
          newRow.className = 'hover:bg-gray-50';
          newRow.innerHTML = `
        <td class="px-4 py-2 border">${index + 1}</td>
        <td class="px-4 py-2 border">${item.nama_bahan}</td>
        <td class="px-4 py-2 border">${item.qty}</td>
        <td class="px-4 py-2 border">${item.nama_satuan}</td>
        <td class="px-4 py-2 border">${formatCurrency(item.harga_satuan)}</td>
        <td class="px-4 py-2 border">${formatCurrency(item.total_harga)}</td>
        <td class="px-4 py-2 border">${item.keterangan == null ? '' : item.keterangan}</td>
      `;
          ongkosKerjaRow.parentNode?.insertBefore(newRow, ongkosKerjaRow);
        });
      }

      // Update totals
      const totalBahanCell = document.evaluate(
        "//td[contains(text(), 'TOTAL BAHAN')]/following-sibling::td",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (totalBahanCell)
        totalBahanCell.textContent = formatCurrency(data.total_bahan);

      const harianCell = document.evaluate(
        "//td[contains(text(), 'HARIAN')]/following-sibling::td",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (harianCell) harianCell.textContent = formatCurrency(data.harian);

      const boronganCell = document.evaluate(
        "//td[contains(text(), 'BORONGAN')]/following-sibling::td",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (boronganCell)
        boronganCell.textContent = formatCurrency(data.borongan);

      const grandTotalCell = document.evaluate(
        "//td[contains(text(), 'GRAND TOTAL')]/following-sibling::td",
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      ).singleNodeValue;
      if (grandTotalCell)
        grandTotalCell.textContent = formatCurrency(data.grand_total);
    }, data);

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
      landscape: true,
    });

    console.log(`Report saved at ${outputPath}`);
    await browser.close();
  }

  async generateReportBahanKeluar(
    dataReport: GenerateReportDto,
  ): Promise<void> {
    // ambil field-field dari dataReport
    const { logo_path, template_path, data, output_path } = dataReport;
    const logoBase64 = await this.getBase64FromUrl(logo_path);

    let htmlTemplate = fs.readFileSync(template_path, 'utf-8');

    const tableRows = data
      .map(
        (item, index) =>
          `<tr class="border-b hover:bg-gray-50">
            <td class="px-6 py-4">${index + 1}</td>
            <td class="px-6 py-4">${item.tgl_bahan_keluar}</td>
            <td class="px-6 py-4">${item.nama_bahan}</td>
            <td class="px-6 py-4 text-center">${item.qty}</td>
            <td class="px-6 py-4 text-center">${item.nama_satuan}</td>         
            <td class="px-6 py-4">${item.nama_customer}</td>
            <td class="px-6 py-4">${item.nama_karyawan}</td>
          </tr>`,
      )
      .join('');

    htmlTemplate = htmlTemplate
      .replace('./company_logo.png', logoBase64)
      .replace('<tbody>', `<tbody>${tableRows}`);

    await this.generatePDF(htmlTemplate, output_path);
  }

  async generateRekapByDate(dataReport: GenerateReportDto): Promise<void> {
    // ambil field-field dari dataReport
    const { logo_path, template_path, data, output_path } = dataReport;

    const logoBase64 = await this.getBase64FromUrl(logo_path);

    let htmlTemplate = fs.readFileSync(template_path, 'utf-8');

    let total_akhir = data.reduce((acc, item) => acc + item.total_harga, 0);

    const tableRows = data
      .map(
        (item, index) =>
          `<tr>
            <td>${index + 1}</td>
            <td>${item.nama_suplier}</td>
            <td class="nota-number">${item.no_rekening}</td>
            <td>${item.nama_bank}</td>
            <td>${item.nama_suplier}</td>
            <td class="text-right amount">Rp. ${item.total_pajak.toLocaleString('id-ID')}</td>
            <td class="text-right amount">Rp. ${item.diskon_akhir.toLocaleString('id-ID')}</td>
            <td class="text-right amount">Rp. ${item.total_harga.toLocaleString('id-ID')}</td>
          </tr>`,
      )
      .join('');

    // Replace placeholders
    htmlTemplate = htmlTemplate
      .replace('./company_logo.png', logoBase64)
      .replace(
        '{{TANGGAL_REKAP}}',
        new Date(data[0].created_at).toLocaleDateString('id-ID'),
      )
      .replace('<!-- TABLE_ROWS_PLACEHOLDER -->', tableRows)
      .replace(
        '{{TOTAL_AMOUNT}}',
        `Rp. ${total_akhir.toLocaleString('id-ID')}`,
      );

    await this.generatePDF(htmlTemplate, output_path);
  }

  async generateRekapBySupplier(dataReport: GenerateReportDto): Promise<void> {
    // ambil field-field dari dataReport
    const { logo_path, template_path, data, output_path } = dataReport;
    const logoBase64 = await this.getBase64FromUrl(logo_path);

    let htmlTemplate = fs.readFileSync(template_path, 'utf-8');

    let total_akhir = data.reduce((acc, item) => acc + item.total_harga, 0);

    const tableRows = data
      .map(
        (item, index) =>
          `<tr>
            <td>${index + 1}</td>
            <td class="nota-number">${item.kode_nota}</td>
            <td class="date">${new Date(item.tgl_nota).toLocaleDateString('id-ID')}</td>
            <td class="text-right amount">Rp. ${item.total_pajak.toLocaleString('id-ID')}</td>
            <td class="text-right amount">Rp. ${item.diskon_akhir.toLocaleString('id-ID')}</td>
            <td class="text-right amount">Rp. ${item.total_harga.toLocaleString('id-ID')}</td>
          </tr>`,
      )
      .join('');

    // Replace placeholders
    htmlTemplate = htmlTemplate
      .replace('./company_logo.png', logoBase64)
      .replace(/{{SUPPLIER_NAME}}/g, data[0].nama_suplier)
      .replace('{{BANK_NAME}}', data[0].nama_bank)
      .replace('{{ACCOUNT_NUMBER}}', data[0].no_rekening)
      .replace('{{ACCOUNT_NAME}}', data[0].nama_suplier)
      .replace('<!-- TABLE_ROWS_PLACEHOLDER -->', tableRows)
      .replace(
        '{{TOTAL_AMOUNT}}',
        `Rp. ${total_akhir.toLocaleString('id-ID')}`,
      );

    await this.generatePDF(htmlTemplate, output_path);
  }

  async saveHppToFile(createLaporanDto: CreateLaporanHPPDto) {
    let reportData: any = await this.laporanHPPKayu(createLaporanDto);

    // base path (current directory)
    let { basePath, logoPath } = await this.getBasePath();
    let pimpinan = 'Bpk. Francis Hariono';

    console.log(reportData);
    console.log(basePath);
    console.log(logoPath);

    // buat inputan untuk generate report
    const inputGenerateReport: GenerateReportHppDto = {
      data: reportData,
      logo_path: logoPath,
      template_path: '',
      output_path: '',
      kepala_workshop: '',
      pimpinan: pimpinan,
    };

    if (reportData.tipe_proyek == 'kayu') {
      // update template path
      inputGenerateReport.template_path = path.join(
        basePath,
        'template_html',
        'report_template_L_HPPKayu.html',
      );

      // update kepala workshop
      inputGenerateReport.kepala_workshop = 'Anis';

      // update output path
      inputGenerateReport.output_path = path.join(
        basePath,
        'reports',
        'laporan_HPP_kayu.pdf',
      );

      // generate report HPP Kayu
      await this.generateReportHppKayu(inputGenerateReport).catch(
        console.error,
      );
    } else if (reportData.tipe_proyek == 'resin') {
      // update template path
      inputGenerateReport.template_path = path.join(
        basePath,
        'template_html',
        'report_template_L_HPPResin.html',
      );

      // update kepala workshop
      inputGenerateReport.kepala_workshop = 'Herman Sugiono';

      // update output path
      inputGenerateReport.output_path = path.join(
        basePath,
        'reports',
        'laporan_HPP_resin.pdf',
      );

      // generate report HPP Resin
      await this.generateReportHppResin(inputGenerateReport).catch(
        console.error,
      );
    } else if (reportData.tipe_proyek == 'finishing') {
      // update template path
      inputGenerateReport.template_path = path.join(
        basePath,
        'template_html',
        'report_template_L_HPPFinishing.html',
      );

      // update kepala workshop
      inputGenerateReport.kepala_workshop = 'Bpk. Willy';

      // update output path
      inputGenerateReport.output_path = path.join(
        basePath,
        'reports',
        'laporan_HPP_finishing.pdf',
      );

      // generate report HPP Finishing
      await this.generateReportHppFinishing(inputGenerateReport).catch(
        console.error,
      );
    } else {
      throw new NotFoundException('Tipe proyek tidak ditemukan');
    }

    // buat response
    const res: GenerateReportResponse = {
      message: `Laporan HPP ${reportData.tipe_proyek} berhasil dibuat di ${inputGenerateReport.output_path}`,
    };

    return res;
  }

  async saveLaporanBahanKeluar(
    createLaporanBahanKeluarDto: LaporanStokBahanKeluarDto,
  ) {
    let reportData: LaporanStokBahanKeluarResponse =
      await this.historyBahanKeluarService.handleLaporanStokBahanKeluar(
        createLaporanBahanKeluarDto,
      );

    // base path (current directory)
    let { basePath, logoPath } = await this.getBasePath();

    // buat inputan untuk generate report
    const inputGenerateReport: GenerateReportDto = {
      data: reportData.data,
      logo_path: logoPath,
      template_path: path.join(
        basePath,
        'template_html',
        'report_template_L_bahan_keluar.html',
      ),
      output_path: path.join(basePath, 'reports', 'laporan_bahan_keluar.pdf'),
    };

    // generate report bahan keluar
    await this.generateReportBahanKeluar(inputGenerateReport).catch(
      console.error,
    );

    // buat response
    const res: GenerateReportResponse = {
      message: `Laporan bahan keluar berhasil dibuat di ${inputGenerateReport.output_path}`,
    };

    return res;
  }

  async saveLaporanNota(createLaporanNota: FindAllNotaDto) {
    // base path (current directory)
    let { basePath, logoPath } = await this.getBasePath();

    // ambil report data
    let reportData: LaporanNotaResponse =
      await this.notaService.handleLaporanNota(createLaporanNota);

    // buat inputan untuk generate report
    const inputGenerateReport: GenerateReportDto = {
      data: reportData.data,
      logo_path: logoPath,
      template_path: '',
      output_path: '',
    };

    // jika id supplier ada isinya
    if (
      createLaporanNota.id_supplier > 0 &&
      createLaporanNota.tgl_input != null
    ) {
      // update template path
      inputGenerateReport.template_path = path.join(
        basePath,
        'template_html',
        'report_template_rekap_by_supplier.html',
      );

      // update output path
      inputGenerateReport.output_path = path.join(
        basePath,
        'reports',
        'laporan_rekap_nota_per_supplier.pdf',
      );

      // generate report nota supplier
      await this.generateRekapBySupplier(inputGenerateReport).catch(
        console.error,
      );
    } else if (
      createLaporanNota.tgl_nota != null ||
      createLaporanNota.tgl_input != null
    ) {
      // update template path
      inputGenerateReport.template_path = path.join(
        basePath,
        'template_html',
        'report_template_rekap_by_date.html',
      );

      // update output path
      inputGenerateReport.output_path = path.join(
        basePath,
        'reports',
        'laporan_rekap_nota_per_tanggal.pdf',
      );

      // generate report nota
      await this.generateRekapByDate(inputGenerateReport).catch(console.error);
    } else {
      throw new BadRequestException('Filter salah');
    }

    // buat response
    const res: GenerateReportResponse = {
      message: `Laporan Nota berhasil dibuat di ${inputGenerateReport.output_path}`,
    };

    return res;
  }
}
