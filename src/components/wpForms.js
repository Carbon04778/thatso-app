// Re-creates the front-end behaviour of the live site's Contact Form 7 setup for imported forms:
// - "CF7 Skins (Innozilla)": per-form class, full-width textarea label, wrapped submit button, no <br>
// - "Conditional Fields for CF7": groups shown/hidden (200 ms slide) from the form's rules
// - Contact Form 7: AJAX submit, spinner, status classes, per-field error tips and response message
//
// Submissions go to the Contact Form 7 REST endpoint on WordPress (it allows cross-origin requests).
// Set VITE_CF7_ENDPOINT to another URL (e.g. a Base44 backend function returning the same JSON) to switch.

const WP = 'https://thatso-germany.de';
const endpointFor = (id) =>
  (import.meta.env.VITE_CF7_ENDPOINT || `${WP}/wp-json/contact-form-7/v1/contact-forms/{id}/feedback`).replace('{id}', id);

// Messages as configured on the live form (from its validation responses).
const MSG = {
  required: 'Dies ist ein Pflichtfeld.',
  email: 'Die eingegebene E-Mail-Adresse ist ungültig.',
  tel: 'Die Telefonnummer ist ungültig.',
  invalid: 'Ein oder mehrere Felder weisen einen Fehler auf. Bitte überprüfen Sie das und versuchen Sie es erneut.',
  failed: 'Beim Senden Ihrer Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.',
};

const decode = (s) => {
  const t = document.createElement('textarea');
  t.innerHTML = s;
  return t.value;
};

// jQuery .animate() show/hide (height, vertical margins/paddings) as used by the conditional fields plugin.
// Like jQuery, the target height is the element's own height (0 for these groups, whose labels are floated),
// with overflow hidden during the animation - so the fields appear when it ends.
function slide(el, show, ms) {
  el.getAnimations().forEach((a) => a.cancel());
  el.style.display = 'block';
  const cs = getComputedStyle(el);
  const full = {
    height: `${el.offsetHeight}px`,
    marginTop: cs.marginTop,
    marginBottom: cs.marginBottom,
    paddingTop: cs.paddingTop,
    paddingBottom: cs.paddingBottom,
  };
  const zero = { height: '0px', marginTop: '0px', marginBottom: '0px', paddingTop: '0px', paddingBottom: '0px' };
  const anim = el.animate(show ? [zero, full] : [full, zero], { duration: ms, easing: 'cubic-bezier(.02,.01,.47,1)' });
  el.style.overflow = 'hidden';
  anim.onfinish = () => {
    el.style.overflow = '';
    el.style.display = show ? 'block' : 'none';
  };
}

function initConditional(form) {
  const input = form.querySelector('input[name="_wpcf7cf_options"]');
  if (!input) return;
  let options;
  try {
    options = JSON.parse(input.value);
  } catch {
    return;
  }
  const groups = [...form.querySelectorAll('[data-class="wpcf7cf_group"]')];
  const intime = options.settings?.animation === 'no' ? 0 : +options.settings?.animation_intime || 200;
  const outtime = options.settings?.animation === 'no' ? 0 : +options.settings?.animation_outtime || 200;
  groups.forEach((g) => g.classList.add('wpcf7cf-hidden'));

  const valueOf = (name) => {
    // Values count even inside hidden groups (the plugin doesn't clear them), exactly like on the live site.
    const els = [...form.querySelectorAll(`[name="${name}"], [name="${name}[]"]`)];
    return els.filter((e) => (e.type === 'checkbox' || e.type === 'radio' ? e.checked : true)).map((e) => e.value);
  };
  const ruleOk = (r) => {
    const vals = valueOf(r.if_field).map(decode);
    const want = decode(r.if_value || '');
    switch (r.operator) {
      case 'not equals':
        return !vals.includes(want);
      case 'is empty':
        return vals.every((v) => v === '');
      case 'not empty':
        return vals.some((v) => v !== '');
      default:
        return vals.includes(want);
    }
  };

  const update = (animate) => {
    for (let pass = 0; pass < 5; pass++) {
      const shown = new Set(options.conditions.filter((c) => c.and_rules.every(ruleOk)).map((c) => c.then_field));
      let changed = false;
      groups.forEach((g) => {
        const show = shown.has(g.dataset.id);
        if (show === !g.classList.contains('wpcf7cf-hidden')) return;
        changed = true;
        g.classList.toggle('wpcf7cf-hidden', !show);
        if (animate) slide(g, show, show ? intime : outtime);
        else g.style.display = show ? 'block' : 'none';
      });
      if (!changed) break;
    }
    const hiddenFields = [];
    const hidden = [];
    const visible = [];
    groups.forEach((g) => {
      if (g.classList.contains('wpcf7cf-hidden')) {
        hidden.push(g.dataset.id);
        g.querySelectorAll('input,select,textarea').forEach((f) => hiddenFields.push(f.name));
      } else visible.push(g.dataset.id);
    });
    form.querySelector('[name="_wpcf7cf_hidden_group_fields"]').value = JSON.stringify(hiddenFields);
    form.querySelector('[name="_wpcf7cf_hidden_groups"]').value = JSON.stringify(hidden);
    form.querySelector('[name="_wpcf7cf_visible_groups"]').value = JSON.stringify(visible);
  };
  update(false);
  form.addEventListener('change', () => update(true));
}

