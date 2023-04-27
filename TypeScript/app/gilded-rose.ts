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

abstract class UpdatableProduct extends Item {
  constructor(name, sellIn, quality) {
    super(name, sellIn, quality)
  }

  abstract updateItem(): UpdatableProduct
}

class Standard extends UpdatableProduct {
  updateItem() {
    return new Standard(this.name, this.sellIn - 1, this.quality - 1)
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

const createUpdatableProduct = ({name, sellIn, quality}: Item): UpdatableProduct => {
  switch (name) {
    case brieName:
      return new Brie(name, sellIn, quality)
    case passName:
      return new Pass(name, sellIn, quality)
    case sulfurasName:
      return new Sulfuras(name, sellIn, quality)
    default:
      return new Standard(name, sellIn, quality)
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
            item.quality = product.updateItem().quality
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
