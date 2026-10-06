/**
 * Google Apps Script Web App — приёмник лид-формы.
 *
 * УСТАНОВКА (кратко, подробно — в DOCUMENTATION.md):
 *   1. Создать Google Sheet.
 *   2. Extensions → Apps Script, вставить этот файл.
 *   3. Заполнить CONFIG ниже (SPREADSHEET_ID можно оставить пустым,
 *      если скрипт привязан к таблице).
 *   4. Deploy → New deployment → Web app:
 *        Execute as: Me
 *        Who has access: Anyone
 *   5. Скопировать URL вида https://script.google.com/macros/s/…/exec
 *      и положить его в .env фронтенда: VITE_SHEETS_ENDPOINT=…
 *
 * ОБНОВЛЕНИЕ КОДА: после правки — Ctrl+S, затем Deploy → Manage deployments →
 * Edit (карандаш) → Version: New version. Без выбора New version деплой
 * продолжает отдавать прежний снимок кода, а URL при этом не меняется.
 *
 * Google credentials на фронтенде НЕ хранятся: фронт знает только этот URL.
 */

var CONFIG = {
  // ID таблицы из её URL: /spreadsheets/d/<ID>/edit
  // Пусто = использовать таблицу, к которой привязан скрипт.
  //
  // ВНИМАНИЕ: проектов два, и у каждого своя таблица. Этот файл общий,
  // поэтому при вставке в другой проект ID нужно заменить руками:
  //   fynvoryx.store → 1PWeZSQxKKBASb3b-vWZ6VZl-LPHfOAdDlMXAT9bKU_A
  //   finvoryx.site  → 1tQGRA6bkn4tpkw-F4UoUfx-z_Ftr1dusx7zJo_3hoXw
  // Если оставить чужой ID, лиды одного домена молча уедут в таблицу другого.
  //
  // Ниже стоит ID действующей таблицы finvoryx.site. Прежняя таблица этого
  // проекта (1rCSL_HX4PS7kJJVgRNyHDy-0x1qgsSf2T5XwNpuudsg) больше не
  // используется — на ней остались только тестовые записи.
  SPREADSHEET_ID: '1E2HBEFKnoY4m5ZkyFMKeQy-uIbFmf9L_xns2AiooITU',

  // Имя листа. Если листа нет, он будет создан с заголовками.
  SHEET_NAME: 'Leads',

  // Общий секрет. Должен совпадать с VITE_SHEETS_TOKEN на фронтенде.
  // Пустая строка = проверка отключена.
  SHARED_TOKEN: '',

  // Куда слать уведомление о новом лиде. Пусто = не слать.
  NOTIFY_EMAIL: '',
};

/** POST от формы. Тело приходит как text/plain с JSON внутри. */
function doPost(e) {
  try {
    var data = parseBody(e);

    if (CONFIG.SHARED_TOKEN && data.token !== CONFIG.SHARED_TOKEN) {
      return jsonResponse({ result: 'error', error: 'Unauthorized' });
    }

    var sheet = getSheet();
    var values = buildValues(data);
    var headers = ensureHeaders(sheet, values);

    // Строка собирается по фактическому порядку заголовков в таблице
    var row = headers.map(function (name) {
      return Object.prototype.hasOwnProperty.call(values, name) ? values[name] : '';
    });

    /* Пишем в первую свободную строку, а не через appendRow.
       appendRow ставит строку после последней непустой ЯЧЕЙКИ листа, а
       заранее проставленный флажок — это значение FALSE, то есть содержимое.
       Из-за этого лиды улетали под конец колонки с флажками, оставляя
       пустые строки сверху. */
    var targetRow = findFirstFreeRow(sheet, headers);
    sheet.getRange(targetRow, 1, 1, row.length).setValues([row]);

    /* Lead в Meta теперь шлёт сайт (fbq track Lead в LeadForm.tsx), поэтому
       серверная отправка отключена, иначе конверсии задвоятся. Чтобы вернуть
       её, раскомментируйте блок и уберите trackEvent('Lead') на сайте.
    if (typeof sendLeadEvent === 'function') {
      try {
        sendLeadEvent(sheet, targetRow);
      } catch (ignored) {
        // молча: лид уже в таблице, это важнее
      }
    }
    */

    notify(data);

    return jsonResponse({ result: 'success' });
  } catch (error) {
    return jsonResponse({ result: 'error', error: String(error && error.message ? error.message : error) });
  }
}

