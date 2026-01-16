-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EXCOM', 'MEMBER', 'GUEST');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "memberName" TEXT NOT NULL,
    "memberId" TEXT,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT true,
    "is2FAEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLogin" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" "TransactionType" NOT NULL,
    "category" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
