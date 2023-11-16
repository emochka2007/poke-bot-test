import { Command, Ctx, Hears, Start, Update, Sender } from 'nestjs-telegraf';
import {
  BATTLE_POKE_SCENE_ID,
  ENTRY_SCENE_ID,
  RANDOM_POKE_SCENE_ID,
  RATING_SCENE_ID,
  WIZARD_SCENE_ID,
} from '../shared/constants/scenes.constants';
import { KeyboardBuilderService } from '../shared/keyboard/keyboard-builder.service';
import { ExtContext } from '../shared/interfaces/context.interface';
import { UserService } from '../user/user.service';

@Update()
export class GreeterUpdate {
  constructor(
    private readonly keyboardBuilder: KeyboardBuilderService,
    private readonly userService: UserService,
  ) {}
  @Start()
  async onStart(@Ctx() ctx: ExtContext): Promise<void> {
    const keyboard = this.keyboardBuilder.pickOne([
      'Choose pokemon',
      'Battle',
      'Rating',
    ]);
    const user = await ctx.from;
    try {
      await this.userService.create({ username: user.username });
    } catch (error) {
      console.log(error);
    }

    await ctx.reply('Choose your option', keyboard.reply());
  }

  @Hears(['Choose pokemon'])
  async onGreetings(@Ctx() ctx: ExtContext): Promise<void> {
    await ctx.scene.enter(RANDOM_POKE_SCENE_ID);
  }

  @Hears(['Battle'])
  async onBattle(@Ctx() ctx: ExtContext): Promise<void> {
    await ctx.scene.enter(BATTLE_POKE_SCENE_ID);
  }

  @Hears(['Rating'])
  async onRating(@Ctx() ctx: ExtContext): Promise<void> {
    await ctx.scene.enter(RATING_SCENE_ID);
  }
}
