export class Common {
  static getID() {
    const ID = Date.now();
    const BUFFER = new ArrayBuffer(4);
    const VIEW = new DataView(BUFFER);
    VIEW.setUint32(0, ID, true);

    return btoa(String.fromCharCode(...new Uint8Array(BUFFER))).slice(0, -2);
  }
}
