import { Ctx, Hears, Message, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { RANDOM_POKE_SCENE_ID } from '../../shared/constants/scenes.constants';
import { KeyboardBuilderService } from '../../shared/keyboard/keyboard-builder.service';
import { ExtContext } from '../../shared/interfaces/context.interface';
import { PokeService } from '../../common/services/poke.service';
import { GreeterUpdate } from '../greeter.update';

@Scene(RANDOM_POKE_SCENE_ID)
export class RandomPokemonScene {
  constructor(
    private readonly keyboardBuilder: KeyboardBuilderService,
    private readonly pokeService: PokeService,
    private readonly greeterUpdate: GreeterUpdate,
  ) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: ExtContext): Promise<string> {
    console.log('Enter to scene');
    const keyboard = this.keyboardBuilder.pickOne(['Random pokemon']);
    await ctx.reply('Click to get random pokemon', keyboard.reply());
    return 'And your pokemon is...';
  }

  @Hears(['Random pokemon'])
  async onName(@Ctx() ctx: ExtContext): Promise<void> {
    const random = Math.floor(Math.random() * 200);
    const pokemon = await this.pokeService.getPokemonById(random);
    ctx.session.poke = pokemon.data;
    await ctx.replyWithPhoto(
      { url: pokemon.data.sprites.front_default },
      {
        caption: `Name ${pokemon.data.name} BaseStat: ${pokemon.data.stats[0].base_stat}`,
      },
    );
    const keyboard = this.keyboardBuilder.pickOne([
      'Home',
      'Choose another pokemon',
    ]);
    await ctx.reply('Choose', keyboard.reply());
  }

  @Hears(['Choose another pokemon'])
  async onChooseAnotherPokemon(@Ctx() ctx: ExtContext): Promise<void> {
    await this.onName(ctx);
  }

  @Hears(['Home'])
  async onHome(@Ctx() ctx: ExtContext): Promise<void> {
    await ctx.scene.leave();
    await this.greeterUpdate.onStart(ctx);
  }
}
