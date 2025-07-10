import http from 'k6/http';
import { check, sleep, fail } from 'k6';

function isValidJWT(token) {
  if (!token) return false;
  const parts = token.split('.');
  return parts.length === 3 && parts.every(p => p.length > 0);
}

export const options = {
  stages: [
    { duration: '10s', target: 5 },
    { duration: '20s', target: 15 },
    { duration: '10s', target: 0 },
  ],
};

export default function () {
  const baseUrl = __ENV.BASE_URL;
  const loginEndpoint = __ENV.LOGIN_ENDPOINT;
  const username = __ENV.user;
  const password = __ENV.pass;

  const url = `${baseUrl}${loginEndpoint}`;
  const payload = JSON.stringify({ username, password });
  const params = { headers: { 'Content-Type': 'application/json' } };


  console.log('Payload enviado:', payload);
  console.log('URL:', url);


  const res = http.post(url, payload, params);

  if (res.status !== 200) {
    fail(`Esperava status 200, mas recebeu ${res.status}`);
  }

  let body;
  try {
    body = JSON.parse(res.body);
  } catch (e) {
    fail('Resposta não é JSON válido');
  }

  const requiredFields = [
    'id', 'username', 'email', 'firstName', 'lastName',
    'gender', 'image', 'accessToken', 'refreshToken',
  ];

  for (const field of requiredFields) {
    check(body, {
      [`campo ${field} presente`]: (b) => b[field] !== undefined && b[field] !== null,
    }) || fail(`Campo obrigatório '${field}' não presente`);
  }

  check(body, {
    'accessToken é JWT válido': (b) => isValidJWT(b.accessToken),
    'refreshToken é JWT válido': (b) => isValidJWT(b.refreshToken),
    'username corresponde': (b) => b.username === username,
  }) || fail('Validação de token ou username falhou');

  sleep(1);
}
