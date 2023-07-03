import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';

jest.unmock('lodash');
const lodash = jest.requireActual('lodash');

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const initialBalance = 10000;
    const account = getBankAccount(initialBalance);
    expect(account.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(10000);
    expect(() => account.withdraw(20000)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const firstAccount = getBankAccount(10000);
    const secondAccount = getBankAccount(1000);

    expect(() => firstAccount.transfer(10001, secondAccount)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(10000);
    expect(() => account.transfer(1000, account)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const initialBalance = 10000;
    const depositAmount = 1000;

    const account = getBankAccount(initialBalance);
    account.deposit(depositAmount);

    expect(account.getBalance()).toBe(initialBalance + depositAmount);
  });

  test('should withdraw money', () => {
    const initialBalance = 10000;
    const withdrawAmount = 1000;

    const account = getBankAccount(initialBalance);
    account.withdraw(withdrawAmount);

    expect(account.getBalance()).toBe(initialBalance - withdrawAmount);
  });

  test('should transfer money', () => {
    const initialBalance = 10000;
    const transferAmount = 1000;
    const firstAccount = getBankAccount(initialBalance);
    const secondAccount = getBankAccount(initialBalance);

    firstAccount.transfer(transferAmount, secondAccount);
    expect(firstAccount.getBalance()).toBe(initialBalance - transferAmount);
    expect(secondAccount.getBalance()).toBe(initialBalance + transferAmount);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = getBankAccount(10000);
    const expectedBalance = 55;

    lodash.random = jest.fn().mockReturnValue(expectedBalance);
    const balance = await account.fetchBalance();

    expect(balance).toBe(expectedBalance);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const account = getBankAccount(10000);
    const expectedBalance = 100;

    lodash.random = jest.fn().mockReturnValue(expectedBalance);
    await account.synchronizeBalance();

    expect(account.getBalance()).toBe(expectedBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(10000);
    lodash.random = jest.fn().mockReturnValueOnce(100).mockReturnValueOnce(0);

    expect(async () => await account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
