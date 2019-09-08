import * as Lint from 'tslint';
import * as ts from 'typescript';

import { RuleHelpers } from './ruleHelpers';

interface RuleSetting {
  ngrx: boolean;
  service: boolean;
  router: boolean;
}

export class Rule extends Lint.Rules.AbstractRule {
  ruleSettings: { [key: string]: RuleSetting } = {};
  isContainer: boolean;

  constructor(options: Lint.IOptions) {
    super(options);

    this.ruleSettings.component = options.ruleArguments[0].component;
    this.ruleSettings.container = options.ruleArguments[0].container;
  }

  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    if (!sourceFile.fileName.match(/.*(component|container)\.ts/)) {
      return [];
    }
    return this.applyWithFunction(sourceFile, ctx => {
      this.isContainer = sourceFile.fileName.indexOf('container') >= 0;
      ctx.sourceFile.statements.filter(ts.isImportDeclaration).forEach((importStatement: ts.ImportDeclaration) => {
        const fromStringToken = RuleHelpers.getNextChildTokenOfKind(importStatement, ts.SyntaxKind.StringLiteral);
        const fromStringText = fromStringToken.getText().substring(1, fromStringToken.getText().length - 1);

        let c: string;
        if (this.isContainer) {
          c = 'container';
        } else {
          c = 'component';
        }

        if (fromStringText.search(/\/store(\/|$)/) >= 0 && !this.ruleSettings[c].ngrx) {
          ctx.addFailureAtNode(
            importStatement,
            `ngrx handling is not allowed in ${c}s. (found ${importStatement.getText()})`
          );
        }
        if (fromStringText.search(/\.service$/) >= 0 && !this.ruleSettings[c].service) {
          ctx.addFailureAtNode(
            importStatement,
            `service usage is not allowed in ${c}s. (found ${importStatement.getText()})`
          );
        }
        if (fromStringText.search(/angular\/router/) >= 0 && !this.ruleSettings[c].router) {
          ctx.addFailureAtNode(
            importStatement,
            `router usage is not allowed in ${c}s. (found ${importStatement.getText()})`
          );
        }
      });
    });
  }
}
