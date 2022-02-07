function isCorrectType(name, value, type) {
  if (type === 'array') {
    if (!Array.isArray(value)) {
      throw new TypeError(`${name} must be a array`);
    }
  } else if (typeof value !== type) {
    throw new TypeError(`${name} must be a ${type}`);
  }
}

exports.isCorrectType = isCorrectType;
