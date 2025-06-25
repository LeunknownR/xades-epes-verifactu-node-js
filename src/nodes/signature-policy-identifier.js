import {
	SHA_256_STANDARD_URL,
	SIGNATURE_POLICY_HASH,
	SIGNATURE_POLICY_ID,
	SIGNATURE_POLICY_URL,
} from "../constants.js";

export function buildSignaturePolicyIdentifierNode() {
	return {
		"xades:SignaturePolicyIdentifier": {
			"xades:SignaturePolicyId": {
				"xades:SigPolicyId": {
					"xades:Identifier": SIGNATURE_POLICY_ID,
				},
				"xades:SigPolicyHash": {
					"ds:DigestMethod": {
						"@Algorithm": SHA_256_STANDARD_URL,
					},
					"ds:DigestValue": SIGNATURE_POLICY_HASH,
				},
				"xades:SigPolicyQualifiers": {
					"xades:SigPolicyQualifier": {
						"xades:SPURI": SIGNATURE_POLICY_URL,
					},
				},
			},
		},
	};
}
