import DateExt from './date'
import ArrayExt from './array'
import StringExt from './string'

export const date = new DateExt()
export const array = new ArrayExt()
export const string = new StringExt()

export default function(...params: ('date'|'array'|'string')[]) {
    if (params.includes('date')) date.Active()
    if (params.includes('array')) array.Active()
    if (params.includes('string')) string.Active()
}
