import xmlbuilder2 from "xmlbuilder2";
import crypto from "crypto";
import fs from "fs";
import { canonicalizeXml } from "../canonicalize.js";
import { CANONICALIZATION_METHOD_STANDARD_URL, SHA_256_STANDARD_URL, XADES_STANDARD_URL, XML_SIGNATURE_STANDARD_ENVELOPED_SIGNATURE_URL, XML_SIGNATURE_STANDARD_URL } from "../constants.js";

export function buildXmlDigest(companyCertificate) {
	const canonicalizedXml = canonicalizeXml("invoice.xml");
	const signer = crypto.createSign('sha256');
	signer.update(canonicalizedXml);
	signer.end();
	const digest = signer.sign(companyCertificate.privateKey, "base64");
	return digest;
}
export function buildSignedPropertiesDigest({ signedPropertiesObj, companyCertificate }) {
	const signedPropertiesXML = xmlbuilder2.create({
		"xades:SignedProperties": {
			...signedPropertiesObj["xades:SignedProperties"],
			"@xmlns:ds": XML_SIGNATURE_STANDARD_URL,
			"@xmlns:xades": XADES_STANDARD_URL,
		},
	}).end({
		prettyPrint: false,
	});
	fs.writeFileSync("signed-properties.xml", signedPropertiesXML);
	const canonicalizedXml = canonicalizeXml("signed-properties.xml");
	fs.unlinkSync("signed-properties.xml");
	const signer = crypto.createSign('sha256');
	signer.update(canonicalizedXml);
	signer.end();
	const digest = signer.sign(companyCertificate.privateKey, "base64");
	return digest;
}

export function buildSignedInfoNode({ signatureId, signedPropertiesObj, companyCertificate }) {
	return {
		"ds:SignedInfo": {
			"ds:CanonicalizationMethod": {
				"@Algorithm": CANONICALIZATION_METHOD_STANDARD_URL,
			},
			"ds:SignatureMethod": {
				"@Algorithm":
					"http://www.w3.org/2001/04/xmldsig-more#rsa-sha256",
			},
			"ds:Reference": [
				{
					"@URI": "",
					"@Id": `${signatureId}-ref`,
					"ds:Transforms": {
						"ds:Transform": {
							"@Algorithm": XML_SIGNATURE_STANDARD_ENVELOPED_SIGNATURE_URL,
						},
					},
					"ds:DigestMethod": {
						"@Algorithm": SHA_256_STANDARD_URL,
					},
					"ds:DigestValue": buildXmlDigest(companyCertificate),
				},
				{
					"@Type": "http://uri.etsi.org/01903#SignedProperties",
					"@URI": "#xmldsig-cd137bee-ae4d-4c1b-bbdf-4a5291c0b38f-signedprops",
					"ds:DigestMethod": {
						"@Algorithm": SHA_256_STANDARD_URL,
					},
					"ds:DigestValue":
						buildSignedPropertiesDigest({ signedPropertiesObj, companyCertificate }),
				},
			],
		},
	};
}
