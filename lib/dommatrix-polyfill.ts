/**
 * Minimal DOMMatrix polyfill for Node.js 18 serverless environments.
 * pdfjs-dist (used by pdf-parse) accesses DOMMatrix during module initialisation,
 * which fails on Node.js < 19 where this browser API is absent.
 *
 * Node.js 20+ has DOMMatrix natively, so this is a safety-net for older runtimes.
 */
export function polyfillDOMMatrix(): void {
  if (typeof globalThis.DOMMatrix !== 'undefined') return

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g = globalThis as any

  g.DOMMatrix = class {
    a = 1; b = 0; c = 0; d = 1; e = 0; f = 0
    m11 = 1; m12 = 0; m13 = 0; m14 = 0
    m21 = 0; m22 = 1; m23 = 0; m24 = 0
    m31 = 0; m32 = 0; m33 = 1; m34 = 0
    m41 = 0; m42 = 0; m43 = 0; m44 = 1
    is2D = true; isIdentity = true

    constructor(init?: number[] | string) {
      if (Array.isArray(init) && init.length === 6) {
        [this.a, this.b, this.c, this.d, this.e, this.f] = init
        this.m11 = this.a; this.m12 = this.b
        this.m21 = this.c; this.m22 = this.d
        this.m41 = this.e; this.m42 = this.f
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    multiply(o: any) {
      return new g.DOMMatrix([
        this.a * o.a + this.c * o.b, this.b * o.a + this.d * o.b,
        this.a * o.c + this.c * o.d, this.b * o.c + this.d * o.d,
        this.a * o.e + this.c * o.f + this.e, this.b * o.e + this.d * o.f + this.f,
      ])
    }
    translate(tx = 0, ty = 0) { return this.multiply(new g.DOMMatrix([1, 0, 0, 1, tx, ty])) }
    scale(sx = 1, sy = sx)    { return this.multiply(new g.DOMMatrix([sx, 0, 0, sy, 0, 0])) }
    inverse()                  { return new g.DOMMatrix() }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transformPoint(p: any)     { return { x: this.a * p.x + this.c * p.y + this.e, y: this.b * p.x + this.d * p.y + this.f } }
    toFloat32Array()           { return new Float32Array([this.a, this.b, this.c, this.d, this.e, this.f]) }
    toFloat64Array()           { return new Float64Array([this.a, this.b, this.c, this.d, this.e, this.f]) }
    toString()                 { return `matrix(${this.a},${this.b},${this.c},${this.d},${this.e},${this.f})` }
  }
}
