/**
 * Meta Conversions API — отправка событий воронки в пиксель.
 *
 * ВТОРОЙ ПРОЕКТ (finvoryx.site). Файл кладётся рядом с Code.gs, в тот же
 * проект Apps Script, привязанный к таблице лидов.
 *
 * ЧТО КОГДА УХОДИТ:
 *   Lead                 — автоматически, когда форма записала лид в таблицу
 *   CompleteRegistration — когда менеджер ставит галочку в колонке REG_COLUMN
 *   Purchase             — когда менеджер ставит галочку в DEPOSIT_COLUMN,
 *                          с суммой: она и даёт ROAS в отчётах Meta
 *
 * УСТАНОВКА:
 *   1. Extensions → Apps Script, файл MetaCapi.gs, вставить этот код.
 *   2. Project Settings → Script Properties → свойство META_CAPI_TOKEN
 *      со значением токена из Events Manager. В коде токен не хранится:
 *      проект уходит архивом заказчику.
 *   3. Запустить функцию setupMetaCapi и согласиться на авторизацию.
 *
 * ПОЧЕМУ setupMetaCapi, А НЕ ПРОСТО onEdit:
 *   простой триггер onEdit(e) работает без авторизации пользователя, и
 *   UrlFetchApp в нём запрещён — запрос в Meta молча падал бы. Нужен
 *   устанавливаемый триггер, его и создаёт setupMetaCapi.
 *
 * ПРОВЕРКА:
 *   код из Events Manager → Test Events вписать в META.TEST_EVENT_CODE.
 *   События пойдут в тестовую вкладку и не попадут в статистику.
 */

var META = {
  PIXEL_ID: '1625564909316264',
  API_VERSION: 'v25.0',

  // Лист с лидами. Пусто = реагировать на любом листе книги.
  SHEET_NAME: 'Leads',

  /* Колонки-галочки менеджера. Заданы буквами: заголовков у них нет.
     Снятие галочки ничего не отменяет — событие из Meta уже не отозвать.
     Все прочие колонки ищутся по названию заголовка и могут двигаться;
     эти две — единственные, что привязаны к позиции.

     Стоят сразу за колонками лида (A–H: Timestamp … fbclid). Разложить
     таблицу с нуля можно функцией setupSheetLayout ниже. */
  DEPOSIT_COLUMN: 'I',
  REG_COLUMN: 'J',

  // Сумма депозита. Нужна для ROAS: без value Meta не посчитает окупаемость.
  // Если завести колонку с таким заголовком — сумма возьмётся из неё.
  AMOUNT_HEADER: 'Deposit Amount',
  PURCHASE_VALUE: 250,
  CURRENCY: 'USD',

  // Телефоны в таблице без кода страны, номера американские
  DEFAULT_COUNTRY_CODE: '1',

  ACTION_SOURCE: 'website',
  EVENT_SOURCE_URL: 'https://finvoryx.site/landing',

  // Код из Events Manager → Test Events. Пусто = боевая отправка.
  TEST_EVENT_CODE: '',
};

/** Событие Meta → заголовок колонки с результатом отправки. */
var META_LOG_HEADERS = {
  Lead: 'Meta Lead',
  CompleteRegistration: 'Meta Reg',
  Purchase: 'Meta Purchase',
};

/** Имена обработчиков, включая прежние: чистим старые триггеры при обновлении. */
var META_HANDLERS = ['onMetaCheckbox', 'onDepositCheckbox', 'onDepositEdit'];

/**
 * Разметка чистой таблицы: создаёт лист Leads, строку заголовков и флажки.
 * Запускается один раз на новой таблице, до первого лида. Повторный запуск
 * безопасен: существующие заголовки и отметки не затираются.
 */
function setupSheetLayout() {
  var sheet = getSheet(); // из Code.gs — создаст лист Leads, если его нет
  ensureHeaders(sheet, buildValues({}));

  var rows = 500;
  var deposit = columnLetterToIndex(META.DEPOSIT_COLUMN);
  var reg = columnLetterToIndex(META.REG_COLUMN);

  // insertCheckboxes ставит FALSE — на поиск свободной строки это не влияет,
  // там признаком занятости служит Timestamp, а не флажок
  sheet.getRange(2, deposit, rows, 1).insertCheckboxes();
  sheet.getRange(2, reg, rows, 1).insertCheckboxes();

  sheet.getRange(1, deposit).setValue('Деп').setFontWeight('bold');
  sheet.getRange(1, reg).setValue('Рега').setFontWeight('bold');

  Logger.log(
    'Лист "%s" размечен: флажки депозита в %s, регистрации в %s, %s строк.',
    sheet.getName(),
    META.DEPOSIT_COLUMN,
    META.REG_COLUMN,
    rows,
  );
}

