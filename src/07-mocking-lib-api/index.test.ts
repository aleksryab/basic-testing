import axios from 'axios';
import { throttledGetDataFromApi } from './index';

const baseURL = 'https://jsonplaceholder.typicode.com';
const apiPath = 'your/awesome/api';

jest.mock('axios', () => ({
  get: jest.fn().mockResolvedValue({ data: 'Fake data' }),
  create() {
    return {
      get: this.get.mockResolvedValue({ data: 'Fake data' }),
    };
  },
}));

jest.mock('lodash', () => {
  const originalModule = jest.requireActual<typeof import('lodash')>('lodash');
  return {
    ...originalModule,
    throttle: jest.fn((fn) => fn),
  };
});

describe('throttledGetDataFromApi', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should create instance with provided base url', async () => {
    const createSpy = jest.spyOn(axios, 'create');
    await throttledGetDataFromApi(apiPath);
    expect(createSpy).toHaveBeenCalledWith({ baseURL });
  });

  test('should perform request to correct provided url', async () => {
    const getSpy = jest.spyOn(axios, 'get');
    await throttledGetDataFromApi(apiPath);
    expect(getSpy).toHaveBeenCalledWith(apiPath);
  });

  test('should return response data', async () => {
    const result = await throttledGetDataFromApi(apiPath);
    expect(result).toEqual('Fake data');
  });
});
