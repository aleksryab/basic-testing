import fs from 'fs';
import path from 'path';
import fsPromises from 'fs/promises';
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    jest.spyOn(global, 'setTimeout');
    const timeout = 1000;

    const callback = jest.fn();
    doStuffByTimeout(callback, timeout);

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(callback, timeout);
  });

  test('should call callback only after timeout', () => {
    const timeout = 1000;
    const callback = jest.fn();

    doStuffByTimeout(callback, timeout);
    expect(callback).not.toBeCalled();

    jest.runOnlyPendingTimers();

    expect(callback).toBeCalled();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    jest.spyOn(global, 'setInterval');
    const interval = 1000;

    const callback = jest.fn();
    doStuffByInterval(callback, interval);

    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenLastCalledWith(callback, interval);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const interval = 1000;

    const callback = jest.fn();
    doStuffByInterval(callback, interval);

    expect(callback).not.toBeCalled();

    jest.advanceTimersByTime(interval);
    expect(callback).toBeCalled();
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(interval);
    expect(callback).toBeCalled();
    expect(callback).toHaveBeenCalledTimes(2);
  });
});

describe('readFileAsynchronously', () => {
  const pathToFile = 'i/am/fake.hi';

  test('should call join with pathToFile', async () => {
    const joinSpy = jest.spyOn(path, 'join');
    await readFileAsynchronously(pathToFile);

    expect(joinSpy).toHaveBeenCalledTimes(1);
    expect(joinSpy).toHaveBeenCalledWith(__dirname, pathToFile);
  });

  test('should return null if file does not exist', async () => {
    const existsSyncSpy = jest.spyOn(fs, 'existsSync');
    existsSyncSpy.mockReturnValue(false);

    const result = await readFileAsynchronously(pathToFile);
    expect(result).toBe(null);
  });

  test('should return file content if file exists', async () => {
    const content = 'Fake content from fake file. OMG!';
    const existsSyncSpy = jest.spyOn(fs, 'existsSync');
    const readFileSpy = jest.spyOn(fsPromises, 'readFile');

    existsSyncSpy.mockReturnValue(true);
    readFileSpy.mockResolvedValue(content);

    const result = await readFileAsynchronously(pathToFile);
    expect(result).toBe(content);
  });
});
