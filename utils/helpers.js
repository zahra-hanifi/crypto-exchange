export function insertComma(number) {
  if (number === 0) {
    return 0
  }
  if (!number) return ''
  const sign =
    number.toString()[0] === '-' || number.toString()[0] === '+'
      ? number.toString()[0]
      : ''
  const values =
    sign !== ''
      ? number
          .toString()
          .substring(1)
          .split('.')
      : number.toString().split('.')
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
  let percentage = changePercentage
  if (changePercentage.toString().includes('-')) {
    percentage = Number(changePercentage.toString().slice(1))
  }

  if (changePercentage.toFixed(2) > 0) {
    return {
      color: 'text-green-500',
      value: `+${percentage.toFixed(2)}%`
    }
  } else if (changePercentage.toFixed(2) < 0) {
    return {
      color: 'text-red-500',
      value: `-${percentage.toFixed(2)}%`
    }
  } else {
    return {
      color: 'text-gray-500',
      value: `${percentage.toFixed(2)}%`
    }
  }
}

export function debounce(fn, delay = 500) {
  let timer
  return function(...args) {
    const context = this
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(context, args), delay)
  }
}
