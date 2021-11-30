import { Stage, Construct, StageProps,} from '@aws-cdk/core';
import { cfnlintProjStack } from './stacks/cfn-lint-stack';


export class CorepipelineReleaseStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);
    // stage action construct definition
    const cfnlintObj = new cfnlintProjStack( this, "cfn-lint-build-project");
    cfnlintObj.templateOptions.description = 'SyntexValidationProject';

  }
}
