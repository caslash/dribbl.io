-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "display_name" TEXT,
    "name" TEXT,
    "profile_url" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
