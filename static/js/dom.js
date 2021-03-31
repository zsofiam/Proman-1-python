// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
        document.getElementById('refresh').addEventListener('click', dom.refresh);
    },
    refresh: function () {
        dom.loadBoards();
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
            addCardButton.addEventListener('click', function() {
                dom.createCard(`${board.id}`);
            });
            // addCardButton.addEventListener('click', dom.displayInputField);
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
            let title = status.title.toUpperCase();
            Html += `<div class="board-column" data-id="${boardId}">
                        <div class="board-column-title">${title}</div>
                        <div class="board-column-content" id="status-${boardId}-${status.id}"></div>
                    </div>
            `
            statusColumn.innerHTML += Html;
            dom.loadCards(boardId, status.id);
        }
        for (let status of statuses){
            let dropZone = document.querySelector(`#status-${boardId}-${status.id}`);
            dropZone.addEventListener("dragenter", dom.dragEnterCard);
            dropZone.addEventListener("dragover", dom.dragOverCard);
            dropZone.addEventListener("dragleave", dom.dragLeaveCard);
            dropZone.addEventListener("drop", dom.dropCard);
        }
    },
    dragEnterCard: function (e){
            e.preventDefault();

    },
    dragOverCard: function (e){
            e.preventDefault();
    },
    dragLeaveCard: function (e){

    },
    dropCard: function (e){
        let card = document.querySelector(".dragged");
        this.appendChild(card);
        e.preventDefault();
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
                html += `<div id="card-${card.id}" class="card" data-id="${card.id}" draggable="True">
                            <div class="card-remove" id="card-remove-${card.id}">
                                <i class="fas fa-trash-alt"></i>
                            </div>
                            <div data-card-id="${card.id}" class="card-title">${card.title}</div>
                        </div>`
            }
        }
        statusBody.innerHTML = html;
        for (let card of cards){
            dom.addEventListenerToCardForEditing(card.id);

            if (card.status_id === statusId){
                let cardRemoveBtn = document.querySelector(`#card-remove-${card.id}`);
                let draggableCard = document.getElementById(`card-${card.id}`);
                cardRemoveBtn.addEventListener('click', function() {
                    dataHandler.deleteCard(`${card.id}`);
                    dom.loadStatuses(boardId);
                });
                draggableCard.addEventListener("dragstart", dom.startDragCard);
                draggableCard.addEventListener("drag", dom.dragCard);
                draggableCard.addEventListener("dragend", dom.endDragCard);
            }
        }
    },
    startDragCard: function (e){
        e.currentTarget.classList.add("dragged");
        // e.dataTransfer.setData("type/dragged-box", 'dragged');
        e.dataTransfer.setData("text/plain", e.currentTarget.textContent.trim());
        // e.dataTransfer.effectAllowed = "move";
        let zones = document.getElementsByClassName('board-column-content');
        for (let zone of zones) {
            zone.classList.add('drop-zones');
        }
    },
    dragCard: function (e){

    },
    endDragCard: function (e){
        e.currentTarget.classList.remove("dragged");
        e.dataTransfer.clearData();
        let zones = document.getElementsByClassName('board-column-content');
        for (let zone of zones) {
            zone.classList.remove('drop-zones');
        }
    },
    createCard: function(boardId) {
        dataHandler.createNewCard(boardId) ;
        dom.loadStatuses(boardId);
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
        let currentTitle = this.innerHTML;
        let input = document.createElement("input");
        input.value = currentTitle;
        this.innerHTML = '';
        this.appendChild(input);
        let cardId = input.parentElement.dataset.cardId;
        dom.addEventListenersToInputField(input, cardId, currentTitle);
    },
    addEventListenersToInputField: function(input, cardId, currentTitle){
        let enterPressed = false;
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                let newContent = this.value;
                enterPressed = true;
                dataHandler.modifyCardContent(cardId, newContent);
                dom.displayNewCard(cardId, newContent);
            }
            if (e.key === 'Escape') {
                console.log(e.key + " pressed");
                dom.displayNewCard(cardId, currentTitle);
            }
        });
        input.addEventListener('focusout', function (e) {
            console.log(e);
            dom.displayNewCard(cardId, currentTitle, enterPressed);
        });
    },
    addEventListenerToCardForEditing: function(cardId){
            let cardDiv = document.querySelector(`div[data-card-id = "${cardId}"]`);
            if (cardDiv){
                cardDiv.addEventListener("dblclick",  dom.displayCardInputField);
            }
    },
    displayNewCard: function(cardId, newContent, enterPressed) {
        if(!enterPressed){
            let cardDiv = document.querySelector(`div[data-card-id = "${cardId}"]`);
            cardDiv.innerHTML = newContent;
        }

    }
};
