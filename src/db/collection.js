import { count, find, search } from 'arangosearch'

export class Collection {
  constructor(db, log, name) {
    this.db = db
    this.log = log.extend(name)
    this.collection = db.collection(name)

    // arangosearch methods
    this.count = count(db, this.collection)
    this.find = find(db, this.collection)
    this.search = search(db, this.collection)
  }

  async init() {
    if (!await this.collection.exists()) await this.collection.create()
  }

  async get(key) {
    return await this.collection.document(key)
  }
  async getMany(keys) {
    return await this.collection.documents(keys)
  }

  async insert(value, updateExisting) {
    const record = await this.collection.save(value,
      { overwriteMode: updateExisting && 'update' }
    )
    this.log.debug('Record inserted', { record })
    return record
  }
  async insertMany(values, updateExisting) {
    const records = await this.collection.saveAll(values,
      { overwriteMode: updateExisting && 'update' }
    )
    this.log.debug('Records inserted', records.map(r => r._key))
    return records
  }

  async update(value) {
    const record = await this.collection.save(value)
    this.log.debug('Record inserted', { record })
    return record
  }
  async updateMany(values) {
    const records = await this.collection.updateAll(values)
    this.log.debug('Records inserted', records.map(r => r._key))
    return records
  }

  async delete(key) {
    const record = await this.collection.remove(key)
    this.log.debug('Records deleted', { record })
    return record
  }
  async deleteMany(keys) {
    const records =  await this.collection.removeAll(keys)
    this.log.debug('Records deleted', records.map(r => r._key))
    return records
  }
}