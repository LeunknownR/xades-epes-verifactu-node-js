import crypto from "crypto";
import { buildSignedInfoNode } from "./signed-info.js";
import { buildSignedPropertiesNode } from "./signed-properties.js";
import { buildSignatureValueNode } from "./signature-value.js";
import { buildSignatureKeyInfoNode } from "./signature-key-info.js";
import { XML_SIGNATURE_STANDARD_URL, XADES_STANDARD_URL } from "../constants.js";

function buildSignatureId() {
	return `xmldsig-${crypto.randomUUID()}`;
}

export function buildSignatureNode(companyCertificate) {
	const signatureId = buildSignatureId();
	const signedPropertiesObj = buildSignedPropertiesNode({ signatureId, companyCertificate });
	const signedInfoObj = buildSignedInfoNode({
		signatureId,
		signedPropertiesObj,
		companyCertificate,
	});
	return {
		"ds:Signature": {
			"@xmlns:ds": XML_SIGNATURE_STANDARD_URL,
			"@Id": signatureId,
			...signedInfoObj,
			...buildSignatureValueNode({ signatureId, signedInfoObj, companyCertificate }),
			...buildSignatureKeyInfoNode(companyCertificate),
			"ds:Object": {
				"xades:QualifyingProperties": {
					"@xmlns:xades": XADES_STANDARD_URL,
					"@Target": `#${signatureId}`,
					...signedPropertiesObj,
				},
			},
		},
	};
}
