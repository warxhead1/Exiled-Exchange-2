import { BrowserWindow } from 'electron'
import type { ServerEvents } from '../server'
import type { Logger } from '../RemoteLogger'

interface POECookie {
  value: string
}

export class AuthWindow {
  private window: Electron.BrowserWindow | null = null

  constructor (
    private server: ServerEvents,
    private logger: Logger
  ) {
    server.onEventAnyClient('CLIENT->MAIN::request-auth', () => {
      this.openAuthWindow()
    })
  }

  private async openAuthWindow () {
    if (this.window) {
      this.window.focus()
      return
    }

    this.window = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: false
      }
    })

    // Add error handling and retry logic
    const tryLoadPage = async (retries = 3) => {
      try {
        await this.window!.loadURL('https://www.pathofexile.com/login')
        
        // Check for cookies after any navigation
        const handleNavigation = async (_event: Electron.Event, _url: string) => {
          try {
            // Get cookies after navigation
            const cookies = await this.window!.webContents.session.cookies.get({
              domain: '.pathofexile.com',
              name: 'POESESSID'
            })

            const poeCookies = cookies as unknown as POECookie[]
            if (poeCookies && poeCookies.length > 0) {
              this.logger.write('info [Auth] Successfully obtained POESESSID')
              this.server.sendEventTo('broadcast', {
                name: 'MAIN->CLIENT::auth-complete',
                payload: { poesessid: poeCookies[0].value }
              })
              this.window!.close()
              this.window = null
            }
          } catch (err) {
            this.logger.write(`Cookie extraction error: ${err}`)
          }
        }

        this.window!.webContents.on('did-navigate', handleNavigation)
      } catch (err) {
        this.logger.write(`Auth window error: ${err}`)
        if (retries > 0 && this.window) {
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 1000))
          await tryLoadPage(retries - 1)
        }
      }
    }

    await tryLoadPage()

    this.window.on('closed', () => {
      this.window = null
    })
  }
} 