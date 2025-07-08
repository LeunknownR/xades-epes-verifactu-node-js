import fs from "fs";
import child_process from "child_process";

export function getContentFromCertificate(delimiters, key) {
	return key
		.split(delimiters.start)[1]
		.split(delimiters.end)[0]
		.replace(/(\r\n|\n|\r|\s)/gm, "");
}
export function getContentFromCertificateKey(certificateKey) {
	return getContentFromCertificate(
		{
			start: "-----BEGIN CERTIFICATE-----",
			end: "-----END CERTIFICATE-----",
		},
		certificateKey
	);
}
export function getContentFromPrivateKey(privateKey) {
	return getContentFromCertificate(
		{
			start: "-----BEGIN PRIVATE KEY-----",
			end: "-----END PRIVATE KEY-----",
		},
		privateKey
	);
}
export function getCompanyCertificate() {
	const certificateKey = fs
		.readFileSync("certs/certificate_key.crt")
		.toString();
	const privateKey = fs.readFileSync("certs/private_key.key").toString();
	const serial = child_process
		.execSync(`openssl x509 -in certs/certificate_key.crt -serial -noout`)
		.toString();
	const issuer = child_process
		.execSync(`openssl x509 -in certs/certificate_key.crt -issuer -noout`)
		.toString();
	return { certificateKey, privateKey, serial, issuer };
}
