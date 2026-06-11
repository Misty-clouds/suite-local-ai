import { Module } from '@nestjs/common';
import { FivetranService } from './fivetran.service';
import { FivetranController } from './fivetran.controller';

@Module({
  controllers: [FivetranController],
  providers: [FivetranService],
  exports: [FivetranService],
})
export class FivetranModule {}
