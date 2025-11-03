// TODO: Handle JSON save/load.. no idea why the fetch isn't working..
export default class TuneFileManager {

    static savedTunesLocation = '/saved-tunes.json '
    static tunes = {};

    static async init() {
        await fetch(this.savedTunesLocation)
            .then((res) => res.json())
            .then((data) => this.tunes = data)
            .then(() => { return true; } );
    }

    static getTunes() {
        return this.tunes;
    }
    
}