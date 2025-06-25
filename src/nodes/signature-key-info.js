import crypto from "crypto";

function buildRsaKeyValueNode(companyCertificate) {
	const publicKey = crypto.createPublicKey(companyCertificate.publicKey);
	const keyDetails = publicKey.export({
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
				"ds:X509Certificate": companyCertificate.publicKey
					.split("-----BEGIN CERTIFICATE-----")[1]
					.split("-----END CERTIFICATE-----")[0]
					.replace(/\s+/g, ""),
			},
			"ds:KeyValue": {
				...buildRsaKeyValueNode(companyCertificate),
			},
		},
	};
}
