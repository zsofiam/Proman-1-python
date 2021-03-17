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
        let outerHtml = document.createElement('ul');
        outerHtml.classList.add("board-container");
        for(let board of boards){
            let li = document.createElement('li');
            li.innerHTML = board.title;
            li.dataset.Id = board.id;
            li.addEventListener("dblclick", dom.displayInputField);
            outerHtml.appendChild(li);
        }
        let boardsContainer = document.querySelector('#boards');
        boardsContainer.innerHTML = '';
        boardsContainer.appendChild(outerHtml);
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
    let boardId = this.parentElement.dataset.Id;
    let newTitle = this.parentElement.firstChild.value;
    dataHandler.modifyBoardTitle(boardId, newTitle);
    dom.displayLiWithNewTitle(newTitle, this);
    },
    displayLiWithNewTitle: function(newTitle, domObject){
        domObject.parentElement.innerHTML = newTitle;
    }


};
