import Decohub, { State } from "apps/decohub/mod.ts";

/**
 * @title Deco Hub
 * @description Unlock apps and integrations on deco.cx
 * @category Tool
 * @logo https://decoims.com/scarcom/b04d90aa-c36d-472a-a25f-7d39e24844b6/18a28e97_18a28e977196d303f1ba350805504de7.png
 */
export default function App(params: State) {
  return Decohub(params);
}

export { Preview } from "apps/decohub/mod.ts";
