/**
 * Постбэки в Keitaro — сообщаем трекеру о лидах, регистрациях и депозитах.
 *
 * Зачем: Meta получает события напрямую из таблицы (MetaCapi.gs), но Keitaro
 * о них не знает и потому не может посчитать ROI. Постбэк закрывает этот
 * пробел: конверсия привязывается к клику по subid, и в отчётах трекера
 * появляются доход и окупаемость рядом с расходом на рекламу.
 *
 * УСТАНОВКА:
 *   1. В Keitaro открыть кампанию и скопировать её Postback URL.
 *   2. Вставить его в KEITARO.POSTBACK_URL ниже, заменив значения параметров
 *      на плейсхолдеры {subid}, {status}, {payout} — см. пример там же.
 *   3. Сохранить. Отдельный триггер не нужен: постбэк уходит из того же
 *      места, что и события Meta.
 *
 * Пустой POSTBACK_URL = постбэки выключены, всё остальное работает как прежде.
 */

var KEITARO = {
  /**
   * Шаблон URL постбэка. Плейсхолдеры подставляются автоматически:
   *   {subid}    — идентификатор клика из колонки Subid
   *   {status}   — статус из STATUS ниже
   *   {payout}   — сумма (только у Purchase, иначе пусто)
   *   {currency} — валюта
   *
   * Пример:
   * 'https://ваш-трекер/click.php?subid={subid}&status={status}&payout={payout}'
   */
  POSTBACK_URL:
    'http://176.126.163.66/6ba62fa/postback?subid={subid}&status={status}&payout={payout}',

  /**
   * Событие Meta → статус конверсии Keitaro.
   * Пустая строка = в трекер не сообщать.
   *
   * CompleteRegistration по умолчанию пропускаем: в Keitaro из коробки есть
   * lead, sale и rejected, и если слать регистрацию тоже как lead, трекер
   * посчитает две конверсии на одного человека. Если заведёте свой тип
   * конверсии (Настройки → Типы конверсий), впишите его имя сюда.
   */
  STATUS: {
    Lead: 'lead',
    CompleteRegistration: '',
    Purchase: 'sale',
  },

  // Колонка с результатом отправки. Создаётся автоматически справа.
  LOG_HEADER: 'Keitaro',
};

/**
 * Отправляет постбэк по строке таблицы. Вызывается из sendEventForRow
 * в MetaCapi.gs сразу после отправки события в Meta.
 *
 * @param sheet     лист с лидами
 * @param row       номер строки
 * @param eventName имя события Meta (Lead / CompleteRegistration / Purchase)
 * @param get       функция чтения значения строки по заголовку колонки
 * @param value     сумма для Purchase, иначе undefined
 */
function sendKeitaroPostback(sheet, row, eventName, get, value) {
  if (!KEITARO.POSTBACK_URL) return;

  var status = KEITARO.STATUS[eventName];
  if (!status) return; // это событие трекеру не сообщаем

  var subid = get('Subid');
  var logColumn = ensureColumn(sheet, readHeaders(sheet), KEITARO.LOG_HEADER);
  var logCell = sheet.getRange(row, logColumn);
  var previous = String(logCell.getValue());

  if (!subid) {
    // Лид пришёл не с трекера: прямой заход, органика или старая ссылка
    if (previous.indexOf('no subid') === -1) {
      logCell.setValue(appendLine(previous, 'no subid — конверсия трекеру не привязана'));
    }
    return;
  }

  var url = KEITARO.POSTBACK_URL.replace('{subid}', encodeURIComponent(subid))
    .replace('{status}', encodeURIComponent(status))
    .replace('{payout}', value === undefined ? '' : encodeURIComponent(value))
    .replace('{currency}', encodeURIComponent(META.CURRENCY));

  var stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');

  try {
    var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: true });
    var code = response.getResponseCode();
    var body = String(response.getContentText()).slice(0, 60);
    logCell.setValue(
      appendLine(previous, status + ' ' + stamp + ' → HTTP ' + code + (body ? ' ' + body : '')),
    );
  } catch (error) {
    logCell.setValue(
      appendLine(previous, status + ' ' + stamp + ' → ошибка: ' + (error && error.message)),
    );
  }
}

/** Дописывает строку в ячейку лога, сохраняя прежние записи. */
function appendLine(previous, line) {
  return previous ? previous + '\n' + line : line;
}
