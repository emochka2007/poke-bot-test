import { Ctx, Hears, Message, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { BATTLE_POKE_SCENE_ID } from '../../shared/constants/scenes.constants';
import { KeyboardBuilderService } from '../../shared/keyboard/keyboard-builder.service';
import { ExtContext } from '../../shared/interfaces/context.interface';
import { GreeterUpdate } from '../greeter.update';
import { IPokemon } from '../../shared/interfaces/pokemon.interface';
import { WizardContext } from 'telegraf/typings/scenes';
import { PokeService } from '../../common/services/poke.service';
import { UserService } from '../../user/user.service';

@Wizard(BATTLE_POKE_SCENE_ID)
export class BattleWizard {
  constructor(
    private readonly keyboardBuilder: KeyboardBuilderService,
    private readonly greeterUpdate: GreeterUpdate,
    private readonly pokeService: PokeService,
    private readonly userService: UserService,
  ) {}
  @WizardStep(1)
  async onSceneEnter(@Ctx() ctx: ExtContext): Promise<void | string> {
    const keyboard = this.keyboardBuilder.pickOne(['Fight', 'Home']);
    if (!ctx.session.poke) {
      await ctx.scene.leave();
      await this.greeterUpdate.onStart(ctx);
      return 'Choose pokemon before fight';
    }
    await ctx.replyWithPhoto(
      { url: ctx.session.poke.sprites.front_default },
      {
        caption: `Your fighter is ${
          ctx.session.poke.name as string
        }. Base state is ${ctx.session.poke.stats[0].base_stat}`,
      },
    );
    await ctx.reply('Choose', keyboard.reply());
    await ctx.wizard.next();
  }
  @Hears(['Home'])
  async onHome(@Ctx() ctx: ExtContext): Promise<void> {
    await ctx.scene.leave();
    await this.greeterUpdate.onStart(ctx);
  }

  @On('text')
  @WizardStep(2)
  async onName(
    @Ctx() ctx: ExtContext,
    @Message() msg: { text: string },
  ): Promise<string> {
    console.log(msg);
    const random = Math.floor(Math.random() * 200);
    const pokemon = await this.pokeService.getPokemonById(random);
    await ctx.replyWithPhoto(
      { url: pokemon.data.sprites.front_default },
      {
        caption: `Your Enemy is ${pokemon.data.name} BaseStat: ${pokemon.data.stats[0].base_stat}`,
      },
    );
    ctx.session.enemyPoke = pokemon.data;
    await ctx.wizard.next();
    return 'Fight!';
  }

  @On('text')
  @WizardStep(3)
  async onLocation(
    @Ctx() ctx: ExtContext & { wizard: { state: { name: string } } },
    @Message() msg: { text: string },
  ): Promise<string> {
    await ctx.scene.leave();
    await this.greeterUpdate.onStart(ctx);
    if (
      ctx.session.enemyPoke.stats[0].base_stat <
      ctx.session.poke.stats[0].base_stat
    ) {
      await this.userService.updateRating(ctx.from.username, true);
      return 'You win!';
    } else {
      await this.userService.updateRating(ctx.from.username, false);
      return 'You lose!';
    }
  }
}