/** Разовая настройка: ставит триггер и проверяет, что всё готово. */
function setupMetaCapi() {
  if (!getMetaToken()) {
    throw new Error(
      'Не задан META_CAPI_TOKEN. Project Settings → Script Properties → добавить свойство META_CAPI_TOKEN.',
    );
  }

  var book = getMetaBook();
  if (!book) {
    throw new Error('Таблица не найдена. Проверьте CONFIG.SPREADSHEET_ID в Code.gs.');
  }

  // Старые копии триггера убираем, иначе одно событие уйдёт несколько раз
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (META_HANDLERS.indexOf(triggers[i].getHandlerFunction()) !== -1) {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  ScriptApp.newTrigger('onMetaCheckbox').forSpreadsheet(book).onEdit().create();

  Logger.log(
    'Готово. Таблица "%s". Пиксель %s. Lead — автоматически при записи лида, CompleteRegistration — галочка в %s, Purchase — галочка в %s на %s %s.%s',
    book.getName(),
    META.PIXEL_ID,
    META.REG_COLUMN,
    META.DEPOSIT_COLUMN,
    META.PURCHASE_VALUE,
    META.CURRENCY,
    META.TEST_EVENT_CODE ? ' Режим Test Events: ' + META.TEST_EVENT_CODE : '',
  );
}

/** Обработчик правки ячейки. Вешается устанавливаемым триггером. */
function onMetaCheckbox(e) {
  if (!e || !e.range) return;

  var sheet = e.range.getSheet();
  if (META.SHEET_NAME && sheet.getName() !== META.SHEET_NAME) return;

  var targets = [
    { column: columnLetterToIndex(META.REG_COLUMN), event: 'CompleteRegistration' },
    { column: columnLetterToIndex(META.DEPOSIT_COLUMN), event: 'Purchase' },
  ];

  var firstColumn = e.range.getColumn();
  var lastColumn = firstColumn + e.range.getNumColumns() - 1;
  var firstRow = e.range.getRow();

  for (var t = 0; t < targets.length; t++) {
    var target = targets[t];
    if (target.column < firstColumn || target.column > lastColumn) continue;

    // Правка может задеть несколько строк сразу (протягивание, вставка)
    for (var i = 0; i < e.range.getNumRows(); i++) {
      var row = firstRow + i;
      if (row === 1) continue; // строка заголовков

      // Галочка = булево true. Снятие галочки (false) игнорируем.
      if (sheet.getRange(row, target.column).getValue() !== true) continue;

      sendEventForRow(sheet, row, target.event);
    }
  }
}

/**
 * Lead по факту записи лида. Вызывается из doPost в Code.gs — там код идёт
 * от имени владельца веб-приложения, поэтому UrlFetchApp разрешён.
 */
function sendLeadEvent(sheet, row) {
  sendEventForRow(sheet, row, 'Lead');
}

/** Ручная проверка строки: metaCapiTestRow(2, 'Purchase') */
function metaCapiTestRow(row, eventName) {
  var book = getMetaBook();
  var sheet = META.SHEET_NAME ? book.getSheetByName(META.SHEET_NAME) : book.getActiveSheet();
  sendEventForRow(sheet, row, eventName || 'Purchase', true);
}

/** Собирает данные строки, отправляет событие и пишет результат в таблицу. */
function sendEventForRow(sheet, row, eventName, force) {
  var headers = readHeaders(sheet);
  var logColumn = ensureColumn(sheet, headers, META_LOG_HEADERS[eventName]);
  var logCell = sheet.getRange(row, logColumn);

  // Защита от повторной отправки: галочку можно снять и поставить снова
  if (!force && String(logCell.getValue()).indexOf('sent') === 0) return;

  var values = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
  var get = function (header) {
    var index = headers.indexOf(header);
    return index === -1 ? '' : String(values[index] || '').trim();
  };

  if (!get('Email') && !get('Phone')) {
    logCell.setValue('error: в строке нет ни email, ни телефона');
    return;
  }

  var event = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    // Стабильный id: если событие уйдёт дважды, Meta схлопнет дубль
    event_id: eventName.toLowerCase() + '-' + sheet.getSheetId() + '-' + row,
    action_source: META.ACTION_SOURCE,
    user_data: buildUserData(get),
  };
  if (META.EVENT_SOURCE_URL) event.event_source_url = META.EVENT_SOURCE_URL;

  // value и currency обязательны для Purchase и дают ROAS в отчётах Meta
  if (eventName === 'Purchase') {
    var amount = get(META.AMOUNT_HEADER);
    var value = amount ? Number(String(amount).replace(/[^\d.]/g, '')) : META.PURCHASE_VALUE;
    event.custom_data = {
      value: isNaN(value) ? META.PURCHASE_VALUE : value,
      currency: META.CURRENCY,
    };
  }

  var payload = { data: [event] };
  if (META.TEST_EVENT_CODE) payload.test_event_code = META.TEST_EVENT_CODE;

  var result = postToMeta(payload);
  var stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');

  if (result.ok) {
    // received — сколько событий приняла Meta. 1 = долетело.
    logCell.setValue(
      'sent ' +
        stamp +
        (META.TEST_EVENT_CODE ? ' (test)' : ' (prod)') +
        (event.custom_data ? ' · ' + event.custom_data.value + ' ' + META.CURRENCY : '') +
        ' · received ' +
        result.received,
    );
  } else {
    logCell.setValue('error ' + stamp + ': ' + result.message);
  }

  /* Постбэк в Keitaro. Живёт в KeitaroPostback.gs и по умолчанию выключен;
     если файла в проекте нет — шаг просто пропускается. Ошибка трекера не
     должна влиять на отправку в Meta, поэтому вызов изолирован. */
  if (typeof sendKeitaroPostback === 'function') {
    try {
      sendKeitaroPostback(
        sheet,
        row,
        eventName,
        get,
        event.custom_data ? event.custom_data.value : undefined,
      );
    } catch (ignored) {
      // молча: событие в Meta уже ушло, это важнее
    }
  }
}

