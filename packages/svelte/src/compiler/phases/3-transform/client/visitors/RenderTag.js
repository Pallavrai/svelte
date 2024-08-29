/** @import { Expression } from 'estree' */
/** @import { RenderTag } from '#compiler' */
/** @import { ComponentContext } from '../types' */
import { unwrap_optional } from '../../../../utils/ast.js';
import * as b from '../../../../utils/builders.js';
import { push_template_quasi } from '../utils.js';

/**
 * @param {RenderTag} node
 * @param {ComponentContext} context
 */
export function RenderTag(node, context) {
	push_template_quasi(context.state, '<!>');
	const callee = unwrap_optional(node.expression).callee;
	const raw_args = unwrap_optional(node.expression).arguments;

	/** @type {Expression[]} */
	let args = [];
	for (let i = 0; i < raw_args.length; i++) {
		const raw = raw_args[i];
		const arg = /** @type {Expression} */ (context.visit(raw));
		if (node.metadata.args_with_call_expression.has(i)) {
			const id = b.id(context.state.scope.generate('render_arg'));
			context.state.init.push(b.var(id, b.call('$.derived_safe_equal', b.thunk(arg))));
			args.push(b.thunk(b.call('$.get', id)));
		} else {
			args.push(b.thunk(arg));
		}
	}

	let snippet_function = /** @type {Expression} */ (context.visit(callee));

	if (node.metadata.dynamic) {
		context.state.init.push(
			b.stmt(b.call('$.snippet', context.state.node, b.thunk(snippet_function), ...args))
		);
	} else {
		context.state.init.push(
			b.stmt(
				(node.expression.type === 'CallExpression' ? b.call : b.maybe_call)(
					snippet_function,
					context.state.node,
					...args
				)
			)
		);
	}
}
