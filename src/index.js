import xmlbuilder2 from "xmlbuilder2";
import fs from "fs";
import { buildSignatureNode } from "./nodes/signature.js";
import { getCompanyCertificate } from "./company-certificate.js";

const xml = fs.readFileSync("invoice.xml", "utf8");
const doc = xmlbuilder2.create(xml);

const companyCertificate = getCompanyCertificate();
const signatureTree = xmlbuilder2.create(buildSignatureNode(companyCertificate));
doc.root().import(signatureTree);

fs.writeFileSync("invoice-signed.xml", doc.end({ prettyPrint: true }));

console.log("✅ XML firmado con Xades EPES en invoice-signed.xml");