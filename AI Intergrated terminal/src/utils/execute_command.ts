import { FunctionTool } from '@google/adk';
import { z } from 'zod';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec)
export const executeCommand = new FunctionTool({
    name: 'execute_command',
    description: 'Executes a shell command and returns stdout or stderr.',
    parameters: z.object({
        command: z.string().describe('Shell command to execute'),
    }),

    execute: async ({ command }) => {

        try {
            console.log("\n\n\n\n",command);
            
            const { stdout, stderr } = await execPromise(command);
            console.log("\n\n\n\n", stdout);
            

            if (stderr) {
                return {
                    status: 'error',
                    command,
                    stderr,
                };
            }

            return {
                status: 'success',
                command,
                stdout,
            };
        } catch (error) {
            return {
                status: 'error',
                command,
                error: error.message,
                stderr: error.stderr,
            };
        }

    },
});
