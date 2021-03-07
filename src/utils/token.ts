import { LocalStorage, SessionStorage } from "quasar"

type IStorage = LocalStorage | SessionStorage

class Token {
    constructor(private name: string, private storage: IStorage) {
    }
    
    exists(): boolean {
        return this.storage.has(this.name)
    }
    
    set(token: string/*, expires: number*/): void {
        this.storage.set(this.name, token)
    }
    
    get(): string {
        if (!this.exists()) throw `${ this.name } is not exists`
        return this.storage.getItem<string>(this.name)!
    }
    
    remove(): void {
        this.storage.remove(this.name)
    }
    
    bearer() {
        return {
            "Authorization": `Bearer ${ this.get() }`
        }
    }
}

export const AccessToken = new Token("access_token", SessionStorage)
export const RefreshToken = new Token("refresh_token", LocalStorage)
