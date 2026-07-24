# COZY 커피 주문 앱 - 백엔드

Express.js 기반 REST API 서버 개발 환경입니다.

## 기술 스택

- Node.js
- Express 4
- PostgreSQL (추후 연동)

## 시작하기

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env

# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 프로덕션 실행
npm start
```

## API 확인

서버 실행 후 브라우저 또는 터미널에서 health check:

```bash
curl http://localhost:3000/api/health
```

## 폴더 구조

```
server/
├── src/
│   ├── index.js    # 서버 진입점
│   └── app.js      # Express 앱 설정
├── .env.example    # 환경 변수 예시
└── package.json
```

## 환경 변수

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `PORT` | 서버 포트 | `3000` |
| `CORS_ORIGIN` | 프런트엔드 URL | `http://localhost:5173` |
| `DATABASE_URL` | PostgreSQL 연결 문자열 | (추후 사용) |

## API Base URL

개발 환경: `http://localhost:3000/api`

자세한 API 명세는 [docs/PRD.md](../docs/PRD.md) 섹션 6.4를 참고하세요.
