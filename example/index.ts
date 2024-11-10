import { Runtime } from '@sinclair/parsebox'

// ------------------------------------------------------------------
// Const
// ------------------------------------------------------------------
const Const = Runtime.String(['\'', '"'], value => Runtime.Const(value))

// ------------------------------------------------------------------
// Reference
// ------------------------------------------------------------------
const Reference = Runtime.Ident(value => Runtime.Ref(value))

// ------------------------------------------------------------------
// Elements
// ------------------------------------------------------------------
const Base = Runtime.Union([
  Runtime.Ref('Const'),
  Runtime.Ref('Reference')
])

// ------------------------------------------------------------------
// Elements
// ------------------------------------------------------------------
const Elements = Runtime.Union([
  Runtime.Tuple([Runtime.Ref('Base'), Runtime.Const(','), Runtime.Ref<Runtime.IParser[]>('Elements')]),
  Runtime.Tuple([Runtime.Ref('Base')]),
  Runtime.Tuple([])
], value => {
  return (
    value.length === 3 ? [value[0], ...value[2]] :
    value.length === 1 ? [value[0]] :
    []
  )
})

// ------------------------------------------------------------------
// Tuple
// ------------------------------------------------------------------
const Tuple = Runtime.Union([
  Runtime.Tuple([Runtime.Const('['), Runtime.Ref<Runtime.IParser[]>('Elements'), Runtime.Const(']')]),
  Runtime.Tuple([Runtime.Const('['), Runtime.Const(']')]),
], value => {
  return value.length === 3 
    ? Runtime.Tuple(value[1])
    : Runtime.Tuple([])
})

// ------------------------------------------------------------------
// Variants
// ------------------------------------------------------------------
const Variant = Runtime.Union([
  Runtime.Ref('Tuple'),
  Runtime.Ref('Base')
])

const Variants = Runtime.Union([
  Runtime.Tuple([Runtime.Ref('Variant'), Runtime.Const('|'), Runtime.Ref<Runtime.IParser[]>('Variants')]),
  Runtime.Tuple([Runtime.Ref('Variant')]),
  Runtime.Tuple([])
], value => {
  return (
    value.length === 3 ? [value[0], ...value[2]] :
    value.length === 1 ? [value[0]] :
    []
  )
})

// ------------------------------------------------------------------
// Union
// ------------------------------------------------------------------
const Union = Runtime.Union([
  Runtime.Ref<Runtime.IParser[]>('Variants')
], value => Runtime.Union(value))

// ------------------------------------------------------------------
// Match
// ------------------------------------------------------------------
const Match = Runtime.Union([
  Runtime.Ref('Union'),
  Runtime.Ref('Tuple')
])

const Syntax = Runtime.Tuple([
  Runtime.Const('syntax'),
  Runtime.Ident(),
  Runtime.Const('='),
  Runtime.Ref('Match')
])

const Module = new Runtime.Module({
  Base,
  Reference,
  Const,
  Elements,
  Tuple,
  Variant,
  Variants,
  Union,
  Match,
  Syntax,
})

const R = Module.Parse('Syntax', `syntax A = ['A', A | B] | [] = (value) => {
  
}`)

console.dir(JSON.parse(JSON.stringify(R)), { depth: 100 })