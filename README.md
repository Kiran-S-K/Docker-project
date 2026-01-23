Got it 👍
Below is the **same content**, but written **properly in `README.md` Markdown format** so you can **directly paste it** into your repo.

---

```md
# Docker Compose Microservices Project (Node.js + MongoDB)

This project demonstrates how to build, run, debug, and scale a **multi-container backend system** using **Docker Compose**.

The focus is not just on “making it work”, but on understanding:
- container networking  
- startup timing issues  
- scaling limitations  
- persistent data with volumes  
- real-world debugging  

---

## 🧱 Architecture Overview

**Services used:**

- **web** – Node.js API (internal service, scalable)
- **mongo** – MongoDB database (stateful, persistent)
- **mongo-express** – Database UI (exposed for debugging)

All services communicate over Docker’s **internal network** using **service names**.

```

web  ───▶ mongo
│
└── (scaled to multiple containers)

mongo-express ───▶ mongo

```

---

## 🛠 Tech Stack

- Node.js (Express)
- MongoDB
- Docker
- Docker Compose
- Alpine Linux (minimal base image)

---

## 📁 Project Structure

```

.
├── server.js
├── package.json
├── Dockerfile
├── docker-compose.yml
├── .env
└── README.md

````

---

## ⚙️ Key Design Decisions

### 1️⃣ No `ports` for the API service (`web`)

The `web` service is **not exposed to the host**.

```yaml
web:
  build: .
````

**Why?**

* Allows horizontal scaling
* Avoids host port conflicts
* Matches real production architecture

Other containers access the API using:

```
http://web:5050
```

---

### 2️⃣ Service names instead of `localhost`

Containers communicate using **service names**, not `localhost`.

❌ `localhost:27017`
✅ `mongo:27017`

This avoids connection errors caused by container isolation.

---

### 3️⃣ MongoDB uses a named volume

```yaml
volumes:
  - mongo_data:/data/db
```

**Why?**

* Data persists across restarts
* Credentials are initialized only once
* Demonstrates stateful containers

This also explains why `docker compose restart` does **not** reset database state.

---

### 4️⃣ Retry logic in the API (startup timing)

MongoDB may start slower than the API.

To handle this, the Node.js app includes **retry logic**:

* API does not crash immediately
* Retries Mongo connection on startup
* Exits only after retries fail

This solves the limitation of `depends_on`, which only controls start order.

---

## ▶️ How to Run

### Start all services

```bash
docker compose up
```

### Scale the API

```bash
docker compose up --scale web=2
```

Scaling works because:

* No host ports are bound
* Each container has its own network namespace

---

## 🔍 How to Verify (Without Exposing Ports)

### Access Mongo Express (host)

```
http://localhost:8081
```

### Test API from inside Docker

```bash
docker compose exec web sh
```

```bash
wget -q -O - http://web:5050/health
```

Expected:

```json
{"status":"ok"}
```

```bash
wget -q -O - http://web:5050/data
```

Expected:

```json
{"message":"Data inserted","count":1}
```

Running again increases the count, proving:

* Mongo connection works
* Volume persistence works

---

## 🧪 What This Project Demonstrates

* Difference between **containers vs services**
* Internal vs host networking
* Why scaling fails when ports are used
* Why volumes preserve database state
* Real debugging with logs and `exec`
* Minimal container images and missing tools (BusyBox vs GNU)

---

## 🚨 Common Failure Scenarios (Handled)

| Problem                     | Solution                                 |
| --------------------------- | ---------------------------------------- |
| `ECONNREFUSED mongo:27017`  | Retry logic + service names              |
| DB credentials not updating | Remove volume (`docker compose down -v`) |
| Scaling fails               | Remove `ports` from API                  |
| No curl inside container    | Use BusyBox `wget`                       |

---

## 📌 Learning Outcome

This project helped me understand:

* how real backend services communicate in Docker
* why design decisions matter more than syntax
* how to debug systems instead of guessing

---

## 🏁 Conclusion

This is not a tutorial copy project.
It focuses on **real-world DevOps concepts** such as scalability, isolation, persistence, and debugging.

```


