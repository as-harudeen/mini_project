interface Query {
    username?: { $regex: string };
}

interface User {
    username: string;
    isBlocked: boolean;
    _id: string;
}



abstract class PagenationButton {

    abstract fetchData(page?: number): Promise<User[]>;
    abstract buildTable(users: User[]): void;

    limit = 3;
    buttonCount: number = 0;
    pagenationConainer = document.querySelector('.pagenation')! as HTMLDivElement;
    currentButton?: HTMLButtonElement;
    prevButton?: HTMLButtonElement;
    nextButton?: HTMLButtonElement;

    buttonTemplate = document.getElementById('pagenation-btn')! as HTMLTemplateElement;

    buildPagenationBtn(count: number) {
        if (this.buttonCount === count) return;
        this.buttonCount = count;
        this.pagenationConainer.innerHTML = '';
        if (!count) return;
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

    private buildNavigationBtn(type: 'next' | 'prev'): HTMLButtonElement {
        const button = document.importNode(this.buttonTemplate.content, true).firstElementChild! as HTMLButtonElement;
        button.id = `${type}-btn`;
        button.classList.add('btn-dark');
        button.innerText = type;
        return button;
    }

    private buildBtns() {
        for (let i = 1; i <= this.buttonCount; i++) {
            const button = document.importNode(this.buttonTemplate.content, true).firstElementChild! as HTMLButtonElement;
            
            // button.classList.add('page-btn');
            button.innerText = `${i}`;
            if(i === 1){
                this.currentButton = button;
                button.classList.add('btn-outline-dark');
            }
            /**Add Event listener */
            button.addEventListener('click', this.buttonEventHandler.bind(this));
            this.pagenationConainer.appendChild(button);
        }
    }

    private async buttonEventHandler (event: MouseEvent) {
        this.currentButton!.classList.remove('btn-outline-dark');
        (event.target as HTMLButtonElement)!.classList.add('btn-outline-dark');
        this.currentButton = event.target! as HTMLButtonElement;
        /** Navigation disable handle */
        this.navigationDisableHandle();
        /** Invoke fetchData */
        const users: User[] = await this.fetchData(+this.currentButton!.innerText);
        /**call build tbody methods*/
        this.buildTable(users);
    }


    private navigationDisableHandle = () => {
        const currBtnNumber = +this.currentButton!.innerText;

        if(currBtnNumber === 1) this.prevButton!.disabled = true;
        else this.prevButton!.disabled = false;

        if(currBtnNumber === this.buttonCount) this.nextButton!.disabled = true;
        else this.nextButton!.disabled = false;
    }


    private prevButtonClickHandler = () => {
        /**click currBtnNumber - 2 th button*/
        (this.currentButton!.previousElementSibling! as HTMLButtonElement).click();
    }
    
    private nextButtonClickHandler = () => {
        /**click currBtnNumber th button*/
        (this.currentButton!.nextElementSibling! as HTMLButtonElement).click();
    }

}


class UserManagement extends PagenationButton{
    limit: number;
    searchInput = document.getElementById('search')! as HTMLInputElement;
    tbody = document.querySelector('tbody')!;
    searchInputVal = '';

    tableRowTemplate = document.getElementById('table-row')! as HTMLTemplateElement;

    constructor(limit: number) {
        super();
        this.limit = limit;
        this.searchInput.addEventListener('keyup', this.searchEventHandler.bind(this));
        this.buildFirstTime();
    }
    
    async buildFirstTime() {
        this.buildTable(await this.fetchData());
        this.buildPagenationBtn(Math.ceil(await this.totalUserCount() / this.limit));
    }


    buildTable (users: User[]) {
        this.tbody.innerHTML = '';
        for(const user of users){
            const newTableRow = document.importNode(this.tableRowTemplate.content, true).firstElementChild! as HTMLTableRowElement;
            const userNo = newTableRow.firstElementChild! as HTMLTableCellElement;
            userNo.innerText = '1';
            const userNameCol = newTableRow.querySelector('.user-name')! as HTMLTableCellElement;
            userNameCol.innerText = user.username;
            const button = newTableRow.querySelector('.btn')! as HTMLButtonElement;
            button.innerText = user.isBlocked ? 'unblock' : 'block';
            button.addEventListener('click', this.accessControlerHandler.bind(null, user._id))
            this.tbody.appendChild(newTableRow);
        }
    }


    async fetchData(page: number = 1): Promise<User[]> {
        let url = `/admin/get-users?page=${page}&limit=${this.limit}`;
        if (this.searchInputVal) {
            const query: Query = {};
            query.username = { $regex: `^${this.searchInputVal}` };
            url += `&query=${JSON.stringify(query)}`;
        }

        const response = await fetch(url, { method: 'GET'});
        const users = await response.json();
        return users as User[];
    }

    async searchEventHandler() {
        this.searchInputHandler();
        const totalUser = await this.totalUserCount();
        this.buildPagenationBtn(Math.ceil(totalUser / this.limit));
        const users = await this.fetchData();
        this.buildTable(users);
    }

    private async accessControlerHandler (userId: string, event: MouseEvent) {
        const button = (event.currentTarget! as HTMLButtonElement);
        const res = await fetch(`/admin/${button.innerText}/${userId}`, {method: 'PUT'})
        if(res.ok){
            button.innerText == 'block' ? button.innerText = 'unblock' : button.innerText = 'block';
        }
    }

    private async totalUserCount(): Promise<number> {
        const option = { username: { $regex: `^${this.searchInputVal}` } };
        //fetching count of total user
        const res = await fetch(`/api/doc_count/users?option=${JSON.stringify(option)}`, {
            method: 'GET'
        })
        const count = await res.text();
        return +count;
    }

    private searchInputHandler = () => {
        this.searchInputVal = this.searchInput.value.trim();
    }
}


const userManagement = new UserManagement(3);


