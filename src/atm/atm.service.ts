import { Injectable } from '@nestjs/common';
import { CreateAtmDto } from './dto/create-atm.dto';
import { UpdateAtmDto } from './dto/update-atm.dto';

@Injectable()
export class AtmService {
  create(createAtmDto: CreateAtmDto) {
    return 'This action adds a new atm';
  }

  findAll() {
    return `This action returns all atm`;
  }

  findOne(id: number) {
    return `This action returns a #${id} atm`;
  }

  update(id: number, updateAtmDto: UpdateAtmDto) {
    return `This action updates a #${id} atm`;
  }

  remove(id: number) {
    return `This action removes a #${id} atm`;
  }
}
