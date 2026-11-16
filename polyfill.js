/* Fills in newer browser features pdf.js expects, so older iOS Safari versions work. */
(function () {
  'use strict';
  try {
    if (typeof ReadableStream !== 'undefined' && !ReadableStream.prototype[Symbol.asyncIterator]) {
      ReadableStream.prototype.values = function (opts) {
        const reader = this.getReader(); const prevent = opts && opts.preventCancel;
        return {
          next() { return reader.read().then((r) => { if (r.done) reader.releaseLock(); return r; }); },
          return(v) { if (prevent) { reader.releaseLock(); return Promise.resolve({ done: true, value: v }); } const p = reader.cancel(v); reader.releaseLock(); return p.then(() => ({ done: true, value: v })); },
          [Symbol.asyncIterator]() { return this; }
        };
      };
      ReadableStream.prototype[Symbol.asyncIterator] = ReadableStream.prototype.values;
    }
    if (!Promise.withResolvers) Promise.withResolvers = function () { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };
    if (!Array.fromAsync) Array.fromAsync = async function (it, fn) { const out = []; let i = 0; for await (const v of it) out.push(fn ? await fn(v, i++) : v); return out; };
    for (const C of [Map, WeakMap]) {
      if (!C.prototype.getOrInsert) C.prototype.getOrInsert = function (k, v) { if (!this.has(k)) this.set(k, v); return this.get(k); };
      if (!C.prototype.getOrInsertComputed) C.prototype.getOrInsertComputed = function (k, f) { if (!this.has(k)) this.set(k, f(k)); return this.get(k); };
    }
    if (!Uint8Array.prototype.toHex) Uint8Array.prototype.toHex = function () { let s = ''; for (const b of this) s += b.toString(16).padStart(2, '0'); return s; };
    if (!Uint8Array.fromHex) Uint8Array.fromHex = function (h) { const o = new Uint8Array(h.length / 2); for (let i = 0; i < o.length; i++) o[i] = parseInt(h.substr(i * 2, 2), 16); return o; };
    if (!Uint8Array.prototype.toBase64) Uint8Array.prototype.toBase64 = function () { let s = ''; for (const b of this) s += String.fromCharCode(b); return btoa(s); };
    if (!Uint8Array.fromBase64) Uint8Array.fromBase64 = function (b) { const s = atob(b); const o = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) o[i] = s.charCodeAt(i); return o; };
    if (typeof URL !== 'undefined' && !URL.parse) URL.parse = function (u, b) { try { return new URL(u, b); } catch (e) { return null; } };
    if (!Object.groupBy) Object.groupBy = function (it, f) { const o = Object.create(null); let i = 0; for (const v of it) { const k = f(v, i++); (o[k] || (o[k] = [])).push(v); } return o; };
    if (!Map.groupBy) Map.groupBy = function (it, f) { const m = new Map(); let i = 0; for (const v of it) { const k = f(v, i++); if (!m.has(k)) m.set(k, []); m.get(k).push(v); } return m; };
    if (!Math.sumPrecise) Math.sumPrecise = function (it) { let s = 0; for (const v of it) s += v; return s; };
    if (!Array.prototype.at) Array.prototype.at = function (i) { i = Math.trunc(i) || 0; if (i < 0) i += this.length; return this[i]; };
    if (!Array.prototype.findLast) Array.prototype.findLast = function (f) { for (let i = this.length - 1; i >= 0; i--) if (f(this[i], i, this)) return this[i]; };
    if (!Array.prototype.toSorted) Array.prototype.toSorted = function (f) { return this.slice().sort(f); };
    if (!String.prototype.replaceAll) String.prototype.replaceAll = function (a, b) { return a instanceof RegExp ? this.replace(a, b) : this.split(a).join(b); };
  } catch (e) { /* ignore */ }
})();
