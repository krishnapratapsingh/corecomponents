import 'source-map-support/register';
import {Stack, StackProps, Construct, CfnOutput} from '@aws-cdk/core';
import { BuildSpec, PipelineProject, LinuxBuildImage } from '@aws-cdk/aws-codebuild';
import { Role, ServicePrincipal, ManagedPolicy } from '@aws-cdk/aws-iam';


export class cfnlintProjStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const CodeBuildRunRole = new Role(this, 'CodeBuildRunRole', {
      assumedBy: new ServicePrincipal('codebuild.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'),
      ],
    });

    const CfnLintStepProj = new PipelineProject(this, 'CfnLintStepProj', {
      role: CodeBuildRunRole,
      projectName: "CfnLintSyntexCheck",
      buildSpec: BuildSpec.fromObject({
        version: 0.2,
        phases: {
          install: {
            commands: [
            "echo \"Setting up cfn-lint\"",
             "pip3 install cfn-lint --quiet",
            ],
            finally: [
              'echo $(cfn-lint -v)',
              'echo $(python3 --version)',
              'echo $(pip3 --version)',
            ],
          },
          build: {
            commands: [
		"echo \"Validating templates using cfn-lint\"",
		"REPORT=$(uuidgen)-cfnlint-report.json",
		"set +e; cfn-lint templates/* -f json > $REPORT; echo 0",
		"echo \"cfn-lint validation complete\"",
            ],
          },
        },
      }),
      environment: {
        buildImage: LinuxBuildImage.STANDARD_5_0,
      },
    });

    new CfnOutput(this, 'CodeBuildProjArn: ', {
      value: CfnLintStepProj.projectArn ?? 'Something went wrong with the deploy',
    });
  }
}

