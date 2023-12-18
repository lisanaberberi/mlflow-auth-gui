import { error, ValueOrError } from '@/lib/helpers';
import { Experiment, MLFlowExperimentResponse } from '@/lib/types';
import { mlflowExperimentGet } from '@/lib/serverApi';

export const getExperimentFromMlflow = async (
  experimentId: string,
): Promise<ValueOrError<Experiment>> => {
  const experimentResponse = await mlflowExperimentGet(experimentId);
  if (!experimentResponse.ok) {
    if (experimentResponse.status === 404) {
      return [null, error(404, 'Experiment not found')];
    }
    return [null, error(500, "Couldn't get experiment")];
  }
  const experimentJson = await experimentResponse.json();
  const experiment = MLFlowExperimentResponse.safeParse(experimentJson);
  if (!experiment.success) {
    console.error('getExperiment failed:', experiment.error.message, experimentJson);
    return [null, error(500, `Invalid response from MLFlow ${experiment.error.message}`)];
  }

  return [experiment.data.experiment, null];
};
