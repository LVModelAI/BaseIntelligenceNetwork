# Next.js TypeScript Project Setup

This guide will help you set up, run, and configure a Next.js project built using TypeScript, with integration of OpenAI and Supabase APIs.

## Prerequisites

Before getting started, ensure you have the following software installed on your machine:

1. [Node.js](https://nodejs.org/en/download/) (version 14.x or higher)
2. [npm](https://www.npmjs.com/get-npm) or [pnpm](https://pnpm.io/installation) or [Yarn](https://yarnpkg.com/)

## Step 1: Clone the Repository

First, clone the repository from your Git hosting service (like GitHub or GitLab). Open a terminal and run the following command:

```bash
git clone <your-repository-url>
```

## Step 2: Navigate to the Project Directory

```bash
cd <your-project-directory>
```

## Step 3: Install Dependencies

```bash
npm install
```

or

```bash
pnpm install
```

or

```bash
yarn install
```

## Step 4: Create Environment Variables File

```env
# Environment
NEXT_PUBLIC_NODE_ENV="production" | "development"

# API Configuration
LVM_API_KEY=
BASE_API_URL=
EMBEDDING_API_KEY=
NEXT_PUBLIC_EMBEDDING_API_KEY=
NEXT_PUBLIC_EMBEDDING_BATCH_SIZE=
NEXT_PUBLIC_EMBEDDING_MODEL=
MODEL=
SYSTEM_PROMPT_TITLE=
CODE_MODEL=
CODE_SYSTEM_PROMPT=
BASE_SYSTEM_PROMPT=
BASE_SYSTEM_INSTRUCTIONS=

# Supabase Configuration
SUPABASE_URL=
SUPABASE_KEY=
SUPABASE_ACCESS_PASS_TABLE=
SUPABASE_CHATS_TABLE=
SUPABASE_SESSIONS_TABLE=


# For Rate limiter Middleware Configuration
NEXT_PUBLIC_LIMIT=
NEXT_PUBLIC_TIME_LIMIT_IN_MIN=

# Access Pass Configuration
ACCESS_PASS_COLLECTION_ID=
ACCESS_PASS_PROJECT_ID=
ACCESS_PASS_METADATA_ATTR_VAL=
ACCESS_PASS_METADATA_DESCRIPTION=
ACCESS_PASS_METADATA_IMAGE=
ACCESS_PASS_METADATA_NAME=

# Crossmint Configuration
CROSSMINT_API_KEY=
CROSSMINT_BASE_API=
CROSSMINT_ENDPOINT=

# Pinecone Configuration
NEXT_PUBLIC_PINECONE_API_KEY=
NEXT_PUBLIC_PINECONE_INDEX_NAME=
NEXT_PUBLIC_PINECONE_NAMESPACE=
```

## Step 5: Run the Development Server

```bash
npm run dev
```

or

```bash
pnpm run dev
```

or

```bash
yarn dev
```

#### The app will now run in development mode.

## Step 6 (Optional): Build for Production

```bash
npm run build
```

or

```bash
pnpm run build
```

or

```bash
yarn build
```

## Step 7 (Optional): Start the Production Server

```bash
npm start
```

or

```bash
pnpm start
```

or

```bash
yarn start
```

#### The app will now run in production mode.
