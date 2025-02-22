const hasOwn = Object.prototype.hasOwnProperty;

/**
 * Appends the entries of an object to a `URLSearchParams` instance.
 *
 * For example, `{foo: 5}` will result in adding `foo=5` to the query.
 *
 * @param {URLSearchParams} query Query to append values to
 * @param {object} obj Object to retrieve values from
 * @param {string=} prefix Optional prefix for keys
 * @return {void}
 */
function appendValuesToQuery(
  query: URLSearchParams,
  obj: object,
  prefix?: string
): void {
  for (const key in obj) {
    if (!hasOwn.call(obj, key)) {
      continue;
    }

    const encodedKey = prefix ? `${prefix}[${key.toString()}]` : key.toString();
    const value = (obj as Record<PropertyKey, unknown>)[key];

    if (typeof value === 'object' && value !== null) {
      appendValuesToQuery(query, value, encodedKey);
    } else {
      query.set(encodedKey, String(value));
    }
  }
}

/**
 * Stringify an object for use in a query string.
 *
 * @param {object} obj Object to stringify
 * @return {string}
 */
export function stringify(obj: object): string {
  return create(obj).toString();
}

/**
 * Creates a URLSearchParams for a given object, taking nested keys
 * into account
 *
 * @param {object} obj Object to retrieve keys from
 * @return {URLSearchParams}
 */
export function create(obj: object): URLSearchParams {
  const params = new URLSearchParams();
  appendValuesToQuery(params, obj);
  return params;
}
