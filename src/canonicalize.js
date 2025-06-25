import child_process from "child_process";

export function canonicalizeXml(xmlFile) {
	return child_process
		.execSync(`xmllint ${xmlFile} --c14n`)
		.toString()
		.replace(/\n/g, "")
		.replace(/\s+/g, "");
}