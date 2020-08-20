export default class UserInfo {
    constructor(userDataSelectors) {
        this._profileName = document.querySelector(userDataSelectors.name);
        this._profileJob = document.querySelector(userDataSelectors.about);
    }
    getUserInfo() {
        return {name: this._profileName.textContent, about: this._profileJob.textContent}
    }
    setUserInfo(newUserData) {
        this._profileName.textContent = newUserData.name;
        this._profileJob.textContent = newUserData.about;
    }
}
