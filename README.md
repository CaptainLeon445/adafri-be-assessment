# Adafri backend assessment demo application

This repository contains all the business logics and API endpoints for the Adafri backend assessment demo application.

A comprehensive documentation for building server-side application for Adafri backend assessment demo application with Express.js, Postgresql, Sequelize and TypeScript.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies](#technologies)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Running the Development Server](#running-the-development-server)
- [Linting](#linting)
- [Documentation](#documentation)
- [Important Notification](#important-notification)
- [Conclusion](#conclusion)

## Introduction

This project implements a basic crud techniques for creating campaign using NodeJS, TypeScript, and PostgreSQL.
This documentation provides the guidelines in cloning the repository and running the codes on your local machine.

## Features

- Create access keys
- get access keys
- reset access keys (rate limits enforced)
- create campaign
- edit campaign
- get campaign details
- get campaign metrics
- delete campaign

## Technologies

- Node.js: LTS version for the backend.
- TypeScript: For type safety and improved developer experience.
- PostgreSQL: Database of choice due to hosting constraints on Render.
- Sequelize.js: SQL query builder for interacting with the PostgreSQL database.
- Docker: Containerization of the application for consistency across environments.
- Makefile: Task automation for setting up and running the application.
- Jest: Testing framework for unit tests.
- ESLint: Linting to maintain code quality and consistency.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed on your machine.
- Basic knowledge of TypeScript and Express.js.
- Docker
- Make


## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/CaptainLeon445/adafri-be-assessment.git
   cd adafri-be-assessment

   ```
2. Install dependencies
   ```bash
   make install-dep
   ```

### Running the Development Server

1. Runs the application in development mode

   ```bash
   make dev

   ```

2. Open Browser or Postman

- Open your browser to localhost [http://127.0.0.1:3000](http://127.0.0.1:3000)
- Invoke the `/api/v1/health` endpoint

```shell
curl http://127.0.0.1:3000/
```

- The `/api-docs` endpoint is for the swagger UI

```shell
curl http://127.0.0.1:3000/api-docs
```

- Check the routes files to get the other resource


## Linting

Linting is done using ESLint. Check for linting issues using:

   ```bash
   make lint

   ```
   * chmod +x .husky/pre-commit
   * husky is a git hook used for linting the codes before commit

## Documentation

  * The API documentation is available on [Adafri-test-API-endpoints](https://adafri-be-assessment.onrender.com/)


## Important Notification

- Facebook campaign ad api permission unavailable due to pending developer business account status

## Conclusion
This document summarizes the implementation of the Adafri campaign ad backend assessment demo. The use of Docker,husky, Makefile, PostgreSQL, Sequelize, TypeScript,  ESLint, ensures a robust, scalable, and maintainable codebase. The design decisions and technology choices were influenced by the constraints of the hosting platform and the need for type safety, code quality, and developer productivity.

