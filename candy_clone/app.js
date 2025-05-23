document.addEventListener('DOMContentLoaded', () => {
const grid = document.querySelector('.grid')
const scoreDisplay = document.getElementById('score')
const width = 8
const squares = []
let score = 0
let isRemoving = false;

const candyColors = [
    'url(images/foto_final_1.png)',
    'url(images/foto_final_2.png)',
    'url(images/foto_final_3.png)',
    'url(images/foto_final_4.png)',
    'url(images/purple-candy.png)',
    'url(images/red-candy.png)'
  ]

//create your board
function createBoard() {
  for (let i = 0; i < width * width; i++) {
    const square = document.createElement('div');
    square.setAttribute('draggable', true);
    square.setAttribute('id', i);
    let randomColor = Math.floor(Math.random() * candyColors.length);
    square.style.backgroundImage = candyColors[randomColor];
    grid.appendChild(square);
    squares.push(square);
    // Attach touch events for mobile swipe
    square.addEventListener('touchstart', handleTouchStart, {passive: false});
    square.addEventListener('touchmove', handleTouchMove, {passive: false});
    square.addEventListener('touchend', handleTouchEnd, {passive: false});
  }
}
createBoard();

// Prevent default touch behaviors globally
document.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

document.addEventListener('touchstart', function(e) {
    e.preventDefault();
}, { passive: false });

// Prevent double-tap zoom
document.addEventListener('touchend', function(e) {
    e.preventDefault();
}, { passive: false });

// Touch swipe logic for mobile
let touchStartX, touchStartY, touchEndX, touchEndY;
let touchStartId = null;

function handleTouchStart(e) {
    e.preventDefault();
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartId = parseInt(this.id);
}

function handleTouchMove(e) {
    e.preventDefault();
    touchEndX = e.touches[0].clientX;
    touchEndY = e.touches[0].clientY;
}

function handleTouchEnd(e) {
    e.preventDefault();
    if (touchStartId === null) return;

    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    const minSwipe = 30; // Minimum swipe distance in px

    let targetId = null;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > minSwipe) {
        // Horizontal swipe
        if (dx > 0 && (touchStartId % width) < width - 1) {
            targetId = touchStartId + 1; // right
        } else if (dx < 0 && (touchStartId % width) > 0) {
            targetId = touchStartId - 1; // left
        }
    } else if (Math.abs(dy) > minSwipe) {
        // Vertical swipe
        if (dy > 0 && touchStartId + width < width * width) {
            targetId = touchStartId + width; // down
        } else if (dy < 0 && touchStartId - width >= 0) {
            targetId = touchStartId - width; // up
        }
    }

    if (targetId !== null) {
        swapSquares(touchStartId, targetId);
        if (!matchExists()) {
            swapSquares(touchStartId, targetId); // revert if no match
            squares[touchStartId].style.animation = 'shake 0.3s';
            setTimeout(() => squares[touchStartId].style.animation = '', 300);
        }
    }

    touchStartId = null;
}

// Helper to swap two squares
function swapSquares(id1, id2) {
    const temp = squares[id1].style.backgroundImage;
    squares[id1].style.backgroundImage = squares[id2].style.backgroundImage;
    squares[id2].style.backgroundImage = temp;
}

// Helper: check for row of three
function isRowOfThree() {
    for (let i = 0; i < 61; i++) {
        let rowOfThree = [i, i+1, i+2];
        let decidedColor = squares[i].style.backgroundImage;
        const decidedImage = decidedColor.replace(/url\("|"\)/g, '').split('/').pop();
        const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
        if (notValid.includes(i)) continue;
        if(rowOfThree.every(index => {
            const currentImage = squares[index].style.backgroundImage.replace(/url\("|"\)/g, '').split('/').pop();
            const isBlank = currentImage === '' || currentImage === undefined;
            return currentImage === decidedImage && !isBlank;
        })) return true;
    }
    return false;
}

// Helper: check for column of three
function isColumnOfThree() {
    for (let i = 0; i < 47; i++) {
        let columnOfThree = [i, i+width, i+width*2];
        let decidedColor = squares[i].style.backgroundImage;
        const decidedImage = decidedColor.replace(/url\("|"\)/g, '').split('/').pop();
        if(columnOfThree.every(index => {
            const currentImage = squares[index].style.backgroundImage.replace(/url\("|"\)/g, '').split('/').pop();
            const isBlank = currentImage === '' || currentImage === undefined;
            return currentImage === decidedImage && !isBlank;
        })) return true;
    }
    return false;
}

// Helper: check for row of four
function isRowOfFour() {
    for (let i = 0; i < 60; i++) {
        let rowOfFour = [i, i+1, i+2, i+3];
        let decidedColor = squares[i].style.backgroundImage;
        const decidedImage = decidedColor.replace(/url\("|"\)/g, '').split('/').pop();
        const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55];
        if (notValid.includes(i)) continue;
        if(rowOfFour.every(index => {
            const currentImage = squares[index].style.backgroundImage.replace(/url\("|"\)/g, '').split('/').pop();
            const isBlank = currentImage === '' || currentImage === undefined;
            return currentImage === decidedImage && !isBlank;
        })) return true;
    }
    return false;
}

