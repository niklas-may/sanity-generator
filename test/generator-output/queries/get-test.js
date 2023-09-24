"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTest = void 0;
const resolver_1 = require("../resolver");
// prettier-ignore
exports.getTest = `
*[_id == "0cccfcd0-c69d-4832-9929-63ff2c6e2b58"] { ..., ${(0, resolver_1.inlineResolver0)("primitiveFactory")}, ${(0, resolver_1.specialNumber)("customPrimitive")}, ${(0, resolver_1.localeString)("customComplex")}, ${(0, resolver_1.inlineResolver1)("complexFactory")}, arrayMultipleTypes[] { ..., _type == "customComplex" => { ${(0, resolver_1.localeString)("customComplex")} }, _type == "complexFactory" => { ${(0, resolver_1.inlineResolver1)("complexFactory")} } }, arraySlingleType[] { ..., ${(0, resolver_1.specialNumber)("customPrimitive")} }, arraySlingleComplextType[] { ..., ${(0, resolver_1.localeString)("customComplex")} }, object { ..., ${(0, resolver_1.specialNumber)("customPrimitive")}, ${(0, resolver_1.localeString)("customComplex")}, ${(0, resolver_1.inlineResolver0)("primitiveFactory")}, ${(0, resolver_1.inlineResolver1)("complexFactory")} } }[0] `;
