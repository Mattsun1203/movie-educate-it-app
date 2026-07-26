import { containerState } from "./postgres-container";

export default async function globalTeardown() {
  await containerState.container?.stop();
}
