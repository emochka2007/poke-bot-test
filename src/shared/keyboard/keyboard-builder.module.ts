import { KeyboardBuilderService } from './keyboard-builder.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [KeyboardBuilderService],
  exports: [KeyboardBuilderService],
})
export class KeyboardBuilderModule {}
