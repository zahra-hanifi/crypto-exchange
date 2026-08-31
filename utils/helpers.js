export function insertComma(number) {
  if (number === 0) {
    return 0
  }
  if (!number) return ''

  const asString =
    typeof number === 'number' && Math.abs(number) < 1e-6
      ? number.toFixed(20).replace(/0+$/, '')
      : number.toString()

  const sign = asString[0] === '-' || asString[0] === '+' ? asString[0] : ''
  const values =
    sign !== '' ? asString.substring(1).split('.') : asString.split('.')
  return sign !== ''
    ? sign +
        values[0].replace(/.(?=(?:.{3})+$)/g, '$&,') +
        (values.length === 2 ? '.' + values[1] : '')
    : values[0].replace(/.(?=(?:.{3})+$)/g, '$&,') +
        (values.length === 2 ? '.' + values[1] : '')
}

export function capitalizeFirstLetter(value) {
  if (!value) return value
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export function getCoinChangeData(changePercentage) {
  const change = Number(changePercentage)

  if (changePercentage === null || !isFinite(change)) {
    return {
      color: 'gray',
      value: '—'
    }
  }

  const rounded = Number(change.toFixed(2))
  const value = `${Math.abs(change).toFixed(2)}%`

  if (rounded > 0) {
    return {
      color: 'green',
      value: `+${value}`
    }
  } else if (rounded < 0) {
    return {
      color: 'red',
      value: `-${value}`
    }
  } else {
    return {
      color: 'gray',
      value
    }
  }
}

export function debounce(fn, delay = 500) {
  let timer

  function debounced(...args) {
    const context = this
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(context, args), delay)
  }

  debounced.cancel = () => clearTimeout(timer)

  return debounced
}
