import { Action, ActionPanel, captureException, Color, Icon, showToast, Toast } from "@raycast/api";
import {
  CodePipelineClient,
  DisableStageTransitionCommand,
  EnableStageTransitionCommand,
  PipelineExecutionStatus,
  StageTransitionType,
} from "@aws-sdk/client-codepipeline";
import { getErrorMessage } from "../../util";
import { MutatePromise } from "@raycast/utils";
import { Pipeline, PipelineStage } from "../../codepipeline";
import { usePipelineState } from "../../hooks/use-codepipeline";

export const ToggleStageTransitionAction = ({
  pipeline,
  mutate,
  visit,
}: {
  pipeline: Pipeline;
  mutate: MutatePromise<Pipeline[] | undefined>;
  visit: (pipeline: Pipeline) => Promise<void>;
}) => {
  const { stages, isLoading, mutate: revalidate } = usePipelineState(pipeline.name!);

  return (
    <ActionPanel.Submenu
      title="Toggle Stage Transition"
      icon={Icon.Bolt}
      shortcut={{ modifiers: ["ctrl"], key: "t" }}
      isLoading={isLoading}
      onOpen={revalidate}
      filtering
    >
      {(stages ?? [])
        .filter((s) => !!s.nextStage)
        .map((s) => {
          const transitionEnabled = !!s.nextStage!.inboundTransitionState?.enabled;
          return (
            <Action
              key={`${pipeline.name}-${s.stageName}-${s.nextStage!.stageName}`}
              icon={
                transitionEnabled
                  ? { source: Icon.Bolt, tintColor: Color.Green }
                  : { source: Icon.BoltDisabled, tintColor: Color.Red }
              }
              title={`${s.stageName} -> ${s.nextStage!.stageName}`}
              onAction={async () => {
                await visit(pipeline);
                await toggleStageTransition(transitionEnabled, pipeline.name!, s, mutate);
              }}
            />
          );
        })}
    </ActionPanel.Submenu>
  );
};

const toggleStageTransition = async (
  transitionEnabled: boolean,
  pipelineName: string,
  stage: PipelineStage,
  mutate: MutatePromise<Pipeline[] | undefined>,
) => {
  await mutate(transitionEnabled ? disableTransition(pipelineName, stage) : enableTransition(pipelineName, stage), {
    optimisticUpdate: (pipelines) => {
      if (!pipelines) {
        return;
      }

      return pipelines.map((p) =>
        p.name === pipelineName && transitionEnabled
          ? {
              ...p,
              ...(p.latestExecution && {
                latestExecution: {
                  ...p.latestExecution,
                  status: PipelineExecutionStatus.Stopped,
                  statusSummary: "Stage transition disabled",
                },
              }),
            }
          : p,
      );
    },
    shouldRevalidateAfter: !transitionEnabled,
  });
};

const enableTransition = async (pipelineName: string, stage: PipelineStage) => {
  const toast = await showToast(
    Toast.Style.Animated,
    "❗Enabling transition",
    `between ${stage.stageName} -> ${stage.nextStage!.stageName}`,
  );
  return new CodePipelineClient({})
    .send(
      new EnableStageTransitionCommand({
        pipelineName,
        stageName: stage.nextStage!.stageName,
        transitionType: StageTransitionType.Inbound,
      }),
    )
    .then(() => {
      toast.style = Toast.Style.Success;
      toast.title = "✅ Enabled transition";
      return true;
    })
    .catch((err) => {
      captureException(err);
      toast.style = Toast.Style.Failure;
      toast.title = "❌ Failed to enable transition";
      toast.message = getErrorMessage(err);
      throw err;
    });
};

const disableTransition = async (pipelineName: string, stage: PipelineStage) => {
  const toast = await showToast(
    Toast.Style.Animated,
    "❗Disabling transition",
    `between ${stage.stageName} -> ${stage.nextStage!.stageName}`,
  );
  return new CodePipelineClient({})
    .send(
      new DisableStageTransitionCommand({
        pipelineName,
        stageName: stage.nextStage!.stageName,
        transitionType: StageTransitionType.Inbound,
        reason: "Disabled by Raycast",
      }),
    )
    .then(() => {
      toast.style = Toast.Style.Success;
      toast.title = "✅ Disabled transition";
      return true;
    })
    .catch((err) => {
      captureException(err);
      toast.style = Toast.Style.Failure;
      toast.title = "❌ Failed to disable transition";
      toast.message = getErrorMessage(err);
      throw err;
    });
};
