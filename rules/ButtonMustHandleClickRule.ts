import * as ts from 'typescript';
import * as Lint from 'tslint';
import {isExpressionValueUsed, isArrayLiteralExpression} from 'tsutils';

export class Rule extends Lint.Rules.AbstractRule {
	public static FAILURE_STRING = 'button(type is not submit) must handle click';
	public static submitTypeReg = /\{?['"]submit["']\}?/;
	public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
		return this.applyWithWalker(new ButtonMustHandleClickWalker(sourceFile, this.getOptions()));
	}
}
// The walker takes care of all the work.
class ButtonMustHandleClickWalker extends Lint.RuleWalker {
	visitJsxElement(element: ts.JsxElement){
		const openingEl = element.openingElement;
		const tagName = openingEl.tagName.getText();
		if(tagName.toLowerCase() === 'button'){
			const attributes: any = {};
			openingEl.attributes.forEachChild(function (child){
				const splited = child.getText().split('=');
				const key = splited[0].trim();
				const value = typeof splited[1] === 'undefined' ? true : splited[1].trim();
				attributes[key] = value;
			});
			if(!attributes.onClick && !attributes.href && !Rule.submitTypeReg.test(attributes.type)){
				this.addFailureAtNode(openingEl, Rule.FAILURE_STRING);
			}
		}
		super.visitJsxElement(element);
	}
}

