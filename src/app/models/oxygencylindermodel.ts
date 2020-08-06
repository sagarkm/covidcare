export interface OxygenCylinders {
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
    id:           ID;
    updated:      ID;
    category:     Category[];
    title:        Title;
    content:      Title;
    link:         Link[];
    "gsx$sr.no.": ID;
    gsx$name:     ID;
    gsx$person:   ID;
    gsx$contact:  ID;
}

export interface Title {
    type: string;
    $t:   string;
}

export interface Link {
    rel:  string;
    type: string;
    href: string;
}
