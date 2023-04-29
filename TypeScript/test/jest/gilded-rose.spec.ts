import {GildedRose, Item} from '@/gilded-rose';

const testCaseFormat = '$itemName @ $initialSellIn : $initialValue -> $expectedFinalValue'

interface TestCase {
  itemName: string,
  initialSellIn: number,
  initialValue: number,
  expectedFinalValue: number
}

function expectOneTickToChangeValue({itemName, initialSellIn, initialValue, expectedFinalValue}: TestCase) {
  const initial = new Item(itemName, initialSellIn, initialValue)
  const expected = new Item(itemName, initialSellIn - 1, expectedFinalValue)
  expectCorrectSingleUpdate(initial, expected)
}

function expectCorrectSingleUpdate(input: Item, expected: Item) {
  const gildedRose = new GildedRose([input]);

  const [updatedItem] = gildedRose.updateQuality();

  expect(updatedItem).toEqual(expected);
}

describe('Gilded Rose', () => {
  it('keeps item name', () => {
    const item = new Item('foo', 0, 0);
    const gildedRose = new GildedRose([item]);

    const items = gildedRose.updateQuality();

    expect(items).toHaveLength(1);
    expect(items[0].name).toBe('foo');
  });

  test.each`
    itemName  | initialSellIn | initialValue | expectedFinalValue
    ${'Ram'}  | ${20}         | ${42}        | ${41}
    ${'Ham'}  | ${3}          | ${50}        | ${49}
    ${'Jam'}  | ${1}          | ${7}         | ${6}
    ${'Spam'} | ${1}          | ${1}         | ${0}
  `(
    `${testCaseFormat} | decreases sellIn and quality by 1 before expiration`,
    expectOneTickToChangeValue
  );

  test.each`
    itemName  | initialSellIn | initialValue | expectedFinalValue
    ${'Milk'} | ${-2}         | ${42}        | ${40}
    ${'Milk'} | ${0}          | ${50}        | ${48}
    ${'Milk'} | ${-11}        | ${2}         | ${0}
  `(
    `${testCaseFormat} | decreases sellIn by 1 and quality by 2 after expiration`,
    expectOneTickToChangeValue
  );

  test.each`
    itemName  | initialSellIn | initialValue | expectedFinalValue
    ${'Beer'} | ${-2}         | ${0}         | ${0}
    ${'Beer'} | ${10}         | ${0}         | ${0}
    ${'Beer'} | ${-11}        | ${1}         | ${0}
  `(
    `${testCaseFormat} | The Quality of an item is never negative`,
    expectOneTickToChangeValue
  );

  test.each`
    itemName       | initialSellIn | initialValue  | expectedFinalValue
    ${'Aged Brie'} | ${10}         | ${10}         | ${11}
    ${'Aged Brie'} | ${-11}        | ${10}         | ${12}
  `(
    `${testCaseFormat} | "Aged Brie" increases in Quality the older it gets`,
    expectOneTickToChangeValue
  );

  test.each`
    itemName                                       | initialSellIn | initialValue  | expectedFinalValue
    ${'Backstage passes to a TAFKAL80ETC concert'} | ${10}         | ${10}         | ${12}
    ${'Backstage passes to a TAFKAL80ETC concert'} | ${ 4}         | ${10}         | ${13}
    ${'Backstage passes to a TAFKAL80ETC concert'} | ${ 1}         | ${10}         | ${13}
    ${'Backstage passes to a TAFKAL80ETC concert'} | ${ 0}         | ${10}         | ${0}
  `(
    `${testCaseFormat} | Passes: quality +2 <=10 days; +3 <= 5 days; 0 after`,
    expectOneTickToChangeValue
  );

  test.each`
    itemName       | initialSellIn | initialValue   | expectedFinalValue
    ${'Aged Brie'} | ${10}         | ${50}          | ${50}
    ${'Aged Brie'} | ${-7}         | ${49}          | ${50}
    ${'Aged Brie'} | ${10}         | ${666}         | ${666} | (WTF?)
    ${'Zola'}      | ${11}         | ${123}         | ${122} | (WTF?)
  `(
    `${testCaseFormat} | Quality of an item is never more than 50`,
    expectOneTickToChangeValue
  );

                                                                                                                                                                                                            test.each`
    itemName              | initialSellIn | initialValue | expectedFinalValue
    ${'Sulfuras'}         | ${10}         | ${80}        | ${79}
    ${'Sulfuras'}         | ${-6}         | ${80}        | ${78}
    ${'Backstage passes'} | ${15}         | ${12}        | ${11}
    ${'Backstage passes'} | ${15}         | ${80}        | ${79}
    ${'Backstage passes'} | ${-9}         | ${6}         | ${4}
  `(
    `${testCaseFormat} | misnamed items are normal items`,
    expectOneTickToChangeValue
  );

  test.each([
    {
      input: new Item('Sulfuras, Hand of Ragnaros', 10, 80),
      expected: new Item('Sulfuras, Hand of Ragnaros', 10, 80)
    },
    {
      input: new Item('Sulfuras, Hand of Ragnaros', -10, 80),
      expected: new Item('Sulfuras, Hand of Ragnaros', -10, 80)
    },
  ])('"Sulfuras, Hand of Ragnaros", being a legendary item, never has to be sold; its Quality is 80 and it never alters | $input',
    ({input, expected}) => expectCorrectSingleUpdate(input, expected));


});

