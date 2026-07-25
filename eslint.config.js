import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['apps/**', 'public/**', '**/public/**', '**/dist/**', '**/node_modules/**', '**/build/**', '*.js']),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'react-hooks/exhaustive-deps': 'off',
      'react/prop-types': 'off',
      'no-undef': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      'react-refresh/only-export-components': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'no-useless-assignment': 'off',

      'react-hooks/set-state-in-effect': 'off',
      'no-empty-pattern': 'off',
      '@typescript-eslint/no-empty-object-type': 'off'
    }
  },
  {
    files: [
      'packages/core/src/engine/plugins/**/*.ts', 
      'packages/core/src/protection/wasm/security.ts', 
      'packages/core/src/engine/ThreeViewer.ts', 
      'packages/sportswear/src/**/*.ts', 
      'packages/tour/src/**/*.ts',
      'packages/eyewear/src/**/*.ts',
      'packages/face-mocap/src/**/*.ts',
      'packages/core/src/global.d.ts',
      'vite.config.ts', 
      'packages/core/src/protection/wasm/SecureWasmSdk.ts'
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-empty': 'off',
      'no-useless-assignment': 'off',
      'prefer-const': 'off'
    }
  }
])
