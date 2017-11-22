import * as ts from 'typescript';
import * as Lint from 'tslint';
import {isExpressionValueUsed, isArrayLiteralExpression} from 'tsutils';

const compatibilities = {
	Array: {
		'prototype.findIndex': {
			specification: 'es2015',
			browsers: {
				chrome: '45',
				safari: '7.1',
				edge: '0',
				firefox: '25',
				ios: '8'
			}
		}
	}
};
const testOptions = {
	browsers: [
		'ios 8',
		'chrome 33'
	]
};
const options = {
	browsers: [
		{
			name: 'ios',
			version: '8'
		},
		{
			name: 'chrome',
			version: '33'
		}
	]
};
export class Rule extends Lint.Rules.TypedRule {
	public applyWithProgram(sourceFile: ts.SourceFile, program: ts.Program): Lint.RuleFailure[] {
		return this.applyWithWalker(new CompatibilityCheckWalker(sourceFile, this.getOptions(), program));
	}
}
// The walker takes care of all the work.
class CompatibilityCheckWalker extends Lint.ProgramAwareRuleWalker {
	visitPropertyAccessExpression(node: ts.PropertyAccessExpression){
		let propertyName = node.name.text;
		const tsType = this.getTypeChecker().getTypeAtLocation(node.getChildAt(0));
		if(tsType && tsType.symbol){
			let typeName = tsType.symbol.escapedName.toString();
			if(typeName.indexOf('Constructor') === -1){
				propertyName = `prototype.${propertyName}`;
				typeName = typeName.replace('Constructor', '');
			}
			const compatibility = compatibilities[typeName] && compatibilities[typeName][propertyName];
			if(compatibility){
				options.browsers.forEach((browser) => {
					const supportVersion = compatibility.browsers[browser.name];
					if(!supportVersion || browser.version < supportVersion){
						this.addFailureAtNode(node, `${typeName}.${propertyName} is not support in ${browser.name}${browser.version}.Support verison:${browser.name}${supportVersion}`);
					}
				});
			}
		}
		super.visitPropertyAccessExpression(node);
	}
}

