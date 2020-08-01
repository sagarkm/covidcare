export interface Hospitals {
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
    id:                 ID;
    updated:            ID;
    category:           Category[];
    title:              Title;
    content:            Title;
    link:               Link[];
    "gsx$sr.no.":       ID;
    gsx$ward:           ID;
    gsx$servicetype:    ID;
    gsx$nameofhospital: ID;
    gsx$category:       ID;
    gsx$address:        ID;
    gsx$pincode:        ID;
    gsx$latlong:        ID;
    "gsx$no.ofbeds":    ID;
    gsx$contactname:    ID;
    gsx$contactnumber:  ID;
    gsx$emailid:        ID;
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
