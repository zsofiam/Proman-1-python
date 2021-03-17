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
                        <button class="board-add">Add Card</button>
                        <button class="board-toggle"><i class="fas fa-chevron-down"></i></button>
                    </div>
                    <div class="board-columns" id="board-column-${board.id}"></div>
                </section><br>
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
            titleSpan.addEventListener("dblclick", dom.displayInputField);
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
                        <div class="board-column-content"></div>
                    </div>
            `
            statusColumn.innerHTML += Html;
        }
    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
        // dataHandler.getCardsByBoardId(boardId, function(cards){
        //     dom.showCards(cards);
        // });
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
        // let cardList = '';
        //
        // for(let card of cards){
        //     cardList += `
        //         <li>${card.title}</li>
        //     `;
        // }
        //
        // const outerHtml = `
        //     <ul class="card-container">
        //         ${cardList}
        //     </ul>
        // `;
        //
        // let cardsContainer = document.querySelector('#cards');
        // cardsContainer.innerHTML = '';
        // cardsContainer.insertAdjacentHTML("beforeend", outerHtml);
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
    // showStatusesOnBoard: async function() {
    //     let statuses = await dataHandler.getStatuses()
    //     .then(statuses => {
    //         let Html = '';
    //         for (let status of statuses) {
    //             console.log(status.title);
    //             Html += `<div class="board-columns">
    //             <div class="board-column">
    //                 <div class="board-column-title">${status.title}</div>
    //                 <div class="board-column-content">
    //
    //                 </div>
    //             </div>`
    //         }
    //         return Html;
    //     })
    // }

};
