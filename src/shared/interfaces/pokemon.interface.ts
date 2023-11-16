export interface IPokemon {
  name: string;
  base_experience: number;
  stats: {
    base_stat: number;
    effort: number;
    stat: unknown;
  }[];
  sprites: {
    back_shiny: string;
    front_default: string;
  };
}
