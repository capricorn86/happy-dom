import { vi, beforeAll } from 'vitest';

vi.mock('ws');

beforeAll(() => {
	process.env.TZ = 'Etc/GMT-2';
});
