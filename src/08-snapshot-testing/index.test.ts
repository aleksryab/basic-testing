import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  const values = [1, 2, 3];
  const exampleList = {
    value: 1,
    next: { value: 2, next: { value: 3, next: { value: null, next: null } } },
  };

  // Check match by expect(...).toStrictEqual(...)
  test('should generate linked list from values 1', () => {
    const generatedList = generateLinkedList(values);
    expect(generatedList).toStrictEqual(exampleList);
  });

  // Check match by comparison with snapshot
  test('should generate linked list from values 2', () => {
    const generatedList = generateLinkedList(values);
    expect(generatedList).toMatchSnapshot();
  });
});