/**
 * Данные пользователя для сопоставления. Всё, кроме fbc и user agent,
 * хешируется SHA-256 — в открытом виде наружу не уходит ничего.
 */
function buildUserData(get) {
  var userData = {};

  var email = get('Email');
  if (email) userData.em = [sha256Hex(normalizeEmail(email))];

  var phone = get('Phone');
  if (phone) userData.ph = [sha256Hex(normalizePhone(phone))];

  var firstName = get('First Name');
  if (firstName) userData.fn = [sha256Hex(normalizeName(firstName))];

  var lastName = get('Last Name');
  if (lastName) userData.ln = [sha256Hex(normalizeName(lastName))];

  /* client_user_agent обязателен для событий с action_source "website".
     Без него Meta отвечает 200, но событие считается неполным. */
  var userAgent = get('User Agent');
  if (userAgent) userData.client_user_agent = userAgent;

  /* fbc — идентификатор клика по объявлению. Именно он связывает конверсию
     с конкретной кампанией и креативом, без него Meta не покажет, откуда
     пришёл деп. Формат фиксированный: fb.1.<время в мс>.<fbclid>. */
  var fbclid = get('fbclid');
  if (fbclid) userData.fbc = 'fb.1.' + Date.now() + '.' + fbclid;

  return userData;
}

/** POST в Conversions API. Ошибку не бросаем — она должна попасть в таблицу. */
function postToMeta(payload) {
  var url =
    'https://graph.facebook.com/' +
    META.API_VERSION +
    '/' +
    META.PIXEL_ID +
    '/events?access_token=' +
    encodeURIComponent(getMetaToken());

  try {
    var response = UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    });

    var body = JSON.parse(response.getContentText());
    if (response.getResponseCode() === 200 && !body.error) {
      return { ok: true, received: body.events_received };
    }
    return {
      ok: false,
      message: body.error ? body.error.message : 'HTTP ' + response.getResponseCode(),
    };
  } catch (error) {
    return { ok: false, message: String(error && error.message ? error.message : error) };
  }
}

/**
 * Таблица, с которой работаем, — ровно та же, что у Code.gs.
 *
 * Раньше здесь был getActiveSpreadsheet(), то есть книга, из которой открыт
 * редактор. При переезде на другую таблицу это тихо вешало триггер на старую:
 * лиды писались в новую, а галочки в ней не срабатывали.
 */
function getMetaBook() {
  var id = typeof CONFIG !== 'undefined' && CONFIG.SPREADSHEET_ID ? CONFIG.SPREADSHEET_ID : '';
  return id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActiveSpreadsheet();
}

function getMetaToken() {
  return PropertiesService.getScriptProperties().getProperty('META_CAPI_TOKEN') || '';
}

function readHeaders(sheet) {
  return sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0]
    .map(function (header) {
      return String(header).trim();
    });
}

/** Колонка по заголовку; создаётся справа, если её ещё нет. */
function ensureColumn(sheet, headers, header) {
  var index = headers.indexOf(header);
  if (index !== -1) return index + 1;

  var column = sheet.getLastColumn() + 1;
  sheet.getRange(1, column).setValue(header).setFontWeight('bold');
  headers.push(header);
  return column;
}

/* Нормализация по требованиям Meta: email в нижний регистр, из телефона
   только цифры с кодом страны, имена — нижний регистр без знаков препинания. */

function normalizeEmail(value) {
  return String(value).trim().toLowerCase();
}

function normalizePhone(value) {
  var digits = String(value).replace(/\D/g, '').replace(/^0+/, '');
  // 10 цифр = номер США без кода страны, его требует Meta
  if (digits.length === 10) digits = META.DEFAULT_COUNTRY_CODE + digits;
  return digits;
}

function normalizeName(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]/gu, '');
}

function sha256Hex(value) {
  var bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    value,
    Utilities.Charset.UTF_8,
  );
  var hex = '';
  for (var i = 0; i < bytes.length; i++) {
    var byte = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
    var part = byte.toString(16);
    hex += part.length === 1 ? '0' + part : part;
  }
  return hex;
}

function columnLetterToIndex(letter) {
  var result = 0;
  var text = String(letter).toUpperCase();
  for (var i = 0; i < text.length; i++) {
    result = result * 26 + (text.charCodeAt(i) - 64);
  }
  return result;
}
