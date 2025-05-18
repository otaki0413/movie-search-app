# [Movie Search App](https://movie-search-app-lilac-psi.vercel.app/)

## 概要

TMDB APIを使用した映画検索アプリ
キーワードとリリース年を指定して映画を検索することができる

## URL

https://movie-search-app-lilac-psi.vercel.app/

## 主な機能

- 映画の検索機能
  - キーワード検索（テキストフィールド）
  - リリース年検索（2020年〜2024年のプルダウン）
- 映画一覧の表示
  - 映画タイトル
  - サムネイル画像
  - リリース年月日
  - 映画ジャンル（複数表示）
- ページの追加読み込み（20件ずつ）

## 技術スタック

### フロントエンド

- [React](https://ja.react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [CSS Modules](https://ja.vite.dev/guide/features#css-modules)

### バックエンド

- [Vercel](https://vercel.com/)

  - Hosting
  - Serverless Functions

- [TMDB API](https://www.themoviedb.org/)

### 開発環境/ツール

- パッケージマネージャー
  - [npm](https://www.npmjs.com/)
- ビルドツール
  - [Vite](https://vite.dev/)
- リンター・フォーマッター
  - [ESLint](https://eslint.org/)
  - [Prettier](https://prettier.io/)
- Git hooks管理
  - [Husky](https://typicode.github.io/husky/#/)
  - [lint-staged](https://github.com/okonet/lint-staged)
- その他
  - [typed-css-modules](https://github.com/TypeStrong/typed-css-modules) (CSS Modulesの型定義生成)
  - [npm-run-all](https://github.com/mysticatea/npm-run-all) (複数スクリプトの並行実行)
  - [dotenv](https://github.com/motdotla/dotenv) (ローカル環境変数の管理)

## APIキー等の機密情報の管理について

- フロントエンドがVite・ReactのSPA構成のため、APIキー等はフロントエンドに露出しないようにする必要があります。
- 機密情報は **Vercelの環境変数** に設定し、**Serverless Functions 経由でTMDB APIにアクセス**するように設定しています。

## セットアップ手順

本プロジェクトをローカル環境にセットアップする手順は以下です。

### 前提条件

- TMDB API アカウント作成（APIキー・アクセストークン取得済み）
- Vercel アカウント作成
- [Vercel CLI](https://vercel.com/docs/cli)のインストール

### 手順

#### 1. 本リポジトリをクローン

```bash
git clone https://github.com/otaki0413/movie-search-app.git
cd movie-search-app
```

#### 2. パッケージのインストール

```bash
npm install
```

#### 3. Vercel へのデプロイと環境変数の設定

① 初回デプロイ（必須）

- Vercel Serverless Functionsを使用するため、プロジェクトをVercelにデプロイする必要があります。
- Vercelのダッシュボード または Vercel CLI でデプロイします。
- Vercel CLIを使用する場合は、以下のコマンドを実行

```bash
vercel
```

② Vercel ダッシュボードで環境変数を設定
| Key | Value |
| ------------------- | ------------------------- |
| `TMDB_API_KEY` | あなたのTMDB APIキー |
| `TMDB_ACCESS_TOKEN` | あなたのTMDBアクセストークン |

③ ローカルに `.env.local` を作成（Vercel CLI）

```bash
vercel env pull
```

- `.env.local` がプロジェクト直下に生成され、ローカルでも同様に環境変数を使用できるようになります。

#### 4. 開発サーバーの起動

```bash
npm run dev:vercel
または
npm run dev:full:vercel
```

- `npm run dev` でViteの開発サーバーを起動することも可能ですが、TMDB APIへのリクエストはVercelのServerless Functionsを経由する必要があるため、`package.json`のスクリプトを追記しました。

## 開発時に使用するコマンド

`package.json` に記載した主なスクリプト

| コマンド                  | 用途                                         |
| ------------------------- | -------------------------------------------- |
| `npm run dev:vercel`      | Vercel Functions + Vite の開発サーバーを起動 |
| `npm run dtc:watch`       | CSS Modules の型定義を監視・生成             |
| `npm run dev:full:vercel` | 上記2つのスクリプトを並列実行                |
| `npm run lint`            | ESLint でコードを検査                        |
| `npm run lint:fix`        | ESLint による自動修正                        |
| `npm run format`          | Prettier によるコード整形                    |
