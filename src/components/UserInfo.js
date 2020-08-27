export default class UserInfo {
    constructor(userDataSelectors) {
        this._profileName = document.querySelector(userDataSelectors.name)
        this._profileJob = document.querySelector(userDataSelectors.about)
        this._avatar = userDataSelectors.avatar
    }
    getUserInfo() {
        return {
            name: this._profileName.textContent,
            about: this._profileJob.textContent,
        }
    }
    setUserInfo(newUserData) {
        this._profileName.textContent = newUserData.name
        this._profileJob.textContent = newUserData.about
        if (newUserData.avatar) {
            document.querySelector(
                this._avatar
            ).style.backgroundImage = `url('${newUserData.avatar}')`
        }
    }
}