// Helper: check for column of four
function isColumnOfFour() {
    for (let i = 0; i < 39; i++) {
        let columnOfFour = [i, i+width, i+width*2, i+width*3];
        let decidedColor = squares[i].style.backgroundImage;
        const decidedImage = decidedColor.replace(/url\("|"\)/g, '').split('/').pop();
        if(columnOfFour.every(index => {
            const currentImage = squares[index].style.backgroundImage.replace(/url\("|"\)/g, '').split('/').pop();
            const isBlank = currentImage === '' || currentImage === undefined;
            return currentImage === decidedImage && !isBlank;
        })) return true;
    }
    return false;
}

// Update matchExists to use helpers
function matchExists() {
    return isRowOfThree() || isColumnOfThree() || isRowOfFour() || isColumnOfFour();
}

function dragDrop() {
    colorBeingReplaced = this.style.backgroundImage;
    squareIdBeingReplaced = parseInt(this.id);
    // Do not swap here!
}

function dragEnd() {
    isDragging = false;
    let validMoves = [squareIdBeingDragged -1 , squareIdBeingDragged -width, squareIdBeingDragged +1, squareIdBeingDragged +width];
    let validMove = validMoves.includes(squareIdBeingReplaced);
    if (squareIdBeingDragged !== null && squareIdBeingReplaced !== null && validMove) {
        swapSquares(squareIdBeingDragged, squareIdBeingReplaced);
        if (!matchExists()) {
            swapSquares(squareIdBeingDragged, squareIdBeingReplaced); // revert immediately
            squares[squareIdBeingDragged].style.animation = 'shake 0.3s';
            setTimeout(() => squares[squareIdBeingDragged].style.animation = '', 300);
        }
    }
    squareIdBeingDragged = null;
    squareIdBeingReplaced = null;
}

//drop candies once some have been cleared
function moveIntoSquareBelow() {
    let moved = true;
    while (moved) {
        moved = false;
        for (i = 0; i < 55; i ++) {
            if(squares[i + width].style.backgroundImage === '') {
                squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;
                squares[i].style.backgroundImage = '';
                moved = true;
                const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
                const isFirstRow = firstRow.includes(i);
                if (isFirstRow && (squares[i].style.backgroundImage === '')) {
                  let randomColor = Math.floor(Math.random() * candyColors.length);
                  squares[i].style.backgroundImage = candyColors[randomColor];
                }
            }
        }
    }
}

// Animate removal in all match functions
function animateRemove(index) {
    isRemoving = true;
    squares[index].style.transition = 'opacity 0.3s, transform 0.3s';
    squares[index].style.opacity = '0';
    squares[index].style.transform = 'scale(0)';
    setTimeout(() => {
        squares[index].style.backgroundImage = '';
        squares[index].style.opacity = '1';
        squares[index].style.transform = 'scale(1)';
        squares[index].style.transition = '';
    }, 300);
}

