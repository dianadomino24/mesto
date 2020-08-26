export default class Api {
    constructor ({baseUrl, headers}) { 
            this.baseUrl = baseUrl;
            this.headers = headers;
    }
        
    getItems (label) {
        return fetch(this.baseUrl.concat(label), {
        headers: this.headers
        })
        .then(res => {
            if (res.ok) {
                return res.json()
            }
            return Promise.reject(`Ошибка: ${res.status}`)
            })
    }
        
    createItem (item, label) { 
        return fetch(this.baseUrl.concat(label), {
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
    
    changeItem  (item, title) {
        return fetch(this.baseUrl.concat(title), {
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
    
    replaceItem  (title, id) {
        return fetch(this.baseUrl.concat(title).concat(`/${id}`), {
            method: 'PUT',
            headers: this.headers,
            // body: JSON.stringify(item)
            })
            .then(res => {
                if (res.ok) {
                    return res.json()
                }
                return Promise.reject(`Ошибка: ${res.status}`)
                })
    }

    deleteItem  (title, id){
        return fetch(this.baseUrl.concat(title).concat(`/${id}`), {
            method: 'DELETE',
            headers: this.headers,
            })
            .then(res => {
                if (res.ok) {
                    return res.json()
                }
                return Promise.reject(`Ошибка: ${res.status}`)
                })
    }
}
        
//  - получить список всех карточек в виде массива (GET)
//  - добавить карточку (POST)
//  - удалить карточку (DELETE)
//  - получить данные пользователя (GET)
//  - заменить данные пользователя (PATCH)
//  - заменить аватар (PATCH)
//  - “залайкать” карточку (PUT)
//  - удалить лайк карточки (DELETE)
