import {GildedRose, Item} from '@/gilded-rose';

describe('Gilded Rose', () => {
  it('keeps item name', () => {
    const item = new Item('foo', 0, 0);
    const gildedRose = new GildedRose([item]);

    const items = gildedRose.updateQuality();

    expect(items).toHaveLength(1);
    expect(items[0].name).toBe('foo');
  });

  test.each([
    {
      input: new Item('Ram', 20, 42),
      expected: new Item('Ram', 19, 41)
    },
    {
      input: new Item('Ham', 3, 50),
      expected: new Item('Ham', 2, 49)
    },
    {
      input: new Item('Jam', 1, 7),
      expected: new Item('Jam', 0, 6)
    },
    {
      input: new Item('Spam', 1, 1),
      expected: new Item('Spam', 0, 0)
    },
  ])('decreases sellIn and quality by 1 before expiration | $input',
    ({input, expected}) => expectCorrectSingleUpdate(input, expected));

  test.each([
    {
      input: new Item('Milk', -2, 42),
      expected: new Item('Milk', -3, 40)
    },
    {
      input: new Item('Milk', 0, 50),
      expected: new Item('Milk', -1, 48)
    },
    {
      input: new Item('Milk', -11, 2),
      expected: new Item('Milk', -12, 0)
    },
  ])('decreases sellIn by 1 and quality by 2 after expiration | $input',
    ({input, expected}) => expectCorrectSingleUpdate(input, expected));

  test.each([
    {
      input: new Item('Milk', -2, 0),
      expected: new Item('Milk', -3, 0)
    },
    {
      input: new Item('Milk', 10, 0),
      expected: new Item('Milk', 9, 0)
    },
    {
      input: new Item('Milk', -11, 1),
      expected: new Item('Milk', -12, 0)
    },
  ])('The Quality of an item is never negative | $input',
    ({input, expected}) => expectCorrectSingleUpdate(input, expected));

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
      // FIXME this sucks
      input: new Item('Aged Brie', 10, 66),
      expected: new Item('Aged Brie', 9, 66)
    },
    {
      // FIXME this sucks
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

function expectCorrectSingleUpdate(input: Item, expected: Item) {
  const gildedRose = new GildedRose([input]);

  const [updatedItem] = gildedRose.updateQuality();

  expect(updatedItem).toEqual(expected);
}
