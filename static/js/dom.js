// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";



export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function(boards){
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {

        let outerHtml = '';
        for(let board of boards){
            let boardHeaderDiv = `
                <section>
                    <div class="board-header"><span data-id="${board.id}" class="board-title">${board.title}</span>
                        <button id="board-add-${board.id}">Create new card</button>
                        <button class="board-toggle" id="board-close-${board.id}"><i class="fas fa-chevron-up"></i></button>
                    </div>
                    <div class="board-columns" id="board-column-${board.id}"></div>
                </section>
            `;
            outerHtml += boardHeaderDiv;
        }
        let boardContainer = document.querySelector('#boards');
        boardContainer.classList.add("board-container");
        boardContainer.innerHTML = '';
        boardContainer.insertAdjacentHTML( 'beforeend', outerHtml);
        // Add event listeners to board titles
        for(let board of boards) {
            let titleSpan = document.querySelector(`span[data-id = "${board.id}"]`);
            let closeBoardBtn = document.querySelector(`#board-close-${board.id}`);
            let boardColumn = document.querySelector(`#board-column-${board.id}`);
            let addCardButton = document.getElementById(`board-add-${board.id}`);
            titleSpan.addEventListener("dblclick", dom.displayInputField);
            closeBoardBtn.addEventListener('click', function() {
                boardColumn.classList.toggle('hidden');
                addCardButton.classList.toggle('hidden');
                (boardColumn.classList.contains('hidden')) ?
                    closeBoardBtn.innerHTML = '<i class="fas fa-chevron-down"></i>' :
                    closeBoardBtn.innerHTML = '<i class="fas fa-chevron-up"></i>'
            });
            dom.loadStatuses(board.id);
        }
    },
    loadStatuses: function (boardId) {
        // retrieves boards and makes showBoards called
        dataHandler.getStatuses(boardId, function(statuses){
            dom.showStatuses(boardId, statuses);
        });
    },
    showStatuses: function(boardId, statuses) {
        let Html = '';
        for (let status of statuses) {
            let statusColumn = document.querySelector(`#board-column-${boardId}`);
            statusColumn.innerHTML = '';
            Html += `<div class="board-column">
                        <div class="board-column-title">${status.title}</div>
                        <div class="board-column-content" id="status-${boardId}-${status.id}"></div>
                    </div>
            `
            statusColumn.innerHTML += Html;
            dom.loadCards(boardId, status.id);
        }
    },
    loadCards: function (boardId, statusId) {
        // retrieves cards and makes showCards called
        dataHandler.getCardsByBoardId(boardId, function(cards){
            dom.showCards(cards, boardId, statusId);
        });
    },
    showCards: function (cards, boardId, statusId) {
        // shows the cards of a board
        // it adds necessary event listeners also
        let statusBody = document.getElementById(`status-${boardId}-${statusId}`);
        statusBody.innerHTML = '';
        let html = '';
        for (let card of cards){
            if (card.status_id === statusId){
                console.log(card.id);
                html += `<div class="card">
                        <div class="card-remove">
                            <i class="fas fa-trash-alt"></i>
                        </div>
                        <div id="card-id-${card.id}" class="card-title">${card.title}</div>
                    </div>`
            }

        }
    statusBody.innerHTML = html;
        //add EventListeners to cards
        for(let card of cards) {
            console.log(card);
            let cardDiv = document.querySelector(`#card-id-${card.id}`);
            console.log(cardDiv);
            console.log(dom.displayCardInputField);
            if (cardDiv){
                cardDiv.addEventListener("dblclick",  dom.displayCardInputField);
            }
        }
    },
    displayInputField: function(event) {
        let currentTitle = this.innerHTML;
        let input = document.createElement("input");
        input.value = currentTitle;
        let saveButton = document.createElement("button");
        saveButton.innerHTML = "Save";
        saveButton.addEventListener("click", dom.saveData);
        this.innerHTML = '';
        this.appendChild(input);
        this.appendChild(saveButton);
    },
    saveData: function(event) {
    let boardId = this.parentElement.dataset.id;
    let newTitle = this.parentElement.firstChild.value;
    dataHandler.modifyBoardTitle(boardId, newTitle);
    dom.displaySpanWithNewTitle(newTitle, this);
    },
    displaySpanWithNewTitle: function(newTitle, domObject){
        domObject.parentElement.innerHTML = newTitle;
    },
    displayCardInputField: function() {
        console.log("ok");
        let currentTitle = this.innerHTML;
        let input = document.createElement("input");
        input.value = currentTitle;
        input.addEventListener("enter", dom.saveCardData);
        this.innerHTML = '';
        this.appendChild(input);
    },
    saveCardData: function() {

    },

};
