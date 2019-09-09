const WARN = 'warn';
const ERROR = 'error';
const OFF = 'off';
   
module.exports = {
    env: {
        es6: true,
        browser: true,
        node: true,
        jasmine: true
    },
    parser: require.resolve('@typescript-eslint/parser'),
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
          modules: true
        }
    },
    plugins: ['@typescript-eslint', 'prettier'],
    extends: [
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended'
    ],
    rules: {
        'prettier/prettier': WARN,
        'indent': OFF,
        'camelcase': OFF,
        'no-array-constructor': OFF,
        'no-use-before-define': OFF,
        'no-unused-vars': OFF,
        '@typescript-eslint/adjacent-overload-signatures': ERROR,
        '@typescript-eslint/array-type': ERROR,
        '@typescript-eslint/ban-types': ERROR,
        '@typescript-eslint/camelcase': ERROR,
        '@typescript-eslint/class-name-casing': ERROR,
        '@typescript-eslint/explicit-member-accessibility': [ERROR, 
            {
                overrides: {
                    constructors: 'no-public'
                }
            }
        ],
        '@typescript-eslint/indent': [WARN, 'tab'],
        '@typescript-eslint/interface-name-prefix': [ERROR, "always"],
        '@typescript-eslint/member-delimiter-style': ERROR,
        '@typescript-eslint/no-angle-bracket-type-assertion': ERROR,
        '@typescript-eslint/no-array-constructor': ERROR,
        '@typescript-eslint/no-empty-interface': ERROR,
        '@typescript-eslint/no-explicit-any': WARN,
        '@typescript-eslint/no-inferrable-types': ERROR,
        '@typescript-eslint/no-misused-new': ERROR,
        '@typescript-eslint/no-namespace': ERROR,
        '@typescript-eslint/no-non-null-assertion': ERROR,
        '@typescript-eslint/no-object-literal-type-assertion': ERROR,
        '@typescript-eslint/no-parameter-properties': ERROR,
        '@typescript-eslint/no-triple-slash-reference': ERROR,
        '@typescript-eslint/no-unused-vars': WARN,
        '@typescript-eslint/no-use-before-define': ERROR,
        '@typescript-eslint/no-var-requires': ERROR,
        '@typescript-eslint/prefer-interface': ERROR,
        '@typescript-eslint/prefer-namespace-keyword': ERROR,
        '@typescript-eslint/type-annotation-spacing': ERROR,
        '@typescript-eslint/no-angle-bracket-type-assertion': OFF,
        '@typescript-eslint/explicit-function-return-type': [WARN, {
            allowExpressions: true
        }],
        'require-jsdoc': [WARN, {
            require: {
                FunctionDeclaration: false,
                MethodDefinition: true,
                ClassDeclaration: false,
                ArrowFunctionExpression: false,
                FunctionExpression: false
            }
        }],
        'valid-jsdoc': OFF
    }
}
