import { Module } from '@nestjs/common';
import { AtmService } from './atm.service';
import { AtmController } from './atm.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AtmRepository } from './atm.repository';

@Module({
  imports: [PrismaModule],
  controllers: [AtmController],
  providers: [AtmService, AtmRepository],
})
export class AtmModule {}
