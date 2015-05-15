import difference from 'lodash/array/difference';

const SPECIAL_KEYS = ['constructor'];

export default function makeProxy(proxy) {
  let current = null;

  function createProxyMethod(key, descriptor, descKey) {
    if (typeof descriptor[descKey] === 'function') {
      descriptor[descKey] = function (firstArgument) {
        var storedDescriptor = Object.getOwnPropertyDescriptor(current, key);
        if (storedDescriptor) {
          if (typeof storedDescriptor[descKey] === 'function') {
            return storedDescriptor[descKey].apply(this, arguments);
          } else if (descKey === 'get') {
            return this[key];
          } else if (descKey === 'set') {
            this[key] = firstArgument;
          }
        }
      };
    }
  }

  function patchProperty(proto, key) {
    var descriptor = Object.getOwnPropertyDescriptor(current, key);

    if ((descriptor.get || descriptor.set || typeof descriptor.value === 'function') &&
      key !== 'type' &&
      key !== 'constructor') {

      createProxyMethod(key, descriptor, 'get');
      createProxyMethod(key, descriptor, 'set');
      createProxyMethod(key, descriptor, 'value');
    }

    Object.defineProperty(proto, key, descriptor);
  }

  return function proxyTo(fresh) {
    // Save current source of truth
    current = fresh;

    const freshKeys = Object.getOwnPropertyNames(fresh);
    const currentKeys = Object.getOwnPropertyNames(proxy);
    const addedKeys = difference(freshKeys, currentKeys, SPECIAL_KEYS);
    const removedKeys = difference(currentKeys, freshKeys, SPECIAL_KEYS);

    // Update proxy method list
    addedKeys.forEach(key => {
      patchProperty(proxy, key);
    });
    removedKeys.forEach(key => {
      delete proxy[key];
    });

    // The caller will use the proxy from now on
    return proxy;
  };
}