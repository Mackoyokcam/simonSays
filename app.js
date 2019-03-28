'use strict';
const hexValues = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e"]
let colorBlocks;
const startButton = document.getElementById('start-button');
const inputNumber = document.getElementById('input-number');
const colorBoxContainer = document.getElementById('color-boxes');
const defaultGameWidth = 900;
const defaultGameHeight = 900;
const rightColor = '#2ECC40';
const wrongColor = '#FF4136';
let blockWidth = 0;
let blockHeight = 0;
let colorSequence = [];
let currentIndex = 0;
let numberOfBlocks = 4;
let opacityDecrement = 0.1;
let standardOpacity = 0.25;
let userCurrentlySelecting = false;

class User {
    name;
    currentScore;
    highScore;

    constructor(name, highScore = 0) {
        this.name = name;
        this.highScore = highScore;
        this.currentScore = 0;
    }
}

function createBlocks() {
    let theDiv;
    for (let i = 0; i < numberOfBlocks; i++) {
        theDiv = document.createElement('div');
        theDiv.id = `${i}`;
        theDiv.className = 'color-box';
        theDiv.style.width = `${blockWidth}px`;
        theDiv.style.height = `${blockHeight}px`;
        theDiv.style.background = getRandomColor();
        colorBoxContainer.append(theDiv);
    }

    colorBlocks = document.getElementsByClassName('color-box');
    console.log('colorblocks', colorBlocks);
}

function deleteBlocks() {
    colorBoxContainer.innerHTML = '';
}

function calculateWidthAndHeight() {
    var numberByNumber = Math.ceil(Math.sqrt(numberOfBlocks));

    blockWidth = Math.floor(defaultGameWidth / numberByNumber) - 10;
    blockHeight = Math.floor(defaultGameHeight / numberByNumber) - 10;
}

function bindEvents() {
    startButton.addEventListener('click', startGame);
    inputNumber.addEventListener('input', changeBlocks);

    // Add event listeners to each color block.
    for (let i = 0; i < colorBlocks.length; i++) {
        colorBlocks[i].addEventListener('click', handleClick);
    }
}

function changeBlocks(event) {
    numberOfBlocks = event.target.value;

    calculateWidthAndHeight();
    deleteBlocks();
    createBlocks();
    bindEvents();
}

/**
 * Event listener for when a user clicks on a color block
 */
function handleClick(event) {
    if (userCurrentlySelecting) {
        let user_input = event.target.id;

        // Correct click
        if (user_input === colorBlocks[colorSequence[currentIndex]].id) {
            console.log('correct!');
            displayColorThenFade(event.target, false);
            currentIndex++;

            if (currentIndex >= colorSequence.length) {
                // Points! Good job!
                userCurrentlySelecting = false;
                shakeAllInSequence();
                currentIndex = 0;
                addRandomNumberToSequence();
                setTimeout(showColorSequenceToPage, 2000);
            }
        }

        // Wrong click
        else {
            displayColorThenFade(event.target, false, wrongColor);
            shake(event.target);
            endGame();
        }
    }
}

/**
 * Event listener for when a user clicks the start button for the game.
 */
function startGame() {
    // Disable start button to prevent spam clicking it and potentially breaking site.
    startButton.disabled = true;
    inputNumber.disabled = true;


    // Add to the sequence
    addRandomNumberToSequence();

    // Show color sequence
    showColorSequenceToPage();
}

/**
 * Fires when user fails to mimic same color sequence with clicks or clicks "end game"
 */
function endGame() {
    // Enable start button
    startButton.disabled = false;
    inputNumber.disabled = false;

    console.log('Wow you suck!');
    currentIndex = 0;
    colorSequence = [];
    userCurrentlySelecting = false;
}


function addRandomNumberToSequence() {
    let randomNumber = Math.floor(Math.random() * numberOfBlocks);

    if (randomNumber === numberOfBlocks) {
        randomNumber = numberOfBlocks - 1;
    }

    colorSequence.push(Math.floor(Math.random() * numberOfBlocks));
}

/**
 * Does the animation of coloring the blocks to show the sequence
 */
function showColorSequenceToPage() {
    removeShake();

    if (currentIndex < colorSequence.length)
        displayColorThenFade(colorBlocks[colorSequence[currentIndex]]);

    else {
        currentIndex = 0;
        userCurrentlySelecting = true;
    }
}

/**
 * Helper function to showColorSequenceToPage to display one block's color, and then fade it away.
 */
function displayColorThenFade(fadeTarget, sequence = true, color = rightColor) {
    fadeTarget.style.opacity = '1';
    let old_background;
    if (!sequence) {
        old_background = fadeTarget.style.background;
        fadeTarget.style.background = color;
    }
    console.log('old_background_before', old_background);

    var fadeEffect = setInterval(function () {
        let opacity = parseFloat(fadeTarget.style.opacity);
        if (opacity > standardOpacity) {
            fadeTarget.style.opacity = `${opacity - opacityDecrement}`;
        } else {
            clearInterval(fadeEffect);

            console.log('old_background_after', old_background);

            if (!sequence) fadeTarget.style.background = old_background;

            if (sequence) {
                // Next color in sequence
                currentIndex++;
                showColorSequenceToPage();
            }
        }
    }, 50);
}

function getRandomColor() {
    var newColor = "#";

    for ( var i = 0; i < 6; i++ ) {
        var x = Math.round( Math.random() * 14 );
        var y = hexValues[x];
        newColor += y;
    }

    return newColor;
}

function shakeAllInSequence() {
    for (let i = 0; i < colorSequence.length; i++) {
        shake(colorBlocks[colorSequence[i]]);
    }
}

function shake(shakeTarget) {
    shakeTarget.classList.add('shake');
}

function removeShake() {
    for (let i = 0; i < colorSequence.length; i++) {
        colorBlocks[colorSequence[i]].classList.remove('shake');
    }
}

calculateWidthAndHeight();
createBlocks();
bindEvents();