import js from "@eslint/js";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: globals.browser,
    },

    // React関連のESLintプラグインを設定
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },

    // 基本的なESLintの設定とプラグインの推奨設定を適用
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactPlugin.configs.flat.recommended,
      reactPlugin.configs.flat["jsx-runtime"],
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ],

    // カスタムルールの設定
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // インポート文の順序とグループ化の設定
      "import/order": [
        "warn",
        {
          groups: [
            "builtin", // Node.js組み込みモジュール (例: fs, path)
            "external", // npm パッケージ
            "internal", // エイリアスパス (例: @/components)
            "parent", // 親ディレクトリのモジュール
            "sibling", // 同一ディレクトリのモジュール
            "index", // 現在のディレクトリのindex
          ],
          alphabetize: { order: "asc" }, // アルファベット順でソート
        },
      ],
    },

    // Reactの設定
    settings: {
      react: {
        version: "detect", // Reactバージョンの自動検出
      },
    },
  },

  // Prettierとの競合を防ぐための設定
  eslintConfigPrettier
);
