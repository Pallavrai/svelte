/** @import { Comment } from '#compiler' */
/** @import { ComponentContext } from '../types' */

import { push_template_quasi } from '../utils.js';

/**
 * @param {Comment} node
 * @param {ComponentContext} context
 */
export function Comment(node, context) {
	// We'll only get here if comments are not filtered out, which they are unless preserveComments is true
	push_template_quasi(context.state, `<!--${node.data}-->`);
}