function setStatus(form, status) {
  const prev = form.getAttribute('data-status');
  if (prev) form.classList.remove(prev);
  form.classList.add(status);
  form.setAttribute('data-status', status);
}

function clearTips(form) {
  form.querySelectorAll('.wpcf7-not-valid-tip').forEach((t) => t.remove());
  form.querySelectorAll('.wpcf7-not-valid').forEach((c) => {
    c.classList.remove('wpcf7-not-valid');
    c.setAttribute('aria-invalid', 'false');
  });
}

function showTip(form, name, message, unitTag) {
  const wrap = form.querySelector(`.wpcf7-form-control-wrap[data-name="${name}"]`);
  if (!wrap) return;
  wrap.querySelector('.wpcf7-not-valid-tip')?.remove();
  const control = wrap.querySelector('.wpcf7-form-control');
  control?.classList.add('wpcf7-not-valid');
  control?.setAttribute('aria-invalid', 'true');
  control?.setAttribute('aria-describedby', `${unitTag}-ve-${name}`);
  const tip = document.createElement('span');
  tip.className = 'wpcf7-not-valid-tip';
  tip.setAttribute('aria-hidden', 'true');
  tip.textContent = message;
  wrap.appendChild(tip);
}

// Client-side check used after a failed submit, when a field is changed (CF7 5.7 "swv" behaviour).
function checkField(control) {
  const v = (control.type === 'checkbox' ? '' : control.value || '').trim();
  const box = control.closest('.wpcf7-checkbox');
  if (box) return box.querySelector('input:checked') || !box.classList.contains('wpcf7-validates-as-required') ? null : MSG.required;
  if (control.classList.contains('wpcf7-validates-as-required') && !v) return MSG.required;
  if (v && control.classList.contains('wpcf7-validates-as-email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return MSG.email;
  if (v && control.classList.contains('wpcf7-validates-as-tel') && !/^[+]?[0-9() -]*$/.test(v)) return MSG.tel;
  return null;
}

function initForm(container) {
  const form = container.querySelector('form.wpcf7-form');
  if (!form) return;
  container.classList.replace('no-js', 'js');

  // CF7 Skins (Innozilla) front-end script
  const m = /wpcf7-f(.*?)-(?:p|o)/.exec(container.id);
  if (m) container.classList.add(`icf7s-${m[1]}`);
  form.querySelectorAll('label').forEach((l) => l.querySelector(':scope span textarea') && l.classList.add('text-area-full'));
  form.querySelectorAll('br').forEach((br) => br.remove());
  const submit = form.querySelector('.wpcf7-submit');
  if (submit && !submit.parentElement.classList.contains('icf7s-button')) {
    const wrap = document.createElement('div');
    wrap.className = 'icf7s-button';
    submit.replaceWith(wrap);
    wrap.appendChild(submit);
    // CF7 adds its spinner right after the button before the skin script wraps only the button,
    // so on the live site the spinner ends up after the wrapper (on its own line).
    if (submit.classList.contains('has-spinner')) {
      const spinner = document.createElement('span');
      spinner.className = 'wpcf7-spinner';
      wrap.after(spinner);
    }
  }

  initConditional(form);

  const unitTag = form.querySelector('[name="_wpcf7_unit_tag"]')?.value || '';
  const formId = form.querySelector('[name="_wpcf7"]')?.value;
  const output = container.querySelector('.wpcf7-response-output');

  form.addEventListener('change', (e) => {
    const wrap = e.target.closest('.wpcf7-form-control-wrap');
    if (!wrap || !wrap.querySelector('.wpcf7-not-valid-tip, .wpcf7-not-valid')) return;
    const msg = checkField(e.target);
    if (msg) showTip(form, wrap.dataset.name, msg, unitTag);
    else {
      wrap.querySelector('.wpcf7-not-valid-tip')?.remove();
      wrap.querySelector('.wpcf7-not-valid')?.classList.remove('wpcf7-not-valid');
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (form.getAttribute('data-status') === 'submitting') return;
    setStatus(form, 'submitting');
    clearTips(form);
    if (output) {
      output.textContent = '';
      output.setAttribute('aria-hidden', 'true');
    }
    let data;
    try {
      const res = await fetch(endpointFor(formId), { method: 'POST', body: new FormData(form) });
      data = await res.json();
    } catch {
      data = { status: 'mail_failed', message: MSG.failed };
    }
    const map = { validation_failed: 'invalid', acceptance_missing: 'unaccepted', spam: 'spam', mail_sent: 'sent', mail_failed: 'failed' };
    setStatus(form, map[data.status] || data.status || 'failed');
    (data.invalid_fields || []).forEach((f) => showTip(form, f.field, f.message, unitTag));
    if (output) {
      output.textContent = data.message || '';
      output.setAttribute('aria-hidden', 'false');
    }
    if (data.status === 'mail_sent') {
      form.reset();
      form.dispatchEvent(new Event('change'));
    }
  });
}

export function initForms(root) {
  root.querySelectorAll('.wpcf7').forEach(initForm);
}
