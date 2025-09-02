# rep_server_app

## Overview

This repository contains the `rep_server_app`, a Node.js application for serving API endpoints.

## Database Setup

Run the SQL initialization script to create the required database schema:

```
./docs/init.sql
```

## Application Setup

Clone the repository:

```
git clone https://github.com/oxu-ai/rep_server_app.git
cd rep_server_app
```

Install dependencies:

```
npm install
```

(Optional) Install PM2 globally if you want to deploy with process management:

```
npm install -g pm2
```

## Running the Application

Development (auto-restart on code changes):

```
npm run dev
```

Production with PM2 (recommended):

```
pm2 reload app.js --name rep_server_app || pm2 start app.js --name rep_server_app
```
