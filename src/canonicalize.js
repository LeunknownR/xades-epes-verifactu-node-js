import child_process from "child_process";

export function canonicalizeXml(xmlFileName) {
	return child_process
		.execSync(`xmllint ${xmlFileName} --c14n`)
		.toString()
		.replace(/>\s+</g, "><")
		.replace(/\n/g, "");
}