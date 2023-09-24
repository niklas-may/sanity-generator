"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inlineResolver1 = void 0;
// prettier-ignore
const inlineResolver1 = (name2) => ( /* groq */` "${name2}-wrapped": { "title": ${name2}.title, "subtitle": ${name2}.subtitle } `);
exports.inlineResolver1 = inlineResolver1;
