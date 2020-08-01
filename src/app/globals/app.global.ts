
export class AppGlobals {
  public static API_ENDPOINT = (sheet: string) => `https://spreadsheets.google.com/feeds/list/1TeqomeWJrgGnS9zfc1eZaA3EpHPvnZUcLlEZdFdmbxc/${sheet}/public/full?alt=json`
  public static TEL_TO = (num: string) => `tel://${num}`
  public static EMAIL_TO = (email: string) => `mailto:${email}?subject=Covid%20Care`
  public static API_TIMEOUT: number = 60000
  public static API_RETRY_COUNT: number = 2
  public static CITY_SUPPORT: string = 'Currently we support only Mumbai !!'    
  public static ALERT_TITLE: string = 'Covid Care'
  public static ALERT_CLOSE_APP: string = 'Are you sure you want to quit the app ?'
  public static ALERT_CALL: string = 'Are you sure you want to call this number ?'
  public static ALERT_EMAIL: string = 'Are you sure you want to send the email ?'
  public static NO_NETWORK: string = 'Please check your network connection and try again.'
}

