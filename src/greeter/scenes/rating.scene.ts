import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { RATING_SCENE_ID } from '../../shared/constants/scenes.constants';
import { KeyboardBuilderService } from '../../shared/keyboard/keyboard-builder.service';
import { ExtContext } from '../../shared/interfaces/context.interface';
import { UserService } from '../../user/user.service';
import { GreeterUpdate } from '../greeter.update';

@Scene(RATING_SCENE_ID)
export class RatingScene {
  constructor(
    private readonly keyboardBuilder: KeyboardBuilderService,
    private readonly userService: UserService,
    private readonly greeterUpdate: GreeterUpdate,
  ) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: ExtContext): Promise<void> {
    console.log('Enter to scene');
    const keyboard = this.keyboardBuilder.pickOne(['Home']);

    const resp = await this.userService.findByUsername(ctx.from.username);
    await ctx.reply(`Your rating ${resp.rating}`, keyboard.reply());
  }

  @Hears(['Home'])
  async onHome(@Ctx() ctx: ExtContext): Promise<void> {
    await ctx.scene.leave();
    await this.greeterUpdate.onStart(ctx);
  }
}
