/**
 * Handles the saving and loading of tunes from saved-tunes.json.
 */
export default class TuneFileManager {

    static savedTunesLocation = '/saved-tunes.json '
    static tunes = {};

    /** Loads in tracks */
    static async init() {
        return await fetch('http://localhost:5000/load-tunes')
            .then((res) => res.json())
            .then((data) => this.tunes = data)
            .then(() => { return true; } )
            .catch((err) => console.log(err));
    };

    static getTunes() {
        return this.tunes;
    };

    /** Updates tunes and writes to saved-tune.json */
    static async saveTune(updatedTunes) {
        if (updatedTunes) {
            this.tunes = updatedTunes;
            let result = await fetch('http://localhost:5000/update-tunes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(this.tunes)})
                .then((res) => res.json())
                .catch((error) => console.log(error));
            
            return await result;
        }
    };
    
}