import { Module } from '@nestjs/common';
import { GreeterUpdate } from './greeter.update';
import { KeyboardBuilderModule } from '../shared/keyboard/keyboard-builder.module';
import { PokeService } from '../common/services/poke.service';
import { RandomPokemonScene } from './scenes/randomPoke.scene';
import { BattleWizard } from './wizard/battle.wizard';
import { UserModule } from '../user/user.module';
import { RatingScene } from './scenes/rating.scene';

@Module({
  imports: [KeyboardBuilderModule, UserModule],
  providers: [
    GreeterUpdate,
    PokeService,
    RandomPokemonScene,
    BattleWizard,
    RatingScene,
  ],
})
export class GreeterModule {}
