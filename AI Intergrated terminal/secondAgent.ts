import { contextBridge } from 'electron';
import { rootAgent } from './src/agent';

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,

  runAgent: async (input: string) => {
    let output = '';

    const stream = rootAgent.runAsync(input as unknown as any);

    for await (const rawEvent of stream) {
      const event = rawEvent as any;

      if (event.type === 'llm_output') {
        output += event.content;
      }

      if (event.type === 'error') {
        throw new Error(event.error ?? 'Agent error');
      }
    }

    return output;
  }
});
