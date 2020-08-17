
export class AppGlobals {
  public static API_ENDPOINT = (sheet: string) => `https://spreadsheets.google.com/feeds/list/1TeqomeWJrgGnS9zfc1eZaA3EpHPvnZUcLlEZdFdmbxc/${sheet}/public/full?alt=json`
  public static TEL_TO = (num: string) => `tel://${num}`
  public static EMAIL_TO = (email: string) => `mailto:${email}?subject=Covid%20Care`
  public static ALERT_CALL = (recipient: string) => `Call ${recipient} ?`
  public static ALERT_EMAIL = (recipient: string) => `Email ${recipient} ?`
  public static ALERT_MAP = (recipient: string) => `Map ${recipient} ?`
  public static API_TIMEOUT: number = 60000
  public static API_RETRY_COUNT: number = 2
  public static DISLAIMER: string = 'Information contained in this app is gathered from official websites and trusted sources. While we have taken every precaution to ensure that it is current and accurate, given the dynamic nature of the data it may not be accurate at times. For the latest information, we advise you to call control room of your ward.'  
  public static DEBOUNCE: string = '200'  
  public static NO_RESULTS: string = 'No Results'  
  public static CITY_SUPPORT: string = 'Currently we support only Mumbai !!'    
  public static ALERT_TITLE: string = 'Covid Care'
  public static ALERT_CLOSE_APP: string = 'Are you sure you want to quit the app ?'
  public static NO_NETWORK: string = 'Please check your network connection and try again.'
}

