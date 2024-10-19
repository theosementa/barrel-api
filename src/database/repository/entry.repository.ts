import { AppDataSource } from "../datasource";
import { Entry } from "../entity/entry.entity";

export const EntryRepository = AppDataSource.getRepository(Entry).extend({
  createNewEntry({ mileage, price, liter, date }, car) {
    const mileageParsed = mileage ? parseInt(mileage) : 0;
    const priceParsed = price ? parseFloat(price) : 0;
    const literParsed = liter ? parseFloat(liter) : 0;

    if (!mileageParsed && !priceParsed && !literParsed) return null;

    const newEntry = new Entry();
    newEntry.mileage = mileageParsed || null;
    newEntry.price = priceParsed || null;
    newEntry.liter = literParsed || null;
    newEntry.date = new Date(date);
    newEntry.car = car;

    car.entries.push(newEntry);
    return newEntry;
  },
});
