import { Scenes, Context } from 'telegraf';
import { IPokemon } from './pokemon.interface';

interface ExtWizardSession extends Scenes.WizardSessionData {
  // will be available under `ctx.scene.session.myWizardSessionProp`
  email: string;
  nickname: string;
  password: string;
}

interface ExtSession extends Scenes.WizardSession<ExtWizardSession> {
  poke: IPokemon;
  enemyPoke: IPokemon;
}

export interface ExtContext extends Context {
  session: ExtSession;
  scene: Scenes.SceneContextScene<ExtContext, ExtWizardSession>;
  wizard: Scenes.WizardContextWizard<ExtContext>;
}
