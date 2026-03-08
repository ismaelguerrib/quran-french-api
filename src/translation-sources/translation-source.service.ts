import { Injectable } from '@nestjs/common';

@Injectable()
export class TranslationSourceService {
  findAll() {
    return `This action returns all translationSource`;
  }

  findOne(id: number) {
    return `This action returns a #${id} translationSource`;
  }
}