/** GET — простая проверка, что деплой живой (откройте URL в браузере). */
function doGet() {
  return jsonResponse({ result: 'success', message: 'Lead endpoint is running' });
}

/**
 * Значения строки по НАЗВАНИЯМ колонок. Порядок ключей используется только
 * при создании нового листа; в существующей таблице позиции берутся из
 * первой строки, поэтому колонки можно свободно переставлять.
 *
 * Здесь перечислено ровно то, что попадает в таблицу. Остальные поля запроса
 * (страна, UTM, Page URL, Referrer) приходят с формы, но не записываются —
 * чтобы вернуть любое из них, достаточно добавить строку сюда.
 */
function buildValues(data) {
  return {
    'Timestamp': data.submittedAt ? new Date(data.submittedAt) : new Date(),
    'First Name': str(data.firstName),
    'Last Name': str(data.lastName),
    'Email': str(data.email),
    // Апостроф не даёт таблице превратить "+1 555…" в формулу/число
    'Phone': data.phone ? "'" + str(data.phone) : '',
    'User Agent': str(data.userAgent),
    // Идентификатор клика Keitaro: по нему депозит связывается с кликом
    // и уходит постбэк в трекер. Без него конверсия трекеру не видна.
    'Subid': str(data.subid),
    // Идентификатор клика Facebook — нужен Keitaro для отправки в пиксель
    'fbclid': str(data.fbclid),
  };
}

/**
 * Заголовки листа. Недостающие колонки дописываются справа, чужие —
 * не трогаются: можно завести свои столбцы (статус обзвона, оператор)
 * и быть уверенным, что скрипт в них не запишет.
 */
function ensureHeaders(sheet, values) {
  var names = Object.keys(values);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(names);
    sheet.getRange(1, 1, 1, names.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    return names;
  }

  var headers = sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0]
    .map(function (header) {
      return String(header).trim();
    });

  var missing = names.filter(function (name) {
    return headers.indexOf(name) === -1;
  });

  if (missing.length) {
    sheet
      .getRange(1, headers.length + 1, 1, missing.length)
      .setValues([missing])
      .setFontWeight('bold');
    headers = headers.concat(missing);
  }

  return headers;
}

/** Разбор тела запроса: JSON в text/plain или обычная form-data. */
function parseBody(e) {
  if (!e) return {};

  if (e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (ignored) {
      // не JSON — пробуем параметры формы ниже
    }
  }

  var params = {};
  if (e.parameter) {
    for (var key in e.parameter) {
      params[key] = e.parameter[key];
    }
  }
  return params;
}

/**
 * Номер первой строки без лида. Признак занятости — заполненный Timestamp:
 * он есть у каждого сохранённого лида и никогда не проставляется вручную.
 * Флажки и выпадающие списки в пустых строках при этом не мешают.
 */
function findFirstFreeRow(sheet, headers) {
  var markerColumn = headers.indexOf('Timestamp') + 1;
  if (markerColumn === 0) markerColumn = 1;

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return 2; // только заголовки

  var marks = sheet.getRange(2, markerColumn, lastRow - 1, 1).getValues();
  for (var i = 0; i < marks.length; i++) {
    if (marks[i][0] === '' || marks[i][0] === null) return i + 2;
  }
  return lastRow + 1;
}

/** Лист для лидов. Создаётся автоматически, если его нет. */
function getSheet() {
  var book = CONFIG.SPREADSHEET_ID
    ? SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();

  if (!book) {
    throw new Error('Spreadsheet not found. Set CONFIG.SPREADSHEET_ID.');
  }

  var sheet = book.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    sheet = book.insertSheet(CONFIG.SHEET_NAME);
  }

  return sheet;
}

/** Необязательное письмо о новом лиде. */
function notify(data) {
  if (!CONFIG.NOTIFY_EMAIL) return;
  try {
    MailApp.sendEmail(
      CONFIG.NOTIFY_EMAIL,
      'New lead: ' + str(data.firstName) + ' ' + str(data.lastName),
      [
        'Name: ' + str(data.firstName) + ' ' + str(data.lastName),
        'Email: ' + str(data.email),
        'Phone: ' + str(data.phone),
        'User Agent: ' + str(data.userAgent),
      ].join('\n'),
    );
  } catch (ignored) {
    // Письмо не должно ломать запись строки в таблицу
  }
}

function str(value) {
  return value === undefined || value === null ? '' : String(value);
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
