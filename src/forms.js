import { referralSource } from './referrals.js';
import { auditPayload, sendAudit } from './submission.js';
// Functional events only: no identifiers, URLs, email, or form contents enter analytics.
export function signal(name, context = {}) {
  const detail = { event: name, language: document.documentElement.lang, page: location.pathname, referral_source: referralSource(document.referrer,location.origin), ...context };
  window.dispatchEvent(new CustomEvent('hys:conversion', { detail }));
  // A consent-managed analytics adapter can subscribe to hys:conversion.
}
export function initForms() {
  const form = document.getElementById('audit-form');
  document.querySelectorAll('a[href]').forEach(link => link.addEventListener('click', () => {
    if (link.hash === '#audit') {
      const card = link.closest('.pricing-card');
      const name = card?.querySelector('h3')?.textContent;
      if (form && name) form.dataset.package = name;
      signal('audit_cta_click');
    }
    if (link.hostname === 'tidycal.com') signal('booking_click');
  }));
  if (!form) return;
  const nl = document.documentElement.lang === 'nl';
  const status = document.getElementById('audit-status');
  const button = form.querySelector('[type=submit]');
  const originalLabel = button.textContent;
  const website = form.elements.website;
  const fields = ['name','email','website','selling','traffic','goals','customer_value','customer_value'];
  const key = 'hys-audit-draft';
  const save = () => { try { sessionStorage.setItem(key, JSON.stringify({created:Date.now(), values:Object.fromEntries(fields.map(n=>[n,form.elements[n].value]))})); } catch {} };
  try {
    const saved = JSON.parse(sessionStorage.getItem(key) || 'null');
    if (saved && Date.now()-saved.created < 86400000) fields.forEach(n => { if (typeof saved.values?.[n] === 'string') form.elements[n].value = saved.values[n]; });
    else sessionStorage.removeItem(key);
  } catch {}
  let started = false, sending = false;
  form.addEventListener('input', () => { save(); if (!started) { started=true; signal('form_start'); } });
  website.addEventListener('blur', () => {
    const value=website.value.trim();
    if (value && !/^[a-z][a-z\d+.-]*:/i.test(value)) website.value='https://'+value;
    save();
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    save(); sending=true; button.disabled=true; form.setAttribute('aria-busy','true');
    button.textContent=nl?'Bezig met versturen…':'Sending…'; status.textContent='';
    const reference=crypto.randomUUID();
    const payload=auditPayload(Object.fromEntries(new FormData(form)), {reference,language:nl?'nl':'en',packageInterest:form.dataset.package || ''});
    payload.referral_source = referralSource(document.referrer,location.origin);
    try {
      await sendAudit(form.action,payload);
      try {
        sessionStorage.setItem('hys-enquiry',JSON.stringify({email:payload.email,reference,created:Date.now()}));
        sessionStorage.removeItem(key);
      } catch {}
      signal('audit_submission_success');
      location.assign(new URL(nl?'nl-thank-you.html':'thank-you.html',location.href).href);
    } catch {
      signal('audit_submission_error');
      status.textContent=nl?'We kunnen ontvangst niet bevestigen. Je invoer blijft staan. Probeer opnieuw of mail hello@hackyourskills.com.':'We could not confirm receipt. Your entries are preserved. Retry or email hello@hackyourskills.com.';
      status.focus(); button.disabled=false; button.textContent=originalLabel; sending=false;
    } finally { form.removeAttribute('aria-busy'); }
  });
}
