import { simpleCalculator, Action } from './index';

describe('simpleCalculator tests', () => {
  test('should add two numbers', () => {
    const result = simpleCalculator({ a: 3, b: 6, action: Action.Add });
    expect(result).toBe(9);
  });

  test('should subtract two numbers', () => {
    const result = simpleCalculator({ a: 9, b: 3, action: Action.Subtract });
    expect(result).toBe(6);
  });

  test('should multiply two numbers', () => {
    const result = simpleCalculator({ a: 3, b: 3, action: Action.Multiply });
    expect(result).toBe(9);
  });

  test('should divide two numbers', () => {
    const result = simpleCalculator({ a: 9, b: 3, action: Action.Divide });
    expect(result).toBe(3);
  });

  test('should exponentiate two numbers', () => {
    const result = simpleCalculator({
      a: 3,
      b: 2,
      action: Action.Exponentiate,
    });
    expect(result).toBe(9);
  });

  test('should return null for invalid action', () => {
    const result = simpleCalculator({ a: 3, b: 2, action: '?' });
    expect(result).toBe(null);
  });

  test('should return null for invalid arguments', () => {
    let result = simpleCalculator({ a: 'invalid', b: 6, action: Action.Add });
    expect(result).toBe(null);
    result = simpleCalculator({ a: 3, b: 'invalid', action: Action.Add });
    expect(result).toBe(null);
  });
});
