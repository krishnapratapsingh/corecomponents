import 'source-map-support/register';
import { Construct, Stack, StackProps } from '@aws-cdk/core';
import { Artifact } from '@aws-cdk/aws-codepipeline';
import { BitBucketSourceAction } from '@aws-cdk/aws-codepipeline-actions';
import { CdkPipeline, SimpleSynthAction } from '@aws-cdk/pipelines';
import { StringParameter } from '@aws-cdk/aws-ssm';
import { name, description as desc } from '../package.json';
import { CorepipelineReleaseStage } from './corecomponents-pipeline-stage';

export const service = name;
export const description = desc;
// Comment
export class CorecomponentsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    // define constants 
    const repoSourceArtifact = new Artifact('SourceArtifact');
    const sourceArtifact = new Artifact('SourceArtifact');
    const cloudAssemblyArtifact = new Artifact('CloudFormationPrepareOutput');
    const githubconnectionARN = "arn:aws:codestar-connections:us-east-1:174020875537:connection/7f7328c2-6e15-4599-a586-ea6acb9260ee";
    const GIT_BRANCH ="main";
    // The code that defines your stack goes here
      const corePipeline = new CdkPipeline(this, 'CdkCorePipeline', {
      pipelineName: service,
      cloudAssemblyArtifact,

      // Where the source can be found
      sourceAction: new BitBucketSourceAction({
        actionName: 'Checkout',
        owner: 'krishnapratapsingh',
        repo: 'corecomponents',
        branch: GIT_BRANCH,
        connectionArn: githubconnectionARN,
        output: repoSourceArtifact,
      }),

      // How it will be built and synthesized
      synthAction: SimpleSynthAction.standardNpmSynth({
        sourceArtifact,
        cloudAssemblyArtifact,
        installCommand: 'npm install --production=false',
        environment: {
          privileged: true,
        },
      }),
    });

    const deploymentSatge = new CorepipelineReleaseStage( this, "cdkdeploymentstage");
    corePipeline.addApplicationStage(deploymentSatge);
  }
}
