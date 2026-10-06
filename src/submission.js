export function auditPayload(values, {reference, language, packageInterest = ''}) {
  const payload = { ...values, enquiry_reference:reference, language, package_interest:packageInterest, subject:'HYS audit '+reference };
  delete payload.redirectTo;
  return payload;
}
export async function sendAudit(endpoint, payload, {transport = fetch, timeout = 20000} = {}) {
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), timeout);
  try {
    const response = await transport(endpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(payload),signal:abort.signal});
    const data = await response.json();
    if (!response.ok || data.success !== true) throw new Error('Submission not confirmed');
    return data;
  } finally { clearTimeout(timer); }
}
