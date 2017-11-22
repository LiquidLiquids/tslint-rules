import * as ts from 'typescript';
import * as Lint from 'tslint';
import {isExpressionValueUsed, isArrayLiteralExpression} from 'tsutils';

export class Rule extends Lint.Rules.TypedRule {
	public static FAILURE_STRING = 'Array.prototype.concat left need';

	public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
		return this.applyWithWalker(new ConcatLeftNeedWalker(sourceFile, this.getOptions(), program));
	}
}
// The walker takes care of all the work.
class ConcatLeftNeedWalker extends Lint.ProgramAwareRuleWalker {
	visitPropertyAccessExpression(node: ts.PropertyAccessExpression){
		if(node.name.text === 'concat' && !isExpressionValueUsed(node.parent as any)){
			const tsType = this.getTypeChecker().getTypeAtLocation(node.getChildAt(0));
			if(tsType && tsType.symbol && tsType.symbol.escapedName === 'Array'){
				super.addFailureAtNode(node.parent, Rule.FAILURE_STRING);
			}
		}
		super.visitPropertyAccessExpression(node);
	}
}

