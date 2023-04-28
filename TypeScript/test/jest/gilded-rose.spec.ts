import {GildedRose, Item} from '@/gilded-rose';

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
    'decreases sellIn and quality by 1 before expiration | $itemName @ $initialSellIn : $initialValue -> $expectedFinalValue',
    expectOneTickToChangeValue
  );

  test.each`
    itemName  | initialSellIn | initialValue | expectedFinalValue
    ${'Milk'} | ${-2}         | ${42}        | ${40}
    ${'Milk'} | ${0}          | ${50}        | ${48}
    ${'Milk'} | ${-11}        | ${2}         | ${0}
  `(
    'decreases sellIn by 1 and quality by 2 after expiration | $itemName @ $initialSellIn : $initialValue -> $expectedFinalValue',
    expectOneTickToChangeValue
  );

 test.each`
    itemName  | initialSellIn | initialValue | expectedFinalValue
    ${'Beer'} | ${-2}         | ${0}         | ${0}
    ${'Beer'} | ${10}         | ${0}         | ${0}
    ${'Beer'} | ${-11}        | ${1}         | ${0}
  `(
    'The Quality of an item is never negative | $itemName @ $initialSellIn : $initialValue -> $expectedFinalValue',
    expectOneTickToChangeValue
  );

  test.each([
    {
      input: new Item('Aged Brie', 10, 10),
      expected: new Item('Aged Brie', 9, 11)
    },
    {
      input: new Item('Aged Brie', -11, 10),
      expected: new Item('Aged Brie', -12, 12)
    },
  ])('"Aged Brie" actually increases in Quality the older it gets | $input',
    ({input, expected}) => expectCorrectSingleUpdate(input, expected));

  test.each([
    {
      input: new Item('Backstage passes to a TAFKAL80ETC concert', 10, 10),
      expected: new Item('Backstage passes to a TAFKAL80ETC concert', 9, 12)
    },
    {
      input: new Item('Backstage passes to a TAFKAL80ETC concert', 4, 10),
      expected: new Item('Backstage passes to a TAFKAL80ETC concert', 3, 13)
    },
    {
      input: new Item('Backstage passes to a TAFKAL80ETC concert', 1, 10),
      expected: new Item('Backstage passes to a TAFKAL80ETC concert', 0, 13)
    },
    {
      input: new Item('Backstage passes to a TAFKAL80ETC concert', 0, 10),
      expected: new Item('Backstage passes to a TAFKAL80ETC concert', -1, 0)
    },
  ])('Backstage passes to a TAFKAL80ETC concert: quality +2 <=10 days; +3 <= 5 days; 0 after | $input',
    ({input, expected}) => expectCorrectSingleUpdate(input, expected));

  test.each([
    {
      input: new Item('Aged Brie', 10, 50),
      expected: new Item('Aged Brie', 9, 50)
    },
    {
      input: new Item('Aged Brie', -10, 49),
      expected: new Item('Aged Brie', -11, 50)
    },
    {
      input: new Item('Aged Brie', 10, 66),
      expected: new Item('Aged Brie', 9, 66)
    },
    {
      input: new Item('Zola', 11, 123),
      expected: new Item('Zola', 10, 122)
    },
  ])('The Quality of an item is never more than 50 | $input',
    ({input, expected}) => expectCorrectSingleUpdate(input, expected));

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

  test.each([
    {
      input: new Item('Sulfuras', 10, 80),
      expected: new Item('Sulfuras', 9, 79)
    },
    {
      input: new Item('Sulfuras', -10, 80),
      expected: new Item('Sulfuras', -11, 78)
    },
    {
      input: new Item('Backstage passes', 5, 12),
      expected: new Item('Backstage passes', 4, 11)
    },
    {
      input: new Item('Backstage passes', 9, 80),
      expected: new Item('Backstage passes', 8, 79)
    },
    {
      input: new Item('Backstage passes', -9, 6),
      expected: new Item('Backstage passes', -10, 4)
    },
  ])('misnamed items are normal items | $input',
    ({input, expected}) => expectCorrectSingleUpdate(input, expected));

});

interface Interface {
  itemName: string,
  initialSellIn: number,
  initialValue: number,
  expectedFinalValue: number
}

function expectOneTickToChangeValue({itemName, initialSellIn, initialValue, expectedFinalValue}: Interface) {
  const initial = new Item(itemName, initialSellIn, initialValue)
  const expected = new Item(itemName, initialSellIn - 1, expectedFinalValue)
  expectCorrectSingleUpdate(initial, expected)
}

function expectCorrectSingleUpdate(input: Item, expected: Item) {
  const gildedRose = new GildedRose([input]);

  const [updatedItem] = gildedRose.updateQuality();

  expect(updatedItem).toEqual(expected);
}
