export default class Api {
    constructor ({ baseUrl, headers }) { 
            this.baseUrl = baseUrl
            this.headers = headers
    }
        
    getItems () {
        return fetch(this.baseUrl, {
        headers: this.headers
        })
        .then(res => {
            if (res.ok) {
                return res.json()
            }
            return Promise.reject(`Ошибка: ${res.status}`)
            })
    }

    deleteItem (id) {
        return fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        headers: this.headers
        })
        .then(res => {
        if (res.ok) {
            return res.json()
        }
        return Promise.reject(`Ошибка: ${res.status}`)
        })
    }
        
    createItem (item) { // { name: '', src: ''}
        return fetch(this.baseUrl, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(item)
        })
        .then(res => {
            if (res.ok) {
                return res.json()
            }
            return Promise.reject(`Ошибка: ${res.status}`)
            })
    }
    
    changeItem (item) {
        return fetch(this.baseUrl, {
            method: 'PATCH',
            headers: this.headers,
            body: JSON.stringify(item)
            })
            .then(res => {
                if (res.ok) {
                    return res.json()
                }
                return Promise.reject(`Ошибка: ${res.status}`)
                })
    }

    replaceItem (item) {
        return fetch(this.baseUrl, {
            method: 'PUT',
            headers: this.headers,
            body: JSON.stringify(item)
            })
            .then(res => {
                if (res.ok) {
                    return res.json()
                }
                return Promise.reject(`Ошибка: ${res.status}`)
                })
    }

    // getProfileData() {

    // }

    // getAllNeededData () {
    //     return Promise.all([this.getItems(), this.getProfileData()])
    // }

}
        
//  - получить список всех карточек в виде массива (GET)
//  - добавить карточку (POST)
//  - удалить карточку (DELETE)
//  - получить данные пользователя (GET)
//  - заменить данные пользователя (PATCH)
//  - заменить аватар (PATCH)
//  - “залайкать” карточку (PUT)
//  - удалить лайк карточки (DELETE)