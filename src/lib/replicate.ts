import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

/**
 * Run a prediction on Replicate and wait for the result.
 * @param model - Model identifier in format "owner/name" or "owner/name:version"
 * @param input - Model-specific input parameters
 * @returns The model output (type varies by model)
 */
export async function runPrediction<T = unknown>(
  model: `${string}/${string}` | `${string}/${string}:${string}`,
  input: Record<string, unknown>,
): Promise<T> {
  const output = (await replicate.run(model, { input })) as T;
  return output;
}

export { replicate };
