const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const rollupDist = path.join(rootDir, 'node_modules', 'rollup', 'dist');

function patchNativeJs() {
  const file = path.join(rollupDist, 'native.js');
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes("require('@babel/parser')")) return;

  const fallbackBlock = `		if (error instanceof Error && error.code === 'ERR_DLOPEN_FAILED') {
			try {
				return require('@rollup/wasm-node/dist/native.js');
			} catch {
				const crypto = require('node:crypto');
				const babelParser = require('@babel/parser');
				const stripBabelProps = node => {
					if (!node || typeof node !== 'object') return node;
					if (Array.isArray(node)) {
						for (let i = 0; i < node.length; i++) stripBabelProps(node[i]);
						return node;
					}
					delete node.loc;
					delete node.extra;
					delete node.leadingComments;
					delete node.trailingComments;
					delete node.innerComments;
					delete node.comments;
					delete node.tokens;
					delete node.directives;
					delete node.errors;
					delete node.range;
					delete node.interpreter;
					if (node.type === 'ImportExpression' && node.options === undefined) {
						node.options = Array.isArray(node.arguments) ? (node.arguments[0] || null) : null;
						delete node.arguments;
					}
					if (
						(node.type === 'ImportDeclaration' ||
							node.type === 'ExportNamedDeclaration' ||
							node.type === 'ExportAllDeclaration') &&
						!Array.isArray(node.attributes)
					) {
						node.attributes = node.assertions || [];
						delete node.assertions;
					}
					if (node.type === 'ChainExpression' && node.expression) {
						stripBabelProps(node.expression);
					}
					for (const key of Object.keys(node)) {
						const val = node[key];
						if (val && typeof val === 'object') stripBabelProps(val);
					}
					return node;
				};
				const parseWithBabel = (input, allowReturnOutsideFunction, jsx) => {
					const ast = babelParser.parse(String(input), {
						sourceType: 'module',
						allowReturnOutsideFunction: Boolean(allowReturnOutsideFunction),
						plugins: jsx ? ['estree', 'jsx', 'importAttributes'] : ['estree', 'importAttributes']
					});
					return stripBabelProps(ast.program);
				};
				return {
					parse: (input, allowReturnOutsideFunction, jsx) =>
						parseWithBabel(input, allowReturnOutsideFunction, jsx),
					parseAsync: async (input, allowReturnOutsideFunction, jsx) =>
						parseWithBabel(input, allowReturnOutsideFunction, jsx),
					xxhashBase64Url: input => crypto.createHash('sha256').update(input).digest('base64url').slice(0, 11),
					xxhashBase36: input => BigInt('0x' + crypto.createHash('sha256').update(input).digest('hex').slice(0, 16)).toString(36),
					xxhashBase16: input => crypto.createHash('sha256').update(input).digest('hex').slice(0, 16)
				};
			}
		}`;

  content = content.replace(
    /\t\tthrow new Error\(\s*`Cannot find module \$\{id\}\. `/,
    fallbackBlock + '\n\n\t\tthrow new Error(\n\t\t\t`Cannot find module ${id}. `'
  );
  fs.writeFileSync(file, content, 'utf8');
}

function patchParseAstEs() {
  const file = path.join(rollupDist, 'es', 'shared', 'parseAst.js');
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes("res && res.type === 'Program'")) return;
  content = content.replace(
    'const parseAst = (input, { allowReturnOutsideFunction = false, jsx = false } = {}) => convertProgram(getAstBuffer(parse(input, allowReturnOutsideFunction, jsx)));\nconst parseAstAsync = async (input, { allowReturnOutsideFunction = false, jsx = false, signal } = {}) => convertProgram(getAstBuffer(await parseAsync(input, allowReturnOutsideFunction, jsx, signal)));',
    `const parseAst = (input, { allowReturnOutsideFunction = false, jsx = false } = {}) => {
    const res = parse(input, allowReturnOutsideFunction, jsx);
    return res && res.type === 'Program' ? res : convertProgram(getAstBuffer(res));
};
const parseAstAsync = async (input, { allowReturnOutsideFunction = false, jsx = false, signal } = {}) => {
    const res = await parseAsync(input, allowReturnOutsideFunction, jsx, signal);
    return res && res.type === 'Program' ? res : convertProgram(getAstBuffer(res));
};`
  );
  fs.writeFileSync(file, content, 'utf8');
}

function patchParseAstCjs() {
  const file = path.join(rollupDist, 'shared', 'parseAst.js');
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes("res && res.type === 'Program'")) return;
  content = content.replace(
    'const parseAst = (input, { allowReturnOutsideFunction = false, jsx = false } = {}) => convertProgram(getAstBuffer(native_js.parse(input, allowReturnOutsideFunction, jsx)));\nconst parseAstAsync = async (input, { allowReturnOutsideFunction = false, jsx = false, signal } = {}) => convertProgram(getAstBuffer(await native_js.parseAsync(input, allowReturnOutsideFunction, jsx, signal)));',
    `const parseAst = (input, { allowReturnOutsideFunction = false, jsx = false } = {}) => {
    const res = native_js.parse(input, allowReturnOutsideFunction, jsx);
    return res && res.type === 'Program' ? res : convertProgram(getAstBuffer(res));
};
const parseAstAsync = async (input, { allowReturnOutsideFunction = false, jsx = false, signal } = {}) => {
    const res = await native_js.parseAsync(input, allowReturnOutsideFunction, jsx, signal);
    return res && res.type === 'Program' ? res : convertProgram(getAstBuffer(res));
};`
  );
  fs.writeFileSync(file, content, 'utf8');
}

function patchNodeEntryEs() {
  const file = path.join(rollupDist, 'es', 'shared', 'node-entry.js');
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes("if (buffer && buffer.type === 'Program')")) return;
  content = content.replace(
    'function convertProgram(buffer, parent, parentScope) {\n    return convertNode(parent, parentScope, 0, getAstBuffer(buffer));\n}',
    `function convertProgram(buffer, parent, parentScope) {
    if (buffer && buffer.type === 'Program') {
        return new nodeConstructors[buffer.type](parent, parentScope).parseNode(buffer);
    }
    return convertNode(parent, parentScope, 0, getAstBuffer(buffer));
}`
  );
  fs.writeFileSync(file, content, 'utf8');
}

function patchRollupCjs() {
  const file = path.join(rollupDist, 'shared', 'rollup.js');
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes("if (buffer && buffer.type === 'Program')")) return;
  content = content.replace(
    'function convertProgram(buffer, parent, parentScope) {\n    return convertNode(parent, parentScope, 0, parseAst_js.getAstBuffer(buffer));\n}',
    `function convertProgram(buffer, parent, parentScope) {
    if (buffer && buffer.type === 'Program') {
        return new nodeConstructors[buffer.type](parent, parentScope).parseNode(buffer);
    }
    return convertNode(parent, parentScope, 0, parseAst_js.getAstBuffer(buffer));
}`
  );
  fs.writeFileSync(file, content, 'utf8');
}

patchNativeJs();
patchParseAstEs();
patchParseAstCjs();
patchNodeEntryEs();
patchRollupCjs();
