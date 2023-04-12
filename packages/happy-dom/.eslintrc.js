const WARN = 'warn';
const ERROR = 'error';
const OFF = 'off';

const COMMON_CONFIG = {
	plugins: ['jsdoc', 'filenames', 'jest', 'import', 'prettier'],
	extends: ['plugin:@typescript-eslint/recommended', 'prettier', 'plugin:prettier/recommended'],
	rules: {
		'prettier/prettier': WARN,
		'no-underscore-dangle': OFF,
		'no-debugger': WARN,
		'space-infix-ops': ERROR,
		'no-console': WARN,
		'wrap-iife': OFF,
		'no-self-assign': ERROR,
		'no-self-compare': ERROR,
		'no-loop-func': OFF,
		'array-callback-return': ERROR,
		curly: ERROR,
		'no-fallthrough': OFF,
		'dot-notation': OFF,
		'prefer-const': WARN,
		'no-empty-function': OFF,
		'no-with': ERROR,
		'one-var': [ERROR, 'never'],
		camelcase: [WARN, { properties: 'always', ignoreImports: true }],
		'spaced-comment': [WARN, 'always'],
		'capitalized-comments': [WARN, 'always', { ignorePattern: 'prettier' }],
		'no-useless-rename': WARN,
		'jsdoc/check-alignment': WARN,
		'jsdoc/check-examples': OFF,
		'jsdoc/check-indentation': WARN,
		'jsdoc/check-syntax': WARN,
		'jsdoc/check-tag-names': WARN,
		'jsdoc/check-types': WARN,
		'jsdoc/implements-on-classes': WARN,
		'jsdoc/match-description': OFF,
		'jsdoc/newline-after-description': WARN,
		'jsdoc/no-types': OFF,
		'jsdoc/no-undefined-types': OFF,
		'jsdoc/require-description': OFF,
		'jsdoc/require-description-complete-sentence': OFF,
		'jsdoc/require-example': OFF,
		'jsdoc/require-hyphen-before-param-description': [WARN, 'never'],
		'jsdoc/require-param': WARN,
		'jsdoc/require-param-name': WARN,
		'jsdoc/require-returns-check': WARN,
		'jsdoc/require-returns-description': WARN,
		'jsdoc/valid-types': WARN,
		'filenames/match-exported': WARN,
		'jest/consistent-test-it': [WARN, { fn: 'it', withinDescribe: 'it' }],
		'jest/valid-title': [
			WARN,
			{
				mustMatch: {
					// Describe: '^[A-Z][a-zA-Z0-9]+$|^[a-z][a-zA-Z0-9]+\\(\\)$',
					it: '^[A-Z](.+).$'
				}
			}
		],
		'jest/prefer-hooks-on-top': WARN,
		'jest/no-duplicate-hooks': WARN,
		'no-useless-constructor': WARN,
		'jsdoc/require-jsdoc': [
			WARN,
			{
				require: {
					ArrowFunctionExpression: false,
					FunctionDeclaration: false,
					FunctionExpression: false,
					ClassDeclaration: true,
					MethodDefinition: true
				}
			}
		],
		'import/no-extraneous-dependencies': WARN
	}
};

const TS_PARSER_FIELDS = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: 2020,
		sourceType: 'module'
	}
};

module.exports = {
	env: {
		es6: true,
		browser: true,
		node: true,
		jest: true
	},
	overrides: [
		{
			files: ['*.js', '*.jsx', '*.mjs'],
			...TS_PARSER_FIELDS,
			plugins: COMMON_CONFIG.plugins,
			extends: COMMON_CONFIG.extends,
			rules: {
				...COMMON_CONFIG.rules,
				'no-undef': ERROR,
				'jsdoc/check-param-names': WARN,
				'jsdoc/require-param-type': WARN,
				'jsdoc/require-returns': WARN,
				'jsdoc/require-param-description': WARN,
				'jsdoc/require-returns-type': WARN,
				'consistent-return': WARN
			}
		},
		{
			files: ['*.json'],
			plugins: ['json'],
			extends: ['eslint:recommended', 'plugin:json/recommended', 'plugin:jest/recommended']
		},
		{
			files: ['*.ts', '*.tsx'],
			plugins: [...COMMON_CONFIG.plugins, '@typescript-eslint'],
			...TS_PARSER_FIELDS,
			extends: [...COMMON_CONFIG.extends, 'plugin:@typescript-eslint/recommended'],
			rules: {
				...COMMON_CONFIG.rules,
				'@typescript-eslint/explicit-member-accessibility': [
					ERROR,
					{ overrides: { constructors: 'no-public' } }
				],
				'@typescript-eslint/no-unused-vars': OFF, // TSC is already doing this
				'@typescript-eslint/ban-types': OFF, // TSC is already doing this
				'no-undef': OFF, // TSC is already doing this
				'@typescript-eslint/no-var-requires': OFF,
				'@typescript-eslint/explicit-module-boundary-types': OFF, // TSC is already doing this
				'@typescript-eslint/consistent-type-assertions': [
					WARN,
					{ assertionStyle: 'angle-bracket' }
				],
				'@typescript-eslint/no-explicit-any': ERROR,
				'@typescript-eslint/no-empty-function': OFF,
				'@typescript-eslint/no-use-before-define': OFF,
				'@typescript-eslint/no-this-alias': OFF,
				'@typescript-eslint/explicit-function-return-type': [ERROR, { allowExpressions: true }],
				'@typescript-eslint/member-ordering': [
					WARN,
					{
						default: ['signature', 'field', 'constructor', ['get', 'set'], 'method']
					}
				],
				'@typescript-eslint/ban-ts-comment': OFF,
				'jsdoc/no-types': WARN,
				'import/named': WARN,
				'import/no-named-as-default': WARN,
				'import/no-extraneous-dependencies': WARN,
				'@typescript-eslint/naming-convention': [
					WARN,
					{
						selector: 'interface',
						format: ['PascalCase'],
						prefix: ['I']
					},
					{
						selector: 'enum',
						format: ['PascalCase'],
						suffix: ['Enum']
					},
					{
						selector: 'typeParameter',
						format: ['PascalCase']
					},
					{
						selector: 'memberLike',
						modifiers: ['private'],
						leadingUnderscore: 'allow',
						format: ['camelCase']
					},
					{
						selector: 'class',
						format: ['PascalCase']
					}
				]
			}
		}
	]
};
