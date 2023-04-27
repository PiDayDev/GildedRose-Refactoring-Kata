export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

abstract class UpdatableProduct {
  private item: Item

  constructor(item: Item) {
    this.item = item
  }

  abstract updateItem(): UpdatableProduct
}

class Standard extends UpdatableProduct {
  updateItem() {
    return this
  }
}

class Brie extends UpdatableProduct {
  updateItem() {
    return this
  }
}

class Pass extends UpdatableProduct {
  updateItem() {
    return this
  }
}

class Sulfuras extends UpdatableProduct {
  updateItem() {
    return this
  }
}

const createUpdatableProduct = (item: Item): UpdatableProduct => {
  switch (item.name) {
    case brieName:
      return new Brie(item)
    case passName:
      return new Pass(item)
    case sulfurasName:
      return new Sulfuras(item)
    default:
      return new Standard(item)
  }
};

const brieName = 'Aged Brie';
const passName = 'Backstage passes to a TAFKAL80ETC concert';
const sulfurasName = 'Sulfuras, Hand of Ragnaros';

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  updateQuality() {
    this.items.forEach(item => {
      const product = createUpdatableProduct(item)
      const isNeitherBrieNorPass = !(product instanceof Brie || product instanceof Pass)
      if (isNeitherBrieNorPass) {
        if (item.quality > 0) {
          if (item.name != sulfurasName) {
            item.quality = item.quality - 1
          }
        }
      } else {
        if (item.quality < 50) {
          item.quality = item.quality + 1
          if (item.name == passName) {
            if (item.sellIn < 11) {
              if (item.quality < 50) {
                item.quality = item.quality + 1
              }
            }
            if (item.sellIn < 6) {
              if (item.quality < 50) {
                item.quality = item.quality + 1
              }
            }
          }
        }
      }
      if (item.name != sulfurasName) {
        item.sellIn = item.sellIn - 1;
      }
      if (item.sellIn < 0) {
        if (item.name != brieName) {
          if (item.name != passName) {
            if (item.quality > 0) {
              if (item.name != sulfurasName) {
                item.quality = item.quality - 1
              }
            }
          } else {
            item.quality = item.quality - item.quality
          }
        } else {
          if (item.quality < 50) {
            item.quality = item.quality + 1
          }
        }
      }
    });

    return this.items;
  }
}
