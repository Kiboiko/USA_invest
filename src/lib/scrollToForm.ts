/**
 * Прокрутка к лид-форме и фокус на первом поле.
 * Используется всеми CTA-кнопками landing-страницы.
 */
export function scrollToForm(): void {
  const form = document.getElementById('lead-form');
  if (!form) return;

  form.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const firstInput = form.querySelector<HTMLInputElement>('input:not([type="radio"])');
  if (!firstInput) return;

  // Фокус ставим после завершения плавной прокрутки
  window.setTimeout(() => firstInput.focus({ preventScroll: true }), 450);
}
