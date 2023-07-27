"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class PagenationButton {
    constructor() {
        this.limit = 3;
        this.buttonCount = 0;
        this.pagenationConainer = document.querySelector('.pagenation');
        this.buttonTemplate = document.getElementById('pagenation-btn');
        this.navigationDisableHandle = () => {
            const currBtnNumber = +this.currentButton.innerText;
            if (currBtnNumber === 1)
                this.prevButton.disabled = true;
            else
                this.prevButton.disabled = false;
            if (currBtnNumber === this.buttonCount)
                this.nextButton.disabled = true;
            else
                this.nextButton.disabled = false;
        };
        this.prevButtonClickHandler = () => {
            /**click currBtnNumber - 2 th button*/
            this.currentButton.previousElementSibling.click();
        };
        this.nextButtonClickHandler = () => {
            /**click currBtnNumber th button*/
            this.currentButton.nextElementSibling.click();
        };
    }
    buildPagenationBtn(count) {
        if (this.buttonCount === count)
            return;
        this.buttonCount = count;
        this.pagenationConainer.innerHTML = '';
        if (!count)
            return;
        this.prevButton = this.buildNavigationBtn('prev');
        /*Add Event listener for prev button */
        this.prevButton.addEventListener('click', this.prevButtonClickHandler);
        this.pagenationConainer.appendChild(this.prevButton);
        this.buildBtns();
        this.nextButton = this.buildNavigationBtn('next');
        /*Add Event listener for next button */
        this.nextButton.addEventListener('click', this.nextButtonClickHandler);
        this.pagenationConainer.appendChild(this.nextButton);
        this.navigationDisableHandle();
    }
    buildNavigationBtn(type) {
        const button = document.importNode(this.buttonTemplate.content, true).firstElementChild;
        button.id = `${type}-btn`;
        button.classList.add('btn-dark');
        button.innerText = type;
        return button;
    }
    buildBtns() {
        for (let i = 1; i <= this.buttonCount; i++) {
            const button = document.importNode(this.buttonTemplate.content, true).firstElementChild;
            // button.classList.add('page-btn');
            button.innerText = `${i}`;
            if (i === 1) {
                this.currentButton = button;
                button.classList.add('btn-outline-dark');
            }
            /**Add Event listener */
            button.addEventListener('click', this.buttonEventHandler.bind(this));
            this.pagenationConainer.appendChild(button);
        }
    }
    buttonEventHandler(event) {
        return __awaiter(this, void 0, void 0, function* () {
            this.currentButton.classList.remove('btn-outline-dark');
            event.target.classList.add('btn-outline-dark');
            this.currentButton = event.target;
            /** Navigation disable handle */
            this.navigationDisableHandle();
            /** Invoke fetchData */
            const users = yield this.fetchData(+this.currentButton.innerText);
            /**call build tbody methods*/
            this.buildTable(users);
        });
    }
}
class UserManagement extends PagenationButton {
    constructor(limit) {
        super();
        this.searchInput = document.getElementById('search');
        this.tbody = document.querySelector('tbody');
        this.searchInputVal = '';
        this.tableRowTemplate = document.getElementById('table-row');
        this.searchInputHandler = () => {
            this.searchInputVal = this.searchInput.value.trim();
        };
        this.limit = limit;
        this.searchInput.addEventListener('keyup', this.searchEventHandler.bind(this));
        this.buildFirstTime();
    }
    buildFirstTime() {
        return __awaiter(this, void 0, void 0, function* () {
            this.buildTable(yield this.fetchData());
            this.buildPagenationBtn(Math.ceil((yield this.totalUserCount()) / this.limit));
        });
    }
    buildTable(users) {
        this.tbody.innerHTML = '';
        for (const user of users) {
            const newTableRow = document.importNode(this.tableRowTemplate.content, true).firstElementChild;
            const userNo = newTableRow.firstElementChild;
            userNo.innerText = '1';
            const userNameCol = newTableRow.querySelector('.user-name');
            userNameCol.innerText = user.username;
            const button = newTableRow.querySelector('.btn');
            button.innerText = user.isBlocked ? 'unblock' : 'block';
            button.addEventListener('click', this.accessControlerHandler.bind(null, user._id));
            this.tbody.appendChild(newTableRow);
        }
    }
    fetchData(page = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `/admin/get-users?page=${page}&limit=${this.limit}`;
            if (this.searchInputVal) {
                const query = {};
                query.username = { $regex: `^${this.searchInputVal}` };
                url += `&query=${JSON.stringify(query)}`;
            }
            const response = yield fetch(url, { method: 'GET' });
            const users = yield response.json();
            return users;
        });
    }
    searchEventHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            this.searchInputHandler();
            const totalUser = yield this.totalUserCount();
            this.buildPagenationBtn(Math.ceil(totalUser / this.limit));
            const users = yield this.fetchData();
            this.buildTable(users);
        });
    }
    accessControlerHandler(userId, event) {
        return __awaiter(this, void 0, void 0, function* () {
            const button = event.currentTarget;
            const res = yield fetch(`/admin/${button.innerText}/${userId}`, { method: 'PUT' });
            if (res.ok) {
                button.innerText == 'block' ? button.innerText = 'unblock' : button.innerText = 'block';
            }
        });
    }
    totalUserCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const option = { username: { $regex: `^${this.searchInputVal}` } };
            //fetching count of total user
            const res = yield fetch(`/api/doc_count/users?option=${JSON.stringify(option)}`, {
                method: 'GET'
            });
            const count = yield res.text();
            return +count;
        });
    }
}
const userManagement = new UserManagement(3);
