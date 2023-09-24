"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localeString = void 0;
// prettier-ignore
const localeString = (name) => ( /* groq */` "${name}": coalesce(${name}[$lang], ${name}.en) `);
exports.localeString = localeString;
