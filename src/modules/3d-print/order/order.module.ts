import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { The3dPrintOrder, The3dPrintOrderSchema } from '../schemas/order';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [
    MongooseModule.forFeature([
      {
        name: The3dPrintOrder.name,
        schema: The3dPrintOrderSchema,
      },
    ]),
  ],
  exports: [OrderService],
})
export class OrderModule {}
