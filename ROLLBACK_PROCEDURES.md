# Rollback & Recovery Procedures

If a deployment fails, corrupted database records occur, or a container build error blocks the application, follow these emergency rollback steps.

---

## ↺ 1. Fast Rollback to Previous Docker Build

```bash
# Stop running stack
docker-compose -f docker/docker-compose.yml down

# Revert git working tree to last stable commit
git reset --hard HEAD~1

# Rebuild containers with clean cache
docker-compose -f docker/docker-compose.yml up --build -d
```

---

## 🧹 2. Database Schema Reset & Reseed

If test data corrupts PostgreSQL metrics:
```bash
# Wipe postgres volume
docker-compose -f docker/docker-compose.yml down -v

# Re-launch stack (automatically re-executes database/schema.sql)
docker-compose -f docker/docker-compose.yml up -d
```
