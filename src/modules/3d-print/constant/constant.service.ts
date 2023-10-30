import { Injectable } from '@nestjs/common';

@Injectable()
export class ConstantService {
  async getSupplierType() {
    return [
      {
        id: 0,
        name: '3D打印机',
      },
      {
        id: 1,
        name: '3D打印耗材',
      },
      {
        id: 2,
        name: '3D打印服务',
      },
      {
        id: 3,
        name: '3D打印软件',
      },
      {
        id: 4,
        name: '3D扫描仪',
      },
    ];
  }
}
