import crypto from "crypto";
import { SHA_256_STANDARD_URL } from "../constants.js";
import { getContentFromCertificateKey } from "../company-certificate.js";

export function buildSignatureCompanyCertificateNode(companyCertificate) {
	const certDigest = crypto
		.createHash("sha256")
		.update(Buffer.from(getContentFromCertificateKey(companyCertificate.certificateKey), "base64"))
		.digest("base64");
	const serialHex = companyCertificate.serial.replace(/^serial=/, "").trim();
	const certSerialNumber = BigInt("0x" + serialHex).toString();
	const certIssuerName = companyCertificate.issuer.replace(/^issuer=/, "").trim();
	return {
		"xades:Cert": {
			"xades:CertDigest": {
				"ds:DigestMethod": {
					"@Algorithm": SHA_256_STANDARD_URL,
				},
				"ds:DigestValue": certDigest,
			},
			"xades:IssuerSerial": {
				"ds:X509IssuerName": certIssuerName,
				"ds:X509SerialNumber": certSerialNumber,
			},
		},
	};
}
