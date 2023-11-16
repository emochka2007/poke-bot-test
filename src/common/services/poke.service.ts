import axios, { Axios, AxiosResponse } from 'axios';
import { IPokemon } from '../../shared/interfaces/pokemon.interface';
export class PokeService {
  constructor(private readonly baseUrl: string) {
    this.baseUrl = 'https://pokeapi.co/api/v2/';
  }
  async getPokemonById(id: number): Promise<AxiosResponse<IPokemon>> {
    return await axios.get(`${this.baseUrl}pokemon/${id}`);
  }
}
