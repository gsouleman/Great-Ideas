#!/bin/bash
export DATABASE_URL="postgresql://neondb_owner:npg_9geBaToXCs1v@ep-noisy-cell-a4rcfopc-pooler.us-east-1.aws.neon.tech/great_ideas?sslmode=require"
npx prisma generate
npx prisma migrate dev --name init
