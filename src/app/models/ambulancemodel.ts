export interface Ambulances {
    version:  string;
    encoding: string;
    feed:     Feed;
}

export interface Feed {
    xmlns:                   string;
    xmlns$openSearch:        string;
    xmlns$gsx:               string;
    id:                      ID;
    updated:                 ID;
    category:                Category[];
    title:                   Title;
    link:                    Link[];
    author:                  Author[];
    openSearch$totalResults: ID;
    openSearch$startIndex:   ID;
    entry:                   Entry[];
}

export interface Author {
    name:  ID;
    email: ID;
}

export interface ID {
    $t: string;
}

export interface Category {
    scheme: string;
    term:   string;
}

export interface Entry {
    id:            ID;
    updated:       ID;
    category:      Category[];
    title:         Title;
    content:       Title;
    link:          Link[];
    "gsx$sr.no.":  ID;
    gsx$ambulance: ID;
    gsx$person:    ID;
    gsx$contact:   ID;
    gsx$address:   ID;
}

export interface Title {
    type: TitleType;
    $t:   string;
}

export enum TitleType {
    Text = "text",
}

export interface Link {
    rel:  string;
    type: LinkType;
    href: string;
}

export enum LinkType {
    ApplicationAtomXML = "application/atom+xml",
}