// Helper to check if any removals are happening
function anyRemovals() {
    return Array.from(squares).some(square => square.style.opacity === '0');
}

// Update all match functions to use animateRemove
function checkRowForFour() {
    for (i = 0; i < 60; i ++) {
      let rowOfFour = [i, i+1, i+2, i+3];
      let decidedColor = squares[i].style.backgroundImage;
      const decidedImage = decidedColor.replace(/url\("|"\)/g, '').split('/').pop();
      const notValid = [5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55];
      if (notValid.includes(i)) continue;
      if(rowOfFour.every(index => {
          const currentImage = squares[index].style.backgroundImage.replace(/url\("|"\)/g, '').split('/').pop();
          const isBlank = currentImage === '' || currentImage === undefined;
          return currentImage === decidedImage && !isBlank;
      })) {
        score += 4;
        scoreDisplay.innerHTML = score;
        rowOfFour.forEach(index => {
          animateRemove(index);
        });
      }
    }
  }

function checkColumnForFour() {
    for (i = 0; i < 39; i ++) {
      let columnOfFour = [i, i+width, i+width*2, i+width*3];
      let decidedColor = squares[i].style.backgroundImage;
      const decidedImage = decidedColor.replace(/url\("|"\)/g, '').split('/').pop();
      if(columnOfFour.every(index => {
          const currentImage = squares[index].style.backgroundImage.replace(/url\("|"\)/g, '').split('/').pop();
          const isBlank = currentImage === '' || currentImage === undefined;
          return currentImage === decidedImage && !isBlank;
      })) {
        score += 4;
        scoreDisplay.innerHTML = score;
        columnOfFour.forEach(index => {
          animateRemove(index);
        });
      }
    }
  }

function checkRowForThree() {
    for (i = 0; i < 61; i ++) {
      let rowOfThree = [i, i+1, i+2];
      let decidedColor = squares[i].style.backgroundImage;
      const decidedImage = decidedColor.replace(/url\("|"\)/g, '').split('/').pop();
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
      if (notValid.includes(i)) continue;
      if(rowOfThree.every(index => {
          const currentImage = squares[index].style.backgroundImage.replace(/url\("|"\)/g, '').split('/').pop();
          const isBlank = currentImage === '' || currentImage === undefined;
          return currentImage === decidedImage && !isBlank;
      })) {
        score += 3;
        scoreDisplay.innerHTML = score;
        rowOfThree.forEach(index => {
          animateRemove(index);
        });
      }
    }
  }

function checkColumnForThree() {
    for (i = 0; i < 47; i ++) {
      let columnOfThree = [i, i+width, i+width*2];
      let decidedColor = squares[i].style.backgroundImage;
      const decidedImage = decidedColor.replace(/url\("|"\)/g, '').split('/').pop();
      if(columnOfThree.every(index => {
          const currentImage = squares[index].style.backgroundImage.replace(/url\("|"\)/g, '').split('/').pop();
          const isBlank = currentImage === '' || currentImage === undefined;
          return currentImage === decidedImage && !isBlank;
      })) {
        score += 3;
        scoreDisplay.innerHTML = score;
        columnOfThree.forEach(index => {
          animateRemove(index);
        });
      }
    }
  }

// Checks carried out indefinitely
window.setInterval(() => {
  if (!isRemoving) {
    let removed = false;
    checkRowForFour();
    checkColumnForFour();
    checkRowForThree();
    checkColumnForThree();
    // If any removals happened, wait for animation before gravity
    if (anyRemovals()) {
      isRemoving = true;
      setTimeout(() => {
        moveIntoSquareBelow();
        isRemoving = false;
      }, 300);
    } else {
      moveIntoSquareBelow();
    }
  }
}, 300);
})
