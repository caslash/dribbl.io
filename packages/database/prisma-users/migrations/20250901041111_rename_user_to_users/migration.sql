/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "display_name" TEXT,
    "name" TEXT,
    "profile_url" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
