import crypto from "crypto";
import { getContentFromCertificateKey } from "../company-certificate.js";

function buildRsaKeyValueNode(companyCertificate) {
	const certificateKey = crypto.createPublicKey(companyCertificate.certificateKey);
	const keyDetails = certificateKey.export({
		type: 'pkcs1',
		format: 'der'
	});
	// Los primeros bytes contienen información de la estructura ASN.1
	// El módulo comienza después de estos bytes
	const modulus = keyDetails.subarray(9);
	const exponent = Buffer.from([1, 0, 1]); // El exponente público estándar es 65537 (0x010001)
	return {
		"ds:RSAKeyValue": {
			"ds:Modulus": modulus.toString('base64'),
			"ds:Exponent": exponent.toString('base64')
		}
	};
}

export function buildSignatureKeyInfoNode(companyCertificate) {
	return {
		"ds:KeyInfo": {
			"ds:X509Data": {
				"ds:X509Certificate": getContentFromCertificateKey(
					companyCertificate.certificateKey
				),
			},
			"ds:KeyValue": {
				...buildRsaKeyValueNode(companyCertificate),
			},
		},
	};
}
