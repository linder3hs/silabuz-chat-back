/*
  Warnings:

  - Added the required column `send_id` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "send_id" INTEGER NOT NULL;
