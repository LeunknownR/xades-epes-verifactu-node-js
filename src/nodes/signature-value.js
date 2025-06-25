import fs from "fs";
import crypto from "crypto";
import xmlbuilder2 from "xmlbuilder2";
import { canonicalizeXml } from "../canonicalize.js";
import { XML_SIGNATURE_STANDARD_URL } from "../constants.js";

function buildSignatureValue({
	signedInfoObj,
	companyCertificate,
}) {
	const signedInfoXml = xmlbuilder2
		.create({
			"ds:SignedInfo": {
				"@xmlns:ds": XML_SIGNATURE_STANDARD_URL,
				...signedInfoObj["ds:SignedInfo"],
			},
		})
		.end({
			prettyPrint: false,
		});
	fs.writeFileSync("signed-info.xml", signedInfoXml);
	const canonicalizedXml = canonicalizeXml("signed-info.xml");
	fs.unlinkSync("signed-info.xml");
	const signer = crypto.createSign('sha256');
	signer.update(canonicalizedXml);
	signer.end();
	const signatureValue = signer.sign(companyCertificate.privateKey, "base64");
	return signatureValue;
}

export function buildSignatureValueNode({ signatureId, signedInfoObj, companyCertificate }) {
	const signatureValue = buildSignatureValue({
		signedInfoObj,
		companyCertificate,
	});
	return {
		"ds:SignatureValue": {
			"@Id": `${signatureId}-sigvalue`,
			"#text": signatureValue,
		},
	};
}