import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% das requisições abaixo de 500ms
  },
};

export default function () {
  // Pega a base URL e endpoint dos usuários das variáveis de ambiente
  const baseUrl = __ENV.BASE_URL;
  const usersEndpoint = __ENV.USERS_ENDPOINT;

  // Monta a URL completa
  const url = `${baseUrl}${usersEndpoint}`;

  const res = http.get(url);

  check(res, {
    'status é 200': (r) => r.status === 200,
    'tempo de resposta < 1000ms': (r) => r.timings.duration < 1000,
  });

  sleep(1);
}
