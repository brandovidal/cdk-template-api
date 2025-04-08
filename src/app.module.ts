import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { QuotationModule } from './modules/quotation/quotation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    QuotationModule
  ],
})
export class AppModule {}
