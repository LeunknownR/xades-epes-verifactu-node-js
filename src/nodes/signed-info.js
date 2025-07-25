import xmlbuilder2 from "xmlbuilder2";
import crypto from "crypto";
import fs from "fs";
import { canonicalizeXml } from "../canonicalize.js";
import {
	CANONICALIZATION_METHOD_STANDARD_URL,
	SHA_256_STANDARD_URL,
	SHA_256_STANDARD_XML_SIG_URL,
	XADES_STANDARD_URL,
	XML_SIGNATURE_STANDARD_ENVELOPED_SIGNATURE_URL,
	XML_SIGNATURE_STANDARD_URL,
} from "../constants.js";

export function buildXmlDigest() {
	const xml = fs.readFileSync("invoice.xml", "utf8");
	const xmlObject = xmlbuilder2.convert(xml, { format: "object" });
	fs.writeFileSync(
		"tmp-invoice.xml",
		xmlbuilder2.create(xmlObject).end({ prettyPrint: false })
	);
	const canonicalizedXml = canonicalizeXml("tmp-invoice.xml");
	fs.unlinkSync("tmp-invoice.xml");
	return crypto.createHash("sha256").update(canonicalizedXml).digest("hex");
}
export function buildSignedPropertiesDigest({
	signedPropertiesObj,
	companyCertificate,
}) {
	const signedPropertiesXML = xmlbuilder2
		.create({
			"xades:SignedProperties": {
				...signedPropertiesObj["xades:SignedProperties"],
				"@xmlns:ds": XML_SIGNATURE_STANDARD_URL,
				"@xmlns:xades": XADES_STANDARD_URL,
			},
		})
		.end({
			prettyPrint: false,
		});
	fs.writeFileSync("signed-properties.xml", signedPropertiesXML);
	const canonicalizedXml = canonicalizeXml("signed-properties.xml");
	fs.unlinkSync("signed-properties.xml");
	return crypto
		.createSign("sha256")
		.update(canonicalizedXml)
		.end()
		.sign(companyCertificate.privateKey, "base64");
}

export function buildSignedInfoNode({
	signatureId,
	signedPropertiesObj,
	companyCertificate,
}) {
	return {
		"ds:SignedInfo": {
			"ds:CanonicalizationMethod": {
				"@Algorithm": CANONICALIZATION_METHOD_STANDARD_URL,
			},
			"ds:SignatureMethod": {
				"@Algorithm": SHA_256_STANDARD_XML_SIG_URL,
			},
			"ds:Reference": [
				{
					"@URI": "",
					"@Id": `${signatureId}-ref`,
					"ds:Transforms": {
						"ds:Transform": {
							"@Algorithm":
								XML_SIGNATURE_STANDARD_ENVELOPED_SIGNATURE_URL,
						},
					},
					"ds:DigestMethod": {
						"@Algorithm": SHA_256_STANDARD_URL,
					},
					"ds:DigestValue": buildXmlDigest(companyCertificate),
				},
				{
					"@Type": "http://uri.etsi.org/01903#SignedProperties",
					"@URI": `#xmldsig-${signatureId}-signedprops`,
					"ds:DigestMethod": {
						"@Algorithm": SHA_256_STANDARD_URL,
					},
					"ds:DigestValue": buildSignedPropertiesDigest({
						signedPropertiesObj,
						companyCertificate,
					}),
				},
			],
		},
	};
}
