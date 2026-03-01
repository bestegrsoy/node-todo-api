# Todo API with Authentication(Basic)

Node.js + Express + MongoDB ile geliştirilmiş, JWT tabanlı authentication sistemi içeren RESTful API.
Teknolojileri üstünde öğrenmek için yapılmış basic bir node.js Todo uygulaması.

## 🚀 Özellikler

- ✅ CRUD operasyonları (Create, Read, Update, Delete)
- 🔐 JWT Authentication (Access + Refresh Token)
- 🛡️ Password hashing (bcrypt)
- 🔒 Protected routes
- ⚡ Rate limiting
- 🐳 Docker desteği
- 📝 Input validation
- 🌐 CORS
- 🔐 Security headers (Helmet)
- 🔄 PM2 Process Manager (auto-restart, monitoring)
- 🚀 Nginx Reverse Proxy (HTTPS, load balancing)
- ✅ Testing (Jest + Supertest)

## 🛠️ Teknolojiler

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Security:** Helmet, CORS, express-rate-limit
- **Logging:** Morgan
- **Containerization:** Docker, Docker Compose
- **Process Manager:** PM2
- **Reverse Proxy:** Nginx (HTTPS, load balancing)

## 🔧 Production Özellikleri

### PM2 Process Manager
- Otomatik restart (crash durumunda)
- Process monitoring
- Zero-downtime deployment

### Nginx Reverse Proxy
- **HTTPS/SSL** - Self-signed certificate ile güvenli bağlantı
- **Load Balancing** - Round-robin ile çoklu instance desteği
- **Reverse Proxy** - Backend'i gizleme, güvenlik
- **HTTP → HTTPS Redirect** - Otomatik yönlendirme

### Scaling
```bash
# 3 instance ile çalıştır
docker-compose up --scale app=3 -d

# Health check
curl https://localhost/health
```

## 📦 Kurulum

### Gereksinimler

- Node.js (v20+)
- Docker & Docker Compose

### 1. Repository'yi Klonla

```
git clone https://github.com/kullanici-adi/node-todo-api.git
cd node-todo-api
```

### 2. Environment Variables

`.env.example` dosyasını kopyala ve düzenle:
```bash
cp .env.example .env
```

### 3. Docker ile Çalıştır

```
docker-compose up --build -d
```

### 4. SSL Sertifikası Oluştur (Opsiyonel - Development)
```bash
mkdir -p nginx/ssl
cd nginx/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx-selfsigned.key \
  -out nginx-selfsigned.crt
```

API: \`http://localhost:3000\`

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/auth/register` | Yeni kullanıcı kaydı |
| POST | `/auth/login` | Kullanıcı girişi |
| POST | `/auth/refresh` | Access token yenileme |
| POST | `/auth/logout` | Çıkış yapma |

### Todos (Protected)

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/todos` | Tüm todo'ları listele |
| POST | `/todos` | Yeni todo oluştur |
| GET | `/todos/:id` | Tek todo getir |
| PUT | `/todos/:id` | Todo güncelle |
| DELETE | `/todos/:id` | Todo sil |

## 🔑 Kullanım Örnekleri

### Register

```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "123456"
}
```

### Login

```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "123456"
}
```

**Response:**
```
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "dGhpcyBpc...",
  "user": {
    "id": "...",
    "email": "user@example.com"
  }
}
```

### Todo Oluştur (Protected)

```
POST /todos
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "Yeni görev"
}
```

## 🏗️ Proje Yapısı

```
node-todo-api/
├── config/
│   └── db.js              # MongoDB bağlantısı
├── controllers/
│   ├── authController.js  # Auth logic
│   └── todoController.js  # Todo CRUD logic
├── middlewares/
│   ├── authMiddleware.js  # JWT verification
│   └── errorHandler.js    # Centralized error handling
├── models/
│   ├── User.js            # User schema
│   └── Todo.js            # Todo schema
├── routes/
│   ├── authRoutes.js      # Auth endpoints
│   └── todoRoutes.js      # Todo endpoints
├── .dockerignore
├── .env
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json
└── server.js              # Entry point
```

## 🔒 Güvenlik

- Şifreler bcrypt ile hash'lenir
- JWT token'lar güvenli şekilde oluşturulur
- Rate limiting ile brute force koruması
- Helmet ile HTTP header güvenliği
- CORS konfigürasyonu
- Input validation
