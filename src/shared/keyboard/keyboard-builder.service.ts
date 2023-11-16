import { Keyboard } from 'telegram-keyboard';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KeyboardBuilderService {
  pickOne(options: string[]) {
    return Keyboard.make(options);
  }
}
