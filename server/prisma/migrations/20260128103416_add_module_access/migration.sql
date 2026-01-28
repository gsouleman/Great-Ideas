-- CreateEnum
CREATE TYPE "Module" AS ENUM ('FINANCIAL', 'ASSETS', 'ADMIN');

-- CreateTable
CREATE TABLE "module_access" (
    "id" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "module" "Module" NOT NULL,
    "access" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "module_access_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "module_access_role_module_key" ON "module_access"("role", "module");
