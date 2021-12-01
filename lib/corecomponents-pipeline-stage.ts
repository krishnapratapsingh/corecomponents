import { Stage, Construct, StageProps,} from '@aws-cdk/core';
import { cfnlintProjStack } from './stacks/cfn-lint-stack';
import { FirstCftPipelineStack } from './stacks/myFirstChildPipeline';

export class CorepipelineReleaseStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);
    // stage action construct definition
    const cfnlintObj = new cfnlintProjStack( this, "cfn-lint-build-project");
    cfnlintObj.templateOptions.description = 'SyntexValidationProject';
    const FirstChildRef = new FirstCftPipelineStack(this, 'my-test-Child-Pipeline');
    FirstChildRef.templateOptions.description = 'First-pipeline';

  }
}
