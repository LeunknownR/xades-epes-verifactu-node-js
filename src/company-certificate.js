import fs from "fs";
import child_process from "child_process";

export function getCompanyCertificate() {
	const publicKey = fs.readFileSync("certs/public_cert.crt").toString();
	const privateKey = fs.readFileSync("certs/private_key.key").toString();
	const serial = child_process
		.execSync(`openssl x509 -in certs/public_cert.crt -serial -noout`)
		.toString();
	const DER = child_process.execSync(
		`openssl x509 -in certs/public_cert.crt -outform DER`
	);
	const issuer = child_process
		.execSync(`openssl x509 -in certs/public_cert.crt -issuer -noout`)
		.toString();
	return { publicKey, privateKey, serial, DER, issuer };
}
