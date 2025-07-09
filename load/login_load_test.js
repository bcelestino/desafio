import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 5 },   // Sobe para 5 usuários virtuais em 10s
    { duration: '20s', target: 15 },  // Mantém 15 usuários por 20s
    { duration: '10s', target: 0 },   // Reduz para 0
  ],
};

export default function () {
  const url = 'https://dummyjson.com/auth/login';
  const payload = JSON.stringify({
    username: 'emilys',
    password: 'emilyspass'
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status é 201': (r) => r.status === 201,
    'resposta rápida': (r) => r.timings.duration < 500,
    'token presente': (r) => JSON.parse(r.body).token !== undefined,
  });

  sleep(1);
}
