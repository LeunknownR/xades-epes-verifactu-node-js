import { buildSignaturePolicyIdentifierNode } from "./signature-policy-identifier.js";
import { buildSignatureCompanyCertificateNode } from "./signature-company-certificate.js";

export function buildSigningTime() {
	return {
		"xades:SigningTime":
			new Date()
				.toLocaleString("sv", { timeZone: "Europe/Madrid" })
				.replace(" ", "T") + "+02:00",
	};
}

export function buildSignedPropertiesNode({ signatureId, companyCertificate }) {
	return {
		"xades:SignedProperties": {
			"@Id": `${signatureId}-signedprops`,
			"xades:SignedSignatureProperties": {
				...buildSigningTime(),
				"xades:SigningCertificate": {
					...buildSignatureCompanyCertificateNode(companyCertificate)
				},
				...buildSignaturePolicyIdentifierNode(),
			},
		},
	};
}
