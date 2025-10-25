// TODO: Handle JSON save/load.. no idea why the fetch isn't working..
export default class TuneFileManager {

    static savedTunesLocation = '/saved-tunes.json '
    static tunes = {};

    static init() {
        fetch(this.savedTunesLocation)
            .then((res) => { res.json(); })
            .then((data) => { this.tunes = data; })
    }

    static getTunes() {
        return this.tunes
    }
    
}