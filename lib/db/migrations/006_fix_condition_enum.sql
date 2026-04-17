-- Add missing condition enum values to match frontend
-- PostgreSQL allows adding values to an existing enum

ALTER TYPE "condition" ADD VALUE IF NOT EXISTS 'Like New';
ALTER TYPE "condition" ADD VALUE IF NOT EXISTS 'Needs Love';
