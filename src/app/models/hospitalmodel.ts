export interface Hospitals {
    version:  string;
    encoding: string;
    feed:     Feed;
}

export interface Feed {
    xmlns:                   string;
    xmlns$openSearch:        string;
    xmlns$batch:             string;
    xmlns$gs:                string;
    id:                      GsColCount;
    updated:                 GsColCount;
    category:                Category[];
    title:                   Title;
    link:                    Link[];
    author:                  Author[];
    openSearch$totalResults: GsColCount;
    openSearch$startIndex:   GsColCount;
    gs$rowCount:             GsColCount;
    gs$colCount:             GsColCount;
    entry:                   Entry[];
}

export interface Author {
    name:  GsColCount;
    email: GsColCount;
}

export interface GsColCount {
    $t: string;
}

export interface Category {
    scheme: string;
    term:   string;
}

export interface Entry {
    id:       GsColCount;
    updated:  GsColCount;
    category: Category[];
    title:    Title;
    content:  Title;
    link:     Link[];
    gs$cell:  GsCell;
}

export interface Title {
    type: TitleType;
    $t:   string;
}

export enum TitleType {
    Text = "text",
}

export interface GsCell {
    row:           string;
    col:           string;
    inputValue:    string;
    $t:            string;
    numericValue?: string;
}

export interface Link {
    rel:  string;
    type: LinkType;
    href: string;
}

export enum LinkType {
    ApplicationAtomXML = "application/atom+xml",
}
