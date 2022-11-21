# Running the application

### Cloning the repository

```bash
  gh repo clone muNeves3/Ng-CashApp-application
  code Ng-CashApp-application
```

## Backend

#### Creating the docker container

```bash
  cd backend
  docker compose up -D
```

#### Runing the backend

```
  cd backend
  yarn
  yarn prisma migrate:dev
  yarn start:dev
```

### Routes

- Create a user: http://localhost:3000/user
- Login a user: http://localhost:3000/user/login
- Get User Transactions: http://localhost:3000/transactions?userId=1&cashIn=true&createdAt=2022-11-18 00:34:15.491
- Get User Account Balance http://localhost:3000/account/balance?userId=1

## Frontend

### Runing the frontend

```
  cd frontend
  cd ngcashapp
  yarn
  yarn start
```
