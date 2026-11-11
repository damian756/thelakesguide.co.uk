-- Daily page counts (Nov 2026). Additive only: creates one table, touches nothing else.
-- Stores the page path, the day and a number. Nothing about the visitor.
-- Apply with: npx prisma db execute --file prisma/sql/2026-11-page-count.sql
-- (never prisma db push or migrate: there is no migrations history).
CREATE TABLE IF NOT EXISTS "PageCount" ("path" TEXT NOT NULL, "day" DATE NOT NULL, "count" INTEGER NOT NULL DEFAULT 0, CONSTRAINT "PageCount_pkey" PRIMARY KEY ("path", "day"));
