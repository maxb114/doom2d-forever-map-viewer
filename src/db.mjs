class Database {
  constructor (/** @type {IDBDatabase} */ db) {
    this.db = db
    // this.supported = false
  }

  #addItem (/** @type {IDBTransaction} */ transaction, /** @type {String} */ name, /** @type {any} */ value, /** @type {IDBValidKey} */ key) {
    return new Promise((resolve, reject) => {
      const objectStore = transaction.objectStore(name)
      const request = objectStore.put(value, key)

      request.onsuccess = () => resolve(true)

      request.onerror = () => reject(Error('Transaction error!'))
    })
  }

  #getItem (/** @type {IDBTransaction} */ transaction, /** @type {String} */ name, /** @type {IDBValidKey} */ key) {
    return new Promise((resolve, reject) => {
      const objectStore = transaction.objectStore(name)
      const request = objectStore.get(key)

      request.onsuccess = () => resolve(request.result)

      request.onerror = () => reject(Error('Transaction error!'))
    })
  }

  loadByPath (/** @type {IDBValidKey} */ path) {
    const name = 'store'
    const transaction = this.db.transaction(name, 'readonly')
    const /** @type {Promise<any>} */ promise = new Promise((resolve, reject) => {
      this.#getItem(transaction, name, path).then((value) => {
        resolve(value)
      }).catch((error) => reject(error))
    })
    return promise
  }

  saveByPath (/** @type {any} */ value, /** @type {IDBValidKey} */ path) {
    const name = 'store'
    const transaction = this.db.transaction(name, 'readwrite')
    const /** @type {Promise<any>} */ promise = new Promise((resolve, reject) => {
      this.#addItem(transaction, name, value, path).then(() => resolve(true))
        .catch((error) => reject(error))
    })
    return promise
  }
}

function /** @type {Promise<IDBDatabase>} */ openDB () {
  const /** @type {Promise<IDBDatabase>} */ promise = new Promise((resolve, reject) => {
    if (window.indexedDB === undefined) reject(Error('IndexedDB is not supported!'))
    const openRequest = window.indexedDB.open('store', 1)

    openRequest.onupgradeneeded = function () {
      const db = openRequest.result
      db.createObjectStore('store')
    }

    openRequest.onblocked = () => reject(openRequest.error)

    openRequest.onerror = () => reject(openRequest.error)

    openRequest.onsuccess = function () { // continue working
      const db = openRequest.result

      db.onversionchange = function () {
        db.close()
        window.alert('Please reload the page.')
      }

      resolve(db)
    }
  })
  return promise
}

function /** @type {Promise<Database>} */ DatabaseFrom () {
  const /** @type {Promise<Database>} */ promise = new Promise((resolve, reject) => {
    openDB().then((db) => {
      const instance = new Database(db)
      resolve(instance)
    }).catch((error) => {
      reject(error)
    })
  })
  return promise
}

export { Database, DatabaseFrom }
