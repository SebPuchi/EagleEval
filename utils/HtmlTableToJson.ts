import * as cheerio from 'cheerio';

class HtmlTableToJson {
  private html: string;
  private opts: any;
  private _$: cheerio.CheerioAPI;
  private _results: any[];
  private _headers: any[];
  private _count: number | null;
  private _firstRowUsedAsHeaders: boolean[];

  constructor(html: string, options: any = {}) {
    if (typeof html !== 'string') {
      throw new TypeError('html input must be a string');
    }

    this.html = html;
    this.opts = options;

    this._$ = cheerio.load(this.html);
    this._results = [];
    this._headers = [];
    this._count = null;

    this._firstRowUsedAsHeaders = [];

    this._process();
  }

  static parse(html: string, options?: any): HtmlTableToJson {
    return new HtmlTableToJson(html, options);
  }

  get count(): number {
    if (Number.isInteger(this._count) === false) {
      this._count = this._$('table').get().length;
    }

    return this._count as number;
  }

  get results(): any[] {
    return this.opts.values === true
      ? this._results.map((result) => result.map((r: any) => Object.values(r)))
      : this._results;
  }

  get headers(): any[] {
    return this._headers;
  }

  private _process(): any[] {
    if (this._results.length > 0) {
      return this._results;
    }

    this._$('table').each((i, element) => this._processTable(i, element));

    return this._results;
  }

  private _processTable(tableIndex: number, table: any): void {
    this._results[tableIndex] = [];
    this._buildHeaders(tableIndex, table);

    this._$(table)
      .find('tr')
      .each((i, element) => this._processRow(tableIndex, i, element));
    this._pruneEmptyRows(tableIndex);
  }

  private _processRow(tableIndex: number, index: number, row: any): void {
    if (index === 0 && this._firstRowUsedAsHeaders[tableIndex] === true) {
      return;
    }

    this._results[tableIndex][index] = {};

    this._$(row)
      .find('td')
      .each((i, cell) => {
        this._results[tableIndex][index][
          this._headers[tableIndex][i] || i + 1
        ] = this._$(cell).text().trim();
      });
  }

  private _buildHeaders(index: number, table: any): void {
    this._headers[index] = [];

    this._$(table)
      .find('tr')
      .each((i, row) => {
        this._$(row)
          .find('th')
          .each((j, cell) => {
            this._headers[index][j] = this._$(cell).text().trim();
          });
      });

    if (this._headers[index].length > 0) {
      return;
    }

    this._firstRowUsedAsHeaders[index] = true;
    this._$(table)
      .find('tr')
      .first()
      .find('td')
      .each((j, cell) => {
        this._headers[index][j] = this._$(cell).text().trim();
      });
  }

  private _pruneEmptyRows(tableIndex: number): void {
    this._results[tableIndex] = this._results[tableIndex].filter(
      (t: any) => Object.keys(t).length
    );
  }
}

export default HtmlTableToJson;
