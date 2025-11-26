'use server';

/**
 * @fileOverview A flow that intelligently prioritizes tasks based on their descriptions and deadlines.
 *
 * - prioritizeTasks - A function that handles the task prioritization process.
 * - PrioritizeTasksInput - The input type for the prioritizeTasks function.
 * - PrioritizeTasksOutput - The return type for the prioritizeTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrioritizeTasksInputSchema = z.array(
  z.object({
    description: z.string().describe('The description of the task.'),
    deadline: z.string().describe('The deadline of the task in ISO format (YYYY-MM-DD).'),
  })
);
export type PrioritizeTasksInput = z.infer<typeof PrioritizeTasksInputSchema>;

const PrioritizeTasksOutputSchema = z.array(
  z.object({
    description: z.string().describe('The description of the task.'),
    deadline: z.string().describe('The deadline of the task in ISO format (YYYY-MM-DD).'),
    priority: z.number().describe('The priority of the task (1-10, 1 being highest).'),
    reason: z.string().describe('The reason for the assigned priority.'),
  })
);
export type PrioritizeTasksOutput = z.infer<typeof PrioritizeTasksOutputSchema>;

export async function prioritizeTasks(input: PrioritizeTasksInput): Promise<PrioritizeTasksOutput> {
  return prioritizeTasksFlow(input);
}

const prioritizeTasksPrompt = ai.definePrompt({
  name: 'prioritizeTasksPrompt',
  input: {schema: PrioritizeTasksInputSchema},
  output: {schema: PrioritizeTasksOutputSchema},
  prompt: `You are an AI assistant that intelligently prioritizes a list of tasks based on their descriptions and deadlines.

  Analyze each task and assign a priority from 1 to 10, where 1 is the highest priority and 10 is the lowest.
  Provide a brief reason for each assigned priority.

  Tasks:
  {{#each this}}
  - Description: {{{description}}}, Deadline: {{{deadline}}}
  {{/each}}
  
  Output the prioritized tasks with their descriptions, deadlines, priorities, and reasons in a JSON array format.
  Ensure the output can be parsed by JSON.parse().  Each object in the list must contain the keys \"description\", \"deadline\", \"priority\", and \"reason\". The \"priority\" must be a number between 1 and 10.
`,
});

const prioritizeTasksFlow = ai.defineFlow(
  {
    name: 'prioritizeTasksFlow',
    inputSchema: PrioritizeTasksInputSchema,
    outputSchema: PrioritizeTasksOutputSchema,
  },
  async input => {
    const {output} = await prioritizeTasksPrompt(input);
    return output!;
  }
);
